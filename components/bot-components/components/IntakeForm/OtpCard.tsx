import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import ReCAPTCHA from "react-google-recaptcha";
import { RECAPTCHA_SITE_KEY } from "../../../../services/constants";
import * as authaction from "../../../../store/actions/auth";
import * as otpaction from "../../../../store/actions/getOtp";
import { getCountryCodes } from "../../../../store/actions/countryCodes";
import { countryKeyFromLocation } from "../../../../services/userLocationBootstrap";
import { useAnalytics } from "../../../../hooks/useAnalytics";
import CountryCodeDropdown from "../../../userauth/CountryDropdown";

interface OtpCardProps {
  /** Fired once after a successful verify (token present in auth state). */
  onVerified: () => void;
  /** Fired when the user chooses to skip signing in ("Skip login"). Lets the
   *  parent resume the chat as a logged-out (opted-out) user. Omit to hide the
   *  skip link entirely. */
  onSkip?: () => void;
  /** Optional copy overrides so the same card can serve the intake-save flow
   *  and a mid-chat `prompt_login` sign-in. */
  heading?: string;
  submitLabel?: string;
}

/**
 * Inline phone + WhatsApp-OTP card injected into the chat after the intake form
 * completes for logged-out users. Reuses the app's real OTP backend via the
 * `getotp` and `auth` thunks plus an invisible reCAPTCHA, and the shared
 * `CountryCodeDropdown` so non-India numbers work too (mirrors BotLoginModal).
 */
const OtpCard: React.FC<OtpCardProps> = ({
  onVerified,
  onSkip,
  heading = "Save our work",
  submitLabel = "Send OTP & Start",
}) => {
  const dispatch = useDispatch();
  const { trackUserLogin } = useAnalytics();
  const recaptchaRef = useRef<any>(null);
  const verifiedFiredRef = useRef(false);
  // The last 4-digit code we've already submitted for verification. Guards the
  // auto-submit so a re-fired input event (mobile OTP autofill, IME, a stray
  // keystroke while the request is in flight) can't post the same OTP twice —
  // the second call consumes the now-used code and returns a spurious
  // "code didn't match" *after* the first call already logged the user in.
  const submittedCodeRef = useRef<string | null>(null);

  const otpSent = useSelector((s: any) => s.auth?.otpSent);
  const loading = useSelector((s: any) => s.auth?.loading);
  const otpFail = useSelector((s: any) => s.auth?.otpFail);
  const mobileFail = useSelector((s: any) => s.auth?.mobileFail);
  const mobilefailmessage = useSelector((s: any) => s.auth?.mobilefailmessage);
  const emailFail = useSelector((s: any) => s.auth?.emailFail);
  const emailfailmessage = useSelector((s: any) => s.auth?.emailfailmessage);
  const newUser = useSelector((s: any) => s.auth?.newUser);
  const token = useSelector((s: any) => s.auth?.token);
  const CountryCodes = useSelector((s: any) => s.CountryCodes);
  // Visitor's IP-resolved location (bootstrapped once in _app). Used to preselect
  // the country code so international users don't have to change it from India.
  const userLocation = useSelector((s: any) => s.UserLocation?.location);

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  // OTP delivery channel — WhatsApp by default, SMS when the box is unchecked.
  const [whatsapp, setWhatsapp] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [extension, setExtension] = useState("India");
  // Once the user picks a country themselves, stop auto-overriding it from IP.
  const countryTouchedRef = useRef(false);
  const [openCountryCodeOption, setOpenCountryCodeOption] = useState(false);
  // Resend cooldown — starts at 30s each time an OTP is sent (mirrors
  // BotLoginModal). `otpResent` is toggled on every resend to re-arm the timer
  // effect even though `otpSent` stays true across resends.
  const [counter, setCounter] = useState(30);
  const [otpResent, setOtpResent] = useState(false);
  // The phone-field row we anchor the country dropdown to. The dropdown is
  // portaled to <body> so the chat's `overflow` scroll area can't clip it, so
  // we measure the row and position the (fixed) dropdown right below it — same
  // look as an inline anchored menu, but immune to the clipping.
  const fieldRowRef = useRef<HTMLDivElement>(null);
  const [dropdownPos, setDropdownPos] = useState<{
    top: number;
    left: number;
  } | null>(null);
  // New users get a dedicated name + email screen after the OTP is entered
  // (mirrors BotLoginModal's details step) instead of an inline name field.
  const [userDetailsRequired, setUserDetailsRequired] = useState(false);
  const [userNameError, setUserNameError] = useState(false);

  // Pull the dial-code list once, the same way BotLoginModal does. Also reset
  // any stale login state so a freshly-mounted card always starts at the
  // phone-entry step. Without this, a new chat opened while a previous,
  // abandoned login left `otpSent: true` in redux would drop the user straight
  // onto the OTP screen with no valid code to enter.
  useEffect(() => {
    dispatch(authaction.authResetLogin() as any);
    dispatch(getCountryCodes() as any);
  }, [dispatch]);

  // Preselect the country code from the visitor's IP location (resolved into
  // redux by _app's bootstrap). Only applies until the user picks a country
  // themselves, and only when the location maps to a known dial code — otherwise
  // the default India stays.
  useEffect(() => {
    if (countryTouchedRef.current) return;
    const key = countryKeyFromLocation(userLocation, CountryCodes);
    if (key) setExtension(key);
  }, [userLocation, CountryCodes]);

  // A failed verify re-enables a fresh submit of the same digits (e.g. after a
  // network blip) by clearing the dedup guard.
  useEffect(() => {
    if (otpFail) submittedCodeRef.current = null;
  }, [otpFail]);

  // Resend cooldown: (re)start the 30s countdown whenever an OTP is sent or
  // resent. Re-armed by `otpResent` since `otpSent` alone doesn't change on a
  // resend. (Mirrors BotLoginModal's resend timer.)
  useEffect(() => {
    if (!otpSent) return;
    setCounter(30);
    const timer = setInterval(() => {
      setCounter((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [otpSent, otpResent]);

  const minutes = String(Math.floor(counter / 60)).padStart(2, "0");
  const seconds = String(counter % 60).padStart(2, "0");

  // Selected-country derived values. Fall back to India / +91 until the list
  // loads so the card is usable immediately.
  const dialCode = CountryCodes?.[extension]?.label ?? "+91";
  const flagImg = CountryCodes?.[extension]?.img;
  const countryValue = CountryCodes?.[extension]?.value ?? null;

  // The input only ever holds the local digits; the dial code is prepended for
  // the backend. India stays a strict 10 digits, everywhere else is a looser
  // 6–15 (matches BotLoginModal's India-only length check).
  const digits = phone.replace(/\D/g, "");
  const maxDigits = extension === "India" ? 10 : 15;
  const phoneValid =
    extension === "India" ? digits.length === 10 : digits.length >= 6;

  // Full dial-code-prefixed mobile used for both initiate + complete.
  const fullMobile = `${dialCode}${phone}`;

  // When auth.token appears, the verify succeeded — notify the parent once.
  useEffect(() => {
    if (token && !verifiedFiredRef.current) {
      verifiedFiredRef.current = true;
      onVerified();
    }
  }, [token, onVerified]);

  // Keep the portaled dropdown pinned just below the field. Recompute on open
  // and on any scroll/resize (capture=true catches the inner chat scroller too)
  // so it tracks the field instead of floating away.
  useLayoutEffect(() => {
    if (!openCountryCodeOption) return;
    const update = () => {
      const el = fieldRowRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setDropdownPos({ top: r.bottom + 6, left: r.left });
    };
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [openCountryCodeOption]);

  // Switching country only changes the prefix — the input keeps just the local
  // digits, so there's nothing to re-parse.
  const handleExtensionChangeOption = (country: string) => {
    countryTouchedRef.current = true;
    setExtension(country);
  };

  const onRecaptchaChange = (value: string | null) => {
    if (!value) return;
    dispatch(
      otpaction.getotp({ token: value, mobile: fullMobile, whatsapp }) as any,
    );
    if (recaptchaRef.current) recaptchaRef.current.reset();
  };

  const sendOtp = () => {
    if (!phoneValid) return;
    // Clear any prior "couldn't send" error before firing a fresh request so a
    // stale message (e.g. a rate-limit warning) doesn't linger past the retry.
    if (mobileFail) dispatch(authaction.authResetLogin() as any);
    dispatch(authaction.authStartLoading() as any);
    if (recaptchaRef.current) {
      recaptchaRef.current.reset();
      recaptchaRef.current.execute();
    }
  };

  // Resend the code once the cooldown has elapsed. Reuses the same reCAPTCHA →
  // getotp path as the initial send (`onRecaptchaChange` re-dispatches getotp
  // for the same number). Clears the entered code + dedup guard so the fresh
  // code verifies cleanly, and re-arms the countdown. (Mirrors BotLoginModal.)
  const resendOtp = () => {
    if (loading || counter > 0) return;
    setOtp("");
    submittedCodeRef.current = null;
    setOtpResent((p) => !p);
    dispatch(authaction.authResetOtpFail() as any);
    dispatch(authaction.authStartLoading() as any);
    if (recaptchaRef.current) {
      recaptchaRef.current.reset();
      recaptchaRef.current.execute();
    }
  };

  const verify = (code: string) => {
    dispatch(
      authaction.auth(
        fullMobile,
        code,
        newUser ? name || null : null,
        newUser ? email || null : null,
        whatsapp,
        newUser ? countryValue : null,
        undefined,
        trackUserLogin,
      ) as any,
    );
  };

  const onOtpChange = (raw: string) => {
    const code = raw.replace(/\D/g, "").slice(0, 4);
    setOtp(code);
    // Once the 4 digits are in, existing users verify immediately; new users
    // are routed to the name + email screen first (same code is submitted from
    // there). Guard so a duplicate input event can't advance/verify twice.
    if (code.length === 4 && submittedCodeRef.current !== code) {
      submittedCodeRef.current = code;
      if (newUser) {
        setUserDetailsRequired(true);
      } else {
        setTimeout(() => verify(code), 200);
      }
    }
  };

  // New-user details screen submit. Name is required (same as BotLoginModal);
  // the email is validated server-side and surfaced via `emailFail`. Verifies
  // the OTP + details together in a single `/complete/` call.
  const submitDetails = () => {
    if (!name.trim()) {
      setUserNameError(true);
      return;
    }
    verify(otp);
  };

  // Back from the details screen to the OTP field (e.g. the code was wrong).
  // Clears the entered code + dedup guard so re-verification is clean.
  const handleBackToOtp = () => {
    setUserDetailsRequired(false);
    setOtp("");
    submittedCodeRef.current = null;
    dispatch(authaction.authResetOtpFail() as any);
  };

  // Go back to the phone-entry step. `phone` lives in local state so it's kept
  // and editable; resetting redux's `otpSent` flips the card back to the first
  // screen. Clear the entered code + dedup guard so re-verification is clean.
  const handleChangeNumber = () => {
    setOtp("");
    submittedCodeRef.current = null;
    dispatch(authaction.authResetLogin() as any);
  };

  return (
    <div className="flex gap-[10px] mt-1 max-ph:gap-0 max-ph:-mx-1">
      {/* Kaira avatar in the left gutter — same gradient ring + image as her
          chat replies, so the sign-in card reads as part of the conversation.
          Hidden on phones (like other bot avatars) to give the card full width. */}
      <div
        aria-hidden
        className="w-[30px] h-[30px] rounded-full overflow-hidden shrink-0 max-ph:hidden"
        style={{ background: "linear-gradient(180deg, #a8d2f5, #7ab8e8)" }}
      >
        <img
          src="/KairaInsta.png"
          alt="Kaira"
          className="w-full h-full object-cover"
        />
      </div>
      <div
        className="rounded-[16px] min-w-0 flex-1"
        style={{
          // First step adopts the cream "welcome back" card look; the OTP /
          // details steps keep the original white card so they're unchanged.
          background: otpSent ? "#fff" : "#FAFAF5",
          border: otpSent ? "1px solid #ececec" : "1px solid #e7e3d9",
          padding: otpSent ? 16 : 22,
          maxWidth: 420,
          boxShadow: "0 14px 30px -14px rgba(11,18,32,.14)",
        }}
      >
      {/* The small uppercase eyebrow belongs to the OTP / details steps; the
          redesigned first step carries its own title instead. */}
      {otpSent && (
        <div className="text-[11px] font-extrabold text-[#445069] uppercase tracking-wide mb-[10px]">
          {heading}
        </div>
      )}

      {!otpSent ? (
        <>
          {/* Kaira identity — inline brand header (replaces the removed
              left-gutter chat avatar), so the card reads as Kaira on its own. */}
          <div className="flex items-center gap-[11px] mb-[20px]">
            <img
              src="/KairaInsta.png"
              alt="Kaira"
              className="w-[48px] h-[48px] rounded-full object-cover shrink-0"
              style={{
                border: "3px solid #fff",
                boxShadow: "0 4px 14px -4px rgba(15,26,46,.3)",
              }}
            />
            <div>
              <div className="text-[17px] font-bold text-[#0f1a2e] leading-none">
                kaira
                <span style={{ color: "#f7e700", WebkitTextStroke: "0.4px #0f1a2e" }}>
                  .
                </span>
              </div>
              <div className="text-[12px] font-medium text-[#8a93a6] mt-[2px]">
                Your AI Trip Planner
              </div>
            </div>
          </div>

          {/* Title + subtitle */}
          <div
            className="text-[26px] max-ph:text-[24px] font-extrabold text-[#0f1a2e] leading-[1.03]"
            style={{ letterSpacing: "-0.03em" }}
          >
            <span className="mr-2">Sign In</span>
            <em
              style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontStyle: "italic",
                fontWeight: 400,
              }}
            >
             to Continue
            </em>
            {/* <span className="ml-2"> to Continue</span> */}
            
          </div>
          <div className="text-[13.5px] text-[#445069] mt-[8px] leading-[2] mb-3">
            Your number is your login. Your holidays are waiting.
          </div>

          {/* Benefits */}
          <ul className="list-none m-0 mt-[20px] p-0 grid gap-[12px]">
            {[
              "Save this holiday to your account",
              "See your exact price, not just the ballpark",
              "I'll WhatsApp you if it gets cheaper",
            ].map((b) => (
              <li
                key={b}
                className="flex gap-[10px] items-start text-[13.5px] leading-[1.4] text-[#2a3444]"
              >
                <span
                  className="shrink-0 w-[20px] h-[20px] mt-[1px] rounded-[7px] flex items-center justify-center"
                  style={{ background: "rgba(15,26,46,.06)" }}
                >
                  <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M4 10.5l3.5 3.5L16 5.5"
                      stroke="#0f1a2e"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span>{b}</span>
              </li>
            ))}
          </ul>

          {/* Coupon — navy island, yellow amount, ticket-notch cut-outs. The
              notches are card-cream circles half-clipped by overflow-hidden so
              they read as bites out of the navy pill. */}
          <div
            className="relative flex items-center gap-[12px] mt-[18px] overflow-hidden rounded-[16px] px-[15px] py-[13px]"
            style={{ background: "#0f1a2e", color: "#FAFAF5" }}
          >
            <span
              aria-hidden
              className="absolute rounded-full"
              style={{
                width: 14,
                height: 14,
                background: "#FAFAF5",
                left: -7,
                top: "50%",
                transform: "translateY(-50%)",
              }}
            />
            <span
              aria-hidden
              className="absolute rounded-full"
              style={{
                width: 14,
                height: 14,
                background: "#FAFAF5",
                right: -7,
                top: "50%",
                transform: "translateY(-50%)",
              }}
            />
            <span
              className="shrink-0 w-[34px] h-[34px] rounded-[9px] grid place-items-center"
              style={{ background: "rgba(247,231,0,.14)" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2 2 2 0 0 0 0 4 2 2 0 0 1 0 4 2 2 0 0 1-2 2H6a2 2 0 0 1-2-2 2 2 0 0 0 0-4 2 2 0 0 1 0-4Z"
                  stroke="#f7e700"
                  strokeWidth="1.6"
                />
                <path
                  d="M14 8v8"
                  stroke="#f7e700"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeDasharray="1.5 2.5"
                />
              </svg>
            </span>
            <span>
              <span
                className="block text-[18px] font-semibold tabular-nums leading-[1.1]"
                style={{
                  color: "#f7e700",
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                }}
              >
                ₹5,000 off
              </span>
              <span
                className="block text-[12px] mt-[2px] leading-[1.3]"
                style={{ color: "rgba(251,248,239,.72)" }}
              >
                in your account for when you book
              </span>
            </span>
          </div>

          {/* Phone field — same dropdown + input + portal wiring, restyled to
              the mockup (separate country chip + white input). */}
          <div className="relative mt-[20px]">
            <div ref={fieldRowRef} className="flex gap-[8px]">
              <button
                type="button"
                onClick={() => setOpenCountryCodeOption(true)}
                className="flex items-center gap-[6px] shrink-0 px-[13px] rounded-[14px] text-[14px] font-semibold text-[#0f1a2e]"
                style={{ background: "#fff", border: "1px solid #e7e3d9" }}
              >
                {flagImg ? (
                  <img
                    src={flagImg}
                    alt=""
                    className="w-[22px] h-[15px] object-cover rounded-[2px]"
                  />
                ) : (
                  <span>🇮🇳</span>
                )}
                <span>{dialCode}</span>
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#8a93a6"
                  strokeWidth="2.5"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              <input
                type="tel"
                inputMode="numeric"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value.replace(/\D/g, "").slice(0, maxDigits));
                  // Clear a prior "couldn't send" error as soon as the user
                  // starts correcting the number (once, only if one is shown).
                  if (mobileFail) dispatch(authaction.authResetLogin() as any);
                }}
                placeholder="98XXX XXXXX"
                className="flex-1 min-w-0 outline-none rounded-[14px] px-[16px] py-[13px] text-[15px] font-semibold tabular-nums"
                style={{
                  background: "#fff",
                  border: "1.5px solid #0f1a2e",
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  letterSpacing: "0.03em",
                }}
              />
            </div>

            {/* Force the shared dropdown to anchor just below the field (its
                default is a fixed/centered overlay). Because it's portaled to
                <body>, `fixed` here is viewport-relative — the wrapper supplies
                the measured top/left — so the chat's scroll area can't clip it. */}
            <style>{`
              .ttwIntakeCountryDropdown [data-country-dropdown="true"] {
                position: relative !important;
                top: auto !important;
                left: auto !important;
                right: auto !important;
                bottom: auto !important;
                transform: none !important;
                width: min(320px, 90vw) !important;
                height: auto !important;
                max-height: 300px !important;
                margin-top: 0 !important;
              }
            `}</style>

            {openCountryCodeOption &&
              dropdownPos &&
              typeof document !== "undefined" &&
              createPortal(
                <div
                  className="ttwIntakeCountryDropdown"
                  style={{
                    position: "fixed",
                    top: dropdownPos.top,
                    left: dropdownPos.left,
                    zIndex: 2000,
                  }}
                >
                  <CountryCodeDropdown
                    onClose={() => setOpenCountryCodeOption(false)}
                    CountryCodes={CountryCodes}
                    handleExtensionChangeOption={handleExtensionChangeOption}
                    setOpenCountryCodeOption={setOpenCountryCodeOption}
                  />
                </div>,
                document.body,
              )}
          </div>

          <label className="flex items-center gap-[8px] mt-[10px] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={whatsapp}
              onChange={(e) => setWhatsapp(e.target.checked)}
              className="w-[15px] h-[15px] accent-[#1FA855] shrink-0"
            />
            <span className="text-[12px] font-semibold text-[#445069]">
              Send OTP on WhatsApp?
            </span>
          </label>
          <button
            type="button"
            onClick={sendOtp}
            disabled={!phoneValid || loading}
            className="w-full mt-[10px] py-[11px] rounded-[11px] text-[13.5px] font-bold text-white inline-flex items-center justify-center gap-[7px] transition-all"
            style={{
              background:
                !phoneValid || loading
                  ? "#b8becc"
                  : whatsapp
                    ? "#1FA855"
                    : "#0f1a2e",
              cursor: !phoneValid || loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? (
              "Sending…"
            ) : whatsapp ? (
              <>
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden
                  className="shrink-0"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Send OTP via WhatsApp
              </>
            ) : (
              "Send OTP via SMS"
            )}
          </button>
          {/* Initiate (OTP send) failure — invalid number, rate limit, network,
              or any non-success from /initiate/. Hidden while a retry is in
              flight so a stale message doesn't linger over "Sending…". */}
          {mobileFail && !loading && (
            <div className="text-[11.5px] text-[#e85a4f] mt-2 font-semibold text-center">
              {mobilefailmessage || "Couldn't send the code. Please try again."}
            </div>
          )}

          {/* Skip login — lets the user continue without signing in. The parent
              resumes the chat flagged as opted-out (login_opted_out) so the
              backend knows this was a deliberate skip, not a pending sign-in. */}
          {onSkip && (
            <button
              type="button"
              onClick={onSkip}
              disabled={loading}
              className="w-full mt-[12px] text-[12.5px] font-semibold text-[#2e3034]"
              style={{ cursor: loading ? "not-allowed" : "pointer" }}
            >
              Continue without login
            </button>
          )}

          {/* Trust line */}
          <div
            className="mt-[16px] pt-[14px]"
            style={{ borderTop: "1px solid #e7e3d9" }}
          >
            <div
              className="text-center text-[9.5px] uppercase leading-[1.9] text-[#8a93a6]"
              style={{
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                letterSpacing: "0.1em",
              }}
            >
              10,000+ holidays planned · GST invoice · secure payments
            </div>
          </div>
        </>
      ) : userDetailsRequired ? (
        <>
          <div className="text-[11px] font-extrabold text-[#445069] uppercase tracking-wide mb-[8px]">
            Just a few details
          </div>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (userNameError) setUserNameError(false);
            }}
            placeholder="Your name"
            className="w-full rounded-[11px] px-[14px] py-[11px] text-[14px] outline-none"
            style={{
              background: "#fafaf5",
              border: `1.5px solid ${userNameError ? "#e85a4f" : "#ececec"}`,
            }}
          />
          {userNameError && (
            <div className="text-[11.5px] text-[#e85a4f] mt-[6px] font-semibold">
              Please enter a valid name
            </div>
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              // Clear a prior "that email didn't work" error as the user edits.
              if (emailFail) dispatch(authaction.authResetEmail() as any);
            }}
            placeholder="Your email"
            className="w-full mt-[10px] rounded-[11px] px-[14px] py-[11px] text-[14px] outline-none"
            style={{
              background: "#fafaf5",
              border: `1.5px solid ${emailFail && !token ? "#e85a4f" : "#ececec"}`,
            }}
          />
          {emailFail && !token && (
            <div className="text-[11.5px] text-[#e85a4f] mt-2 font-semibold">
              {emailfailmessage || "That email didn't work. Try another."}
            </div>
          )}
          {/* A wrong OTP fails the combined verify with otpFail (not emailFail);
              send the user back to re-enter the code. */}
          {otpFail && !token && (
            <div className="text-[11.5px] text-[#e85a4f] mt-2 font-semibold">
              That code didn&apos;t match.{" "}
              <button
                type="button"
                onClick={handleBackToOtp}
                className="underline font-bold"
                style={{ cursor: "pointer" }}
              >
                Re-enter code
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={submitDetails}
            disabled={loading}
            className="w-full mt-[10px] py-[11px] rounded-[11px] text-[13.5px] font-bold text-white inline-flex items-center justify-center gap-[7px] transition-all"
            style={{
              background: loading ? "#b8becc" : "#0f1a2e",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Verifying…" : "Continue"}
          </button>
          <div className="text-[11.5px] text-[#8a93a6] text-center mt-[10px]">
            Sent to <b className="text-[#445069]">{dialCode} {phone}</b>
            {" · "}
            <button
              type="button"
              onClick={handleChangeNumber}
              className="font-bold text-[#445069] underline"
              style={{ cursor: "pointer" }}
            >
              Change
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="text-[11px] font-extrabold text-[#445069] uppercase tracking-wide mb-[8px]">
            Enter the 4-digit code
          </div>
          <input
            type="tel"
            inputMode="numeric"
            autoFocus
            value={otp}
            onChange={(e) => onOtpChange(e.target.value)}
            disabled={loading}
            placeholder="• • • •"
            maxLength={4}
            className="w-full rounded-[11px] px-[14px] py-[12px] text-[19px] font-extrabold text-center tracking-[0.5em] outline-none tabular-nums"
            style={{
              background: otpFail && !token ? "#ffe5ea" : "#fafaf5",
              border: `1.5px solid ${otpFail && !token ? "#e85a4f" : "#ececec"}`,
            }}
          />
          {/* Verify failure (existing users). `!token` guards the success
              transition so a just-cleared error can't flash while the card
              unmounts. New users see OTP/email errors on the details screen. */}
          {otpFail && !token && (
            <div className="text-[11.5px] text-[#e85a4f] mt-2 font-semibold">
              That code didn&apos;t match. Try again.
            </div>
          )}
          <div className="text-[11.5px] text-[#8a93a6] text-center mt-[10px]">
            Sent to <b className="text-[#445069]">{dialCode} {phone}</b>
            {loading ? " · verifying…" : ""}
            {" · "}
            <button
              type="button"
              onClick={handleChangeNumber}
              className="font-bold text-[#445069] underline"
              style={{ cursor: "pointer" }}
            >
              Change
            </button>
          </div>
          <div className="text-[11.5px] text-[#8a93a6] text-center mt-[6px]">
            {counter > 0 ? (
              <>
                Didn&apos;t get it?{" "}
                <b className="text-[#445069]">
                  Resend in {minutes}:{seconds}
                </b>
              </>
            ) : (
              <>
                Didn&apos;t get it?{" "}
                <button
                  type="button"
                  onClick={resendOtp}
                  disabled={loading}
                  className="font-bold underline"
                  style={{
                    cursor: loading ? "not-allowed" : "pointer",
                    color: loading ? "#b8becc" : "#3A85FC",
                  }}
                >
                  {loading ? "Sending…" : "Resend OTP"}
                </button>
              </>
            )}
          </div>
        </>
      )}

      <ReCAPTCHA
        size="invisible"
        sitekey={RECAPTCHA_SITE_KEY as string}
        ref={recaptchaRef}
        onChange={onRecaptchaChange}
        badge="bottomleft"
      />
      </div>
    </div>
  );
};

export default OtpCard;

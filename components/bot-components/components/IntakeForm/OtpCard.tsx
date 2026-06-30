import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReCAPTCHA from "react-google-recaptcha";
import { RECAPTCHA_SITE_KEY } from "../../../../services/constants";
import * as authaction from "../../../../store/actions/auth";
import * as otpaction from "../../../../store/actions/getOtp";
import { getCountryCodes } from "../../../../store/actions/countryCodes";
import { useAnalytics } from "../../../../hooks/useAnalytics";
import CountryCodeDropdown from "../../../userauth/CountryDropdown";

interface OtpCardProps {
  /** Fired once after a successful verify (token present in auth state). */
  onVerified: () => void;
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

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [extension, setExtension] = useState("India");
  const [openCountryCodeOption, setOpenCountryCodeOption] = useState(false);

  // Pull the dial-code list once, the same way BotLoginModal does. Also reset
  // any stale login state so a freshly-mounted card always starts at the
  // phone-entry step. Without this, a new chat opened while a previous,
  // abandoned login left `otpSent: true` in redux would drop the user straight
  // onto the OTP screen with no valid code to enter.
  useEffect(() => {
    dispatch(authaction.authResetLogin() as any);
    dispatch(getCountryCodes() as any);
  }, [dispatch]);

  // A failed verify re-enables a fresh submit of the same digits (e.g. after a
  // network blip) by clearing the dedup guard.
  useEffect(() => {
    if (otpFail) submittedCodeRef.current = null;
  }, [otpFail]);

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

  // Switching country only changes the prefix — the input keeps just the local
  // digits, so there's nothing to re-parse.
  const handleExtensionChangeOption = (country: string) => {
    setExtension(country);
  };

  const onRecaptchaChange = (value: string | null) => {
    if (!value) return;
    dispatch(
      otpaction.getotp({ token: value, mobile: fullMobile, whatsapp: true }) as any,
    );
    if (recaptchaRef.current) recaptchaRef.current.reset();
  };

  const sendOtp = () => {
    if (!phoneValid) return;
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
        null,
        true,
        newUser ? countryValue : null,
        undefined,
        trackUserLogin,
      ) as any,
    );
  };

  const onOtpChange = (raw: string) => {
    const code = raw.replace(/\D/g, "").slice(0, 4);
    setOtp(code);
    // Auto-submit once — but only once per distinct code, so a duplicate input
    // event can't fire a second verify against the already-consumed OTP.
    if (code.length === 4 && submittedCodeRef.current !== code) {
      submittedCodeRef.current = code;
      setTimeout(() => verify(code), 200);
    }
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
    <div
      className="rounded-[16px] p-4 ml-10 max-ph:ml-0 max-ph:-mx-1 mt-1"
      style={{
        background: "#fff",
        border: "1px solid #ececec",
        maxWidth: 420,
        boxShadow: "0 14px 30px -14px rgba(11,18,32,.14)",
      }}
    >
      <div className="text-[11px] font-extrabold text-[#445069] uppercase tracking-wide mb-[10px]">
        {heading}
      </div>

      {!otpSent ? (
        <>
          {/* Relative anchor so the country dropdown opens directly below the
              row instead of as a fixed/centered overlay. */}
          <div className="relative">
            <div
              className="flex rounded-[12px] overflow-hidden"
              style={{ background: "#fafaf5", border: "1.5px solid #ececec" }}
            >
              <button
                type="button"
                onClick={() => setOpenCountryCodeOption(true)}
                className="px-[12px] py-[11px] text-[14.5px] font-bold flex items-center gap-[6px] shrink-0"
                style={{ borderRight: "1px solid #ececec" }}
              >
                {flagImg ? (
                  <img
                    src={flagImg}
                    alt=""
                    className="w-[20px] h-[14px] object-cover rounded-[2px]"
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
                className="flex-1 min-w-0 border-0 outline-none px-[14px] py-[11px] text-[15px] bg-transparent font-semibold tabular-nums"
              />
            </div>

            {/* Override the shared dropdown's fixed/centered positioning so it
                anchors absolutely just below the field. */}
            <style>{`
              .ttwIntakeCountryDropdown [data-country-dropdown="true"] {
                position: absolute !important;
                top: 100% !important;
                left: 0 !important;
                right: auto !important;
                bottom: auto !important;
                transform: none !important;
                width: min(320px, 90vw) !important;
                height: auto !important;
                max-height: 300px !important;
                margin-top: 6px !important;
              }
            `}</style>

            {openCountryCodeOption && (
              <div
                className="ttwIntakeCountryDropdown"
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  marginTop: 4,
                  zIndex: 1000,
                }}
              >
                <CountryCodeDropdown
                  onClose={() => setOpenCountryCodeOption(false)}
                  CountryCodes={CountryCodes}
                  handleExtensionChangeOption={handleExtensionChangeOption}
                  setOpenCountryCodeOption={setOpenCountryCodeOption}
                />
              </div>
            )}
          </div>

          <div
            className="flex items-start gap-[6px] mt-[10px] px-3 py-2 rounded-[9px] text-[11px] font-medium"
            style={{ background: "#e0f2e9", color: "#1f8a5a" }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-[1px]">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>OTP on WhatsApp. <b>No spam, ever.</b></span>
          </div>
          <button
            type="button"
            onClick={sendOtp}
            disabled={!phoneValid || loading}
            className="w-full mt-[10px] py-[11px] rounded-[11px] text-[13.5px] font-bold text-white inline-flex items-center justify-center gap-[7px] transition-all"
            style={{
              background: !phoneValid || loading ? "#b8becc" : "#0f1a2e",
              cursor: !phoneValid || loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Sending…" : submitLabel}
          </button>
          {/* Initiate (OTP send) failure — invalid number, rate limit, network,
              or any non-success from /initiate/. Hidden while a retry is in
              flight so a stale message doesn't linger over "Sending…". */}
          {mobileFail && !loading && (
            <div className="text-[11.5px] text-[#e85a4f] mt-2 font-semibold text-center">
              {mobilefailmessage || "Couldn't send the code. Please try again."}
            </div>
          )}
        </>
      ) : (
        <>
          {newUser && (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full mb-[10px] rounded-[11px] px-[14px] py-[11px] text-[14px] outline-none"
              style={{ background: "#fafaf5", border: "1.5px solid #ececec" }}
            />
          )}
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
              background: (otpFail || emailFail) && !token ? "#ffe5ea" : "#fafaf5",
              border: `1.5px solid ${(otpFail || emailFail) && !token ? "#e85a4f" : "#ececec"}`,
            }}
          />
          {/* Verify failures. `!token` guards the success transition so a
              just-cleared error can't flash while the card unmounts. emailFail
              covers the new-user edge case where the email is rejected. */}
          {(otpFail || emailFail) && !token && (
            <div className="text-[11.5px] text-[#e85a4f] mt-2 font-semibold">
              {emailFail
                ? emailfailmessage || "That email didn't work. Try another."
                : "That code didn't match. Try again."}
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
  );
};

export default OtpCard;

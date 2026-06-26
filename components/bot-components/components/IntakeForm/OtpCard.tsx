import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReCAPTCHA from "react-google-recaptcha";
import { RECAPTCHA_SITE_KEY } from "../../../../services/constants";
import * as authaction from "../../../../store/actions/auth";
import * as otpaction from "../../../../store/actions/getOtp";

interface OtpCardProps {
  /** Fired once after a successful verify (token present in auth state). */
  onVerified: () => void;
}

/**
 * Inline phone + WhatsApp-OTP card injected into the chat after the intake form
 * completes for logged-out users. Reuses the app's real OTP backend via the
 * `getotp` and `auth` thunks plus an invisible reCAPTCHA (mirrors BotLoginModal).
 */
const OtpCard: React.FC<OtpCardProps> = ({ onVerified }) => {
  const dispatch = useDispatch();
  const recaptchaRef = useRef<any>(null);
  const verifiedFiredRef = useRef(false);

  const otpSent = useSelector((s: any) => s.auth?.otpSent);
  const loading = useSelector((s: any) => s.auth?.loading);
  const otpFail = useSelector((s: any) => s.auth?.otpFail);
  const newUser = useSelector((s: any) => s.auth?.newUser);
  const token = useSelector((s: any) => s.auth?.token);

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");

  // Full +91-prefixed mobile used for both initiate + complete.
  const fullMobile = `+91${phone}`;

  // When auth.token appears, the verify succeeded — notify the parent once.
  useEffect(() => {
    if (token && !verifiedFiredRef.current) {
      verifiedFiredRef.current = true;
      onVerified();
    }
  }, [token, onVerified]);

  const onRecaptchaChange = (value: string | null) => {
    if (!value) return;
    dispatch(
      otpaction.getotp({ token: value, mobile: fullMobile, whatsapp: true }) as any,
    );
    if (recaptchaRef.current) recaptchaRef.current.reset();
  };

  const sendOtp = () => {
    if (phone.replace(/\D/g, "").length !== 10) return;
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
        null,
        undefined,
        undefined,
      ) as any,
    );
  };

  const onOtpChange = (raw: string) => {
    const code = raw.replace(/\D/g, "").slice(0, 4);
    setOtp(code);
    if (code.length === 4) setTimeout(() => verify(code), 200);
  };

  return (
    <div
      className="rounded-[16px] p-4 ml-10 max-ph:ml-0 mt-1"
      style={{
        background: "#fff",
        border: "1px solid #ececec",
        maxWidth: 420,
        boxShadow: "0 14px 30px -14px rgba(11,18,32,.14)",
      }}
    >
      <div className="text-[11px] font-extrabold text-[#445069] uppercase tracking-wide mb-[10px]">
        Save our work
      </div>

      {!otpSent ? (
        <>
          <div
            className="flex rounded-[12px] overflow-hidden"
            style={{ background: "#fafaf5", border: "1.5px solid #ececec" }}
          >
            <div
              className="px-[14px] py-[11px] text-[14.5px] font-bold flex items-center gap-[6px]"
              style={{ borderRight: "1px solid #ececec" }}
            >
              <span>🇮🇳</span> +91
            </div>
            <input
              type="tel"
              inputMode="numeric"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
              placeholder="98XXX XXXXX"
              className="flex-1 border-0 outline-none px-[14px] py-[11px] text-[15px] bg-transparent font-semibold tabular-nums"
            />
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
            disabled={phone.length !== 10 || loading}
            className="w-full mt-[10px] py-[11px] rounded-[11px] text-[13.5px] font-bold text-white inline-flex items-center justify-center gap-[7px] transition-all"
            style={{
              background: phone.length !== 10 || loading ? "#b8becc" : "#0f1a2e",
              cursor: phone.length !== 10 || loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Sending…" : "Send OTP & start"}
          </button>
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
            placeholder="• • • •"
            maxLength={4}
            className="w-full rounded-[11px] px-[14px] py-[12px] text-[19px] font-extrabold text-center tracking-[0.5em] outline-none tabular-nums"
            style={{
              background: otpFail ? "#ffe5ea" : "#fafaf5",
              border: `1.5px solid ${otpFail ? "#e85a4f" : "#ececec"}`,
            }}
          />
          {otpFail && (
            <div className="text-[11.5px] text-[#e85a4f] mt-2 font-semibold">
              That code didn't match. Try again.
            </div>
          )}
          <div className="text-[11.5px] text-[#8a93a6] text-center mt-[10px]">
            Sent to <b className="text-[#445069]">+91 {phone}</b>
            {loading ? " · verifying…" : ""}
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

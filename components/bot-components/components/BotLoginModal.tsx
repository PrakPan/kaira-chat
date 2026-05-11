import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { createPortal } from "react-dom";
import { connect } from "react-redux";
import OTPInput from "react-otp-input";
import ReCAPTCHA from "react-google-recaptcha";
import Image from "next/image";
import Link from "next/link";
import { IoLogoWhatsapp } from "react-icons/io";
import { BiError } from "react-icons/bi";
import { ImCheckboxChecked, ImCheckboxUnchecked } from "react-icons/im";
import { RxCross2 } from "react-icons/rx";

import * as authaction from "../../../store/actions/auth";
import * as otpaction from "../../../store/actions/getOtp";
import { getCountryCodes } from "../../../store/actions/countryCodes";
import { RECAPTCHA_SITE_KEY } from "../../../services/constants";
import { useAnalytics } from "../../../hooks/useAnalytics";
import useMediaQuery from "../../media";
import CountryCodeDropdown from "../../userauth/CountryDropdown";
import LoginLoadingIcon from "../../ui/LoadingLottie";

type BotLoginModalProps = {
  show: boolean;
  onhide: () => void;
  onSuccess?: () => void | Promise<void>;
  message?: string;
  itinary_id?: any;
  isTailored?: boolean;
  onSkipLogin?: () => void;
  zIndex?: number | string;
  hideloginclose?: boolean;

  // Redux state
  CountryCodes?: any;
  token?: string | null;
  phone?: string | null;
  name?: string | null;
  email?: string | null;
  otpSent?: boolean;
  otpFail?: boolean;
  loading?: boolean;
  loadingsocial?: boolean;
  newUser?: boolean;
  mobileFail?: boolean;
  mobilefailmessage?: string;
  emailFail?: boolean;
  emailfailmessage?: string;

  // Redux dispatch
  onAuth?: (
    mobile: string,
    password: string,
    name: string | null,
    email: string | null,
    whatsapp: boolean,
    country: any,
    onSuccess: any,
    trackUserLogin: any,
  ) => void;
  onOtp?: (data: any) => void;
  onResetLogin?: () => void;
  onStartLoading?: () => void;
  onUpdate?: (data: any, tracker: any) => void;
  authCloseLogin?: () => void;
  getCountryCodes?: () => void;
};

let userDetails: { userName: string; email: string } = {
  userName: "",
  email: "",
};

const COLORS = {
  yellow: "#FFE600",
  yellowDark: "#F2D700",
  yellowSoft: "rgba(255, 230, 0, 0.18)",
  yellowTint: "#FFFCEC",
  navy: "#0F1B2D",
  navySoft: "#1A2940",
  cream: "#FAF8F0",
  white: "#FFFFFF",
  gray50: "#F8F7F2",
  gray100: "#ECEAE1",
  gray200: "#DCD9CE",
  gray400: "#9B9890",
  gray600: "#5C5A55",
  gray800: "#2C2C2A",
};

const BotLoginModalRaw: React.FC<BotLoginModalProps> = (props) => {
  const isPageWide = useMediaQuery("(min-width: 768px)");
  const [layoutReady, setLayoutReady] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") setLayoutReady(true);
  }, []);
  const { trackUserLogin, trackUserAccountUpdate } = useAnalytics();

  const mobileRef = useRef<HTMLInputElement | null>(null);
  const recaptchaRef = useRef<any>(null);

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [whatsapp, setWhatsapp] = useState(true);
  const [extension, setExtension] = useState("India");
  const [openCountryCodeOption, setOpenCountryCodeOption] = useState(false);
  const [otpResent, setOtpResent] = useState(false);
  const [counter, setCounter] = useState(30);
  const [userDetailsRequired, setUserDetailsRequired] = useState(false);
  const [userNameError, setUserNameError] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  // Mount recaptcha script (used by LogInModal pattern)
  useEffect(() => {
    if (props.getCountryCodes) props.getCountryCodes();
  }, []);

  // OTP resend timer
  useEffect(() => {
    if (props.otpSent) {
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
    }
  }, [props.otpSent, otpResent]);

  // Auto-close once we have token + phone + name
  useEffect(() => {
    if (
      props.token &&
      props.phone &&
      props.name &&
      props.phone !== "null" &&
      props.phone !== null
    ) {
      props.authCloseLogin && props.authCloseLogin();
    }
  }, [props.token, props.phone, props.name]);

  // Reset login state when first mounted/shown
  useEffect(() => {
    if (props.show) {
      props.onResetLogin && props.onResetLogin();
      setTimeout(() => {
        if (mobileRef.current) mobileRef.current.focus();
      }, 80);
    }
  }, [props.show]);

  // Auto submit OTP when user enters all 6 digits
  useEffect(() => {
    if (otp.length === 4) {
      submitOtpHandler();
    }
  }, [otp]);

  const minutes = String(Math.floor(counter / 60)).padStart(2, "0");
  const seconds = String(counter % 60).padStart(2, "0");

  const separateCountryCode = (phoneNumber: string) => {
    const pattern = /^(\+\d{1,3})(\d{10})$/;
    const match = phoneNumber.match(pattern);
    if (match) return { countryCode: match[1], number: match[2] };
    return null;
  };

  const handleExtensionChangeOption = (country: string) => {
    setExtension(country);
    if (!props.CountryCodes || !props.CountryCodes[country]) return;
    if (phone.length <= 10) {
      setPhone(props.CountryCodes[country].label + phone);
      return;
    }
    const mobile = separateCountryCode(phone);
    if (mobile) {
      setPhone(props.CountryCodes[country].label + mobile.number);
    } else {
      setPhone(props.CountryCodes[country].label);
    }
  };

  const handleMobileBlur = () => {
    if (mobileRef.current) setPhone(mobileRef.current.value);
  };

  const handleMobileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setPhone(event.target.value);
    if (phoneError) setPhoneError("");
  };

  const _userDetailsOnChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>,
    target: "userName" | "email",
  ) => {
    userDetails = { ...userDetails, [target]: event.target.value };
  };

  const submitOtpHandler = () => {
    setUserNameError(false);

    if (!userDetailsRequired && props.newUser) {
      setUserDetailsRequired(true);
      return;
    }

    if (!props.onAuth) return;
    const country =
      props.CountryCodes && props.CountryCodes[extension]
        ? props.CountryCodes[extension].value
        : null;

    if (props.newUser) {
      if (!userDetails.userName) {
        setUserNameError(true);
        return;
      }
      props.onAuth(
        phone,
        otp,
        userDetails.userName,
        userDetails.email,
        whatsapp,
        country,
        props.onSuccess,
        trackUserLogin,
      );
    } else if (props.otpSent && !props.name) {
      props.onAuth(
        phone,
        otp,
        userDetails.userName,
        null,
        whatsapp,
        null,
        props.onSuccess,
        trackUserLogin,
      );
    } else if (props.otpSent && !props.email) {
      props.onAuth(
        phone,
        otp,
        null,
        userDetails.email,
        whatsapp,
        null,
        props.onSuccess,
        trackUserLogin,
      );
    } else {
      props.onAuth(
        phone,
        otp,
        null,
        null,
        whatsapp,
        null,
        props.onSuccess,
        trackUserLogin,
      );
    }
  };

  const otpHandler = (token: string) => {
    const phoneNumber = phone.trim();
    let mobile = phoneNumber;
    if (phoneNumber.length <= 10) {
      mobile = props.CountryCodes
        ? props.CountryCodes[extension].label + phoneNumber
        : `+91${phoneNumber}`;
      setPhone(mobile);
    } else {
      setPhone(phoneNumber);
    }
    const data = { token, mobile, whatsapp };
    props.onOtp && props.onOtp(data);
    if (recaptchaRef.current) recaptchaRef.current.reset();
  };

  const resetOtpHandler = (token: string) => {
    const data = { token, mobile: phone, whatsapp };
    props.onOtp && props.onOtp(data);
    setOtpResent((p) => !p);
    setCounter(30);
    if (recaptchaRef.current) recaptchaRef.current.reset();
  };

  const onRecaptchaChange = (value: string | null) => {
    if (!value) return;
    if (!props.otpSent) otpHandler(value);
    else resetOtpHandler(value);
  };

  const verifyRecaptchaHandler = () => {
    const phoneNumber = phone.trim();
    if (!props.otpSent) {
      if (!phoneNumber) {
        setPhoneError("Please enter your mobile number");
        if (mobileRef.current) mobileRef.current.focus();
        return;
      }
      if (
        extension === "India" &&
        phoneNumber.replace(/\D/g, "").length < 10
      ) {
        setPhoneError("Please enter a valid 10-digit mobile number");
        if (mobileRef.current) mobileRef.current.focus();
        return;
      }
    }
    setPhoneError("");

    if (props.mobileFail) {
      props.onResetLogin && props.onResetLogin();
    }
    props.onStartLoading && props.onStartLoading();

    if (recaptchaRef.current) {
      recaptchaRef.current.reset();
      recaptchaRef.current.execute();
    }
  };

  const handleEditPhone = () => {
    setOtp("");
    setUserDetailsRequired(false);
    setCounter(30);
    setPhoneError("");
    props.onResetLogin && props.onResetLogin();
    if (recaptchaRef.current) recaptchaRef.current.reset();
    setTimeout(() => {
      if (mobileRef.current) mobileRef.current.focus();
    }, 100);
  };

  const _updatePhoneHandler = () => {
    props.onUpdate &&
      props.onUpdate(
        { phone, whatsapp_opt_in: whatsapp },
        trackUserAccountUpdate,
      );
  };

  // Display phone (mask for OTP screen)
  const maskedPhone = useMemo(() => {
    const p = phone.trim();
    if (!p) return "";
    if (p.length < 6) return p;
    const visibleHead = p.slice(0, p.length - 4 - 0);
    const tail = p.slice(-4);
    const maskBody = "X".repeat(Math.max(0, p.length - visibleHead.length - 4));
    return `${visibleHead.slice(0, p.length - 6)}${visibleHead
      .slice(p.length - 6)
      .replace(/\d/g, "X")}${tail}`;
  }, [phone]);

  if (!props.show) return null;

  // ── DESIGN BLOCKS ──

  const yellowStrip = (
    <div
      style={{
        height: 6,
        background: `linear-gradient(90deg, ${COLORS.yellow}, ${COLORS.yellowDark})`,
        flexShrink: 0,
      }}
    />
  );

  const heroBlock = (
    <div
      style={{
        padding: "32px 24px 18px",
        background: `radial-gradient(ellipse at top right, ${COLORS.yellowSoft}, transparent 60%), ${COLORS.white}`,
        position: "relative",
      }}
    >
      {/* {props.message ? (
        <h1
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: 32,
            fontWeight: 400,
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            marginBottom: 10,
            color: COLORS.navy,
          }}
        >
          {props.message}
        </h1>
      ) : ( */}
        <h1
          className="botLoginSerif"
          style={{
            fontSize: 40,
            fontWeight: 400,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            marginBottom: 6,
            color: COLORS.navySoft,
          }}
        >
          Crafted{" "}
          <em style={{ fontStyle: "italic", color: COLORS.gray600 }}>
            for you
          </em>
          ,<br />
          handled{" "}
          <span
            style={{
              background: `linear-gradient(180deg, transparent 60%, ${COLORS.yellow} 60%, ${COLORS.yellow} 92%, transparent 92%)`,
              padding: "0 4px",
            }}
          >
            by us
          </span>
          .
        </h1>
      {/* )} */}
      <p style={{ fontSize: 13.5, color: COLORS.gray600, lineHeight: 1.55,marginBottom: 0, marginTop: "1rem" }}>
        Kaira plans the holiday. Partners across 100+ countries deliver it.{" "}
        <strong style={{ color: COLORS.navy, fontWeight: 600 }}>
          Real humans handle everything else.
        </strong>
      </p>
    </div>
  );

  const kairaBlock = (
    <div
      style={{
        margin: "6px 24px 16px",
        padding: "18px 16px 16px",
        background: `linear-gradient(135deg, ${COLORS.yellowTint}, ${COLORS.cream})`,
        border: `1px solid ${COLORS.yellowSoft}`,
        borderRadius: 10,
        position: "relative",
      }}
    >
      <span
        className="botLoginSerif"
        style={{
          position: "absolute",
          top: -10,
          left: 14,
          fontSize: 56,
          color: COLORS.yellow,
          lineHeight: 1,
          fontStyle: "italic",
        }}
      >
        &ldquo;
      </span>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 12,
        }}
      >
        <img
          src="https://thetarzanway.com/KairaInsta.png"
          alt="Kaira"
          width={48}
          height={48}
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            border: `2px solid ${COLORS.white}`,
            boxShadow: "0 4px 16px rgba(15,27,45,0.08)",
            objectFit: "cover",
            background: COLORS.yellow,
            flexShrink: 0,
          }}
        />
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.navy }}>
            Kaira
          </div>
          <div style={{ fontSize: 11, color: COLORS.gray600 }}>
            Your AI travel planner
          </div>
        </div>
      </div>
      <div
        className="botLoginSerif"
        style={{
          fontSize: 17,
          fontStyle: "italic",
          lineHeight: 1.4,
          color: COLORS.gray600,
          letterSpacing: "-0.01em",
        }}
      >
        I plan your holiday, book{" "}
        <span
          style={{
            background:
              "linear-gradient(180deg, transparent 60%, rgba(255,230,0,0.5) 60%, rgba(255,230,0,0.5) 92%, transparent 92%)",
          }}
        >
          vetted partners across 100+ countries
        </span>
        , and keep{" "}
        <span
          style={{
            background:
              "linear-gradient(180deg, transparent 60%, rgba(255,230,0,0.5) 60%, rgba(255,230,0,0.5) 92%, transparent 92%)",
          }}
        >
          real humans on call 24/7
        </span>
        . You just enjoy the ride.
      </div>
    </div>
  );

  const phoneFormBlock = (
    <div style={{ padding: "6px 24px 18px" }}>
      <p
        style={{
          fontSize: 12,
          color: COLORS.gray600,
          marginBottom: 10,
          textAlign: "center",
        }}
      >
        Drop your number —{" "}
        <strong style={{ color: COLORS.navy, fontWeight: 600 }}>
          we&apos;ll take it from here.
        </strong>
      </p>

      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: phoneError || (props.mobileFail && props.mobilefailmessage) ? 6 : 14,
          position: "relative",
        }}
      >
        <button
          type="button"
          onClick={() => setOpenCountryCodeOption(true)}
          style={{
            background: COLORS.white,
            border: `1px solid ${
              phoneError ? "#DC2626" : COLORS.gray200
            }`,
            borderRadius: 10,
            padding: "10px 14px",
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
            flexShrink: 0,
            color: COLORS.navy,
            fontFamily: "inherit",
          }}
        >
          {props.CountryCodes && props.CountryCodes[extension]?.img ? (
            <Image
              src={props.CountryCodes[extension].img}
              alt=""
              height={14}
              width={20}
              style={{ borderRadius: 2, objectFit: "cover" }}
            />
          ) : (
            <span style={{ fontSize: 16 }}>🇮🇳</span>
          )}
          <span>
            {props.CountryCodes && props.CountryCodes[extension]?.label
              ? props.CountryCodes[extension].label
              : "+91"}
          </span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke={COLORS.gray400}
            strokeWidth="2.5"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {openCountryCodeOption && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              marginTop: 4,
              zIndex: 10000,
            }}
          >
            <CountryCodeDropdown
              onClose={() => setOpenCountryCodeOption(false)}
              CountryCodes={props.CountryCodes}
              handleExtensionChangeOption={handleExtensionChangeOption}
              setOpenCountryCodeOption={setOpenCountryCodeOption}
            />
          </div>
        )}

        <div
          style={{
            flex: 1,
            background: COLORS.white,
            border: `1px solid ${
              phoneError ? "#DC2626" : COLORS.gray200
            }`,
            borderRadius: 10,
            padding: "0 16px",
            display: "flex",
            alignItems: "center",
            transition: "all 0.15s",
          }}
        >
          <input
            ref={mobileRef}
            type="tel"
            inputMode="numeric"
            placeholder="98XXX XXXXX"
            maxLength={15}
            style={{
              border: "none",
              outline: "none",
              fontFamily: "inherit",
              fontSize: 15,
              width: "100%",
              background: "transparent",
              color: COLORS.navy,
              padding: "12px 0",
              letterSpacing: "0.02em",
            }}
            value={phone}
            onChange={handleMobileChange}
            onBlur={handleMobileBlur}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                verifyRecaptchaHandler();
              }
            }}
            disabled={!!props.otpSent}
          />
        </div>
      </div>

      {phoneError && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            color: "#DC2626",
            fontSize: 12,
            marginBottom: 10,
          }}
        >
          <BiError style={{ fontSize: "1rem" }} />
          <span>{phoneError}</span>
        </div>
      )}

      {!phoneError && props.mobileFail && props.mobilefailmessage && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            color: "#DC2626",
            fontSize: 12,
            marginBottom: 10,
          }}
        >
          <BiError style={{ fontSize: "1rem" }} />
          <span>{props.mobilefailmessage}</span>
        </div>
      )}

      <button
        type="button"
        onClick={verifyRecaptchaHandler}
        disabled={!!props.loading}
        style={{
          background: "linear-gradient(180deg, #25D366 0%, #1FB855 100%)",
          color: COLORS.white,
          border: "none",
          padding: "14px 18px",
          borderRadius: 10,
          fontFamily: "inherit",
          fontSize: 15,
          fontWeight: 600,
          cursor: props.loading ? "not-allowed" : "pointer",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          boxShadow: "0 4px 14px rgba(37, 211, 102, 0.32)",
          opacity: props.loading ? 0.6 : 1,
          transition: "all 0.15s",
        }}
      >
        {props.loading ? (
          <span>Sending…</span>
        ) : (
          <>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Get OTP
          </>
        )}
      </button>

      <div
        style={{
          textAlign: "center",
          marginTop: 10,
          fontSize: 12,
          color: COLORS.gray600,
        }}
      >
        or{" "}
        <span
          style={{
            color: COLORS.navy,
            textDecoration: "underline",
            cursor: "pointer",
            fontWeight: 500,
          }}
          onClick={() => {
            setWhatsapp(false);
            setTimeout(() => verifyRecaptchaHandler(), 0);
          }}
        >
          receive via SMS
        </span>
      </div>

      <ReCAPTCHA
        size="invisible"
        sitekey={RECAPTCHA_SITE_KEY}
        ref={recaptchaRef}
        onChange={onRecaptchaChange}
        className="hidden"
      />
    </div>
  );

  const otpFormBlock = (
    <div style={{ padding: "28px 24px 18px" }}>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          background: "#FFF9DB",
          color: "#92400E",
          padding: "4px 10px",
          borderRadius: 999,
          fontSize: 11,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          marginBottom: 12,
        }}
      >
        📱 One more step
      </div>
      <h2
        className="botLoginSerif"
        style={{
          fontSize: 28,
          fontWeight: 400,
          lineHeight: 1.1,
          letterSpacing: "-0.02em",
          marginBottom: 8,
          color: COLORS.navy,
        }}
      >
        Enter the 4-digit OTP
      </h2>
      <p
        style={{
          fontSize: 13,
          color: COLORS.gray600,
          lineHeight: 1.5,
          marginBottom: 14,
        }}
      >
        Sent to your{" "}
        <strong style={{ color: COLORS.navy, fontWeight: 600 }}>
          {whatsapp ? "WhatsApp" : "SMS"}
        </strong>{" "}
        · valid for 5 mins.
      </p>

      <div
        style={{
          background: COLORS.gray50,
          border: `1px solid ${COLORS.gray100}`,
          borderRadius: 10,
          padding: "10px 12px",
          fontSize: 12.5,
          color: COLORS.gray600,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 14,
        }}
      >
        <span>
          OTP sent to{" "}
          <strong style={{ color: COLORS.navy }}>
            {maskedPhone || phone}
          </strong>
        </span>
        <span
          style={{
            color: COLORS.navy,
            fontWeight: 600,
            fontSize: 12,
            cursor: "pointer",
          }}
          onClick={handleEditPhone}
        >
          Change
        </span>
      </div>

      <div className="otpRow">
        <OTPInput
          value={otp}
          onChange={setOtp}
          numInputs={4}
          inputType="tel"
          shouldAutoFocus
          renderInput={(p) => <input {...p} />}
          renderSeparator={null as any}
          containerStyle="otpContainer"
          inputStyle="otpBoxNew"
        />
      </div>

      {props.otpFail && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            color: "#DC2626",
            fontSize: 12,
            marginTop: 8,
          }}
        >
          <BiError style={{ fontSize: "1rem" }} />
          <span>OTP is not valid</span>
        </div>
      )}

      <button
        type="button"
        onClick={submitOtpHandler}
        disabled={!!props.loading}
        style={{
          background: COLORS.navy,
          color: COLORS.white,
          border: "none",
          padding: "14px 18px",
          borderRadius: 10,
          fontFamily: "inherit",
          fontSize: 15,
          fontWeight: 600,
          cursor: props.loading ? "not-allowed" : "pointer",
          width: "100%",
          marginTop: 16,
          opacity: props.loading ? 0.6 : 1,
          transition: "all 0.15s",
        }}
      >
        {props.loading ? "Verifying…" : "Verify & continue"}
      </button>

      <div
        style={{
          textAlign: "center",
          marginTop: 12,
          fontSize: 12,
          color: COLORS.gray600,
        }}
      >
        {counter > 0 ? (
          <>
            Didn&apos;t get it?{" "}
            <strong style={{ color: COLORS.navy }}>
              Resend in {minutes}:{seconds}
            </strong>
          </>
        ) : (
          <>
            Didn&apos;t get it?{" "}
            <span
              style={{
                fontWeight: 600,
                cursor: props.loading ? "not-allowed" : "pointer",
                color: props.loading ? COLORS.gray400 : "#3A85FC",
              }}
              onClick={!props.loading ? verifyRecaptchaHandler : undefined}
            >
              {props.loading ? "Sending…" : "Resend OTP"}
            </span>
          </>
        )}
      </div>

      <ReCAPTCHA
        size="invisible"
        sitekey={RECAPTCHA_SITE_KEY}
        ref={recaptchaRef}
        onChange={onRecaptchaChange}
        className="hidden"
      />
    </div>
  );

  const detailsFormBlock = (
    <div style={{ padding: "28px 24px 18px" }}>
      <h2
        className="botLoginSerif"
        style={{
          fontSize: 30,
          fontWeight: 400,
          lineHeight: 1.1,
          letterSpacing: "-0.02em",
          marginBottom: 8,
          color: COLORS.navy,
        }}
      >
        Just a few details
      </h2>
      <p
        style={{
          fontSize: 13,
          color: COLORS.gray600,
          lineHeight: 1.5,
          marginBottom: 18,
        }}
      >
        We&apos;ll personalize your trip with these.
      </p>

      {(props.newUser || (props.otpSent && !props.name)) && (
        <div style={{ marginBottom: 12 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: COLORS.gray600,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: 6,
            }}
          >
            Full name
          </div>
          <input
            type="text"
            placeholder="Enter your full name"
            style={{
              width: "100%",
              border: `1px solid ${COLORS.gray200}`,
              borderRadius: 10,
              padding: "12px 14px",
              fontSize: 15,
              outline: "none",
              fontFamily: "inherit",
              color: COLORS.navy,
              background: COLORS.white,
            }}
            onChange={(e) => _userDetailsOnChangeHandler(e, "userName")}
          />
          {userNameError && (
            <div
              style={{
                color: "#DC2626",
                fontSize: 12,
                marginTop: 4,
              }}
            >
              Please enter a valid name
            </div>
          )}
        </div>
      )}

      {(props.newUser || (props.otpSent && !props.email)) && (
        <div style={{ marginBottom: 6 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: COLORS.gray600,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: 6,
            }}
          >
            Email
          </div>
          <input
            type="email"
            placeholder="Enter your email"
            style={{
              width: "100%",
              border: `1px solid ${COLORS.gray200}`,
              borderRadius: 10,
              padding: "12px 14px",
              fontSize: 15,
              outline: "none",
              fontFamily: "inherit",
              color: COLORS.navy,
              background: COLORS.white,
            }}
            onChange={(e) => _userDetailsOnChangeHandler(e, "email")}
          />
          {props.emailFail && (
            <div
              style={{
                color: "#DC2626",
                fontSize: 12,
                marginTop: 4,
              }}
            >
              {props.emailfailmessage || "Invalid email"}
            </div>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={submitOtpHandler}
        disabled={!!props.loading}
        style={{
          background: COLORS.navy,
          color: COLORS.white,
          border: "none",
          padding: "14px 18px",
          borderRadius: 10,
          fontFamily: "inherit",
          fontSize: 15,
          fontWeight: 600,
          cursor: props.loading ? "not-allowed" : "pointer",
          width: "100%",
          marginTop: 16,
          opacity: props.loading ? 0.6 : 1,
        }}
      >
        {props.loading ? "Saving…" : "Continue"}
      </button>
    </div>
  );

  const trustFooter = (
    <div
      style={{
        background: COLORS.gray50,
        borderTop: `1px solid ${COLORS.gray100}`,
        padding: "14px 20px 18px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 14,
          justifyContent: "center",
          flexWrap: "wrap",
          fontSize: 11,
          color: COLORS.gray600,
          fontWeight: 500,
        }}
      >
        <span
          style={{ display: "inline-flex", alignItems: "center", gap: 5 }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
          Secure
        </span>
        <span
          style={{ display: "inline-flex", alignItems: "center", gap: 5 }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
          </svg>
          1,00,000+ Kaira Crafted holidays
        </span>
      </div>
      <div
        style={{
          display: "flex",
          gap: 14,
          justifyContent: "center",
          flexWrap: "wrap",
          fontSize: 11,
          color: COLORS.gray600,
          fontWeight: 500,
          marginTop: 6,
        }}
      >
        <span
          style={{ display: "inline-flex", alignItems: "center", gap: 5 }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20" />
            <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
          </svg>
          100+ countries
        </span>
        <span
          style={{ display: "inline-flex", alignItems: "center", gap: 5 }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          Real human concierge 24/7
        </span>
      </div>
      {props.isTailored ? (
        <>
          <div
            style={{
              fontSize: 11,
              color: COLORS.gray600,
              marginTop: 12,
              lineHeight: 1.5,
            }}
          >
            To unlock all features in your itinerary, we recommend logging in.
            It&apos;s free.
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 12,
              marginTop: 4,
              fontSize: 11,
            }}
          >
            <Link
              href="/terms-conditions"
              target="_blank"
              style={{ color: "#3A85FC", textDecoration: "none" }}
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy-policy"
              target="_blank"
              style={{ color: "#3A85FC", textDecoration: "none" }}
            >
              Privacy Policy
            </Link>
          </div>
        </>
      ) : (
        <div
          style={{
            marginTop: 12,
            fontSize: 10,
            color: COLORS.gray400,
            lineHeight: 1.5,
          }}
        >
          By continuing you agree to our{" "}
          <Link
            href="/terms-conditions"
            target="_blank"
            style={{ color: COLORS.gray600, textDecoration: "underline" }}
          >
            Terms
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy-policy"
            target="_blank"
            style={{ color: COLORS.gray600, textDecoration: "underline" }}
          >
            Privacy Policy
          </Link>
          .
        </div>
      )}
    </div>
  );

  // Compose screen by state
  const screen = props.loadingsocial ? (
    <>
       {isPageWide ? yellowStrip : null}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "64px 24px",
        }}
      >
        <LoginLoadingIcon width={"7rem"} />
      </div>
    </>
  ) : !props.otpSent ? (
    <>
      {isPageWide ? yellowStrip : null}
      {heroBlock}
      {kairaBlock}
      {phoneFormBlock}
      {trustFooter}
    </>
  ) : userDetailsRequired ? (
    <>
      {isPageWide ? yellowStrip : null}
      {detailsFormBlock}
      {trustFooter}
    </>
  ) : (
    <>
      {isPageWide ? yellowStrip : null}
      {otpFormBlock}
      {trustFooter}
    </>
  );

  // ── Layout container (lightbox vs bottom sheet) ──
  const handleClose = () => {
    console.log("Closing login modal");
    props.onhide();
  };

  const handleBackdropClick = () => {
    if (!props.hideloginclose) props.onhide();
  };

  if (typeof document === "undefined") return null;
  if (!layoutReady) return null;

  const z = props.zIndex || 3300;
  const backdropZ = Number(z) - 1;

  const closeButton = (
    <button
      type="button"
      onClick={handleClose}
      aria-label="Close"
      style={{
        position: "absolute",
        top: isPageWide ? 14 : 28,
        right: 14,
        width: 32,
        height: 32,
        borderRadius: "50%",
        background: COLORS.white,
        border: `1px solid ${COLORS.gray100}`,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: COLORS.gray600,
        zIndex: 10,
        boxShadow: "0 2px 8px rgba(15,27,45,0.06)",
      }}
    >
      <RxCross2 />
    </button>
  );

  const node = (
    <>
      <style jsx global>{`
        .botLoginSerif,
        .botLoginSerif * {
          font-family: "Instrument Serif", serif !important;
        }
        .otpContainer {
          display: flex !important;
          gap: 0.45rem;
          width: 100%;
        }
        .otpBoxNew {
          flex: 1 1 0% !important;
          min-width: 0 !important;
          width: 100% !important;
          height: 50px;
          border: 1.5px solid #e5e7eb;
          border-radius: 10px;
          text-align: center;
          font-size: 20px;
          font-weight: 600;
          outline: none;
          background: white;
          color: ${COLORS.navy};
        }
        .otpBoxNew:focus {
          border-color: ${COLORS.navy};
        }
      `}</style>

      <div
        onClick={handleBackdropClick}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15, 26, 46, 0.55)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          zIndex: backdropZ,
        }}
      />

      {isPageWide ? (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: COLORS.white,
            borderRadius: 20,
            width: "min(420px, 95vw)",
            maxHeight: "92vh",
            overflowY: "auto",
            zIndex: z as number,
            boxShadow: "0 12px 40px rgba(15, 27, 45, 0.16)",
          }}
        >
          {closeButton}
          {screen}
        </div>
      ) : (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 0,
            background: COLORS.white,
            borderRadius: "20px 20px 0 0",
            maxHeight: "92vh",
            overflowY: "auto",
            zIndex: z as number,
            boxShadow: "0 -16px 40px rgba(0,0,0,0.18)",
          }}
        >
          {yellowStrip}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "8px 0 4px",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 36,
                height: 5,
                borderRadius: 3,
                background: "#D1D5DB",
              }}
            />
          </div>
          {closeButton}
          {screen}
        </div>
      )}
    </>
  );

  return createPortal(node, document.body);
};

const mapStateToProps = (state: any) => ({
  otpFail: state.auth.otpFail,
  mobileFail: state.auth.mobileFail,
  mobilefailmessage: state.auth.mobilefailmessage,
  otpSent: state.auth.otpSent,
  loading: state.auth.loading,
  loadingsocial: state.auth.loadingsocial,
  newUser: state.auth.newUser,
  name: state.auth.name,
  emailFail: state.auth.emailFail,
  token: state.auth.token,
  phone: state.auth.phone,
  email: state.auth.email,
  emailfailmessage: state.auth.emailfailmessage,
  CountryCodes: state.CountryCodes,
});

const mapDispatchToProps = (dispatch: any) => ({
  onAuth: (
    mobile: string,
    password: string,
    name: string | null,
    email: string | null,
    whatsapp: boolean,
    country: any,
    onSuccess: any,
    trackUserLogin: any,
  ) =>
    dispatch(
      authaction.auth(
        mobile,
        password,
        name,
        email,
        whatsapp,
        country,
        onSuccess,
        trackUserLogin,
      ),
    ),
  onOtp: (data: any) => dispatch(otpaction.getotp(data)),
  onResetLogin: () => dispatch(authaction.authResetLogin()),
  onStartLoading: () => dispatch(authaction.authStartLoading()),
  onUpdate: (data: any, tracker: any) =>
    dispatch(authaction.changeUserDetails(data, tracker)),
  authCloseLogin: () => dispatch(authaction.authCloseLogin()),
  getCountryCodes: () => dispatch(getCountryCodes()),
});

export default connect(mapStateToProps, mapDispatchToProps)(BotLoginModalRaw);

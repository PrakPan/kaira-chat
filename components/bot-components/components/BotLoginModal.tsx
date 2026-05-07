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

const BotLoginModalRaw: React.FC<BotLoginModalProps> = (props) => {
  const isPageWide = useMediaQuery("(min-width: 768px)");
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
      if (phoneNumber.replace(/\D/g, "").length < 10) {
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

  // ── UI fragments ──
  const trustStrip = (
    <div className="flex flex-wrap justify-center gap-x-2 gap-y-1 mt-4 pt-3 border-t border-[#E5E7EB] text-[11px] text-[#6B7280]">
      <span>🔒 Secure</span>
      <span>·</span>
      <span>📄 GST invoice</span>
      <span>·</span>
      <span>🛡 10,000+ trips planned</span>
    </div>
  );

  const legal = props.isTailored ? (
    <>
      <div className="text-[11px] text-[#6B7280] text-center mt-3">
        To unlock all features in your itinerary, we recommend logging in. It's
        free.
      </div>
      <div className="flex justify-center gap-3 items-center text-[11px] mt-1">
        <Link
          href="/terms-conditions"
          target="_blank"
          className="text-[#3A85FC] no-underline"
        >
          Terms of Service
        </Link>
        <Link
          href="/privacy-policy"
          target="_blank"
          className="text-[#3A85FC] no-underline"
        >
          Privacy Policy
        </Link>
      </div>
    </>
  ) : (
    <div className="text-[10.5px] text-[#6B7280] leading-[1.5] mt-3 text-center">
      By continuing you agree to our{" "}
      <Link
        href="/terms-conditions"
        target="_blank"
        className="text-[#0F1A2E] underline"
      >
        Terms
      </Link>{" "}
      and{" "}
      <Link
        href="/privacy-policy"
        target="_blank"
        className="text-[#0F1A2E] underline"
      >
        Privacy Policy
      </Link>
      .
    </div>
  );

  // Phone-input form (initial screen)
  const phoneForm = (
    <>
      <div className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-[0.05em] mb-1.5">
        Mobile number
      </div>
      <div
        className={`flex border-[1.5px] rounded-xl overflow-hidden focus-within:border-[#0F1A2E] transition-colors relative ${
          phoneError ? "border-[#DC2626]" : "border-[#E5E7EB]"
        }`}
      >
        <div
          className="flex items-center gap-1.5 px-3 py-3 bg-[#FAFAF7] border-r border-[#E5E7EB] text-sm font-semibold cursor-pointer select-none"
          onClick={() => setOpenCountryCodeOption(true)}
        >
          {props.CountryCodes && props.CountryCodes[extension]?.img ? (
            <Image
              src={props.CountryCodes[extension].img}
              alt=""
              height={20}
              width={20}
              style={{ borderRadius: "50%", objectFit: "cover" }}
            />
          ) : (
            <span className="text-base">🇮🇳</span>
          )}
          <span>
            {props.CountryCodes && props.CountryCodes[extension]?.label
              ? props.CountryCodes[extension].label
              : "+91"}
          </span>
          <span
            style={{
              width: 0,
              height: 0,
              borderLeft: "4px solid transparent",
              borderRight: "4px solid transparent",
              borderTop: "5px solid #6B7280",
              marginLeft: 2,
            }}
          />
        </div>
        {openCountryCodeOption && (
          <div className="absolute top-full left-0 mt-1 z-[10000]">
            <CountryCodeDropdown
              onClose={() => setOpenCountryCodeOption(false)}
              CountryCodes={props.CountryCodes}
              handleExtensionChangeOption={handleExtensionChangeOption}
              setOpenCountryCodeOption={setOpenCountryCodeOption}
            />
          </div>
        )}
        <input
          ref={mobileRef}
          type="tel"
          inputMode="numeric"
          placeholder="98XXX XXXXX"
          maxLength={15}
          className="flex-1 px-3 py-3 border-none outline-none text-[15px] font-inherit min-w-0"
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

      {phoneError && (
        <div className="flex items-center gap-1 text-[#DC2626] text-[12px] mt-1.5">
          <BiError style={{ fontSize: "1rem" }} />
          <span>{phoneError}</span>
        </div>
      )}

      {!phoneError && props.mobileFail && props.mobilefailmessage && (
        <div className="flex items-center gap-1 text-[#DC2626] text-[12px] mt-1.5">
          <BiError style={{ fontSize: "1rem" }} />
          <span>{props.mobilefailmessage}</span>
        </div>
      )}

      {/* <div
        className="flex items-center gap-1.5 mt-3 cursor-pointer text-[13px] text-[#0F1A2E]"
        onClick={() => setWhatsapp(!whatsapp)}
      >
        {whatsapp ? (
          <ImCheckboxChecked className="text-[#3A85FC]" />
        ) : (
          <ImCheckboxUnchecked />
        )}
        <span>Receive OTP on WhatsApp</span>
        <IoLogoWhatsapp className="text-base text-[#25D366]" />
      </div> */}

      <button
        type="button"
        onClick={verifyRecaptchaHandler}
        disabled={!!props.loading}
        className="w-full mt-3 py-3.5 rounded-xl font-semibold text-[14px] flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1FB855] text-white disabled:opacity-60"
      >
        {props.loading ? (
          <span>Sending…</span>
        ) : (
          <>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="white"
              aria-hidden
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Send OTP on WhatsApp
          </>
        )}
      </button>

      <div className="text-center text-[12.5px] text-[#6B7280] mt-3">
        or{" "}
        <span
          className="text-[#0F1A2E] font-semibold cursor-pointer"
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
    </>
  );

  // OTP screen
  const otpScreen = (
    <>
      <div className="inline-flex items-center gap-1.5 bg-[#FFF9DB] text-[#92400E] px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.05em] mb-3">
        📱 One more step
      </div>
      <div className="text-[20px] font-bold leading-[1.25] tracking-[-0.02em] mb-1.5">
        Enter the 4-digit OTP
      </div>
      <div className="text-[12.5px] text-[#6B7280] leading-[1.45] mb-3">
        Sent to your {whatsapp ? "WhatsApp" : "SMS"} · valid for 5 mins.
      </div>

      <div className="bg-[#F9FAFB] rounded-[10px] px-3 py-2.5 text-[12.5px] text-[#6B7280] flex items-center justify-between mb-3">
        <span>
          OTP sent to{" "}
          <strong className="text-[#0F1A2E]">{maskedPhone || phone}</strong>
        </span>
        <span
          className="text-[#0F1A2E] font-semibold no-underline text-[12px] cursor-pointer"
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
        <div className="flex items-center gap-1 text-[#DC2626] text-[12px] mt-2">
          <BiError style={{ fontSize: "1rem" }} />
          <span>OTP is not valid</span>
        </div>
      )}

      <button
        type="button"
        onClick={submitOtpHandler}
        disabled={!!props.loading}
        className="w-full mt-4 py-3.5 rounded-xl font-semibold text-[14px] flex items-center justify-center gap-2 bg-[#0F1A2E] hover:bg-[#1A2842] text-white disabled:opacity-60"
      >
        {props.loading ? "Verifying…" : "Verify & continue"}
      </button>

      <div className="text-center mt-3 text-[12px] text-[#6B7280]">
        {counter > 0 ? (
          <>
            Didn't get it?{" "}
            <strong className="text-[#0F1A2E]">
              Resend in {minutes}:{seconds}
            </strong>
          </>
        ) : (
          <>
            Didn't get it?{" "}
            <span
              className={`font-semibold cursor-pointer ${
                props.loading ? "text-gray-400" : "text-[#3A85FC]"
              }`}
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
    </>
  );

  // New-user details form (collected after OTP for new accounts)
  const detailsForm = (
    <>
      <div className="text-[20px] font-bold leading-[1.25] tracking-[-0.02em] mb-1.5">
        Just a few details
      </div>
      <div className="text-[12.5px] text-[#6B7280] leading-[1.45] mb-4">
        We'll personalize your trip with these.
      </div>

      {(props.newUser || (props.otpSent && !props.name)) && (
        <div className="mb-3">
          <div className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-[0.05em] mb-1.5">
            Full name
          </div>
          <input
            type="text"
            placeholder="Enter your full name"
            className="w-full border-[1.5px] border-[#E5E7EB] rounded-xl px-3 py-3 text-[15px] outline-none focus:border-[#0F1A2E]"
            onChange={(e) => _userDetailsOnChangeHandler(e, "userName")}
          />
          {userNameError && (
            <div className="text-[#DC2626] text-[12px] mt-1">
              Please enter a valid name
            </div>
          )}
        </div>
      )}

      {(props.newUser || (props.otpSent && !props.email)) && (
        <div className="mb-2">
          <div className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-[0.05em] mb-1.5">
            Email
          </div>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full border-[1.5px] border-[#E5E7EB] rounded-xl px-3 py-3 text-[15px] outline-none focus:border-[#0F1A2E]"
            onChange={(e) => _userDetailsOnChangeHandler(e, "email")}
          />
          {props.emailFail && (
            <div className="text-[#DC2626] text-[12px] mt-1">
              {props.emailfailmessage || "Invalid email"}
            </div>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={submitOtpHandler}
        disabled={!!props.loading}
        className="w-full mt-4 py-3.5 rounded-xl font-semibold text-[14px] bg-[#0F1A2E] hover:bg-[#1A2842] text-white disabled:opacity-60"
      >
        {props.loading ? "Saving…" : "Continue"}
      </button>
    </>
  );

  // Common header (badge + title + subtitle) shown on initial phone screen
  const introHeader = (
    <>
      <div className="inline-flex items-center gap-1.5 bg-[#FFF9DB] text-[#92400E] px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.05em] mb-3">
        🔓 Almost there
      </div>
      <div className="text-[20px] sm:text-[22px] font-bold leading-[1.25] tracking-[-0.02em] mb-1.5">
        {props.message || "Login to see live prices & book"}
      </div>
      <div className="text-[12.5px] sm:text-[13px] text-[#6B7280] leading-[1.5] mb-4">
        10 seconds. We'll send the OTP on{" "}
        {whatsapp ? "WhatsApp" : "SMS"}.
      </div>
    </>
  );

  const benefits = (
    <div
      className={`gap-2 mb-4 ${
        isPageWide ? "grid grid-cols-2" : "flex flex-col"
      }`}
    >
      {[
        {
          icon: "💸",
          bg: "#FEF3C7",
          title: "Live prices, locked 24h",
          desc: "Real fares held while you decide",
        },
        {
          icon: "💬",
          bg: "#DCFCE7",
          title: "WhatsApp deals + concierge",
          desc: "Member fares, real human 24×7",
        },
        {
          icon: "📌",
          bg: "#DBEAFE",
          title: "Save plan, any device",
          desc: "Pick up exactly where you left",
        },
        {
          icon: "🧭",
          bg: "#FCE7F3",
          title: "Live trip companion",
          desc: "Kaira on standby through travel",
        },
      ].map((b, i) =>
        isPageWide ? (
          <div
            key={i}
            className="bg-[#FAFAF7] border-[1px] rounded-xl p-2.5 transition-all hover:border-[#FFDD00] hover:bg-[#FFFCEF]"
          >
            <div
              className="w-[30px] h-[30px] rounded-lg flex items-center justify-center text-[15px] mb-2"
              style={{ background: b.bg }}
            >
              {b.icon}
            </div>
            <div className="text-[12px] font-bold leading-[1.3] mb-0.5">
              {b.title}
            </div>
            <div className="text-[11px] text-[#6B7280] leading-[1.4]">
              {b.desc}
            </div>
          </div>
        ) : (
          <div
            key={i}
            className="flex items-center gap-2.5 px-2.5 py-[8px] bg-[#FAFAF7] border-[1px]  rounded-[10px] shadow-none"
          >
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center text-[14px] flex-shrink-0"
              style={{ background: b.bg }}
            >
              {b.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-semibold leading-[1.3]">
                {b.title}
              </div>
              <div className="text-[10.5px] text-[#6B7280] leading-[1.35] mt-px">
                {b.desc}
              </div>
            </div>
          </div>
        ),
      )}
    </div>
  );

  // Main inner content
  const screen = props.loadingsocial ? (
    <div className="flex items-center justify-center py-16">
      <LoginLoadingIcon width={"7rem"} />
    </div>
  ) : !props.otpSent ? (
    <>
      {introHeader}
      {benefits}
      {phoneForm}
      {trustStrip}
      {legal}
    </>
  ) : userDetailsRequired ? (
    detailsForm
  ) : (
    otpScreen
  );

  // Skip-login hint for tailored
  const skipLogin = props.isTailored && (
    <div
      className="text-center text-[#3A85FC] cursor-pointer text-[13px] mt-3"
      onClick={() => {
        props.onhide();
        props.onSkipLogin && props.onSkipLogin();
      }}
    >
      Continue without logging in?
    </div>
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

  const z = props.zIndex || 3300;
  const backdropZ = Number(z) - 1;

  const node = (
    <>
      <style jsx global>{`
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
        }
        .otpBoxNew:focus {
          border-color: #0f1a2e;
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
            background: "white",
            borderRadius: 24,
            width: "min(460px, 95vw)",
            maxHeight: "92vh",
            overflowY: "auto",
            zIndex: z as number,
            boxShadow: "0 32px 80px rgba(0,0,0,0.35)",
          }}
        >
          {/* Yellow accent bar */}
          <div
            style={{
              height: 6,
              background:
                "linear-gradient(90deg, #FFDD00 0%, #FFC107 100%)",
            }}
          />
          <div style={{ position: "relative", padding: 24 }}>
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close"
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.95)",
                border: "1px solid #E5E7EB",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#6B7280",
                zIndex: 5,
              }}
            >
              <RxCross2 />
            </button>
            {screen}
            {skipLogin}
          </div>
        </div>
      ) : (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 0,
            background: "white",
            borderRadius: "24px 24px 0 0",
            maxHeight: "92vh",
            display: "flex",
            flexDirection: "column",
            zIndex: z as number,
            boxShadow: "0 -16px 40px rgba(0,0,0,0.18)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "10px 0 6px",
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
          <div
            style={{
              padding: "8px 20px 24px",
              overflowY: "auto",
              flex: 1,
            }}
          >
            <div className="flex justify-end -mt-1 mb-1">
              <RxCross2
                onClick={handleClose}
                style={{
                  fontSize: "1.4rem",
                  cursor: "pointer",
                  color: "#6B7280",
                }}
              />
            </div>
            {screen}
            {skipLogin}
          </div>
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

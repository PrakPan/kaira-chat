import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import Button from "../ui/button/Index";
import { connect } from "react-redux";
import * as authaction from "../../store/actions/auth";
import * as otpaction from "../../store/actions/getOtp";
import Spinner from "../Spinner";
import styled from "styled-components";
import Link from "next/link";
import CountryCodeDropdown from "./CountryDropdown";
import { ImCheckboxUnchecked, ImCheckboxChecked } from "react-icons/im";
import OTPInput from "react-otp-input";
import FloatingInput from "../ui/input/FloatingInput";
import { BiError } from "react-icons/bi";
import { IoLogoWhatsapp } from "react-icons/io";
import ReCAPTCHA from "react-google-recaptcha";
import LoginLoadingIcon from "../ui/LoadingLottie";
import media from "../media";
import { useGoogleLogin } from "@react-oauth/google";
import { getCountryCodes } from "../../store/actions/countryCodes";
import { RECAPTCHA_SITE_KEY } from "../../services/constants";
import { useAnalytics } from "../../hooks/useAnalytics";
import { RxCross2 } from "react-icons/rx";
import { FaEdit, FaPen } from "react-icons/fa";

const MobileNumberContainer = styled.div`
  display: grid;
  grid-template-columns: 90px 1fr;
  gap: 8px;
`;

const WhatsappCheckBox = styled.div`
  cursor: pointer;
  font-weight: 400;
  font-size: 14px;
  line-height: 16px;
  display: flex;
  gap: 0.3rem;
  margin-top: 16px;
  align-items: center;
`;

const ErrorText = styled.div`
  color: red;
  font-size: 13px;
  margin-top: 5px;
  margin-left: 5px;
  height: 1rem;
  display: flex;
  align-items: center;
`;

const OtpContainer = styled.div`
  div {
    display: grid !important;
    grid-template-columns: 1fr 1fr 1fr 1fr !important;
    gap: 0.8rem;
  }
  .otpBox {
    width: 100% !important;
    border: 1px solid #d0d5dd;
    border-radius: 8px;
    height: 3rem;
    box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05);
  }
`;

const CountryImg = styled(Image)`
  background-position: cover;
  alt: "";
`;

var userDetails = {
  firstName: "",
  lastName: "",
  userName: "",
  email: "",
};

const LogIn = React.memo((props) => {
  let isPageWide = media("(min-width: 768px)");

  const mobileRef = useRef();
  const recaptchaRef = useRef(null);
  const [phone, setPhone] = useState("");
  const [otpResent, setOtpResent] = useState(false);
  const [whatsapp, setWhatsapp] = useState(true);
  const [extension, setExtension] = useState("India"); //store extension
  const [openCountryCodeOption, setOpenCountryCodeOption] = useState(false);
  const [otp, setOtp] = useState("");
  const [userNameError, setUserNameError] = useState(false);
  const [counter, setCounter] = useState(30);
  let email = null; //JSX for email
  let password = null; //JSX for OTP
  let mobileInput = null; //JSX for mobile input field
  const [userDetailsRequired, setUserDetailsRequired] = useState(false);
  const { trackUserLogin, trackUserAccountUpdate } = useAnalytics();
  const [skipLogin, setSkipLogin] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    props.getCountryCodes();
  }, []);

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

  const minutes = String(Math.floor(counter / 60)).padStart(2, "0");
  const seconds = String(counter % 60).padStart(2, "0");

  useEffect(() => {
    if (
      props.token &&
      props.phone &&
      props.name &&
      props.token &&
      props.name &&
      props.phone !== "null" &&
      props.token &&
      props.name &&
      props.phone !== null
    )
      props.authCloseLogin();
  }, [props.name, props.phone, props.token]);

  useEffect(() => {
    props.onResetLogin();
    if (mobileRef.current) {
      mobileRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (otp.length > 3) {
      submitOtpHandler();
    }
  }, [otp]);

  const handleExtensionChangeOption = (country) => {
    setExtension(country);
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

  //Change user details on key press
  const _userDetailsOnChangeHandler = (event, target) => {
    userDetails = {
      ...userDetails,
      [target]: event.target.value,
    };
  };

  const handleMobileBlur = () => {
    const phone = mobileRef.current.value;
    setPhone(phone);
  };

  const separateCountryCode = (phoneNumber) => {
    const pattern = /^(\+\d{1,3})(\d{10})$/;
    const match = phoneNumber.match(pattern);

    if (match) {
      return {
        countryCode: match[1],
        number: match[2],
      };
    } else {
      return null; // Invalid phone number format
    }
  };

  const checkNewUserData = () => {
    return 1;
  };

  //Submit OTP
  const submitOtpHandler = () => {
    setUserNameError(false);

    if (userDetailsRequired == false && props.newUser) {
      setUserDetailsRequired(true);
      return;
    }


    if (props.newUser) {
      const newUserValidity = checkNewUserData();

      if (!userDetails.userName) return setUserNameError(true);

      if (newUserValidity)
        props.onAuth(
          phone,
          otp,
          userDetails.userName,
          userDetails.email,
          whatsapp,
          props.CountryCodes[extension].value,
          props.onSuccess,
          trackUserLogin
        );
    } else if (props.otpSent && !props.name) {
      props.onAuth(
        phone,
        otp,
        userDetails.userName,
        null,
        setUserDetailsRequired,
        whatsapp,
        null,
        props.onSuccess,
        trackUserLogin
      );
    } else if (props.otpSent && !props.name && !props.email) {
      props.onAuth(
        phone,
        otp,
        userDetails.userName,
        userDetails.email,
        whatsapp,
        null,
        props.onSuccess,
        trackUserLogin
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
        trackUserLogin
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
        trackUserLogin
      );
    }
  };

  //Store OTP
  const handleOtpChange = (OTP) => {
    setOtp(OTP);
  };

  //Set Mobile
  const handleMobileChange = (event) => {
    setPhone(event.target.value);
  };

  //Dispatch Action
  const otpHandler = (token) => {
    const phoneNumber = phone.trim();
    if (phoneNumber.length <= 10) {
      const mobile = props.CountryCodes
        ? props.CountryCodes[extension].label + phoneNumber
        : `+91${phoneNumber}`;
      setPhone(mobile);
      const data = {
        token: token,
        mobile: mobile,
        whatsapp: whatsapp,
      };
      props.onOtp(data);
    } else {
      setPhone(phoneNumber);
      const data = {
        token: token,
        mobile: phoneNumber,
        whatsapp: whatsapp,
      };
      props.onOtp(data);
    }
    recaptchaRef.current.reset();
  };

  //TEST
  const resetOtpHandler = (token) => {
    const data = {
      token: token,
      mobile: phone,
      whatsapp: whatsapp,
    };
    props.onOtp(data);
    setOtpResent((prev) => !prev);
    setCounter(30);
    recaptchaRef.current.reset();
  };

  //Update phone
  const _updatePhoneHandler = () => {
    props.onUpdate(
      {
        phone: phone,
        whatsapp_opt_in: whatsapp,
      },
      trackUserAccountUpdate
    );
  };

  const _handlePhoneUpdate = () => {
    props.onResetLogin();
    mobileRef.current.focus();
  };

  const _handleGoogleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => props.onGoogleAuth(tokenResponse),
  });

  const onRecaptchaChange = (value) => {
    if (!value) {
      console.warn("Recaptcha returned null");
      return;
    }
    if (!props.otpSent) otpHandler(value);
    else resetOtpHandler(value);
  };

  const verifyRecaptchaHandler = () => {
    if (props.mobileFail) {
      props.onResetLogin();
    }

    if (!props.otpSent) {
      props.onStartLoading();
    } else {
      props.onStartLoading();
    }

    const recaptchaValue = recaptchaRef.current.getValue();
    if (recaptchaValue) {
      if (!props.otpSent) otpHandler(recaptchaValue);
      else resetOtpHandler(recaptchaValue);
    } else {
      recaptchaRef.current.execute();
    }
  };

  const handleEditPhone = () => {
    setOtp("");
    setUserDetailsRequired(false);
    setCounter(30);
    props.onResetLogin();

    setTimeout(() => {
      if (mobileRef.current) {
        mobileRef.current.focus();
      }
    }, 100);
  };

  mobileInput = (
    <div className="w-full">
      <input
        required
        error={props.mobileFail ? true : false}
        helperText={props.mobileFail ? props.mobilefailmessage : null}
        disabled={props.otpSent ? true : false}
        key="mobile"
        name="mobile"
        placeholder="Enter phone number"
        type="mobile"
        id="mobile"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
        value={phone}
        onChange={handleMobileChange}
        onBlur={handleMobileBlur}
        className=" !border-[0px] h-[22px] focus:outline-none w-full"
        ref={mobileRef}
        height={"22px"}
      />
    </div>
  );

  email = (
    <>
      <FloatingInput
        placeholder="Email Address"
        required
        error={props.emailFail ? true : false}
        helperText={props.emailFail ? props.emailfailmessage : null}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
        key="email"
        name="email"
        label="Email Address"
        type="email"
        id="email"
        onChange={(event) => {
          _userDetailsOnChangeHandler(event, "email");
        }}
      />
    </>
  );

  password = (
    <>
      <OtpContainer>
        <OTPInput
          value={otp}
          onChange={handleOtpChange}
          numInputs={4}
          inputType="tel"
          inputStyle="otpBox"
          renderInput={(props) => <input {...props} />}
        />
      </OtpContainer>
      {props.otpFail && (
        <ErrorText>
          <BiError style={{ fontSize: "1rem" }} />
          <span style={{ marginLeft: "2px", marginTop: "2px" }}>
            OTP is not valid
          </span>
        </ErrorText>
      )}
    </>
  );

  if (props.loadingsocial)
    return (
      <div style={{ height: "27.25rem", width: "100%", display: "flex" }}>
        <LoginLoadingIcon width={"7rem"} />
      </div>
    );

  return (
    <div
      className={`${
        isPageWide
          ? "pt-[36px] px-[32px]"
          : "pt-[12px] pb-[13px] px-[16px] h-full"
      } h-max`}
    >
      <div className="flex flex-col gap-[12px] sm:gap-[24px] h-full">
        {!isPageWide && (
          <div className="flex justify-end">
            <RxCross2
              style={{
                fontSize: "1.5rem",
                cursor: "pointer",
                zIndex: 999,
              }}
              onClick={props.onhide}
            />
          </div>
        )}
        {!props?.otpSent ? (
          <div>
            {!props.noheading && (
              <div
                style={{
                  fontSize: "32px",
                  textAlign: isPageWide ? "left" : "center",
                  margin: isPageWide
                    ? "0 0rem 32px 0rem"
                    : "0rem 0rem 1rem 0rem",
                  fontWeight: "700",
                }}
              >
                {!props?.onSuccess ? (
                  <>
                    <h1 className="text-bold font-700 text-left ">
                      {props.loginmessage ? props.loginmessage : "Welcome to"}
                    </h1>
                    <h1 className="text-bold font-700 text-left">
                      {props.loginmessage
                        ? props.loginmessage
                        : "The Tarzan Way!"}
                    </h1>
                  </>
                ) : (
                  <>
                    <h1 className="text-bold font-700">
                      {props.loginmessage
                        ? props.loginmessage
                        : props?.message || "Please login to view details"}
                    </h1>
                  </>
                )}
              </div>
            )}

            {(props.token && !props.phone) ||
            (props.token && props.phone === "null") ? (
              <p
                style={{ margin: "0 1rem 2rem 1rem", fontWeight: "700" }}
                className="text-[32px] text-center"
              >
                This is where your experience captain can reach you to
                personalize your plan.
              </p>
            ) : null}

            {(props.token && !props.phone) ||
            (props.token && props.phone == "null") ? (
              <form noValidate>
                <div className="Body2R_14 mb-[6px]">Phone Number</div>
                <MobileNumberContainer className="border-[1px] border-[#d0d5dd] rounded-lg p-[10px]">
                  <div
                    className="w-fit flex flex-row gap-3 px-2 items-center cursor-pointer border-r-2 border-black"
                    onClick={() => setOpenCountryCodeOption(true)}
                  >
                    <div className="flex gap-3">
                      <CountryImg
                        height="30"
                        width="30"
                        objectFit="cover"
                        src={
                          props.CountryCodes
                            ? props.CountryCodes[extension].img
                            : ""
                        }
                      ></CountryImg>
                      <div className="Body2R_14">
                        {props?.CountryCodes[extension].label || +91}
                      </div>
                    </div>
                  </div>

                  {openCountryCodeOption && (
                    <CountryCodeDropdown
                      onClose={() => setOpenCountryCodeOption(false)}
                      CountryCodes={props.CountryCodes}
                      handleExtensionChangeOption={handleExtensionChangeOption}
                      setOpenCountryCodeOption={setOpenCountryCodeOption}
                    />
                  )}
                  <div className="Body2R_14">{mobileInput}</div>
                </MobileNumberContainer>

                {/* ADD THIS ERROR DISPLAY RIGHT AFTER MobileNumberContainer */}
                {props.mobileFail && props.mobilefailmessage && (
                  <ErrorText>
                    <BiError style={{ fontSize: "1rem" }} />
                    <span style={{ marginLeft: "2px", marginTop: "2px" }}>
                      {props.mobilefailmessage}
                    </span>
                  </ErrorText>
                )}

                <WhatsappCheckBox onClick={() => setWhatsapp(!whatsapp)}>
                  {whatsapp ? <ImCheckboxChecked /> : <ImCheckboxUnchecked />}{" "}
                  Receive OTP on WhatsApp
                  <IoLogoWhatsapp className="text-lg text-[#4DA750]" />
                </WhatsappCheckBox>

                <Button
                  onclick={_updatePhoneHandler}
                  error={props.mobileFail ? true : false}
                  loading={props.loading}
                  margin={props.nospacing ? "4rem 0 2rem 0" : "2rem 0"}
                  width="100%"
                  bgColor="#F7E700"
                  fontWeight="500"
                  fontSize="16px"
                  borderWidth="1px"
                  hoverColor="white"
                  hoverBgColor="black"
                  boxShadow="0px 2px 0px #ECEAEA"
                  borderRadius="8px"
                >
                  Complete Signup
                </Button>
              </form>
            ) : (
              <form noValidate>
                <div className="Body2R_14 mb-[6px]">Phone Number</div>
                <MobileNumberContainer className="border-[1px] border-[#d0d5dd] rounded-lg p-[10px]">
                  <div
                    className="w-fit flex flex-row gap-3 px-2 items-center cursor-pointer border-r-2 border-black"
                    onClick={() => setOpenCountryCodeOption(true)}
                  >
                    <div className="flex gap-3">
                      <CountryImg
                        height="30"
                        width="30"
                        objectFit="cover"
                        src={
                          props.CountryCodes
                            ? props.CountryCodes[extension].img
                            : ""
                        }
                      ></CountryImg>
                      <div className="Body2R_14">
                        {props?.CountryCodes[extension].label || +91}
                      </div>
                    </div>
                  </div>

                  {openCountryCodeOption && (
                    <CountryCodeDropdown
                      onClose={() => setOpenCountryCodeOption(false)}
                      CountryCodes={props.CountryCodes}
                      handleExtensionChangeOption={handleExtensionChangeOption}
                      setOpenCountryCodeOption={setOpenCountryCodeOption}
                    />
                  )}
                  <div className="Body2R_14">{mobileInput}</div>
                </MobileNumberContainer>

                {/* ADD THIS ERROR DISPLAY RIGHT AFTER MobileNumberContainer */}
                {props.mobileFail && props.mobilefailmessage && (
                  <ErrorText>
                    <BiError style={{ fontSize: "1rem" }} />
                    <span style={{ marginLeft: "2px", marginTop: "2px" }}>
                      {props.mobilefailmessage}
                    </span>
                  </ErrorText>
                )}

                <WhatsappCheckBox onClick={() => setWhatsapp(!whatsapp)}>
                  {whatsapp ? (
                    <ImCheckboxChecked className="text-[#3A85FC]" />
                  ) : (
                    <ImCheckboxUnchecked />
                  )}
                  <div className="Body2R_14">Receive OTP on Whatsapp</div>
                </WhatsappCheckBox>

                <ReCAPTCHA
                  size="invisible"
                  sitekey={RECAPTCHA_SITE_KEY}
                  ref={recaptchaRef}
                  onChange={onRecaptchaChange}
                  className="hidden"
                />
              </form>
            )}
          </div>
        ) : userDetailsRequired ? (
          <div className="flex flex-col gap-[24px]">
            <div
              style={{
                fontSize: "32px",
                textAlign: isPageWide ? "left" : "center",
                fontWeight: "700",
              }}
            >
              Just a Few Details to Get Started.
            </div>
            <div>
              {props.newUser || (props.otpSent && !props.name) ? (
                <div className="flex flex-col gap-[6px]">
                  <div className="Body2M_14">Name</div>
                  <FloatingInput
                    error={userNameError}
                    helperText={"Please enter valid username"}
                    placeholder={"Enter Your name"}
                    key="userName"
                    required
                    id="userName"
                    label="Enter Your Full Name"
                    onChange={(event) => {
                      _userDetailsOnChangeHandler(event, "userName");
                    }}
                  />
                </div>
              ) : null}

              {props.newUser || (props.otpSent && !props.email) ? (
                <div className="flex flex-col gap-[6px] mt-[20px]">
                  <div className="Body2M_14">Email</div>
                  {email}
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          <div>
            {!props.noheading && (
              <div
                style={{
                  fontSize: "32px",
                  textAlign: isPageWide ? "left" : "left",
                  fontWeight: "700",
                }}
              >
                OTP Verification
              </div>
            )}

            <div className="flex flex-col gap-[24px]">
              <div
                className={`Body1R_16 text-[#6E757A] ${
                  isPageWide ? "text-left" : "text-left"
                }`}
              >
                <div className="flex flex-wrap items-center">
                  <span className="">
                    We've sent a 4-digit OTP to your registered phone number
                  </span>
                  <span className="whitespace-nowrap font-medium mt-2">
                    {phone}
                    <span
                      className="text-blue underline cursor-pointer ml-1"
                      onClick={handleEditPhone}
                    >
                      Change
                    </span>
                  </span>
                </div>
              </div>

              {props.otpSent ? password : null}
              {counter > 0 && (
                <div className="Body1R_16 text-[#6E757A;] text-center sm:text-left">
                  You can resend OTP in{" "}
                  <span className="text-black Body1M_16">
                    {minutes}:{seconds}
                  </span>
                </div>
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
        )}

        {!props.otpSent ? (
          <>
            <Button
              onclick={verifyRecaptchaHandler}
              margin={props.nospacing ? "0" : "40px 0 0 0"}
              width="100%"
              bgColor="#07213A"
              fontWeight="500"
              fontSize="16px"
              borderWidth="1px"
              hoverColor="white"
              hoverBgColor="black"
              boxShadow="0px 2px 0px #ECEAEA"
              borderRadius="8px"
              height="50px"
              color="white"
              loading={props.loading}
            >
              Continue
            </Button>
            {props.isTailored && (
              <div
                className="text-center text-[#3A85FC] cursor-pointer Body1R_16"
                onClick={() => {
                  props.onhide();
                  if (props.onSkipLogin) {
                    props.onSkipLogin();
                  }
                }}
              >
                Continue without logging in?
              </div>
            )}
          </>
        ) : (
          <div
            className={`flex flex-col gap-[16px] ${
              !userDetailsRequired
                ? `${
                    counter == 0 && !userDetailsRequired
                      ? "mt-[30px] sm:mt-[40px]"
                      : "mt-[20px] sm:mt-[40px]"
                  }`
                : "mt-[46px]"
            }`}
          >
            {!userDetailsRequired && (
              <div className="flex gap-[16px] justify-center">
                <div className="Body1R_16 text-[#6E757A;]">
                  Didn't receive OTP?
                </div>
                {counter === 0 ? (
                  <div
                    className={`Body1R_16 cursor-pointer ${
                      props.loading
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-[#3A85FC]"
                    }`}
                    onClick={
                      !props.loading ? verifyRecaptchaHandler : undefined
                    }
                  >
                    {props.loading ? "Sending..." : "Resend OTP"}
                  </div>
                ) : (
                  <div className="Body1R_16 text-gray-400">Resend OTP</div>
                )}
              </div>
            )}
            <Button
              onclick={submitOtpHandler}
              width="100%"
              bgColor="#07213A"
              fontWeight="500"
              fontSize="16px"
              borderWidth="1px"
              hoverColor="white"
              hoverBgColor="black"
              boxShadow="0px 2px 0px #ECEAEA"
              borderRadius="8px"
              height="50px"
              color="white"
              loading={props.loading}
            >
              Continue
            </Button>
          </div>
        )}
        <div className={`${props.otpSent ? "mt-0" : "mt-12"}`}>
          {props.isTailored ? (
            <>
              <div className="Body2R_14 text-[#6E757A] text-center mb-3">
                To unlock all the features in the itinerary, we recommend
                logging in. It's free!
              </div>
              <div className="flex justify-center gap-3 items-center Body2R_14 mb-2">
                <Link
                  href="/terms-conditions"
                  style={{ textDecoration: "none" }}
                  target="_blank"
                  className="text-[#3A85FC]"
                >
                  Terms of Service
                </Link>
                <Link
                  href="/privacy-policy"
                  style={{ textDecoration: "none" }}
                  target="_blank"
                  className="text-[#3A85FC]"
                >
                  Privacy Policy
                </Link>
              </div>
            </>
          ) : (
            <div
              className={`Body2R_14 text-[#6E757A] ${
                isPageWide ? "text-center" : "text-center"
              }`}
            >
              By continuing, you agree to our{" "}
              <Link
                href="/terms-conditions"
                style={{ textDecoration: "none" }}
                target="_blank"
              >
                Terms of Service
              </Link>{" "}
              and acknowlege you've read our{" "}
              <Link
                href="/privacy-policy"
                style={{ textDecoration: "none" }}
                target="_blank"
              >
                Privacy Policy.
              </Link>
            </div>
          )}
        </div>
        {/* <div className={`${props.otpSent ? "mt-0" : "mt-12"}`}>
          <div
            className={`Body2R_14 text-[#6E757A] ${
              isPageWide ? "text-center" : "text-center"
            }`}
          >
            By continuing, you agree to our{" "}
            <Link
              href="/terms-conditions"
              style={{ textDecoration: "none" }}
              target="_blank"
            >
              Terms of Service
            </Link>{" "}
            and acknowlege you've read our{" "}
            <Link
              href="/privacy-policy"
              style={{ textDecoration: "none" }}
              target="_blank"
            >
              Privacy Policy.
            </Link>
          </div>
        </div> */}
      </div>

      {props.loadingsocial ? (
        <div
          style={{
            position: "absolute",
            height: "100%",
            width: "100%",
            top: "0",
            zIndex: "2",
            backgroundColor: "white",
          }}
          className="center-div"
        >
          <Spinner></Spinner>
        </div>
      ) : null}
    </div>
  );
});

const mapStateToPros = (state) => {
  return {
    otpFail: state.auth.otpFail,
    mobileFail: state.auth.mobileFail,
    mobilefailmessage: state.auth.mobilefailmessage,
    otpSent: state.auth.otpSent,
    loading: state.auth.loading,
    socialloading: state.auth.socialloading,
    newUser: state.auth.newUser,
    name: state.auth.name,
    emailFail: state.auth.emailFail,
    token: state.auth.token,
    phone: state.auth.phone,
    email: state.auth.email,
    authRedirectPath: state.auth.authRedirectPath,
    loadingsocial: state.auth.loadingsocial,
    emailfailmessage: state.auth.emailfailmessage,
    loginmessage: state.auth.loginmessage,
    hideloginclose: state.auth.hideloginclose,
    CountryCodes: state.CountryCodes,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAuth: (
      mobile,
      password,
      name,
      email,
      whatsapp,
      country,
      onSuccess,
      trackUserLogin
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
          trackUserLogin
        )
      ),
    onOtp: (mobile, setNewUser) =>
      dispatch(otpaction.getotp(mobile, setNewUser)),
    onResetLogin: () => dispatch(authaction.authResetLogin()),
    onStartLoading: () => dispatch(authaction.authStartLoading()),
    onGoogleAuth: (response) => dispatch(authaction.googleAuth(response)),
    onFbAuth: (response) => dispatch(authaction.fbAuth(response)),
    onUpdate: (response, trackUserAccountUpdate) =>
      dispatch(authaction.changeUserDetails(response, trackUserAccountUpdate)),
    authCloseLogin: () => dispatch(authaction.authCloseLogin()),
    getCountryCodes: () => dispatch(getCountryCodes()),
  };
};

export default connect(mapStateToPros, mapDispatchToProps)(LogIn);

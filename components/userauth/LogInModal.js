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
import { FiChevronDown } from "react-icons/fi";
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
import ImageLoader from "../../components/ImageLoader";
import { RECAPTCHA_SITE_KEY } from "../../services/constants";

const MobileNumberContainer = styled.div`
  display: grid;
  grid-template-columns: 90px 1fr;
  gap: 0.5rem;
`;

const WhatsappCheckBox = styled.div`
  cursor: pointer;
  font-weight: 400;
  font-size: 14px;
  line-height: 16px;
  display: flex;
  gap: 0.3rem;
  margin-block: 1rem 1rem;
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

const UpdatePhone = styled.p`
  padding: 0 8px;
  &:hover {
    cursor: pointer;
  }
`;

const ResendOtp = styled.p`
  float: right;
  &:hover {
    cursor: pointer;
  }
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
  let email = null; //JSX for email
  let password = null; //JSX for OTP
  let mobileInput = null; //JSX for mobile input field

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    props.getCountryCodes();
  }, []);

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
    if (otp.length > 3) {
      submitOtpHandler();
    }
  }, [otp]);

  const handleExtensionChangeOption = (country) => {
    setExtension(country);
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
          props.itinary_id
        );
    } else if (props.otpSent && !props.name) {
      props.onAuth(
        phone,
        otp,
        userDetails.userName,
        null,
        whatsapp,
        props.itinary_id
      );
    } else if (props.otpSent && !props.name && !props.email) {
      props.onAuth(
        phone,
        otp,
        userDetails.userName,
        userDetails.email,
        whatsapp,
        props.itinary_id
      );
    } else if (props.otpSent && !props.email) {
      props.onAuth(
        phone,
        otp,
        null,
        userDetails.email,
        whatsapp,
        props.itinary_id
      );
    } else {
      props.onAuth(phone, otp, null, null, whatsapp, props.itinary_id);
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
    setOtpResent(true);
    recaptchaRef.current.reset();
  };

  //Update phone
  const _updatePhoneHandler = () => {
    props.onUpdate({
      phone: phone,
      whatsapp_opt_in: whatsapp,
    });
  };

  const _handlePhoneUpdate = () => {
    props.onResetLogin();
    mobileRef.current.focus();
  };

  const _handleGoogleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => props.onGoogleAuth(tokenResponse),
  });

  const onRecaptchaChange = (value) => {
    if (!props.otpSent) otpHandler(value);
    else resetOtpHandler(value);
  };

  const verifyRecaptchaHandler = () => {
    const recaptchaValue = recaptchaRef.current.getValue();
    if (recaptchaValue) {
      if (!props.otpSent) otpHandler(recaptchaValue);
      else resetOtpHandler(recaptchaValue);
    } else {
      recaptchaRef.current.execute(); // Trigger the invisible ReCAPTCHA
    }
  };

  //Mobile, name, email, password, JSX
  mobileInput = (
    <div>
      <FloatingInput
        required
        error={props.mobileFail ? true : false}
        helperText={props.mobileFail ? props.mobilefailmessage : null}
        disabled={props.otpSent ? true : false}
        key="mobile"
        name="mobile"
        label="Mobile Number"
        type="mobile"
        id="mobile"
        value={phone}
        onChange={handleMobileChange}
        onBlur={handleMobileBlur}
        className="loginform"
        ref={mobileRef}
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
    <div className="font-lexend">
      {!props.noheading ? (
        <h1
          style={{
            fontSize: "24px",
            textAlign: "left",
            margin: isPageWide
              ? "1.2rem 0rem 1.2rem 0.5rem"
              : "0rem 0rem 1rem 0.5rem",
            fontWeight: "700",
          }}
          className="font-lexend"
        >
          {props.loginmessage ? props.loginmessage : "Login to your account"}
        </h1>
      ) : null}

      {(props.token && !props.phone) ||
      (props.token && props.phone === "null") ? (
        <p
          style={{ margin: "0 1rem 2rem 1rem", fontWeight: "200" }}
          className="font-lexend text-center"
        >
          This is where your experience captain can reach you to personalize
          your plan.
        </p>
      ) : null}

      {(props.token && !props.phone) ||
      (props.token && props.phone == "null") ? (
        <form noValidate>
          <MobileNumberContainer className="relative">
            <div
              className="w-fit px-2 flex flex-row gap-3 items-center border-[1px] border-[#d0d5dd] rounded-lg"
              onClick={() => setOpenCountryCodeOption(true)}
            >
              <CountryImg
                height="30"
                width="30"
                objectFit="cover"
                src={
                  props.CountryCodes ? props.CountryCodes[extension].img : ""
                }
              ></CountryImg>
              <FiChevronDown />
            </div>
            {openCountryCodeOption && (
              <CountryCodeDropdown
                onClose={() => setOpenCountryCodeOption(false)}
                CountryCodes={props.CountryCodes}
                handleExtensionChangeOption={handleExtensionChangeOption}
                setOpenCountryCodeOption={setOpenCountryCodeOption}
              />
            )}
            {mobileInput}
          </MobileNumberContainer>

          <WhatsappCheckBox onClick={() => setWhatsapp(!whatsapp)}>
            {whatsapp ? <ImCheckboxChecked /> : <ImCheckboxUnchecked />} Receive
            OTP on WhatsApp
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
          <MobileNumberContainer>
            <div
              className="w-fit px-2 flex flex-row gap-3 items-center border-[1px] border-[#d0d5dd] rounded-lg cursor-pointer"
              onClick={() => setOpenCountryCodeOption(true)}
            >
              <CountryImg
                height="30"
                width="30"
                objectFit="cover"
                src={
                  props.CountryCodes ? props.CountryCodes[extension].img : ""
                }
              ></CountryImg>

              <FiChevronDown />
            </div>
            {openCountryCodeOption && (
              <CountryCodeDropdown
                onClose={() => setOpenCountryCodeOption(false)}
                CountryCodes={props.CountryCodes}
                handleExtensionChangeOption={handleExtensionChangeOption}
                setOpenCountryCodeOption={setOpenCountryCodeOption}
              />
            )}
            {mobileInput}
          </MobileNumberContainer>

          <WhatsappCheckBox onClick={() => setWhatsapp(!whatsapp)}>
            {whatsapp ? <ImCheckboxChecked /> : <ImCheckboxUnchecked />}
            Receive OTP on WhatsApp
            <IoLogoWhatsapp className="text-lg text-[#4DA750]" />
          </WhatsappCheckBox>

          {props.newUser || (props.otpSent && !props.name) ? (
            <FloatingInput
              style={{ marginBottom: "0.7rem" }}
              error={userNameError}
              helperText={"Please enter valid username"}
              placeholder={"Enter Your Full Name"}
              key="userName"
              required
              id="userName"
              label="Enter Your Full Name"
              onChange={(event) => {
                _userDetailsOnChangeHandler(event, "userName");
              }}
              margin="0.7rem 0rem"
            />
          ) : null}

          {props.newUser || (props.otpSent && !props.email) ? email : null}

          {props.otpSent && (
            <div
              style={{
                height: "1.2rem",
                marginLeft: "2px",
                fontSize: "0.7rem",
                marginTop: "10px",
              }}
            >
              <p style={{ letterSpacing: "2px" }}>
                {props.otpSent && !otpResent ? "OTP HAS BEEN SENT" : null}
                {props.otpSent && otpResent ? "OTP HAS BEEN RESENT" : null}
              </p>
              <br></br>
            </div>
          )}

          {props.otpSent ? password : null}

          {props.otpSent ? (
            <UpdatePhone
              style={{
                textAlign: "left",
                width: "100%",
                fontSize: "14px",
                marginBlock: "0.5rem",
              }}
            >
              <u onClick={_handlePhoneUpdate}>Update Phone</u>
              <ResendOtp onClick={verifyRecaptchaHandler}>
                <u>Resend OTP</u>
              </ResendOtp>
            </UpdatePhone>
          ) : null}

          {!props.otpSent ? (
            <Button
              onclick={verifyRecaptchaHandler}
              margin={props.nospacing ? "0" : "0.5rem 0"}
              width="100%"
              bgColor="#F7E700"
              fontWeight="500"
              fontSize="16px"
              borderWidth="1px"
              hoverColor="white"
              hoverBgColor="black"
              boxShadow="0px 2px 0px #ECEAEA"
              borderRadius="8px"
              loading={props.loading}
            >
              Request OTP
            </Button>
          ) : (
            <Button
              onclick={submitOtpHandler}
              margin={props.nospacing ? "0" : "0.5rem 0"}
              width="100%"
              bgColor="#F7E700"
              fontWeight="500"
              fontSize="16px"
              borderWidth="1px"
              hoverColor="white"
              hoverBgColor="black"
              boxShadow="0px 2px 0px #ECEAEA"
              borderRadius="8px"
              loading={props.loading}
            >
              Login
            </Button>
          )}

          {/* <div
            style={{
              position: "relative",
              marginBlock: isPageWide ? "3rem" : "2rem",
            }}
          >
            <hr></hr>
            <p
              style={{
                position: "absolute",
                background: "white",
                top: "-12px",
                left: "43%",
                paddingInline: "10px",
                fontSize: "16px",
                fontWeight: "500",
              }}
            >
              OR
            </p>
          </div>

          <Button
            onclick={() => _handleGoogleLogin()}
            margin={"0"}
            width="100%"
            bgColor="#F9F9F9"
            fontWeight="500"
            fontSize="16px"
            borderWidth="0px"
            hoverColor="white"
            hoverBgColor="black"
            boxShadow="0px 2px 0px #ECEAEA"
            borderRadius="8px"
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  height: "1.5rem",
                  width: "1.5rem",
                  margin: "0 0.5rem",
                }}
              >
                <ImageLoader
                  dimensions={{ height: 100, width: 100 }}
                  url={"media/icons/login/google.svg"}
                  height="1.5rem"
                  width="1.5rem"
                />
              </div>
              <p
                style={{
                  margin: "0",
                  fontWeight: "500",
                  fontSize: "1rem",
                  display: "inline",
                }}
                className="font-lexend"
              >
                Sign in with Google
              </p>
            </div>
          </Button> */}

          <div
            className="text-center font-lexend"
            style={{ fontSize: "12px", fontWeight: "300", margin: "1.5rem 0" }}
          >
            By signing up you are agreeing with our{" "}
            <Link
              href="/privacy-policy"
              style={{ textDecoration: "none" }}
              target="_blank"
            >
              T&Cs and privacy policy
            </Link>
          </div>

          <ReCAPTCHA
            size="invisible"
            sitekey={RECAPTCHA_SITE_KEY}
            ref={recaptchaRef}
            onChange={onRecaptchaChange}
            className="hidden"
          />
        </form>
      )}

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
    onAuth: (mobile, password, name, email, whatsapp, country, itinary_id) =>
      dispatch(
        authaction.auth(
          mobile,
          password,
          name,
          email,
          whatsapp,
          country,
          itinary_id
        )
      ),
    onOtp: (mobile, setNewUser) =>
      dispatch(otpaction.getotp(mobile, setNewUser)),
    onResetLogin: () => dispatch(authaction.authResetLogin()),
    onGoogleAuth: (response) => dispatch(authaction.googleAuth(response)),
    onFbAuth: (response) => dispatch(authaction.fbAuth(response)),
    onUpdate: (response) => dispatch(authaction.changeUserDetails(response)),
    authCloseLogin: () => dispatch(authaction.authCloseLogin()),
    getCountryCodes: () => dispatch(getCountryCodes()),
  };
};

export default connect(mapStateToPros, mapDispatchToProps)(LogIn);

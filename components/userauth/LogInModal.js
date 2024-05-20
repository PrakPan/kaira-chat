import React, { useState, useEffect, useRef } from "react";
import Button from "../ui/button/Index";
import { connect } from "react-redux";
import * as authaction from "../../store/actions/auth";
import * as otpaction from "../../store/actions/getOtp";
import axios from "axios";
import Spinner from "../Spinner";
import styled from "styled-components";
import extensions from "../../public/content/extensionsdata";
import Link from "next/link";
import CountryCodeDropdown from "./CountryDropdown";
import { FiChevronDown } from "react-icons/fi";
import { ImCheckboxUnchecked, ImCheckboxChecked } from "react-icons/im";
import OTPInput from "react-otp-input";
import FloatingInput from "../ui/input/FloatingInput";
import { BiError } from "react-icons/bi";
import LoginLoadingIcon from "../ui/LoadingLottie";
import Image from "next/image";
import ImageLoader from "../ImageLoader";
import media from "../media";
import { useGoogleLogin } from "@react-oauth/google";

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

const CountryCodeContainer = styled.div`
  position: relative;
  width: 90px;
  height: 3.1rem;
  .CountryInput {
    display: grid;
    border: 1px solid #d0d5dd;
    border-radius: 0.5rem;
    grid-template-columns: 1fr 1fr 1fr;
    padding-inline: 0.2rem;
    gap: 0.4rem;
    height: 100%;
    paddding-left: 10%;
  }
  img {
    margin-block: auto;
  }
  p {
    margin: auto;
  }
  svg {
    margin-block: auto;
    font-size: 1.3rem;
    margin-left: -5px;
  }
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
  height: 1.5rem;
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

const CountryCodeOption = styled.div`
  display: grid;
  grid-template-columns: 0.7fr max-content;
  padding-inline: 0.2rem;
  gap: 0.6rem;
  &:hover {
    cursor: pointer;
  }
  text-align: center;
  height: 2rem !important;
  margin-block: 0.5rem;

  p {
    margin: auto;
  }
`;

var userDetails = {
  firstName: "",
  lastName: "",
  userName: "",
  email: "",
};

const LogIn = React.memo((props) => {
  if (props.loadingsocial)
    return (
      <div style={{ height: "27.25rem", width: "100%", display: "flex" }}>
        <LoginLoadingIcon width={"7rem"} />
      </div>
    );

  const mobileRef = useRef();
  const [mobile, setMobile] = useState("+91");
  const [otpResent, setOtpResent] = useState(false);
  const [whatsapp, setWhatsapp] = useState(true);
  const [extension, setExtension] = useState("India"); //store extension
  const [openCountryCodeOption, setOpenCountryCodeOption] = useState(false);
  const [otp, setOtp] = useState("");
  const [userNameError, setUserNameError] = useState(false);
  let email = null; //JSX for email
  let password = null; //JSX for OTP
  let mobileInput = null; //JSX for mobile input field
  let ExtensionOptions = [];
  let mobilevariable = "";

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
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

  const handleExtensionChangeOption = (country) => {
    setExtension(country);
  };

  for (const country in extensions) {
    ExtensionOptions.push(
      <CountryCodeOption
        key={country}
        value={country}
        onClick={() => {
          handleExtensionChangeOption(country), setOpenCountryCodeOption(false);
        }}
      >
        <CountryImg
          height="29"
          width="29"
          objectFit="cover"
          src={extensions[country].img}
          onClick={() => handleExtensionChangeOption(country)}
        ></CountryImg>
        <p>{extensions[country].label}</p>
      </CountryCodeOption>
    );
  }

  //Change user details on key press
  const _userDetailsOnChangeHandler = (event, target) => {
    userDetails = {
      ...userDetails,
      [target]: event.target.value,
    };
  };

  const handleMobileBlur = (event) => {
    setMobile(mobileRef.current.value);
  };

  const checkNewUserData = () => {
    return 1;
  };

  //Submit OTP
  const submitOtpHandler = (event) => {
    setUserNameError(false);

    if (props.newUser) {
      const newUserValidity = checkNewUserData();

      if (!userDetails.userName) return setUserNameError(true);

      if (newUserValidity)
        props.onAuth(
          extensions[extension].label + mobile,
          otp,
          userDetails.userName,
          userDetails.email,
          whatsapp,
          props.itinary_id
        );
    } else if (props.otpSent && !props.name) {
      props.onAuth(
        extensions[extension].label + mobile,
        otp,
        userDetails.userName,
        null,
        whatsapp,
        props.itinary_id
      );
    } else if (props.otpSent && !props.name && !props.email) {
      props.onAuth(
        extensions[extension].label + mobile,
        otp,
        userDetails.userName,
        userDetails.email,
        whatsapp,
        props.itinary_id
      );
    } else if (props.otpSent && !props.email) {
      props.onAuth(
        extensions[extension].label + mobile,
        otp,
        null,
        userDetails.email,
        whatsapp,
        props.itinary_id
      );
    } else {
      props.onAuth(
        extensions[extension].label + mobile,
        otp,
        null,
        null,
        whatsapp,
        props.itinary_id
      );
    }
  };

  //Store OTP
  const handleOtpChange = (OTP) => {
    setOtp(OTP);
  };

  //Set Mobile
  const handleMobileChange = (event) => {
    mobilevariable = event.target.value;
  };

  //Dispatch Action
  const otpHandler = () => {
    props.onOtp(extensions[extension].label + mobileRef.current.value);
  };

  //TEST
  const resetOtpHandler = () => {
    const authData = {
      username: extensions[extension].label + mobile,
    };
    axios
      .post("https://apis.tarzanway.com/user/resend/otp/", authData)
      .then((response) => {});
    setOtpResent(true);
  };

  //Update phone
  const _updatePhoneHandler = () => {
    props.onUpdate({
      phone: extensions[extension].label + mobileRef.current.value,
      whatsapp_opt_in: whatsapp,
    });
  };

  //Mobile, name, email, password, JSX
  mobileInput = (
    <div>
      <FloatingInput
        placeholder="Mobile Number"
        required
        error={props.mobileFail ? true : false}
        helperText={props.mobileFail ? props.mobilefailmessage : null}
        disabled={props.otpSent ? true : false}
        key="mobile"
        name="mobile"
        label="Mobile Number"
        type="mobile"
        id="mobile"
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

  const _handlePhoneUpdate = () => {
    props.onResetLogin();
    mobileRef.current.focus();
  };

  const _handleGoogleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => props.onGoogleAuth(tokenResponse),
  });

  let isPageWide = media("(min-width: 768px)");

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
          <MobileNumberContainer>
            <CountryCodeContainer>
              <div
                className="CountryInput"
                onClick={() => setOpenCountryCodeOption(true)}
              >
                <CountryImg
                  height="29"
                  width="29"
                  objectFit="cover"
                  src={extensions[extension].img}
                ></CountryImg>

                <p>{extensions[extension].label} </p>
                <FiChevronDown />
              </div>
              {openCountryCodeOption && (
                <CountryCodeDropdown
                  onClose={() => setOpenCountryCodeOption(false)}
                  ExtensionOptions={ExtensionOptions}
                />
              )}
            </CountryCodeContainer>
            {mobileInput}
          </MobileNumberContainer>
          <WhatsappCheckBox onClick={() => setWhatsapp(!whatsapp)}>
            {whatsapp ? <ImCheckboxChecked /> : <ImCheckboxUnchecked />} Receive
            boooking updates via WhatsApp
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
            <CountryCodeContainer>
              <div
                className="CountryInput"
                onClick={() => setOpenCountryCodeOption(true)}
              >
                <CountryImg
                  height="29"
                  width="29"
                  objectFit="cover"
                  src={extensions[extension].img}
                ></CountryImg>

                <p>{extensions[extension].label} </p>
                <FiChevronDown />
              </div>
              {openCountryCodeOption && (
                <CountryCodeDropdown
                  onClose={() => setOpenCountryCodeOption(false)}
                  ExtensionOptions={ExtensionOptions}
                />
              )}
            </CountryCodeContainer>
            {mobileInput}
          </MobileNumberContainer>

          <WhatsappCheckBox onClick={() => setWhatsapp(!whatsapp)}>
            {whatsapp ? <ImCheckboxChecked /> : <ImCheckboxUnchecked />} Receive
            boooking updates via WhatsApp
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
              <ResendOtp onClick={resetOtpHandler}>
                <u>Resend OTP</u>
              </ResendOtp>
            </UpdatePhone>
          ) : null}

          {!props.otpSent ? (
            <Button
              onclick={otpHandler}
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
              onclick={(e) => submitOtpHandler(e)}
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

          <div
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
          </Button>
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAuth: (mobile, password, name, email, whatsapp, itinary_id) =>
      dispatch(
        authaction.auth(mobile, password, name, email, whatsapp, itinary_id)
      ),
    onOtp: (mobile, setNewUser) =>
      dispatch(otpaction.getotp(mobile, setNewUser)),
    onResetLogin: () => dispatch(authaction.authResetLogin()),
    onGoogleAuth: (response) => dispatch(authaction.googleAuth(response)),
    onFbAuth: (response) => dispatch(authaction.fbAuth(response)),
    onUpdate: (response) => dispatch(authaction.changeUserDetails(response)),
    authCloseLogin: () => dispatch(authaction.authCloseLogin()),
  };
};

export default connect(mapStateToPros, mapDispatchToProps)(LogIn);

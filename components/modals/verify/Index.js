import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import { TbArrowBack } from "react-icons/tb";
import media from "../../../components/media";
import Email from "./Email";
import { connect } from "react-redux";
import axiosusereditinfo from "../../../services/user/edit";
import Button from "../../ui/button/Index";
import axiosemailinitiateinstance from "../../../services/user/email/initiate";
import axiosemailcompleteinstance from "../../../services/user/email/complete";
import * as authaction from "../../../store/actions/auth";
import Otp from "./Otp";

const Body = styled(Modal.Body)``;

const RegistrationModal = (props) => {
  let isPageWide = media("(min-width: 768px)");
  const [email, setEmail] = useState(props.email);
  const [emailError, setEmailError] = useState(false);
  const [otp, setOtp] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerificationFailed, setOtpVerificationtFailed] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);

  const _verifyOtpHandler = (otp) => {
    setButtonLoading(true);
    axiosemailcompleteinstance
      .get("/", {
        headers: {
          Authorization: `Bearer ${props.token}`,
        },
        params: {
          otp: otp,
        },
      })
      .then((res) => {
        setOtpVerificationtFailed(false);
        setButtonLoading(false);
        props.setUserDetails({
          email: email,
        });
        props.onSuccess();
      })
      .catch((err) => {
        setButtonLoading(false);

        setOtpVerificationtFailed(true);
      });
  };

  const _emailInitateHandler = () => {
    axiosemailinitiateinstance
      .get("/", {
        headers: {
          Authorization: `Bearer ${props.token}`,
        },
      })
      .then((res) => {
        setButtonLoading(false);
        setOtpSent(true);
      })
      .catch((err) => {
        setButtonLoading(false);
      });
  };

  const _editUserEmailHandler = (email) => {
    setButtonLoading(true);
    axiosusereditinfo
      .patch(
        "/",
        {
          email: email,
        },
        {
          headers: {
            Authorization: `Bearer ${props.token}`,
          },
        }
      )
      .then((res) => {
        _emailInitateHandler();
      })
      .catch((err) => {
        setButtonLoading(false);
      });
  };

  return (
    <div>
      <Modal
        className="booking-modal"
        show={props.show}
        size="xl"
        onHide={props.hide}
      >
        <Modal.Header
          style={{
            float: "right",
            height: isPageWide ? "max-content" : "20vw",
            position: "sticky",
            top: "0",
            backgroundColor: "white",
            justifyContent: "flex-end",
            padding: !isPageWide ? "2rem 1rem" : "1rem",
            backgroundColor: "white",
            zIndex: "2",
          }}
        >
          <TbArrowBack
            onClick={props.hide}
            className="hover-pointer"
            style={{
              margin: "0.5rem",
              fontSize: "1.75rem",
              textAlign: "right",
            }}
          ></TbArrowBack>
        </Modal.Header>
        <Body className="">
          <p className="font-lexend text-center">
            You're not authorized to purchase this, verify email
          </p>
          <Email
            otpSent={otpSent}
            email={email}
            setEmail={setEmail}
            emailError={emailError}
            setEmailError={setEmailError}
          ></Email>
          {otpSent ? (
            <Otp
              otp={otp}
              setOtp={setOtp}
              otpVerificationFailed={otpVerificationFailed}
              setEmailError={setEmailError}
            ></Otp>
          ) : (
            <div style={{ visibility: "hidden" }}>
              {" "}
              <Otp
                otp={otp}
                setOtp={setOtp}
                otpVerificationFailed={otpVerificationFailed}
                setEmailError={setEmailError}
              ></Otp>
            </div>
          )}
          {!otpSent ? (
            <Button
              loading={buttonLoading}
              margin="0.5rem 0"
              borderWidth="0"
              bgColor="#f7e700"
              color="black"
              hoverBgColor="#f7e700"
              hoverColor="black"
              borderRadius="5px"
              onclick={_editUserEmailHandler}
              onclickparam={email}
            >
              Get OTP
            </Button>
          ) : (
            <Button
              margin="0.5rem 0"
              borderWidth="0"
              bgColor="#f7e700"
              color="black"
              hoverBgColor="#f7e700"
              hoverColor="black"
              borderRadius="5px"
              onclick={_verifyOtpHandler}
              onclickparam={otp}
              loading={buttonLoading}
            >
              Verify OTP
            </Button>
          )}
        </Body>
      </Modal>
    </div>
  );
};

const mapStateToPros = (state) => {
  return {
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
    setUserDetails: (details) => dispatch(authaction.setUserDetails(details)),
  };
};

export default connect(mapStateToPros, mapDispatchToProps)(RegistrationModal);

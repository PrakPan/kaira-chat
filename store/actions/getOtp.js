import * as actionTypes from "./actionsTypes";
import axiosauthinstance from "../../services/user/auth";
import { setUserDetails } from "./auth";
import * as ga from "../../services/ga/Index";
import { CONTENT_SERVER_HOST } from "../../services/constants";
import * as Sentry from "@sentry/nextjs";

//Show spinner
export const authStartLoading = () => {
  return {
    type: actionTypes.AUTH_STARTLOADING,
  };
};

//Otp sent succesfully
export const authSendOtp = () => {
  return {
    type: actionTypes.AUTH_OTPSENT,
  };
};

//Inavlid mobile
export const authMobileFail = (message) => {
  return {
    type: actionTypes.AUTH_MOBILEFAIL,
    mobilefailmessage: message,
  };
};

//New user
export const newUser = () => {
  return {
    type: actionTypes.NEW_USER,
  };
};

export const getotp = (data) => {
  const authData = {
    "g-recaptcha-response": data.token,
    username: data.mobile,
    whatsapp_opt_in: data.whatsapp,
  };
  {
    process.env.NODE_ENV === "production" &&
      !CONTENT_SERVER_HOST.includes("dev") &&
      ga.event({
        action: "number-login-request",
        params: {
          status: "",
        },
      });
  }
  return (dispatch) => {
    // dispatch(authStartLoading()); //Show spinner
    axiosauthinstance
      .post("/initiate/", authData)
      .then((response) => {
        if (response.data.success) {
          {
            process.env.NODE_ENV === "production" &&
              !CONTENT_SERVER_HOST.includes("dev") &&
              ga.event({
                action: "number-login-initiate",
                params: {
                  status: "",
                },
              });
          }
          dispatch(authSendOtp()); //Otp sent
          if (response.data.data?.user?.is_new_user) dispatch(newUser()); //New user
          if (response.data.data?.user?.name)
            dispatch(setUserDetails({ name: response.data.data?.user?.name }));
          if (response.data.data?.user?.email)
            dispatch(
              setUserDetails({ email: response.data.data?.user?.email })
            );
        } else {
          dispatch(authMobileFail());
        }
      })
      .catch((err) => {
        if (err?.response?.status === 400) {
          if (err.response.data?.message) {
            dispatch(authMobileFail(err.response.data.message));
          } else {
            dispatch(authMobileFail(err.response.data.errors[0].username[0])); //Invalid mobile
            Sentry.captureException(
              new Error(
                `[LogIn Error]: ${err.response?.config?.url} : ${err.response?.config?.data} : ${err.response?.data?.errors[0]?.username[0]}`
              )
            );
          }
        } else {
          dispatch(authMobileFail("OTP could not be sent"));
          Sentry.captureException(
            new Error(
              `[LogIn Error]: ${err?.response?.config?.url} : ${err?.response?.config?.data}`
            )
          );
        }
      });
  };
};

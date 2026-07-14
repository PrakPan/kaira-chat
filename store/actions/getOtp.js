
import * as actionTypes from "./actionsTypes";
import axiosauthinstance from "../../services/user/auth";
import { setUserDetails } from "./auth";
import * as ga from "../../services/ga/Index";
import { CONTENT_SERVER_HOST } from "../../services/constants";
import * as Sentry from "@sentry/nextjs";
import { openNotification } from "./notification";

export const authStartLoading = () => {
  return {
    type: actionTypes.AUTH_STARTLOADING,
  };
};


export const authStopLoading = () => {
  return {
    type: actionTypes.AUTH_STOPLOADING,
  };
};


export const authSendOtp = () => {
  return {
    type: actionTypes.AUTH_OTPSENT,
  };
};

//Invalid mobile
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

// Extract the human-readable message from an /initiate/ error payload of the
// shape `{ success: false, errors: [{ detail: ["…"] }] }` (or `username`).
// Returns null when nothing usable is found so callers can fall back.
const extractOtpError = (data) => {
  const firstError = data?.errors?.[0];
  if (!firstError) return null;
  if (typeof firstError === "string") return firstError;
  return firstError.username?.[0] || firstError.detail?.[0] || null;
};

export const getotp = (data) => {
  const authData = {
    "g-recaptcha-response": data.token,
    username: data.mobile,
    whatsapp_opt_in: data.whatsapp,
  };
  
  if (process.env.NODE_ENV === "production" && !CONTENT_SERVER_HOST.includes("dev")) {
    ga.event({
      action: "number-login-request",
      params: {
        status: "",
      },
    });
  }

  return (dispatch) => {
    dispatch(authStartLoading()); 
    
    axiosauthinstance
      .post("/initiate/", authData)
      .then((response) => {
        dispatch(authStopLoading()); 
        
        if (response.data.success) {
          if (process.env.NODE_ENV === "production" && !CONTENT_SERVER_HOST.includes("dev")) {
            ga.event({
              action: "number-login-initiate",
              params: {
                status: "",
              },
            });
          }
          
          dispatch(authSendOtp()); 
          
          if (response.data.data?.user?.is_new_user) dispatch(newUser()); // New user
          if (response.data.data?.user?.name)
            dispatch(setUserDetails({ name: response.data.data?.user?.name }));
          if (response.data.data?.user?.email)
            dispatch(setUserDetails({ email: response.data.data?.user?.email }));
        } else {
          // 200 OK but `success: false` (e.g. rate limit / validation). Surface
          // the server's actual message from `errors[0].detail`/`username`
          // instead of a generic string.
          const errorMsg =
            extractOtpError(response.data) || "Failed to send OTP";
          dispatch(authMobileFail(errorMsg));
        }
      })
      .catch((err) => {
        dispatch(authStopLoading());

        // Pull the server's message from `errors[0].detail`/`username` for ANY
        // failing status (400, 429 rate limit, etc.) — not just 400 — so the
        // real reason ("Please try again after 45 seconds…") reaches the user.
        const errorMessage =
          extractOtpError(err?.response?.data) ||
          (err?.response ? "OTP could not be sent" : "Something went wrong, Please try again");

        Sentry.captureException(
          new Error(
            `[LogIn Error]: ${err?.response?.config?.url} : ${err?.response?.config?.data} : ${errorMessage}`
          )
        );

        dispatch(authMobileFail(errorMessage));
      });
  };
};

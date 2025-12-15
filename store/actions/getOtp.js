
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
          const errorMsg = "Failed to send OTP";
          dispatch(authMobileFail(errorMsg));

          setTimeout(() => {
            dispatch(openNotification({
              type: "error",
              text: "Failed to send OTP. Please try again.",
              heading: "Error!",
            }));
          }, 100);
        }
      })
      .catch((err) => {
        dispatch(authStopLoading()); 
        
        let errorMessage = "Something went wrong, Please try again";
        
        if (err?.response?.status === 400) {
          if (err.response.data?.errors) {
            // Handle array of errors
            const firstError = err.response.data.errors[0];
            errorMessage = 
              firstError?.username?.[0] || 
              firstError?.detail?.[0] || 
              errorMessage;
          } else if (err.response.data?.errors?.[0]?.username?.[0]) {
            errorMessage = err.response.data.errors[0].username[0];
          }
          
          Sentry.captureException(
            new Error(
              `[LogIn Error]: ${err.response?.config?.url} : ${err.response?.config?.data} : ${errorMessage}`
            )
          );
        } else {
          errorMessage = "OTP could not be sent";
          Sentry.captureException(
            new Error(
              `[LogIn Error]: ${err?.response?.config?.url} : ${err?.response?.config?.data}`
            )
          );
        }

        dispatch(authMobileFail(errorMessage));
        
        setTimeout(() => {
          dispatch(openNotification({
            type: "error",
            text: errorMessage,
            heading: "Error!",
          }));
        }, 100);
      });
  };
};

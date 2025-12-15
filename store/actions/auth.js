import * as actionTypes from "./actionsTypes";
import axiosauthinstance from "../../services/user/auth";
import axiosgoogleauthinstance from "../../services/user/googleAuth";
import axiosfbauthinstance from "../../services/user/fbAuth";
import axiosClaims from "../../services/sales/itinerary/Claim";
import axiosuserinstance from "../../services/user/info";
import * as ga from "../../services/ga/Index";
import { logEvent } from "../../services/ga/Index";
import { CLIENT_ID, CLIENT_SECRET } from "../../services/constants";


//Open login modal
export const authShowLogin = () => {
  console.log("login clicked autha")
  return {
    type: actionTypes.AUTH_SHOWLOGIN,
  };
};

//Open login modal
export const setUpdateLoading = (isLoading) => {
  return {
    type: "SET_UPDATE_LOADING",
    payload: isLoading,
  };
};

//Close login modal
export const authCloseLogin = () => {
  return {
    type: actionTypes.AUTH_CLOSELOGIN,
  };
};

//Show spinner
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



//Show spinner for social login
export const authStartLoadingSocial = () => {
  return {
    type: actionTypes.AUTH_STARTLOADINGSOCIAL,
  };
};

export const authStopLoadingSocial = () => {
  return {
    type: actionTypes.AUTH_STOPLOADINGSOCIAL,
  };
};

//Store token on sucess
export const authSuccess = (token) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    access_token: token,
  };
};

//Set user name and email
export const setUserDetails = (userdetails) => {
  try {
    userdetails.email && localStorage.setItem("email", userdetails.email);
    userdetails.name && localStorage.setItem("name", userdetails.name);
    userdetails.country && localStorage.setItem("country", userdetails.country);
    userdetails.phone && localStorage.setItem("phone", userdetails.phone);
    userdetails.is_phone_verified &&
      localStorage.setItem("is_phone_verified", userdetails.is_phone_verified);
    userdetails.is_email_verified &&
      localStorage.setItem("is_email_verified", userdetails.is_email_verified);
    userdetails.profile_pic &&
      localStorage.setItem("user_image", userdetails.profile_pic);
    userdetails.user_image &&
      localStorage.setItem("user_image", userdetails.user_image);
    userdetails.whatsapp_opt_in &&
      localStorage.setItem("whatsapp_opt_in", userdetails.whatsapp_opt_in);
    userdetails.email_last_verified_on &&
      localStorage.setItem(
        "email_last_verified_on",
        userdetails.email_last_verified_on
      );

    if (userdetails.profile_pic) {
      userdetails["image"] = userdetails.profile_pic;
    } else if (userdetails.user_image) {
      userdetails["image"] = userdetails.user_image;
    }
  } catch {}
  return {
    type: actionTypes.AUTH_SETUSERDETAILS,
    data: userdetails,
  };
};

//set profile pic
export const setProiflePic = (value) => {
  return {
    type: actionTypes.AUTH_SETPROFILE_PIC,
  };
};

//Wrong OTP
export const authOtpFail = (error) => {
  return {
    type: actionTypes.AUTH_OTPFAIL,
    error: error,
  };
};

//Email already in use
export const authEmailFail = (message) => {
  return {
    type: actionTypes.AUTH_EMAILFAIL,
    emailfailmessage: message,
  };
};

//Invalid phone or already taken
export const authMobileFail = (message) => {
  return {
    type: actionTypes.AUTH_MOBILEFAIL,
    mobilefailmessage: message,
  };
};

//Unused
export const authResetEmail = () => {
  return {
    type: actionTypes.AUTH_RESETEMAIL,
  };
};

export const authResetOtpFail = () => {
  return {
    type: actionTypes.AUTH_RESETOTPFAIL,
  };
};

//Clear auth data
export const authLogout = () => {
  return {
    type: actionTypes.AUTH_LOGOUT,
  };
};

//Logout / refresh after token expires
export const checkAuthTimeout = (expirationTime) => {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(authLogout());
    }, expirationTime * 1000);
  };
};

//Auth check status for checkAuthRedirect HOC
export const authCheckCompleted = () => {
  return {
    type: actionTypes.AUTH_CHECKAUTHCOMPLETED,
  };
};

export const authSetLoginMessage = (message) => {
  return {
    type: actionTypes.AUTH_SETLOGINMESSAGE,
    loginmessage: message,
  };
};

export const authHideLoginClose = () => {
  return {
    type: actionTypes.AUTH_HIDELOGINCLOSE,
  };
};

//Check auth state
export const checkAuthState = () => {
  return (dispatch) => {
    const access_token = localStorage.getItem("access_token");

    //No token present, Auth check completed (for checkAuth HOC)
    if (!access_token) {
      dispatch(authCheckCompleted());
      dispatch(authLogout()); //Clear auth status in redux if any
    } else {
      //Token expired
      const expirationDate = new Date(localStorage.getItem("expirationDate"));
      if (expirationDate <= new Date()) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("name");
        localStorage.removeItem("email");
        localStorage.removeItem("phone");
        localStorage.removeItem("user_id");
        localStorage.removeItem("expirationDate");
        localStorage.removeItem("MyPlans");
        localStorage.removeItem("user_image");

        dispatch(authLogout());
        //refresh token
      }
      //Token valid
      else {
        const country = localStorage.getItem("country");
        const userdata = {
          name: localStorage.getItem("name"),
          country:
            country === "" || country === "null"
              ? null
              : localStorage.getItem("country"),
          phone: localStorage.getItem("phone"),
          email: localStorage.getItem("email"),
          id: localStorage.getItem("user_id"),
          image: localStorage.getItem("user_image"),
          whatsapp_opt_in: JSON.parse(localStorage.getItem("whatsapp_opt_in")),
          is_phone_verified: JSON.parse(
            localStorage.getItem("is_phone_verified")
          ),
          is_email_verified: JSON.parse(
            localStorage.getItem("is_email_verified")
          ),
          email_last_verified_on: localStorage.getItem(
            "email_last_verified_on"
          ),
        };
        //Update redux with token and user details
        dispatch(authSuccess(access_token));
        dispatch(setUserDetails(userdata));
        //Start logout /refresh  timer -> logout /refresh  after new token expiration time
        dispatch(
          checkAuthTimeout(
            (expirationDate.getTime() - new Date().getTime()) / 1000
          )
        );
        //Auth check completed (for checkAuth HOC)
        dispatch(authCheckCompleted());
      }
    }
  };
};

//Set path to redirect on successfull auth
export const setAuthRedirect = (path) => {
  return {
    type: actionTypes.AUTH_SETAUTHREDIRECT,
    path: path,
  };
};

export const auth = (
  mobile,
  password,
  name,
  email,
  whatsapp,
  country,
  onSuccess = null,
  trackUserLogin
) => {
  //name and email null incase of old user
   

  const authData = {
    grant_type: "password",
    username: mobile,
    password: password,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    otp: true,
    name: name,
    email: email,
  };
  return (dispatch, getState) => {
    dispatch(authStartLoading()); //Start spinner
    dispatch(authResetOtpFail()); //Set otp fail false
    let updatedauthdata = { ...authData };
    if (getState().auth.newUser) {
      updatedauthdata = {
        ...updatedauthdata,
        is_new_user: true,
        whatsapp_opt_in: whatsapp,
        country,
      };
    }

     

    axiosauthinstance
      .post("/complete/", updatedauthdata)
      .then((response) => {
        if (response.data.success) {
          logEvent({
            action: "number-login-success",
            params: {
              status: "otp verified",
            },
          });

          const responseData = response.data;

          const userdata = {
            name: responseData.data.user?.name,
            country: responseData.data.user?.country ?? "",
            phone: responseData.data.user?.phone,
            email: responseData.data.user?.email,
            id: responseData.data.user?.id,
            image: responseData.data.user?.profile_pic,
            whatsapp_opt_in: responseData.data.user?.whatsapp_opt_in,
            is_phone_verified: responseData.data.user?.is_phone_verified,
            is_email_verified: responseData.data.user?.is_email_verified,
            email_last_verified_on:
              responseData.data.user?.email_last_verified_on,
          };
          trackUserLogin(userdata.id);
          //Store user details in local storage
          localStorage.setItem("name", userdata.name);
          localStorage.setItem("country", userdata.country);
          localStorage.setItem("email", userdata.email);
          localStorage.setItem("phone", userdata.phone);
          localStorage.setItem("user_id", userdata.id);
          localStorage.setItem("user_image", userdata.image);
          localStorage.setItem("whatsapp_opt_in", userdata.whatsapp_opt_in);
          localStorage.setItem("is_phone_verified", userdata.is_phone_verified);
          localStorage.setItem("is_email_verified", userdata.is_email_verified);
          localStorage.setItem(
            "email_last_verified_on",
            userdata.email_last_verified_on
          );

          //Store token expiration date in local storage
          const expirationDate = new Date(
            new Date().getTime() +
              responseData.data.user?.oauth?.expires_in * 1000
          );
          dispatch(authSuccess(responseData.data.user?.oauth?.access_token)); //Store toke  n
          dispatch(setUserDetails(userdata)); //Store user name and email
          dispatch(checkAuthTimeout(responseData.data.user?.oauth?.expires_in)); //Start logout /refresh timer -> logout /refresh  after token expiration time
          //store token details in local storage
          localStorage.setItem(
            "access_token",
            responseData.data.user?.oauth?.access_token
          );
          if (onSuccess) {
            onSuccess();
          }
          dispatch(authCloseLogin()); 
          localStorage.setItem("expirationDate", expirationDate);
        }
      })
      .catch((err) => {
        if (err.response.data?.errors && err.response.data?.errors[0].email) {
          logEvent({
            action: "number-login-email_fail",
            params: {
              status: "email fail",
            },
          });

          dispatch(authEmailFail(err.response.data?.errors[0].email[0]));
          dispatch(openNotification({
            type: "error",
            heading: err.response.data?.errors[0].email,
          }))
        } else {
          logEvent({
            action: "number-login-otp_fail",
            params: {
              status: "otp fail",
            },
          });

          dispatch(authOtpFail());
        }
      });
  };
};

export const googleAuth = (response) => {
  logEvent({
    action: "google-login-initiate",
    params: {
      status: "",
    },
  });

  return (dispatch) => {
    dispatch(authStartLoadingSocial()); //Start spinner

    axiosgoogleauthinstance
      .get("?access_token=" + response.access_token)
      .then((res) => {
        dispatch(authStopLoadingSocial());

        if (res.status === 200) {
          logEvent({
            action: "google-login-success",
            params: {
              status: "",
            },
          });

          const userdata = {
            name: res.data.name,
            phone: res.data.phone,
            country: res.data.country,
            email: res.data.email,
            id: res.data.id,
            image: res.data.profile_pic,
            whatsapp_opt_in: res.data.whatsapp_opt_in,
            is_phone_verified: res.data.is_phone_verified,
            is_email_verified: res.data.is_email_verified,
            email_last_verified_on: res.data.email_last_verified_on,
          };

          if (!res.data.phone) {
            dispatch(authSetLoginMessage("Confirm your phone number"));
          }

          //Store user details in local storage
          localStorage.setItem("name", userdata.name);
          localStorage.setItem("country", userdata.country);
          localStorage.setItem("email", userdata.email);
          localStorage.setItem("phone", userdata.phone);
          localStorage.setItem("user_id", userdata.id);
          localStorage.setItem("user_image", userdata.image);
          localStorage.setItem("whatsapp_opt_in", userdata.whatsapp_opt_in);
          localStorage.setItem("is_phone_verified", userdata.is_phone_verified);
          localStorage.setItem("is_email_verified", userdata.is_email_verified);
          localStorage.setItem(
            "email_last_verified_on",
            userdata.email_last_verified_on
          );

          //Store token expiration date in local storage
          const expirationDate = new Date(
            new Date().getTime() + res.data.oauth.expires_in * 1000
          );

          dispatch(authSuccess(res.data.oauth.access_token)); //Store token
          dispatch(setUserDetails(userdata)); //Store user name and email
          dispatch(checkAuthTimeout(res.data.oauth.expires_in)); //Start logout /refresh timer -> logout /refresh  after token expiration time
          dispatch(authHideLoginClose());
          //dispacth close login if mobile returned
          // dispatch(authCloseLogin());

          //store token details in local storage
          localStorage.setItem("access_token", res.data.oauth.access_token);
          localStorage.setItem("expirationDate", expirationDate);
        }
      })
      .catch((err) => {
        dispatch(authStopLoadingSocial);
      });
  };
};

export const fbAuth = (response) => {
  return (dispatch) => {
    dispatch(authStartLoadingSocial()); //Start spinner
    axiosfbauthinstance
      .get("?access_token=" + response.accessToken)
      .then((res) => {
        if (res.status === 200) {
          const userdata = {
            name: res.data.name,
            phone: res.data.phone,
            email: res.data.email,
            id: res.data.id,
            image: res.data.profile_pic,
          };
          //Store user details in local storage
          localStorage.setItem("name", userdata.name);
          localStorage.setItem("email", userdata.email);
          localStorage.setItem("phone", userdata.phone);
          localStorage.setItem("user_id", userdata.id);
          localStorage.setItem("user_image", userdata.image);

          //Store token expiration date in local storage
          const expirationDate = new Date(
            new Date().getTime() + res.data.oauth.expires_in * 1000
          );
          dispatch(authSuccess(res.data.oauth.access_token)); //Store token
          dispatch(setUserDetails(userdata)); //Store user name and email
          dispatch(checkAuthTimeout(res.data.oauth.expires_in)); //Start logout /refresh timer -> logout /refresh  after token expiration time
          dispatch(authCloseLogin()); //close login modal
          //store token details in local storage
          localStorage.setItem("access_token", res.data.oauth.access_token);
          localStorage.setItem("expirationDate", expirationDate);
        }
      });
  };
};

export const authResetLogin = () => {
  return {
    type: actionTypes.AUTH_RESETLOGIN,
  };
};

export const changeUserDetails = (userdetails,trackUserAccountUpdate) => {
  return (dispatch, getState) => {
    const token = getState().auth.token;
    

    axiosuserinstance
      .put("", userdetails, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const responseData = res.data;
        trackUserAccountUpdate(responseData.data.user?.id,userdetails);

        localStorage.setItem("name", responseData.data.user?.name);
        localStorage.setItem("email", responseData.data.user?.email);
        localStorage.setItem("phone", responseData.data.user?.phone);
        localStorage.setItem("user_id", responseData.data.user?.id);
        localStorage.setItem("user_image", responseData.data.user?.profile_pic);
        localStorage.setItem("country",responseData.data.user?.country)
        localStorage.setItem(
          "whatsapp_opt_in",
          responseData.data.user?.whatsapp_opt_in
        );
        localStorage.setItem(
          "is_phone_verified",
          responseData.data.user?.is_phone_verified
        );
        localStorage.setItem(
          "is_email_verified",
          responseData.data.user?.is_email_verified
        );
        localStorage.setItem(
          "email_last_verified_on",
          responseData.data.email_last_verified_on
        );
        dispatch(setUserDetails(userdetails));
        dispatch(authSetLoginMessage(null));
        dispatch(authCloseLogin());
      })
      .catch((err) => {
        if (err?.response?.data?.errors[0]?.phone)
          dispatch(authMobileFail(err.response.data.errors[0].phone[0]));
        //Invalid / already taken  mobile
        else dispatch(authMobileFail());
      });
  };
};

export const uploadProfilePic = (image,trackUserAccountUpdate) => {
  return (dispatch, getState) => {
    const token = getState().auth.token;
    const userId = getState().auth.id;
  
    axiosuserinstance
      .patch(
        "/profile_pic/upload/",
        { profile_pic: image },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        dispatch(setProiflePic(true));
        trackUserAccountUpdate(userId,{profile_pic:image});
      })
      .catch((err) => {
        //set error
        dispatch(setProiflePic(true));
      });
  };
};

export const ClaimItinary = (itinaryId, token) => {
  return new Promise((resolve, reject) => {
    axiosClaims
      .patch(
        "/",
        {
          itinerary: itinaryId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        resolve(res.data); //
      })
      .catch((err) => {
        reject(err);
      });
  });
};

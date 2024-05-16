import * as actionTypes from "../actions/actionsTypes";
import { HYDRATE } from "next-redux-wrapper";

const initialState = {
  newUser: false,
  mobileFail: false,
  otpFail: false,
  otpSent: false,
  loading: false,
  socialloading: false,
  emailFail: false,
  token: null,
  checkAuthCompleted: false,
  authRedirectPath: "/",
  showLogin: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case HYDRATE:
      const nextState = {
        ...state, // use previous state
        ...action.payload, // apply delta from hydration
      };
      return nextState;
    case actionTypes.AUTH_SHOWLOGIN:
      return {
        ...state,
        showLogin: true,
      };

    case actionTypes.AUTH_CLOSELOGIN:
      return {
        ...state,
        showLogin: false,
        otpSent: false,
        mobileFail: false,
        otpFail: false,
        newUser: false,
      };
    case actionTypes.AUTH_RESETLOGIN:
      return {
        ...state,
        otpSent: false,
        mobileFail: false,
        otpFail: false,
        newUser: false,
      };
    case actionTypes.AUTH_STARTLOADING:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.AUTH_STARTLOADINGSOCIAL:
      return {
        ...state,
        loadingsocial: true,
      };
    case actionTypes.AUTH_STOPLOADINGSOCIAL:
      return {
        ...state,
        loadingsocial: false,
      };
    case actionTypes.AUTH_OTPSENT:
      return {
        ...state,
        otpSent: true,
        mobileFail: false,
        loading: false,
        otpFail: false,
        token: null,
      };
    case actionTypes.AUTH_SUCCESS:
      return {
        ...state,
        otpFail: false,
        mobileFail: false,
        loading: false,
        emailFail: false,
        newUser: false,
        token: action.access_token,
        loadingsocial: false,
      };
    case actionTypes.AUTH_SETUSERDETAILS:
      return {
        ...state,
        ...action.data,
      };
    case actionTypes.AUTH_OTPFAIL:
      return {
        ...state,
        emailFail: false,
        otpFail: true,
        loading: false,
        token: null,
      };
    case actionTypes.AUTH_MOBILEFAIL:
      return {
        ...state,
        mobileFail: true,
        loading: false,
        mobilefailmessage: action.mobilefailmessage,
      };
    case actionTypes.NEW_USER:
      return {
        ...state,
        newUser: true,
      };
    case actionTypes.AUTH_EMAILFAIL:
      return {
        ...state,
        emailFail: true,
        loading: false,
        emailfailmessage: action.emailfailmessage,
      };
    case actionTypes.AUTH_RESETEMAIL:
      return {
        ...state,
        emailFail: false,
      };
    case actionTypes.AUTH_RESETOTPFAIL:
      return {
        ...state,
        otpFail: false,
      };
    case actionTypes.AUTH_LOGOUT:
      return {
        ...state,
        ...initialState,
        checkAuthCompleted: true,
        showLogin: false,
      };
    case actionTypes.AUTH_CHECKAUTHCOMPLETED:
      return {
        ...state,
        checkAuthCompleted: true,
      };
    case actionTypes.AUTH_SETAUTHREDIRECT:
      return {
        ...state,
        authRedirectPath: action.path,
      };
    case actionTypes.AUTH_SETPROFILE_PIC:
      return {
        ...state,
        profile_pic_set: true,
      };
    case actionTypes.AUTH_SETLOGINMESSAGE:
      return {
        ...state,
        loginmessage: action.loginmessage,
      };
    case actionTypes.AUTH_HIDELOGINCLOSE:
      return {
        ...state,
        hideloginclose: true,
      };
    default:
      return state;
  }
};

export default reducer;

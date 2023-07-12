import * as actionTypes from "./actionsTypes";
import axios from "axios";
import axiosauthinstance from "../../services/user/auth";
import { CONTENT_SERVER_HOST } from "../../services/constants";
export const authLogout = () => {
  return {
    type: actionTypes.AUTH_LOGOUT,
  };
};

export const logout = () => {
  const access_token = localStorage.getItem("access_token");
  const Bearer = "Bearer " + access_token;
  const headers = {
    "Content-Type": "application/json",
    Authorization: Bearer,
  };

  const authData = {
    token: access_token,
    client_id: "59Fj160UxJ4LJ1fyu20nsxzbyGhpWXHaIqmUMCVJ",
    client_secret:
      "5k5E6w6nqaMxwxaJunZq14lzv84CNZ434YIlJlEmOwZzX6UU0DDY3dlgv88qpqTgQjkcVm3fmN38eZNfZ9BsfpEGGJ84g5LKjie8xbDFYvnb3k7Nu02xx8SAxRTvExT2",
  };

  return (dispatch) => {
    axios
      .post(CONTENT_SERVER_HOST + "/user/logout/", authData, {
        headers: headers,
      })
      .then((response) => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("name");
        localStorage.removeItem("email");
        localStorage.removeItem("phone");
        localStorage.removeItem("user_id");
        localStorage.removeItem("expirationDate");
        localStorage.removeItem("MyPlans");
        localStorage.removeItem("user_image");

        dispatch(authLogout());
        // window.location.reload();
      })
      .catch((err) => {
        // localStorage.setItem('auth', false);
        // localStorage.setItem('userID',null);
        // dispatch(authMobileFail());
        // localStorage.setItem('auth', false);
        // localStorage.setItem('userID',null);
        // localStorage.setItem('token',null);
      });
  };
};

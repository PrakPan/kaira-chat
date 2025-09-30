import * as actionTypes from "./actionsTypes";
import { CLIENT_ID, CLIENT_SECRET } from "../../services/constants";
import { logoutinstance } from "../../services/user/auth";

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
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  };

  return (dispatch) => {
    logoutinstance
      .post("", authData, {
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
      })
      .catch((err) => {
      
        localStorage.removeItem("access_token");
        localStorage.removeItem("name");
        localStorage.removeItem("email");
        localStorage.removeItem("phone");
        localStorage.removeItem("user_id");
        localStorage.removeItem("expirationDate");
        localStorage.removeItem("MyPlans");
        localStorage.removeItem("user_image");

      });
  };
};

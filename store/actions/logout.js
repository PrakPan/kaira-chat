import * as actionTypes from "./actionsTypes";
import { CLIENT_ID, CLIENT_SECRET } from "../../services/constants";
import { logoutinstance } from "../../services/user/auth";
import { clearUserSession } from "../../services/userSession";

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
        clearUserSession();
        dispatch(authLogout());
      })
      .catch((err) => {
        // The server call failing (e.g. an already-expired token) must still
        // log the user out locally — this used to clear storage but leave redux
        // signed in.
        clearUserSession();
        dispatch(authLogout());
      });
  };
};

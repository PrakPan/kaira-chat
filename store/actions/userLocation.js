import * as actionTypes from "./actionsTypes";

export const changeUserLocation = (data) => ({
  type: actionTypes.SET_USER_LOCATION,
  payload: data,
});

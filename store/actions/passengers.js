import * as actionTypes from "./actionsTypes";

export const SetPassengers = (data) => ({
  type: actionTypes.SET_PASSENGERS,
  payload: data,
});

export default SetPassengers

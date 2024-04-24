import * as actionTypes from "./actionsTypes";

export const setBookings = (data) => ({
  type: actionTypes.SET_BOOKINGS,
  payload: data,
});

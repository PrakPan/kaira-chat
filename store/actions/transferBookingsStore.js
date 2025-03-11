import * as actionTypes from "./actionsTypes";

export const setTransferBookings = (data) => ({
  type: actionTypes.SET_TRANSFER_BOOKINGS,
  payload: data,
});

export const clearTransferBookings = () => ({
  type: actionTypes.CLEAR_TRANSFER_BOOKINGS,
});
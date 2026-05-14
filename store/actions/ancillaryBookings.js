import * as actionTypes from "./actionsTypes";

export const setAncillaryBookings = (data) => ({
  type: actionTypes.SET_ANCILLARY_BOOKINGS,
  payload: data,
});

export const addAncillaryBooking = (booking, replaceId = null) => ({
  type: actionTypes.ADD_ANCILLARY_BOOKING,
  payload: { booking, replaceId },
});

export const removeAncillaryBooking = (bookingId) => ({
  type: actionTypes.REMOVE_ANCILLARY_BOOKING,
  payload: bookingId,
});

import * as actionTypes from "./actionsTypes";

export const setItineraryStartDate = (data) => ({
  type: actionTypes.SET_ITINERARY_START_DATE,
  payload: data,
});
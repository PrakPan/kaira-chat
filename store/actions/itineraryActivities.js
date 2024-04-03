import * as actionTypes from "./actionsTypes";

export const setItineraryActivities = (data) => ({
  type: actionTypes.SET_ITINERARY_ACTIVITIES,
  payload: data,
});

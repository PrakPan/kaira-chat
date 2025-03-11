import * as actionTypes from "./actionsTypes";

const setItineraryDaybyDay = (data) => ({
  type: actionTypes.SET_ITINERARY_DAYBYDAY,
  payload: data,
});

export default setItineraryDaybyDay;

import * as actionTypes from "./actionsTypes";

const setItineraryId = (data) => ({
  type: actionTypes.SET_ITINERARY_ID,
  payload: data,
});

export default setItineraryId;

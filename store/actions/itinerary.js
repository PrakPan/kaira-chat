import * as actionTypes from "./actionsTypes";

const setItinerary = (data) => ({
  type: actionTypes.SET_ITINERARY,
  payload: data,
});

export default setItinerary;

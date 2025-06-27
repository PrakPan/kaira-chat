import * as actionTypes from "./actionsTypes";

const setItineraryStatus = (key, value) => ({
    type: actionTypes.SET_ITINERARY_STATUS,
    payload: { key, value },
  });

export default setItineraryStatus;

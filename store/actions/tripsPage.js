import * as actionTypes from "./actionsTypes";

const setTripsPage = (data) => ({
  type: actionTypes.SET_TRIPS_PAGE,
  payload: data,
});

export default setTripsPage;

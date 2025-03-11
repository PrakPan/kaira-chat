import * as actionTypes from "./actionsTypes";

const setHotLocationSearch = (data) => ({
  type: actionTypes.SET_HOT_LOCATIONS,
  payload: data,
});

export default setHotLocationSearch;

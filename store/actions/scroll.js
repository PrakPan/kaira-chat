import * as actionTypes from "./actionsTypes";

export const changeScrollBehaviour = (data) => ({
  type: actionTypes.SCROLL_CHANGE,
  payload: data,
});
import * as actionTypes from "./actionsTypes";

const setPlan = (data) => ({
  type: actionTypes.SET_PLAN,
  payload: data,
});

export default setPlan;

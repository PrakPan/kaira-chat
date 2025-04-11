import * as actionTypes from "../actions/actionsTypes";

const initialState = null;

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_PASSENGERS:
      return action.payload;
    default:
      return state;
  }
};

export default reducer;
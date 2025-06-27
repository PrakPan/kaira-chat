import * as actionTypes from "../actions/actionsTypes";

// Define initial state
const initialState = false;

// Define reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_CALL_PAYMENT_INFO:
      return action.payload;
    default:
      return state;
  }
};

export default reducer;

import * as actionTypes from "../actions/actionsTypes";

// Define initial state
const initialState = null;

// Define reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_CART:
      return action.payload;
    default:
      return state;
  }
};

export default reducer;

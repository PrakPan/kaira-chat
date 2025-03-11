import * as actionTypes from "../actions/actionsTypes";

// Define initial state
const initialState = null;

// Define reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_ITINERARY_ROUTES:
      return [...action.payload];

    default: {
      return state;
    }
  }
};

export default reducer;

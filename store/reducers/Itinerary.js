import * as actionTypes from "../actions/actionsTypes";

// Define initial state
const initialState = {
  name: "",
  images: ["null"],
};

// Define reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_ITINERARY:
      return action.payload;
    default:
      return state;
  }
};

export default reducer;

import * as actionTypes from "../actions/actionsTypes";

// Define initial state
const initialState = {
  startDate: null,
};

// Define reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_ITINERARY_START_DATE:
      return {
        ...state,
        startDate: action.payload.date,
      };

    default: {
      return state;
    }
  }
};

export default reducer;

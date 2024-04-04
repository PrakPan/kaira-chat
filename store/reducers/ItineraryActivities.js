import * as actionTypes from "../actions/actionsTypes";

// Define initial state
const initialState = {
  activities: null,
};

// Define reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_ITINERARY_ACTIVITIES:
      return {
        ...state,
        activities: [...action.payload.activities],
      };

    default: {
      return state;
    }
  }
};

export default reducer;

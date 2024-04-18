import * as actionTypes from "../actions/actionsTypes";

// Define initial state
const initialState = {
  routes: null,
};

// Define reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_ITINERARY_ROUTES:
      return {
        ...state,
        routes: [...action.payload.routes],
      };

    default: {
      return state;
    }
  }
};

export default reducer;

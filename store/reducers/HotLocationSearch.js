import * as actionTypes from "../actions/actionsTypes";

// Define initial state
const initialState = {
  locations: [],
};

// Define reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_HOT_LOCATIONS:
      return {
        locations: action.payload,
      };

    default: {
      return state;
    }
  }
};

export default reducer;

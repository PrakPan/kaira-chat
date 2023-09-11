import * as actionTypes from "../actions/actionsTypes";

// Define initial state
const initialState = {
  location : null ,
};

// Define reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_USER_LOCATION:
      return {
        location: action.payload.location,
      };

    default: {
      return state;
    }
  }
};

export default reducer;

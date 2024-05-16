import * as actionTypes from "../actions/actionsTypes";

// Define initial state
const initialState = {
  overflow: "scroll",
};

// Define reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SCROLL_CHANGE:
      return {
        overflow: action.payload.overflow,
      };

    default: {
      return state;
    }
  }
};

export default reducer;

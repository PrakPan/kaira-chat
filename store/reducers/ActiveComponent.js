import * as actionTypes from "../actions/actionsTypes";

// Define initial state
const initialState = {
  activeComponent: null,
};

// Define reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_ACTIVE_COMPONENT:
      return {
        ...state,
        activeComponent: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;

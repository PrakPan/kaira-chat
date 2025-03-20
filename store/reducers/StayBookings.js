import * as actionTypes from "../actions/actionsTypes";


const initialState = null;

// Define reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_STAYS:
      return [...action.payload];

    case actionTypes.UPDATE_STAYS:
          return [
           action.payload
          ]
    default: {
      return state;
    }
  }
};

export default reducer;

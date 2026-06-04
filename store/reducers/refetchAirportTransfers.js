import * as actionTypes from "../actions/actionsTypes";

// Monotonic counter — each dispatch increments it so a useEffect keyed on the
// value fires even for back-to-back transfer/hotel updates.
const initialState = 0;

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_REFETCH_AIRPORT_TRANSFERS:
      return state + 1;
    default:
      return state;
  }
};

export default reducer;

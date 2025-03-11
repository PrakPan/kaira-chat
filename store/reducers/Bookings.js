import * as actionTypes from "../actions/actionsTypes";

// Define initial state
const initialState = {
  stayBookings: null,
  activityBookings: null,
  transferBookings: null,
  flightBookings: null,
  accommodationBookings:null
};

// Define reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_BOOKINGS:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default reducer;

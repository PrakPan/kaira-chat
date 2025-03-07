import * as actionTypes from "../actions/actionsTypes";

const initialState = {
  intercity: null,
  intracity: null,
  airport: null,
  transferBookings: null,  // ✅ Add this line
};


const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_TRANSFER_BOOKINGS:
      return {
        ...state,
        transferBookings: action.payload,
      }
      
    case actionTypes.CLEAR_TRANSFER_BOOKINGS:
      return {
        ...state,
        transferBookings: null,
      };

    default:
      return state;
  }
};

export default reducer;

import * as actionTypes from "../actions/actionsTypes";

const initialState = {
  transferBookings: null, 
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

    case actionTypes.UPDATE_TRANSFER_BOOKINGS:
      return {
       ...state,
       transferBookings: action.payload
      }

      case actionTypes.UPDATE_SINGLE_TRANSFER:
        console.log("Reducer: updating transferBookings", action.payload);
        return {
         ...state,
         transferBookings: action.payload
        }

    default:
      return state;
  }
};

export default reducer;

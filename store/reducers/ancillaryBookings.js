import * as actionTypes from "../actions/actionsTypes";

const initialState = null;

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_ANCILLARY_BOOKINGS:
      return action.payload;
    case actionTypes.ADD_ANCILLARY_BOOKING: {
      const { booking, replaceId } = action.payload || {};
      if (!booking) return state;
      const current = Array.isArray(state) ? state : [];
      const filtered = current.filter(
        (b) => b?.id !== booking.id && (!replaceId || b?.id !== replaceId)
      );
      return [...filtered, booking];
    }
    case actionTypes.REMOVE_ANCILLARY_BOOKING: {
      const id = action.payload;
      if (!id || !Array.isArray(state)) return state;
      return state.filter((b) => b?.id !== id);
    }
    default:
      return state;
  }
};

export default reducer;

import * as actionTypes from "../actions/actionsTypes";

const initialState = {
  itinerary_status: "PENDING",
  transfers_status: "PENDING",
  pricing_status: "PENDING",
  hotels_status: "PENDING",
  finalized_status:"PENDING",
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_ITINERARY_STATUS:
      const { key, value } = action.payload;
      return {
        ...state,
        [key]: value,
      };

    default:
      return state;
  }
};

export default reducer;

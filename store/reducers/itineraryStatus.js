import * as actionTypes from "../actions/actionsTypes";

const initialState = {
  itinerary_status: "PENDING",
  transfers_status: "PENDING",
  pricing_status: "PENDING",
  hotels_status: "PENDING",
  finalized_status:"PENDING",
  final_status: "PENDING",
  // True while one of the itinerary update/edit actions (Update Dates,
  // Route Edit, refresh_itinerary, Reprice) is mid-poll. Chat input listens
  // to this and disables typing until every status resolves.
  is_polling: false,
  // Streamed progress notes from /status/ — ChatKitPanel renders these as
  // an in-chat batched list with a divider between consecutive polls.
  notes: [],
  display_text: null,
  version: null,
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

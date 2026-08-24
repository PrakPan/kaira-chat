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
  // True from the moment the Route tab's editor is opened until it closes —
  // i.e. for as long as its "Update Route" bar owns the bottom of the screen.
  // The mobile layout reads this to stand its View Cart bar down, so the two
  // never stack. Not the same as "has unsaved edits": the bar is there for the
  // whole session, greyed out until there is something to save.
  route_bar_active: false,
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

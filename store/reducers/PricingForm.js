import * as actionTypes from "../actions/actionsTypes";

// Initial pricing-form state. All values are JSON-serialisable so the slice
// stays Redux-safe. This is the lightweight "confirm a few final details before
// pricing" card streamed by the backend as a `pricing-form:{...}` widget.
export const initialPricingFormState = {
  active: false,
  completed: false,
  // True while the backend `pricing_form_shimmer` effect is in flight — the
  // card renders a skeleton loader until the prefill (pricing-form widget)
  // lands.
  loading: false,
  // Card copy — defaults mirror the backend widget's static children; the
  // widget handler overrides these when the streamed card carries its own text.
  heading: "Almost there!",
  subheading: "Confirm a few final details before pricing.",
  // Departure city — prefilled from the widget, shown as a tag, and editable
  // via the start_locations autocomplete API (single location only).
  startCity: null, // string location label
  startCityPlaceId: null, // Google place id of the committed location
  startCityQuery: "", // live search-input text
  startCityCompleted: false,
  // Whether the trip is international — gates the visa / eSIM questions.
  isInternational: false,
  // add_flights: yes/no. `null` = not answered yet (blocks submit unless the
  // backend already marked it complete).
  addFlights: null, // boolean | null
  addFlightsCompleted: false,
  // add_visa / add_esim default to false; only surfaced for international trips.
  addVisa: false,
  addVisaCompleted: false,
  addEsim: false,
  addEsimCompleted: false,
};

const reducer = (state = initialPricingFormState, action) => {
  switch (action.type) {
    case actionTypes.SET_PRICING_FORM:
      return { ...initialPricingFormState, ...(action.payload || {}) };
    case actionTypes.UPDATE_PRICING_FORM:
      return { ...state, ...(action.payload || {}) };
    case actionTypes.RESET_PRICING_FORM:
      return initialPricingFormState;
    default:
      return state;
  }
};

export default reducer;

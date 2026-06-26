import * as actionTypes from "../actions/actionsTypes";

// Initial intake-form state. All values are JSON-serialisable (dates are ISO
// strings, never Date objects) so the slice stays Redux-safe.
export const initialIntakeFormState = {
  active: false,
  step: 0,
  completed: false,
  // Selected destination — drives the in-chat form AND the left image panel.
  destination: null, // { name, image, country, resource_id, latitude, longitude }
  query: "",
  when_mode: "flexible", // "dates" | "flexible" | "surprise"
  startDate: null, // ISO string
  endDate: null, // ISO string
  flexMonth: null,
  flexNights: 7,
  who: "",
  adults: 2,
  children: 0,
  infants: 0,
  notes: "",
  // Featured destination tiles shown in step 1 (defaults live in the
  // IntakeForm constants; overridden when the form_fields effect carries them).
  featured: [],
};

const reducer = (state = initialIntakeFormState, action) => {
  switch (action.type) {
    case actionTypes.SET_INTAKE_FORM:
      return { ...initialIntakeFormState, ...(action.payload || {}) };
    case actionTypes.UPDATE_INTAKE_FORM:
      return { ...state, ...(action.payload || {}) };
    case actionTypes.RESET_INTAKE_FORM:
      return initialIntakeFormState;
    default:
      return state;
  }
};

export default reducer;

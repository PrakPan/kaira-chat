import * as actionTypes from "../actions/actionsTypes";
import countryCodes from "../data/countryCodes";

// Define initial state — the full bundled dial-code list (previously only India/
// UK/US were seeded and the rest were fetched from restcountries.com, which is
// now deprecated). Shipping the complete list keeps every country available and
// searchable without any runtime network dependency.
const initialState = countryCodes;

// Define reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_COUNTRY_CODES:
      return { ...action.payload };
    default: {
      return state;
    }
  }
};

export default reducer;

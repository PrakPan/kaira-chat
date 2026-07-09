import * as actionTypes from "./actionsTypes";
import countryCodes from "../data/countryCodes";

export const setCountryCodes = (data) => ({
  type: actionTypes.SET_COUNTRY_CODES,
  payload: data,
});

// Load the full dial-code list. This used to fetch from restcountries.com, but
// that API is now deprecated and only ever returned an error payload — leaving
// the store on its 3 seeded defaults. The complete list is bundled locally, so
// this just ensures it's in the store (idempotent; no network dependency).
export const getCountryCodes = () => {
  return (dispatch, getState) => {
    if (Object.keys(getState().CountryCodes || {}).length >= Object.keys(countryCodes).length) {
      return;
    }
    dispatch(setCountryCodes(countryCodes));
  };
};

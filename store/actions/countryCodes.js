import axios from "axios";
import * as actionTypes from "./actionsTypes";

export const setCountryCodes = (data) => ({
  type: actionTypes.SET_COUNTRY_CODES,
  payload: data,
});

export const getCountryCodes = () => {
  return (dispatch, getState) => {
    const URL = "https://restcountries.com/v3.1/all/?fields=name,flags,idd";

    if (getState().CountryCodes !== null) return;

    axios
      .get(URL)
      .then((response) => {
        const data = response.data;
        let countries = {};
        for (let country of data) {
          if (country?.idd?.root) {
            countries[country.name.common] = {
              value: country.name.common,
              label: country.idd?.suffixes
                ? country.idd.root + country.idd.suffixes[0]
                : country.idd.root,
              img: country.flags.svg,
            };
          }
        }

        dispatch(setCountryCodes(countries));
      })
      .catch((err) => {
        console.log("[ERROR][getCountryCodes]: ", err.message);
      });
  };
};

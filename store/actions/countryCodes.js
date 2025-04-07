import axios from "axios";
import * as actionTypes from "./actionsTypes";

export const setCountryCodes = (data) => ({
  type: actionTypes.SET_COUNTRY_CODES,
  payload: data,
});

export const getCountryCodes = () => {
  return (dispatch, getState) => {
    const URL = "https://restcountries.com/v3.1/all/?fields=name,flags,idd";

    if (Object.keys(getState().CountryCodes) > 3) return;

    axios
      .get(URL)
      .then((response) => {
        let data = response.data;
        data.sort((a, b) => a.name.common.localeCompare(b.name.common));
        let countries = {};
        for (let country of data) {
          if (country?.idd?.root) {
            const code =
              country.idd?.suffixes && country.idd.suffixes.length === 1
                ? country.idd.root + country.idd.suffixes[0]
                : country.idd.root;
            countries[country.name.common] = {
              value: country.name.common,
              label: code.length <= 4 ? code : country.idd.root,
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

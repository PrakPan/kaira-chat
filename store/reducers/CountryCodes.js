import * as actionTypes from "../actions/actionsTypes";

// Define initial state
const initialState = {
  India: {
    img: "https://flagcdn.com/in.svg",
    label: "+91",
    value: "India",
  },
  "United Kingdom": {
    img: "https://flagcdn.com/gb.svg",
    label: "+44",
    value: "United Kingdom",
  },
  "United States": {
    img: "https://flagcdn.com/us.svg",
    label: "+1",
    value: "United States",
  },
};

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

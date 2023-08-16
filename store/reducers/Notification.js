import * as actionTypes from "../actions/actionsTypes";

// Define initial state
const initialState = {
  //   activeComponent: null,
  text: "",
  type: "",
  heading: "",
  show: false,
  duration : 5
};

// Define reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.NOTIFICATION_OPEN:

    console.log("action: ", action);
      return {
        ...state,
        text: action.payload.text,
        type: action.payload.type,
        heading: action.payload.heading,
        duration : action.payload.duration,
        show: true,
      };
    case actionTypes.NOTIFICATION_CLOSE:
      return initialState;
    default:
      return state;
  }
};

export default reducer;

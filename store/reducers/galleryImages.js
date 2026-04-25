import * as actionTypes from "../actions/actionsTypes";

// Define initial state
const initialState = {
  images: [],
};

// Define reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_GALLERY_IMAGES:
      return {
        images: action.payload,
      };

    default: {
      return state;
    }
  }
};

export default reducer;

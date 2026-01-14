import * as actionTypes from "../actions/actionsTypes";

const initialState = {
  isOpen: false
};

export default function cloneItineraryReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.SET_CLONE_ITINERARY_DRAWER:
      return { ...state, isOpen: action.payload };
    default:
      return state;
  }
}
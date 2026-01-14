import * as actionTypes from "./actionsTypes";

export const setCloneItineraryDrawer = (isOpen) => ({
  type: actionTypes.SET_CLONE_ITINERARY_DRAWER,
  payload: isOpen
});
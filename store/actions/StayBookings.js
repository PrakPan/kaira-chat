import * as actionTypes from "./actionsTypes";

export const setStays = (data) => ({
  type: actionTypes.SET_STAYS,
  payload: data,
});

export const updateStays = (bookingIdToDelete) => {
  console.log("Inside Stays Redux", bookingIdToDelete);
  return (dispatch, getState) => {
    const state = getState();
    const updatedData = state.Stays.map((category) =>
      category?.id === bookingIdToDelete ? { ...category, id: "" } : category
    );
    console.log("Updated Data ", updatedData);

    dispatch({
      type: actionTypes.UPDATE_STAYS,
      payload: updatedData,
    });
  };
};

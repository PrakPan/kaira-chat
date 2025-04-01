import * as actionTypes from "./actionsTypes";

export const setTransfersBookings = (data) => {
  return {
    type: actionTypes.SET_TRANSFER_BOOKINGS,
    payload: data,
  };
};

export const clearTransferBookings = () => ({
  type: actionTypes.CLEAR_TRANSFER_BOOKINGS,
});

export const updateTransferBookings = (bookingIdToDelete) => {
  //console.log("Inside Redux",bookingIdToDelete);
  return (dispatch, getState) => {
    const state = getState();
    const updatedData = { ...state.TransferBookings?.transferBookings }; 
    Object.keys(updatedData).forEach((category) => {
      if (updatedData[category]) {
        Object.keys(updatedData[category]).forEach((key) => {
          if (key === bookingIdToDelete) {
            updatedData[category][key] = {};
          }
        });
      }
    });
  //  console.log("Updated Data ",updatedData);

    dispatch({
      type: actionTypes.UPDATE_TRANSFER_BOOKINGS,
      payload: updatedData,
    });
  };
};


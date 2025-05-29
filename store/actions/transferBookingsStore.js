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
  console.log("Inside Redux", bookingIdToDelete);
  return (dispatch, getState) => {
    const state = getState();
    const updatedData = { ...state.TransferBookings?.transferBookings }; 
    console.log("Updated Data", updatedData);
    
    Object.keys(updatedData).forEach((category) => {
      if (updatedData[category]) {
        
        if (category === 'intercity') {
          
          Object.keys(updatedData[category]).forEach((key) => {
            if (updatedData[category][key]?.id === bookingIdToDelete) {
              updatedData[category][key] = {};
            }
          });
        } else if (category === 'intracity' || category === 'airport') {
          Object.keys(updatedData[category]).forEach((key) => {
            if (Array.isArray(updatedData[category][key])) {
              updatedData[category][key] = updatedData[category][key].map((booking) => {
                if (booking.id === bookingIdToDelete) {
                  return [];
                }
                return booking;
              });
            }
          });
        }
      }
    });
    
    console.log("Updated Data ", updatedData);

    dispatch({
      type: actionTypes.UPDATE_TRANSFER_BOOKINGS,
      payload: updatedData,
    });
  };
};

export const updateSingleTransferBooking = (keyPath, data) => {
  return (dispatch, getState) => {
    const state = getState();
    const currentTransferBookings = state.TransferBookings?.transferBookings;


    if (!currentTransferBookings) {
      console.error("Transfer bookings not found in state");
      return;
    }
  
    const updatedData = JSON.parse(JSON.stringify(currentTransferBookings));

    if (updatedData.intercity && updatedData.intercity[keyPath]) {
      updatedData.intercity[keyPath] = data;
      dispatch({
        type: actionTypes.UPDATE_SINGLE_TRANSFER,
        payload: updatedData,
      });
    } else {
      console.error(`Key path ${keyPath} not found in intercity bookings`);
    }
  };
};


import { axiosGetTransfers } from "../../services/itinerary/bookings";
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

export const updateTransferBookings = (
  bookingIdToDelete,
  childIds = [],
  comboType = null,
) => {
  return (dispatch, getState) => {
    const state = getState();
    const updatedData = { ...state.TransferBookings?.transferBookings };


    // Create a Set of all IDs to delete (parent + children)
    if (childIds && childIds.length > 0) {
      const idsToDelete = new Set([bookingIdToDelete, ...childIds]);

      Object.keys(updatedData).forEach((category) => {
        if (updatedData[category]) {
          if (category === "intercity") {
            // Handle intercity bookings
            Object.keys(updatedData[category]).forEach((key) => {
              const booking = updatedData[category][key];

              // Check if this booking's ID is in the set of IDs to delete
              if (booking?.id && idsToDelete.has(booking.id)) {
                // For multicity combo, delete the entire key
                if (comboType === "multicity") {
                  delete updatedData[category][key];
                } else {
                  // For regular bookings, set to empty object
                  updatedData[category][key] = {};
                }
              }
            });
          } else if (category === "intracity" || category === "airport") {
            // Handle intracity and airport bookings (arrays)
            Object.keys(updatedData[category]).forEach((key) => {
              if (Array.isArray(updatedData[category][key])) {
                // Filter out bookings with IDs in the delete set
                updatedData[category][key] = updatedData[category][key].filter(
                  (booking) => !idsToDelete.has(booking?.id),
                );
              }
            });
          }
        }
      });

      dispatch({
        type: actionTypes.UPDATE_TRANSFER_BOOKINGS,
        payload: updatedData,
      });
    } else {
      Object.keys(updatedData).forEach((category) => {
        if (updatedData[category]) {
          if (category === "intercity") {
            Object.keys(updatedData[category]).forEach((key) => {
              if (updatedData[category][key]?.id === bookingIdToDelete) {
                updatedData[category][key] = {};
              }
            });
          } else if (category === "intracity" || category === "airport") {
            Object.keys(updatedData[category]).forEach((key) => {
              if (Array.isArray(updatedData[category][key])) {
                updatedData[category][key] = updatedData[category][key].map(
                  (booking) => {
                    if (booking.id === bookingIdToDelete) {
                      return [];
                    }
                    return booking;
                  },
                );
              }
            });
          }
        }
      });

      dispatch({
        type: actionTypes.UPDATE_TRANSFER_BOOKINGS,
        payload: updatedData,
      });
    }
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
      try{
      updatedData.intercity[keyPath] = data;
      
      
      dispatch({
        type: actionTypes.UPDATE_SINGLE_TRANSFER,
        payload: updatedData,
      });
    }catch(err){
      
    }
    } else {
      console.error(`Key path ${keyPath} not found in intercity bookings`);
    }
  };
};

export const updateAirportTransferBooking = (keyPath, data) => {
  return (dispatch, getState) => {
    const state = getState();
    const currentTransferBookings = state.TransferBookings?.transferBookings;

    if (!currentTransferBookings) {
      console.error("Transfer bookings not found in state");
      return;
    }

    const updatedData = JSON.parse(JSON.stringify(currentTransferBookings));

    if (!updatedData.airport) {
      updatedData.airport = {};
    }

    if (updatedData.airport[keyPath]) {
      updatedData.airport[keyPath].push(data);
    } else {
      updatedData.airport[keyPath] = [data];
    }


    dispatch({
      type: actionTypes.UPDATE_AIRPORT_TRANSFER,
      payload: updatedData,
    });
  };
};

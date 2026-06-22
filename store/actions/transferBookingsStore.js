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
    const source = state.TransferBookings?.transferBookings;
    if (!source) return;

    // Every id we need to remove: the deleted booking plus any explicit
    // children passed in. The delete endpoint for a multicity combo is called
    // with the PARENT id (e.g. a sightseeing taxi that belongs to a combo), and
    // the child legs reference that parent via their `parent` field — not their
    // own `id`. So a booking must be removed when EITHER its own id is targeted
    // OR it belongs to a deleted parent. Matching on `parent` lets a single
    // parent-id delete cascade to every leg without the caller enumerating them.
    const idsToDelete = new Set([bookingIdToDelete, ...(childIds || [])]);
    const shouldDelete = (booking) =>
      idsToDelete.has(booking?.id) || idsToDelete.has(booking?.parent);

    // Clone each category one level deep so we never mutate the live state
    // (a shallow spread of the root still shares the nested category objects).
    const updatedData = { ...source };

    Object.keys(updatedData).forEach((category) => {
      const group = updatedData[category];
      if (!group) return;

      if (category === "intercity") {
        const next = { ...group };
        Object.keys(next).forEach((key) => {
          // Keep the route key (origin_itinerary_city_id:destination_itinerary_city_id)
          // so the leg slot stays in place — just empty out the booking.
          if (shouldDelete(next[key])) {
            next[key] = {};
          }
        });
        updatedData[category] = next;
      } else if (category === "intracity" || category === "airport") {
        const next = { ...group };
        Object.keys(next).forEach((key) => {
          if (Array.isArray(next[key])) {
            next[key] = next[key].filter((booking) => !shouldDelete(booking));
          }
        });
        updatedData[category] = next;
      }
    });

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
      try {
        updatedData.intercity[keyPath] = data;

        dispatch({
          type: actionTypes.UPDATE_SINGLE_TRANSFER,
          payload: updatedData,
        });
      } catch (err) {}
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

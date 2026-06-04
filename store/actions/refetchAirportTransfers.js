import * as actionTypes from "./actionsTypes";

// Bump this counter after a route (flight/train/bus/ferry) or hotel change so
// ItineraryContainer re-polls the status API and re-fetches the transfer
// bookings — the backend reprices the city's airport transfers and deletes the
// previous bookings whenever such a change happens.
export const SetRefetchAirportTransfers = () => ({
  type: actionTypes.SET_REFETCH_AIRPORT_TRANSFERS,
});

export default SetRefetchAirportTransfers;

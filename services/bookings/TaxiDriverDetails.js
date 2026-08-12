import axios from "axios";
import { MERCURY_HOST } from "../constants";

/**
 * Assigned driver and vehicle for a confirmed Mozio taxi transfer.
 *
 *   GET /api/v1/transfers/taxi/<booking_id>/driver-details/
 *
 * Mozio-only: mercury answers 400 `not_a_mozio_booking` for any other transfer source, so
 * callers must gate on the booking's source rather than treat an error as "no driver".
 */
export const axiosTaxiDriverDetails = axios.create({
  baseURL: MERCURY_HOST + "/api/v1/transfers/taxi/",
});

export const fetchTaxiDriverDetails = (bookingId, token) =>
  axiosTaxiDriverDetails.get(`${bookingId}/driver-details/`, {
    headers: {
      Authorization: `Bearer ${token || (typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : "")}`,
    },
  });

export default fetchTaxiDriverDetails;

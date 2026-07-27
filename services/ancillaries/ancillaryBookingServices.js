import axios from "axios";
import { MERCURY_HOST } from "../constants";

export const ancillaryBooking = axios.create({
  baseURL: MERCURY_HOST + "/api/v1/itinerary/",
});

// Booked visas and eSIMs are read back through the same generic booking
// endpoint every other booking type uses — /bookings/<booking_type>/<id>/,
// the one the activity drawer hits — with "ancillary" as the type, since
// both are AncillaryBookings server-side. The supplier detail endpoints
// (ancillaries/visa/detail, ancillaries/esim/packages/detail) are only for
// picking a new item: they re-query the supplier and 502 when a package has
// since been pulled, which is not a reason a saved booking should fail to open.
export const getAncillaryBookingDetail = (itineraryId, bookingId) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  return ancillaryBooking.get(
    `${itineraryId}/bookings/ancillary/${bookingId}/`,
    token ? { headers: { Authorization: `Bearer ${token}` } } : undefined,
  );
};

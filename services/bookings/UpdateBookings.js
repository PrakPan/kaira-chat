import axios from "axios";
import { MIS_SERVER_HOST, MERCURY_HOST } from "../constants";

const fetchaccommodations = axios.create({
  baseURL: MIS_SERVER_HOST + "/sales/bookings/",
});

export default fetchaccommodations;

export const updateFlightBooking = axios.create({
  baseURL: MERCURY_HOST + "/api/v1/sales/bookings/flight/create/",
});

export const updateAccommodationBooking = axios.create({
  baseURL: MERCURY_HOST + "/api/v1/sales/bookings/accommodation/create/",
});

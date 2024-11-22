import axios from "axios";
import { MIS_SERVER_HOST, MERCURY_HOST } from "../constants";

const bookings = axios.create({
  baseURL: MIS_SERVER_HOST + "/sales/bookings/",
});

export default bookings;

export const axiosGetAllBookings = axios.create({
  baseURL: MERCURY_HOST + "/api/v1/itinerary/"
})

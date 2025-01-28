import axios from "axios";
import { MIS_SERVER_HOST, MERCURY_HOST } from "../constants";

const updatetaxigozo = axios.create({
  baseURL: MIS_SERVER_HOST + "/sales/cab/hold/",
});

export default updatetaxigozo;

export const axiosTaxiBooking = axios.create({
  baseURL: MERCURY_HOST + "/api/v1/itinerary/"
})

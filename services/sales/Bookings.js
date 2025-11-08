import axios from "axios";
import { MIS_SERVER_HOST } from "../constants";
import { MERCURY_HOST } from "../constants";

const preview = axios.create({
  baseURL: MIS_SERVER_HOST + "/sales/bookings",
});

export const updateCartPricing = axios.create({
  baseURL: `${MERCURY_HOST}/api/v1/itinerary/`,
});

export default preview;

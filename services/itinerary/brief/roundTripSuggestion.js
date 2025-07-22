import axios from "axios";
import { MERCURY_HOST, MIS_SERVER_HOST } from "../../constants";

const axiosRoundTripInstance = axios.create({
  baseURL: MIS_SERVER_HOST + "/sales/taxi/round_trip_suggestion/",
});

export const axiosMulticityRoundTripInstance = axios.create({
  baseURL: MERCURY_HOST + "/api/v1/itinerary/",
});

export default axiosRoundTripInstance;

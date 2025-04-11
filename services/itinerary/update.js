import axios from "axios";
import { MERCURY_HOST, MIS_SERVER_HOST } from "../constants";

const axiosItineraryUpdateInstance = axios.create({
  baseURL: MIS_SERVER_HOST + "/sales/itinerary/update/",
});

export const axiosMercuryItineraryUpdateInstance = axios.create({
  baseURL: MERCURY_HOST + "/api/v1/itinerary/update/",
});
export default axiosItineraryUpdateInstance;

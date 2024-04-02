import axios from "axios";
import { MIS_SERVER_HOST } from "../constants";

const axiosItineraryUpdateInstance = axios.create({
  baseURL: MIS_SERVER_HOST + "/sales/itinerary/update/",
});

export default axiosItineraryUpdateInstance;

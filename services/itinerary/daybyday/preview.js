import axios from "axios";
import { MERCURY_HOST, MIS_SERVER_HOST } from "../../constants";

const preview = axios.create({
  baseURL: MIS_SERVER_HOST + "/sales/itinerary/preview/day_by_day",
});

export default preview;

export const axiosGetItinerary = axios.create({
  baseURL: MERCURY_HOST + "/api/v1/itinerary/"
})

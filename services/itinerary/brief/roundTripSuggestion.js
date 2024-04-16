import axios from "axios";
import { MIS_SERVER_HOST } from "../../constants";

const axiosRoundTripInstance = axios.create({
  baseURL: MIS_SERVER_HOST + "/sales/taxi/round_trip_suggestion/",
});

export default axiosRoundTripInstance;

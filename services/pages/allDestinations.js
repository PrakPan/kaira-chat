import axios from "axios";
import { CONTENT_SERVER_HOST } from "../constants";

const axiosAllDestinationsInstance = axios.create({
  baseURL: CONTENT_SERVER_HOST + "/poi/country",
});

export default axiosAllDestinationsInstance;

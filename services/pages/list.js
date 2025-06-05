import axios from "axios";
import { CONTENT_SERVER_HOST, MERCURY_HOST } from "../constants";

const instance = axios.create({
  baseURL: MERCURY_HOST + "/api/v1/website/pages/",
});

export default instance;

export const axiosPageList = axios.create({
  // baseURL:  MERCURY_HOST + "/api/v1/website/pages/",
  baseURL:  MERCURY_HOST+ "/api/v1/website/pages/",
});

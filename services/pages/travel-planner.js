import axios from "axios";
import { CONTENT_SERVER_HOST, MERCURY_HOST } from "../constants";

const instance = axios.create({
  baseURL: CONTENT_SERVER_HOST + "/page/",
});

export default instance;

export const axiosPageInstance = axios.create({
  baseURL: MERCURY_HOST + "/api/v1/website/page/",
  //  baseURL: "https://dev.mercury.tarzanway.com" + "/api/v1/website/page/",
});

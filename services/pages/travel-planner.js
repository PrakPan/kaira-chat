import axios from "axios";
import { CONTENT_SERVER_HOST, MERCURY_HOST } from "../constants";

const instance = axios.create({
  baseURL: CONTENT_SERVER_HOST + "/page/",
});

export default instance;

export const axiosPageInstance = axios.create({
  baseURL: "https://mercury.tarzanway.com" + "/api/v1/website/page/",
});

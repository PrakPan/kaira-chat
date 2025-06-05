import axios from "axios";
import { CONTENT_SERVER_HOST, MERCURY_HOST } from "../constants";

const instance = axios.create({
  baseURL: MERCURY_HOST + "/api/v1/website/page/",
});

export default instance;

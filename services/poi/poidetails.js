import axios from "axios";
import { CONTENT_SERVER_HOST, MERCURY_HOST } from "../constants";

const instance = axios.create({
  baseURL: MERCURY_HOST + "/poi/detail/",
});

export default instance;

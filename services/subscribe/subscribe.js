import axios from "axios";
import { CONTENT_SERVER_HOST } from "../constants";

const instance = axios.create({
  baseURL: CONTENT_SERVER_HOST + "/mail/subscribe/",
});

export default instance;

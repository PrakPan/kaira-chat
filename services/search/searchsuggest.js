import axios from "axios";
import { CONTENT_SERVER_HOST } from "../constants";

const axiossearchinstance = axios.create({
  baseURL: CONTENT_SERVER_HOST + "/search/suggest/",
});

export default axiossearchinstance;

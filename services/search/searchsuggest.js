import axios from "axios";
import { MERCURY_HOST } from "../constants";

const axiossearchinstance = axios.create({
  baseURL: MERCURY_HOST + "/api/v1/geos/search/suggest/",
});

export default axiossearchinstance;

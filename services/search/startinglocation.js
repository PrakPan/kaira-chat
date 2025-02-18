import axios from "axios";
import { MERCURY_HOST } from "../constants";

const axiossearchstartinginstance = axios.create({
  baseURL: MERCURY_HOST + "/api/v1/geos/search/start_locations/",
});

export default axiossearchstartinginstance;

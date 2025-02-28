import axios from "axios";
import { MERCURY_HOST, MIS_SERVER_HOST } from "../constants";

const fetchaccommodations = axios.create({
  baseURL: MIS_SERVER_HOST + "/sales/taxi/suggestion/",
});

export const fetchTransferMode = axios.create({
  baseURL: MERCURY_HOST + "/api/v1/geos/route/",
});

export default fetchaccommodations;

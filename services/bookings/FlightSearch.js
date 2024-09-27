import axios from "axios";
import { MIS_SERVER_HOST, MERCURY_HOST } from "../constants";

const fetchaccommodations = axios.create({
  baseURL: MIS_SERVER_HOST + "/tbo/flight/search/",
});

export default fetchaccommodations;


export const axiosFlightSearch = axios.create({
  baseURL: MERCURY_HOST + "/api/v1/transfers/flight/search/",
})

export const axiosFlightFareRule = axios.create({
  baseURL: MERCURY_HOST + "/api/v1/transfers/flight/fare-rules/",
})

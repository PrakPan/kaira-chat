import axios from "axios";
import { MERCURY_HOST, MIS_SERVER_HOST } from "../constants";

const tailored = axios.create({
  baseURL: MIS_SERVER_HOST + "/lead/tailored_travel/response/",
});

export default tailored;

export const itineraryInitiate = axios.create({
  baseURL: MERCURY_HOST + "/api/v1/itinerary/create/initiate/"
})

export const itineraryComplete = axios.create({
  baseURL: MERCURY_HOST + "/api/v1/itinerary/create/complete/"
})
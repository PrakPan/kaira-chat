import axios from "axios";
import { CHATKIT_API_URL, MERCURY_HOST, MIS_SERVER_HOST } from "../constants";

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
// Kaira's suggested preference chips for the last form step.
// POST { destination: string | string[], start_date, group_type, max_chips }
// -> { chips: string[] }
export const contextChips = axios.create({
  baseURL: CHATKIT_API_URL + "/context-chips",
})

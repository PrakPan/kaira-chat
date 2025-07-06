import axios from "axios";
import { MERCURY_HOST } from "../constants";

const axiossearchinstance = axios.create({
  baseURL: MERCURY_HOST + "/api/v1/geos/search/suggest/",
});

export const axiosHubsAutocomplete = axios.create({
  baseURL: MERCURY_HOST + "/api/v1/geos/search",
})

export const gmapsAutocomplete = axios.create({
   baseURL: MERCURY_HOST + "/api/v1/geos/gmaps_address/autocomplete",
})
export default axiossearchinstance;

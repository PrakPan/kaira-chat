import axios from "axios";
import { MERCURY_HOST } from "../constants";

export const visaSearch = axios.create({
  baseURL: MERCURY_HOST + "/api/v1/ancillaries/visa/search/",
});

export const visaDetail = axios.create({
  baseURL: MERCURY_HOST + "/api/v1/ancillaries/visa/detail/",
});

export const visaBooking = axios.create({
  baseURL: MERCURY_HOST + "/api/v1/itinerary/",
});

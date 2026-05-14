import axios from "axios";
import { MERCURY_HOST } from "../constants";

export const esimPackages = axios.create({
  baseURL: MERCURY_HOST + "/api/v1/ancillaries/esim/packages/",
});

export const esimPackageDetail = axios.create({
  baseURL: MERCURY_HOST + "/api/v1/ancillaries/esim/packages/detail/",
});

export const esimBooking = axios.create({
  baseURL: MERCURY_HOST + "/api/v1/itinerary/",
});

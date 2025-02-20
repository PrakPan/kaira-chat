import axios from "axios";
import { MERCURY_HOST, MIS_SERVER_HOST } from "../constants";

const payment = axios.create({
  baseURL: MIS_SERVER_HOST + "/payment/info/",
});

export const axiosGetPaymentInfo = axios.create({
  baseURL: MERCURY_HOST + "/api/v1/itinerary/",
});

export default payment;

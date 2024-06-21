import axios from "axios";
import { MIS_SERVER_HOST } from "../constants";

const payment = axios.create({
  baseURL: MIS_SERVER_HOST + "/payment/info/",
});

export default payment;

import axios from "axios";
import { MIS_SERVER_HOST } from "../constants";

const bookings = axios.create({
  baseURL: MIS_SERVER_HOST + "/sales/bookings/",
});

export default bookings;

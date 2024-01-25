import axios from "axios";
import { MIS_SERVER_HOST } from "../constants";

const addActivity = axios.create({
  baseURL: MIS_SERVER_HOST + "/sales/bookings/activity/add/",
});

export default addActivity;

import axios from "axios";
import { MERCURY_HOST, MIS_SERVER_HOST } from "../constants";

// const myplans = axios.create({
//   baseURL: MIS_SERVER_HOST + "/sales/my_plans",
// });

const myplans = axios.create({
  baseURL: MERCURY_HOST + "/api/v1/itinerary/my-plans",
});

export default myplans;

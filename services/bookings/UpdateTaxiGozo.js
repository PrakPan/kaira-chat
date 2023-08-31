import axios from "axios";
import { MIS_SERVER_HOST } from "../constants";

const updatetaxigozo = axios.create({
  baseURL: MIS_SERVER_HOST + "/sales/cab/hold/",
});

export default updatetaxigozo;

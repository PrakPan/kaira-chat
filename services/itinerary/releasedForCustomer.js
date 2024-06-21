import axios from "axios";
import { MIS_SERVER_HOST } from "../constants";

const indexedItinerary = axios.create({
  baseURL: MIS_SERVER_HOST + "/sales/itinerary/indexed/",
});

export default indexedItinerary;

import axios from "axios";
import { MERCURY_HOST } from "../constants";

const offlineQuote = axios.create({
  baseURL: MERCURY_HOST + "/api/v1/itinerary/",
});

export const requestOfflineQuote = ({ itinerary_id, type, payload, token }) => {
  return offlineQuote.post(`${itinerary_id}/get-offline-quote/?type=${type}`, payload, {
    headers: {
      Authorization: `Bearer ${token || (typeof window !== "undefined" ? localStorage.getItem("access_token") : "")}`,
      "Content-Type": "application/json",
    },
  });
};

export default offlineQuote;

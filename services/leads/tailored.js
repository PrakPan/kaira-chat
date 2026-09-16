import axios from "axios";
import { MERCURY_HOST, MIS_SERVER_HOST } from "../constants";

const tailored = axios.create({
  baseURL: MIS_SERVER_HOST + "/lead/tailored_travel/response/",
});

export default tailored;

export const itineraryInitiate = axios.create({
  baseURL: MERCURY_HOST + "/api/v1/itinerary/create/initiate/"
})

export const itineraryComplete = axios.create({
  baseURL: MERCURY_HOST + "/api/v1/itinerary/create/complete/"
})
// Kaira's suggested preference chips for the last form step.
//
// POST /api/v1/itinerary/onboarding/context-chips/
//   {
//     destination: string | string[],
//     start_date: "YYYY-MM-DD",      // ISO, not the DD-MM-YYYY the old
//                                    // chatkit endpoint took
//     group_type: string,
//     max_chips?: number,            // honoured — omitting it returns fewer
//     user_conversation?: [{ user, system }]   // prior turns, when there are any
//   }
//   -> { chips: string[] }
//
// Moved off `CHATKIT_API_URL + "/context-chips"` onto Mercury. The response
// shape is unchanged, so callers only had to change the date format and can now
// optionally send the conversation so far.
export const contextChips = axios.create({
  baseURL: MERCURY_HOST + "/api/v1/itinerary/onboarding/context-chips/",
})

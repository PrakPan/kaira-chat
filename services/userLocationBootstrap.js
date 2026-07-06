import axios from "axios";
import Cookies from "js-cookie";

// ── User-location bootstrap ──────────────────────────────────────────────────
// Resolves the visitor's location once and caches it for 3 days (localStorage +
// cookie). On any failure it falls back to New Delhi and caches THAT too, so the
// UI never hangs on "Getting your location…". After 3 days the cache is stale
// and the next call re-fetches. Cache-first + an in-flight guard make it safe to
// call from multiple places (e.g. _app and Layout) without duplicate requests.

const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
const LS_KEY = "userLocation";
const LS_TS_KEY = "userLocation_ts";

export const DELHI_LOCATION = {
  text: "New Delhi, IN",
  city: "New Delhi",
  country: "India",
  country_code: "IN",
  currency: "INR",
  place_id: "ChIJLbZ-NFv9DDkRzk0gTkm3wlI",
  lat: 28.6139,
  long: 77.209,
};

let inFlight = false;

export async function bootstrapUserLocation(onResolved) {
  if (typeof window === "undefined") return;

  const persist = (loc) => {
    try {
      Cookies.set("userLocation", JSON.stringify(loc), { expires: 3 });
      localStorage.setItem(LS_KEY, JSON.stringify(loc));
      localStorage.setItem(LS_TS_KEY, String(Date.now()));
    } catch (e) {}
  };

  const apply = (loc, doPersist) => {
    if (doPersist) persist(loc);
    try {
      onResolved && onResolved(loc);
    } catch (e) {}
  };

  // 1) Fresh cache (< 3 days) → use it, no network call.
  let cached = null;
  let cachedTs = 0;
  try {
    const raw = localStorage.getItem(LS_KEY);
    cachedTs = Number(localStorage.getItem(LS_TS_KEY)) || 0;
    if (raw) cached = JSON.parse(raw);
  } catch (e) {}

  if (cached && cachedTs && Date.now() - cachedTs < THREE_DAYS_MS) {
    if (!Cookies.get("userLocation")) {
      try {
        Cookies.set("userLocation", JSON.stringify(cached), { expires: 3 });
      } catch (e) {}
    }
    apply(cached, false);
    return;
  }

  // 2) Legacy cookie (no timestamp) → adopt it and stamp the cache.
  const cookieRaw = Cookies.get("userLocation");
  if (cookieRaw && !cached) {
    try {
      apply(JSON.parse(cookieRaw), true);
      return;
    } catch (e) {}
  }

  // 3) Stale / missing → fetch a fresh location, Delhi on any failure.
  if (inFlight) return;
  inFlight = true;
  try {
    const ipRes = await axios.get("https://api.ipify.org?format=json");
    const ip = ipRes?.data?.ip;
    if (!ip) throw new Error("No IP");
    const locRes = await axios.get(
      `https://dev.mercury.tarzanway.com/api/v1/geos/search/user_location/?ip=${ip}`
    );
    if (locRes?.data) apply(locRes.data, true);
    else apply(DELHI_LOCATION, true);
  } catch (e) {
    apply(DELHI_LOCATION, true);
  } finally {
    inFlight = false;
  }
}

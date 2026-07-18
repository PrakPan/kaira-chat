import axios from "axios";
import Cookies from "js-cookie";
import { MERCURY_HOST } from "./constants";

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

// A few country names the geo API returns (Google-geocoding style) diverge from
// the dial-code list's keys (mledoze `name.common`). Map the known cases so they
// still resolve. Keyed by lowercased geo name → exact CountryCodes key.
const COUNTRY_NAME_ALIASES = {
  "turkey": "Türkiye",
  "côte d'ivoire": "Ivory Coast",
  "cote d'ivoire": "Ivory Coast",
  "myanmar (burma)": "Myanmar",
  "burma": "Myanmar",
  "swaziland": "Eswatini",
  "cabo verde": "Cape Verde",
  "east timor": "Timor-Leste",
  "palestinian territories": "Palestine",
  "vatican city": "Vatican City",
  "holy see": "Vatican City",
  "united states of america": "United States",
  "the bahamas": "Bahamas",
  "the gambia": "Gambia",
  "czech republic": "Czechia",
  "south korea": "South Korea",
  "north korea": "North Korea",
};

// Map a resolved user-location object (from redux `UserLocation.location`, e.g.
// { country: "United Arab Emirates", currency: "AED", ... }) to a key in the
// CountryCodes map ({ [countryName]: { value, label, img } }). Tries, in order:
// exact country-name match, case-insensitive match, a small alias table for
// Google↔list naming divergences, and finally an ISO2 code (if the location
// carries one) via the flag URL. Returns null when nothing matches so callers
// can keep their default (India).
export function countryKeyFromLocation(loc, CountryCodes) {
  if (!loc || !CountryCodes) return null;

  const country = String(loc.country || "").trim();
  if (country) {
    // 1) Exact match against the dial-code list's keys.
    if (CountryCodes[country]) return country;
    // 2) Case-insensitive match.
    const lower = country.toLowerCase();
    for (const name of Object.keys(CountryCodes)) {
      if (name.toLowerCase() === lower) return name;
    }
    // 3) Known alias (Google name → list name), verified to still exist.
    const alias = COUNTRY_NAME_ALIASES[lower];
    if (alias && CountryCodes[alias]) return alias;
  }

  // 4) ISO2 code (e.g. "US"), if present, → the lowercase code baked into the
  //    flag URL. This geo API doesn't return one, but other callers might.
  const cc = String(loc.country_code || "").toLowerCase();
  if (cc) {
    for (const name of Object.keys(CountryCodes)) {
      const img = CountryCodes[name] && CountryCodes[name].img;
      if (img && img.includes(`flagcdn.com/${cc}.svg`)) return name;
    }
  }

  return null;
}

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
      `${MERCURY_HOST}/api/v1/geos/search/user_location/?ip=${ip}`
    );
    if (locRes?.data) apply(locRes.data, true);
    else apply(DELHI_LOCATION, true);
  } catch (e) {
    apply(DELHI_LOCATION, true);
  } finally {
    inFlight = false;
  }
}

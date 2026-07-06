// Single source of truth for ad attribution params (utm_*, click ids, source, etc.)
// captured from the landing URL and persisted for the browser session so they
// survive navigation and reach the backend on itinerary creation.

const STORAGE_KEY = "ttw_ad_attribution";

// First page the user landed on this session (home `/`, a destination page, a
// theme page, ...). Captured first-touch and persisted so it survives the
// navigation to /chat and reaches the backend on chat/itinerary creation.
const LANDING_PAGE_KEY = "ttw_landing_page";

// Whitelist of params treated as ad attribution. Intentionally NOT "all query
// params" — re-appending everything would leak internal UI state (slideIndex,
// drawer, tailored-travel, ...) across the app.
export const AD_PARAM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "utm_id",
  "gclid",
  "gbraid",
  "wbraid",
  "fbclid",
  "msclkid",
  "ttclid",
  "source",
  "ref",
];

// `source` is overloaded: it carries genuine ad attribution (source=google,
// source=newsletter, ...) but is ALSO used as internal UI routing state. These
// internal values must never be persisted as attribution — otherwise they get
// re-appended onto param-less URLs (e.g. a plain /chat refresh would gain
// ?source=tailored and be mistaken for a tailored-form landing).
const INTERNAL_SOURCE_VALUES = ["tailored"];

// Read the whitelisted ad params (as strings) from the current URL.
function readAdParamsFromUrl() {
  if (typeof window === "undefined") return {};
  const urlParams = new URLSearchParams(window.location.search);
  const params = {};
  for (const key of AD_PARAM_KEYS) {
    const value = urlParams.get(key);
    if (value === null || value === "") continue;
    // Skip internal UI `source` values so they aren't persisted/re-appended.
    if (key === "source" && INTERNAL_SOURCE_VALUES.includes(value)) continue;
    params[key] = value;
  }
  return params;
}

// Drop internal UI `source` values from a params object (defends against a
// sessionStorage entry persisted before this guard existed).
function stripInternalSource(params) {
  if (params && INTERNAL_SOURCE_VALUES.includes(params.source)) {
    const { source, ...rest } = params;
    return rest;
  }
  return params;
}

// Return the ad params persisted for this session ({} if none / SSR).
export function getAdParams() {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? stripInternalSource(JSON.parse(raw)) : {};
  } catch (e) {
    return {};
  }
}

// Return the first landing page path persisted for this session ("" if none / SSR).
export function getLandingPage() {
  if (typeof window === "undefined") return "";
  try {
    return sessionStorage.getItem(LANDING_PAGE_KEY) || "";
  } catch (e) {
    return "";
  }
}

// Capture the first page the user landed on this session (first-touch: only the
// very first navigation is stored; later navigations leave it untouched).
// Returns the currently stored landing page.
export function captureLandingPage() {
  if (typeof window === "undefined") return "";
  const existing = getLandingPage();
  if (existing) return existing;
  const path = window.location.pathname;
  try {
    sessionStorage.setItem(LANDING_PAGE_KEY, path);
  } catch (e) {
    // ignore storage write failures (private mode, quota, etc.)
  }
  return path;
}

// Capture ad params from the current URL into sessionStorage.
// Last-touch within session: only overwrite when the incoming URL actually
// carries ad params; a param-less navigation keeps the previously stored set.
// Returns the currently stored object.
export function captureAdParams() {
  if (typeof window === "undefined") return {};
  const fromUrl = readAdParamsFromUrl();
  if (Object.keys(fromUrl).length > 0) {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(fromUrl));
    } catch (e) {
      // ignore storage write failures (private mode, quota, etc.)
    }
    return fromUrl;
  }
  return getAdParams();
}

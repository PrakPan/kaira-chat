// Main-thread session tracker — the single source of truth for the analytics
// session id. The Partytown analytics worker is a pure sender that receives the
// session id via config / setSession(); all session lifecycle logic lives here
// where localStorage, document.referrer and the UTM helper are reliably
// available.
//
// Sessionization: one session id persisted in localStorage with a 30-minute
// SLIDING inactivity timeout. It is reused across reloads, tabs and SPA
// navigations, and only rotates after 30 minutes of inactivity — so a logged-out
// visit that later logs in, or a browse that later creates an itinerary, stays a
// single session.

import { getAdParams, getLandingPage } from "../helper/adAttribution";

const SESSION_ID_KEY = "jupiter_session_id";
const LAST_ACTIVE_KEY = "jupiter_session_last_active";
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

function nowMs() {
  return new Date().getTime();
}

function safeGet(key) {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    return null;
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    // private mode / quota — ignore
  }
}

function generateUUID() {
  try {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    if (typeof crypto !== "undefined" && crypto.getRandomValues) {
      const b = crypto.getRandomValues(new Uint8Array(16));
      b[6] = (b[6] & 0x0f) | 0x40;
      b[8] = (b[8] & 0x3f) | 0x80;
      const hex = Array.from(b, (x) => x.toString(16).padStart(2, "0"));
      return `${hex.slice(0, 4).join("")}-${hex.slice(4, 6).join("")}-${hex
        .slice(6, 8)
        .join("")}-${hex.slice(8, 10).join("")}-${hex.slice(10, 16).join("")}`;
    }
  } catch (e) {
    // fall through
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Return the current session id, minting a new one when none exists or the
 * previous one has been idle past the timeout. Always refreshes the sliding
 * last-active timestamp.
 *
 * @returns {{ sessionId: string, isNew: boolean }}
 */
export function getOrCreateSession() {
  if (typeof window === "undefined") {
    return { sessionId: generateUUID(), isNew: true };
  }

  const existingId = safeGet(SESSION_ID_KEY);
  const lastActiveRaw = safeGet(LAST_ACTIVE_KEY);
  const lastActive = lastActiveRaw ? parseInt(lastActiveRaw, 10) : 0;
  const isFresh =
    existingId && lastActive && nowMs() - lastActive < SESSION_TIMEOUT_MS;

  let sessionId;
  let isNew;
  if (isFresh) {
    sessionId = existingId;
    isNew = false;
  } else {
    sessionId = generateUUID();
    isNew = true;
    safeSet(SESSION_ID_KEY, sessionId);
  }
  safeSet(LAST_ACTIVE_KEY, String(nowMs()));
  return { sessionId, isNew };
}

/**
 * Slide the inactivity window forward (call on activity / route change).
 * Re-mints and reports isNew=true if the previous session had expired.
 * @returns {{ sessionId: string, isNew: boolean }}
 */
export function syncSession() {
  return getOrCreateSession();
}

/** Read the current session id without minting a new one. */
export function getSessionId() {
  if (typeof window === "undefined") return null;
  return safeGet(SESSION_ID_KEY);
}

/**
 * Entry context sent once per session with `session_started`. Kept flat so the
 * backend (which stores properties as a string map) can query each field.
 */
export function getEntryContext() {
  const ad = getAdParams() || {};
  const path = typeof window !== "undefined" ? window.location.pathname : "";
  let referrer = "";
  let landingUrl = "";
  try {
    referrer = document.referrer || "";
  } catch (e) {}
  try {
    landingUrl = window.location.href;
  } catch (e) {}

  return {
    entry_page: path,
    landing_page: getLandingPage() || path,
    referrer,
    landing_url: landingUrl,
    utm_source: ad.utm_source || "",
    utm_medium: ad.utm_medium || "",
    utm_campaign: ad.utm_campaign || "",
    utm_term: ad.utm_term || "",
    utm_content: ad.utm_content || "",
    gclid: ad.gclid || "",
    source: ad.source || "",
    is_new_session: true,
  };
}

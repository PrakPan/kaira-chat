import { EXCHANGE_RATE_API_KEY } from "./constants";

// ── INR exchange rates ───────────────────────────────────────────────────────
// Our fixed amounts (the ₹5,000 sign-in credit) are authored in INR; for a
// visitor elsewhere they're shown converted. The `/latest/INR` table is kept in
// localStorage for 24 hours from the moment it was fetched; the first call
// after that fetches again. If that refetch fails, the old table is used for
// this call only — its expiry is left in the past, so the next call retries.

const LS_KEY = "ttw_fx_inr";
const TTL_MS = 24 * 60 * 60 * 1000;

let memory = null; // { rates, expiresAt }
let inFlight = null;

function readStore() {
  if (memory) return memory;
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.rates && typeof parsed.rates === "object") {
      memory = parsed;
      return memory;
    }
  } catch (e) {}
  return null;
}

/** Cached INR→X table (possibly stale), or null when nothing is cached. */
export function readCachedInrRates() {
  return readStore()?.rates ?? null;
}

/**
 * Fresh INR→X table. Resolves from cache when it hasn't expired, otherwise
 * fetches once (concurrent callers share the request). Falls back to whatever
 * stale table is cached — or null — when the key is missing or the call fails.
 */
export function loadInrRates() {
  const cached = readStore();
  if (cached && Date.now() < cached.expiresAt) return Promise.resolve(cached.rates);
  if (typeof window === "undefined" || !EXCHANGE_RATE_API_KEY) {
    return Promise.resolve(cached?.rates ?? null);
  }
  if (inFlight) return inFlight;

  inFlight = fetch(
    `https://v6.exchangerate-api.com/v6/${EXCHANGE_RATE_API_KEY}/latest/INR`,
  )
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      const rates = data?.result === "success" ? data.conversion_rates : null;
      if (!rates) return cached?.rates ?? null;
      memory = { rates, expiresAt: Date.now() + TTL_MS };
      try {
        localStorage.setItem(LS_KEY, JSON.stringify(memory));
      } catch (e) {}
      return rates;
    })
    .catch(() => cached?.rates ?? null)
    .finally(() => {
      inFlight = null;
    });
  return inFlight;
}

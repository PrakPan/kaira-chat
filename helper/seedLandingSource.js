/**
 * Attribution snapshot for a `/chat?seed=…` landing.
 *
 * A seeded chat link used to fire its prompt on page load, so the thread — and
 * with it `threads.request_source` — was created within a tick or two of the
 * landing, while the landing URL was still in the address bar. That is no
 * longer true: the seed hydrates the composer and the thread is created only
 * when the reader presses send, which can be minutes and several history
 * writes later (`?intake` / `?themeForm` cleanup, drawer params, Next's own
 * `?_h=1` catch-up navigation, a thread switch).
 *
 * So the query string that carries the attribution — `seed`, every `utm_*`,
 * `fbclid`, `intake`, the click ids — is snapshotted on the first client render
 * of /chat and read back when the request is finally built. See
 * `buildSourceFields()` in bot-components/hooks/useChat.ts, which is the only
 * consumer, and `handleThreadId` in the same file, which retires the snapshot
 * once the thread it belongs to exists: a second thread started later in the
 * same tab is its own landing and must not inherit this one's `seed`.
 *
 * Module memory is the fast path; sessionStorage is the copy that survives a
 * reload of /chat before the reader has sent anything.
 */

const KEY = "ttw_seed_landing_source";

let memo = null;

const safeSession = () => {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
};

/**
 * Snapshot the current URL's query string, but only for a landing that
 * actually carries a `seed`. Every other entry to /chat keeps reading the live
 * address bar exactly as before, so this cannot change what lands in
 * `request_source` for flows that never deferred anything.
 *
 * Safe to call repeatedly and during render — it returns the same snapshot for
 * the same URL. Returns `null` on the server and on a seedless landing.
 */
export function captureSeedLandingSource() {
  if (typeof window === "undefined") return null;
  const search = window.location.search;
  let hasSeed = false;
  try {
    hasSeed = new URLSearchParams(search).has("seed");
  } catch {
    return null;
  }
  if (!hasSeed) return null;

  const snapshot = { search, path: window.location.pathname + search };
  memo = snapshot;
  const ss = safeSession();
  if (ss) {
    try {
      ss.setItem(KEY, JSON.stringify(snapshot));
    } catch {
      /* private mode / quota — module memory still covers this page view */
    }
  }
  return snapshot;
}

/** The snapshot for this tab's seeded landing, or `null`. Non-destructive. */
export function peekSeedLandingSource() {
  if (memo) return memo;
  const ss = safeSession();
  if (!ss) return null;
  try {
    const raw = ss.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      !parsed ||
      typeof parsed.search !== "string" ||
      typeof parsed.path !== "string"
    ) {
      return null;
    }
    memo = parsed;
    return parsed;
  } catch {
    return null;
  }
}

/** Retire the snapshot once the thread it describes has been created. */
export function clearSeedLandingSource() {
  memo = null;
  const ss = safeSession();
  if (!ss) return;
  try {
    ss.removeItem(KEY);
  } catch {
    /* noop */
  }
}

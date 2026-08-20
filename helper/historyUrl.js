// Rewrite the address bar without going through the Next router.
//
// Next stores `{ url, as, options, __N: true, key }` on every history entry it
// creates, and its popstate handler bails on anything else:
//
//     if (!state.__N) { return }
//
// So a bare `history.replaceState({}, "", url)` doesn't just change the URL — it
// wipes that record, and every later back/forward on that entry moves the
// address bar while the router and the React tree stay put. Normal browsers
// rarely expose it (users go back once, if at all). Meta's in-app browsers do:
// they fire popstate on the swipe-back gesture and again when the app is
// resumed (Next's own source notes Safari "fires popstateevent when reopening
// the browser"), and a webview that gets a popstate the page ignores falls back
// to reloading the previous entry — which reads as the page bouncing back to
// wherever the user came from.
//
// These helpers keep the record intact and just re-point it at the new URL.
// They are for cosmetic URL edits only — adding/removing a query param on the
// page you're already on. Anything that should actually change page still goes
// through `router.push` / `router.replace`.

// Next's `as` is always origin-relative; callers here often hand us a
// `new URL(...).toString()`, which is absolute.
function toRelative(url) {
  try {
    const u = new URL(url, window.location.origin);
    return u.pathname + u.search + u.hash;
  } catch (e) {
    return url;
  }
}

function nextState(url) {
  if (typeof window === "undefined") return null;
  const prev = window.history.state;
  // Not a Next-authored entry (initial document load, or something else already
  // overwrote it): pass it through untouched rather than inventing a record.
  if (!prev || !prev.__N) return prev ?? null;
  const as = toRelative(url);
  return { ...prev, url: as, as };
}

/** Replace the current entry's URL, keeping Next's router state on it. */
export function replaceUrl(url) {
  if (typeof window === "undefined") return;
  try {
    window.history.replaceState(nextState(url), "", url);
  } catch (e) {
    // Some in-app webviews throttle history writes and throw once the quota is
    // hit. The URL is cosmetic here, so a failure must not break the page.
  }
}

/**
 * Push an entry the Next router must NOT act on.
 *
 * The chat surface swaps sessions in place: `/chat` → `/chat/{id}` crosses a
 * route boundary (`/chat` → `/chat/[id]`), so letting the router own the entry
 * would make back/forward remount BotApp and refetch the thread. BotApp's own
 * popstate handler restores the previous session in place instead — see the
 * note in pages/chat/[id].tsx about why the page isn't keyed on router.query.id.
 * The drawer pushes (`?drawer=payment`, `?drawer=addCityTaxi`) use this too, so
 * their back behaviour stays exactly as it was.
 *
 * `__N: false` is what keeps the router out (`if (!state.__N) return`) — the
 * same effect the old bare `{}` had, spelled out so it reads as a decision
 * rather than the oversight this module exists to fix. Unlike `{}` it is only
 * ever used for entries this app creates itself, never to overwrite one the
 * router already owns.
 */
export function pushUrlDetached(url) {
  if (typeof window === "undefined") return;
  try {
    window.history.pushState({ __N: false }, "", url);
  } catch (e) {
    /* see replaceUrl */
  }
}

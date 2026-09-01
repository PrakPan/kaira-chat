import { useEffect } from "react";

/**
 * Puts the app into real browser fullscreen on the user's first tap.
 *
 * WHY A TAP AND NOT LOAD: the Fullscreen API requires transient user
 * activation. A request on mount is rejected by every browser, so the first
 * qualifying gesture anywhere in the page is what carries it. Scrolling does
 * NOT grant activation — only a tap/click/keypress does — which is why this
 * listens for `click` rather than touch movement.
 *
 * WHERE IT ACTUALLY DOES SOMETHING: Android Chrome/Firefox and iPad Safari,
 * which hide the address bar and system bars outright. iPhone Safari does not
 * implement element fullscreen at all (only <video>), so `fullscreenEnabled`
 * is false there and this bails out silently — iPhone gets the edge-to-edge
 * viewport from `viewport-fit=cover` and nothing more. That is a platform
 * limit, not a bug here.
 *
 * ONCE, AND NEVER AGAINST THE USER: one attempt per browsing session. If the
 * user leaves fullscreen themselves — swipe-down, Esc, the back gesture — the
 * session is flagged and we do not drag them back in on their next tap.
 *
 * Escape hatches for QA: `?fullscreen=0` opts the session out, `?fullscreen=1`
 * clears the flags and re-arms.
 */

const ATTEMPTED_KEY = "ttw:fullscreen-attempted";
const OPT_OUT_KEY = "ttw:fullscreen-opt-out";

// sessionStorage throws in Safari private mode and in sandboxed frames, and
// this is a cosmetic feature — never let it take the page down with it.
const readFlag = (key) => {
  try {
    return window.sessionStorage.getItem(key) === "1";
  } catch {
    return false;
  }
};

const writeFlag = (key, on) => {
  try {
    if (on) window.sessionStorage.setItem(key, "1");
    else window.sessionStorage.removeItem(key);
  } catch {
    /* no-op */
  }
};

const fullscreenElement = () =>
  document.fullscreenElement ||
  document.webkitFullscreenElement ||
  document.mozFullScreenElement ||
  document.msFullscreenElement ||
  null;

const fullscreenSupported = () =>
  Boolean(
    document.fullscreenEnabled ||
      document.webkitFullscreenEnabled ||
      document.mozFullScreenEnabled ||
      document.msFullscreenEnabled,
  );

/**
 * Enter fullscreen on <html>. Exported so a header control or a "watch this
 * full screen" affordance can reuse the same vendor-prefix handling.
 * Always resolves — a rejection here is never worth surfacing.
 */
export function requestAppFullscreen(target) {
  const el = target || document.documentElement;
  const fn =
    el.requestFullscreen ||
    el.webkitRequestFullscreen ||
    el.webkitRequestFullScreen ||
    el.mozRequestFullScreen ||
    el.msRequestFullscreen;
  if (!fn) return Promise.resolve(false);
  try {
    // navigationUI: "hide" asks Chrome to drop the URL bar too rather than
    // keeping a minimal one. Ignored by browsers that don't know it.
    const result = fn.call(el, { navigationUI: "hide" });
    return Promise.resolve(result)
      .then(() => true)
      .catch(() => false);
  } catch {
    return Promise.resolve(false);
  }
}

export function exitAppFullscreen() {
  const fn =
    document.exitFullscreen ||
    document.webkitExitFullscreen ||
    document.webkitCancelFullScreen ||
    document.mozCancelFullScreen ||
    document.msExitFullscreen;
  if (!fn || !fullscreenElement()) return Promise.resolve();
  try {
    return Promise.resolve(fn.call(document)).catch(() => {});
  } catch {
    return Promise.resolve();
  }
}

export default function FullscreenOnFirstGesture() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const override = params.get("fullscreen");
    if (override === "0") writeFlag(OPT_OUT_KEY, true);
    if (override === "1") {
      writeFlag(OPT_OUT_KEY, false);
      writeFlag(ATTEMPTED_KEY, false);
    }

    if (readFlag(OPT_OUT_KEY) || readFlag(ATTEMPTED_KEY)) return undefined;

    // Touch devices only. A desktop browser yanked into fullscreen by a stray
    // click is hostile, and there is no address bar worth reclaiming there.
    const coarse =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(pointer: coarse)").matches;
    if (!coarse) return undefined;

    // Launched from the home screen: the chrome is already gone and the OS
    // owns the presentation. Asking again would be a no-op at best.
    const standalone =
      window.navigator.standalone === true ||
      (typeof window.matchMedia === "function" &&
        (window.matchMedia("(display-mode: standalone)").matches ||
          window.matchMedia("(display-mode: fullscreen)").matches));
    if (standalone) return undefined;

    if (!fullscreenSupported() || fullscreenElement()) return undefined;

    // The user pulled out of fullscreen — that is an answer. Flag the session
    // so the next tap doesn't put them straight back.
    const onChange = () => {
      if (!fullscreenElement()) writeFlag(OPT_OUT_KEY, true);
    };

    const onFirstGesture = (event) => {
      // A tap that focuses a field is the one gesture to skip: fullscreen
      // resizes the viewport at the same moment the soft keyboard is opening,
      // and the two together scroll the caret out of view. Leave the listener
      // armed and take the next tap instead.
      const target = event.target;
      if (
        target &&
        typeof target.closest === "function" &&
        target.closest(
          "input, textarea, select, [contenteditable=''], [contenteditable='true'], [data-no-fullscreen]",
        )
      ) {
        return;
      }

      detach();
      writeFlag(ATTEMPTED_KEY, true);
      requestAppFullscreen();
    };

    // Capture phase, so the request is made while the activation is unspent
    // and before any handler can stopPropagation() the event away from us.
    const opts = { capture: true, passive: true };
    const detach = () => {
      document.removeEventListener("click", onFirstGesture, opts);
      document.removeEventListener("keydown", onFirstGesture, opts);
    };

    document.addEventListener("click", onFirstGesture, opts);
    document.addEventListener("keydown", onFirstGesture, opts);
    document.addEventListener("fullscreenchange", onChange);
    document.addEventListener("webkitfullscreenchange", onChange);

    return () => {
      detach();
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener("webkitfullscreenchange", onChange);
    };
  }, []);

  return null;
}

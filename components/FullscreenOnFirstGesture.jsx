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
 * WHERE IT ACTUALLY DOES SOMETHING: Android Chrome/Firefox, and iPad Safari
 * (which adds an overlay exit button the page cannot suppress). Safari on
 * iPHONE has never implemented the Fullscreen API for anything but <video> —
 * still true as of Safari 26.6 — so `fullscreenEnabled` is false there and this
 * bails out silently. Nothing in this file can change that; a page in an iPhone
 * tab cannot hide the address bar, and no site does. The only chrome-free iPhone
 * experience is the home-screen web app (see the apple-mobile-web-app-* tags in
 * pages/_document.js), which the user has to install.
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

    // A gesture that produced no fullscreen — a swipe the browser read as a
    // scroll, a tap the page swallowed — must not burn the one attempt. Only a
    // request that actually resolves counts; anything else re-arms, up to a
    // small ceiling so a browser that always refuses is not asked forever.
    const MAX_ATTEMPTS = 3;
    let attempts = 0;

    const attempt = () => {
      detach();
      attempts += 1;
      requestAppFullscreen().then((entered) => {
        if (entered || attempts >= MAX_ATTEMPTS) {
          writeFlag(ATTEMPTED_KEY, true);
          return;
        }
        if (!readFlag(OPT_OUT_KEY)) attach();
      });
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

      attempt();
    };

    // touchend as well as click, and a start position to measure against.
    // WebKit does not bubble a `click` to the document from an element that is
    // not inherently clickable and carries no handler or `cursor: pointer`, so
    // on iPad — the one Safari that DOES have element fullscreen — a tap on
    // plain page furniture can otherwise go unheard. A drag is not a tap and
    // grants no activation, so a touch that travelled is ignored rather than
    // spent.
    let touchStart = null;
    const TAP_SLOP = 10;

    const onTouchStart = (event) => {
      const t = event.touches && event.touches[0];
      touchStart = t ? { x: t.clientX, y: t.clientY } : null;
    };

    const onTouchEnd = (event) => {
      const t = event.changedTouches && event.changedTouches[0];
      if (!touchStart || !t) return;
      const moved =
        Math.abs(t.clientX - touchStart.x) > TAP_SLOP ||
        Math.abs(t.clientY - touchStart.y) > TAP_SLOP;
      touchStart = null;
      if (moved) return;
      onFirstGesture(event);
    };

    // Capture phase, so the request is made while the activation is unspent
    // and before any handler can stopPropagation() the event away from us.
    const opts = { capture: true, passive: true };

    const attach = () => {
      document.addEventListener("click", onFirstGesture, opts);
      document.addEventListener("keydown", onFirstGesture, opts);
      document.addEventListener("touchstart", onTouchStart, opts);
      document.addEventListener("touchend", onTouchEnd, opts);
    };

    const detach = () => {
      document.removeEventListener("click", onFirstGesture, opts);
      document.removeEventListener("keydown", onFirstGesture, opts);
      document.removeEventListener("touchstart", onTouchStart, opts);
      document.removeEventListener("touchend", onTouchEnd, opts);
    };

    attach();
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

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
 * NOT ON DEV HOSTS: localhost and LAN addresses are skipped outright, because
 * that is where a desktop browser emulates a phone in the DevTools device
 * toolbar — which passes every check here and makes the first click fullscreen
 * the real window. See isDevHost below for what that then breaks.
 *
 * Escape hatches for QA: `?fullscreen=0` opts the session out, `?fullscreen=1`
 * clears the flags, re-arms, and overrides the dev-host skip (that is how you
 * test this on a real phone against `npm run dev`). (`?fullscreen=0` is also
 * the quickest way to confirm a layout bug is fullscreen's doing: if the
 * symptom goes with it, it is the viewport that changed, not the component.)
 *
 * ALSO OWNS `--app-vh` — see useFullscreenViewportHeight below. Entering
 * fullscreen changes the viewport, and on Android Chrome it changes it without
 * the viewport units noticing, so the height the app shell is built on has to
 * be measured for as long as fullscreen is engaged.
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
 * A local or LAN development host.
 *
 * WHY THIS IS A GATE: a dev host is where a desktop browser spends its life
 * pretending to be a phone. Chrome's DevTools device toolbar emulates
 * `pointer: coarse`, touch and a mobile UA, so every check below passes and the
 * FIRST CLICK in device mode throws the real browser window into fullscreen.
 * That alone is a surprise mid-debugging, but the damage is downstream: from
 * then on the shell's height is a MEASURED px value (see --app-vh below)
 * instead of `100dvh`, and the emulated viewport DevTools paints does not have
 * to agree with what that measurement returns. When it comes back larger, the
 * shell overflows the viewport and the page starts scrolling — which is how the
 * itinerary ends up shifted up with a blank strip under it.
 *
 * There is no honest feature test for "is this really a phone" — under
 * emulation the UA, the pointer, the touch points and `screen` are all
 * overridden — so this gates on the one thing emulation cannot fake: the host
 * the page was served from. A real device pointed at a dev server opts back in
 * with `?fullscreen=1`.
 */
const isDevHost = () => {
  const h = window.location.hostname;
  return (
    h === "localhost" ||
    h === "127.0.0.1" ||
    h === "[::1]" ||
    h === "::1" ||
    h === "0.0.0.0" ||
    h.endsWith(".local") ||
    h.endsWith(".localhost") ||
    // Private IPv4 ranges — a phone testing against `npm run dev` over the LAN.
    /^10\./.test(h) ||
    /^192\.168\./.test(h) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(h)
  );
};

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

/**
 * Pins `--app-vh` to the MEASURED viewport height while fullscreen is engaged.
 *
 * WHY: the shell is `h-app` — one viewport tall, `overflow: hidden`, nothing
 * scrolls — so whatever sits at the foot of that column (Kaira's composer, the
 * cart bar) is only reachable if the height is exactly right. `100dvh` is that
 * value everywhere except inside the Fullscreen API on Android Chrome, which
 * grows the viewport when it drops the URL bar without recomputing the viewport
 * UNITS: `100dvh` keeps reporting the pre-fullscreen height, the shell stays
 * sized to a bar that is gone, and the bottom of the chat sheet lands off
 * screen. Since the FIRST TAP is what enters fullscreen, and on the itinerary
 * that first tap is usually "Ask Kaira", the composer was missing on exactly
 * the frame the chat opened.
 *
 * ONLY WHILE FULLSCREEN. Outside it the token is removed and the `:root`
 * default (`100dvh`) applies again, so every browser that never enters
 * fullscreen — iPhone Safari above all, which has no element fullscreen at all
 * — keeps the behaviour it has today. A measured px height is worth trusting
 * only in the one state where the unit is known to be wrong.
 *
 * The value comes from visualViewport where it exists, so the shell also
 * shrinks for the on-screen keyboard and the composer rides above it rather
 * than under it. Skipped while pinch-zoomed (`scale !== 1`), where
 * visualViewport describes the zoom window rather than the layout.
 */
function useFullscreenViewportHeight() {
  useEffect(() => {
    const root = document.documentElement;
    let raf = 0;
    const timers = [];

    const measure = () => {
      const vv = window.visualViewport;
      // Pinch-zoomed: visualViewport is the magnifier, not the layout.
      const zoomed = vv && Math.abs(vv.scale - 1) > 0.01;
      return vv && !zoomed ? vv.height : window.innerHeight;
    };

    const sync = () => {
      if (!fullscreenElement()) {
        root.style.removeProperty("--app-vh");
        return;
      }
      const h = measure();
      if (!h) return;
      const next = `${Math.round(h)}px`;
      // Writing an identical value still invalidates style on some engines;
      // this runs on every resize/scroll tick, so guard it.
      if (root.style.getPropertyValue("--app-vh") !== next) {
        root.style.setProperty("--app-vh", next);
      }
    };

    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(sync);
    };

    // Entering fullscreen is animated and asynchronous: `fullscreenchange`
    // fires before the viewport has settled at its new size, so one read there
    // captures a mid-transition height. Re-measure across the transition and
    // let the last one win. (`resize` normally lands too, but Chrome does not
    // always emit one for the fullscreen grow itself.)
    const resync = () => {
      sync();
      schedule();
      while (timers.length) clearTimeout(timers.pop());
      [120, 350, 700].forEach((ms) => timers.push(setTimeout(sync, ms)));
    };

    // Fullscreen can already be on at mount — a client-side route change
    // remounts this without a fullscreenchange event of its own.
    resync();

    window.addEventListener("resize", schedule);
    window.addEventListener("orientationchange", resync);
    document.addEventListener("fullscreenchange", resync);
    document.addEventListener("webkitfullscreenchange", resync);
    const vv = window.visualViewport;
    if (vv) {
      vv.addEventListener("resize", schedule);
      vv.addEventListener("scroll", schedule);
    }

    return () => {
      cancelAnimationFrame(raf);
      while (timers.length) clearTimeout(timers.pop());
      window.removeEventListener("resize", schedule);
      window.removeEventListener("orientationchange", resync);
      document.removeEventListener("fullscreenchange", resync);
      document.removeEventListener("webkitfullscreenchange", resync);
      if (vv) {
        vv.removeEventListener("resize", schedule);
        vv.removeEventListener("scroll", schedule);
      }
      root.style.removeProperty("--app-vh");
    };
  }, []);
}

export default function FullscreenOnFirstGesture() {
  // Always on, and deliberately ahead of the one-shot request effect below:
  // that effect returns early in half a dozen states (opted out, already
  // attempted, desktop), but the viewport still has to be measured correctly
  // whenever the page is fullscreen — including a fullscreen session this
  // mount did not start.
  useFullscreenViewportHeight();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const override = params.get("fullscreen");
    if (override === "0") writeFlag(OPT_OUT_KEY, true);
    if (override === "1") {
      writeFlag(OPT_OUT_KEY, false);
      writeFlag(ATTEMPTED_KEY, false);
    }

    if (readFlag(OPT_OUT_KEY) || readFlag(ATTEMPTED_KEY)) return undefined;

    // Never on a dev host unless explicitly asked for — see isDevHost above.
    // `?fullscreen=1` is the way to test this on a real device over the LAN.
    if (override !== "1" && isDevHost()) return undefined;

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

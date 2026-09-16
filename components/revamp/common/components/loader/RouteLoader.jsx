import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import styles from "./RouteLoader.module.scss";

// Mounted once in _app.js. A full-screen paper-coloured loader shown between
// pages while Next fetches the next route's data + chunks, so a tap always
// produces visible feedback instead of a page that appears frozen.
//
// Visual language is the house one (PageLoader / ItineraryUpdateLoader): paper
// ground, brand mark pulsing inside a white disc, an ink line with a serif
// accent, and a yellow→indigo sweep bar.
//
// Covering the page is also the point, not just decoration: the overlay eats
// the clicks that would otherwise land on the outgoing page mid-navigation.
//
// Tunables, in ms:
//   SHOW_DELAY  - navigations faster than this never paint, so warm client-side
//                 routes don't flash a full-screen overlay for two frames.
//   MIN_VISIBLE - once shown, stay up at least this long; an overlay that comes
//                 and goes instantly reads as a glitch.
//   FADE_OUT    - time for the fade before unmounting.
const SHOW_DELAY = 250;
const MIN_VISIBLE = 500;
const FADE_OUT = 260;

// Pathname of a router event URL, without query/hash or a trailing slash, so
// "/chat/abc/?drawer=x" and "/chat/abc" compare equal.
const pathOf = (url) => {
  const path = String(url || "").split(/[?#]/)[0];
  return path.length > 1 ? path.replace(/\/+$/, "") : path;
};

const RouteLoader = ({
  active,
  title = (
    <>
      Just a <span className={styles.serif}>moment...</span>
    </>
  ),
  subtitle = "",
}) => {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  // All timers live in refs so a navigation that completes mid-flight can
  // cancel whatever the previous one scheduled.
  const showTimer = useRef(null);
  const hideTimer = useRef(null);
  const shownAt = useRef(0);

  const clearTimers = useCallback(() => {
    clearTimeout(showTimer.current);
    clearTimeout(hideTimer.current);
    showTimer.current = null;
    hideTimer.current = null;
  }, []);

  const start = useCallback(() => {
    // Full reset, so a navigation that begins while the previous one is still
    // fading out gets a fresh overlay instead of inheriting the fade.
    clearTimers();
    setLeaving(false);
    setVisible(false);
    shownAt.current = 0;

    showTimer.current = setTimeout(() => {
      shownAt.current = Date.now();
      setVisible(true);
    }, SHOW_DELAY);
  }, [clearTimers]);

  const finish = useCallback(() => {
    // Never painted yet (a fast navigation) — drop the pending show and leave
    // the page untouched.
    if (!shownAt.current) {
      clearTimers();
      setVisible(false);
      return;
    }

    const held = Date.now() - shownAt.current;
    hideTimer.current = setTimeout(() => {
      setLeaving(true);
      hideTimer.current = setTimeout(() => {
        setVisible(false);
        setLeaving(false);
        shownAt.current = 0;
      }, FADE_OUT);
    }, Math.max(0, MIN_VISIBLE - held));
  }, [clearTimers]);

  // Router-driven mode (the default): follow every client-side navigation.
  useEffect(() => {
    if (active !== undefined) return undefined;

    // `shallow` navigations only rewrite the URL — no data fetch, nothing to
    // wait for. The ad-param rewrite in _app.js does several of these per
    // visit, and an overlay for each would be pure noise.
    //
    // Itinerary building (chat or the tailored form) must never be covered
    // either, so two more cases are skipped:
    //   - same-page navigations (only the query changes): the chat's drawer
    //     params, ItineraryContainer's drawers, the form's slide steps. The
    //     page stays mounted, so there is no new route to wait for.
    //   - landing on a chat session (`/chat/{id}`, including the form's
    //     `?source=tailored` hand-off): that page paints its own layout
    //     skeleton immediately, and a full-screen overlay first would stack two
    //     different loaders back to back.
    const handleStart = (url, options) => {
      if (options?.shallow) return;
      const nextPath = pathOf(url);
      const currentPath = pathOf(window.location.pathname);
      if (nextPath === currentPath) return;
      if (/^\/chat\/[^/]+$/.test(nextPath)) return;
      // Chat → chat. BotApp moves the address bar between /chat and
      // /chat/{id} with history.pushState, which Next doesn't observe, so a
      // drawer push from the chat can target a path that differs from the
      // window's even though the page never changes.
      if (/^\/chat(\/|$)/.test(nextPath) && /^\/chat(\/|$)/.test(currentPath)) {
        return;
      }
      start();
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", finish);
    router.events.on("routeChangeError", finish);
    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", finish);
      router.events.off("routeChangeError", finish);
    };
  }, [router.events, start, finish, active]);

  // Controlled mode: `<RouteLoader active={isLoading} />` drives the same
  // overlay from any async work (a fetch, a form submit) that isn't a route
  // change.
  useEffect(() => {
    if (active === undefined) return;
    if (active) start();
    else finish();
  }, [active, start, finish]);

  // Timers must not outlive the component.
  useEffect(() => clearTimers, [clearTimers]);

  if (!visible) return null;

  return (
    <div
      className={`${styles.overlay} ${leaving ? styles.overlayLeaving : ""}`}
      role="alert"
      aria-live="polite"
      aria-busy="true"
    >
      <div className={styles.inner}>
        <div className={styles.markWrap}>
          <span className={styles.pulse} aria-hidden />
          <span className={styles.mark}>
            {/* Plain <img>: next/image is overkill for a 618-byte inline-ish
                SVG that must appear the instant the overlay does. */}
            <img src="/logo/ttw-mark.svg" alt="" width={40} height={40} />
          </span>
        </div>

        <div className={styles.copy}>
          <p className={styles.title}>{title}</p>
          {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
        </div>

        <div className={styles.track}>
          <span className={styles.sweep} />
        </div>
      </div>
    </div>
  );
};

export default RouteLoader;

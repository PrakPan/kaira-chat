import { useEffect } from "react";
import { useRouter } from "next/router";

const SCROLL_KEY_PREFIX = "scroll-pos:";
const MAX_ENTRIES = 20;

function ScrollRestoration() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const pruneOldEntries = () => {
      const keys = Object.keys(sessionStorage).filter((k) =>
        k.startsWith(SCROLL_KEY_PREFIX)
      );
      if (keys.length >= MAX_ENTRIES) {
        // Remove oldest entries to stay under the limit
        keys.slice(0, keys.length - MAX_ENTRIES + 1).forEach((k) => {
          sessionStorage.removeItem(k);
        });
      }
    };

    const saveScrollPos = (url) => {
      try {
        pruneOldEntries();
        sessionStorage.setItem(
          `${SCROLL_KEY_PREFIX}${url}`,
          JSON.stringify({ x: window.scrollX, y: window.scrollY })
        );
      } catch (e) {
        // Storage still full after pruning — clear all scroll keys and give up
        Object.keys(sessionStorage)
          .filter((k) => k.startsWith(SCROLL_KEY_PREFIX))
          .forEach((k) => sessionStorage.removeItem(k));
      }
    };

    const restoreScrollPos = (url) => {
      try {
        const pos = JSON.parse(
          sessionStorage.getItem(`${SCROLL_KEY_PREFIX}${url}`) || "null"
        );
        if (pos) {
          requestAnimationFrame(() => {
            window.scrollTo(pos.x, pos.y);
          });
        }
      } catch (e) {
        // Silently fail — scroll just won't restore
      }
    };

    router.events.on("routeChangeStart", saveScrollPos);
    router.events.on("routeChangeComplete", restoreScrollPos);

    return () => {
      router.events.off("routeChangeStart", saveScrollPos);
      router.events.off("routeChangeComplete", restoreScrollPos);
    };
  }, [router]);

  return null;
}

export default ScrollRestoration;
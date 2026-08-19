import { useState, useEffect } from "react";

/**
 * NOTE: this deliberately starts at `false` rather than reading
 * `window.matchMedia` during the initial render. The server has no matchMedia,
 * so a lazy initial value would disagree with the SSR markup and produce a
 * hydration mismatch on every one of the 40+ call sites. The trade-off is that
 * the first committed paint always takes the "doesn't match" branch, so this
 * hook is only safe for *behaviour* (measuring, listeners). Anything that
 * decides layout must use CSS breakpoints (`hidden md:block` / `md:hidden`),
 * which apply on the first paint and don't flash.
 */
export default function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);

    // `matches` is intentionally not a dependency: React bails out of a
    // re-render when the value is unchanged, so the guard it used to be read
    // by only cost us a teardown/re-subscribe of the listener on every change.
    const updateMatches = () => setMatches(media.matches);

    updateMatches();

    media.addEventListener("change", updateMatches);

    return () => {
      media.removeEventListener("change", updateMatches);
    };
  }, [query]);

  return matches;
}

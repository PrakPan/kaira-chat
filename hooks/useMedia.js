import { useState, useEffect } from "react";

/**
 * The app's single media-query hook. (There used to be a second copy at
 * components/media.js — same name, different behaviour, and only one of them
 * carried the warning below. That is how the layout bug described further down
 * got written.)
 *
 * This deliberately starts at `false` rather than reading `window.matchMedia`
 * during the initial render. The server has no matchMedia, so a lazy initial
 * value would disagree with the SSR markup and produce a hydration mismatch at
 * every one of the ~80 call sites.
 *
 * The trade-off is that the first committed paint ALWAYS takes the
 * "doesn't match" branch. So this hook is only safe for *behaviour* (measuring,
 * listeners, enabling an interaction).
 *
 * NEVER let it decide layout. Use a CSS breakpoint instead — the global
 * `ttw-narrow-only` / `ttw-wide-only` classes in styles/globals.css, or a
 * Tailwind `md:` utility — because CSS applies on the first paint and cannot
 * flash.
 *
 * What happens if you ignore that: a `max-width` query renders the DESKTOP
 * branch on a phone until hydration, then swaps. On the homepage that made the
 * document 15966px tall instead of 12131px, and in Meta's in-app webview —
 * where hydration takes seconds — anyone who had scrolled past the
 * post-collapse maximum got clamped by the browser to the new bottom and landed
 * on the footer.
 *
 * Note the asymmetry: a `min-width: 767px` query is already correct on a phone
 * (false), so it only flips on wider screens; a `max-width` query flips on
 * exactly the devices that hurt most.
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

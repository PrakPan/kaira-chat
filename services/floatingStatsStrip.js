// Tiny pub/sub for the phone-only floating destination stats strip.
//
// On phones the stats strip (trip cost / visa / duration / best months) is
// pinned to the bottom of the viewport from the moment the page loads, so the
// numbers are visible without scrolling past the Kaira hero. It unpins once the
// page scrolls down to the strip's real in-page slot.
//
// While it is pinned it owns the bottom of the screen — the other fixed bottom
// bars ("Plan your trip" banner, the themed "Discover trip ideas" bar) subscribe
// here and stay hidden so the two never stack.
import { useEffect, useState } from "react";

const EVENT = "ttw:stats-strip-pin";

let pinned = false;

export const setStatsStripPinned = (next) => {
  const value = !!next;
  if (pinned === value) return;
  pinned = value;
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(EVENT, { detail: value }));
  }
};

export const isStatsStripPinned = () => pinned;

// Subscribing components render unpinned on the server / first paint and sync
// on mount, so this never causes a hydration mismatch.
export const useStatsStripPinned = () => {
  const [value, setValue] = useState(false);

  useEffect(() => {
    setValue(pinned);
    const onPin = (e) => setValue(!!e.detail);
    window.addEventListener(EVENT, onPin);
    return () => window.removeEventListener(EVENT, onPin);
  }, []);

  return value;
};

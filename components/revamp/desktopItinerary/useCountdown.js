import { useEffect, useState } from "react";

const pad = (n) => String(n).padStart(2, "0");

/**
 * "07:12:45" — the design's zero-padded clock. Hours are NOT wrapped at 24: a
 * 72-hour hold reads "71:59:59", which is how the design draws its own.
 */
export const formatClock = (msLeft) => {
  const total = Math.max(0, Math.floor(msLeft / 1000));
  return `${pad(Math.floor(total / 3600))}:${pad(
    Math.floor((total % 3600) / 60),
  )}:${pad(total % 60)}`;
};

/**
 * A live countdown to `deadline` (a Date or epoch ms), ticking once a second.
 *
 * Null when there is no deadline and once it has passed — it stops dead rather
 * than counting into negatives, and a caller that has nothing to count down
 * draws nothing rather than "00:00:00".
 */
export default function useCountdown(deadline) {
  const ms =
    deadline instanceof Date
      ? deadline.getTime()
      : Number.isFinite(deadline)
        ? deadline
        : null;

  const [label, setLabel] = useState(null);

  useEffect(() => {
    if (!ms || Number.isNaN(ms)) {
      setLabel(null);
      return undefined;
    }
    let id = 0;
    const tick = () => {
      const left = ms - Date.now();
      if (left > 0) {
        setLabel(formatClock(left));
      } else {
        setLabel(null);
        clearInterval(id);
      }
    };
    tick();
    id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [ms]);

  return label;
}

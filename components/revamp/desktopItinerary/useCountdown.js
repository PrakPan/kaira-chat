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

const toMs = (deadline) =>
  deadline instanceof Date
    ? deadline.getTime()
    : Number.isFinite(deadline)
      ? deadline
      : null;

/**
 * Whether `deadline` has gone by, and it flips live: a quote that runs out
 * while the trip is open turns the card and footer over to "PRICES EXPIRED"
 * without a reload. False with no deadline — a cart that names no end is not
 * claimed to be expired.
 *
 * Read on first render rather than from an effect, so a trip opened long after
 * its quote lapsed never flashes a live price first.
 */
export function useHasPassed(deadline) {
  const ms = toMs(deadline);
  const [passed, setPassed] = useState(() => !!ms && ms <= Date.now());

  useEffect(() => {
    if (!ms || Number.isNaN(ms)) {
      setPassed(false);
      return undefined;
    }
    const left = ms - Date.now();
    if (left <= 0) {
      setPassed(true);
      return undefined;
    }
    setPassed(false);
    // setTimeout caps at ~24.8 days; a deadline further out than that simply
    // never fires here, and the next cart fetch re-arms it.
    if (left > 2 ** 31 - 1) return undefined;
    const id = setTimeout(() => setPassed(true), left);
    return () => clearTimeout(id);
  }, [ms]);

  return !!ms && passed;
}

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

/**
 * When a quote ran out, the way the expired pill names it: "12:00 AM" if it
 * was today, "24 SEP" if it was earlier — a bare time from last week would
 * read as this morning. In the viewer's own clock, like the countdown before it.
 */
export const formatExpiredAt = (deadline) => {
  const ms = toMs(deadline);
  if (!ms) return "";
  const d = new Date(ms);
  const now = new Date();
  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
  if (!sameDay) return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
  const h = d.getHours();
  return `${h % 12 || 12}:${pad(d.getMinutes())} ${h < 12 ? "AM" : "PM"}`;
};

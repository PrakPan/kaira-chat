/**
 * Formatting the transfer booking-detail drawers share. Each drawer used to
 * carry its own copy of these, which is how the taxi and vehicle drawers ended
 * up printing dates in two different shapes.
 */

/** Splits a timestamp into the date and time strings the drawers render. */
export const formatDateTime = (value) => {
  if (!value) return {};
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return {};
  return {
    date: date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      weekday: "short",
    }),
    time: date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
  };
};

/** Short "10:30 AM" / "Jun 12" pair, for dense timelines. */
export const shortDateTime = (value) => {
  if (!value) return {};
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return {};
  return {
    time: date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
    date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  };
};

/**
 * Arrival stamp for a leg that only tells us how long it takes. Only minutes
 * are usable — some suppliers send `duration` as a {text, value} object, and
 * feeding that to a Date produced "Invalid Date" on screen.
 */
export const addMinutesToDate = (value, minutes) => {
  if (!value || typeof minutes !== "number" || Number.isNaN(minutes)) return {};
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return {};
  date.setMinutes(date.getMinutes() + minutes);
  return formatDateTime(date.toISOString());
};

/** "2 adults · 1 child", or null when the booking names no travellers. */
export const paxLabel = (adults, children) =>
  [
    adults ? `${adults} adult${adults > 1 ? "s" : ""}` : null,
    children ? `${children} child${children > 1 ? "ren" : ""}` : null,
  ]
    .filter(Boolean)
    .join(" · ") || null;

/** "1h 45m" from a minute count. */
export const formatMinutes = (minutes) => {
  if (typeof minutes !== "number" || Number.isNaN(minutes)) return null;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return `${hours ? `${hours}h ` : ""}${rest}m`.trim();
};

/**
 * Calendar days crossed between departure and arrival, so an overnight leg can
 * badge its arrival "+1 day" instead of quietly showing a different date.
 * Compared at midnight — a 23:30 → 00:30 hop crosses a day even though it is
 * an hour long.
 */
export const dayOffset = (from, to) => {
  if (!from || !to) return 0;
  const start = new Date(from);
  const end = new Date(to);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0;
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  return Math.round((end - start) / 86400000);
};

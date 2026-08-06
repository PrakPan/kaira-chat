/**
 * Formatting the transfer booking-detail drawers share. Each drawer used to
 * carry its own copy of these, which is how the taxi and vehicle drawers ended
 * up printing dates in two different shapes.
 */

/**
 * Splits a timestamp into the strings the drawers render: `date` for prose
 * ("Thu, 20 Aug 2026"), `shortDate` for the rail's narrow time gutter
 * ("20 Aug"), and `time`.
 */
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
    shortDate: date.toLocaleDateString("en-US", { day: "numeric", month: "short" }),
    time: date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
  };
};

/**
 * The Nth day of a package, for the day rail a sightseeing booking renders.
 * Only the start date and a day count come back from the supplier — the days
 * in between are implied, so they're derived rather than fetched.
 */
export const railStamp = (start, dayIndex = 0) => {
  if (!start) return {};
  const date = new Date(start);
  if (Number.isNaN(date.getTime())) return {};
  date.setDate(date.getDate() + dayIndex);
  return {
    date: date.toLocaleDateString("en-US", { day: "numeric", month: "short" }),
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

/**
 * The booked car on a taxi leg. Suppliers file it under either key on the
 * quote, so both are checked.
 *
 * Self-drive quotes no longer send this at all — see `legVehicleName`.
 */
export const legVehicle = (leg) =>
  leg?.transfer_details?.quote?.taxi_category ||
  leg?.transfer_details?.quote?.vehicle ||
  null;

/**
 * What the booked vehicle is called.
 *
 * Self-drive quotes dropped the `taxi_category` object; the vehicle now arrives
 * as a bare string on the quote — `vehicle_name`, e.g. "Avanza / Xenia /
 * Similar" — so that is read first, and the category's own fields stay as the
 * fallback for the taxi quotes that still carry them.
 */
export const legVehicleName = (leg) =>
  leg?.transfer_details?.quote?.vehicle_name ||
  legVehicle(leg)?.model_name ||
  legVehicle(leg)?.type ||
  null;

/**
 * How an arrival is described when it lands on a later calendar day. The rail
 * used to hardcode "Arrives next day" for any offset at all, which read as a
 * flat lie on a self-drive rental spanning three days.
 */
export const arrivalOffsetLabel = (days) => {
  if (!days || days < 1) return null;
  return days === 1 ? "Arrives next day" : `Arrives ${days} days later`;
};

/**
 * Where a leg starts and ends.
 *
 * `transfer_details.source` is NOT a location — on a self-drive booking it is
 * the string "Self", naming who supplied the quote — so it is only read when it
 * is actually an object. The route itself lives on `trips`, the same place the
 * taxi bookings keep it.
 */
const placeName = (point) =>
  point?.city_name || point?.name || point?.address || null;

export const legEndpoints = (booking) => {
  const details = booking?.transfer_details;
  const trips = details?.trips;
  const firstTrip = Array.isArray(trips) ? trips[0] : null;
  const lastTrip = Array.isArray(trips) ? trips[trips.length - 1] : null;

  const sourceObject =
    details?.source && typeof details.source === "object" ? details.source : null;
  const destinationObject =
    details?.destination && typeof details.destination === "object"
      ? details.destination
      : null;

  const from =
    placeName(sourceObject) ||
    placeName(firstTrip?.origin) ||
    placeName(booking?.source_address) ||
    null;

  const to =
    placeName(destinationObject) ||
    placeName(lastTrip?.destination) ||
    placeName(booking?.destination_address) ||
    null;

  // The street address, when it says something the city name doesn't.
  const fromDetail = firstTrip?.origin?.address;
  const toDetail = lastTrip?.destination?.address;

  return {
    from,
    to,
    fromDetail: fromDetail && fromDetail !== from ? fromDetail : null,
    toDetail: toDetail && toDetail !== to ? toDetail : null,
  };
};

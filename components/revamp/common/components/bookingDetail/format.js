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
 * A leg's duration in minutes, whichever way the supplier expressed it.
 *
 * The older shapes send a bare minute count; the newer ones send
 * `{value, unit}` — and the unit is genuinely "hour" on the quotes ops fill in
 * by hand, so reading `value` as minutes would turn an eight-hour package into
 * eight minutes.
 */
export const durationMinutes = (duration) => {
  const value = typeof duration === "number" ? duration : duration?.value;
  if (typeof value !== "number" || Number.isNaN(value)) return null;
  const unit = String(
    typeof duration === "number" ? "minute" : duration?.unit || "minute",
  ).toLowerCase();
  if (unit.startsWith("hour") || unit.startsWith("hr")) return value * 60;
  if (unit.startsWith("day")) return value * 1440;
  return value;
};

/**
 * The bare figure out of a per-day quote's label.
 *
 * A sightseeing package's allowance is entered as "80 kms per day" / "8 hours
 * per day", and the drawers set those under a "Per day" chip and after a day
 * count — where the supplier's own suffix reads back as "8 hours per day
 * daily". Strip it and let the surrounding copy say it once.
 */
export const perDayFigure = (text) =>
  typeof text === "string"
    ? text.replace(/\s*(per\s*day|\/\s*day|daily)\s*$/i, "").trim() || null
    : text || null;

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
 * One end of a leg, split into what to lead with and what to say under it.
 *
 * An endpoint names the place and the city separately — `name` is the station,
 * port or pickup address, `city_name` the city it stands in — and on a
 * city-level endpoint the two are the same string. Leading with the city, which
 * this used to do, is only right for that second case: it announced Shinagawa
 * as "Tokyo", and turned an intra-city rail hop into "Hong Kong → Hong Kong".
 */
const placePair = (point) => {
  if (!point || typeof point !== "object") return null;
  const title = point.name || point.address || point.city_name || null;
  if (!title) return null;
  const city = point.city_name || null;
  return { title, detail: city && city !== title ? city : null };
};

/**
 * Where a leg starts and ends.
 *
 * `transfer_details.source` is NOT a location on every shape — on a self-drive
 * booking it is the string "Self", naming who supplied the quote — so it is
 * only read when it is actually an object. The route itself lives on `trips`,
 * the same place the taxi bookings keep it, and the booking's own
 * `source_address` / `destination_address` are the last resort.
 */
export const legEndpoints = (booking) => {
  const details = booking?.transfer_details;
  const trips = details?.trips;
  const firstTrip = Array.isArray(trips) ? trips[0] : null;
  const lastTrip = Array.isArray(trips) ? trips[trips.length - 1] : null;

  const origin =
    placePair(details?.source) ||
    placePair(firstTrip?.origin) ||
    placePair(booking?.source_address);

  const destination =
    placePair(details?.destination) ||
    placePair(lastTrip?.destination) ||
    placePair(booking?.destination_address);

  return {
    from: origin?.title || null,
    to: destination?.title || null,
    // The city, when it says something the place name doesn't.
    fromDetail: origin?.detail || null,
    toDetail: destination?.detail || null,
  };
};

/**
 * The rail for a booking sold by the day rather than by the leg — a sightseeing
 * package. One node per day, because only the start date and a day count are
 * stored and the days in between are implied.
 *
 * Shared, so that a city's sightseeing slot describes what it holds the same
 * way whether that is a taxi at the traveller's disposal or a self-booked train
 * pass.
 */
export const packageDayNodes = ({
  start,
  days,
  meta = null,
  pickup = null,
  title = "At your disposal",
}) =>
  Array.from({ length: Math.max(1, days || 1) }, (_, index) => {
    const stamp = railStamp(start, index);
    return {
      kind: "day",
      key: `day-${index}`,
      time: `Day ${index + 1}`,
      date: stamp.date,
      title,
      subtitle: meta || null,
      // The pickup point is stated once, on the day it happens.
      tag: index === 0 && pickup ? `Pickup: ${pickup}` : null,
    };
  });

/**
 * A quoted distance in kilometres, whichever way the supplier expressed it.
 *
 * Almost every quote sends `{text, unit: "km", value}`, but a handful of older
 * ones send a bare number — and `text` is prose ("361 kms", "80 kms per day"),
 * so it is the wrong thing to add up. Only the numeric side is read here; the
 * unit is honoured so a metre figure does not get summed as kilometres.
 */
export const distanceKm = (distance) => {
  const value = typeof distance === "number" ? distance : distance?.value;
  if (typeof value !== "number" || Number.isNaN(value)) return null;
  const unit = String(
    typeof distance === "number" ? "km" : distance?.unit || "km",
  ).toLowerCase();
  if (unit === "m" || unit.startsWith("met")) return value / 1000;
  return value;
};

/**
 * How many calendar days a booking covers, counting both ends — a leg that
 * starts and ends on the same date is one day, not zero.
 */
export const spanDays = (from, to) =>
  Math.max(1, dayOffset(from, to || from) + 1);

/**
 * How far one leg of a package actually runs, in kilometres.
 *
 * A point-to-point leg quotes the distance it covers. A sightseeing leg quotes
 * an ALLOWANCE PER DAY ("80 kms per day") for however many days the car is at
 * the traveller's disposal — so its figure only becomes a distance once it is
 * multiplied by that span. Summing the raw `distance.value` off every leg,
 * which is the obvious thing to do, counts a three-day package as a single
 * 80 km hop.
 */
export const legDistanceKm = (leg) => {
  const km = distanceKm(leg?.transfer_details?.distance);
  if (km === null) return null;
  return leg?.transfer_type === "sightseeing"
    ? km * spanDays(leg?.check_in, leg?.check_out)
    : km;
};

/**
 * What a multi-leg package adds up to: the road distance across all of its
 * legs, and the calendar days it spans.
 *
 * `km` is null rather than 0 when no leg quoted a distance — a package whose
 * supplier itemised nothing should say nothing, not claim "0 kms". `partial`
 * flags the mixed case, where some legs carried a figure and others did not,
 * so the caller can label the total as at-least rather than exact.
 */
export const packageTotals = (legs) => {
  const list = (legs || []).filter(Boolean);
  const distances = list.map(legDistanceKm);
  const quoted = distances.filter((km) => km !== null);

  const starts = list.map((leg) => leg?.check_in).filter(Boolean);
  const ends = list.map((leg) => leg?.check_out || leg?.check_in).filter(Boolean);

  return {
    km: quoted.length ? Math.round(quoted.reduce((sum, km) => sum + km, 0)) : null,
    partial: quoted.length > 0 && quoted.length < list.length,
    days: starts.length
      ? spanDays(
          starts.reduce((a, b) => (new Date(a) <= new Date(b) ? a : b)),
          ends.length
            ? ends.reduce((a, b) => (new Date(a) >= new Date(b) ? a : b))
            : null,
        )
      : null,
  };
};

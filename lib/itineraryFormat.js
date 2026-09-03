// ─────────────────────────────────────────────────────────────────────────────
//  Pure formatters for the itinerary surfaces.
//
//  Everything here is a lift of logic that previously lived as closures inside
//  `containers/itinerary/VerticalLayout.js`'s `CityItem` (which closed over its
//  props) and `components/itinerary/itineraryCity/CityDay.jsx`. They are
//  rewritten as free functions taking the booking explicitly, so the mobile
//  view-model can build labels without mounting a component.
//
//  Rules preserved verbatim from the originals — do not "simplify" them:
//    • ISO dates are parsed LOCALLY. `new Date("2026-10-01")` is UTC midnight,
//      which renders as 30 Sep in any negative offset.
//    • A flight is labelled by its HUB, not the city: the "Munnar" leg actually
//      lands at Cochin International.
//    • A combo booking's `booking_type` is a comma-joined list ("Taxi, Flight"),
//      so mode lookups must split on "," and take the first token.
// ─────────────────────────────────────────────────────────────────────────────

export const SHORT_MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];
export const SHORT_WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Parse "YYYY-MM-DD" as a LOCAL date. Returns null when unparseable. */
export const parseLocalDate = (dateStr) => {
  if (!dateStr) return null;
  const m = String(dateStr).match(/^(\d{4})-(\d{2})-(\d{2})/);
  const d = m
    ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
    : new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
};

/** { weekday: "Thu", dayMonth: "1 Oct" } — mirrors CityDay.formatDayHeaderDate. */
export const formatDayHeaderDate = (dateStr) => {
  const d = parseLocalDate(dateStr);
  if (!d) return null;
  return {
    weekday: SHORT_WEEKDAYS[d.getDay()],
    dayMonth: `${d.getDate()} ${SHORT_MONTHS[d.getMonth()]}`,
  };
};

/**
 * Trip / leg date range, in the design's mono style.
 *   same month + year → "1–8 OCT 2026"
 *   otherwise         → "28 SEP – 4 OCT 2026"
 * The year is appended only when `withYear` (the trip header shows it, the leg
 * eyebrows don't).
 */
export const formatDateRange = (startStr, endStr, { withYear = false } = {}) => {
  const a = parseLocalDate(startStr);
  const b = parseLocalDate(endStr);
  if (!a && !b) return "";
  if (!a || !b) {
    const only = a || b;
    const s = `${only.getDate()} ${SHORT_MONTHS[only.getMonth()]}`;
    return (withYear ? `${s} ${only.getFullYear()}` : s).toUpperCase();
  }
  const sameMonth = a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
  const head = sameMonth
    ? `${a.getDate()}–${b.getDate()} ${SHORT_MONTHS[b.getMonth()]}`
    : `${a.getDate()} ${SHORT_MONTHS[a.getMonth()]} – ${b.getDate()} ${SHORT_MONTHS[b.getMonth()]}`;
  return (withYear ? `${head} ${b.getFullYear()}` : head).toUpperCase();
};

/** "4 ADULTS · 1 CHILD" — zero counts omitted, singular/plural handled. */
export const formatPaxLabel = ({ adults = 0, children = 0, infants = 0 } = {}) => {
  const part = (n, one, many) =>
    n > 0 ? `${n} ${n === 1 ? one : many}` : null;
  return [
    part(Number(adults) || 0, "ADULT", "ADULTS"),
    part(Number(children) || 0, "CHILD", "CHILDREN"),
    part(Number(infants) || 0, "INFANT", "INFANTS"),
  ]
    .filter(Boolean)
    .join(" · ");
};

// ── Transfers ────────────────────────────────────────────────────────────────

export const isFlightBooking = (booking) => {
  // Mirror resolveModeKey's precedence exactly (modeAccent.js): the mode lives
  // on `booking_type` OR on `transfer_details.mode`. Reading only the first
  // meant a booking whose mode sits in transfer_details rendered a PLANE ICON
  // while being treated as a road transfer — so it never got its IATA label
  // and silently fell back to the city name.
  const mode = booking?.booking_type || booking?.transfer_details?.mode || "";
  return String(mode).toLowerCase().includes("flight");
};

/** "1 Oct" from any parseable date. */
export const formatFlightDate = (d) => {
  if (!d) return "";
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return "";
  return dt.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
};

/** Minutes between a check-in/check-out datetime pair; 0 when unusable. */
export const durationFromCheckInOut = (ci, co) => {
  if (!ci || !co) return 0;
  const a = new Date(ci).getTime();
  const b = new Date(co).getTime();
  if (isNaN(a) || isNaN(b) || b <= a) return 0;
  return Math.round((b - a) / 60000);
};

/** "Flight" | "Train" | "Ferry" | "Bus" | "Private taxi" | capitalised | "Transfer". */
export const transferModeLabel = (bookingType) => {
  const t = String(bookingType || "").toLowerCase();
  if (t.includes("flight")) return "Flight";
  if (t.includes("train")) return "Train";
  if (t.includes("ferry") || t.includes("boat")) return "Ferry";
  if (t.includes("bus")) return "Bus";
  if (t.includes("taxi") || t.includes("car") || t.includes("cab") || t.includes("sedan"))
    return "Private taxi";
  return t ? t.charAt(0).toUpperCase() + t.slice(1) : "Transfer";
};

/**
 * Duration in minutes, from whichever field the booking carries: a top-level
 * numeric, flight segments (elapsed, else summed), or transfer_details.duration
 * ({ text, unit, value }).
 */
export const resolveDurationMins = (booking, topLevel) => {
  const top = Number(topLevel);
  if (top > 0) return top;

  const segs = booking?.transfer_details?.items?.[0]?.segments;
  if (Array.isArray(segs) && segs.length) {
    const dep = segs[0]?.origin?.departure_time;
    const arr = segs[segs.length - 1]?.destination?.arrival_time;
    const depMs = dep ? new Date(dep).getTime() : NaN;
    const arrMs = arr ? new Date(arr).getTime() : NaN;
    if (!isNaN(depMs) && !isNaN(arrMs) && arrMs > depMs) {
      return Math.round((arrMs - depMs) / 60000);
    }
    const sum = segs.reduce((s, seg) => s + (Number(seg?.duration) || 0), 0);
    if (sum > 0) return sum;
  }

  // The UNIT matters here. A Mozio taxi quote sends
  // `duration: { text: "2-3 hours", unit: "minute", value: 125 }`, and reading
  // that value as seconds turned a two-hour drive into "2M" — which is what
  // the Kochi → Munnar row was printing as "4M", and what made a taxi+flight
  // combo add up to less than either of its legs.
  //
  // Same reading as durationMinutes() in
  // components/revamp/common/components/bookingDetail/format.js, restated
  // rather than imported: this module is deliberately dependency-free. The one
  // difference is the unit-less case, which stays SECONDS — that is the older
  // Google-shaped payload ({ text: "4 hours 10 mins", value: 15000 }) this
  // branch was written for.
  const dur = booking?.transfer_details?.duration;
  const value = Number(typeof dur === "number" ? dur : dur?.value);
  if (value > 0) {
    const unit = String(
      typeof dur === "number" ? "minute" : dur?.unit || "",
    ).toLowerCase();
    if (unit.startsWith("min")) return Math.round(value);
    if (unit.startsWith("hour") || unit.startsWith("hr")) return Math.round(value * 60);
    if (unit.startsWith("day")) return Math.round(value * 1440);
    return Math.round(value / 60);
  }

  return durationFromCheckInOut(booking?.check_in, booking?.check_out);
};

/**
 * "5h 50m". The original prefixes "Approx "; the mobile design sets these in a
 * mono meta line where the word is noise, so the prefix is the caller's choice.
 */
export const durationLabel = (mins) => {
  const m = Number(mins) || 0;
  if (m <= 0) return "";
  const h = Math.floor(m / 60);
  const min = Math.round(m % 60);
  if (h > 0 && min > 0) return `${h}h ${min}m`;
  if (h > 0) return `${h}h`;
  return `${min}m`;
};

/** Strip "(HAN)"/"(airport)" noise and expand Arpt/Intl. */
export const cleanAirportName = (name) =>
  String(name || "")
    .replace(/\s*\([A-Z]{3}\)/g, "")
    .replace(/\s*\(airport\)/gi, "")
    .replace(/\bArpt\b/gi, "Airport")
    .replace(/\bIntl\b/gi, "International")
    .replace(/\s+/g, " ")
    .trim();

/**
 * Hub at one end of a flight. "" when the booking carries no segments (draft /
 * unpriced flights don't), so callers fall back to the city name.
 */
export const flightHubName = (booking, end) => {
  const segs = booking?.transfer_details?.items?.[0]?.segments;
  if (!Array.isArray(segs) || !segs.length) return "";
  const point =
    end === "origin" ? segs[0]?.origin : segs[segs.length - 1]?.destination;
  return cleanAirportName(point?.airport_name) || point?.airport_code || "";
};

/**
 * IATA code at one end of a flight — "DEL", "BOM".
 *
 * Preferred over `flightHubName` wherever space is tight: "Indira Gandhi
 * International Airport → Chhatrapati Shivaji Maharaj International Airport"
 * truncates to uselessness on a phone, while the codes are what the ticket,
 * the boarding pass and the traveller all actually use.
 *
 * Falls back to the booking's top-level iata fields, which draft/unpriced
 * flights carry even when they have no segments yet.
 */
export const flightHubCode = (booking, end) => {
  // VERIFIED against the live Mercury payload and the itinerary_transferbooking
  // table — do not re-derive this from field names that merely look right.
  //
  // The ONLY place a flight booking carries an IATA code is its segments:
  //   transfer_details.items[0].segments[0].origin.airport_code
  //   transfer_details.items[0].segments[N-1].destination.airport_code
  // (`items` is the API's rename of external_data.itinerary_items.)
  // Coverage: 43,273 / 44,782 Flight bookings over 365 days — 96.6%.
  //
  // The DESTINATION must come from the LAST segment. A one-stop hop stores the
  // layover as segments[0].destination, so reading [0] labels the flight by the
  // airport it changes planes at.
  //
  // These look plausible and are all WRONG for flights — each was measured at
  // 0 / 44,782 Flight bookings, so none of them is a usable fallback:
  //   • booking.source.code / transfer_details.source.code — Train/Bus/Ferry
  //     only, and those are STATION codes (NDLS), not IATA.
  //   • transfer_details.trips[].origin.code — Taxi only, and only on the
  //     airport end of an airport transfer.
  //   • origin_iata / destination_iata — a client-side alias TransferEditDrawer
  //     builds for the flight modals; never sent by the API.
  //   • origin_code / destination_code / origin_city_iata_code — no such column.
  //
  // So when there are no segments (an unpriced or draft flight — the other
  // 3.4%) there is no code anywhere, and "" is the honest answer: the caller
  // falls back to the city name.
  const segs = booking?.transfer_details?.items?.[0]?.segments;
  if (!Array.isArray(segs) || !segs.length) return "";

  const point =
    end === "origin" ? segs[0]?.origin : segs[segs.length - 1]?.destination;
  const code = point?.airport_code || point?.city_code;
  return code ? String(code).toUpperCase() : "";
};

/** Origin label for a leg: hub for flights, else the road trip's origin. */
export const legSrcName = (leg) => {
  const td = leg?.transfer_details;
  if (isFlightBooking(leg)) {
    const hub = flightHubCode(leg, "origin") || flightHubName(leg, "origin");
    if (hub) return hub;
  }
  const o = td?.trips?.[0]?.origin;
  const seg = td?.items?.[0]?.segments?.[0]?.origin;
  return (
    o?.city || o?.name || o?.address ||
    seg?.city_name || seg?.city_code ||
    leg?.source_address?.name || td?.source?.name || ""
  );
};

/** Destination label for a leg: hub for flights, else the road trip's last stop. */
export const legDestName = (leg) => {
  const td = leg?.transfer_details;
  if (isFlightBooking(leg)) {
    const hub =
      flightHubCode(leg, "destination") || flightHubName(leg, "destination");
    if (hub) return hub;
  }
  const trips = td?.trips;
  const d =
    (Array.isArray(trips) && trips[trips.length - 1]?.destination) ||
    trips?.[0]?.destination;
  const segs = td?.items?.[0]?.segments;
  const seg = Array.isArray(segs) ? segs[segs.length - 1]?.destination : null;
  return (
    d?.city || d?.name || d?.address ||
    seg?.city_name || seg?.city_code ||
    leg?.destination_address?.name || td?.destination?.name || ""
  );
};

/** Legs of a combo booking, or null when it is a single-mode transfer. */
export const comboChildren = (booking) =>
  Array.isArray(booking?.children) && booking.children.length > 1
    ? booking.children
    : null;

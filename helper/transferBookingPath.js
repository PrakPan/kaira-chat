/**
 * Mercury's per-booking endpoints (`/itinerary/<id>/bookings/<segment>/<id>/`)
 * accept a fixed set of segments and 400 on anything else:
 *
 *   bus, train, ferry, taxi, flight, rental, combo, transfer
 *
 * A booking's `booking_type`, though, is a display label — "Self-Drive" is a
 * transfer booking whose label happens not to be one of those segments, so
 * lowercasing it straight into the URL asks for `/bookings/self-drive/` and
 * fails. Anything outside the known set is a transfer under a friendlier name,
 * so it reads through the generic `transfer` segment instead.
 */
const TRANSFER_BOOKING_SEGMENTS = new Set([
  "bus",
  "train",
  "ferry",
  "taxi",
  "flight",
  "rental",
  "combo",
  "transfer",
]);

export const getTransferBookingPath = (bookingType, { combo } = {}) => {
  if (combo) return "combo";
  const segment = String(bookingType ?? "")
    .trim()
    .toLowerCase();
  if (!segment) return "transfer";
  // A combo leg carries every mode it bundles, e.g. "Taxi, Flight".
  if (segment.includes(",")) return "combo";
  return TRANSFER_BOOKING_SEGMENTS.has(segment) ? segment : "transfer";
};

export default getTransferBookingPath;

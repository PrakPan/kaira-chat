// ─────────────────────────────────────────────────────────────────────────────
//  bookingDetailBridge — "show this booking" from a flow that can't reach the
//  phone itinerary's detail sheet.
//
//  The booking flows (TransferEditDrawer and friends) are ItineraryContainer's
//  drawers, mounted beside MobileItinerary rather than under it, so they cannot
//  call its sheet slot. Their "View Detail" used to push a URL drawer of its
//  own (AirportTaxiDetail, SightSeeing) — the desktop TransferDrawer with its
//  dark band — which on the phone is a second, different booking detail sheet
//  from the one every row of the trip opens.
//
//  So the request is announced instead, and MobileItinerary answers it with the
//  same descriptor the booking's own row builds. The event is cancelable: a
//  listener that handled it calls preventDefault, so the caller knows whether
//  to fall back to its URL drawer (desktop, where no phone itinerary listens).
// ─────────────────────────────────────────────────────────────────────────────

export const OPEN_BOOKING_DETAIL = "ttw:open-booking-detail";

/**
 * `detail`: { bookingId, onChange?, onLeave? }
 *  - onChange — the caller's own change flow for this booking; the sheet's
 *    "Change" runs it instead of the row's.
 *  - onLeave  — closes the caller before the sheet hands over to Kaira, so the
 *    flow isn't left covering her reply.
 *
 * Returns true when the phone itinerary opened its sheet.
 */
export const requestBookingDetail = (detail) => {
  if (typeof window === "undefined" || !detail?.bookingId) return false;
  const event = new CustomEvent(OPEN_BOOKING_DETAIL, {
    detail,
    cancelable: true,
  });
  return !window.dispatchEvent(event);
};

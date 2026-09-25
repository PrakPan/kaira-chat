/**
 * Lock-in ("hold these prices") state, derived from a cart / payment-information
 * payload.
 *
 * Read from the cart rather than assumed: `lock_in_fee` is set per itinerary and
 * is not always ₹2,000. Lives here because two screens gate on it — the cart
 * drawer's pay CTA (containers/itinerary/booking1/NewBookingSlide.js) and the
 * itinerary's bottom bar (components/bot-components/BotApp.tsx) — and a bar that
 * advertises a hold the cart will not actually offer is worse than no bar hint
 * at all.
 *
 * @param {any} cart Cart API payload (`{itinerary_id}/cart/`), possibly null.
 * @returns {{fee: number, paid: boolean, paidAmount: number, required: boolean,
 *   paidAt: Date|null, holdUntil: Date|null, holdExpired: boolean}}
 */

// How long a paid lock-in holds the price for. The cart carries when the fee was
// paid (`lock_in_fee_paid_at`) but not when the hold runs out, so the window is
// applied here — in one place, rather than re-counted at each call site.
export const LOCK_IN_HOLD_HOURS = 72;

const HOUR_MS = 60 * 60 * 1000;

// The API's naive timestamps are written in IST: `lock_in_fee_paid_at` comes
// back as "2026-09-05 17:43:07" with no offset on it, and that wall clock is
// Asia/Kolkata. Pinned here rather than left to `new Date`, which would read it
// in whatever zone the viewer's browser happens to be in and slide the hold
// window by hours for anyone outside India.
const CART_UTC_OFFSET = "+05:30";

// A space instead of the "T" as well, which Safari will not parse.
//
// Exported because `price_valid_until` is written the same naive-IST way and is
// read on surfaces that have nothing to do with the hold — the cart bar's
// "expires in" clock among them. Parsing it with a bare `new Date` reads that
// wall clock in the viewer's own zone, which slides the deadline by hours for
// anyone outside India.
export const parseCartTimestamp = (value) => {
  if (!value || typeof value !== "string") return null;
  const trimmed = value.trim();
  // Only naive timestamps get the offset appended; if the backend ever starts
  // sending a real one ("…Z", "…+05:30") it is already unambiguous.
  const hasZone = /(?:Z|[+-]\d{2}:?\d{2})$/.test(trimmed);
  const date = new Date(
    trimmed.replace(" ", "T") + (hasZone ? "" : CART_UTC_OFFSET),
  );
  return Number.isNaN(date.getTime()) ? null : date;
};

/**
 * The trip has already departed.
 *
 * A hold on a trip that has left is as empty an offer as a hold on a lapsed
 * price, so every surface that offers one has to make this test — the itinerary
 * card (lib/tripViewModel.js) and the desktop cart bar (BotApp.tsx) both do.
 *
 * Both ends floored to midnight: a trip starting TODAY has not started too late
 * to pay for. A missing date reads as "not loaded yet" and never as departed —
 * redux seeds the itinerary with a placeholder that carries no `start_date`, and
 * treating that as past would blank the offer on load.
 */
export const tripHasDeparted = (startDate) => {
  if (!startDate) return false;
  const start = new Date(startDate);
  if (Number.isNaN(start.getTime())) return false;
  const today = new Date();
  start.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return start < today;
};

export function getLockInState(cart) {
  const fee = Number(cart?.lock_in_fee) || 0;

  // `lock_in_fee_paid` is the cart's own flag; a completed lock_payment sale is
  // the record of what was actually collected, so that is preferred for the
  // amount and the flag is the fallback.
  const completedSale = cart?.sales?.find(
    (sale) =>
      sale?.payment_type === "lock_payment" && sale?.status === "Completed",
  );
  const paid = !!cart?.lock_in_fee_paid || !!completedSale;
  const paidAmount = paid ? Number(completedSale?.amount_paid) || fee : 0;

  const amountPaid = Number(cart?.amount_paid) || 0;
  const totalPayable = Number(cart?.total_payable_amount) || 0;

  // The hold is a required first step, not an option: until it is paid it is the
  // only payment the cart will take. Skipped where it cannot apply — a fee that
  // is not smaller than what is left to pay, or a cart that has already
  // collected money (adding an item to a part-paid trip must not send the
  // customer back through a hold).
  const required = fee > 0 && !paid && amountPaid <= 0 && fee < totalPayable;

  // When the hold runs out. Some carts have `lock_in_fee_paid` set with no
  // `lock_in_fee_paid_at` behind it (flags flipped by hand), and those must not
  // read as expired — without a paid-at there is no window to have run out, so
  // both stay null/false and the UI falls back to a dateless "prices locked".
  const paidAt = paid ? parseCartTimestamp(cart?.lock_in_fee_paid_at) : null;
  const holdUntil = paidAt
    ? new Date(paidAt.getTime() + LOCK_IN_HOLD_HOURS * HOUR_MS)
    : null;
  const holdExpired = !!holdUntil && holdUntil.getTime() <= Date.now();

  // The balance has been paid through the cart's "full" sale — the same test
  // the cart drawer's `hasFullPaymentCompleted` makes. A hold is only ever the
  // first step towards that payment, so once it has gone through the hold is
  // spent: the trip is no longer "held", whatever the hold's clock says.
  const fullPaid = !!cart?.sales?.some(
    (sale) =>
      sale?.payment_type === "full_payment" && sale?.status === "Completed",
  );
  // …and nothing is owed on top of it. `total_payable_amount` is already net
  // of what was collected, so an item added after paying leaves it above 0 and
  // the trip is not fully paid any more.
  const fullyPaid = fullPaid && Math.round(totalPayable) <= 0;
  // A paid hold still standing between the traveller and the balance.
  const holding = paid && !holdExpired && !fullPaid;

  return {
    fee,
    paid,
    paidAmount,
    required,
    paidAt,
    holdUntil,
    holdExpired,
    fullPaid,
    fullyPaid,
    holding,
  };
}

export default getLockInState;

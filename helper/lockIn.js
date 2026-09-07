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
 * @returns {{fee: number, paid: boolean, paidAmount: number, required: boolean}}
 */
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

  return { fee, paid, paidAmount, required };
}

export default getLockInState;

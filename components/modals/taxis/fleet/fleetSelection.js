/**
 * Selection maths for a multi-taxi booking.
 *
 * Search returns every vehicle it can price, one quote per vehicle at that vehicle's own
 * price, whatever the party size. `data.fleet.multi_vehicle_needed` says whether any single
 * one of them seats the group; when it does not, the cards grow quantity steppers and the
 * customer builds their own combination out of `data.quotes`.
 *
 * A selection is `{ [String(result_index)]: quantity }`. Keying on result_index rather than
 * on a list position matters: Load More replaces the quote list wholesale, so positions are
 * not stable across polls. The backend also matches on `str(result_index)`, so every id is
 * coerced to a string on the way in and out.
 *
 * Nothing here checks the selection against the party size, and there is no ceiling on the
 * number of cars — the backend dropped both. A group of 10 taking one 6-seater is a choice
 * made in front of the seat counts, not a mistake to be corrected.
 *
 * Everything is pure — no React, no network — so the search modal, the pickup/drop drawer and
 * the multicity drawer share one definition of "what did the customer pick".
 */

export const candidateKey = (candidate) => String(candidate?.result_index ?? "");

export const emptySelection = () => ({});

const toCount = (value) => {
  const count = Number(value);
  return Number.isFinite(count) && count > 0 ? Math.floor(count) : 0;
};

const capacityOf = (candidate) =>
  toCount(candidate?.taxi_category?.seating_capacity);

const bagsOf = (candidate) => toCount(candidate?.taxi_category?.bag_capacity);

const totalOf = (candidate) => {
  const total = Number(candidate?.price?.total);
  return Number.isFinite(total) ? total : 0;
};

/** Immutable quantity set. Setting 0 removes the key so `countVehicles` stays honest. */
export const setQuantity = (selection, resultIndex, quantity) => {
  const key = String(resultIndex ?? "");
  const next = { ...(selection || {}) };
  const count = toCount(quantity);
  if (count) next[key] = count;
  else delete next[key];
  return next;
};

export const countVehicles = (selection) =>
  Object.values(selection || {}).reduce((sum, qty) => sum + toCount(qty), 0);

/**
 * Drop any quantity whose quote is no longer on offer.
 *
 * Load More re-issues the whole quote list, and a re-search replaces it outright. Carrying a
 * stale result_index forward would post an id the backend rejects, losing the rest of the
 * selection to an error message that appears nowhere near the picker.
 */
export const pruneSelection = (selection, candidates) => {
  const live = new Set((candidates || []).map(candidateKey));
  const next = {};
  Object.entries(selection || {}).forEach(([key, quantity]) => {
    if (live.has(key) && toCount(quantity)) next[key] = toCount(quantity);
  });
  return next;
};

/**
 * Request shape for the booking call: `[{result_index, quantity}]`, quantities > 0 only.
 * Ordered by the quote list so the payload is stable between renders.
 */
export const toVehiclesPayload = (selection, candidates) =>
  (candidates || [])
    .map((candidate) => ({
      result_index: candidateKey(candidate),
      quantity: toCount(selection?.[candidateKey(candidate)]),
    }))
    .filter((entry) => entry.result_index && entry.quantity > 0);

/**
 * What the customer has picked, in the numbers they need to see before committing.
 *
 * `seats`, `bags` and `total` are summed the same way the backend does, so the figure on
 * screen is the figure that will be billed rather than an estimate.
 */
export const summarizeSelection = (selection, candidates) => {
  const lines = (candidates || [])
    .map((candidate) => {
      const quantity = toCount(selection?.[candidateKey(candidate)]);
      if (!quantity) return null;
      const unitTotal = totalOf(candidate);
      return {
        key: candidateKey(candidate),
        candidate,
        quantity,
        unitTotal,
        lineTotal: unitTotal * quantity,
      };
    })
    .filter(Boolean);

  return {
    lines,
    vehicles: lines.reduce((sum, line) => sum + line.quantity, 0),
    seats: lines.reduce(
      (sum, line) => sum + capacityOf(line.candidate) * line.quantity,
      0,
    ),
    bags: lines.reduce(
      (sum, line) => sum + bagsOf(line.candidate) * line.quantity,
      0,
    ),
    total: lines.reduce((sum, line) => sum + line.lineTotal, 0),
    currency: lines[0]?.candidate?.price?.currency || null,
  };
};

/**
 * The only refusal left: a supplier that cannot honour more than one cab.
 *
 * Gozo's hold books exactly one and cannot release it; Amadeus and WelcomePickups bind each
 * quote to the passenger count sent upstream. The backend refuses these too — this is here so
 * the message lands on the picker rather than in a toast across the screen from it.
 */
export const validateSelection = (summary, fleet, source) => {
  if (source && source !== "Self") {
    return {
      ok: false,
      reason: "Several taxis can only be booked on our own fleet.",
    };
  }
  if (!summary || summary.vehicles === 0) {
    return { ok: false, reason: "Select at least one taxi." };
  }
  return { ok: true, reason: null };
};

/** "1 × Toyota Innova + 1 × Maruti Dzire" for a selection, matching the server's label. */
export const describeSelection = (summary) =>
  (summary?.lines || [])
    .map(
      (line) =>
        `${line.quantity} × ${
          line.candidate?.taxi_category?.model_name ||
          line.candidate?.taxi_category?.type ||
          "Taxi"
        }`,
    )
    .join(" + ");

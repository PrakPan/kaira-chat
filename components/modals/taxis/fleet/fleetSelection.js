/**
 * Selection maths for a mixed taxi fleet.
 *
 * Search only offers a fleet when no single cab seats the group. On that path the response
 * carries an extra `data.fleet` block: `candidates` (every single-cab quote, before the
 * capacity filter dropped them) and `suggestions` (server-ranked mixed combinations).
 *
 * A selection is `{ [String(result_index)]: quantity }`. Keying on result_index rather than
 * on a list position matters: Load More replaces the candidate list wholesale, so positions
 * are not stable across polls. The backend also matches on `str(result_index)`, so every id
 * is coerced to a string on the way in and out.
 *
 * Everything here is pure — no React, no network — so the search modal and the multicity
 * drawer can share one definition of "what did the user pick and is it bookable".
 */

// Mirrors MAX_VEHICLES_PER_FLEET in mercury's itinerary/constants.py. The response carries
// its own `max_vehicles`; this is only the floor for a payload that predates it.
export const MAX_FLEET_VEHICLES_FALLBACK = 4;

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

/** Seed a selection from a server suggestion's `members`. */
export const selectionFromMembers = (members) =>
  (members || []).reduce((selection, member) => {
    const key = String(member?.result_index ?? "");
    const quantity = toCount(member?.quantity);
    if (key && quantity) selection[key] = quantity;
    return selection;
  }, {});

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
 * Request shape for the booking call: `[{result_index, quantity}]`, quantities > 0 only.
 * Ordered by the candidate list so the payload is stable between renders.
 */
export const toVehiclesPayload = (selection, candidates) =>
  (candidates || [])
    .map((candidate) => ({
      result_index: candidateKey(candidate),
      quantity: toCount(selection?.[candidateKey(candidate)]),
    }))
    .filter((entry) => entry.result_index && entry.quantity > 0);

/**
 * What the user has picked, in the numbers they need to see before committing.
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
 * The same three refusals the server makes, checked before dispatch.
 *
 * These are pre-empted rather than round-tripped because the only error surface in this app
 * is a global toast that appears nowhere near the picker — the user would lose their whole
 * selection to a message they might not connect to it.
 */
export const validateSelection = (summary, fleet, source) => {
  if (source && source !== "Self") {
    return {
      ok: false,
      reason: "Mixed vehicles are only available on our own fleet.",
    };
  }
  if (!summary || summary.vehicles === 0) {
    return { ok: false, reason: "Select at least one vehicle." };
  }
  const max = toCount(fleet?.max_vehicles) || MAX_FLEET_VEHICLES_FALLBACK;
  if (summary.vehicles > max) {
    return {
      ok: false,
      reason: `A single booking can hold at most ${max} vehicles.`,
    };
  }
  const pax = toCount(fleet?.pax);
  if (pax && summary.seats < pax) {
    const short = pax - summary.seats;
    return {
      ok: false,
      reason: `Seats ${summary.seats} of ${pax} — add room for ${short} more.`,
    };
  }
  return { ok: true, reason: null };
};

/** Headroom left before the cap, for capping a stepper's "+" button. */
export const remainingCapacity = (selection, fleet) => {
  const max = toCount(fleet?.max_vehicles) || MAX_FLEET_VEHICLES_FALLBACK;
  return Math.max(max - countVehicles(selection), 0);
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

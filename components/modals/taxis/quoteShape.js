/**
 * The two shapes a suggestion quote arrives in, read through one pair of helpers.
 *
 * Multicity rows carry the cab under `taxi_category` with the fare on `price`;
 * the legacy round-trip rows carry both under `transfer_details`. Every surface
 * that describes one of these quotes — the card, and the detail sheet behind it
 * — resolves the cab through here rather than knowing both spellings itself.
 */
export const normalizeQuoteCategory = (quote) =>
  quote?.taxi_category || quote?.transfer_details || {};

export const quoteTitle = (quote) => {
  const category = normalizeQuoteCategory(quote);
  return category?.model_name || category?.type || "Taxi";
};

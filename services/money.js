// ─────────────────────────────────────────────────────────────────────────────
//  Money formatting for the package-priced surfaces.
//
//  The mobile itinerary presents the trip as ONE package: a single trip total,
//  and — inside a change flow — only the difference against it. Nothing else
//  carries a price. These helpers are the only place that turns an amount into
//  a string on that path.
//
//  Two traps this exists to avoid:
//    • `getIndianPrice` applies lakh/crore grouping regardless of currency and
//      returns the literal string "NaN" for undefined input.
//    • `store/reducers/currencyReducer.js#symbols` is permanently `{}` —
//      SET_CURRENCY_SYMBOLS is never dispatched anywhere in the app.
//
//  Mercury amounts are MAJOR units. Never divide by 100 here; the `/100` seen
//  in MenuV2/Accordion lives inside the legacy `!mercuryItinerary` branch.
// ─────────────────────────────────────────────────────────────────────────────

import { currencySymbols } from "../data/currencySymbols";
import { formatCurrencyValue } from "./formatCurrencyValue";

/** Symbol for an ISO code. Always pass the CODE string, never the slice object. */
export const currencySymbolFor = (code) => currencySymbols?.[code] || "₹";

/** "₹3,60,789" — symbol + grouped amount, rounded to whole units. */
export const formatMoney = (amount, code = "INR") => {
  const n = Number(amount);
  if (!Number.isFinite(n)) return null;
  return `${currencySymbolFor(code)}${formatCurrencyValue(Math.round(n), code)}`;
};

/**
 * "+₹1,243" / "−₹900" / "Same price".
 *
 * Uses a real minus sign (U+2212), not a hyphen, so the two directions are the
 * same optical width in the mono/tabular settings the design uses.
 */
export const formatDelta = (delta, code = "INR") => {
  const d = Math.round(Number(delta) || 0);
  if (d === 0) return "Same price";
  const abs = formatMoney(Math.abs(d), code);
  return abs ? `${d > 0 ? "+" : "−"}${abs}` : null;
};

export default formatMoney;

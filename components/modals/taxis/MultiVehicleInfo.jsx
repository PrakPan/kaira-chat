import React from "react";
import { getIndianPrice } from "../../../services/getIndianPrice";

/**
 * Taxi search only falls back to a convoy when no single cab seats the whole
 * group. When it does, every quote in the list carries `number_of_vehicles > 1`,
 * `price.total` is already the amount for *all* of those cabs, and the one-cab
 * figure survives as `price.per_vehicle_total`. Bookings persist the same count
 * on `number_of_vehicles`, so a quote and a booking both resolve through here.
 *
 * Single-vehicle quotes come back as `number_of_vehicles: 1` with no
 * `per_vehicle_total` at all — every helper below collapses to "nothing to say"
 * in that case, so callers can render unconditionally and nothing shows up.
 */
export const getVehicleCount = (source) => {
  const count = Number(
    source?.number_of_vehicles ??
      source?.transfer_details?.number_of_vehicles ??
      source?.transfer_details?.quote?.number_of_vehicles ??
      source?.quote?.number_of_vehicles
  );
  return Number.isFinite(count) && count > 0 ? count : 1;
};

export const getPerVehicleTotal = (source) => {
  const total = Number(
    source?.price?.per_vehicle_total ??
      source?.transfer_details?.per_vehicle_total ??
      source?.transfer_details?.quote?.price?.per_vehicle_total ??
      source?.quote?.price?.per_vehicle_total
  );
  return Number.isFinite(total) && total > 0 ? total : null;
};

/** True when any quote in a search result needs more than one cab. */
export const hasMultiVehicleQuote = (quotes) =>
  Array.isArray(quotes) && quotes.some((quote) => getVehicleCount(quote) > 1);

/**
 * What one cab costs. Prefers the figure the quote carries; falls back to an
 * even split of the convoy total for the lighter suggestion payloads that ship
 * `number_of_vehicles` without `per_vehicle_total`.
 */
export const resolvePerVehicleTotal = (source, total, count) => {
  const quoted = getPerVehicleTotal(source);
  if (quoted) return quoted;
  const convoyTotal = Number(total);
  const vehicles = Number(count ?? getVehicleCount(source));
  if (!Number.isFinite(convoyTotal) || convoyTotal <= 0) return null;
  if (!Number.isFinite(vehicles) || vehicles <= 1) return null;
  return convoyTotal / vehicles;
};

/**
 * The one-cab fare spelled out under a convoy total. Silent for a single cab —
 * there the headline price already *is* the per-taxi price.
 */
export const PerTaxiPrice = ({
  count,
  perVehicleTotal,
  symbol = "₹",
  className = "",
}) =>
  count > 1 && perVehicleTotal ? (
    <span
      className={`ttw-type-small text-[#445069] whitespace-nowrap ${className}`}
    >
      {symbol}
      {getIndianPrice(Math.ceil(perVehicleTotal))} per taxi × {count} taxis
    </span>
  ) : null;

/** Pill spelling out how many cabs a quote/booking covers. Silent for a single cab. */
export const VehicleCountBadge = ({ count, className = "" }) =>
  count > 1 ? (
    <span
      className={`shrink-0 ttw-type-small font-600 px-2 py-[2px] rounded-full bg-[#fff6cc] text-[#6b5600] whitespace-nowrap ${className}`}
    >
      {count} Taxis
    </span>
  ) : null;

/** Bare callout box, for the few spots that decide "is this a convoy?" themselves. */
export const MultiVehicleCallout = ({ show, className = "", children }) =>
  show ? (
    <div
      className={`ttw-type-small text-[#6b5600] bg-[#fffdf0] border-sm border-solid border-[#f2e6a8] rounded-lg px-2 py-1 ${className}`}
    >
      {children}
    </div>
  ) : null;

/**
 * One-liner explaining why the price is bigger than a single cab's. Silent for
 * a single cab. Pass `children` to override the wording.
 */
export const MultiVehicleNote = ({
  count,
  seatingCapacity,
  className = "",
  children,
}) => (
  <MultiVehicleCallout show={count > 1} className={className}>
    {children || (
      <>
        Your group needs {count} taxis
        {seatingCapacity
          ? ` — one ${seatingCapacity}-seater cannot fit everyone`
          : ""}
        . The price shown covers all {count} taxis.
      </>
    )}
  </MultiVehicleCallout>
);

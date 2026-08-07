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
  if (Number.isFinite(count) && count > 0) return count;
  // A booking that ships a fleet manifest has already said how many cabs it covers — one entry
  // per car. Counting them keeps the badge and the convoy note from disappearing on the shapes
  // that carry the manifest without the older scalar beside it.
  const manifested = getFleetManifest(source)?.vehicles?.length;
  return Number.isFinite(manifested) && manifested > 0 ? manifested : 1;
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
 * The per-car breakdown of a MIXED fleet, or null.
 *
 * A booking can be several *different* cabs — 1 Innova + 1 Dzire — in which case there is no
 * single "the taxi" to describe. The backend ships the real composition here; `taxi_category`
 * and `type` stay populated with the largest member so older readers degrade instead of going
 * blank, which is exactly why a reader that ignores this ends up stating something false.
 */
export const getFleetManifest = (source) => {
  const fleet =
    source?.fleet ??
    source?.transfer_details?.fleet ??
    source?.quote?.fleet ??
    source?.transfer_details?.quote?.fleet;
  return fleet && Array.isArray(fleet.vehicles) && fleet.vehicles.length
    ? fleet
    : null;
};

/** True when the cabs differ from one another, so "N × <one model>" would be a lie. */
export const isMixedFleet = (source) =>
  Boolean(getFleetManifest(source)?.is_mixed);

/** "1 × Toyota Innova + 1 × Maruti Dzire", or null when there is nothing to spell out. */
export const getFleetLabel = (source) => getFleetManifest(source)?.label || null;

/** Seats across the WHOLE fleet. Not lead capacity × count — those disagree when mixed. */
export const getFleetSeats = (source) => {
  const seats = Number(getFleetManifest(source)?.seats);
  return Number.isFinite(seats) && seats > 0 ? seats : null;
};

/** Luggage across the whole fleet. */
export const getFleetBags = (source) => {
  const bags = Number(getFleetManifest(source)?.bags);
  return Number.isFinite(bags) && bags > 0 ? bags : null;
};

/**
 * What one cab costs. Prefers the figure the quote carries; falls back to an
 * even split of the convoy total for the lighter suggestion payloads that ship
 * `number_of_vehicles` without `per_vehicle_total`.
 *
 * Returns null for a MIXED fleet, and that is the point: the cabs cost different amounts, so
 * any single "per taxi" figure — quoted or averaged — is a price nothing was ever sold at.
 * Every caller renders through `PerTaxiPrice`, which is silent on null, so the fabricated
 * average disappears from all four display surfaces at once.
 */
export const resolvePerVehicleTotal = (source, total, count) => {
  if (isMixedFleet(source)) return null;
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

/**
 * Pill spelling out how many cabs a quote/booking covers. Silent for a single cab.
 *
 * Pass `label` (a fleet label) when the cabs differ — "2 Taxis" is true but uninformative
 * there, whereas "1 × Innova + 1 × Dzire" says what the customer actually has.
 *
 * That label is a whole sentence of supplier model names and has no bound on its length —
 * "1 x Toyota Camry or similar + 1 x Toyota Mini Van or similar" is 60 characters. Held on one
 * line it is wider than a phone, and since every layout that hosts this badge sits it beside
 * something else, it dragged the whole booking-detail drawer into a horizontal scroll. So the
 * labelled form wraps and the bare count — two words that would read badly broken — does not.
 */
export const VehicleCountBadge = ({ count, label, className = "" }) =>
  count > 1 ? (
    <span
      className={`ttw-type-small font-600 px-2 py-[2px] bg-[#fff6cc] text-[#6b5600] ${
        label
          ? // inline-block so the padding wraps the whole box rather than
            // fraying across line fragments; a pill outline only reads as a
            // pill on one line, hence the softer corner.
            "inline-block min-w-0 max-w-full rounded-lg break-words text-left"
          : "shrink-0 rounded-full whitespace-nowrap"
      } ${className}`}
    >
      {label || `${count} Taxis`}
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
 *
 * `fleet` switches the wording for mixed cabs: "one 6-seater cannot fit everyone" reads as
 * though the group were given six-seaters, and "the details below describe a single taxi"
 * has no referent once the cabs differ.
 */
export const MultiVehicleNote = ({
  count,
  seatingCapacity,
  fleet,
  className = "",
  children,
}) => (
  <MultiVehicleCallout show={count > 1} className={className}>
    {children ||
      (fleet?.is_mixed ? (
        <>
          Your group travels in {fleet.label || `${count} taxis`}
          {fleet.seats ? ` — ${fleet.seats} seats in total` : ""}. The price
          shown covers every vehicle.
        </>
      ) : (
        <>
          Your group needs {count} taxis
          {seatingCapacity
            ? ` — one ${seatingCapacity}-seater cannot fit everyone`
            : ""}
          . The price shown covers all {count} taxis.
        </>
      ))}
  </MultiVehicleCallout>
);

import { useSelector } from "react-redux";
import { isStaffEmail } from "../../../../utils/staffUser";

/**
 * Staff-only provenance footnote for a search drawer: which supplier quoted the
 * prices sitting above it.
 *
 * Every search goes out to a different set of suppliers (Omio and AllAboard for
 * rail/coach, Mozio and our own fleet for taxis, Agoda and TBO for stays…) and a
 * quote reads very differently depending on which one answered. Customers have
 * no use for that; the team fielding "why is this fare what it is" does, so the
 * line is gated on the staff email domain — see `isStaffEmail`, which is a
 * cosmetic gate and deliberately not an authorisation one.
 *
 * Renders nothing when the response carried no supplier: an absent source is the
 * normal case for our own catalogues, and inventing a label for it would be
 * worse than staying quiet.
 *
 * Props:
 *  - source: the supplier name, or an array of them when one result list mixes
 *    suppliers (activities do). Nullish/blank entries are dropped.
 *  - className: extra classes for the host drawer's own spacing.
 */

// Suppliers whose own spelling is not what capitalising the first letter gives.
const DISPLAY_NAMES = {
  allaboard: "AllAboard",
  getyourguide: "GetYourGuide",
  tbo: "TBO",
  ttw: "TTW",
};

const formatSource = (value) => {
  const raw = String(value ?? "").trim();
  if (!raw) return null;

  const known = DISPLAY_NAMES[raw.toLowerCase()];
  if (known) return known;

  // The same supplier comes back as "Omio" from one endpoint and "omio" from
  // another. Only touch the all-lowercase spellings — anything already carrying
  // capitals ("AllAboard") is the supplier's own styling and is left alone.
  return raw === raw.toLowerCase()
    ? raw.charAt(0).toUpperCase() + raw.slice(1)
    : raw;
};

/**
 * The supplier names a search response carries: the search-wide `source` where
 * the endpoint reports one, and otherwise whatever the individual results name —
 * activity results are stitched together from several suppliers and only carry
 * it per item.
 *
 * `fallback` names the supplier behind a result that carries no `source` of its
 * own. Activity search needs it: our own inventory comes back with the field
 * absent rather than set to "Self", so a list mixing our activities with a
 * third party's would otherwise credit the whole list to the third party.
 * Leave it unset where an absent source means "we don't know" — the note then
 * stays quiet, which is the right answer for our own catalogues.
 */
export const readSearchSources = (payload, items, { fallback } = {}) => {
  if (payload?.source) return [payload.source];
  return (Array.isArray(items) ? items : [])
    .map((item) => item?.source || fallback)
    .filter(Boolean);
};

export default function PriceSourceNote({ source, className = "" }) {
  const email = useSelector((state) => state.auth?.email);

  if (!isStaffEmail(email)) return null;

  // Name each supplier once, in the order the results came back.
  const names = [];
  const values = Array.isArray(source) ? source : [source];
  for (const value of values) {
    const name = formatSource(value);
    if (name && !names.includes(name)) names.push(name);
  }
  if (!names.length) return null;

  return (
    // A <div> rather than a <p>: Bootstrap's reboot puts a 1rem bottom margin on
    // every paragraph, which would open a gap under the drawer's last row.
    <div
      className={`w-full border-t border-solid border-[#ececec] pt-2 mt-3 ttw-type-small text-[#8a93a6] ${className}`}
    >
      Prices sourced from {names.join(", ")}
    </div>
  );
}

import React from "react";

/**
 * Label/value facts inside a DetailCard, in the two shapes the booking-detail
 * drawers need:
 *
 *  - columns=1 (default): one fact per row, label left / value right. Matches
 *    the visa drawer's "Visa details" list.
 *  - columns=2: a grid of stacked label-over-value cells, for vehicle specs and
 *    similar short facts. Collapses to one column on a phone.
 *
 * Facts with an empty value are dropped rather than rendered as "NA" — a blank
 * row carries no information and only lengthens the card.
 *
 * The grid draws its hairlines with a 1px gap over a grey backdrop so the
 * lines stay correct in both the two- and one-column layouts (Tailwind's
 * divide-* utilities follow DOM order and can't wrap a grid). An odd number of
 * facts leaves a hole in that backdrop, so the last row is padded with a blank
 * white cell.
 */
export default function FactList({ facts, columns = 1, className = "" }) {
  const items = (facts || []).filter(
    (fact) => fact && fact.value !== null && fact.value !== undefined && fact.value !== "",
  );

  if (!items.length) return null;

  if (columns === 2) {
    const filler = items.length % 2 === 1;

    return (
      <div
        className={`grid grid-cols-2 max-ph:grid-cols-1 gap-px bg-[#ececec] ${className}`}
      >
        {items.map((fact) => (
          <div key={fact.label} className="bg-white px-4 py-3 min-w-0">
            <div className="ttw-type-small text-[#8a93a6] mb-0.5">{fact.label}</div>
            <div className="ttw-type-small font-500 text-[#0b1220] break-words">
              {fact.value}
            </div>
          </div>
        ))}
        {filler ? <div className="bg-white max-ph:hidden" /> : null}
      </div>
    );
  }

  return (
    <div className={`divide-y divide-[#ececec] ${className}`}>
      {items.map((fact) => (
        <div
          key={fact.label}
          className="flex items-start justify-between gap-4 px-4 py-2.5"
        >
          <span className="ttw-type-small text-[#8a93a6] shrink-0">{fact.label}</span>
          <span className="ttw-type-small font-500 text-[#0b1220] text-right min-w-0 break-words">
            {fact.value}
          </span>
        </div>
      ))}
    </div>
  );
}

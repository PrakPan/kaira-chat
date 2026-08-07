import React from "react";

/**
 * The booking's facts, as a wrapping row of chips.
 *
 * Replaces the bordered fact grid: the same label/value pairs, but sized to
 * their content and flowing, so three facts don't get stretched across a
 * two-column grid with an empty cell for company. A fact with no label (a bus
 * amenity, say) renders as just its value, which is why the same component
 * covers both.
 *
 * Empty values are dropped rather than printed as "NA" — a blank row carries no
 * information and only lengthens the drawer.
 */
export default function FactChips({ facts, className = "", padded = true }) {
  const items = (facts || []).filter(
    (fact) =>
      fact && fact.value !== null && fact.value !== undefined && fact.value !== "",
  );

  if (!items.length) return null;

  return (
    <div
      // `padded` off for a chip row nested inside a card, which owns its own
      // gutter — the drawer's px-4 would push the chips past the card's edge.
      className={`flex flex-wrap gap-x-2 gap-y-1.5 ${padded ? "px-4 pb-4" : ""} ${className}`}
    >
      {items.map((fact) => (
        <span
          key={fact.label || fact.value}
          className="inline-flex items-baseline gap-1.5 rounded-lg bg-[#fafaf5] px-3 py-[7px] max-w-full"
        >
          {fact.label ? (
            <span className="font-mono text-[9px] font-500 uppercase tracking-[0.12em] text-[#8a93a6] shrink-0">
              {fact.label}
            </span>
          ) : null}
          <span className="text-[12.5px] font-600 text-[#0b1220] tabular-nums break-words min-w-0">
            {fact.value}
          </span>
        </span>
      ))}
    </div>
  );
}

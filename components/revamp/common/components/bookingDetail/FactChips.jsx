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
 * A fact may carry an `icon` (the component itself, sized and coloured here)
 * instead of spelling its label out — seats, bags and fuel are the same three
 * glyphs the search cards already use, and a row of pictograms is read at a
 * glance where three mono words are read one at a time. The label is still
 * required in that case: it becomes the chip's accessible name, since an icon
 * alone tells a screen reader nothing.
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
      {items.map((fact) => {
        const Icon = fact.icon;

        return (
          <span
            key={fact.label || fact.value}
            // Baseline for a mono label beside its value; centred once a glyph
            // stands in for that label, which sits on no baseline of its own.
            className={`inline-flex gap-1.5 rounded-lg bg-[#fafaf5] px-3 py-[7px] max-w-full ${
              Icon ? "items-center" : "items-baseline"
            }`}
            aria-label={
              Icon && fact.label ? `${fact.label}: ${fact.value}` : undefined
            }
          >
            {Icon ? (
              <Icon
                size={14}
                className="text-[#8a93a6]"
                style={{ flex: "none" }}
                aria-hidden="true"
              />
            ) : fact.label ? (
              <span className="font-mono text-[9px] font-500 uppercase tracking-[0.12em] text-[#8a93a6] shrink-0">
                {fact.label}
              </span>
            ) : null}
            <span className="text-[12.5px] font-600 text-[#0b1220] tabular-nums break-words min-w-0">
              {fact.value}
            </span>
          </span>
        );
      })}
    </div>
  );
}

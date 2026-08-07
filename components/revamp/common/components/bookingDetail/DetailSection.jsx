import React from "react";

/**
 * A section of a booking-detail drawer: a hairline rule, a mono label, and the
 * content. That's it.
 *
 * This is what replaces DetailCard. Sections used to be bordered cards, and
 * every attempt to make that border sit right — cold grey, warm grey, tinted,
 * lifted — was solving a problem the card created. A rule and a label group
 * content just as well and there is no edge to get wrong.
 */
export default function DetailSection({
  label,
  right,
  children,
  className = "",
}) {
  if (!children) return null;

  return (
    <section className={className}>
      <div className="h-px bg-[#efede6] mx-4 mb-4" />
      {label || right ? (
        <div className="flex items-center justify-between gap-2 px-4 pb-2.5">
          {/* The label is one short word; whatever sits opposite it is the part
              carrying supplier text, so that is the side allowed to shrink and
              wrap. `shrink-0` on both would push the row past the viewport. */}
          <span className="ttw-type-status text-[#8a93a6] shrink-0">{label}</span>
          {right ? (
            <span className="min-w-0 max-w-full text-right">{right}</span>
          ) : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}

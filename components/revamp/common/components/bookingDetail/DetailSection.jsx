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
export default function DetailSection({ label, children, className = "" }) {
  if (!children) return null;

  return (
    <section className={className}>
      <div className="h-px bg-[#efede6] mx-4 mb-4" />
      {label ? (
        <div className="ttw-type-status text-[#8a93a6] px-4 pb-2.5">{label}</div>
      ) : null}
      {children}
    </section>
  );
}

import React from "react";

/**
 * Card chrome shared by every transfer booking-detail drawer (flight, train,
 * bus, ferry, taxi and the combo/multicity shells).
 *
 * One shape for all of them: an optional uppercase section label sitting above
 * a hairline-bordered card, and inside the card an optional sand header strip
 * carrying the card's own title. Same chrome the visa/eSIM detail drawers use,
 * so a transfer drawer now reads as the same surface as its siblings.
 *
 * Props:
 *  - label: uppercase section label rendered above the card.
 *  - title / subtitle: header-strip text. The strip is skipped when neither is
 *    given, which is how a card renders as a plain bordered block.
 *  - right: trailing node in the header strip (status pill, price, chevron).
 *  - bodyClassName: padding for the body. Left empty by default so a card whose
 *    body is a divided list or a route strip can own its own gutters.
 *  - className: replaces the default bottom margin rather than adding to it, so
 *    a card nested inside a gap-spaced stack can opt out of it.
 */
export default function DetailCard({
  label,
  title,
  subtitle,
  right,
  children,
  className = "mb-4",
  bodyClassName = "",
}) {
  const hasStrip = !!title || !!subtitle || !!right;

  return (
    <section className={className}>
      {label ? (
        <div className="ttw-type-label text-[#8a93a6] mb-2">{label}</div>
      ) : null}

      <div className="rounded-2xl border border-[#ececec] bg-white overflow-hidden">
        {hasStrip ? (
          <div className="flex items-center justify-between gap-3 bg-[#f4f3ec] px-4 py-3">
            <div className="min-w-0">
              {title ? (
                <div className="ttw-type-body font-600 text-[#0b1220] truncate">
                  {title}
                </div>
              ) : null}
              {subtitle ? (
                <div className="ttw-type-small text-[#445069] truncate">
                  {subtitle}
                </div>
              ) : null}
            </div>
            {right ? <div className="shrink-0">{right}</div> : null}
          </div>
        ) : null}

        {children ? <div className={bodyClassName}>{children}</div> : null}
      </div>
    </section>
  );
}

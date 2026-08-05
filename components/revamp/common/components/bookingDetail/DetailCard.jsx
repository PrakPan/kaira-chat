import React from "react";
import { accentGradient } from "./modeAccent";

/**
 * Card chrome shared by every transfer booking-detail drawer (flight, train,
 * bus, ferry, taxi and the combo/multicity shells).
 *
 * One shape for all of them: an optional uppercase section label sitting above
 * a hairline-bordered card, and inside the card an optional header strip
 * carrying the card's own title. Same chrome the visa/eSIM detail drawers use,
 * so a transfer drawer reads as the same surface as its siblings.
 *
 * Pass `accent` (from modeAccent) to tint that strip in the transport mode's
 * hue — a flight's card opens blue, a train's violet, a taxi's yellow. Without
 * it the strip stays on the neutral sand the other drawers use.
 *
 * Props:
 *  - label: uppercase section label rendered above the card. Takes a small
 *    accent tick so the eye can find section starts while scrolling.
 *  - title / subtitle: header-strip text. The strip is skipped when neither is
 *    given, which is how a card renders as a plain bordered block.
 *  - leading: node at the start of the strip (mode tile, operator logo).
 *  - right: trailing node in the strip (status pill, price, chevron).
 *  - bodyClassName: padding for the body. Left empty by default so a card whose
 *    body is a divided list or a route strip can own its own gutters.
 *  - className: replaces the default bottom margin rather than adding to it, so
 *    a card nested inside a gap-spaced stack can opt out of it.
 */
export default function DetailCard({
  label,
  title,
  subtitle,
  leading,
  right,
  accent,
  children,
  className = "mb-4",
  bodyClassName = "",
}) {
  const hasStrip = !!title || !!subtitle || !!right || !!leading;

  return (
    <section className={className}>
      {label ? (
        <div className="flex items-center gap-2 mb-2">
          <span
            className="w-[3px] h-3 rounded-full shrink-0"
            style={{ background: accent?.solid || "#b8becc" }}
          />
          <span className="ttw-type-label text-[#8a93a6]">{label}</span>
        </div>
      ) : null}

      <div className="ttw-detail-card rounded-2xl overflow-hidden">
        {hasStrip ? (
          <div
            className="flex items-center gap-3 px-4 py-3 border-b"
            style={{
              background: accent ? accentGradient(accent) : "#f4f3ec",
              borderColor: accent?.line || "#ececec",
            }}
          >
            {leading ? <div className="shrink-0">{leading}</div> : null}

            <div className="min-w-0 flex-1">
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

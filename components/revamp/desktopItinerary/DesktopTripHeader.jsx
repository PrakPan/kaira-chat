import React from "react";
import * as T from "../mobileItinerary/designTokens";
import { GUTTER } from "./desktopTokens";

// ─────────────────────────────────────────────────────────────────────────────
//  The desktop itinerary's header — "Kaira E Desktop" as drawn: logo tile, trip
//  name, pax and dates in mono, "More", and the leg chips with "Map".
//
//  Not the phone's TripHeader: that one is sticky inside the page's own scroll
//  and set a size up for a thumb. Here the header sits above the pane's
//  scroller, so it never needs to stick, and it keeps the design's desktop
//  sizes. It shares the same content column as the rows below it (GUTTER), so
//  the tile lines up with the cards under it at every pane width.
// ─────────────────────────────────────────────────────────────────────────────

export default function DesktopTripHeader({
  title,
  paxLabel,
  dateLabel,
  legs = [],
  onOpenMore,
  moreOpen = false,
  onViewMap,
  onLegClick,
}) {
  const meta = [paxLabel, dateLabel].filter(Boolean).join(" · ");

  return (
    <div
      className="flex flex-none flex-col gap-[9px] bg-white"
      style={{ borderBottom: "1px solid #ececec", padding: `12px ${GUTTER} 10px` }}
    >
      <div className="flex items-center gap-[10px]">
        <div
          className="flex h-[30px] w-[30px] flex-none items-center justify-center rounded-[9px] bg-[#0b1220]"
          style={{ transform: "rotate(-4deg)" }}
          aria-hidden
        >
          <span className="text-[18px] font-[900] leading-none text-[#f7e700]">t</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[13px] font-[700] tracking-[-0.02em] text-[#0b1220]">
            {title || "Your trip"}
          </div>
          {meta ? (
            <div className="mt-[4px] truncate font-mono text-[8.5px] tracking-[0.07em] text-[#8a93a6]">
              {meta}
            </div>
          ) : null}
        </div>
        {onOpenMore ? (
          <button
            type="button"
            onClick={onOpenMore}
            aria-haspopup="menu"
            aria-expanded={moreOpen}
            style={T.pill}
            className="flex-none px-[11px] py-[6px] text-[11px] font-[600] text-[#0b1220]"
          >
            More
          </button>
        ) : null}
      </div>

      <div className="flex items-center gap-[6px]">
        <div
          className="flex min-w-0 flex-1 gap-[5px] overflow-x-auto"
          style={{ scrollbarWidth: "none" }}
        >
          {legs.map((leg) => (
            <button
              key={leg.anchor}
              type="button"
              onClick={() => onLegClick?.(leg.anchor)}
              style={T.pill}
              className="flex-none whitespace-nowrap px-[9px] py-[5px] text-[11px] text-[#6b7280]"
            >
              {[leg.city, leg.nights || null].filter(Boolean).join(" ")}
            </button>
          ))}
        </div>
        {onViewMap ? (
          <button
            type="button"
            onClick={onViewMap}
            style={T.pill}
            className="flex-none px-[10px] py-[5px] text-[11px] font-[600] text-[#0b1220]"
          >
            Map
          </button>
        ) : null}
      </div>
    </div>
  );
}

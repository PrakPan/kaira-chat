import React from "react";
import * as T from "./designTokens";

// ─────────────────────────────────────────────────────────────────────────────
//  TripHeader — the trip's own header: logo tile, name, pax/dates, "More",
//  and the leg-nav strip with the Map button.
//
//  Shared rather than local to MobileItinerary because the MAP tab needs the
//  identical chrome. Two headers that nearly match read as a bug; the app
//  navbar is hidden on both tabs precisely so this one can be the only header.
//
//  `legs` is optional — the map has nothing to scroll to, so it renders the
//  second row with the Map button alone.
// ─────────────────────────────────────────────────────────────────────────────

export default function TripHeader({
  title,
  paxLabel,
  dateLabel,
  legs = [],
  onOpenMore,
  onViewMap,
  onLegClick,
  mapActive = false,
  sticky = true,
}) {
  const meta = [paxLabel, dateLabel].filter(Boolean).join(" · ");

  return (
    <div
      className={`${sticky ? "sticky top-0 z-[30]" : ""} border-b border-[#ececec] bg-white px-[14px] pb-[9px] pt-[10px]`}
    >
      <div className="flex items-center gap-[11px]">
        <div
          className="flex h-[32px] w-[32px] flex-none items-center justify-center rounded-[9px] bg-[#0b1220]"
          style={{ transform: "rotate(-4deg)" }}
          aria-hidden
        >
          <span className="text-[19px] font-[900] leading-none text-[#f7e700]">t</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[14px] font-[700] tracking-[-0.02em] text-[#0b1220]">
            {title || "Your trip"}
          </div>
          {meta ? (
            <div className="mt-[4px] truncate font-mono text-[10px] tracking-[0.07em] text-[#8a93a6]">
              {meta}
            </div>
          ) : null}
        </div>
        {onOpenMore ? (
          <button
            type="button"
            onClick={onOpenMore}
            style={T.pill}
            className="flex-none px-[11px] py-[6px] text-[12px] font-[600] text-[#0b1220]"
          >
            More
          </button>
        ) : null}
      </div>

      <div className="mt-[9px] flex items-center gap-[6px]">
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
              className="flex-none whitespace-nowrap px-[9px] py-[5px] text-[12px] text-[#6b7280]"
            >
              {[leg.city, leg.nights || null].filter(Boolean).join(" ")}
            </button>
          ))}
        </div>
        {onViewMap ? (
          <button
            type="button"
            onClick={onViewMap}
            style={
              mapActive
                ? { ...T.pill, background: "#0b1220", border: "1px solid #0b1220" }
                : T.pill
            }
            className={`flex-none px-[10px] py-[5px] text-[12px] font-[600] ${
              mapActive ? "text-white" : "text-[#0b1220]"
            }`}
          >
            Map
          </button>
        ) : null}
      </div>
    </div>
  );
}

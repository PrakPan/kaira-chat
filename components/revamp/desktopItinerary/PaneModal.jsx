import React, { createContext, useState } from "react";
import { createPortal } from "react-dom";

// ─────────────────────────────────────────────────────────────────────────────
//  A centred dialog over the desktop itinerary pane — the design's trip
//  settings card: `min(440px, 90%)` of the pane, 22px corners, a soft lift,
//  over the same scrim the pane's sheets use. The scrim dims the itinerary
//  only; the chat beside it stays as it is.
//
//  Portalled into `host`, BotApp's layer over the whole left panel, so it
//  covers the itinerary, the map or the route view alike — Settings is opened
//  from all three. With no host yet it
//  falls back to covering the screen rather than not opening.
//
//  The editors Settings opens from inside the card — Room Configuration, Who's
//  Going — are `position: fixed; inset: 0` modals. The layer below carries a
//  no-op transform so that IT is their containing block: they fill the pane
//  and centre in it, their backdrop dims the pane, and the chat is left
//  alone, the same as the card itself. The date picker portals, so it can't
//  lean on that; the layer is handed down through PaneLayerContext and the
//  picker (settings/DateRangeSheet) portals into it rather than <body>, so it
//  too centres on the pane instead of the whole window. The CARD must not carry a transform of its own, or those
//  editors would be pinned to the card instead — hence flex centring rather
//  than the prototype's `translate(-50%,-50%)`.
// ─────────────────────────────────────────────────────────────────────────────

// The PaneModal layer a portalled child should mount into, or null outside
// one (where it keeps portalling to <body>).
export const PaneLayerContext = createContext(null);

export default function PaneModal({ host, onHide, width = 440, zIndex = 1700, children }) {
  const [layerEl, setLayerEl] = useState(null);
  const layer = (
    <div
      ref={setLayerEl}
      className="pointer-events-auto absolute inset-0"
      // A size container too, so the date picker can fold to one month when
      // the pane is narrower than its two (styles/kaira-form.css).
      style={{ zIndex, transform: "translateZ(0)", containerType: "inline-size", containerName: "ttw-pane" }}
    >
      <button
        type="button"
        aria-label="Close"
        tabIndex={-1}
        onClick={onHide}
        className="absolute inset-0 cursor-pointer"
        style={{
          border: 0,
          borderRadius: 0,
          padding: 0,
          boxShadow: "none",
          background: "rgba(11,18,32,0.22)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-[16px]">
        <div
          role="dialog"
          aria-modal="true"
          className="ttw-pane-sheet-up pointer-events-auto overflow-y-auto bg-white"
          style={{
            width: `min(${width}px, 90%)`,
            maxHeight: "100%",
            borderRadius: 22,
            boxShadow: "0 30px 80px -30px rgba(11,18,32,.3)",
            scrollbarWidth: "none",
          }}
        >
          <PaneLayerContext.Provider value={layerEl}>{children}</PaneLayerContext.Provider>
        </div>
      </div>
    </div>
  );

  if (!host) {
    return <div className="fixed inset-0" style={{ zIndex: 50 }}>{layer}</div>;
  }
  return createPortal(layer, host);
}

import React, { useEffect, useRef, useState } from "react";
import Drawer from "../../../ui/Drawer";
import { lockDocumentScroll } from "../scrollLock";

// ─────────────────────────────────────────────────────────────────────────────
//  Sheet — the bottom-sheet primitive for the mobile itinerary.
//
//  Wraps `components/ui/Drawer` rather than `LowerModal` because Drawer PORTALS
//  to #modal-portal. The mobile itinerary lives inside a
//  `-webkit-overflow-scrolling: touch` pane, and on iOS a position:fixed
//  descendant of such a scroller anchors to the scrolled content instead of the
//  viewport — an inline modal would scroll away with the page.
//
//  Two Drawer behaviours are worked around here:
//
//   1. It accepts `borderRadius` / `height` props but its styled CSS never
//      reads them for a bottom anchor — it sets only `width:100vw; left:0;
//      bottom:0`. Geometry therefore rides in `style`, which IS spread inline
//      and wins.
//   2. Its show-effect calls the internal close path whenever `props.show` is
//      false — including on FIRST MOUNT — which fires `onHide` ~100ms after
//      mount. So this component does not render a Drawer at all until it has
//      been opened at least once.
// ─────────────────────────────────────────────────────────────────────────────

export default function Sheet({
  open,
  onClose,
  title,
  subtitle,
  headerRight,
  height = "82dvh",
  zIndex = 1600,
  children,
  footer,
  contentClassName = "",
}) {
  // Never mount Drawer before the first open — see (2) above.
  const [everOpened, setEverOpened] = useState(false);
  useEffect(() => {
    if (open) setEverOpened(true);
  }, [open]);

  // Freeze the page while the sheet is up. Drawer writes `body.style.overflow`
  // on open, which is enough on a page that only scrolls a pane — but the
  // mobile itinerary now scrolls the WINDOW (that is what retracts the
  // browser's address bar; see `.app-shell` in styles/globals.css), and iOS
  // does not reliably honour `overflow: hidden` on body against a touch drag.
  // Without this a drag beside the sheet scrolls the trip out from under it and
  // the user is somewhere else when it closes.
  useEffect(() => {
    if (!open) return undefined;
    return lockDocumentScroll();
  }, [open]);

  // Escape closes, matching every other drawer on this surface.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") onCloseRef.current?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!everOpened) return null;

  return (
    <Drawer
      show={open}
      anchor="bottom"
      onHide={onClose}
      width="100%"
      mobileWidth="100%"
      bgColor="#ffffff"
      style={{
        zIndex,
        // `top: auto` is load-bearing. DrawerContainer sets `top: 0%` for EVERY
        // anchor and then adds `bottom: 0`, so a bottom sheet ends up pinned to
        // both edges and stretches to the full viewport no matter what height it
        // is given. Releasing `top` lets bottom + height actually anchor it.
        top: "auto",
        height,
        maxHeight: "95dvh",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: "hidden",
        // Drawer paints a heavy two-layer drop shadow on every panel; the design
        // uses a single soft lift off the top edge.
        borderTop: "1px solid #dcdfe5",
        boxShadow: "none",
      }}
    >
      <div className="flex h-full flex-col bg-white">
        {/* Grab handle */}
        {/* Handle sits 6px above the first row, per the design — the sheets
            add their own top padding, so this wrapper must not add more. */}
        <div className="flex-none pb-[6px] pt-[9px]">
          <div className="mx-auto h-[4px] w-[40px] rounded-full bg-[#dcdfe5]" />
        </div>

        {(title || headerRight) && (
          <div className="flex flex-none items-start gap-[11px] border-b border-[#e6e8ec] px-[14px] pb-[11px] pt-[11px]">
            <div className="min-w-0 flex-1">
              {title ? (
                <div className="font-inter text-[15.5px] font-[800] tracking-[-0.02em] text-[#0b1220]">
                  {title}
                </div>
              ) : null}
              {subtitle ? (
                <div className="mt-[5px] font-mono text-[8.5px] tracking-[0.06em] text-[#8a93a6]">
                  {subtitle}
                </div>
              ) : null}
            </div>
            {headerRight}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex h-[24px] w-[24px] flex-none items-center justify-center rounded-full border border-[#dcdfe5] bg-white text-[12px] leading-none text-[#6b7280]"
            >
              ✕
            </button>
          </div>
        )}

        <div
          className={`min-h-0 flex-1 overflow-y-auto ${contentClassName}`}
          style={{ WebkitOverflowScrolling: "touch", overscrollBehavior: "contain" }}
        >
          {children}
        </div>

        {footer ? (
          <div
            className="flex-none border-t border-[#e6e8ec] bg-white px-[14px] pb-[14px] pt-[11px]"
            style={{ paddingBottom: "calc(14px + env(safe-area-inset-bottom))" }}
          >
            {footer}
          </div>
        ) : (
          <div style={{ height: "env(safe-area-inset-bottom)" }} />
        )}
      </div>
    </Drawer>
  );
}

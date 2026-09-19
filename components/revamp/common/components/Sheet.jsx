import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import CloseButton from "./CloseButton";
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
//  It also stamps `html.ttw-sheet-open` for as long as any sheet is up. That is
//  the signal for anything portaled to <body> ABOVE the itinerary that must not
//  float over a sheet covering it — today the cart drawer's mobile pay bar
//  (z 1650; see `.ttw-cart-pay-bar` in styles/globals.css). Reference-counted
//  for the same reason the scroll lock is: sheets stack, and a detail sheet
//  closing must not clear the mark its parent still holds.
//
//  Deliberately NOT the scroll lock's own class: that one is also held by the
//  chat and map layers, which the payment drawer opens OVER rather than under.
// ─────────────────────────────────────────────────────────────────────────────

// ── Pane mode (desktop) ──────────────────────────────────────────────────────
// On desktop the itinerary is one pane of a two-pane screen, with Kaira's chat
// in the other. The design raises its sheets INSIDE that pane: centred in it,
// at most 640px wide, over a scrim that dims the itinerary and leaves the chat
// alone. A viewport-wide Drawer would cover the conversation the sheet's own
// "Change" buttons hand the traveller to.
//
// A host that provides this context gets every Sheet below it in pane mode —
// today the desktop itinerary's day and detail sheets — without any of them
// knowing which surface they are on. The value
// is `{ el }`: the absolutely-positioned layer the sheets portal into. A portal
// rather than rendering in place, because a sheet opened from inside another
// one (a nested detail sheet, say) is a child of the first sheet's scrolling
// body and would otherwise be clipped by it. `el` is null until the layer mounts, and a
// pane-mode sheet renders nothing until then rather than falling back to the
// full-screen Drawer.
export const SheetHostContext = createContext(null);

const SHEET_OPEN_CLASS = "ttw-sheet-open";
let openSheets = 0;

function markSheetOpen() {
  if (typeof document === "undefined") return () => {};
  openSheets += 1;
  document.documentElement.classList.add(SHEET_OPEN_CLASS);
  let released = false;
  return () => {
    if (released) return;
    released = true;
    openSheets = Math.max(0, openSheets - 1);
    if (openSheets === 0) {
      document.documentElement.classList.remove(SHEET_OPEN_CLASS);
    }
  };
}

export default function Sheet({
  open,
  onClose,
  title,
  subtitle,
  headerRight,
  height = "82dvh",
  // Height inside a desktop pane, as a share of the pane. The design gives each
  // sheet its own (day 82%, detail 78%, cart 86%); the phone's `height` is a
  // viewport height and means nothing there.
  paneHeight = "86%",
  zIndex = 1600,
  children,
  footer,
  contentClassName = "",
}) {
  const paneHost = useContext(SheetHostContext);
  const inPane = !!paneHost;

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
  //
  // Not in a desktop pane: the desktop shell never scrolls the document, and
  // the pane's own scroller sits under the scrim, which already takes the
  // pointer.
  useEffect(() => {
    if (!open || inPane) return undefined;
    return lockDocumentScroll();
  }, [open, inPane]);

  useEffect(() => {
    if (!open) return undefined;
    return markSheetOpen();
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

  const body = (
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
          <CloseButton onClick={onClose} />
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
  );

  if (inPane) {
    // Unmounted while closed rather than slid out: the pane sheet is a short
    // lift, and the callers already hold their last content for the frame the
    // slot empties (see DetailSheet's lastRef).
    if (!open || !paneHost.el) return null;
    return createPortal(
      <div className="pointer-events-auto absolute inset-0" style={{ zIndex }}>
        {/* The design's scrim: the itinerary pane only, never the chat. */}
        <button
          type="button"
          aria-label="Close"
          tabIndex={-1}
          onClick={onClose}
          className="absolute inset-0 cursor-pointer"
          style={{
            border: 0,
            borderRadius: 0,
            padding: 0,
            boxShadow: "none",
            background: "rgba(11,18,32,0.22)",
          }}
        />
        {/* Centred with auto margins, NOT translateX(-50%) as the prototype
            does it: a transform on this panel would become the containing
            block of every position:fixed thing opened from inside it. */}
        <div
          role="dialog"
          aria-modal="true"
          className="ttw-pane-sheet-up absolute bottom-0 left-0 right-0 mx-auto flex flex-col overflow-hidden bg-white"
          style={{
            width: "min(640px, 92%)",
            height: height === "auto" ? "auto" : paneHeight,
            maxHeight: "95%",
            borderRadius: "20px 20px 0 0",
            border: "1px solid #dcdfe5",
            borderBottom: 0,
            boxShadow: "none",
          }}
        >
          {body}
        </div>
      </div>,
      paneHost.el,
    );
  }

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
      {body}
    </Drawer>
  );
}

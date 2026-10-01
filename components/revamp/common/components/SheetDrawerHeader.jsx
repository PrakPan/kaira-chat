import React, { useContext } from "react";
import CloseButton from "./CloseButton";
import { DrawerSheetContext } from "../../../ui/Drawer";

// ─────────────────────────────────────────────────────────────────────────────
//  SheetDrawerHeader — a booking flow's header when its drawer is raised as a
//  bottom sheet (the phone itinerary; see ui/Drawer's DrawerSheetContext).
//
//  The flows were built as right-anchored desktop drawers and open on a back
//  arrow beside their title. Raised as sheets, that put a different header on
//  them from every other sheet on the surface, so in sheet mode they take
//  Sheet.jsx's chrome instead: the grab handle centred on top, the title and
//  its mono subtitle on the left, the round ✕ on the right, a hairline under.
//
//  `onClose` closes the whole flow. A flow with steps passes `onBack` while it
//  is past its first one; that gets a chevron before the title, since the ✕ no
//  longer means "one step back".
//
//  Outside sheet mode it renders nothing — callers keep their desktop header
//  and gate it on `useIsDrawerSheet()`.
// ─────────────────────────────────────────────────────────────────────────────

export const useIsDrawerSheet = () => useContext(DrawerSheetContext);

const BackChevron = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label="Back"
    style={{
      border: "1px solid #dcdfe5",
      background: "#ffffff",
      borderRadius: 999,
      boxShadow: "none",
      width: 26,
      height: 26,
      padding: 0,
      color: "#6b7280",
    }}
    className="flex flex-none items-center justify-center"
  >
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden style={{ display: "block" }}>
      <path
        d="M6.4 1.4L2.8 5l3.6 3.6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </button>
);

export default function SheetDrawerHeader({
  title,
  subtitle,
  onClose,
  onBack,
  right,
  // Pinned to the top of the scroller it sits in. Off where the caller already
  // pins the block it is part of.
  sticky = true,
  className = "",
}) {
  const asSheet = useIsDrawerSheet();
  if (!asSheet) return null;

  return (
    <div
      className={`flex-none bg-white ${sticky ? "sticky top-0 z-[900]" : ""} ${className}`}
    >
      {/* Same geometry as Sheet.jsx's handle; it paints over the one Drawer
          overlays, which sits at the same spot. */}
      <div className="pb-[6px] pt-[9px]">
        <div className="mx-auto h-[4px] w-[40px] rounded-full bg-[#dcdfe5]" />
      </div>
      <div className="flex items-start gap-[11px] border-b border-[#e6e8ec] px-[14px] pb-[11px] pt-[11px]">
        {onBack ? <BackChevron onClick={onBack} /> : null}
        <div className="min-w-0 flex-1">
          {title ? (
            <div className="truncate font-inter text-[15.5px] font-[800] leading-[1.25] tracking-[-0.02em] text-[#0b1220]">
              {title}
            </div>
          ) : null}
          {subtitle ? (
            <div className="mt-[5px] truncate font-mono text-[8.5px] uppercase tracking-[0.06em] text-[#8a93a6]">
              {subtitle}
            </div>
          ) : null}
        </div>
        {right}
        <CloseButton onClick={onClose} />
      </div>
    </div>
  );
}

/**
 * The panel around a flow whose drawer itself is the scroller. In sheet mode
 * the header stays put and the body scrolls beneath it — a sticky header can't
 * do that there, since Drawer wraps its children in an `h-full` box and sticky
 * lets go once that box has scrolled by. Elsewhere it is just the children.
 */
export function SheetDrawerFrame({ header, children }) {
  const asSheet = useIsDrawerSheet();
  if (!asSheet) return children;
  return (
    <div className="flex h-full flex-col">
      {header}
      <div
        className="min-h-0 flex-1 overflow-y-auto"
        style={{ WebkitOverflowScrolling: "touch", overscrollBehavior: "contain" }}
      >
        {children}
      </div>
    </div>
  );
}

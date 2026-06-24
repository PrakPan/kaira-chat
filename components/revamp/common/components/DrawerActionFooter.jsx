import React from "react";
import ReactDOM from "react-dom";
import media from "../../../media";

/**
 * A fixed, always-visible action footer pinned to the bottom of a right-anchored
 * drawer. Rendered via a portal to #modal-portal (a sibling of the drawer panel)
 * so it escapes the drawer's transformed/overflow scroll container — otherwise a
 * `fixed`/`sticky` child would scroll with the drawer content.
 *
 * Width mirrors the shared Drawer (50vw on desktop ≥984px, 100vw on mobile).
 *
 * Props:
 *  - zIndex: stacking order; pass just above the host drawer's z-index.
 */
export default function DrawerActionFooter({ children, zIndex = 1502 }) {
  const isWide = media("(min-width: 984px)");

  if (typeof document === "undefined") return null;
  const target = document.getElementById("modal-portal") || document.body;
  if (!target) return null;

  return ReactDOM.createPortal(
    <div
      style={{
        position: "fixed",
        bottom: 0,
        right: 0,
        width: isWide ? "50vw" : "100vw",
        zIndex,
      }}
      className="border-t border-[#ececec] bg-[#fafaf5] px-5 py-3 flex flex-col gap-2.5"
    >
      {children}
    </div>,
    target
  );
}

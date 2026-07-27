import React, { useContext } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import { DrawerContext } from "../../../ui/Drawer";

/**
 * A fixed, always-visible action footer pinned to the bottom of a right-anchored
 * drawer. Rendered via a portal to #modal-portal (a sibling of the drawer panel)
 * so it escapes the drawer's transformed/overflow scroll container — otherwise a
 * `fixed`/`sticky` child would scroll with the drawer content.
 *
 * Because it lives outside the panel it inherits neither the panel's exit
 * animation nor its width, so both are re-derived here from DrawerContext and a
 * CSS media query mirroring the Drawer's own 984px breakpoint.
 *
 * Props:
 *  - zIndex: stacking order; pass just above the host drawer's z-index.
 */
const FooterBar = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: ${(props) => props.$zIndex};

  /* Width mirrors the shared Drawer (50vw on desktop >=984px, 100vw on mobile).
     Kept in CSS rather than a JS media query so the bar is never painted at the
     full device width for a frame before narrowing onto the drawer. */
  width: 100vw;
  @media screen and (min-width: 984px) {
    width: 50vw;
  }

  /* Leave with the panel instead of outliving it: the panel slides/fades out
     over 0.2s while the Drawer holds its children mounted, and the bar is not
     inside the panel to be carried along. */
  transition: opacity 0.2s linear, transform 0.2s ease;
  opacity: ${(props) => (props.$leaving ? 0 : 1)};
  transform: translateX(${(props) => (props.$leaving ? "100%" : "0")});
  pointer-events: ${(props) => (props.$leaving ? "none" : "auto")};
`;

export default function DrawerActionFooter({ children, zIndex = 1502 }) {
  // null when rendered outside a Drawer — nothing to follow, so always show.
  const drawer = useContext(DrawerContext);

  if (typeof document === "undefined") return null;
  const target = document.getElementById("modal-portal") || document.body;
  if (!target) return null;

  return ReactDOM.createPortal(
    <FooterBar
      $zIndex={zIndex}
      $leaving={drawer ? drawer.fade !== "in" : false}
      className="border-t border-[#ececec] bg-white px-2.5 md:px-5 py-3 flex flex-col gap-2.5"
    >
      {children}
    </FooterBar>,
    target
  );
}

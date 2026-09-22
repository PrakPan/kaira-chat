import styled, { keyframes } from "styled-components";
import { createContext, useContext, useMemo, useState } from "react";
import { useEffect } from "react";
import ReactDOM from "react-dom";
import Image from "next/image";
import { lockDocumentScroll } from "../revamp/common/scrollLock";

/**
 * Exposes the drawer's live open/exit state to descendants that portal
 * themselves out of the panel (see DrawerActionFooter) and therefore can't
 * inherit its animation or geometry from the DOM. `null` outside a Drawer.
 * `anchor` is the edge the panel actually came in from — "bottom" for a side
 * drawer raised as a sheet (see DrawerSheetContext).
 */
export const DrawerContext = createContext(null);

/**
 * Raises every side drawer below it as a BOTTOM SHEET instead: the mobile
 * itinerary's booking flows (hotel search, transfer and taxi pickers), which
 * were all built as right-anchored drawers for desktop and would otherwise
 * slide in full-screen over a surface where every other panel rises from the
 * bottom. Only the frame changes — each drawer keeps its own body, header and
 * close path.
 *
 * The sheet is shorter than the viewport, and these drawers size their
 * columns to it (`h-screen`, `min-h-screen`, `h-[100vh]`), which would push
 * their footers and inner scrollers off the bottom. The panel publishes its
 * height as `--ttw-drawer-h`, and `.ttw-drawer-sheet` in styles/globals.css
 * points those classes at it.
 */
export const DrawerSheetContext = createContext(false);

// The mobile itinerary's own sheets (Sheet.jsx) open at 95dvh.
const SHEET_HEIGHT = "95dvh";

const leftSlideIn = keyframes`
from {
  transform: translateX(-100%);
}
to {
  transform: translateX(0%);
}
`;

const leftSlideOut = keyframes`
from {
  transform: translateX(0%);
}
to {
  transform: translateX(-100%);
}
`;

const rightSlideIn = keyframes`

 from {
   transform: translateX(100%);
 }
 to {
   transform: translateX(0%);
 }
 `;

const rightSlideOut = keyframes`
from {
  transform: translateX(0%);
 }
 to {
   transform: translateX(100%);
 }
 `;

const botttomSlideIn = keyframes`

from {
  transform: translateY(100%);
}
to {
  transform: translateY(0%);
}
`;

const bottomSlideOut = keyframes`
from {
 transform: translateY(0%);
}
to {
  transform: translateY(100%);
}
`;

const DrawerContainer = styled.div`
  position: fixed;
  top: ${(props) => (props.mobileTop ? props.mobileTop : "0%")};
  ${(props) =>
    props.anchor === "left" || props.anchor === "right"
      ? "height: 100%; top : 0;"
      : "width: 100vw; left : 0;"}
  ${(props) => props.anchor && `${props.anchor}: 0`};
  box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;
  animation: 0.2s
    ${(props) =>
      props.fade === "in"
        ? props.anchor == "left"
          ? leftSlideIn
          : props.anchor == "right"
          ? rightSlideIn
          : botttomSlideIn
        : props.anchor == "left"
        ? leftSlideOut
        : props.anchor == "right"
        ? rightSlideOut
        : bottomSlideOut}
    forwards;
  z-index: ${(props) => (props.zIndex ? props.zIndex : "1250")};
  transition: opacity 0.25s linear;
  overflow: auto;
  opacity: ${(props) => (props.fade === "in" ? "1" : "0")};
  overscroll-behavior: contain;
  background: ${(props) => (props.bgColor ? props.bgColor : "white")};
  ${(props) => props.mobileWidth && `width : ${props.mobileWidth}`};

  @media screen and (min-width: 984px) {
    top: ${(props) => (props.top ? props.top : "0%")};
    ${(props) => props.width && `width : ${props.width}`};
  }
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const BlackContainer = styled.div`
  background: ${(props) =>
    props.fade === "in" ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0)"};
  position: fixed;
  top: 0;
  left: 0;

  z-index: ${(props) => props.zIndex};
  width: 100vw;
  height: 100vh;
  transition: background 0.5s linear;
`;

export default function Drawer(props) {
  const [_document, set_document] = useState(null);
  const [open, setOpen] = useState(false);
  const [fade, setFade] = useState("out");
  let zIndex = 1250;

  const asSheet =
    useContext(DrawerSheetContext) &&
    (props.anchor === "right" || props.anchor === "left");
  const anchor = asSheet ? "bottom" : props.anchor;

  // A sheet sits over a phone page that scrolls the DOCUMENT (the bot shell's
  // address-bar retraction), where `body { overflow: hidden }` below doesn't
  // hold against a touch drag. Same shared lock the itinerary's own sheets
  // take (see scrollLock.js), released on unmount as well as on close.
  //
  // A sheet leaves `body.style.overflow` alone instead. The drawers it raises
  // mostly close by clearing the URL, which unmounts them without running
  // onCLose — and on a page that scrolls the document, the `hidden` left behind
  // would freeze it.
  useEffect(() => {
    if (!asSheet || !props.show) return undefined;
    return lockDocumentScroll();
  }, [asSheet, props.show]);

  useEffect(() => {
    set_document(document);
  }, []);

  useEffect(() => {
    if (props.show === true) {
      setOpen(true);
      if (!asSheet) document.body.style.overflow = "hidden";

      setFade("in");
    } else onCLose();
  }, [props.show]);

  if (props.style && props.style.zIndex) {
    zIndex = props.style.zIndex;
  } else if (props.zIndex) {
    zIndex = props.zIndex;
  }

  function onCLose() {
    if (!asSheet) document.body.style.overflow = "initial";
    setFade("out");
    setTimeout(() => {
      setOpen(false);
      if (props.onHide) props.onHide();
    }, 100);
  }

  const drawerContext = useMemo(
    () => ({ open, fade, anchor }),
    [open, fade, anchor]
  );

  // `top: auto` is load-bearing: DrawerContainer pins `top` for every anchor,
  // which would stretch a bottom panel to the full viewport. Listed after the
  // drawer's own style so a width or height it sets for the side panel can't
  // leak into the sheet.
  const style = asSheet
    ? {
        ...props.style,
        top: "auto",
        left: 0,
        width: "100%",
        height: SHEET_HEIGHT,
        borderRadius: "20px 20px 0 0",
        borderTop: "1px solid #dcdfe5",
        boxShadow: "none",
        "--ttw-drawer-h": SHEET_HEIGHT,
      }
    : { ...props.style };

  return _document
    ? ReactDOM.createPortal(
        <div className="App">
          {open && (
            <div style={{ position: "relative" }}>
              <BlackContainer
                fade={fade}
                onClick={onCLose}
                zIndex={zIndex - 1}
              ></BlackContainer>
              <DrawerContainer
                fade={fade}
                anchor={anchor}
                style={style}
                top={props.top}
                mobileTop={props.mobileTop}
                borderRadius={props.borderRadius}
                width={props.width}
                mobileWidth={(props.mobileWidth!=null && props.mobileWidth!=undefined)?props.mobileWidth:props?.width}
                height={props.height}
                bgColor={props.bgColor}
                centered={props.centered}
                className={`drawerContainer ${asSheet ? "ttw-drawer-sheet" : ""} ${props.className || ""}`}

              >
               {/* The sheet's grab handle. Laid over the drawer's own header
                   rather than above it, so its full-height column still
                   starts at the top of the panel. */}
               {asSheet && (
                 <div
                   aria-hidden
                   className="pointer-events-none absolute left-1/2 top-[7px] z-[1] h-[4px] w-[40px] -translate-x-1/2 rounded-full bg-[#dcdfe5]"
                 />
               )}
               {props?.isCloseButtonEnable && <div className="flex w-full justify-end py-[16px] px-[10px]"> <button onClick={onCLose} className="ttw-btn-close" > Close <Image src={'/assets/icons/close.svg'} width={9} height={9} /> </button> </div>  }
                <div className="h-full">
                  <DrawerContext.Provider value={drawerContext}>
                    {props.children}
                  </DrawerContext.Provider>
                </div>
              </DrawerContainer>
            </div>
          )}
        </div>,
        _document.getElementById("modal-portal")
      )
    : null;
}

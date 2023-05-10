import styled, { keyframes } from "styled-components";
import { useState } from "react";
import { useEffect } from "react";
import ReactDOM from "react-dom";
import media from "../media";

const LeftSlideIn = keyframes`
from { 
  transform: translateX(-100%);
}
to { 
  transform: translateX(0%);
} 
`;

const LeftSlideOut = keyframes`
from { 
  transform: translateX(0%);
}
to { 
  transform: translateX(-100%);
} 
`;
const RightSlideIn = keyframes`

 from { 
   transform: translateX(100%);
 }
 to { 
   transform: translateX(0%);
 } 
 `;

const RightSlideOut = keyframes`
from { 
  transform: translateX(0%);
 }
 to { 
   transform: translateX(100%);
 } 
 `;

const DrawerContainer = styled.div`
  position: fixed;
  top: ${(props) => (props.mobileTop ? props.mobileTop : "0%")};
  height: 100vh;
  ${(props) => props.anchor == "left" && "left: 0"};
  ${(props) => props.anchor == "right" && "right: 0"};
  box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;
  animation: 0.2s
    ${(props) =>
      props.fade === "in"
        ? props.anchor == "left"
          ? LeftSlideIn
          : RightSlideIn
        : props.anchor == "right"
        ? RightSlideOut
        : LeftSlideOut}
    forwards;
  z-index: ${(props) => (props.zIndex ? props.zIndex : "1250")};
  transition: opacity 0.25s linear;
  overflow: auto;
  opacity: ${(props) => (props.fade === "in" ? "1" : "0")};
  overscroll-behavior: contain;
  background: ${(props) => (props.bgColor ? props.bgColor : "white")};

  @media screen and (min-width: 768px) {
    top: ${(props) => (props.top ? props.top : "0%")};
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

  z-index: 1249;
  width: 100vw;
  height: 100vh;
  transition: background 0.5s linear;
`;
export default function Drawer(props) {
  const [_document, set_document] = useState(null);
  let isPageWide = media("(min-width: 768px)");
  const [open , setOpen] = useState(false)
    useEffect(() => {
      set_document(document);
      return () => { (document.body.style.overflowY = "scroll");}
    }, []);
  const [fade, setFade] = useState("out");
  function onCLose() {
    document.body.style.overflowY = "scroll";
    document.body.style.overflow = "overlay";
    setFade("out");
    setTimeout(() => {
      setOpen(false)
      if(props.onHide) props.onHide()
    }, 100);
  }

 function getScrollBarWidth() {
   let el = document.createElement("div");
   el.style.cssText = "overflow:scroll; visibility:hidden; position:absolute;";
   document.body.appendChild(el);
   let width = el.offsetWidth - el.clientWidth;
   el.remove();
   return width;
  }
  
    useEffect(() => {
      if (props.show === true) {
          setOpen(true)
        document.body.style.overflowY = "hidden";
        // if (isPageWide) document.body.style.paddingRight = getScrollBarWidth() + "px";
        setFade("in");
      } else onCLose();
    }, [props.show]);
  
  return _document
    ? ReactDOM.createPortal(
        <div className="App">
          {open && (
            <div style={{ position: "relative" }}>
              <BlackContainer fade={fade} onClick={onCLose}></BlackContainer>
              <DrawerContainer
                fade={fade}
                anchor={props.anchor}
                className="drawerContainer"
                style={{ ...props.style }}
                top={props.top}
                mobileTop={props.mobileTop}
                borderRadius={props.borderRadius}
                width={props.width}
                mobileWidth={props.mobileWidth || props.width}
                height={props.height}
                bgColor={props.bgColor}
                centered={props.centered}
              >
                <div>{props.children}</div>
              </DrawerContainer>
            </div>
          )}
        </div>,
        _document.getElementById("modal-portal")
      )
    : null;
}

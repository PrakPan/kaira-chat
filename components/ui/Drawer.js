import styled, { keyframes } from "styled-components";
import { useState } from "react";
import { useEffect } from "react";
import ReactDOM from "react-dom";

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

  @media screen and (min-width: 768px) {
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

  if (props.style && props.style.zIndex) {
    zIndex = props.style.zIndex;
  } else if (props.zIndex) {
    zIndex = props.zIndex;
  }

  useEffect(() => {
    set_document(document);
  }, []);

  function onCLose() {
    document.body.style.overflow = "initial";
    setFade("out");
    setTimeout(() => {
      setOpen(false);
      if (props.onHide) props.onHide();
    }, 100);
  }

  useEffect(() => {
    if (props.show === true) {
      setOpen(true);
      document.body.style.overflow = "hidden";

      setFade("in");
    } else onCLose();
  }, [props.show]);

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

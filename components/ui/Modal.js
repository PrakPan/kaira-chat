import styled, { keyframes } from 'styled-components';
import { RxCross2 } from 'react-icons/rx';
import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import media from '../media';
import { ClaimItinary } from '../../store/actions/auth';
const TopSlideIn = keyframes`
from { 
  transform: translate(-50%,-100%);
}
to { 
  transform: translate(-50%,-50%);
} 
`;

const TopSlideOut = keyframes`
from { 
  transform: translate(-50%,-50%);
}
to { 
  transform: translate(-50%,-100%);
} 

`;

const ModalContainer = styled.div`
  position: fixed;
  top: ${(props) => (props.mobileTop ? props.mobileTop : "50%")};
  left: ${(props) => (props.mobileLeft ? props.mobileLeft : "50%")};
  background: ${(props) => (props.bgColor ? props.bgColor : "white")};
  border-radius: ${(props) =>
    props.borderRadius ? props.borderRadius : "0px"};
  ${(props) => props.mobileWidth && `width : ${props.mobileWidth}`};
  ${(props) => props.height && `height : ${props.height}`};
  box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;
  animation: 0.5s ${(props) => (props.fade === "in" ? TopSlideIn : TopSlideOut)}
    forwards;
  z-index: ${(props) => props.zIndex || "1600"};
  opacity: ${(props) => (props.fade === "in" ? "1" : "0")};
  transition: opacity 0.8s linear;

  ${(props) => (props.overflow ? props.overflow : "overflow : auto")};
  overscroll-behavior: contain;
  ${(props) => !props.height && "max-height: 95vh;"}

  margin: ${(props) => (props.margin ? props.margin : "0px")};
  @media screen and (min-width: 768px) {
    ${(props) => props.width && `width : ${props.width}`};
    top: ${(props) => (props.top ? props.top : "50%")};
    left: ${(props) => (props.left ? props.left : "50%")};
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
  z-index: ${props=>props.zIndex || '1599'};
  width: 100vw;
  height: 100vh;
  transition: background 0.6s linear;
`;

export default function Modal(props) {
  const [_document, set_document] = useState(null);
  let isPageWide = media('(min-width: 768px)');

  function getScrollBarWidth() {
    let el = document.createElement('div');
    el.style.cssText = 'overflow:scroll; visibility:hidden; position:absolute;';
    document.body.appendChild(el);
    let width = el.offsetWidth - el.clientWidth;
    el.remove();
    return width;
  }
  useEffect(() => {
    set_document(document);
    // return () => {
    // document.body.style.overflow = "overlay";
    // };
  }, []);
  const [fade, setFade] = useState('out');
  function onCLose() {
    setFade('out');

    setTimeout(() => {
      if (props.onHide) props.onHide();
      // document.body.style.overflowY = 'scroll'
      document.body.style.overflow = 'initial';

      // if(isPageWide) document.body.style.paddingRight = '0px'
    }, 800);
  }

  useEffect(() => {
    if (props.show === true) {
      document.body.style.overflow = 'hidden';
      // if(isPageWide) document.body.style.paddingRight = getScrollBarWidth() + 'px'
      setFade('in');
    }
    // else onCLose();
  }, [props.show]);

  return _document
? ReactDOM.createPortal(
        <div>
          {props.show && (
            <div
              className="font-lexend"
              style={{ position: "relative", ...props.style }}
            >
              <BlackContainer
                fade={fade}
                onClick={props.backdrop && onCLose}
                zIndex={props.zIndex ? props.zIndex - 1 : 1599}
              ></BlackContainer>
              <ModalContainer
                fade={fade}
                className="modalContainer"
                style={{ ...props.style }}
                overflow={props.overflow}
                top={props.top}
                left={props.left}
                mobileTop={props.mobileTop}
                mobileLeft={props.mobileLeft}
                borderRadius={props.borderRadius}
                width={props.width}
                mobileWidth={props.mobileWidth || props.width}
                height={props.height}
                bgColor={props.bgColor}
                centered={props.centered}
                zIndex={props.zIndex ? props.zIndex : 1600}
              >
                {props.closeIcon && (
                  <RxCross2
                    style={{
                      position: "absolute",
                      top: "15px",
                      right: "15px",
                      fontSize: "1.5rem",
                      cursor: "pointer",
                    }}
                    onClick={onCLose}
                  />
                )}
                <div>{props.children}</div>
              </ModalContainer>
            </div>
          )}
        </div>,
        _document.getElementById("modal-portal")
      )
    : null;
}

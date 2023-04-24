import styled, { keyframes } from "styled-components";
import { RxCross2 } from "react-icons/rx";
import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
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
  top: ${props=>props.mobileTop? props.mobileTop : '50%'};
  left: ${props=>props.mobileLeft? props.mobileLeft : '50%'};
  background: ${props=>props.bgColor? props.bgColor : 'white'};
  border-radius : ${props=>props.borderRadius? props.borderRadius : '0px'};
  ${props=>props.width && `width : ${props.width}`};
  ${props=>props.height && `width : ${props.height}`};
  box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;
  animation: 0.5s ${(props) => (props.fade === "in" ? TopSlideIn : TopSlideOut)} forwards;
  z-index: 1600;
  opacity: ${(props) => (props.fade === "in" ? "1" : "0")};
  transition: opacity 0.8s linear;
  overflow : auto;
  overscroll-behavior: contain;
  max-height : 95vh;
  margin : ${props=>props.margin? props.margin : '0px'};
  @media screen and (min-width: 768px) {
    top: ${props=>props.top? props.top : '50%'};
    left: ${props=>props.left? props.left : '50%'};
  // ${props=>props.centered && 'top: 50%;left:50%'};
  };
  // ${props=>props.centered && 'top: 50%;left:50%'};
`;
const BlackContainer = styled.div`
  background: ${(props) =>
    props.fade === "in" ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0)"};
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1599;
  width: 100vw;
  height: 100vh;
  transition: background 0.6s linear;
`;



export default function Modal(props) {
  const [_document, set_document] = useState(null)
  useEffect(() => {
    set_document(document)
}, [])
  const [fade, setFade] = useState("out");
  function onCLose() {
    setFade("out");
    setTimeout(() => {
      // props.setShow(false);
      if (props.onHide) props.onHide();
      document.body.style.overflowY = 'scroll'
    }, 800);
  }

  useEffect(() => {
    if (props.show === true){
    document.body.style.overflowY = 'hidden';
    setFade("in")
  }
    else onCLose();
  }, [props.show]);



  return _document ? ReactDOM.createPortal(
    <div>
      {props.show && (
        <div
          className="font-lexend"
          style={{ position: "relative", ...props.style }}
        >
          <BlackContainer
            fade={fade}
            onClick={props.backdrop && onCLose}
          ></BlackContainer>
          <ModalContainer
            fade={fade}
            className="modalContainer"
            style={{ ...props.style }}
            top={props.top}
            left={props.left}
            mobileTop={props.mobileTop}
            mobileLeft={props.mobileLeft}
            borderRadius={props.borderRadius}
            width={props.width}
            height={props.height}
            bgColor={props.bgColor}
            centered={props.centered}
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
    </div>
  ,_document.getElementById('modal-portal'))
  : null
}

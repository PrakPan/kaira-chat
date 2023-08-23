// import styled, { keyframes } from "styled-components";
// import { useState } from "react";
// import { useEffect } from "react";
// import ReactDOM from "react-dom";
// import media from "../media";
// import { connect } from "react-redux";
// import { changeScrollBehaviour } from "../../store/actions/scroll";
// import { useRef } from "react";

// const leftSlideIn = keyframes`
// from {
//   transform: translateX(-100%);
// }
// to {
//   transform: translateX(0%);
// }
// `;

// const leftSlideOut = keyframes`
// from {
//   transform: translateX(0%);
// }
// to {
//   transform: translateX(-100%);
// }
// `;
// const rightSlideIn = keyframes`

//  from {
//    transform: translateX(100%);
//  }
//  to {
//    transform: translateX(0%);
//  }
//  `;

// const rightSlideOut = keyframes`
// from {
//   transform: translateX(0%);
//  }
//  to {
//    transform: translateX(100%);
//  }
//  `;

// const botttomSlideIn = keyframes`

// from {
//   transform: translateY(100%);
// }
// to {
//   transform: translateY(0%);
// }
// `;

// const bottomSlideOut = keyframes`
// from {
//  transform: translateY(0%);
// }
// to {
//   transform: translateY(100%);
// }
// `;


// const DrawerContainer = styled.div`
//   position: fixed;
//   top: ${(props) => (props.mobileTop ? props.mobileTop : "0%")};
//   ${(props) =>
//     props.anchor === "left" || props.anchor === "right"
//       ? "height: 100%; top : 0;"
//       : "width: 100vw; left : 0;"}
//   ${(props) => props.anchor && `${props.anchor}: 0`};
//   box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;
//   animation: 0.2s
//     ${(props) =>
//       props.fade === "in"
//         ? props.anchor == "left"
//           ? leftSlideIn
//           : props.anchor == "right"
//           ? rightSlideIn
//           : botttomSlideIn
//         : props.anchor == "left"
//         ? leftSlideOut
//         : props.anchor == "right"
//         ? rightSlideOut
//         : bottomSlideOut}
//     forwards;
//   z-index: ${(props) => (props.zIndex ? props.zIndex : "1250")};
//   transition: opacity 0.25s linear;
//   overflow: auto;
//   opacity: ${(props) => (props.fade === "in" ? "1" : "0")};
//   overscroll-behavior: contain;
//   background: ${(props) => (props.bgColor ? props.bgColor : "white")};
//   ${(props) => props.mobileWidth && `width : ${props.mobileWidth}`};

//   @media screen and (min-width: 768px) {
//     top: ${(props) => (props.top ? props.top : "0%")};
//     ${(props) => props.width && `width : ${props.width}`};
//   }
//   &::-webkit-scrollbar {
//     display: none;
//   }
//   -ms-overflow-style: none;
//   scrollbar-width: none;
// `;
// const BlackContainer = styled.div`
//   background: ${(props) =>
//     props.fade === "in" ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0)"};
//   position: fixed;
//   top: 0;
//   left: 0;

//   z-index: 1249;
//   width: 100vw;
//   height: 100vh;
//   transition: background 0.5s linear;
// `;
// function Drawer(props) {
//   const [_document, set_document] = useState(null);
//   const hasRendered = useRef(false);
//   const [open , setOpen] = useState(false)
//     useEffect(() => {
//       set_document(document);
//     }, []);
//   const [fade, setFade] = useState("out");
//   function onCLose() {
//     setFade("out");
//     setTimeout(() => {
//       if (props.onHide) props.onHide();
//       props.changeScrollBehaviour({ overflow: "scroll" });
//       setOpen(false);
//     }, 800);
//   }

//   useEffect(() => {
//     if (hasRendered.current) {
//       if (props.show === true) {
//         props.changeScrollBehaviour({ overflow: "hidden" });
//         setFade("in");
//         setOpen(true);
//       } else onCLose();
//     } else {
//       hasRendered.current = true;
//     }
//   }, [props.show]);
  
//   return _document
//     ? ReactDOM.createPortal(
//         <div className="App">
//           {open && (
//             <div style={{ position: "relative" }}>
//               <BlackContainer fade={fade} onClick={onCLose}></BlackContainer>
//               <DrawerContainer
//                 fade={fade}
//                 anchor={props.anchor}
//                 className="drawerContainer"
//                 style={{ ...props.style }}
//                 top={props.top}
//                 mobileTop={props.mobileTop}
//                 borderRadius={props.borderRadius}
//                 width={props.width}
//                 mobileWidth={props.mobileWidth || props.width}
//                 height={props.height}
//                 bgColor={props.bgColor}
//                 centered={props.centered}
//               >
//                 <div>{props.children}</div>
//               </DrawerContainer>
//             </div>
//           )}
//         </div>,
//         _document.getElementById("modal-portal")
//       )
//     : null;
// }


// const mapStateToProps = (state) => {
//   return {
//     overflow: state.scroll.overflow
//   };
// };
// const mapDispatchToProps = (dispatch) => {
//   return {
//     changeScrollBehaviour: (payload) =>
//       dispatch(changeScrollBehaviour(payload)),
//   };
// };
// export default connect(mapStateToProps, mapDispatchToProps)(Drawer);



import styled, { keyframes } from "styled-components";
import { useState } from "react";
import { useEffect } from "react";
import ReactDOM from "react-dom";
import media from "../media";

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

  z-index: 1249;
  width: 100vw;
  height: 100vh;
  transition: background 0.5s linear;
`;
export default function Drawer(props) {
  const [_document, set_document] = useState(null);
  let isPageWide = media("(min-width: 768px)");
  const [open, setOpen] = useState(false);
  useEffect(() => {
    set_document(document);
    // return () => { (document.body.style.overflow = "overlay");}
  }, []);
  const [fade, setFade] = useState("out");
  function onCLose() {
    // document.body.style.overflowY = "scroll";
    document.body.style.overflow = "initial";
    setFade("out");
    setTimeout(() => {
      setOpen(false);
      if (props.onHide) props.onHide();
    }, 100);
  }

  //  function getScrollBarWidth() {
  //    let el = document.createElement("div");
  //    el.style.cssText = "overflow:scroll; visibility:hidden; position:absolute;";
  //    document.body.appendChild(el);
  //    let width = el.offsetWidth - el.clientWidth;
  //    el.remove();
  //    return width;
  //   }

  useEffect(() => {
    if (props.show === true) {
      setOpen(true);
      document.body.style.overflow = "hidden";

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

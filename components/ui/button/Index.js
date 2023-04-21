
import React, { useEffect, useState } from "react";
import Externallinkbutton from "./Externallinkbutton";
import Generalbutton from "./Generallinkbutton";
import Internallinkbutton from "./Internallinkbutton";

const Index = (props) => {
  const [JSX, setJSX] = useState("");   
 useEffect(() => {
    if (props.onclick) {
       setJSX(
          <Generalbutton
          className="font-poppins"
            onclick={() => props.onclick(props.onclickparam)}
            color={props.color}
            borderRadius={props.borderRadius}
            bgColor={props.bgColor}
            textDecor={props.textDecor}
            margin={props.margin}
            marginMobile={props.marginMobile}
            padding={props.padding}
            lineHeight={props.lineHeight}
            width={props.width}
            height={props.height}
            fontSize={props.fontSize}
            borderStyle={props.borderStyle}
            borderWidth={props.borderWidth}
            borderColor={props.borderColor}
            fontWeight={props.fontWeight}
            fontSizeDesktop={props.fontSizeDesktop}
            hoverColor={props.hoverColor}
            hoverBgColor={props.hoverBgColor}
            hoverBrColor={props.hoverBrColor}
            boxShadow={props.boxShadow}
            display={props.display}
            textAlign={props.textAlign}
            center={props.center}
          >
            {props.children}
          </Generalbutton>
       )
      } else if (props.link) {
       setJSX(
          <>
            <Internallinkbutton
            className="font-poppins"
              link={props.link}
              color={props.color}
              borderRadius={props.borderRadius}
              bgColor={props.bgColor}
              textDecor={props.textDecor}
              margin={props.margin}
              marginMobile={props.marginMobile}
              lineHeight={props.lineHeight}

              padding={props.padding}
              width={props.width}
              height={props.height}
              fontSize={props.fontSize}
              borderStyle={props.borderStyle}
              borderWidth={props.borderWidth}
              borderColor={props.borderColor}
              fontWeight={props.fontWeight}
              fontSizeDesktop={props.fontSizeDesktop}
              hoverColor={props.hoverColor}
              hoverBgColor={props.hoverBgColor}
              hoverBrColor={props.hoverBrColor}
              boxShadow={props.boxShadow}
              display={props.display}
              textAlign={props.textAlign}
            >
              {props.children}
            </Internallinkbutton>
          </>)
       
      } else if (props.external_link) {
       setJSX(
          <Externallinkbutton
          className="font-poppins"
            external_link={props.external_link}
            color={props.color}
            borderRadius={props.borderRadius}
            bgColor={props.bgColor}
            textDecor={props.textDecor}
            margin={props.margin}
            marginMobile={props.marginMobile}
            lineHeight={props.lineHeight}

            padding={props.padding}
            width={props.width}
            height={props.height}
            fontSize={props.fontSize}
            borderStyle={props.borderStyle}
            borderWidth={props.borderWidth}
            borderColor={props.borderColor}
            fontWeight={props.fontWeight}
            fontSizeDesktop={props.fontSizeDesktop}
            hoverColor={props.hoverColor}
            hoverBgColor={props.hoverBgColor}
            hoverBrColor={props.hoverBrColor}
            boxShadow={props.boxShadow}
            display={props.display}
            textAlign={props.textAlign}
          >
            {props.children}
          </Externallinkbutton>
       )
      } else {
          setJSX(
       null
          )
      }
 
 
 }, [props.onclick ,props.link,props.external_link])
 
 return <>{JSX}</>;
};
export default Index;






//previous version

// import React, { useState } from "react";
// import Externallinkbutton from "./Externallinkbutton";
// import Generalbutton from "./Generallinkbutton";
// // import Generalbutton from "./Generalbutton";

// import Internallinkbutton from "./Internallinkbutton";

// const Index = (props) => {
    
//   if (props.onclick) {
//     return (
//       <Generalbutton
//       className="font-opensans"
//         onclick={() => props.onclick(props.onclickparam)}
//         color={props.color}
//         borderRadius={props.borderRadius}
//         bgColor={props.bgColor}
//         textDecor={props.textDecor}
//         margin={props.margin}
//         padding={props.padding}
//         width={props.width}
//         height={props.height}
//         fontSize={props.fontSize}
//         borderStyle={props.borderStyle}
//         borderWidth={props.borderWidth}
//         borderColor={props.borderColor}
//         fontWeight={props.fontWeight}
//         fontSizeDesktop={props.fontSizeDesktop}
//         hoverColor={props.hoverColor}
//         hoverBgColor={props.hoverBgColor}
//         hoverBrColor={props.hoverBrColor}
//         boxShadow={props.boxShadow}
//         display={props.display}
//         textAlign={props.textAlign}
//       >
//         {props.children}
//       </Generalbutton>
//     );
//   } else if (props.link) {
//     return (
//       <>
//         <Internallinkbutton
//         className="font-opensans"
//           link={props.link}
//           color={props.color}
//           borderRadius={props.borderRadius}
//           bgColor={props.bgColor}
//           textDecor={props.textDecor}
//           margin={props.margin}
//           padding={props.padding}
//           width={props.width}
//           height={props.height}
//           fontSize={props.fontSize}
//           borderStyle={props.borderStyle}
//           borderWidth={props.borderWidth}
//           borderColor={props.borderColor}
//           fontWeight={props.fontWeight}
//           fontSizeDesktop={props.fontSizeDesktop}
//           hoverColor={props.hoverColor}
//           hoverBgColor={props.hoverBgColor}
//           hoverBrColor={props.hoverBrColor}
//           boxShadow={props.boxShadow}
//           display={props.display}
//           textAlign={props.textAlign}
//         >
//           {props.children}
//         </Internallinkbutton>
//       </>
//     );
//   } else if (props.external_link) {
//     return (
//       <Externallinkbutton
//       className="font-opensans"
//         external_link={props.external_link}
//         color={props.color}
//         borderRadius={props.borderRadius}
//         bgColor={props.bgColor}
//         textDecor={props.textDecor}
//         margin={props.margin}
//         padding={props.padding}
//         width={props.width}
//         height={props.height}
//         fontSize={props.fontSize}
//         borderStyle={props.borderStyle}
//         borderWidth={props.borderWidth}
//         borderColor={props.borderColor}
//         fontWeight={props.fontWeight}
//         fontSizeDesktop={props.fontSizeDesktop}
//         hoverColor={props.hoverColor}
//         hoverBgColor={props.hoverBgColor}
//         hoverBrColor={props.hoverBrColor}
//         boxShadow={props.boxShadow}
//         display={props.display}
//         textAlign={props.textAlign}
//       >
//         {props.children}
//       </Externallinkbutton>
//     );
//   } else {
//     return <h1>saifur rahman</h1>;
//   }
// };
// export default Index;

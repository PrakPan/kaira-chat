import React, { useState } from "react";
import styled from "styled-components";

const Bannerheadingstyle = styled.div`
  font-weight: ${(props) => (props.fontWeight ? props.fontWeight : "700")};
  font-size: ${(props) => (props.fontSize ? props.fontSize : "2.5rem")};
  text-align: ${(props) => (props.textAlign ? props.textAlign : "center")};
  @media screen and (min-width: 768px) {
    font-size: ${(props) => (props.fontSize ? props.fontSize : "5rem")};
    margin: ${(props) => (props.margin ? props.margin : "3rem")};
    font-weight: ${(props) => (props.fontWeight ? props.fontWeight : "800")};
  }
`;

const Bannerheading = (props) => {
  return (
    <Bannerheadingstyle
      className="font-lexend"
      fontSize={props.fontSize}
      fontWeight={props.fontWeight}
      textAlign={props.textAlign}
      margin={props.margin}
    >
      {props.children}
    </Bannerheadingstyle>
  );
};
export default Bannerheading;

/* font-size :${(props)=>(props.fontSize ? props.fontSize : (props.noline ? "2.5rem": "3rem"))};  */
/* text-align:${(props)=>(props.textAlign ? props.textAlign : (props.aligndesktop ? props.aligndesktop : props.align))};  */
/* margin:${(props)=>(props.aligndesktop === "center" && props.margin ? props.margin+"auto" : props.margin)}; */

// max-width: ${(props)=> (props.maxWidth ? props.maxWidth: "100%" )};
// width: ${(props)=>(props.width ? props.width :"max-content")};

// max-width: ${(props)=> (props.maxWidth ? props.maxWidth: "100%" )};
//      width: ${(props)=>(props.width ? props.width :"max-content")};
//      border-width:${(props)=>(props.borderWidth ? props.borderWidth : "2px")};

// border-style: ${(props) => (props.borderStyle ? props.borderStyle : (props.noline ? "none" : "none none solid none"))}; //1
// padding: ${(props) => (props.padding ? props.padding : "5px")};
//   color: ${(props) => (props.color ? props.color : "black")};
//   width: ${(props) => (props.width ? props.width : (props.noline ? "100%" : "max-content"))};//1
//   border-color: ${(props) => (props.borderColor ? props.borderColor : "#F7E700")};
//   max-width: ${(props) => (props.maxWidth ? props.maxWidth : (props.noline ? "100%" : "85%"))};//1
//   letter-spacing: ${(props) => (props.letterSpacing ? props.letterSpacing : "1")};

//  max-width: 100%;
//  width: max-content;
//  border-width: 2px;
//  border-color: #F7e700;

//  fontWeight: '700',
//  fontSize: props.noline? '2.5rem ': '3rem',
//  textAlign: props.aligndesktop ? props.aligndesktop : props.align,
//  borderStyle: props.noline ? 'none' : 'none none solid none',
//  margin: props.aligndesktop  === "center" && props.margin ? props.margin+" auto" : props.margin,

/* : ${(props)=>(props. ? props. :)}; */
/* max-width: 100%;
        width: max-content;
        border-width: 2px;
        border-color: #F7e700; */
/* fontWeight= '700'
      borderStyle= {props.noline ? 'none' : 'none none solid none'}
      fontSize= '2rem'
      margin= {props.noline? '0' : '0 auto 0.5rem auto'}
      padding={ props.padding ? props.padding : '5px'}
      color={ props.color ? props.color : "black" }
      width= {props.noline ? '100%' : 'max-content'}
      borderColor= '#f7e700'
      maxWidth= {props.noline ? '100%' : '85%'}
      letterSpacing= '1' */






      ///soy



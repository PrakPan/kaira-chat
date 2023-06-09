// import { red } from "@mui/material/colors";
import React, { useState } from "react";
import styled from "styled-components";

const Mainheadingstyle = styled.div`
  font-weight: ${(props) => (props.fontWeight ? props.fontWeight : "700")};
  border-style: ${(props) =>
    props.borderStyle
      ? props.borderStyle
      : props.noline
      ? "none"
      : "none none solid none"};
  font-size: ${(props) => (props.fontSize ? props.fontSize : "2rem")};
  /* margin: ${(props) =>
    props.margin ? props.margin : props.noline ? "0" : "0 auto 0.5rem auto"}; */
  padding: ${(props) => (props.padding ? props.padding : "5px")};

  width: ${(props) =>
    props.width ? props.width : props.noline ? "100%" : "max-content"};
  border-color: ${(props) =>
    props.borderColor ? props.borderColor : "#F7E700"};
  max-width: ${(props) =>
    props.maxWidth ? props.maxWidth : props.noline ? "100%" : "85%"};
  letter-spacing: ${(props) =>
    props.letterSpacing ? props.letterSpacing : "1"};

  text-align: ${(props) => (props.textAlign ? props.textAlign : "center")};
  @media screen and (max-width: 768px) {
    color: ${(props) => (props.color ? props.color : "black")};
    margin: ${(props) => (props.noline ? "0" : "0 auto 0.5rem auto")};
  }
  @media screen and (min-width: 768px) {
    max-width: ${(props) => (props.maxWidth ? props.maxWidth : "100%")};
    width: ${(props) => (props.width ? props.width : "max-content")};
    border-width: ${(props) => (props.borderWidth ? props.borderWidth : "2px")};
    font-size: ${(props) =>
      props.fontSize ? props.fontSize : props.noline ? "2.5rem" : "3rem"};
    text-align: ${(props) =>
      props.textAlign
        ? props.textAlign
        : props.aligndesktop
        ? props.aligndesktop
        : props.align};
    margin: ${(props) =>
      props.aligndesktop === "center" && props.margin
        ? props.margin + " auto"
        : props.margin};
    max-width: ${(props) => (props.maxWidth ? props.maxWidth : "100%")};
    width: ${(props) => (props.width ? props.width : "max-content")};
    //
  }
`;

const Mainheading = (props) => {
  return (
    <Mainheadingstyle
      className="font-lexend"
      color={props.color} //6
      fontWeight={props.fontWeight} //1
      borderColor={props.borderColor} //8
      noline={props.noline} //13
      letterSpacing={props.letterSpacing} //10
      fontSize={props.fontSize} //3
      padding={props.padding} //5
      margin={props.margin} //4
      textAlign={props.textAlign} //11
      width={props.width} //7
      borderWidth={props.borderWidth} //12
      aligndesktop={props.aligndesktop} //14
      align={props.align} //15
      borderStyle={props.borderStyle} //2
      maxWidth={props.maxWidth} //9
    >
      {props.children}
    </Mainheadingstyle>
  );
};
export default Mainheading;

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

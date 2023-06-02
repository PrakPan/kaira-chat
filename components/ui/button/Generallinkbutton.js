// import { red } from "@mui/material/colors";
import React, { useState } from "react";
import styled from "styled-components";

const Generalbuttonstyle = styled.div`
  color: ${(props) => (props.color ? props.color : "black")};

  display: ${(props) => (props.display ? props.display : "block")};

  border-radius: ${(props) => (props.borderRadius ? props.borderRadius : "0")};

  background-color: ${(props) =>
    props.bgColor ? props.bgColor : "transparent"};

  text-decoration: ${(props) => (props.textDecor ? props.textDecor : "none")};

  margin: ${(props) =>
    props.marginMobile
      ? props.marginMobile
      : props.margin
      ? props.margin
      : "0"};
  line-height: ${(props) => (props.lineHeight ? props.lineHeight : "normal")};

  padding: ${(props) => (props.padding ? props.padding : "0.5rem 0.75rem")};

  width: ${(props) => (props.width ? props.width : "max-content")};

  height: ${(props) => (props.height ? props.height : "max-content")};

  font-size: ${(props) => (props.fontSize ? props.fontSize : "1rem")};
  border-style: ${(props) => (props.borderStyle ? props.borderStyle : "solid")};

  border-width: ${(props) => (props.borderWidth ? props.borderWidth : "2px")};

  border-color: ${(props) => (props.borderColor ? props.borderColor : "black")};

  font-weight: ${(props) => (props.fontWeight ? props.fontWeight : "400")};
  box-shadow: ${(props) =>
    props.boxShadow
      ? "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)"
      : "none"};
  text-align: ${(props) => (props.textAlign ? props.textAlign : "center")};

  @media screen and (min-width: 768px) {
    align-items: ${(props) => (props.center ? "center" : "normal")};

    justify-content: ${(props) => (props.center ? "center" : "normal")};
    margin: ${(props) => (props.margin ? props.margin : "0")};

    font-size: ${(props) =>
      props.fontSizeDesktop ? props.fontSizeDesktop : "1rem"};
    &:hover {
      color: ${(props) => (props.hoverColor ? props.hoverColor : "white")};

      background-color: ${(props) =>
        props.hoverBgColor ? props.hoverBgColor : "black"};
      border-color: ${(props) =>
        props.hoverBrColor ? props.hoverBrColor : "black"};
      cursor: pointer;
      transition: background-color 0.3s ease-in-out;
    }
  }
  &:focus {
    outline: none;
  }
  /* box-shadow: 0 5px red; */

  &:active {
    transform: translateY(2px);
  }
`;

const Generalbutton = (props) => {
  return (
    <Generalbuttonstyle
      className="font-lexend"
      onClick={() => props.onclick(props.onclickparam)}
      color={props.color}
      borderRadius={props.borderRadius}
      bgColor={props.bgColor}
      textDecor={props.textDecor}
      margin={props.margin}
      padding={props.padding}
      width={props.width}
      height={props.height}
      disabled={props.disabled}
      center={props.center}
      fontSize={props.fontSize}
      borderStyle={props.borderStyle}
      borderWidth={props.borderWidth}
      borderColor={props.borderColor}
      fontWeight={props.fontWeight}
      fontSizeDesktop={props.fontSizeDesktop}
      hoverColor={props.hoverColor}
      hoverBgColor={props.hoverBgColor}
      hoverBrColor={props.hoverBrColor}
      link={props.link}
      boxShadow={props.boxShadow}
      display={props.display}
      textAlign={props.textAlign}
      marginMobile={props.marginMobile}
      lineHeight={props.lineHeight}
      style={props.style}
    >
      {props.children}
    </Generalbuttonstyle>
  );
};
export default Generalbutton;

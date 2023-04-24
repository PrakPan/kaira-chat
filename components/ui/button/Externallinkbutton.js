import React, { useState } from "react";
import styled from "styled-components";
import Link from "next/link";

const Externalbuttonstyle = styled.div`
line-height: 1;
color: ${(props) => (props.color ? props.color : "black")};
display: ${(props) => (props.display ? props.display : "block")};

border-radius:${(props) => (props.borderRadius ? props.borderRadius : "0")};

background-color:${(props) => (props.bgColor ? props.bgColor : "transparent")};

text-decoration:${(props) => (props.textDecor ? props.textDecor : "none")};

margin:${(props) => (props.marginMobile ? props.marginMobile : props.margin ? props.margin : "0")};

padding:${(props) => (props.padding ? props.padding : "0.5rem")};

width:${(props) => (props.width ? props.width : "max-content")}; 

height: ${(props) => (props.height ? props.height : "max-content")};

font-size : ${(props) => (props.fontSize ? props.fontSize : "1rem")};

border-style:${(props) => (props.borderStyle ? props.borderStyle : "solid")};

border-width: ${(props) => (props.borderWidth ? props.borderWidth : "2px")};

border-color:${(props) => (props.borderColor ? props.borderColor : "black")};
line-height: ${(props => props.lineHeight ? props.lineHeight : 'normal')};
font-weight:${(props) => (props.fontWeight ? props.fontWeight : "400")};
box-shadow: ${(props) => (props.boxShadow ? " 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)" :"none")};
text-align: ${(props)=> (props.textAlign ? props.textAlign : "center")};

@media screen and (min-width: 768px){
  margin:${(props) => (  props.margin ? props.margin : "0")};

  font-size: ${(props) =>
    props.fontSizeDesktop ? props.fontSizeDesktop : "1rem"};
}
&:focus{
  outline:none;
}
/* box-shadow:  0 3px	#DCDCDC; */

&:hover{
  color: ${(props) => (props.hoverColor ? props.hoverColor : "white")};
  
  background-color: ${(props) =>
    props.hoverBgColor ? props.hoverBgColor : "black"};
  border-color: ${(props) =>
    props.hoverBrColor ? props.hoverBrColor : "black"};
  cursor: pointer;
 transition: background-color 0.2s ease-in-out;
  


}
&:active{
  transform: translateY(2px);
  
}






 
`

const Externallinkbutton = (props) => {
  return (
    <Link href={props.external_link ? props.external_link : "/404"} passHref={true}>
      <Externalbuttonstyle
      className="font-lexend"
        color={props.color}
        borderRadius={props.borderRadius}
        bgColor={props.bgColor}
        textDecor={props.textDecor}
        margin={props.margin}
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
        page={props.page}
        external_link ={props.external_link}
        boxShadow={props.boxShadow}
        display={props.display}
        textAlign={props.textAlign}
        marginMobile={props.marginMobile}
        lineHeight={props.lineHeight}

      >
        {props.children}
      </Externalbuttonstyle>
      </Link>
  );
};
export default Externallinkbutton;





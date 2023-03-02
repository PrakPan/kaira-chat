
import React, {useState} from 'react';
import styled from 'styled-components';
import media from './media';

const Button =  React.forwardRef((props, ref) => {
    let isPageWide = media('(min-width: 768px)')
    const [hover, setHover] = useState(false);
    const Container = styled.button`
     
        &:hover{
            color: ${props.hoverColor ? props.hoverColor : "white"};
            background-color: ${props.hoverBgColor ? props.hoverBgColor : "black"};
            border-color: ${props.hoverBrColor ? props.hoverBrColor : "black"};
            cursor: pointer;
            transition: background-color 0.6s ease;
        }
        @media screen and (min-width: 768px){
            font-size: ${props.fontSizeDesktop ? props.fontSizeDesktop : "1rem"};
          }
          &:focus{
            outline:none;
        }

    `;
    let color='black';
    if(props.color) color=props.color;
    let hovercolor = 'white';
    if(props.hoverColor) hovercolor=props.hoverColor;
    else hovercolor = color;


    let bgcolor='transparent';
    if(props.bgColor) bgcolor=props.bgColor;
    let hoverbgcolor = 'black';
    if(props.hoverBgColor) hoverbgcolor=props.hoverBgColor;
    else hoverbgcolor = bgcolor;


    const _handleMouseEnter = () => {

    }
    const _handleMouseExit = () => {
         setHover(false);
     }
    if(props.onclick){
        if(!isPageWide)
    return(
        <Container onMouseEnter={() => setHover(true)}  onMouseOut={() => setHover(false)} className="font-opensans center-dv" onClick={() => props.onclick(props.onclickparam)}
        style={{
            color: hover ? hovercolor : color,
            display: props.display ? props.display : "block",
            backgroundColor: hover ? hoverbgcolor : bgcolor,
            fontSize: props.fontSizeMobile ? props.fontSizeMobile : "1rem",
            margin: props.margin ? props.margin : "0",
            padding: props.padding ? props.padding : "0.5rem",
            width: props.width ? props.width : "max-content",
            height: props.height ? props.height : "max-content",
            borderStyle: props.borderStyle ? props.borderStyle : "solid",
            borderRadius: props.borderRadius ? props.borderRadius : "0",
            borderWidth: props.borderWidth ? props.borderWidth : "2px",
            borderColor: props.borderColor ? props.borderColor : "black",
            fontWeight: props.fontWeight ? props.fontWeight : "400"
        }}
        >
            {props.children}
        </Container>
    );
    else return(
        <Container onMouseEnter={() => setHover(true)} onMouseOut={() => setHover(false)} className="font-opensans center-dv" onClick={() => props.onclick(props.onclickparam)}
        style={{
            color: hover ? hovercolor : color,
            display: props.display ? props.display : "block",
            backgroundColor: hover ? hoverbgcolor : bgcolor,
            margin: props.margin ? props.margin : "0",
            padding: props.padding ? props.padding : "0.5rem",
            width: props.width ? props.width : "max-content",
            height: props.height ? props.height : "max-content",
            borderStyle: props.borderStyle ? props.borderStyle : "solid",
            borderRadius: props.borderRadius ? props.borderRadius : "0",
            borderWidth: props.borderWidth ? props.borderWidth : "2px",
            borderColor: props.borderColor ? props.borderColor : "black",
            fontWeight: props.fontWeight ? props.fontWeight : "400",
            fontSize: props.fontSizeDesktop ? props.fontSizeDesktop : "1rem"

        }}
        >
            {props.children}
        </Container>
    );
    }
    else{
        if(!isPageWide)
        return(
        <Container onMouseEnter={() => setHover(true)} onMouseOut={() => setHover(false)} className={props.blur ? "font-opensans blurry-text": "font-opensanss"}
        style={{
            color: hover ? hovercolor : color,
            display: props.display ? props.display : "block",
            backgroundColor: hover ? hoverbgcolor : bgcolor,
            fontSize: props.fontSizeMobile ? props.fontSizeMobile : "1rem",
            margin: props.margin ? props.margin : "0",
            padding: props.padding ? props.padding : "0.5rem",
            width: props.width ? props.width : "max-content",
            height: props.height ? props.height : "max-content",
            borderStyle: props.borderStyle ? props.borderStyle : "solid",
            borderRadius: props.borderRadius ? props.borderRadius : "0",
            borderWidth: props.borderWidth ? props.borderWidth : "2px",
            borderColor: props.borderColor ? props.borderColor : "black",
            fontWeight: props.fontWeight ? props.fontWeight : "400"
        }}>
            {props.children}
        </Container>
    );
    else
    return(
    <Container onMouseEnter={() => setHover(true)} onMouseOut={() => setHover(false)} className={props.blur ? "font-opensans blurry-text": "font-opensans"}
    style={{
        color: hover ? hovercolor : color,
        display: props.display ? props.display : "block",
        backgroundColor: hover ? hoverbgcolor : bgcolor,
        fontSize: props.fontSizeDesktop ? props.fontSizeDesktop : "1rem",
        margin: props.margin ? props.margin : "0",
        padding: props.padding ? props.padding : "0.5rem",
        width: props.width ? props.width : "max-content",
        height: props.height ? props.height : "max-content",
        borderStyle: props.borderStyle ? props.borderStyle : "solid",
        borderRadius: props.borderRadius ? props.borderRadius : "0",
        borderWidth: props.borderWidth ? props.borderWidth : "2px",
        borderColor: props.borderColor ? props.borderColor : "black",
        fontWeight: props.fontWeight ? props.fontWeight : "400"
    }}> 
        {props.children}
    </Container>
);
    }
    
}); 

export default  Button;
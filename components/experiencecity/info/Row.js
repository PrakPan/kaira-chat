import React, {useRef, useEffect, useState} from 'react';
import styled from 'styled-components';
import Heading from '../../newheading/heading/Index';
import media from '../../../components/media';

const Container = styled.div`
width: 100%;
margin-bottom: 2.5vh;
@media screen and (min-width: 768px){

    margin: auto auto 10vh auto;
    display: grid;
    grid-template-columns: 30% 70%;
}
`;
const HeadingContainer = styled.div`
height: max-content;
position: sticky;
background-color:white;

padding: 1rem 0;
z-index: 1040;
width: 100%;
@media screen and (min-width: 768px){
    top: 15vh;
    z-index: 1;
    padding: 0;
}
`;

const Text = styled.div`
max-width: 100%;
@media screen and (min-width: 768px){
   font-size: 1.1rem;
    /* font-size: ${props => props.theme.fontsizes.desktop.text.default}; */
    line-height: 1.75;
    padding: 0 0 0 2rem;
    font-weight: 300;
}
`;
const DetailsRow = (props) => {
    let isPageWide = media('(min-width: 768px)')

    const myRef = useRef();
  
    useEffect(()=> {
            window.addEventListener('scroll', handleScroll);
             return () => {
            window.removeEventListener('scroll', handleScroll);
          }
    })
    const handleScroll = (event) => {
        // props.setOffset(myRef.current.offsetTop);
    }

    return(
    <Container className="" ref={myRef}>
        <HeadingContainer style={{top: props.top ? props.top : isPageWide ?  '10vh' : '66px'}} className={props.class ? props.class : ""}>
            {isPageWide ? <Heading bold noline aligndesktop="left">{props.heading}</Heading> : <Heading bold align="center" >{props.heading}</Heading>}
        </HeadingContainer>
        <Text className="font-nunito" style={{padding: props.padding ? props.padding : '0'}}>
            {props.children}
        </Text>
    </Container>
  ); 
}

export default DetailsRow;

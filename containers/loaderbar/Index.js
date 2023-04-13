import styled from "styled-components";
import React, { useEffect, useState } from 'react';
import { faCheckSquare, faCoffee } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import img1 from '../../public/assets/logoblack.svg';
import content from '../../public/content/loaderbar';
import Linecirclecontainer from "./linecirclecontainer";
import LottieAnimation from "./Lottie";


const COLORS = {
  black: '#212529',
  gray: '#757D75',
  background: '#F7E700',
  white: 'white',
};
const Container1 = styled.div`
width: 100vw;
  height: 100vh;
  
z-index: 1000;
  position: fixed;
  place-items: center;
  background-size: contain;
  background-color: ${COLORS.background};
  
`



const Heading1 = styled.div`


top:21vh;

left: 13.299999999999997vw;
font-size:2rem;
@media screen and (min-width: 768px){
 
  top: 23vh;
  left:31.3vw;
    

  font-size:3rem;
}

`
const Logo = styled.img`

    width:32.3vw;
      top: 39vh;
    left: 33.3vw;
    @media screen and (min-width: 768px){
      width: 7vw;

    
    top: 32vh;
    left: 43vw;
   
     }

  `
const Heading2 = styled.div`
font-size:1rem;
margin:0.5rem 0 0 0;
font-weight: 400;

    display: block;
    @media screen and (min-width: 768px){
      margin: 1.5rem 0 0 0;
      font-size: 1rem;
      top: 66vh;
    }
`


const Index = () => {

  let cards = [];
  const [currentStep, updateCurrentStep] = useState(1);
  const [CardJSX, setCardJSX] = useState(false);
  useEffect(() => {


    for (var i = 0; i < content.length; i++) {

      if (content[i].heading) {
        cards.push(

          <Heading2 className='font-opensans'>
            {content[i].heading}
          </Heading2>
        )
      }
    }
    setCardJSX(cards);
  }, []);
  useEffect(() => {
    if (currentStep < 4) {
      const interval = setInterval(() => {
        updateCurrentStep(currentStep + 1);
      }, 1520);

      return () => {
        clearInterval(interval);
        
      };
    }
  });
  function updateStep(step) {

    updateCurrentStep(step);
  }



  return (


    <Container1 className='center-div'>
      {/* <Heading1 className='center-div'> Ready to make memories!</Heading1> */}
<LottieAnimation></LottieAnimation>
      {/* <Logo style={{ margin: '1rem 0 4rem 0' }} className='center-div' src={img1} ></Logo> */}
     <Linecirclecontainer/>

      <Heading2 className='center-di font-opensans' > {content[currentStep - 1].heading} </Heading2>

    </Container1>

  )
}
export default Index;   
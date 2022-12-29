
import Flickity from 'react-flickity-component';
import styled , {keyframes} from 'styled-components';
import SlideOne from "./slideone/SlideOne";
import React, {useState, useRef} from "react";
import SlideTwo from './slidetwo/SlideTwo';
import { fadeIn } from 'react-animations'
const fadeInAnimation = keyframes`${fadeIn}`;

const Card = styled.div`
width: 100%;
margin: 0;
animation: 1s ${fadeInAnimation};

  
`;
const flickityOptions = {
    initialIndex:0,
    prevNextButtons: false,
    wrapAround: false,
    draggable: false,
    pageDots: false,


  };

const FlickityComp = (props) => {
 
   
  
  
      return (
        <div style={{width: '100%'}}>
          
                            {!props.slideIndex ? <Card><SlideOne></SlideOne></Card> : null}
                            {props.slideIndex === 1 ? <Card><SlideTwo></SlideTwo></Card>: null}
                            {/* <Card><SlideOne></SlideOne></Card> */}

        
        {/* <div  style={{backgroundColor: 'black', width: '100%'}} className="text-center font-opensans" onClick={() => this.flkty.next()}>next button</div> */}
        </div>
      )
    
  }

  export default FlickityComp;
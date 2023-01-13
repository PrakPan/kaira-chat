
import Flickity from 'react-flickity-component';
import styled , {keyframes} from 'styled-components';
import SlideOne from "./slideone/SlideOne";
import React, {useState, useRef} from "react";
import SlideTwo from './slidetwo/SlideTwo';
import { fadeIn } from 'react-animations'
import Login from '../userauth/LogInModal';
import {IoIosArrowBack} from 'react-icons/io'
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
                      {props.slideIndex ? <IoIosArrowBack onClick={props._handlePrev} className="hover-pointer" style={{marginBottom: props.slideIndex === 2 ? '0.75rem' : '0.25rem'}}></IoIosArrowBack> : null}
                            {!props.slideIndex ? <Card><SlideOne cities={props.cities} selectedCities={props.selectedCities} setSelectedCities={props.setSelectedCities}></SlideOne></Card> : null}
                            {props.slideIndex === 1 ? <Card><SlideTwo></SlideTwo></Card>: null}
                            {props.slideIndex === 2 ? <Login nospacing noheading noicons hideloginclose noclose></Login> : null}
                            {/* <Card><SlideOne></SlideOne></Card> */}

        
        {/* <div  style={{backgroundColor: 'black', width: '100%'}} className="text-center font-opensans" onClick={() => this.flkty.next()}>next button</div> */}
        </div>
      )
    
  }

  export default FlickityComp;
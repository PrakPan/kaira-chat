
import Flickity from 'react-flickity-component';
import styled , {keyframes} from 'styled-components';
import SlideOne from "./slideone/SlideOne";
import React, {useState, useRef} from "react";
import SlideTwo from './slidetwo/SlideTwo';
import { fadeIn } from 'react-animations'
import Login from '../userauth/LogInModal';
// import {IoIosArrowBack} from 'react-icons/io'
// import {TbArrowBack} from 'react-icons/tb';

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
                            {!props.slideIndex ? <Card><SlideOne 
                            showSearchStarting={props.showSearchStarting} 
                            setShowSearchStarting={props.setShowSearchStarting}
                                        destination={props.destination}
                                        showCities={props.showCities}
                                        setShowCities={props.setShowCities}
                            cities={props.cities} 
                            selectedCities={props.selectedCities} 
                            setSelectedCities={props.setSelectedCities} 
                            valueStart={props.valueStart}
                            valueEnd={props.valueEnd}
                            setValueStart={props.setValueStart}
                            setValueEnd={props.setValueEnd}></SlideOne></Card> : null}
                            {props.slideIndex === 1 ? <Card><SlideTwo 
                            numberOfAdults={props.numberOfAdults}
                            setNumberOfAdults={props.setNumberOfAdults}
                            numberOfChildren={props.numberOfChildren} 
                            setNumberOfChildren={props.setNumberOfChildren}
                            numberOfInfants={props.numberOfInfants}
                            setNumberOfInfants={props.setNumberOfInfants}
                            groupType={props.groupType}
                            setGroupType={props.setGroupType}
                            setBudget={props.setBudget}
                            selectedPreferences={props.selectedPreferences} 
                            setSelectedPreferences={props.setSelectedPreferences}
                            ></SlideTwo></Card>: null}
                            {props.slideIndex === 2 && ! props.token ? <Login nospacing noheading noicons hideloginclose noclose></Login> : null}
                            {/* <Card><SlideOne></SlideOne></Card> */}

        
        {/* <div  style={{backgroundColor: 'black', width: '100%'}} className="text-center font-opensans" onClick={() => this.flkty.next()}>next button</div> */}
        </div>
      )
    
  }

  export default FlickityComp;
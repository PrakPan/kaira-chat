 
import React, {useState, useEffect } from 'react';
  import NewDatePicker from './NewDatePicker'
import media from '../../media';
 
import styled from 'styled-components';
 import Destinations from './destinations/Index';
 import Question from '../Question';
import Dates from './Dates';
import StartingLocation from './startinglocation/Index';
import {BsCheck} from 'react-icons/bs'
const Container = styled.div`
color: black;
width: 100%;
  @media screen and (min-width: 768px){
 
}

`;

const Section = styled.div`
margin-bottom: 1rem;
`;
const SlideOne = (props) =>{

  let isPageWide = media('(min-width: 768px)');
  const CITIES = null;
  // const [selectedCities, setSelectedCities] = useState([]);
  const [flexible, setFlexible] = useState(false);

   return (
   <Container>
    <Section>
        <Question>What do you want to explore?</Question>

        <Destinations  startingLocation={props.startingLocation} initialInputId={props.initialInputId}
            setStartingLocation={props.setStartingLocation} showSearchStarting={props.showSearchStarting} children_cities={props.children_cities}
           setDestination={props.setDestination}
           setShowSearchStarting={props.setShowSearchStarting} showCities={props.showCities} setShowCities={props.setShowCities} destination={props.destination}  CITIES={props.cities ? props.cities : CITIES} selectedCities={props.selectedCities} setSelectedCities={props.setSelectedCities}></Destinations>
      </Section>
      <Section>
        <Question style={{visibility: props.showCities ? 'hidden' : 'visible'}} margin="0 0 1rem 0" >When are you planning to travel?</Question>
{/* <Dates 
showCities={props.showCities}
 valueStart={props.valueStart}
 valueEnd={props.valueEnd}
 setValueStart={props.setValueStart}
 setValueEnd={props.setValueEnd}
></Dates> */}
<NewDatePicker
 valueStart={props.valueStart}
 valueEnd={props.valueEnd}
 setValueStart={props.setValueStart}
 setValueEnd={props.setValueEnd}

/>
<div  className='hover-pointer' style={{display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '1rem', marginLeft: '2px'}}>
  <div onClick={() => setFlexible(!flexible)}><div className="center-div" style={{border: '2px solid #01202B', color: 'black', lineHeight: '1', fontSize: '0.75rem', borderRadius: '3px', opacity: '1', height: '20px', width: '20px', backgroundColor: flexible ? 'rgba(247,231,0,1)' : "transparent"}}>
    {flexible ? <BsCheck></BsCheck> : null}
    </div></div>
  <div onClick={() => setFlexible(!flexible)} className='font-lexend' style={{fontSize: '0.85rem'}}>I'm flexible with my dates</div>
</div>

</Section>
<Section style={{marginBottom: '0.5rem'}}>
{/* <StartingLocation></StartingLocation> */}

</Section>
    </Container>
  );
}


export default SlideOne;

 
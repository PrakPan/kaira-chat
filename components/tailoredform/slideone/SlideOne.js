import React, {useState, useEffect } from 'react';
  
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
margin-bottom: 1.5rem;
`;
const SlideOne = (props) =>{

  let isPageWide = media('(min-width: 768px)');
  const CITIES = [
    {
      'name': 'Port Blair',
      'id': 1,
      'image': ''
    },
    {
      'name': 'Por Blair',
      'id': 2,
      'image': ''
    },
    {
      'name': 'Prt Blair',
      'id': 3,
      'image': ''
    },
    {
      'name': 'Pot Blair',
      'id': 4,
      'image': ''
    },
    {
      'name': 'Port Blair',
      'id': 5,
      'image': ''
    },
    {
      'name': 'Port Blair',
      'id': 6,
      'image': ''
    }

  ]
  // const [selectedCities, setSelectedCities] = useState([]);
  const [flexible, setFlexible] = useState(false);
  // console.log('cs', props.children_cities)
   return (
   <Container>
    <Section>
        <Question>What do you want to explore?</Question>

        <Destinations showSearchStarting={props.showSearchStarting} children_cities={props.children_cities}
            setShowSearchStarting={props.setShowSearchStarting} showCities={props.showCities} setShowCities={props.setShowCities} destination={props.destination}  CITIES={props.cities ? props.cities : CITIES} selectedCities={props.selectedCities} setSelectedCities={props.setSelectedCities}></Destinations>
      </Section>
      <Section>
        <Question style={{visibility: props.showCities ? 'hidden' : 'visible'}} margin="0 0 1rem 0" >When are you planning to travel?</Question>
<Dates 
showCities={props.showCities}
 valueStart={props.valueStart}
 valueEnd={props.valueEnd}
 setValueStart={props.setValueStart}
 setValueEnd={props.setValueEnd}
></Dates>
<div  className='hover-pointer' style={{display: 'flex', gap: '0.5rem', justifyContent:'flex-end', alignItems: 'center', marginTop: '1rem'}}>
  <div onClick={() => setFlexible(!flexible)}><div className="center-div" style={{border: '2px solid rgba(0, 0, 0, 1)', color: 'black', lineHeight: '1', fontSize: '0.75rem',borderColor: '#e4e4e4', borderRadius: '5px', opacity: '1', height: '1.25rem', width: '1.25rem', backgroundColor: flexible ? 'rgba(247,231,0,1)' : "white"}}>
    {flexible ? <BsCheck></BsCheck> : null}
    </div></div>
  <div onClick={() => setFlexible(!flexible)} className='font-opensans' style={{fontSize: '0.85rem'}}>I'm flexible</div>
</div>

</Section>
<Section style={{marginBottom: '0.5rem'}}>
{/* <StartingLocation></StartingLocation> */}

</Section>
    </Container>
  );
}


export default SlideOne;


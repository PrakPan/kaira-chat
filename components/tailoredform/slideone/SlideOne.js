import React, {useState, useEffect } from 'react';
  
import media from '../../media';
 
import styled from 'styled-components';
 import Destinations from './destinations/Index';
 import Question from '../Question';
import Dates from './Dates';
import StartingLocation from './startinglocation/Index';
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

   return (
   <Container>
    <Section>
        <Question>Where do  you want to go?</Question>

        <Destinations showCities={props.showCities} setShowCities={props.setShowCities} destination={props.destination}  CITIES={props.cities ? props.cities : CITIES} selectedCities={props.selectedCities} setSelectedCities={props.setSelectedCities}></Destinations>
      </Section>
      <Section>
        <Question style={{visibility: props.showCities ? 'hidden' : 'visible'}} >What are your dates?</Question>
<Dates 
showCities={props.showCities}
 valueStart={props.valueStart}
 valueEnd={props.valueEnd}
 setValueStart={props.setValueStart}
 setValueEnd={props.setValueEnd}
></Dates>

</Section>
<Section style={{marginBottom: '0.5rem'}}>
{/* <StartingLocation></StartingLocation> */}

</Section>
    </Container>
  );
}


export default SlideOne;


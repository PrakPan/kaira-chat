import React, {useState, useEffect } from 'react';
  
import media from '../../media';
 
import styled from 'styled-components';
 import Destinations from './destinations/Index';
 import Question from '../Question';
import Dates from './Dates';
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
  const [selectedCities, setSelectedCities] = useState([]);
  console.log(props.cities)
  return (
   <Container>
    <Section>
        <Question>Where do  you want to go?</Question>

        <Destinations CITIES={props.cities ? props.cities : CITIES} selectedCities={selectedCities} setSelectedCities={setSelectedCities}></Destinations>
      </Section>
      <Section>
        <Question >What are your dates?</Question>
<Dates></Dates>
</Section>
    </Container>
  );
}


export default SlideOne;


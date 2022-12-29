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
  
  return (
   <Container>
    <Section>
        <Question>Where do  you want to go?</Question>

        <Destinations></Destinations>
      </Section>
      <Section>
        <Question >What are your dates?</Question>
<Dates></Dates>
</Section>
    </Container>
  );
}


export default SlideOne;


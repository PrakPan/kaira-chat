import React, {useState, useEffect } from 'react';
import media from '../../../media';
 import Toggle from './Toggle'
import styled from 'styled-components';
 import Question from '../../Question';
const Container = styled.div`
color: black;
width: 100%;
display: flex;
gap: 0.5rem;
align-items: center;
  @media screen and (min-width: 768px){
 
}

`;

 
const StartingLocation = (props) =>{

  let isPageWide = media('(min-width: 768px)');
 
   
  return (
   <Container>
       <Question margin="0"> Starting Location</Question>
       <Toggle></Toggle>
    </Container>
  );
}


export default StartingLocation;


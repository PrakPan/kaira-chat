import React, {useState, useEffect } from 'react';
  
import media from '../../../media';
 
import styled from 'styled-components';
 import LocationsContainer from './LocationsContainer'

const Container = styled.div`
 
width: 100%;
 

 @media screen and (min-width: 768px){
 
}

`;

 
const Destinations = (props) => {

  let isPageWide = media('(min-width: 768px)');
  
  return (
   <Container>
    {/* <p className="font-opensans">Where do  you want to go?</p> */}
        <LocationsContainer>

        </LocationsContainer>

    </Container>
  );
}


export default Destinations;


import React, {useState, useEffect } from 'react';
  
import media from '../../../media';
 
import styled from 'styled-components';
 import LocationsContainer from './LocationsContainer'
import CitiesContainer from './CitiesContainer';
const Container = styled.div`
 
width: 100%;
 

 @media screen and (min-width: 768px){
 
}

`;

 
const Destinations = (props) => {

  let isPageWide = media('(min-width: 768px)');
  const [showCities, setShowCities] = useState(false);
  // const [selectedCities, setSelectedCities] = useState([]);
  return (
   <Container>
    {/* <p className="font-opensans">Where do  you want to go?</p> */}
        
        <CitiesContainer CITIES={props.CITIES} selectedCities={props.selectedCities} setSelectedCities={props.setSelectedCities}>

        </CitiesContainer> 

    </Container>
  );
}


export default Destinations;


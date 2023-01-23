import React, {useState, useEffect } from 'react';
  
import media from '../../../media';
 
import styled from 'styled-components';
//  import LocationsContainer from './LocationsContainer'
import CitiesContainer from './citiescontainer/CitiesContainer';
import SelectedDestination from './selecteddestination/Index';
const Container = styled.div`
 
width: 100%;
 
position: relative;;
 @media screen and (min-width: 768px){
 
}

`;

 
const Destinations = (props) => {

  let isPageWide = media('(min-width: 768px)');
  // const [showCities, setShowCities] = useState(false);
  // const [selectedCities, setSelectedCities] = useState([]);
  return (
   <Container>
    {/* <p className="font-opensans">Where do  you want to go?</p> */}
        <SelectedDestination selectedCities={props.selectedCities} destination={props.destination} CITIES={props.CITIES} openCities={() => props.setShowCities(true)} ></SelectedDestination>
        {props.showCities ? <CitiesContainer destination={props.destination} CITIES={props.CITIES} selectedCities={props.selectedCities} setSelectedCities={props.setSelectedCities}>

        </CitiesContainer>  : null}

    </Container>
  );
}


export default Destinations;


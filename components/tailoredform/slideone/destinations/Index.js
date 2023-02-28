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
  const [destinations, setDestinations] = useState(null);
  const _removeDestinationHandler= (dest) => {

    let dests = [];
    console.log(dest);
    for(var i = 0 ; i < destinations.length; i++){

    }
    // dest.push(
    //   <SelectedDestination selectedCities={props.selectedCities} destination={props.destination} CITIES={props.CITIES} openCities={() => props.setShowCities(true)} ></SelectedDestination>
    // )
    setDestinations(dest.slice());

   }
  useEffect(() => {
    setDestinations(
      [
        <SelectedDestination _removeDestinationHandler={_removeDestinationHandler} selectedCities={props.selectedCities} destination={props.destination} CITIES={props.CITIES} openCities={() => props.setShowCities(true)} ></SelectedDestination>

      ]
    )
   },[]);
  
   const _addDestinationHandler= () => {
    let dest = destinations.slice();
    dest.push(
      <SelectedDestination  _removeDestinationHandler={_removeDestinationHandler}  selectedCities={props.selectedCities} destination={props.destination} CITIES={props.CITIES} openCities={() => props.setShowCities(true)} ></SelectedDestination>
    )
    setDestinations(dest.slice());

   }
  
  return (
   <Container>
    {/* <p className="font-opensans">Where do  you want to go?</p> */}
    <SelectedDestination  startingLocation={props.startingLocation} setStartingLocation={props.setStartingLocation} showSearchStarting={props.showSearchStarting} 
            setShowSearchStarting={props.setShowSearchStarting} setShowCities={props.setShowCities} selectlocation selectedCities={props.selectedCities} destination={props.destination} CITIES={props.CITIES} openCities={() => props.setShowCities(true)} ></SelectedDestination>
        {
          destinations
        }
        {/* <SelectedDestination selectedCities={props.selectedCities} destination={props.destination} CITIES={props.CITIES} openCities={() => props.setShowCities(true)} ></SelectedDestination> */} 
        {!props.CITIES  ? <p onClick={_addDestinationHandler} className='text-center font-opensans hover-pointer' style={{color: '#1360D3', margin: '0.5rem', fontSize: '0.85rem'}}>+ Add Destination</p> :null}
        {props.showCities && props.CITIES ? <CitiesContainer top={destinations ? destinations.length === 1 ? '5.75rem' : (5.75+(3*(destinations.length-1)))+"rem" : '5.75rem'} children_cities={props.children_cities} setShowCities={props.setShowCities} destination={props.destination} CITIES={props.CITIES} selectedCities={props.selectedCities} setSelectedCities={props.setSelectedCities}>

        </CitiesContainer>  : null} 
        {/* <p className='font-opensans text-center hover-pointer' style={{fontSize: '0.85rem', color: '#1360D3'}}>+ Add More</p> */}

    </Container>
  );
}


export default Destinations;


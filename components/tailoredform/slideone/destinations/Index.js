 
import React, {useState} from 'react';
import media from '../../../media'; 
import styled from 'styled-components';
//  import LocationsContainer from './LocationsContainer'
import SelectedDestination from './selecteddestination/Index';
import {AiFillDelete} from 'react-icons/ai';

const Container = styled.div`
 
width: 100%;
 
position: relative;;
 @media screen and (min-width: 768px){
 
}

`;

 
const Destinations = (props) => {

  let isPageWide = media('(min-width: 768px)')

  const [destinations, setDestinations] = useState([<SelectedDestination inbox_id={0} selectedCities={props.selectedCities} destination={props.destination} CITIES={props.CITIES} openCities={() => props.setShowCities(true)} setDestination={props.setDestination} setSelectedCities={props.setSelectedCities}></SelectedDestination>]);
  function _removeDestinationHandler() {



destinations.pop()
props.selectedCities.pop()
props.setSelectedCities(props.selectedCities)    
setDestinations(destinations.slice());
   }
   const _addDestinationHandler= () => {
    let dest = destinations.slice();
    const id = destinations.length
    dest.push(
      <SelectedDestination inbox_id={id} destinations={destinations}  selectedCities={props.selectedCities} CITIES={props.CITIES} openCities={() => props.setShowCities(true)} setDestination={props.setDestination} setSelectedCities={props.setSelectedCities}></SelectedDestination>
    )
    setDestinations(dest.slice());

    props.selectedCities.push({...props.selectedCities[props.selectedCities.length-1],input_id : id })
    props.setSelectedCities(props.selectedCities)
   }


  return (
   <Container>
    {/* <p className="font-opensans">Where do  you want to go?</p> */}
    <SelectedDestination  startingLocation={props.startingLocation} setStartingLocation={props.setStartingLocation} showSearchStarting={props.showSearchStarting}
            setShowSearchStarting={props.setShowSearchStarting} setShowCities={props.setShowCities} selectlocation selectedCities={props.selectedCities} destination={props.destination} CITIES={props.CITIES} openCities={() => props.setShowCities(true)} setDestination={props.setDestination} setSelectedCities={props.setSelectedCities} ></SelectedDestination>
        {
          destinations
        }
        {/* <SelectedDestination selectedCities={props.selectedCities} destination={props.destination} CITIES={props.CITIES} openCities={() => props.setShowCities(true)} ></SelectedDestination> */} 
        
        <div style={{display : 'flex' , alignItems : 'center' , justifyContent : 'space-between' , marginLeft : '33%' , marginRight : '10px'}}>
        <p onClick={_addDestinationHandler} className='text-center font-opensans hover-pointer' style={{color: '#1360D3', margin: '0.5rem', fontSize: '0.85rem'}}>+ Add Destination</p>
        {destinations.length>1 && 
        <AiFillDelete onClick={()=>{_removeDestinationHandler()}} className='hover-pointer' style={{fontSize: '1rem', marginLeft: '2px', color: 'black'}} ></AiFillDelete>        
        }
        </div>
        
        
        {/* {props.showCities && props.CITIES ? <CitiesContainer
        setDestination={props.setDestination}
        top={destinations ? destinations.length === 1 ? '5.75rem' : (5.75+(3*(destinations.length-1)))+"rem" : '5.75rem'} children_cities={props.children_cities} setShowCities={props.setShowCities} destination={props.destination} CITIES={props.CITIES} selectedCities={props.selectedCities} setSelectedCities={props.setSelectedCities}>

        </CitiesContainer>  : null}  */}



        {/* <p className='font-opensans text-center hover-pointer' style={{fontSize: '0.85rem', color: '#1360D3'}}>+ Add More</p> */}

    </Container>
  );
}


export default Destinations;

 
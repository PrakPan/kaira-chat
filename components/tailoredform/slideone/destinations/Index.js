 
import React, {useEffect, useState} from 'react';
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
const [deletedId , setDeletedId] = useState(null)
const [updatedData , setUpdatedData] = useState({id : null , data : null})
  const [destinations, setDestinations] = useState([<SelectedDestination _updateDestinationHandler={_updateDestinationHandler} key={props.initialInputId} inbox_id={props.initialInputId} selectedCities={props.selectedCities} destination={props.destination} CITIES={props.CITIES} openCities={() => props.setShowCities(true)} setDestination={props.setDestination} setSelectedCities={props.setSelectedCities}></SelectedDestination>]);
  useEffect(()=>{
    if(deletedId){
      const newDestinations = destinations.filter(e=>e.props.inbox_id != deletedId)
      setDestinations(newDestinations.slice())
      const selected = props.selectedCities.filter((e)=>e.input_id != deletedId )
      props.setSelectedCities(selected.slice())
    }
  },[deletedId])

   const _addDestinationHandler= () => {
    let dest = destinations.slice();
    const id = Date.now()
    dest.push(
      <SelectedDestination _updateDestinationHandler={_updateDestinationHandler} setDeletedId={setDeletedId} key={id} inbox_id={id}  selectedCities={props.selectedCities} CITIES={props.CITIES} openCities={() => props.setShowCities(true)} setDestination={props.setDestination} setSelectedCities={props.setSelectedCities}></SelectedDestination>
    )
    setDestinations(dest.slice());
     props.selectedCities.push({input_id : id })
    props.setSelectedCities(props.selectedCities.slice())
   }

   function _updateDestinationHandler(id , data){
    setUpdatedData({id,data})
  }

   useEffect(()=>{
    if(updatedData.id){
      const selected = props.selectedCities.map(e=>{
        if(e.input_id == updatedData.id) return {input_id : updatedData.id,...updatedData.data , id : updatedData.data.resource_id}
        return e
      })
      props.setSelectedCities(selected)
    }
   },[updatedData.id])

  return (
   <Container>
    {/* <p className="font-lexend">Where do  you want to go?</p> */}
    <SelectedDestination startingLocation={props.startingLocation} setStartingLocation={props.setStartingLocation} showSearchStarting={props.showSearchStarting}
            setShowSearchStarting={props.setShowSearchStarting} setShowCities={props.setShowCities} selectlocation selectedCities={props.selectedCities} destination={props.destination} CITIES={props.CITIES} openCities={() => props.setShowCities(true)} setDestination={props.setDestination} setSelectedCities={props.setSelectedCities} ></SelectedDestination>
        {
          destinations.map(e=>e)
        }
        {/* <SelectedDestination selectedCities={props.selectedCities} destination={props.destination} CITIES={props.CITIES} openCities={() => props.setShowCities(true)} ></SelectedDestination> */} 
        
        <div style={{display : 'flex' , alignItems : 'center' , justifyContent : 'space-between' , marginLeft : '33%' , marginRight : '10px'}}>
        {!props.selectedCities.slice(1).some((e)=>!e.name) &&  <p onClick={_addDestinationHandler} className='text-center font-lexend hover-pointer' style={{color: '#1360D3', margin: '0.5rem', fontSize: '0.85rem'}}>+ Add Destination</p>}
        </div>
        
        
        {/* {props.showCities && props.CITIES ? <CitiesContainer
        setDestination={props.setDestination}
        top={destinations ? destinations.length === 1 ? '5.75rem' : (5.75+(3*(destinations.length-1)))+"rem" : '5.75rem'} children_cities={props.children_cities} setShowCities={props.setShowCities} destination={props.destination} CITIES={props.CITIES} selectedCities={props.selectedCities} setSelectedCities={props.setSelectedCities}>

        </CitiesContainer>  : null}  */}



        {/* <p className='font-lexend text-center hover-pointer' style={{fontSize: '0.85rem', color: '#1360D3'}}>+ Add More</p> */}

    </Container>
  );
}


export default Destinations;

 
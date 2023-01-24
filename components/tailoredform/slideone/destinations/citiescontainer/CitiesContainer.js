import React, {useState, useEffect } from 'react';
  
import media from '../../../../media';
 import Button from '../../../../ui/button/Index';
import styled from 'styled-components';
//  import ImageLoader from '../../../ImageLoader';
 import Location from './Destination';
// import Animate from '../../../HOC/'
 const AbsoluteContainer = styled.div`
 background-color: white;
 padding: 0.5rem;
position: absolute;
top: 5.5rem;
z-index: 10;
 `
 const LocationContainer = styled.div`
 padding: 0.25rem 0;
 width: 100%;

 max-width: 100%;
 
 display: grid;
 grid-template-columns: 1fr 1fr 1fr;
 grid-gap: 0.5rem ;
 &:hover{
     cursor: pointer;
 }
 
 `;


 
const LocationsContainer = (props) => {

  const [locationsJSX, setLocationsJSX] = useState([]);
  const [moreLocationsJSX, setMoreLocationJSX] = useState([]);
  const [showMore, setShowMore] = useState(false);

  let isPageWide = media('(min-width: 768px)');

  const _isCityAdded =  (city) => {
    // console.log('1', city);
    // var i;
    // console.log(props.selectedCities);
    for (var i = 0; i < props.selectedCities.length; i++) {
        if (props.selectedCities[i].id === city.id) {
            return true;
        }
    }
  
    return false;
  }

  const _handleClick = (city) => {
    // console.log(city)
    let is_city_added = _isCityAdded(city);
    // console.log(is_city_added)
    if(!is_city_added){
    let selected_cities = props.selectedCities.slice();
    selected_cities.push(city)
    props.setSelectedCities(selected_cities)
    }
    else {
      // console.log(props.selectedCities, city)
      let selected_cities =[];
      for(var i = 0 ; i < props.selectedCities.length; i++){
        if(props.selectedCities[i].id !== city.id)          selected_cities.push(props.selectedCities[i]);
        
        else {
          // selected_cities.push(city);
        }
      }
      props.setSelectedCities(selected_cities)

    }
  }
  useEffect(() => {
    let locations_JSX = [];
    let more_locations_JSX = [];
    for(var i = 0 ; i< props.CITIES.length; i++){
      if(i === 6) break;
      // console.log(props.CITIES[i], i)
      locations_JSX.push(
        <Location image={props.CITIES[i].image} text={props.CITIES[i].name} onclick={_handleClick} onclickparam={props.CITIES[i]} is_selected={_isCityAdded(props.CITIES[i])} ></Location>
      )
    }
    if(props.CITIES.length > 6){
      for(var j = 6; j < props.CITIES.length; j++){
          more_locations_JSX.push(
            <Location image={props.CITIES[j].image} text={props.CITIES[j].name} onclick={_handleClick} onclickparam={props.CITIES[j]} is_selected={_isCityAdded(props.CITIES[j])} ></Location>
          )
      }
    }
    setLocationsJSX(locations_JSX.slice());
    if(more_locations_JSX.length) setMoreLocationJSX(more_locations_JSX.slice());
  },[props.CITIES, props.selectedCities]);
  
  return (
    <AbsoluteContainer className='border'>
      <p style={{fontSize: '0.85rem', fontWeight: '600'}} className="font-opensans text-center">{"Cities around " + props.destination}</p>
    <LocationContainer  >
        
                {/* <Location image="" text="Port Blair" onclick={() => _handleClick(props.CITIES[0])} ></Location>
                <Location  image="" text="Niel Island"></Location>
                <Location  image="" text="Havelock"></Location>
                <Location image="" text="Ross Island"></Location>
                <Location  image="" text="Rajasthan"></Location>
                <Location  image="" text="Sikkim"></Location> */}
                {locationsJSX}
                {props.CITIES.length && showMore ? moreLocationsJSX : null}
   </LocationContainer>
   {props.CITIES.length > 6 && !showMore? <div className='font-opensans text-center hover-pointer' style={{fontSize: '0.75rem'}} onClick={() => setShowMore(!showMore)}>View All</div> : null}
   <div style={{display: 'flex', justifyContent: 'flex-end'}}><Button align="right" padding="0.5rem 2rem" fontWeight="600" margin="1rem 0 0 0" borderRadius="5px" borderWidth="0" bgColor="#f7e700"  onclick={() => props.setShowCities(false)}>
                {props.selectedCities ? props.selectedCities.length ? 'Continue' : 'Inspire Me' :'Inspire Me'}
                </Button></div>  
   </AbsoluteContainer>
  );
}


export default LocationsContainer;


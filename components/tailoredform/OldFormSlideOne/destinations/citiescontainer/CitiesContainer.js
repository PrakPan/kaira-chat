 
import React, {useState, useEffect, useRef } from 'react';
  
import media from '../../../../media';
 import Button from '../../../../ui/button/Index';
import styled from 'styled-components';
//  import ImageLoader from '../../../ImageLoader';
 import Location from './Destination';
 import NewLocation from './NewLocation'
 import { TbArrowBack } from 'react-icons/tb';
import Search from './search/Index';
// import Animate from '../../../HOC/'
 const AbsoluteContainer = styled.div`
 background-color: white;
 padding: 0.5rem;
position: absolute;
top: ${props => props.top};
width: 100%;
z-index: 10;
 `
 const LocationContainer = styled.div`
 padding: 0.25rem 0;
 width: 100%;

 max-width: 100%;
 
//  display: grid;
//  grid-template-columns: 1fr 1fr 1fr;
//  grid-gap: 0.5rem ;
 &:hover{
     cursor: pointer;
 }
 
 `;
 
const LocationsContainer = (props) => {

  const [locationsJSX, setLocationsJSX] = useState([]);
  const [moreLocationsJSX, setMoreLocationJSX] = useState([]);
  const [showMore, setShowMore] = useState(false);

  const [searchedLocationsJSX, setSearchedLocationJSX] = useState([]);

  let isPageWide = media('(min-width: 768px)');

  const _isCityAdded =  (city) => {
    if(city.id)
    for (var i = 0; i < props.selectedCities.length; i++) {
        if(props.selectedCities[i].id){
        if (props.selectedCities[i].id === city.id) {
            return true;
        }
        }
        else if(props.selectedCities[i].resource_id)
        if (props.selectedCities[i].resource_id=== city.id) {
          return true;
      }
    }
    else if(city.resource_id)
    for (var i = 0; i < props.selectedCities.length; i++) {
      if(props.selectedCities[i].id)
      {
      if (props.selectedCities[i].id === city.resource_id) {
          return true;
      }
    }
    else if(props.selectedCities[i].resource_id)
    if (props.selectedCities[i].resource_id === city.resource_id) {
      return true;
  }
  }
  
    return false;
  }

  const _handleClick = (city) => {
    // (props.selectedCities)
    let is_city_added = _isCityAdded(city);
    // (is_city_added)
    if(!is_city_added){
    let selected_cities = props.selectedCities.slice();
    selected_cities.push(city)
    props.setSelectedCities(selected_cities.slice())
    }
    else {
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

  const _handleClick2 = city =>{
    props.setSelectedCities([city])
  }


   useEffect(() => {
    // (props.selectedCities)
    try{
      if(!searchedLocationsJSX.length){
    let locations_JSX = [];
    let more_locations_JSX = [];
    for(var i = 0 ; i< props.CITIES.length; i++){
      // if(i === 6) break;
      locations_JSX.push(
        // <Location image={props.CITIES[i].image} text={props.CITIES[i].name} onclick={_handleClick} onclickparam={props.CITIES[i]} is_selected={_isCityAdded(props.CITIES[i])} ></Location>
      <NewLocation setShowCities={props.setShowCities} text={props.CITIES[i].name} onclick={_handleClick2} onclickparam={props.CITIES[i]} setDestination={props.setDestination} />
        )
    }
    if(props.children_cities){
      for(var k = 0 ; k <props.children_cities.length; k++){
        for(var l = 0 ; l < props.children_cities[k].locations.length ; l++){
          locations_JSX.push(
            // <Location image={props.children_cities[k].locations[l].image} text={props.children_cities[k].locations[l].name} onclick={_handleClick} onclickparam={props.children_cities[k].locations[l]} is_selected={_isCityAdded(props.children_cities[k].locations[l])} ></Location>
      <NewLocation text={props.CITIES[i].name} setShowCities={props.setShowCities} setDestination={props.setDestination} onclick={_handleClick2} onclickparam={props.CITIES[i]} />
         
            )
        }
      }
    }

  

    // if(props.CITIES.length > 6){
    //   for(var j = 6; j < props.CITIES.length; j++){
    //       more_locations_JSX.push(
    //         <Location image={props.CITIES[j].image} text={props.CITIES[j].name} onclick={_handleClick} onclickparam={props.CITIES[j]} is_selected={_isCityAdded(props.CITIES[j])}  ></Location>
    //       )
    //   }
    // }
    if(locations_JSX.length > 6) {
       setLocationsJSX(locations_JSX.slice(0,6));
      setMoreLocationJSX(locations_JSX.slice(6,undefined));
    }
    else{
      setLocationsJSX(locations_JSX.slice());
 
    }
    
    // setLocationsJSX(locations_JSX.slice());
    if(more_locations_JSX.length) setMoreLocationJSX(more_locations_JSX.slice());
  }
  else{
    let searched_locations = [];
    for(var i = 0 ; i < searchedLocationsJSX.length; i++){
        searched_locations.push(
          // <Location image={searchedLocationsJSX[i].props.image} text={searchedLocationsJSX[i].props.text} onclick={_handleClick} onclickparam={searchedLocationsJSX[i].props} is_selected={_isCityAdded(searchedLocationsJSX[i].props)} ></Location>
      <NewLocation text={props.CITIES[i].name} setShowCities={props.setShowCities} setDestination={props.setDestination} onclick={_handleClick} onclickparam={props.children_cities[k].locations[l]} />
        
          )
    }
    setSearchedLocationJSX(searched_locations.slice())
  }
  }
  catch{

  }
  },[props.CITIES, props.selectedCities]);

  const _showSearchedLocations = (results) => {
    let seaarchedlocationsarr = [];
    for(var i = 0 ; i < results.length; i++) {
      seaarchedlocationsarr.push(
        <Location image={results[i]["_source"].image} text={results[i]["_source"].name} onclick={_handleClick} onclickparam={results[i]["_source"]} is_selected={_isCityAdded(results[i]["_source"])} ></Location>

      )
    }
    setSearchedLocationJSX(seaarchedlocationsarr.slice())
  }

  return (
    <AbsoluteContainer className='border' top={props.top}>
      <TbArrowBack onClick={() => props.setShowCities(false)} className="hover-pointer" style={{ marginTop: '4px', fontSize: '1rem'}}></TbArrowBack>
      {/* <p style={{fontSize: '0.85rem', fontWeight: '600'}} className="font-lexend text-center">{props.destination ? "Cities around " + props.destination : "Top Locations"}</p> */}
      <p style={{fontSize: '0.85rem', fontWeight: '600'}} className="font-lexend text-center">Top Locations</p>
   {/* <Search _showSearchedLocations={_showSearchedLocations}></Search> */}
    <LocationContainer  >
      
                { !searchedLocationsJSX.length ?  locationsJSX.length ? locationsJSX : null : searchedLocationsJSX}
                { !searchedLocationsJSX.length ?  props.CITIES? props.CITIES.length && showMore ? moreLocationsJSX : null : null : null}
   </LocationContainer>
   {moreLocationsJSX.length && !showMore? <div className='font-lexend text-center hover-pointer' style={{fontSize: '0.75rem'}} onClick={() => setShowMore(!showMore)}>View All</div> : null}
   <div style={{display: 'flex', justifyContent: 'flex-end'}}><Button align="right" padding="0.5rem 2rem" fontWeight="600" margin="1rem 0 0 0" borderRadius="5px" borderWidth="0" bgColor="#f7e700"  onclick={() => props.setShowCities(false)}>
                {props.selectedCities ? props.selectedCities.length ? 'Continue' : 'Inspire Me' :'Inspire Me'}
                </Button></div>  
   </AbsoluteContainer>
  );
}


export default (LocationsContainer);
 
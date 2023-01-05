import React, {useState, useEffect } from 'react';
  
import media from '../../../media';
 
import styled from 'styled-components';
//  import ImageLoader from '../../../ImageLoader';
 import Location from './Destination';

 
 const LocationContainer = styled.div`
 padding: 0;
 
 max-width: 100%;
 
 display: grid;
 grid-template-columns: 1fr 1fr 1fr;
 grid-gap: 0.5rem ;
 &:hover{
     cursor: pointer;
 }
 
 `;
 
const LocationsContainer = (props) => {

  let isPageWide = media('(min-width: 768px)');
  
  return (
    <LocationContainer className='border-thi' >
                <Location image="" text="Andaman" onclick={() => props.setShowCities(true)}></Location>
                <Location  image="" text="Rajasthan" onclick={() => props.setShowCities(true)}></Location>
                <Location  image="" text="Sikkim" onclick={() => props.setShowCities(true)}></Location>
                <Location image="" text="Andaman" onclick={() => props.setShowCities(true)}></Location>
                <Location  image="" text="Rajasthan" onclick={() => props.setShowCities(true)}></Location>
                <Location  image="" text="Sikkim" onclick={() => props.setShowCities(true)}></Location>
   </LocationContainer>
  );
}


export default LocationsContainer;


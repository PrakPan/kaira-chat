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
                <Location image="" text="Port Blair"></Location>
                <Location  image="" text="Niel Island"></Location>
                <Location  image="" text="Havelock"></Location>
                <Location image="" text="Ross Island"></Location>
                <Location  image="" text="Rajasthan"></Location>
                <Location  image="" text="Sikkim"></Location>
   </LocationContainer>
  );
}


export default LocationsContainer;


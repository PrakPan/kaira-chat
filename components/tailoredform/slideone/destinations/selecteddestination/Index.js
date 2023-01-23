import React, {useState, useEffect } from 'react';
  
import media from '../../../../media';
 
import styled from 'styled-components';
import {MdOutlineLocationOn} from 'react-icons/md'
import {FiInfo} from 'react-icons/fi'
//  import LocationsContainer from './LocationsContainer'
const Container = styled.div`
 
width: 100%;
 display: flex;
justify-content: space-between;
align-items: center;
 @media screen and (min-width: 768px){
    padding: 0.35rem;
}

`;

const LeftContent = styled.div`
line-height: 1;
font-size: 0.85rem;
`;
const RightContainer = styled.div`
line-height: 1;
font-size: 0.85rem;
color: #1360D3;
`;

 
const SelectedDestination = (props) => {

  let isPageWide = media('(min-width: 768px)');
  
  return (
   <Container className='border font-opensans' style={{borderRadius: '10px'}}>
    <LeftContent>
        <MdOutlineLocationOn style={{lineHeight: '1', fontSize: '1.5rem'}}></MdOutlineLocationOn>
    {props.destination}

    </LeftContent>
    <RightContainer className='hover-pointer' >
        {props.selectedCities ? 
        props.selectedCities.length ? 
        <span>{'+ '+ props.selectedCities.length + " Cities Added"}</span>
        : 
        
        <span onClick={props.openCities}>{props.CITIES ? props.CITIES.length ? '+  Select Cities (' + props.CITIES.length + ")": ' + Select Cities' : ' + Select Cities'}</span>
        : 

        <span onClick={props.openCities}>{props.CITIES ? props.CITIES.length ? '+  Select Cities (' + props.CITIES.length + ")": ' + Select Cities' : ' + Select Cities'}</span>

    }
       
    <FiInfo style={{lineHeight: '1', fontSize: '1.25rem', color: 'black', marginLeft: '4px'}}></FiInfo>

    </RightContainer>
    </Container>
  );
}


export default SelectedDestination;


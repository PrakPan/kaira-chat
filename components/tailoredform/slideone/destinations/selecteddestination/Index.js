import React, {useState, useEffect } from 'react';
  
import media from '../../../../media';
 
import styled from 'styled-components';
import {MdOutlineLocationOn} from 'react-icons/md'
import {FiInfo} from 'react-icons/fi'
import {GrFormEdit} from 'react-icons/gr';
import SearchInputStarting from '../searchstarting/Input';
import SearchInput from '../search/Input';
//  import LocationsContainer from './LocationsContainer'
const Container = styled.div`
 margin-bottom: 0.25rem;
width: 100%;
 display: flex;
justify-content: space-between;
align-items: center;
 @media screen and (min-width: 768px){
    padding: 0.55rem  0.35rem;
}

`;

const LeftContent = styled.div`
line-height: 1;
font-size: 0.85rem;
display: flex;
align-items: center;
`;
const RightContainer = styled.div`
line-height: 1;
font-size: 0.85rem;
color: #1360D3;
`;

 
const SelectedDestination = (props) => {


  let isPageWide = media('(min-width: 768px)');
  const [showSearchStarting, setShowSearchStarting] = useState(false);
  const _handleShowSearchStarting = () => {
    setShowSearchStarting(true);

  }
  return (
   <Container className='border font-opensans' style={{borderRadius: '10px'}}>
    <LeftContent className='hover-pointer' onClick={props.selectlocation ? _handleShowSearchStarting : props.openCities}>
        <MdOutlineLocationOn style={{lineHeight: '1', fontSize: '1.5rem', color: props.selectlocation ? '#f7e700' : 'black'}}></MdOutlineLocationOn>
    {props.selectlocation ? !showSearchStarting ? 'Delhi' : <SearchInputStarting _handleShowSearchStarting={_handleShowSearchStarting} ></SearchInputStarting>: props.destination ? props.destination : <SearchInput></SearchInput>}
{props.selectlocation && !showSearchStarting ? <GrFormEdit className='hover-pointer' style={{fontSize: '1.25rem'}}></GrFormEdit> : null}
    </LeftContent>
    {!props.selectlocation ? <RightContainer className='hover-pointer' >
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
     : 
     <RightContainer className='hover-pointer' >
     
 <FiInfo style={{lineHeight: '1', fontSize: '1.25rem', color: 'black', marginLeft: '4px'}}></FiInfo>

 </RightContainer>
     }
    </Container>
  );
}


export default SelectedDestination;


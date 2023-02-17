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
padding: 0.55rem  0.35rem;

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
  // const [showSearchStarting, setShowSearchStarting] = useState(false);
  const _handleShowSearchStarting = () => {
     props.setShowSearchStarting(true);

  }
  const [focusLocation, setFocusLocation] = useState(false);
  const _handleFocus = () => {
    setFocusLocation(true);
    props.setShowSearchStarting(true);
    props.setShowCities(false)
  }
  return ( 
   <Container onClick={props.selectlocation ? props.showCities ?  () => props.setShowCities(false) : () => _handleShowSearchStarting() : props.openCities}  className=' font-opensans hover-pointer' style={{borderRadius: '8px', border: !focusLocation ? '1px solid #EFEFEF' : '1px solid black', boxShadow: '0px 3px 3px 0px rgba(0, 0, 0, 0.25)'}}>
    <LeftContent className='hover-pointer'>
        <MdOutlineLocationOn style={{lineHeight: '1', fontSize: '1.5rem', color: props.selectlocation ? '#f7e700' : 'black'}}></MdOutlineLocationOn>
    {props.selectlocation ? !props.showSearchStarting ? !props.startingLocation ?  'Delhi, IN'  : props.startingLocation.name : <SearchInputStarting  startingLocation={props.startingLocation}  setStartingLocation={props.setStartingLocation} onfocus={_handleFocus} onblur={() => setFocusLocation(false)} _handleShowSearchStarting={_handleShowSearchStarting} setShowSearchStarting={props.setShowSearchStarting} showSearchStarting={props.showSearchStarting} ></SearchInputStarting>: props.destination ? props.destination : <SearchInput ></SearchInput>}
{props.selectlocation && !props.showSearchStarting ? <GrFormEdit className='hover-pointer' style={{fontSize: '1.25rem', marginLeft: '2px'}}></GrFormEdit> : null}
    </LeftContent>
    {!props.selectlocation ? <RightContainer className='hover-pointer' >
        {props.selectedCities ? 
        props.selectedCities.length ? 
        <span>{'+ '+ props.selectedCities.length + " Cities Added"}</span>
        : 
        
        <span onClick={props.openCities}>{' + Select Cities'}</span>
        : 

        <span onClick={props.openCities}>{' + Select Cities'}</span>

    }
       
    {/* <FiInfo style={{lineHeight: '1', fontSize: '1.25rem', color: 'black', marginLeft: '6px', marginRight: '4px'}}></FiInfo> */}

    </RightContainer>
     : 
     <RightContainer className='hover-pointer' >
     
 {/* <FiInfo style={{lineHeight: '1', fontSize: '1.25rem', color: 'black', marginLeft: '4px',  marginRight: '4px'}}></FiInfo> */}

 </RightContainer>
     }
    </Container>
  );
}


export default SelectedDestination;


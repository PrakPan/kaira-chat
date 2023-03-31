
import React, {useState, useEffect } from 'react';
  
import media from '../../../../media';
 
import styled from 'styled-components';
import {MdOutlineLocationOn} from 'react-icons/md'
import {FiInfo} from 'react-icons/fi'
import {BsPencilFill} from 'react-icons/bs';
import SearchInputStarting from '../searchstarting/Input';
import SearchInput from '../search/Index';
import {BiTargetLock} from 'react-icons/bi';
import {AiFillDelete} from 'react-icons/ai';
//  import LocationsContainer from './LocationsContainer'
const Container = styled.div`
 margin-bottom: 0.25rem;
width: 100%;
 display: flex;
justify-content: space-between;
align-items: center;    
padding: 0.55rem  0.35rem;
background-color: white;
position : relative;
 @media screen and (min-width: 768px){
    padding: 0.55rem  0.55rem;
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

  const [searchFinalized, setSearchFinalized] = useState(false); 

  let isPageWide = media('(min-width: 768px)');
  // const [showSearchStarting, setShowSearchStarting] = useState(false);
  const _handleShowSearchStarting = () => {
     props.setShowSearchStarting(true);

  }
  const [focusLocation, setFocusLocation] = useState(false);
  const [focusSearch, setFocusSearch] = useState(null);
  const _handleFocusStarting = () => {
    setFocusLocation(true);
    props.setShowSearchStarting(true);
    props.setShowCities(false)
  }
  const _handleFocusSearch = () => {
    setFocusSearch(true);
    // props.setShowSearchStarting(true);
    // props.setShowCities(false)
  }

  const [showDestination , setShowDestination] = useState(true)




  return ( 
   <Container onClick={props.selectlocation ? props.showCities ?  () => props.setShowCities(false) : () => _handleShowSearchStarting() 
    // : props.openCities
  //  : setShowDestinationInput(!showDestinationInput)
  : ()=>{setShowDestination(false);_handleFocusSearch()}
   }  className=' font-opensans hover-pointer' style={{borderRadius: '8px', border: !focusLocation  && !focusSearch? '1px solid rgba(208, 213, 221, 1)' : '1px solid black',}}>
    <LeftContent className='hover-pointer'>
          {!props.selectlocation  ? 
                  <MdOutlineLocationOn style={{lineHeight: '1', fontSize: '1.5rem', marginRight: '10px'}}></MdOutlineLocationOn>
                  :
                  <BiTargetLock style={{lineHeight: '1', fontSize: '1.25rem' , marginRight: '13px'}}></BiTargetLock>


          }
        {/* <MdOutlineLocationOn style={{lineHeight: '1', fontSize: '1.5rem', color: props.selectlocation ? '#f7e700' : 'black'}}></MdOutlineLocationOn> */}
    {props.selectlocation ? 
          !props.showSearchStarting ? 
              !props.startingLocation ?  
              'Delhi, IN'  : 
          props.startingLocation.name : 
     <SearchInputStarting  startingLocation={props.startingLocation}  setStartingLocation={props.setStartingLocation} onfocus={_handleFocusStarting} onblur={() => {setFocusLocation(false) ; props.setShowSearchStarting(false) }} _handleShowSearchStarting={_handleShowSearchStarting} setShowSearchStarting={props.setShowSearchStarting} showSearchStarting={props.showSearchStarting} ></SearchInputStarting>
     :
     props.destination && showDestination
      ? props.destination : 
     <SearchInput setShowDestination={setShowDestination} showDestination={showDestination} destination={props.destination}setDestination={props.setDestination} inbox_id={props.inbox_id}  setSearchFinalized={setSearchFinalized} searchFinalized={searchFinalized} onfocus={_handleFocusSearch} onblur={() => {setFocusSearch(false) ; setShowDestination(true)}} setSelectedCities={props.setSelectedCities} selectedCities={props.selectedCities}></SearchInput>
     
     }
    
    </LeftContent>
    
    
    {!props.selectlocation ? 
    
    <RightContainer className='hover-pointer' >
        {/* {props.selectedCities ? 
        props.selectedCities.length ? 
        <span>{'+ '+ props.selectedCities.length + " Cities Added"}</span>
        : 
        props.CITIES || (searchFinalized) ? 
        <span onClick={props.openCities}>{' + Select Cities'}</span> 
        :
        null :
        props.CITIES || (searchFinalized) ? 
     
        <span onClick={props.openCities}>{' + Select Cities'}</span>
        : null
       
    } */}
    {/* Change Location */}
    <BsPencilFill className='hover-pointer' style={{fontSize: '1rem', marginLeft: '2px', color: 'black'}}></BsPencilFill> 
 
 
      {/* {props._removeDestinationHandler ? <AiFillDelete onClick={()=>props._removeDestinationHandler()} className='hover-pointer' style={{fontSize: '1rem', marginLeft: '2px', color: 'black'}} ></AiFillDelete> : null} */}

       
    {/* <FiInfo style={{lineHeight: '1', fontSize: '1.25rem', color: 'black', marginLeft: '6px', marginRight: '4px'}}></FiInfo> */}

    </RightContainer>
     : 
     
     <RightContainer className='hover-pointer' >
         <BsPencilFill className='hover-pointer' style={{fontSize: '1rem', marginLeft: '2px', color: 'black'}}></BsPencilFill> 

 {/* <FiInfo style={{lineHeight: '1', fontSize: '1.25rem', color: 'black', marginLeft: '4px',  marginRight: '4px'}}></FiInfo> */}

 </RightContainer>
     }
    </Container>
  );
}


export default SelectedDestination;


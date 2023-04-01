import React, {useState, useEffect } from 'react';
import {FaMapMarkerAlt}from 'react-icons/fa'
  
import media from '../../../../../media';
 
import styled from 'styled-components';
 
const Container = styled.div`
display : flex;
gap : 12px;
align-items : center;
// margin-bottom : 10px;
margin-block : 1rem;
border-radius : 50px;
&:hover{
    background : #F0F0F0;
}

`
const MarkerContainer= styled.div`
background : #dfdfdf;
border-radius : 100%;
padding : 10px;
padding-top : 10px;
`
const Text = styled.div`
font-weight : 500;
// margin-block : 5px;
p{
font-weight : 400;
margin-bottom : 0rem;
margin-top : 4px;
font-size : 12px;
color : #7e7e7e;
}
`


const Result = (props) => {

  let isPageWide = media('(min-width: 768px)');
 
  const _handleClick = (e) => {
    e.stopPropagation()
    props.setSearchFinalized({name: props.name, type: props.type});
    props.setDestination(props.name)
    props.selectedCities[props.inbox_id] = {...props.result , id : props.result.resource_id}
    props.setSelectedCities(props.selectedCities)
    props.setFocusSearch(false)
  }
  return (
    <Container className='font-poppins'  onClick={_handleClick}>
                {/* <div style={{fontWeight: '600'}}>{props.name}</div> */}
                {/* <div style={{flexGrow: '1', textAlign: 'right', fontWeight: '300'}}>{props.type}</div> */}

                <MarkerContainer>
            <FaMapMarkerAlt />
            </MarkerContainer>
            <Text>
              <div>{props.name}</div>
            <p>{props.result.parent}</p>            
            </Text>
           </Container>
  );
}


export default Result;


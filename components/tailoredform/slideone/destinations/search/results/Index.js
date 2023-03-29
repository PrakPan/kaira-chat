
import React, {useState, useEffect } from 'react';
  
import media from '../../../../../media';
import styled from 'styled-components';
import Result from './Result';
 const AbsoluteContainer = styled.div`
 background-color: white;
 padding: 0 0.5rem;
position: absolute;
top: ${props => props.top};
width: 100%;
left: 0;
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
 
const SearchResults = (props) => {

  useEffect(() => {
     document.body.addEventListener('click', ()=>props.setShowResults(false) );

     return ()=> {
      window.removeEventListener('click', ()=>props.setShowResults(false) );
  } 

  },[]);

  return (
    <AbsoluteContainer className='border' top={props.top}>{
      props.results.length ?
      props.results.map((result,i) => {
       if(i<5) return(
          <Result inbox_id={props.inbox_id} setDestination={props.setDestination} name={result["_source"].name} result={result['_source']} type={result["_source"].type} setSearchFinalized={props.setSearchFinalized} setSelectedCities={props.setSelectedCities} selectedCities={props.selectedCities}></Result>
        )
      })
      : null
    }
   </AbsoluteContainer>
  );
}


export default (SearchResults);


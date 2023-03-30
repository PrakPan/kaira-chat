
import React, {useState, useEffect } from 'react';
import SkeletonCard from '../../../../../ui/SkeletonCard'
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
 
 const skeleton = <div style={{display:'flex' , marginBlock:'1rem'}}>
        <SkeletonCard borderRadius='100%' width='52px' ml='1px'></SkeletonCard>
        <div>
        <SkeletonCard height='14px' ml='4px' width={'50%'} borderRadius={'2px'}></SkeletonCard>
        <SkeletonCard height='12px' ml='4px' mt='4px' width={'35%'} borderRadius={'2px'}></SkeletonCard>
        </div>
        </div>

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
        props.loading? skeleton :  <Result inbox_id={props.inbox_id} setDestination={props.setDestination} name={result["_source"].name} result={result['_source']} type={result["_source"].type} setSearchFinalized={props.setSearchFinalized} setSelectedCities={props.setSelectedCities} selectedCities={props.selectedCities}></Result>
        )
      })
      : null
    }
   
   </AbsoluteContainer>
  );
}


export default (SearchResults);


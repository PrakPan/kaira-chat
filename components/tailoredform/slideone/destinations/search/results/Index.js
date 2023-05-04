
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
z-index: 100;
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
 const Heading = styled.p`
   font-weight: 500;
   font-style: normal;
   font-size: 12px;
   line-height: 16px;
   display: flex;
   align-items: center;
   text-align: center;
   text-transform: uppercase;
   margin: 1rem;
   color: #7a7a7a;
   margin-left: 0.2rem;
 `;
 
 const skeleton = <div style={{display:'grid' ,gridTemplateColumns : '34px 1fr', gap : '12px', marginBlock:'1rem'}}>
        <SkeletonCard borderRadius='100%'></SkeletonCard>
        <div>
        <SkeletonCard height='14px' width={'70%'} borderRadius={'2px'}></SkeletonCard>
        <SkeletonCard height='12px' mt='4px' width={'45%'} borderRadius={'2px'}></SkeletonCard>
        </div>
        </div>

const SearchResults = (props) => {
  useEffect(() => {
     document.body.addEventListener('click', ()=>props.setShowResults(false) );

     return ()=> {
      document.body.removeEventListener('click', ()=>props.setShowResults(false) );
  } 
  },[]);

  if(props.loading) return <AbsoluteContainer className='border' top={props.top}>{[skeleton,skeleton,skeleton,skeleton,skeleton]}</AbsoluteContainer>
  return (
    <AbsoluteContainer
      className={props.results.length && "border"}
      top={props.top}
    >
      {props.hotLocations && props.results.length ? (
        <Heading className="font-lexend">POPULAR DESTINATIONS</Heading>
      ) : null}
      {props.results.length
        ? props.results.map((result, i) => {
            if (i < 5)
              return (
                <div key={i}>
                  <Result
                    _updateDestinationHandler={props._updateDestinationHandler}
                    setShowResults={props.setShowResults}
                    setFocusSearch={props.setFocusSearch}
                    inbox_id={props.inbox_id}
                    setDestination={props.setDestination}
                    name={result.name}
                    result={result}
                    type={result.type}
                    setSearchFinalized={props.setSearchFinalized}
                    setSelectedCities={props.setSelectedCities}
                    selectedCities={props.selectedCities}
                  ></Result>
                </div>
              );
          })
        : null}
    </AbsoluteContainer>
  );
}


export default (SearchResults);


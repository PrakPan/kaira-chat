import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
    import { getIndianPrice } from '../../../../services/getIndianPrice';
     
const Container = styled.div`
  
`;
const StrikedCost = styled.p`
position: relative;
 width: max-content; 
  flex-grow: 1;
 margin-bottom: 0;
 margin-right: 6px;
   font-weight: 400;
    font-size: 1.25rem;
    line-height: 1;
    text-align: center;
  &:before {
    position: absolute;
    content: '';
    left: 0;
    top: 23%;
    right: 0;
    border-top: 2px solid;
    border-color: inherit;
    -webkit-transform: skewY(-12deg);
    -moz-transform: skewY(-12deg);
    transform: skewY(-12deg);
  }

  @media screen and (min-width: 768px){
        font-size: 1rem;
        &:before {
            position: absolute;
            content: '';
            left: 0;
            top: 16%;
            right: 0;
            border-top: 2px solid;
            border-color: inherit;
            -webkit-transform: skewY(-12deg);
            -moz-transform: skewY(-12deg);
            transform: skewY(-12deg);
          }
    }
`;
const Text = styled.p`
    font-weight: 600;
    font-size: 1.25rem;
    text-align: right;
    width: max-content;
    line-height: 1;
 
     &:after{
        content: 'per person';
        margin-top: 0.25rem;
        font-size: 0.75rem !important;
        font-weight: 400;
        display: block;
        color: rgba(91, 89, 89, 1);
        text-decoration: none !important;

    }
    
    @media screen and (min-width: 768px){
        &:after{
            font-size: 0.85rem !important;
            text-decoration: none !important;

        }
    }
`;
const GITText = styled.p`
    font-weight: 600;
    font-size: 1.25rem;
    text-align: right;
    width: max-content;
    line-height: 1;
 
     &:after{
        content: 'per member';
        margin-top: 0.25rem;
        font-size: 0.75rem !important;
        font-weight: 400;
        display: block;
        color: rgba(91, 89, 89, 1);
        text-decoration: none !important;

    }
    
    @media screen and (min-width: 768px){
        &:after{
            font-size: 0.85rem !important;
            text-decoration: none !important;

        }
    }
`;

const Cost = (props) => {
  
 
    
    return(
        <Container className='center-di' >
           {props.starting_cost ? <div style={{display: 'flex', justifyContent: 'flex-end'}}><div style={{display: 'grid', gridTemplateColumns: 'max-content max-content', width: 'max-content'}}>
            {props.PW ? <StrikedCost> {"₹ "+getIndianPrice(Math.round(props.starting_cost/100)*2)}</StrikedCost> : null}
            <div style={{display: 'flex', justifyContent: 'flex-end'}}>
               {!props.PW ?  <Text className='font-opensans'>
           { "₹ "+getIndianPrice(Math.round(props.starting_cost/100))+"/-"}
            </Text> : <GITText className='font-opensans'>
           { "₹ "+getIndianPrice(Math.round(props.starting_cost/100))+"/-"}
            </GITText>}
            </div></div></div>: <div style={{display: 'flex', justifyContent: 'flex-end', visibility: 'hidden'}}><div style={{display: 'grid', gridTemplateColumns: 'max-content max-content', width: 'max-content'}}>
            {props.PW ? <StrikedCost> {"₹ 0"}</StrikedCost> : null}
            <div style={{display: 'flex', justifyContent: 'flex-end'}}>
               {!props.PW ?  <Text className='font-opensans'>
           { "₹ 0 /-"}
            </Text> : <GITText className='font-opensans'>
           { "₹ 0/-"}
            </GITText>}
            </div></div></div>}
        </Container>
    );
}
export default Cost;


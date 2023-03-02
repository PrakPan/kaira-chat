import styled from 'styled-components';
import { useState, useEffect } from 'react';
import Pin from './Pin';
 
const  Container = styled.div`
display: grid;
grid-template-columns: max-content auto;
`;
const Heading = styled.div`
    font-weight: 600;
    margin: 0 0 0 0.75rem;
    line-height: 24px;
    display: flex;
    align-items: center;
`;
 
const PinSection = (props) => {
   
    useEffect(() => {
      
    },[]);

    return(
        <Container>
            <Pin duration={props.duration}></Pin>
            <Heading>{props.duration ? props.location +  " ("+ props.duration+")": props.location }</Heading>
        </Container>
        
    );
 }

export default  PinSection;
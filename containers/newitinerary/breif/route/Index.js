import styled from 'styled-components';
import { useState, useEffect } from 'react';
import PinSection from './PinSection';
import MidSection from './MidSection';
  const Container = styled.div`
    margin-bottom: 1.5rem;
`;
const Heading = styled.p`
    font-size: 18px;
    font-weight: 600;
`;

const Route = (props) => {
   
    useEffect(() => {
      
    },[]);

    return(
        <Container>
             <Heading className='font-poppins'>Route</Heading>

             <PinSection location="Bangalore"></PinSection>
             <MidSection></MidSection>
             <PinSection location="Jaipur" duration="2 Nights"></PinSection>
             <MidSection></MidSection>
             <PinSection location="Jaisalmer" duration="4 Nights"></PinSection>
             <MidSection></MidSection>
             <PinSection location="Jodhour" duration="3 Nights"></PinSection>
             <MidSection></MidSection>
             <PinSection location="Bangalore"></PinSection>

        </Container>
        
    );
 }

export default Route;
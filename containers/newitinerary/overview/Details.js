import styled from 'styled-components';
import { useState, useEffect } from 'react';
import Button from '../../../components/ui/button/Index';
  const Container = styled.div`
    display: grid;
    grid-template-columns: auto auto auto auto auto;
    max-width: 100vw;
    overflow-x: hidden;
    grid-gap: 1rem;
`;

const Heading = styled.p`
    font-size: 12px;
    font-weight: 400;
    color: #7A7A7A;
    margin: 0;
    

`;
const Text = styled.p`
    font-size: 14px;
    font-weight: 500;
    margin: 0;

`;
const Details = (props) => {
   
    useEffect(() => {
      
    },[]);

    return(
        <Container className='font-poppins'>
               <div style={{width: 'max-content'}} >
                <Heading>Destination</Heading>
                <Text>Rajasthan</Text>
               </div>
               <div style={{width: 'max-content'}} >
                <Heading>Type of Travel</Heading>
                <Text>Adventure</Text>
               </div>
               <div style={{width: 'max-content'}} >
                <Heading>Group Type</Heading>
                <Text>Friends</Text>
               </div>
               <div style={{width: 'max-content'}} >
                <Heading>Duration</Heading>
                <Text>5 Nights</Text>
               </div>
               <div style={{width: 'max-content'}} >
                <Heading>Destination</Heading>
                <Text>Rajasthan</Text>
               </div>
        </Container>
        
    );
 }

export default Details;
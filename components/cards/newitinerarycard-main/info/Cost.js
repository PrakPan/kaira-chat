import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
      
     
const Container = styled.div`
  
`;
const Text = styled.p`
    font-weight: 600;
    font-size: 1.5rem;
    text-align: right;
    width: 100%;
     &:after{
        content: 'Price per person';
        font-size: 1rem;
        font-weight: 300;
        display: block;
        color: rgba(91, 89, 89, 1);
    }
`;
const Cost = (props) => {
  
 
    
    return(
        <Container className='center-div' >
           <Text className='font-opensans'>
           ₹ 5,400/-
            </Text>
        </Container>
    );
}
export default Cost;


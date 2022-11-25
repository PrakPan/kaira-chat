import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
    import { getIndianPrice } from '../../../../services/getIndianPrice';
     
const Container = styled.div`
  
`;
const Text = styled.p`
    font-weight: 600;
    font-size: 1.25rem;
    text-align: right;
    width: 100%;
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
const Cost = (props) => {
  
 
    
    return(
        <Container className='center-div' >
           <Text className='font-opensans'>
           { "₹ "+getIndianPrice(Math.round(props.starting_cost/100))+"/-"}
            </Text>
        </Container>
    );
}
export default Cost;


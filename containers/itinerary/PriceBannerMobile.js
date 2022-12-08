import React, {useEffect, useState} from 'react';
import styled from 'styled-components';


// import Button from '../../../components/Button';
import Button from '../../components/ui/button/Index';
import { getIndianPrice } from '../../services/getIndianPrice';


const FixedContainer = styled.div`
width: 100%;
color: white;
  position: sticky;
  top: 0;
  height: 66px;
  border-style: solid none none none;
  border-width: 1px;
  border-color: rgba(255,255,255,70%);
  z-index: 1000;
  display: flex;
  align-items: center;
  
    background-color: black;
    @media screen and (min-width: 768px){
    display: none;
    }
`;
const Container = styled.div`

`;
const CostContainer  = styled.div`


  position: absolute;
  right: 0;
  
  display: flex;
  flex-direction: row;
  z-index: 1000;
  align-items: center;

 
`;
const StrikedCost = styled.div`
text-decoration: line-through;
font-size: 0.75rem;
  &:before{
    margin-right: 0.5rem;
  content: 'Starting From';
  display: inline-block;
  text-align: right;
  line-height:1;
  font-weight: 300;
  font-size: 0.75rem;
  text-decoration: none !important;

}
`;
const Cost = styled.div`
text-align: right;
line-height:1.5;
font-weight: 800;
font-size: 1rem;
&:after{
  content: 'per person';
  display: block;
  font-size: 0.8rem;
  font-weight: 300;
}

`;
const DiscountContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 1rem;
`;

const Banner = (props) => {
  
    
   if(props.payment)
   return( 
    <FixedContainer>
      <CostContainer >
          {true ? <DiscountContainer>
           <Cost className='font-opensans'>{"₹ "+getIndianPrice(Math.round(props.payment.per_person_total_cost/100))+ " /-"}</Cost>
          </DiscountContainer> : null}
           <Button onclick={props.openBooking} hoverBgColor="white" hoverColor="black" bgColor="#F7e700" borderStyle="none" borderRadius="5px" margin="0 0.5rem 0 0" padding="0.25rem 1rem">Book Now</Button>
    </CostContainer> 
     
     </FixedContainer>
  );
  else return null;
   
}
 
export default React.memo(Banner);
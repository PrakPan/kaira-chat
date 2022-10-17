import React, {useEffect, useState} from 'react';
import styled from 'styled-components';


// import Button from '../../../components/Button';
import Button from '../../../components/ui/button/Index';
import { getIndianPrice } from '../../../services/getIndianPrice';
import ImageLoader from '../../../components/ImageLoader';

const FixedContainer = styled.div`
width: 100%;
color: white;
  position: sticky;
  bottom: 0;
  height: 66px;
  border-style: solid none none none;
  border-width: 1px;
  border-color: rgba(255,255,255,70%);
  z-index: 1000;
  display: flex;
  align-items: center;
  padding : 0 0.5rem;
    background-color: black;
    @media screen and (min-width: 768px){
    display: none;
    }
`;
const Container = styled.div`

`;
const CostContainer  = styled.div`
flex-grow: 1;

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

`;
const DiscountContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 0.5rem;
`;

const Banner = (props) => {
  
    
  //  if(props.payment)
  try{

   return( 
    <FixedContainer>
      <ImageLoader onclick={props.openWhatsapp} url="media/icons/bookings/whatsapp.svg" leftalign widthmobile="2rem" height="2rem"></ImageLoader>
      <CostContainer >
        <DiscountContainer>
           <Cost className='font-opensans'>{"₹ "+getIndianPrice(Math.round(props.payment.total_cost/100))+"/-"}</Cost>
          </DiscountContainer>
           <Button onclick={props.openBooking} hoverBgColor="white" hoverColor="black" bgColor="#F7e700" borderStyle="none" borderRadius="5px" margin="0 0.5rem 0 0" padding="0.25rem 1rem">Book Now</Button>
    </CostContainer> 
     
     </FixedContainer>
  );}
  catch{
    return(
      <FixedContainer>
      <ImageLoader onclick={props.openWhatsapp} url="media/icons/bookings/whatsapp.svg" leftalign widthmobile="2rem" height="2rem"></ImageLoader>
      <CostContainer >
       
           <Button onclick={props.openBooking} hoverBgColor="white" hoverColor="black" bgColor="#F7e700" borderStyle="none" borderRadius="5px" margin="0 0.5rem 0 0" padding="0.25rem 1rem">Book Now</Button>
    </CostContainer> 
     
     </FixedContainer>
    );
  }
  // else return null;
   
}
 
export default React.memo(Banner);
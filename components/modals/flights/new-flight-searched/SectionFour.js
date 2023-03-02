import React, { useState } from 'react';
import styled from 'styled-components';
import media from '../../../media';
import Button from '../../../ui/button/Index';
import FareRules from '../../farerules/Index';
 const Container = styled.div`
 margin: 0;
@media screen and (min-width: 768px){
   
    
}


`;
 const GridContainer=styled.div`
 display: grid;
grid-template-columns: 1fr 1fr;

 `;
const Section= (props) => {
    let isPageWide = media('(min-width: 768px)')
     const [showFareRules, setShowFareRules] = useState(false);
//    if(props.data)
    return(
      <Container className='font-opensans'>  
      <GridContainer>
            <Button fontSize="0.85rem" width="100%" borderStyle="solid solid none none" borderColor="rgba(222, 222, 222, 1)" borderWidth="1px" onclickparam={null} onclick={() => setShowFareRules(true)} borderRadius="0 0 0 10px">Fare Rules</Button>
            <Button fontSize="0.85rem" fontWeight="600" 
            onclick={props._updateBookingHandler}
            onclickparam={{
               booking_id: props.selectedBooking.id,
              itinerary_id: props.selectedBooking.itinerary_id,
              result_index: props.data.ResultIndex,
            }
            }  
             width="100%"borderRadius="0 0  10px 0" bgColor="#f7e700" borderStyle="solid none none none"  borderColor="rgba(222, 222, 222, 1)" borderWidth="1px"  >Select</Button>
            </GridContainer>
            <FareRules showFareRules={showFareRules} hide={() => setShowFareRules(false)}  result_index={props.data.ResultIndex}></FareRules>

      </Container>
  ); 
//   else return null;
}

export default Section;

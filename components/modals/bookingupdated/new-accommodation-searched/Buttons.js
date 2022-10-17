import React from 'react';
import styled from 'styled-components';
import media from '../../../media';
import Button from '../../../ui/button/Index';
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
  
     return(
      <Container className='font-opensans hidden-desktop'>  
      <GridContainer>
            <Button fontSize="0.85rem" fontWeight="600" onclick={()=> props.setShowDetails(true)} onclickparam={null} width="100%" borderRadius="0 0 0 10px" borderStyle="solid solid none none" borderColor="rgba(222, 222, 222, 1)" borderWidth="1px" >View Details</Button>
            {/* <Button fontSize="0.85rem" fontWeight="600" onclick={()=> console.log('')} onclickparam={null} width="100%" borderRadius="0 0 0 10px" borderStyle="solid solid none none" borderColor="rgba(222, 222, 222, 1)" borderWidth="1px" >View Details</Button> */}

            <Button 
              onclick={props._updateSearchedAccommodation}
              onclickparam={
                  {bookings: props.bookings,
                  new_booking: props.accommodation,
                  itinerary_id: props.itinerary_id,
                  tailored_id: props.tailored_id,
                  }}
            fontSize="0.85rem" fontWeight="600"   width="100%"borderRadius="0 0  10px 0" bgColor="#f7e700" borderStyle="solid none none none"  borderColor="rgba(222, 222, 222, 1)" borderWidth="1px" >Select</Button>
            </GridContainer>
      </Container>
  ); 
}

export default Section;

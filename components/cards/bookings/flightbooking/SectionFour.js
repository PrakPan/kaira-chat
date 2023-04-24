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
grid-template-columns: 1fr;

 `;
const Section= (props) => {
    let isPageWide = media('(min-width: 768px)')
  
//    if(props.data)
    return(
      <Container className='font-lexend'>  
      <GridContainer>
            {/* <Button width="100%" borderStyle="solid solid none none" borderColor="rgba(222, 222, 222, 1)" borderWidth="1px" onclickparam={null} onclick={() => console.log('test')} borderRadius="0 0 0 10px">View Details</Button> */}
            <Button width="100%" borderStyle="solid none none none"  borderColor="rgba(222, 222, 222, 1)" borderWidth="1px"  onclickparam={null} onclick={props.setShowFlightModal} borderRadius="0 0 10px 10px">{props.data.user_selected ? 'Change' : 'Search Flights'}</Button>
            </GridContainer>
      </Container>
  ); 
//   else return null;
}

export default Section;

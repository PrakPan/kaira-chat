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
grid-template-columns:  1fr;

 `;
const Section= (props) => {
    let isPageWide = media('(min-width: 768px)')
  
//    if(props.data)
    return(
      <Container className='font-opensans'>  
      <GridContainer>
            {/* <Button width="100%" borderRadius="0 0 0 10px" borderStyle="solid solid none none" borderColor="rgba(222, 222, 222, 1)" borderWidth="1px" onclickparam={null} onclick={() => console.log('test')}>View Details</Button> */}
            <Button width="100%" bgColor="black" color="white" borderRadius="0 0 10px 10px" borderStyle="solid none none none"  borderColor="rgba(222, 222, 222, 1)" borderWidth="1px"  onclickparam={null} onclick={() =>  console.log('')}>Selected</Button>
            </GridContainer>
      </Container>
  ); 
//   else return null;
}

export default Section;

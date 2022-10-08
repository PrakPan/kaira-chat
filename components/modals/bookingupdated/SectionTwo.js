import React from 'react';
import styled from 'styled-components';
// import media from '../../media';
import FiltersMobile from './filtersmobile/Index';

  const Container = styled.div`
 margin: 0;
@media screen and (min-width: 768px){
   
    
}


`;
  
const Section= (props) => {
    // let isPageWide = media('(min-width: 768px)')
    const FILTERS = {
        "budget": ["Low", "Mid", "High"],
        "type": ["Hotel", "Stay",]
    }
     return(
      <Container className='font-opensans'>  
            <FiltersMobile filters={FILTERS}></FiltersMobile>
      </Container>
  ); 
}

export default Section;

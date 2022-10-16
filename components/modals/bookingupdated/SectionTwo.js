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
    
     return(
      <Container className='font-opensans'>  
            <FiltersMobile _updateStarFilterHandler={props._updateStarFilterHandler}  _removeFilterHandler={props._removeFilterHandler}_addFilterHandler={props._addFilterHandler} filters={props.FILTERS}></FiltersMobile>
      </Container>
  ); 
}

export default Section;

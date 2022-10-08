import React from 'react';
import styled from 'styled-components';
// import media from '../../media';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft} from '@fortawesome/free-solid-svg-icons';

  const Container = styled.div`
 margin: 0;
@media screen and (min-width: 768px){
   
    
}


`;
  
const Section= (props) => {
    // let isPageWide = media('(min-width: 768px)')
  
     return(
      <Container className='font-opensans'>  
                   <FontAwesomeIcon className="hover-pointer" icon={faChevronLeft} onClick={props.setHideBookingModal} style={{margin: '0.5rem', position: 'sticky', top: '0'}} ></FontAwesomeIcon>

      </Container>
  ); 
}

export default Section;

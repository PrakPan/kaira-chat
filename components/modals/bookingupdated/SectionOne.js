import React from 'react';
import styled from 'styled-components';
// import media from '../../media';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faSearch} from '@fortawesome/free-solid-svg-icons';
import {TbArrowBack} from 'react-icons/tb';
  const Container = styled.div`
 margin: 0;
 display: flex;
 justify-content: space-between;
@media screen and (min-width: 768px){
   
    
}


`;
  
const Section= (props) => {
    // let isPageWide = media('(min-width: 768px)')
  
     return(
      <Container className='font-opensans'>  
      {/* <div></div> */}
                   <FontAwesomeIcon className="hover-pointer" icon={faChevronLeft} onClick={props.setHideBookingModal} style={{margin: '0.5rem', position: 'sticky', top: '0', visibility: 'hidden'}} ></FontAwesomeIcon>
                   <FontAwesomeIcon className="hover-pointer" icon={faSearch} onClick={props.setHideBookingModal} style={{margin: '0.5rem', position: 'sticky', top: '0', fontSize: '1.5rem'}} ></FontAwesomeIcon>
                   <TbArrowBack className="hover-pointer" icon={faChevronLeft} onClick={props.setHideBookingModal} style={{margin: '0.5rem', position: 'sticky', top: '0', fontSize: '1.75rem'}} ></TbArrowBack>

      </Container>
  ); 
}

export default Section;

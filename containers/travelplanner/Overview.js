import React, {useState, useRef, useEffect, createRef} from 'react';
import { useRouter } from 'next/router';
import 'bootstrap/dist/css/bootstrap.min.css';

import media from '../../components/media';
import * as ga from '../../services/ga/Index';

import styled from 'styled-components';
import ImageLoader from '../../components/ImageLoader';
import Heading from '../../components/newheading/heading/Index';
const Container = styled.div`
 
@media screen and (min-width: 768px){
 
    width: 90%;
    margin: auto;
    padding: 1rem 0;
}

`;
const GridContainer = styled.div`
    
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-row-gap: 2rem;

    @media screen and (min-width: 768px){
        width: 100%;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        margin: auto;
    }
`;
 
// const Heading = styled.div`
// font-size: 1.75rem;
// font-weight: 800;
 
// `;
const Text = styled.div`
font-size: 1rem;
font-weight: 300;
text-align: center;
@media screen and (min-width: 768px){
  text-align: left;

}
`;
const  Overview = (props) =>{

  let isPageWide = media('(min-width: 768px)');
  
  return (
   <Container>
      <Heading align="center" aligndesktop="left" margin={!isPageWide ? "2.5rem 0.5rem 1.5rem 0.5rem" : "2.55rem 0"}  bold>{props.overview_heading}</Heading>        
      <Text className='font-opensans'>{props.overview_text}</Text>      
      {/* <Row heading={props.overview_heading} top={!isPageWide ? '0' : "12vh"} padding="0 1rem">
            <InformationTextContainer
              type='text'
              text={props.overview_text} ></InformationTextContainer>
          </Row> */}
    </Container>
  );
}


export default Overview;


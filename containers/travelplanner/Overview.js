import React, {useState, useRef, useEffect, createRef} from 'react';
import { useRouter } from 'next/router';
import 'bootstrap/dist/css/bootstrap.min.css';

import media from '../../components/media';
import * as ga from '../../services/ga/Index';

import styled from 'styled-components';
import ImageLoader from '../../components/ImageLoader';
const Container = styled.div`
 
@media screen and (min-width: 768px){
    width: 60%;
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
 
const Heading = styled.div`
font-size: 1.75rem;
font-weight: 800;
text-align: center;

`;
const Text = styled.div`
font-size: 1rem;
font-weight: 300;
text-align: center;
`;
const  Overview = (props) =>{

  let isPageWide = media('(min-width: 768px)');
  
  return (
   <Container>
      <Heading className='font-opensans'>{props.overview_heading}</Heading>      
      <Text className='font-opensans'>{props.overview_text}</Text>      

    </Container>
  );
}


export default Overview;


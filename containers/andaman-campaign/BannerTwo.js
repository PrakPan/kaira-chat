import React, {useState, useRef, useEffect, createRef} from 'react';
import { useRouter } from 'next/router';
import 'bootstrap/dist/css/bootstrap.min.css';

import media from '../../components/media';
import * as ga from '../../services/ga/Index';

import styled from 'styled-components';
import ImageLoader from '../../components/ImageLoader';
import Enquiry from './newenquiry/Index';

const Container = styled.div`
 @media screen and (min-width: 768px){
    padding: 0;

}

`;
const GridContainer = styled.div`
    
    display: grid;
    grid-template-columns: 1.25fr 1fr;
    grid-row-gap: 2rem;

    @media screen and (min-width: 768px){
        width: 100%;
         margin: auto;
    }
`;
const Text = styled.p`
    font-weight: 400;
    margin: 1rem 0 0 0;
`;
const  Banner = (props) =>{

  let isPageWide = media('(min-width: 768px)');
  
  return (
   <Container>
        <GridContainer>
          <div className='center-div'>
            <ImageLoader width="80%" url="media/illustrations/undraw_stranded_traveler_pdbw.svg"></ImageLoader>
            </div>       
            <Enquiry></Enquiry>
        </GridContainer>
       
    </Container>
  );
}


export default Banner;


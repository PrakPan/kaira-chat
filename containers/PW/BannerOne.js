import React, {useState, useRef, useEffect, createRef} from 'react';
import { useRouter } from 'next/router';
import 'bootstrap/dist/css/bootstrap.min.css';

import media from '../../components/media';
import * as ga from '../../services/ga/Index';

import styled from 'styled-components';
import ImageLoader from '../../components/ImageLoader';
const Container = styled.div`
padding: 1rem 1rem;
background-color: white;
@media screen and (min-width: 768px){
    padding: 2rem 0;

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
const Text = styled.p`
    font-weight: 600;
    margin: 0.5rem 0 0 0;
    font-size: 8px;
    @media screen and (min-width: 768px){
        font-size: 1rem;
        margin: 1rem 0 0 0;

    }
`;
const  Banner = (props) =>{

  let isPageWide = media('(min-width: 768px)');
  
  return (
   <Container>
        <GridContainer>
            <div className='center-div'>
                <ImageLoader url="media/icons/usp/edit.svg" width="20%" widthmobile="35%"></ImageLoader>
                <Text className="text-center font-opensans">Customizable Trips</Text> 
            </div>
            <div className='center-div'>
                <ImageLoader url="media/icons/usp/family.svg" width="20%" widthmobile="35%"></ImageLoader>
                <Text className="text-center font-opensans">10000+ Customers</Text> 
            </div>
            <div className='center-div'>
                <ImageLoader url="media/icons/usp/customer-satisfaction.svg" width="20%" widthmobile="35%"></ImageLoader>
                <Text className="text-center font-opensans">4.9 / 5.0 Rating </Text> 
            </div>
            <div className='center-div'>
                <ImageLoader url="media/icons/usp/24-hours-support.svg" width="20%" widthmobile="35%"></ImageLoader>
                <Text className="text-center font-opensans">Live Support</Text> 
            </div>
          

        </GridContainer>
      
    </Container>
  );
}


export default Banner;


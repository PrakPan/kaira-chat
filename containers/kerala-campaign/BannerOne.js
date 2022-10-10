import React, {useState, useRef, useEffect, createRef} from 'react';
import { useRouter } from 'next/router';
import 'bootstrap/dist/css/bootstrap.min.css';

import media from '../../components/media';
import * as ga from '../../services/ga/Index';

import styled from 'styled-components';
import ImageLoader from '../../components/ImageLoader';
const Container = styled.div`
padding: 1.5rem 1rem;
background-color: rgba(247,231,0, 0.1);
@media screen and (min-width: 768px){
    padding: 2rem 0;

}

`;
const GridContainer = styled.div`
    
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-row-gap: 2rem;

    @media screen and (min-width: 768px){
        width: 100%;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
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
                <ImageLoader url="media/icons/campaign/customs.png" width="30%" widthmobile="30%"></ImageLoader>
                <Text className="text-center font-opensans">Fully Customizable</Text> 
            </div>
            <div className='center-div'>
                <ImageLoader url="media/icons/campaign/rating.png" width="30%" widthmobile="30%"></ImageLoader>
                <Text className="text-center font-opensans">1300+ Happy Customers</Text> 
            </div>
            <div className='center-div'>
                <ImageLoader url="media/icons/campaign/Ratings.png" width="30%" widthmobile="30%"></ImageLoader>
                <Text className="text-center font-opensans">4.9 / 5.0 Rating </Text> 
            </div>
            <div className='center-div'>
                <ImageLoader url="media/icons/campaign/Customer support.png" width="30%" widthmobile="30%"></ImageLoader>
                <Text className="text-center font-opensans">24x7 Customer Support</Text> 
            </div>
            <div className='center-div hidden-mobile'>
                <ImageLoader url="media/icons/campaign/Transparency.png" width="30%" widthmobile="30%"></ImageLoader>
                <Text className="text-center font-opensans">100% Transparency</Text> 
            </div>

        </GridContainer>
        <div className='center-div hidden-desktop' style={{marginTop: '1.5rem'}}>
                <ImageLoader url="media/icons/campaign/Transparency.png" width="15%" widthmobile="12.5%"></ImageLoader>
                <Text className="text-center font-opensans">100% Transparency</Text> 
            </div>
    </Container>
  );
}


export default Banner;


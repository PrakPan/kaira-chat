import React, {useState, useRef, useEffect, createRef} from 'react';
import { useRouter } from 'next/router';
import 'bootstrap/dist/css/bootstrap.min.css';

import media from '../../components/media';
import * as ga from '../../services/ga/Index';

import styled from 'styled-components';
import ImageLoader from '../../components/ImageLoader';
import Enquiry from '../../components/tailoredform/Index';
import HowItWorks from '../../components/containers/HowItWorksSlideshow';
const Container = styled.div`
 @media screen and (min-width: 768px){
    padding: 0;

}

`;
const GridContainer = styled.div`
    
    display: grid;

    grid-row-gap: 2rem;

    @media screen and (min-width: 768px){
        width: 100%;
         margin: auto;
         grid-template-columns: auto 400px;

         grid-column-gap: 2rem;
    }
`;
const Text = styled.p`
    font-weight: 400;
    margin: 1rem 0 0 0;
`;

const HowItWorksHeading = styled.p`
     font-weight: 600;
    margin: 1rem 0 0.5rem 0;
    @media screen and (min-width: 768px){
      font-size: 1.25rem;
      margin: 2rem 0 0.5rem 0;

    }
`;

const HowItWorksText = styled.p`
font-size: 1rem;
 width: 100%;
margin: 0 0;
font-weight: 300;

@media screen and (min-width: 768px){
  font-size: 1.25rem;
  font-weight: 300;
  margin: 0 0;

}
`;

const  Banner = (props) =>{

  const HowitWorksHeadingsArr=[
    <HowItWorksHeading className="font-opensans">You select</HowItWorksHeading>,
    <HowItWorksHeading className="font-opensans">We prepare</HowItWorksHeading>,
    <HowItWorksHeading className="font-opensans">You make memories</HowItWorksHeading>,
  ];
  const HowitWorksContentsArr = [
    <HowItWorksText className="font-opensans">A short trek, a long honeymoon, a workcation, or personalize your own</HowItWorksText>,
      <HowItWorksText  className="font-opensans">A completely personalized plan by our travel experts and software</HowItWorksText>,
    <HowItWorksText  className="font-opensans">Enough planning, time to travel and make unforgettable memories</HowItWorksText>
  
  ];


const howitworksimgs = ['media/website/whyus-1.webp', 'media/website/whyus-2.webp', 'media/website/whyus-3.webp']


  let isPageWide = media('(min-width: 768px)');
  
  return (
   <Container>
        <GridContainer>
          <div className='center-div'>
                    <HowItWorks nostart onclick={props._handleTailoredRedirect} images={howitworksimgs} content={HowitWorksContentsArr} headings={HowitWorksHeadingsArr}></HowItWorks>

            {/* <ImageLoader width="80%" url="media/illustrations/undraw_stranded_traveler_pdbw.svg"></ImageLoader> */}
            </div>       
            <div className='center-div hidden-mobile'><Enquiry page_id={props.page_id} destination={props.destination} cities={props.cities}></Enquiry></div>
        </GridContainer>
       
    </Container>
  );
}


export default Banner;


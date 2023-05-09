import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import media from '../../components/media';
import * as ga from '../../services/ga/Index';

import styled from 'styled-components';
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
    <HowItWorksHeading className="font-lexend">Select your preferences</HowItWorksHeading>,
    <HowItWorksHeading className="font-lexend">Let our AI plan your itinerary</HowItWorksHeading>,
    <HowItWorksHeading className="font-lexend">Easy Bookings with 24x7 Concierge</HowItWorksHeading>,
    <HowItWorksHeading className="font-lexend">No Commissions - Pay for what you get</HowItWorksHeading>,
  ];
  const HowitWorksContentsArr = [
    <HowItWorksText className="font-lexend">From solo travel to workcation, honeymoon to family travel, tell us about your mood, budget & timeline.</HowItWorksText>,
      <HowItWorksText  className="font-lexend">Get a unique itinerary completely personalized for you, with all bookings in one place.</HowItWorksText>,
    <HowItWorksText  className="font-lexend">From your stays to activities, book-it-all in one click, and enjoy 24x7 assistance while you explore.</HowItWorksText>,
    <HowItWorksText  className="font-lexend">We only take a small service fees for negotiated-bookings & live support.</HowItWorksText>
  
  ];


const howitworksimgs = ['media/website/whyus-1.webp', 'media/website/whyus-2.webp', 'media/website/whyus-3.webp','media/website/how4.png']


  let isPageWide = media('(min-width: 768px)');
  
  return (
    <Container>
      <GridContainer>
        <div className="">
          <HowItWorks
            nostart
            page_id={props.page_id}
            images={howitworksimgs}
            content={HowitWorksContentsArr}
            destination={props.destination}
            headings={HowitWorksHeadingsArr}
          ></HowItWorks>

          {/* <ImageLoader width="80%" url="media/illustrations/undraw_stranded_traveler_pdbw.svg"></ImageLoader> */}
        </div>
        {/* <div className='center-div hidden-mobile'><Enquiry page_id={props.page_id} destination={props.destination} cities={props.cities}></Enquiry></div> */}
      </GridContainer>
    </Container>
  );
}


export default Banner;


import React, {useState, useRef, useEffect, createRef} from 'react';
import { useRouter } from 'next/router';
import 'bootstrap/dist/css/bootstrap.min.css';
import styled, { keyframes } from 'styled-components';
import FullImage from '../../components/FullImage';
// import {connect} from 'react-redux';
import DesktopBanner from '../../components/containers/Banner';
import Experiences from '../../components/containers/Experiences';
  
 import AsSeenIn from '../testimonial/AsSeenIn';
 import Heading from '../../components/newheading/heading/Index';
  import HowItWorks from '../../components/containers/HowItWorksSlideshow';
// import howitworksimg1 from '../../public/assets/arts/whyus/1.webp';
// import howitworksimg2 from '../../public/assets/arts/whyus/2.webp';
// import howitworksimg3 from '../../public/assets/arts/whyus/3.webp';
import media from '../../components/media';
  import * as ga from '../../services/ga/Index';
 import BannerOne from './BannerOne';
 import BannerTwo from './BannerTwo';
 import WhyUs from '../testimonial/whyttw/Index';
 import ChatWithUs from '../../components/containers/ChatWithUs/ChatWithUs';
import FullImgContent from './FullImgContent';
import andamancontent from '../../public/content/campaigns/Andaman';
import Reviews from './CaseStudies/Index';
import BannerMobile from './MobileBanner';
import Enquiry from './newenquiry/Index';
const SetWidthContainer = styled.div`
width: 100%;
margin: auto;
@media screen and (min-width: 768px){
  width: 85%;
}
`;


const HowItWorksText = styled.p`
font-size: 1rem;
text-align: center;
width: 100%;
margin: 0 0;
font-weight: 300;

@media screen and (min-width: 768px){
  font-size: 1.25rem;
  font-weight: 300;
  margin: 0 0;

}
`;


const HowItWorksHeading = styled.p`
    text-align: center;
    font-weight: 600;
    margin: 1rem 0 0.5rem 0;
    @media screen and (min-width: 768px){
      font-size: 1.25rem;
      margin: 1rem 0 0.5rem 0;

    }
`;

const  Homepage = (props) =>{

  let isPageWide = media('(min-width: 768px)');
 

//JSX for How it works 

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


const router = useRouter()

const [desktopBannerLoading, setDesktopBannerLoading] = useState(false);

// const _handleExperiencesRedirect = (e) => {
//     router.push('/travel-experiences')
// }
const _handleTailoredRedirect = () => {
  router.push('/tailored-travel?search_text=Andaman')
}
const _handleTailoredClick = () => {
  setDesktopBannerLoading(true);
  setTimeout(_handleTailoredRedirect, 1000);

  ga.callback_event({
    action: 'TT-Desktopbanner',
    
    callback: _handleTailoredRedirect,
  })

}

  return (
    <div className={  "Homepage"  } id="homepage-anchor" style={{visibility: props.hidden ? 'hidden' : 'visible'}}>
      <FullImage url="media/website/Andaman.jpeg" center={isPageWide ? false : true} >
          <FullImgContent tagline="Explore different realities" text="Find an immersive experience or craft one for yourself"/>
      </FullImage>
      <div className='hidden-desktop'><Enquiry></Enquiry></div>
<BannerOne></BannerOne>
<SetWidthContainer>
      <Heading align="center" aligndesktop="left" margin={!isPageWide ? "2.5rem 0.5rem 1.5rem 0.5rem" : "5rem 0"}  bold>Top Selling Experiences</Heading>        
        <Experiences  three margin="2.5rem 0" experiences={andamancontent["Top Selling Experiences"]} ></Experiences>
        <Heading align="center" aligndesktop="left" margin={!isPageWide ? "2.5rem 0.5rem 1.5rem 0.5rem" : "5rem 0"}  bold>Customer Tales</Heading>        
        <Experiences  three margin="2.5rem 0" experiences={andamancontent["Customer Tales"]} pastitinerary></Experiences>

</SetWidthContainer>
    <DesktopBanner loading={desktopBannerLoading} onclick={_handleTailoredClick} text="Want to personalize your own experience?"></DesktopBanner>
      <SetWidthContainer>
         <Heading align="center" aligndesktop="center" margin={!isPageWide  ? "2.5rem 0.5rem" : "4rem"} thincaps >HOW IT WORKS?</Heading>
        <HowItWorks onclick={_handleTailoredRedirect} images={howitworksimgs} content={HowitWorksContentsArr} headings={HowitWorksHeadingsArr}></HowItWorks>
        <Heading align="center" aligndesktop="left" margin={!isPageWide ? "2.5rem 0.5rem 1.5rem 0.5rem" : "5rem 0"}  bold>What our customers say?</Heading>        
       <Reviews></Reviews>
        <Heading align="center" aligndesktop="left" margin={!isPageWide ? "2.5rem 0.5rem 1.5rem 0.5rem" : "5rem 0"}  bold>Unique Andaman</Heading>        
        <Experiences  three margin="2.5rem 0" experiences={andamancontent["Unique Andaman"]} ></Experiences>
        {/* <div className='hidden-desktop'><BannerMobile></BannerMobile></div>  */}
        </SetWidthContainer>
    <WhyUs></WhyUs>
{/*Add Banner*/}
  

   
    
  
 
      <SetWidthContainer>
      
        <AsSeenIn disablelinks></AsSeenIn>
        <div className='hidden-mobile'><BannerTwo></BannerTwo></div>

        <ChatWithUs></ChatWithUs>
      </SetWidthContainer>

 
    </div>
  );
}


export default Homepage;


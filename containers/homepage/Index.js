import React, {useState, useRef, useEffect, createRef} from 'react';
import { useRouter } from 'next/router';
import 'bootstrap/dist/css/bootstrap.min.css';
import styled, { keyframes } from 'styled-components';
import FullImage from '../../components/FullImage';
// import {connect} from 'react-redux';
import DesktopBanner from '../../components/containers/Banner';
import Experiences from '../../components/containers/Experiences';
// import Testimonials from '../../components/containers/Testimonials';
import ExperiencesBlog from '../../components/containers/ExperiencesBlog';

//  import Chatbot from '../../components/chatbot/Homepage';
// import ImageLoader from '../../components/ImageLoader';
import AsSeenIn from '../../containers/testimonial/AsSeenIn';
// import Heading from '../../components/newheading/heading/Index';
import Heading from '../../components/newheading/heading/Index';
import WhyUs from '../../components/containers/WhyUs';
import TravelStyles from '../../components/containers/TravelStyles';
import ChatWithUs from '../../components/containers/ChatWithUs/ChatWithUs';
import HowItWorks from '../../components/containers/HowItWorksSlideshow';
import Banner from './banner/Mobile';
import Locations from '../../components/containers/Locations';
import FullImgContent from './search/SearchFullImgContent';
// import FullImgContentChristmas from './search/Christmas';
import PersonaliseBox  from '../../components/containers/Personalise';
import Button from '../../components/ui/button/Index';
// import howitworksimg1 from '../../public/assets/arts/whyus/1.webp';
// import howitworksimg2 from '../../public/assets/arts/whyus/2.webp';
// import howitworksimg3 from '../../public/assets/arts/whyus/3.webp';
import media from '../../components/media';
import homepagecontent from '../../public/content/homepage';
import BannerOne from '../../components/banners/HomepageOne';
import BackgroundImageLoader from '../../components/BackgroundImageLoader';
import * as ga from '../../services/ga/Index';
import Spinner from '../../components/Spinner';
import urls from '../../services/urls';
import Snowflakes from '../../components/HOC/Snowflakes';
import Explorers from './Explorers';
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
  router.push('/tailored-travel')
}
const _handleTailoredClick = () => {
  setDesktopBannerLoading(true);
  setTimeout(_handleTailoredRedirect, 1000);

  ga.callback_event({
    action: 'TT-Desktopbanner',
    
    callback: _handleTailoredRedirect,
  })

}



const _handleExperiencesRedirect = () => {
  router.push(urls.travel_experiences.BASE)
}
const _handleExperiencesClick = () => {
  // setLoading(true);
  setTimeout(_handleExperiencesRedirect, 1000);

  ga.callback_event({
    action: 'TE-Travelstyles',
    
    callback: _handleTailoredRedirect,
  })

}
  return (
    
    <div className={  "Homepage"  } id="homepage-anchor" style={{visibility: props.hidden ? 'hidden' : 'visible'}}>
      {/* <Snowflakes></Snowflakes> */}
      <FullImage filter="linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.6))" fit="contain" center url="media/website/avi-theret-2u6eLolV1JY-unsplash.jpg" height="85vh" heightmobile="60vh" >
          <FullImgContent _handleTailoredClick={_handleTailoredClick} tagline="Explore different realities." text="Find an immersive experience or craft one yourself."/>
      </FullImage>
      {/* <div className='hidden-mobile'><Explorers></Explorers></div> */}
      <div style={{zIndex: '1', backgroundColor: 'white', position: 'relative'}}>

    <DesktopBanner loading={desktopBannerLoading} onclick={_handleTailoredClick} text="Want to personalize your own experience?"></DesktopBanner>
      <SetWidthContainer style={{paddingTop: !isPageWide? '2.5rem' : '5rem'}}>
      <Heading align="center" aligndesktop="left" margin={!isPageWide ? "0 0.5rem 1.5rem 0.5rem" : "0 0 5rem 0"}  bold>Top Destinations</Heading>        
      <Locations locations={homepagecontent["Top Locations"]} viewall></Locations>
      <Heading align="center" aligndesktop="left" margin={!isPageWide ? "2.5rem 0.5rem 1.5rem 0.5rem" : "5rem 0"}  bold>Best Sellers</Heading>        
        <ExperiencesBlog link='https://www.blog.thetarzanway.com/post/hidden-gems-of-ladakh' heading="Hidden Gems of Ladakh"  text="Well, Ladakh is often referred to as the Land of explorers, which is because this amazing place has several hidden treasures waiting to be explored." img="media/website/b80cd8_8fb69995b7024cf3981e779ee18602d6_mv2.webp" margin="2.5rem 0" experiences={homepagecontent["Recommended experiences"]} ></ExperiencesBlog>
        <Heading align="center" aligndesktop="center" margin={!isPageWide  ? "2.5rem 0.5rem" : "4rem"} thincaps >HOW IT WORKS?</Heading>
        <HowItWorks images={howitworksimgs} content={HowitWorksContentsArr} headings={HowitWorksHeadingsArr}></HowItWorks>
        <Heading align="center" aligndesktop="left" margin={!isPageWide ? "2.5rem 0.5rem 1.5rem 0.5rem" : "5rem auto"}  bold>Travel Tales</Heading>        
      <ExperiencesBlog link="https://www.blog.thetarzanway.com/post/14-must-do-tips-for-every-solo-woman-traveler-in-india" pastitinerary   heading={homepagecontent["14 MUST-DO Tips for every Solo Woman Traveler in India"].heading} text={homepagecontent["14 MUST-DO Tips for every Solo Woman Traveler in India"].text} img={homepagecontent["14 MUST-DO Tips for every Solo Woman Traveler in India"].image} margin="2.5rem 0" experiences={homepagecontent["Women's Day Specials"]} ></ExperiencesBlog>
      </SetWidthContainer>

      {/*Add travel traingle banner with 2 ctas*/}
   

      <SetWidthContainer>

        <Heading align="center" aligndesktop="left" margin={!isPageWide ? "2.5rem 0.5rem 1.5rem 0.5rem" : "5rem 0"}  bold>Work from home redefined</Heading>        
          <ExperiencesBlog link={homepagecontent["An Introduction to Workcation"].link} heading={homepagecontent["An Introduction to Workcation"].heading} text={homepagecontent["An Introduction to Workcation"].text} img={homepagecontent["An Introduction to Workcation"].image}   margin="1.5rem 0" experiences={homepagecontent["Work from home redefined"]}></ExperiencesBlog>
 
      
      </SetWidthContainer>

{/*Add Banner*/}
<div className='hidden-desktop'><PersonaliseBox ></PersonaliseBox ></div> 

      {/* <div style={{marginTop: '5rem', position: 'relative !important'}} className='hidden-mbile'>
        <ImageLoader width="100%" height="auto" url="media/website/banner without text@2x.png"></ImageLoader>

        <div style={{position: 'absolute', top: '0', left: '5%', height: '100%', maxWidth: '45%', display: 'flex', flexDirection: 'column', justifyContent: 'center'}} >
          <div style={{fontSize: '2.5rem', fontWeight: '800', marginBottom: '5vh'}} className='font-opensans'>Make your own travel cart</div>
          <Button link='/tailored-travel' borderRadius="2rem" borderWidth="2px" padding="0.5rem 2rem">Start Planning</Button>
        </div>
        </div> */}


      <SetWidthContainer>
      <Heading align="center" aligndesktop="left" margin={!isPageWide ? "2.5rem 0.5rem 1.5rem 0.5rem" : "5rem 0"}  bold>Travel with a purpose</Heading>        
        <Experiences  three margin="2.5rem 0" experiences={homepagecontent["Travel with a purpose"]} ></Experiences>
        <Heading align="center" aligndesktop="left" margin={!isPageWide ? "2.5rem 0.5rem 1.5rem 0.5rem" : '5rem 0'} bold>Live a different lifestyle</Heading>
        <ExperiencesBlog  page="testimonials" review heading={homepagecontent["Inidan Review"].name} text={homepagecontent["Inidan Review"].summary} img={homepagecontent["Inidan Review"].image} margin="2.5rem 0" experiences={homepagecontent["Live a different lifestyle"]} ></ExperiencesBlog>
      </SetWidthContainer>
    
      <Heading margin={!isPageWide? "1.5rem" : '5rem'} align="center" aligndesktop="center" bold>Why Us</Heading>
      <div style={{width: "90%", margin: "auto"}}><WhyUs></WhyUs></div>

      {/* <Testimonials margin="1.5rem 0"></Testimonials> */}

      <SetWidthContainer>
        <TravelStyles width={1200} height={900}/>
        <Button  onclick={_handleExperiencesClick} boxShadow hoverColor="white" hoverBgColor="black" borderWidth="2px"  margin="2.5rem auto 2.5rem auto" fontSizeDesktop="2rem" fontSizeMobile="1.25rem" padding="0.5rem 2rem">All Experiences</Button>    
       

        <AsSeenIn></AsSeenIn>
        <ChatWithUs></ChatWithUs>
      </SetWidthContainer>


      {/* <PersonaliseModal showPersonaliseModal={showPersonaliseModal} handlePersonaliseClose={handlePersonaliseClose} handlePersonaliseShow={handlePersonaliseShow}></PersonaliseModal> */}
      <div className='hidden-desktop'><Banner text="Want to craft your own travel experience?"  buttontext="Start Now" color="black" buttonbgcolor="#f7e700"></Banner></div>
      {/* <Chatbot history={props.history}/>     */}
      </div>
    </div>
  );
}

// const mapStateToPros = (state) => {
//   return{
//     auth: state.auth.authentication,
//     name: state.auth.userName
//   }
// }

// export default connect(mapStateToPros)(Homepage);
export default Homepage;


import React, {useState, useRef, useEffect, createRef} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
// import Footer from '../../components/footer/Index';
import styled from 'styled-components';
import FullImage from '../../components/FullImage';
  import Experiences from '../../components/containers/Experiences';
import Testimonials from '../../components/containers/Testimonials';
import ExperiencesBlog from '../../components/containers/ExperiencesBlog';
import media from '../../components/media';
import PersonaliseModal from '../../components/modals/Personalise';
import Chatbot from '../../components/chatbot/Homepage';
// import AsSeenIn from '../../pages/testimonial/AsSeenIn';
import Heading from '../../components/newheading/heading/Index';
import WhyUs from '../../components/containers/WhyUs';
import Banner from './banner/Mobile'; 
import FullImgContent from './FullImgContent';
import PersonaliseBox from '../../components/containers/Personalise';
 
import Blogs from '../../components/containers/Blogs';
import ladakhcontent from '../../public/content/ladakh';
import DesktopBanner from '../../components/containers/Banner';
import { useRouter } from 'next/router';
import urls from '../../services/urls';
const SetWidthContainer = styled.div`
width: 100%;
margin: auto;
@media screen and (min-width: 768px){
  width: 80%;
}
`;
const ContentContainer = styled.div`
@media screen and (min-width: 768px){
 
}
`;
const  Listings = (props) =>{
  let isPageWide = media('(min-width: 768px)')

     useEffect(() => {
    window.scrollTo(0,0);
    
  },[]);

  
const router = useRouter();

 
  
  const _handleTailoredRedirect = (e) => {
    localStorage.setItem('search_city_selected_id', 114)
    localStorage.setItem('search_city_selected_name', 'Leh, Ladakh')
    localStorage.setItem('search_city_selected_parent', 'Ladakh')

    router.push(urls.TAILORED_TRAVEL)
  }
  
  
  
     
  return (
    <div className="Homepage" id="homepage-anchor" >

      <FullImage center url="media/website/anuj-bansal-lXiUMjkh4B8-unsplash (1).jpg">
          <FullImgContent tagline="Ladakh" text=" Little Tibet from your eyes"/>
      </FullImage>
    <ContentContainer>
       
      <SetWidthContainer>
        
       <Heading align="center" aligndesktop="left" margin={!isPageWide ? "2.5rem 0.5rem 1.5rem 0.5rem"  : "3rem 0 5rem 0"} bold>Ladakh Tour Experiences</Heading>
       <ExperiencesBlog link='https://www.blog.thetarzanway.com/post/hidden-gems-of-ladakh' heading="Hidden Gems of Ladakh"  text="Well, Ladakh is often referred to as the Land of explorers, which is because this amazing place has several hidden treasures waiting to be explored." img="media/website/b80cd8_8fb69995b7024cf3981e779ee18602d6_mv2.webp" margin="2.5rem 0" experiences={ladakhcontent["Ladakh Tour Experiences"]} ></ExperiencesBlog>
        <Heading align="center" aligndesktop="left"   margin={!isPageWide  ? "2.5rem 0.5rem 1.5rem 0.5rem" : '5rem 0'} bold>Ladakh by our travelers</Heading>
          <Experiences  pastitinerary img="media/ruby/blog1.jpg"   margin="1.5rem 0" experiences={ladakhcontent["Ladakh by our travelers"]}></Experiences>
        <Heading id="experiences-workation" align="center" aligndesktop="left" margin={!isPageWide  ? "2.5rem 0.5rem 1.5rem 0.5rem" : "5rem auto"}  bold>Work and Vacation</Heading>        
        <Blogs cityblogs={ladakhcontent['Blogs']} margin="0"></Blogs> 
        <Heading align="center" aligndesktop="left"   margin={!isPageWide  ? "2.5rem 0.5rem 1.5rem 0.5rem" : '5rem 0'} bold>Our traveler's tales</Heading>
          <Experiences  pastitinerary img="media/ruby/blog1.jpg"   margin="1.5rem 0" experiences={ladakhcontent["Our traveler's tales"]}></Experiences>     
        </SetWidthContainer>
    
      

      <SetWidthContainer style={{paddingTop: !isPageWide  ? '1.5rem' : '5rem'}}>
        <div className='hidden-desktop'><PersonaliseBox></PersonaliseBox></div>
        <Heading margin={!isPageWide  ? "1.5rem" : '3rem'} align="center" aligndesktop="center" bold>Why Us</Heading>
        <div style={{width: "90%", margin: "auto"}}><WhyUs></WhyUs></div>
      </SetWidthContainer>
    
      </ContentContainer>
       <div className='hidden-desktop'><Banner onclick={_handleTailoredRedirect} ></Banner></div>
      <div className='hidden-mobile'><DesktopBanner onclick={_handleTailoredRedirect} text="Want to personalize your own experience?"></DesktopBanner></div>
 
    </div>
  );
}


export default Listings;

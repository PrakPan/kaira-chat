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
 import ChatWithUs from '../../components/containers/ChatWithUs/ChatWithUs';
 import Banner from '../homepage/banner/Mobile';
 
import FullImgContent from './FullImgContent';
import PersonaliseBox from '../../components/containers/Personalise';
// import Button from '../../components/Button';
 import homepagecontent from '../../public/content/homepage';
import experiencepagecontent from '../../public/content/experiencepage';
import Blogs from '../../components/containers/Blogs';

const SetWidthContainer = styled.div`
width: 100%;
margin: auto;
@media screen and (min-width: 768px){
  width: 80%;
}
`;
const ContentContainer = styled.div`
@media screen and (min-width: 768px){
margin-top: 5rem;
}
`;
const  Listings = (props) =>{
  let isPageWide = media('(min-width: 768px)')

  const volunteerRef = useRef(null)
  var Scroll   = require('react-scroll');
  var Element  = Scroll.Element;
  var scroller = Scroll.scroller;
  const [showBanner, setShowBanner] = useState(false);
  useEffect(() => {
    window.scrollTo(0,0);
    // window.addEventListener('scroll', event => handleScroll(event));
   
  },[]);

  
  const [showPersonaliseModal, setShowPersonaliseModal] = useState(false);
  const handlePersonaliseClose = () => setShowPersonaliseModal(false);
  const handlePersonaliseShow = () => { setShowPersonaliseModal(true); }

 
 
  let topexperiences =  null;
   if(typeof window != "undefined" ) 
  switch(localStorage.getItem('experience_filter')) {
    case 'Kasol':
      window.scrollTo(0,window.innerHeight*0.8)
      topexperiences=<div>
         <Heading align="center" aligndesktop="left" margin={!isPageWide  ? "2.5rem 0.5rem 1.5rem 0.5rem" : "5rem 0"}  bold>Kasol</Heading>        
       <Experiences    margin="1.5rem 0" experiences={experiencepagecontent["Kasol"]}></Experiences>
       <Blogs blogs={experiencepagecontent["Kasol Blogs"]} margin={isPageWide  ? "5rem 0" : "1.5rem 0"}></Blogs>
        </div>
      break;
    case 'Goa':
      window.scrollTo(0,window.innerHeight*0.8)
      topexperiences=<div>
          <Heading align="center" aligndesktop="left" margin={!isPageWide  ? "2.5rem 0.5rem 1.5rem 0.5rem" : "5rem 0"}  bold>Goa</Heading>        
       <Experiences link={experiencepagecontent["Goa Blog One"].link} heading={experiencepagecontent["Goa Blog One"].heading} text={experiencepagecontent["Goa Blog One"].text} img={experiencepagecontent["Goa Blog One"].image}   margin="1.5rem 0" experiences={experiencepagecontent["Goa"]}></Experiences>
       <Blogs blogs={experiencepagecontent["Goa Blogs"]} margin={isPageWide ? "5rem 0" : "1.5rem 0"}></Blogs>
      </div>
      break;
    case 'Rishikesh':
      window.scrollTo(0,window.innerHeight*0.8)

    topexperiences=<div>
       <Heading align="center" aligndesktop="left" margin={!isPageWide ? "2.5rem 0.5rem 1.5rem 0.5rem" : "5rem 0"}  bold>Rishikesh</Heading>        
       <Experiences    margin="1.5rem 0" experiences={experiencepagecontent["Rishikesh"]}></Experiences>
       <Blogs blogs={experiencepagecontent["Rishikesh Blogs"]} margin={isPageWide  ? "5rem 0" : "1.5rem 0"}></Blogs>
    </div>
  break;
  case 'Manali':
    window.scrollTo(0,window.innerHeight*0.8)

    topexperiences=<div>
       <Heading align="center" aligndesktop="left" margin={ !isPageWide  ? "2.5rem 0.5rem 1.5rem 0.5rem" : "5rem 0"}  bold>Manali</Heading>        
       <ExperiencesBlog link={experiencepagecontent["Manali Blog One"].link} heading={experiencepagecontent["Manali Blog One"].heading} text={experiencepagecontent["Manali Blog One"].text} img={experiencepagecontent["Manali Blog One"].image}   margin="1.5rem 0" experiences={experiencepagecontent["Manali"]}></ExperiencesBlog>
       <Blogs blogs={experiencepagecontent["Manali Blogs"]} margin={isPageWide  ? "5rem 0" : "1.5rem 0"}></Blogs>

    </div>
    break;
  case 'Faces Of India':
    window.scrollTo(0,window.innerHeight*0.8)

    topexperiences=<div>
      <Heading align="center" aligndesktop="left" margin={!isPageWide  ? "2.5rem 0.5rem 1.5rem 0.5rem" : '5rem 0'} bold>Travel in Style</Heading>
        <ExperiencesBlog  page="testimonials" heading={experiencepagecontent["Indian Review"].name}  text={experiencepagecontent["Indian Review"].summary} img={experiencepagecontent["Indian Review"].image} margin="2.5rem 0" experiences={homepagecontent["Live a different lifestyle"]} ></ExperiencesBlog>
      </div>
      break;

  case 'Volunteer & Travel':
    window.scrollTo(0,window.innerHeight*0.8)

    topexperiences = <div>
      <Heading id="experiences-volunteer" align="center" aligndesktop="left"   margin={!isPageWide  ? "2.5rem 0.5rem 1.5rem 0.5rem" : '5rem 0'} bold>Travel and Volunteer</Heading>
        <ExperiencesBlog link={experiencepagecontent["Volunteering in The Land of Gods: Uttarakhand"].link} heading={experiencepagecontent["Volunteering in The Land of Gods: Uttarakhand"].heading} text={experiencepagecontent["Volunteering in The Land of Gods: Uttarakhand"].text} img={experiencepagecontent["Volunteering in The Land of Gods: Uttarakhand"].image}   margin="1.5rem 0" experiences={experiencepagecontent["Travel and Volunteer"]}></ExperiencesBlog>
      </div>
      break; 
      case 'Travel & Learn': 
      window.scrollTo(0,window.innerHeight*0.8)

      topexperiences = <div>
         <Heading id="experiences-workation" align="center" aligndesktop="left" margin={!isPageWide  ? "2.5rem 0.5rem 1.5rem 0.5rem" : "5rem 0"}  bold>Work and Vacation</Heading>        
        <ExperiencesBlog link={experiencepagecontent["Why is now the best time to head on a workation?"].link} heading={experiencepagecontent["Why is now the best time to head on a workation?"].heading}  text={experiencepagecontent["Why is now the best time to head on a workation?"].text}  img={experiencepagecontent["Why is now the best time to head on a workation?"].image} margin="2.5rem 0" experiences={experiencepagecontent["Work and Vacation"]}  ></ExperiencesBlog>
        </div>
    default:
  }
  return (
    <div className="Homepage" id="homepage-anchor" >

      <FullImage center url="media/website/ezgif.com-gif-maker.webp">
          <FullImgContent tagline="Experiences" text="We've created and curated unique programs for adventure seekers, cultural enthusiasts and anyone who's willing to try something different."/>
      </FullImage>
    <ContentContainer>
      <SetWidthContainer>
        {topexperiences}
      </SetWidthContainer>
      <SetWidthContainer>
        {/* <Heading align="center" aligndesktop="center" margin={!isPageWide ? "2.5rem 0.5rem 1.5rem 0.5rem" : '5rem'}  bold>Locations for you</Heading> */}
        {/* <Locations locations={experiencepagecontent["Top Locations"]}></Locations> */}
       <Heading align="center" aligndesktop="left" margin={!isPageWide ? "2.5rem 0.5rem 1.5rem 0.5rem"  : "5rem 0"} bold>Our Top Picks</Heading>
        <ExperiencesBlog page="covid-19-safe-travel-India"  heading="Our COVID-19 safety guidelines"  text="We care about your safety which is why we are ready with all precautionary measures to provide a seamless experience." img="media/ruby/blog1.jpg" margin="2.5rem 0" experiences={experiencepagecontent["Our Top Picks"]} ></ExperiencesBlog>
        <Heading align="center" aligndesktop="left"   margin={!isPageWide  ? "2.5rem 0.5rem 1.5rem 0.5rem" : '5rem 0'} bold>Weekend Getaway</Heading>
          <Experiences   img="media/ruby/blog1.jpg"   margin="1.5rem 0" experiences={experiencepagecontent["Weekend Getaway"]}></Experiences>
        <Heading id="experiences-workation" align="center" aligndesktop="left" margin={!isPageWide  ? "2.5rem 0.5rem 1.5rem 0.5rem" : "5rem 0"}  bold>Work and Vacation</Heading>        
        <ExperiencesBlog link={experiencepagecontent["Why is now the best time to head on a workation?"].link} heading={experiencepagecontent["Why is now the best time to head on a workation?"].heading}  text={experiencepagecontent["Why is now the best time to head on a workation?"].text}  img={experiencepagecontent["Why is now the best time to head on a workation?"].image} margin="2.5rem 0" experiences={experiencepagecontent["Work and Vacation"]}  ></ExperiencesBlog>
      </SetWidthContainer>
      

      <SetWidthContainer>
        <Heading align="center" aligndesktop="left" margin={!isPageWide  ? "2.5rem 0.5rem 1.5rem 0.5rem" : '5rem 0'} bold>Live a different lifestyle</Heading>
        <ExperiencesBlog  page="testimonials" heading={experiencepagecontent["Indian Review"].name}  text={experiencepagecontent["Indian Review"].summary} img={experiencepagecontent["Indian Review"].image} margin="2.5rem 0" experiences={homepagecontent["Live a different lifestyle"]} ></ExperiencesBlog>
        <Element name="experiences-volunteer-el"></Element>
        <Heading id="experiences-volunteer" align="center" aligndesktop="left"   margin={!isPageWide  ? "2.5rem 0.5rem 1.5rem 0.5rem" : '5rem 0'} bold>Travel and Volunteer</Heading>
        <ExperiencesBlog link={experiencepagecontent["Volunteering in The Land of Gods: Uttarakhand"].link} heading={experiencepagecontent["Volunteering in The Land of Gods: Uttarakhand"].heading} text={experiencepagecontent["Volunteering in The Land of Gods: Uttarakhand"].text} img={experiencepagecontent["Volunteering in The Land of Gods: Uttarakhand"].image}   margin="1.5rem 0" experiences={experiencepagecontent["Travel and Volunteer"]}></ExperiencesBlog>
        <Heading align="center" aligndesktop="left" margin={!isPageWide  ? "2.5rem 0.5rem 1.5rem 0.5rem" : "5rem 0"}  bold>Kasol</Heading>        
       <Experiences    margin="1.5rem 0" experiences={experiencepagecontent["Kasol"]}></Experiences>
       <br></br>
       <Blogs blogs={experiencepagecontent["Kasol Blogs"]} margin={isPageWide  ? "5rem 0" : "1.5rem 0"}></Blogs>
       <Heading align="center" aligndesktop="left" margin={!isPageWide  ? "2.5rem 0.5rem 1.5rem 0.5rem" : "5rem 0"}  bold>Goa</Heading>        
       <Experiences link={experiencepagecontent["Goa Blog One"].link} heading={experiencepagecontent["Goa Blog One"].heading} text={experiencepagecontent["Goa Blog One"].text} img={experiencepagecontent["Goa Blog One"].image}   margin="1.5rem 0" experiences={experiencepagecontent["Goa"]}></Experiences>
       <br></br>

       <Blogs blogs={experiencepagecontent["Goa Blogs"]} margin={isPageWide ? "5rem 0" : "1.5rem 0"}></Blogs>
       <Heading align="center" aligndesktop="left" margin={!isPageWide ? "2.5rem 0.5rem 1.5rem 0.5rem" : "5rem 0"}  bold>Rishikesh</Heading>        
       <ExperiencesBlog link={experiencepagecontent["Rishikesh Blog One"].link} heading={experiencepagecontent["Rishikesh Blog One"].heading} text={experiencepagecontent["Rishikesh Blog One"].text} img={experiencepagecontent["Rishikesh Blog One"].image}   margin="1.5rem 0" experiences={experiencepagecontent["Travel and Volunteer"]}></ExperiencesBlog>
       <br></br>

       <Blogs blogs={experiencepagecontent["Rishikesh Blogs"]} margin={isPageWide  ? "5rem 0" : "1.5rem 0"}></Blogs>
       <Heading align="center" aligndesktop="left" margin={ !isPageWide  ? "2.5rem 0.5rem 1.5rem 0.5rem" : "5rem 0"}  bold>Manali</Heading>        
       <ExperiencesBlog link={experiencepagecontent["Manali Blog One"].link} heading={experiencepagecontent["Manali Blog One"].heading} text={experiencepagecontent["Manali Blog One"].text} img={experiencepagecontent["Manali Blog One"].image}   margin="1.5rem 0" experiences={experiencepagecontent["Manali"]}></ExperiencesBlog>
       <br></br>

       <Blogs blogs={experiencepagecontent["Manali Blogs"]} margin={isPageWide  ? "5rem 0" : "1.5rem 0"}></Blogs>

      </SetWidthContainer>
  
      

      <SetWidthContainer style={{paddingTop: !isPageWide  ? '1.5rem' : '5rem'}}>
        <div className='hidden-desktop'><PersonaliseBox></PersonaliseBox></div>
        <Heading margin={!isPageWide  ? "1.5rem" : '5rem'} align="center" aligndesktop="center" bold>Why Us</Heading>
        <div style={{width: "90%", margin: "auto"}}><WhyUs></WhyUs></div>
      </SetWidthContainer>
      <Testimonials></Testimonials>
      <SetWidthContainer>
      <ChatWithUs></ChatWithUs>

      </SetWidthContainer>
      </ContentContainer>
      <PersonaliseModal showPersonaliseModal={showPersonaliseModal} handlePersonaliseClose={handlePersonaliseClose} handlePersonaliseShow={handlePersonaliseShow}></PersonaliseModal>
      <div className='hidden-desktop'><Banner ></Banner></div>
      {/* <Chatbot/> */}
    </div>
  );
}


export default Listings;

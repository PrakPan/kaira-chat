import React, {useState, useEffect} from 'react';
import { useRouter } from 'next/router';
import 'bootstrap/dist/css/bootstrap.min.css';
import styled, { keyframes } from 'styled-components';
import FullImage from '../../components/FullImage';
// import {connect} from 'react-redux';
import DesktopBanner from '../../components/containers/Banner';
import Experiences from '../../components/containers/Experiences';
// import Testimonials from '../../components/containers/Testimonials';
import ExperiencesBlog from '../../components/containers/ExperiencesBlog';
import axiomyplansinstance from '../../services/sales/MyPlans';

//  import Chatbot from '../../components/chatbot/Homepage';
// import ImageLoader from '../../components/ImageLoader';
import AsSeenIn from '../../containers/testimonial/AsSeenIn';
// import Heading from '../../components/newheading/heading/Index';
import Heading from '../../components/newheading/heading/Index';
import TravelStyles from '../../components/containers/TravelStyles';
import ChatWithUs from '../../components/containers/ChatWithUs/ChatWithUs';
import HowItWorks from '../../components/containers/HowItWorksSlideshow';
import Banner from './banner/Mobile';
import Locations from '../../components/containers/plannerlocations/Index';
import FullImgContent from './search/SearchFullImgContent';
// import FullImgContentChristmas from './search/Christmas';
import PersonaliseBox  from '../../components/containers/Personalise';
import Button from '../../components/ui/button/Index';
// import howitworksimg1 from '../../public/assets/arts/whyus/1.webp';
// import howitworksimg2 from '../../public/assets/arts/whyus/2.webp';
// import howitworksimg3 from '../../public/assets/arts/whyus/3.webp';
import media from '../../components/media';
   import * as ga from '../../services/ga/Index';
 import urls from '../../services/urls';
  import PLANNER_PAGES from '../../public/content/planner';
  import CaseStudies from '../travelplanner/CaseStudies/Index';
import WhatsappFloating from '../../components/WhatsappFloating';
import PlanAsPerTheme from './PlanAsPerTheme';
import PlanWithUs from '../../components/WhyPlanWithUs/Index';
import TailoredFormMobileModal from '../../components/modals/TailoredFomrMobile';
import HeroBanner from '../../components/containers/HeroBanner/HeroBanner';
const SetWidthContainer = styled.div`
width: 100%;
margin: auto;
@media screen and (min-width: 768px){
  width: 85%;
}
`;


const HowItWorksText = styled.p`
font-size: 1rem;
 width: 100%;
margin: 0 0;
font-weight: 300;

@media screen and (min-width: 768px){
  font-size: 1rem;
  margin: 0 0;
  font-weight: 300;

}
`;


const HowItWorksHeading = styled.p`
     font-weight: 600;
    margin: 1rem 0 0.5rem 0;
    @media screen and (min-width: 768px){
      font-size: 1.25rem;
      margin: 1rem 0 0.5rem 0;

    }
`;
const HowItWorksContainer = styled.div`
@media screen and (min-width: 768px){
   margin: auto;
}
`;

const  Homepage = (props) =>{
  const [myPlansArr, setMyPlansArr] = useState([]);
  const [plansLoading, setPlansLoading ] = useState(false);
  const [plansCount, setPlansCount] = useState(null);
const [showMoiblePlanner, setShowMobilePlanner] = useState(false);

  let isPageWide = media('(min-width: 768px)');
  useEffect(() => {
    
    if(props.token){
const MyPlans = JSON.parse(localStorage.getItem('MyPlans'))
if(MyPlans && MyPlans.access_token === props.token){
setMyPlansArr(MyPlans.plans)
setPlansCount(MyPlans.count)
setPlansLoading(false)
}
else{
  axiomyplansinstance.get("?limit=3&offset=0", {headers: {
    'Authorization': `Bearer ${props.token}`
    }}).then(res => {
        let plansarr = [];

        for(var i=0 ; i<res.data.results.length; i++){
             plansarr.push(
                res.data.results[i]
            );
          
        }
        setMyPlansArr(plansarr.slice());
        localStorage.setItem('MyPlans' , JSON.stringify({plans : plansarr , count : res.data.count , access_token : props.token}))
        setPlansCount(res.data.count);
        setPlansLoading(false);
    }).catch(err => {
        setPlansLoading(false);
    })
  }
}
 
 },[props.token]);

//JSX for How it works 
const HowitWorksHeadingsArr=[

  <HowItWorksHeading className="font-lexend">Select your preferences</HowItWorksHeading>,

  <HowItWorksHeading className="font-lexend">Let our AI plan your itinerary</HowItWorksHeading>,

  <HowItWorksHeading className="font-lexend">Easy Bookings with 24x7 Concierge</HowItWorksHeading>,

  <HowItWorksHeading className="font-lexend">No Commissions - <br/> Pay for what you get</HowItWorksHeading>,

];

const HowitWorksContentsArr = [

  <HowItWorksText className="font-lexend">From solo travel to workcation, honeymoon to family travel, tell us about your mood, budget & timeline.</HowItWorksText>,

    <HowItWorksText  className="font-lexend">Get a unique itinerary completely personalized for you, with all bookings in one place.</HowItWorksText>,

  <HowItWorksText  className="font-lexend">From your stays to activities, book-it-all in one click, and enjoy 24x7 assistance while you explore.</HowItWorksText>,

  <HowItWorksText  className="font-lexend">We only take a small service fees for negotiated-bookings & live support.</HowItWorksText>



];





const howitworksimgs = ['media/website/whyus-1.webp', 'media/website/whyus-2.webp', 'media/website/whyus-3.webp','media/website/how4.png']


const router = useRouter()
const [desktopBannerLoading, setDesktopBannerLoading] = useState(false);
const [experienceMore,setExperieceMore] = useState(false)

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
  //  setTimeout(_handleExperiencesRedirect, 1000);

  // ga.callback_event({
  //   action: 'TE-Travelstyles',
    
  //   callback: _handleTailoredRedirect,
  // })
  _handleExperiencesRedirect();

}
const [escapeState, setEscapeState]=useState(false)
useEffect(() => {
 setEscapeState(true)
},[]);
  return (
    
    <div className={  "Homepage font-lexend" } id="homepage-anchor" style={{visibility: props.hidden ? 'hidden' : 'visible'}}>
      {/* <Snowflakes></Snowflakes> */}
   
      {/* <FullImage filter="linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.6))" fit="contain" center url="media/website/Home (1).png" height="85vh" heightmobile="60vh" >
       <FullImgContent _handleTailoredClick={_handleTailoredClick} tagline="Explore different realities." text="Find an immersive experience or craft one yourself."/>
      </FullImage> */}

      <HeroBanner
                   image={isPageWide?'media/website/homepage-herobanner.jpg' :'media/website/homepage-banner-mobile.png'}
                   destinationType={'city-planner'}
                   title={<p>Travel planning a chore,<br/>
                   Let our AI Explore.</p>}
                  _startPlanningFunction={()=>setShowMobilePlanner(true)}
                 />


       <div style={{zIndex: '1', backgroundColor: 'white', position: 'relative'}}>

    <DesktopBanner loading={desktopBannerLoading} onclick={_handleTailoredClick} text="Want to personalize your own experience?"></DesktopBanner>

    <SetWidthContainer>
    <Heading textAlign='left' bold noline  fontSize={isPageWide?'32px':'24px'} align="center" aligndesktop="left" margin={!isPageWide ? "2.5rem 0.5rem 3.5rem 0.5rem" : "3rem 0"} >How it works?</Heading>        
    <HowItWorksContainer><HowItWorks images={howitworksimgs} content={HowitWorksContentsArr} headings={HowitWorksHeadingsArr}></HowItWorks></HowItWorksContainer>
    
    {props.token && myPlansArr.length && plansCount? 
              <Heading  noline fontSize={isPageWide?'32px':'24px'} align="center" aligndesktop="left" margin={!isPageWide ? "2.5rem 0.5rem 1.5rem 0.5rem" : "3rem 0 2rem 0"}  bold>{"My Trips ("+plansCount+")"}</Heading>        
: null
            }
            {
              props.token && myPlansArr.length ? 
              <>
              <Experiences  margin="2.5rem 0" experiences={myPlansArr} ></Experiences>
             <Button  link='/dashboard'  onclickparams={null} borderWidth="1px" fontSizeDesktop="12px" fontWeight="500" borderRadius="6px" margin="1.5rem auto" padding="0.5rem 2rem" >View All</Button>
              
              </>
: null
            }

    </SetWidthContainer>
   

      <SetWidthContainer style={{}}>
      {props.locations && props.locations.length ?<><Heading  noline textAlign='left' fontSize={isPageWide?'32px':'24px'} align="center" aligndesktop="left" margin={!isPageWide ? "2.5rem 0.5rem 1.5rem 0.5rem" : "3rem 0 2rem 0"}  bold>Plan as per the best destinations</Heading>
       <Locations locations={props.locations} viewall></Locations></> : null}

      {
        props.ThemeData && props.ThemeData.length ? <>
      <Heading noline textAlign='left' fontSize={isPageWide?'32px':'24px'} align="center" aligndesktop="left" margin={!isPageWide ? "2.5rem 0.5rem 1.5rem 0.5rem" : "3rem 0 2rem 0"}  bold>Plan your trip as per theme</Heading>
      <PlanAsPerTheme ThemeData={props.ThemeData} />  
        </> : null
      }
      
      <Heading noline textAlign='left' fontSize={isPageWide?'32px':'24px'} align="center" aligndesktop="left" margin={!isPageWide ? "2.5rem 0.5rem 1.5rem 0.5rem" : "3rem 0 2rem 0"}  bold>Why plan with us?</Heading>
      <PlanWithUs />




         <Heading  noline textAlign='left' fontSize={isPageWide?'32px':'24px'} align="center" aligndesktop="left" margin={!isPageWide ? "2.5rem 0.5rem 1.5rem 0.5rem" : "3rem 0 2rem 0"}  bold>Our happy customers say about us </Heading>        
         <CaseStudies></CaseStudies>


      

      </SetWidthContainer>

    
 

 {!isPageWide && <div><PersonaliseBox ></PersonaliseBox ></div>} 
      <SetWidthContainer>

      {/* <Heading    align="center" aligndesktop="left" margin={!isPageWide ? "2.5rem 0.5rem 1.5rem 0.5rem" : "3rem 0 5rem 0"}  bold>Travel with a purpose</Heading>         */}
         {/* <Heading align="center" aligndesktop="left" margin={!isPageWide ? "2.5rem 0.5rem 1.5rem 0.5rem" : '5rem 0'} bold>Live a different lifestyle</Heading> */}
       </SetWidthContainer>
     
      {/* <Testimonials margin="1.5rem 0"></Testimonials> */}


            <br></br>
      {/* <PersonaliseModal showPersonaliseModal={showPersonaliseModal} handlePersonaliseClose={handlePersonaliseClose} handlePersonaliseShow={handlePersonaliseShow}></PersonaliseModal> */}
     {!isPageWide &&  <div><Banner onclick={()=>setShowMobilePlanner(true)} text="Want to craft your own travel experience?"  buttontext="Start Now" color="black" buttonbgcolor="#f7e700"></Banner></div>}
      {/* <Chatbot history={props.history}/>     */}
      </div>
      <TailoredFormMobileModal
        destinationType={'city-planner'}
          onHide={() => setShowMobilePlanner(false)}
          show={showMoiblePlanner}
        ></TailoredFormMobileModal>
      <WhatsappFloating message="Hey, I need help planning my trip." />
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


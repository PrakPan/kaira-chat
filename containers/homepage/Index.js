<<<<<<< HEAD
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
import Locations from '../../components/containers/plannerlocations/Index';
import FullImgContent from './search/FormFullImg';
// import FullImgContentChristmas from './search/Christmas';
import PersonaliseBox  from '../../components/containers/Personalise';
import Button from '../../components/ui/button/Index';
// import howitworksimg1 from '../../public/assets/arts/whyus/1.webp';
// import howitworksimg2 from '../../public/assets/arts/whyus/2.webp';
// import howitworksimg3 from '../../public/assets/arts/whyus/3.webp';
import media from '../../components/media';
import homepagecontent from '../../public/content/homepage';
  import * as ga from '../../services/ga/Index';
 import urls from '../../services/urls';
  import PLANNER_PAGES from '../../public/content/planner';
  import axiomyplansinstance from '../../services/sales/MyPlans';
  import CaseStudies from '../travelplanner/CaseStudies/Index';
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
  width: 60%;
  margin: auto;
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

const [myPlansArr, setMyPlansArr] = useState([]);
const [plansLoading, setPlansLoading ] = useState(false);
const [plansCount, setPlansCount] = useState(null);
useEffect(() => {
   if(props.token){
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
          console.log('d', res.data.count)
          setPlansCount(res.data.count);
          setPlansLoading(false);
      }).catch(err => {
          setPlansLoading(false);

      })
    }
  
},[props.token]);
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
  //  setTimeout(_handleExperiencesRedirect, 1000);

  // ga.callback_event({
  //   action: 'TE-Travelstyles',
    
  //   callback: _handleTailoredRedirect,
  // })
  _handleExperiencesRedirect();

}
  return (
    
    <div className={  "Homepage"  } id="homepage-anchor" style={{visibility: props.hidden ? 'hidden' : 'visible'}}>
      {/* <Snowflakes></Snowflakes> */}
      <FullImage filter="linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.6))" fit="contain"  url="media/website/Home (1).png" height="85vh" heightmobile="60vh" >

      {/* <FullImage filter="linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.6))"   url="media/website/Home (1).png" > */}
      <FullImgContent _handleTailoredClick={_handleTailoredClick} tagline="Craft personalized travel plans with AI in seconds" text="Find an immersive experience or craft one yourself."/>
      </FullImage>
      {/* <div className='hidden-mobile'><Explorers></Explorers></div> */}
      <div style={{zIndex: '1', backgroundColor: 'white', position: 'relative'}}>

    <DesktopBanner loading={desktopBannerLoading} onclick={_handleTailoredClick} text="Want to personalize your own experience?"></DesktopBanner>
      <SetWidthContainer style={{paddingTop: !isPageWide? '2.5rem' : '5rem'}}>
        {props.token && myPlansArr.length && plansCount? 
              <Heading  noline fontSize="32px" align="center" aligndesktop="left" margin={!isPageWide ? "2.5rem 0.5rem 1.5rem 0.5rem" : "3rem 0 2rem 0"}  bold>{"My Trips ("+plansCount+")"}</Heading>        
: null
            }
            {
              props.token && myPlansArr.length ? 
              <>
              <Experiences  margin="2.5rem 0" experiences={myPlansArr} ></Experiences>
             <Button  link='/dashboard'  onclickparams={null} borderWidth="1px" fontSizeDesktop="12px" fontWeight="600" borderRadius="6px" margin="1.5rem auto" padding="0.5rem 2rem" >View All</Button>
              
              </>
: null
            }
            
      <Heading  noline fontSize="32px" align="center" aligndesktop="left" margin={!isPageWide ? "2.5rem 0.5rem 1.5rem 0.5rem" : "3rem 0 2rem 0"}  bold>Top Destinations</Heading>        

      {/* <Heading   align="center" aligndesktop="left" margin={!isPageWide ? "0 0.5rem 1.5rem 0.5rem" : "0 0 5rem 0"}  bold>Top Destinations</Heading>         */}
      <Locations locations={PLANNER_PAGES} viewall></Locations>
      <Heading  noline fontSize="32px" align="center" aligndesktop="left" margin={!isPageWide ? "2.5rem 0.5rem 1.5rem 0.5rem" : "3rem 0 2rem 0"}  bold>Unique</Heading>        

      {/* <Heading  align="center" aligndesktop="left" margin={!isPageWide ? "2.5rem 0.5rem 1.5rem 0.5rem" : "3rem 0 5rem 0"}  bold>Unique</Heading>         */}
        <Experiences link='https://www.blog.thetarzanway.com/post/hidden-gems-of-ladakh' heading="Hidden Gems of Ladakh"  text="Well, Ladakh is often referred to as the Land of explorers, which is because this amazing place has several hidden treasures waiting to be explored." img="media/website/b80cd8_8fb69995b7024cf3981e779ee18602d6_mv2.webp" margin="2.5rem 0" experiences={homepagecontent["Recommended experiences"]} ></Experiences>
        <Heading bold noline  fontSize="32px" align="center" aligndesktop="center" margin={!isPageWide ? "2.5rem 0.5rem 1.5rem 0.5rem" : "3rem"} >How it works?</Heading>        

        {/* <Heading fontSize="32px" align="center" aligndesktop="center" margin={!isPageWide  ? "2.5rem 0.5rem" : "4rem"} bold noline >How it works?</Heading> */}
        <HowItWorksContainer><HowItWorks images={howitworksimgs} content={HowitWorksContentsArr} headings={HowitWorksHeadingsArr}></HowItWorks></HowItWorksContainer>
        <Heading  noline fontSize="32px" align="center" aligndesktop="left" margin={!isPageWide ? "2.5rem 0.5rem 1.5rem 0.5rem" : "3rem 0 2rem 0"}  bold>Travel Tales</Heading>        
      {/* <ExperiencesBlog link="https://www.blog.thetarzanway.com/post/14-must-do-tips-for-every-solo-woman-traveler-in-india" pastitinerary   heading={homepagecontent["14 MUST-DO Tips for every Solo Woman Traveler in India"].heading} text={homepagecontent["14 MUST-DO Tips for every Solo Woman Traveler in India"].text} img={homepagecontent["14 MUST-DO Tips for every Solo Woman Traveler in India"].image} margin="2.5rem 0" experiences={homepagecontent["Women's Day Specials"]} ></ExperiencesBlog> */}
        <CaseStudies></CaseStudies>

      </SetWidthContainer>

      {/*Add travel traingle banner with 2 ctas*/}
   

      <SetWidthContainer>
      <Heading  noline fontSize="32px" align="center" aligndesktop="left" margin={!isPageWide ? "2.5rem 0.5rem 1.5rem 0.5rem" : "3rem 0 2rem 0"}  bold>Work from home redefined</Heading>        

        {/* <Heading   align="center" aligndesktop="left" margin={!isPageWide ? "2.5rem 0.5rem 1.5rem 0.5rem" : "3rem 0 5rem 0"}  bold>Work from home redefined</Heading>         */}
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
      <Heading  noline fontSize="32px" align="center" aligndesktop="left" margin={!isPageWide ? "2.5rem 0.5rem 1.5rem 0.5rem" : "3rem 0 2rem 0"}  bold>Travel with a purpose</Heading>        

      {/* <Heading    align="center" aligndesktop="left" margin={!isPageWide ? "2.5rem 0.5rem 1.5rem 0.5rem" : "3rem 0 5rem 0"}  bold>Travel with a purpose</Heading>         */}
        <Experiences  three margin="2.5rem 0" experiences={homepagecontent["Travel with a purpose"]} ></Experiences>
        {/* <Heading align="center" aligndesktop="left" margin={!isPageWide ? "2.5rem 0.5rem 1.5rem 0.5rem" : '5rem 0'} bold>Live a different lifestyle</Heading> */}
        {/* <ExperiencesBlog  page="testimonials" review heading={homepagecontent["Inidan Review"].name} text={homepagecontent["Inidan Review"].summary} img={homepagecontent["Inidan Review"].image} margin="2.5rem 0" experiences={homepagecontent["Live a different lifestyle"]} ></ExperiencesBlog> */}
      </SetWidthContainer>
      <Heading  noline fontSize="32px" align="center" aligndesktop="center" margin={!isPageWide ? "2.5rem 0.5rem 1.5rem 0.5rem" : "3rem"}  bold>Why Us</Heading>        

      {/* <Heading   margin={!isPageWide? "1.5rem" : '5rem'} align="center" aligndesktop="center" bold>Why Us</Heading> */}
      <div style={{width: "90%", margin: "auto"}}><WhyUs></WhyUs></div>

      {/* <Testimonials margin="1.5rem 0"></Testimonials> */}

      <SetWidthContainer>
        <TravelStyles width={1200} height={900}/>
        <Button  onclick={_handleExperiencesClick} boxShadow hoverColor="white" hoverBgColor="black" borderWidth="2px"  margin="2.5rem auto 2.5rem auto" fontSizeDesktop="16px" fontSizeMobile="1.25rem" padding="0.5rem 2rem">All Experiences</Button>    
       

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

=======
import React, { useState, useEffect, useLayoutEffect } from "react";
import { useRouter } from "next/router";
import "bootstrap/dist/css/bootstrap.min.css";
import styled, { keyframes } from "styled-components";
import FullImage from "../../components/FullImage";
// import {connect} from 'react-redux';
import DesktopBanner from "../../components/containers/Banner";
import Experiences from "../../components/containers/Experiences";
import axiomyplansinstance from "../../services/sales/MyPlans";

//  import Chatbot from '../../components/chatbot/Homepage';
// import ImageLoader from '../../components/ImageLoader';
import AsSeenIn from "../../containers/testimonial/AsSeenIn";
// import Heading from '../../components/newheading/heading/Index';
import Heading from "../../components/newheading/heading/Index";
import TravelStyles from "../../components/containers/TravelStyles";
import ChatWithUs from "../../components/containers/ChatWithUs/ChatWithUs";
import HowItWorks from "../../components/containers/HowItWorksSlideshow";
import SwiperLocations from "../../components/containers/SwiperLocations/Index";
import Banner from "./banner/Mobile";
import Locations from "../../components/containers/plannerlocations/Index";
import FullImgContent from "./search/SearchFullImgContent";
// import FullImgContentChristmas from './search/Christmas';
import Button from "../../components/ui/button/Index";
import media from "../../components/media";
import * as ga from "../../services/ga/Index";
import urls from "../../services/urls";
import CaseStudies from "../travelplanner/CaseStudies/Index";
import WhatsappFloating from "../../components/WhatsappFloating";
import PlanAsPerTheme from "./PlanAsPerTheme";
import PlanWithUs from "../../components/WhyPlanWithUs/Index";
import TailoredFormMobileModal from "../../components/modals/TailoredFomrMobile";
import HeroBanner from "../../components/containers/HeroBanner/HeroBanner";
import openTailoredModal from "../../services/openTailoredModal";
import Continentcarousel from "../../components/continentcarousel/continentcarousel";
import Cookies from "js-cookie";
import axios from "axios";
const SetWidthContainer = styled.div`
  width: 100%;
  margin: auto;
  @media screen and (min-width: 768px) {
    width: 85%;
  }
`;

const HowItWorksText = styled.p`
  font-size: 15px;
  width: 100%;
  margin: 0 0;
  font-weight: 300;

  @media screen and (min-width: 768px) {
    margin: 0 0;
    font-weight: 300;
  }
`;

const HowItWorksHeading = styled.p`
  font-weight: 600;
  margin: 1rem 0 0.5rem 0;
  @media screen and (min-width: 768px) {
    font-size: 18px;
    margin: 1rem 0 0.5rem 0;
  }
`;
const HowItWorksContainer = styled.div`
  @media screen and (min-width: 768px) {
    margin: auto;
  }
`;

const Homepage = (props) => {
  const [myPlansArr, setMyPlansArr] = useState([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [plansCount, setPlansCount] = useState(null);
  const [showMoiblePlanner, setShowMobilePlanner] = useState(false);
  let isPageWide = media("(min-width: 768px)");

  useLayoutEffect(() => {
    if (!Cookies.get("userLocation")) getUserIp();

    async function getUserIp() {
      try {
        const res = await axios.get("https://api.ipify.org?format=json");
        const IpAddress = res.data.ip;
        if (IpAddress) getUserLocation(IpAddress);
      } catch (e) {
        console.log(e);
      }
    }
    async function getUserLocation(ip) {
      try {
        const res = await axios.get(
          `https://apis.tarzanway.com/search/user_location/?ip=${ip}`
        );
        const data = JSON.stringify(res.data);
        if (res.data) Cookies.set("userLocation", data, { expires: 7 });
      } catch (e) {
        console.log(e);
      }
    }
  }, []);

  useEffect(() => {
    if (props.token) {
      const MyPlans = JSON.parse(localStorage.getItem("MyPlans"));
      if (MyPlans && MyPlans.access_token === props.token) {
        setMyPlansArr(MyPlans.plans);
        setPlansCount(MyPlans.count);
        setPlansLoading(false);
      } else {
        axiomyplansinstance
          .get("?limit=3&offset=0", {
            headers: {
              Authorization: `Bearer ${props.token}`,
            },
          })
          .then((res) => {
            let plansarr = [];

            for (var i = 0; i < res.data.results.length; i++) {
              plansarr.push(res.data.results[i]);
            }
            setMyPlansArr(plansarr.slice());
            localStorage.setItem(
              "MyPlans",
              JSON.stringify({
                plans: plansarr,
                count: res.data.count,
                access_token: props.token,
              })
            );
            setPlansCount(res.data.count);
            setPlansLoading(false);
          })
          .catch((err) => {
            setPlansLoading(false);
          });
      }
    }
  }, [props.token]);

  //JSX for How it works
  const HowitWorksHeadingsArr = [
    <HowItWorksHeading className="font-lexend">
      Handpick Your Selection
    </HowItWorksHeading>,
    <HowItWorksHeading className="font-lexend">
      Unleash AI's Itinerary Wizardry!
    </HowItWorksHeading>,
    <HowItWorksHeading className="font-lexend">
      Easy Bookings with 24x7 Concierge
    </HowItWorksHeading>,
    <HowItWorksHeading className="font-lexend">
      No Commissions - Pay for what you get
    </HowItWorksHeading>,
  ];
  const HowitWorksContentsArr = [
    <HowItWorksText className="font-lexend">
      From solo travel to workcation, honeymoon to family travel, tell us about
      your mood, budget & timeline.
    </HowItWorksText>,
    <HowItWorksText className="font-lexend">
      Get a unique itinerary completely personalized for you, with all bookings
      in one place.
    </HowItWorksText>,
    <HowItWorksText className="font-lexend">
      From your stays to activities, book-it-all in one click, and enjoy 24x7
      assistance while you explore.
    </HowItWorksText>,
    <HowItWorksText className="font-lexend">
      No hidden charges during & after bookings. Pay For What You Get.
    </HowItWorksText>,
  ];

  const howitworksimgs = [
    "media/website/whyus-1.webp",
    "media/website/whyus-2.webp",
    "media/website/whyus-3.webp",
    "media/website/how4.png",
  ];

  const router = useRouter();
  const [desktopBannerLoading, setDesktopBannerLoading] = useState(false);
  const [experienceMore, setExperieceMore] = useState(false);

  const _handleExperiencesRedirect = () => {
    router.push(urls.travel_experiences.BASE);
  };
  const _handleExperiencesClick = () => {
    //  setTimeout(_handleExperiencesRedirect, 1000);

    // ga.callback_event({
    //   action: 'TE-Travelstyles',

    //   callback: _handleTailoredRedirect,
    // })
    _handleExperiencesRedirect();
  };
  const [escapeState, setEscapeState] = useState(false);
  useEffect(() => {
    setEscapeState(true);
  }, []);
  return (
    <div
      className={"Homepage font-lexend"}
      id="homepage-anchor"
      style={{ visibility: props.hidden ? "hidden" : "visible" }}
    >
      {/* <Snowflakes></Snowflakes> */}

      {/* <FullImage filter="linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.6))" fit="contain" center url="media/website/Home (1).png" height="85vh" heightmobile="60vh" >
       <FullImgContent _handleTailoredClick={_handleTailoredClick} tagline="Explore different realities." text="Find an immersive experience or craft one yourself."/>
      </FullImage> */}

      <HeroBanner
        image={
          isPageWide
            ? "media/website/homepage-herobanner.jpg"
            : "media/website/homepage-banner-mobile.png"
        }
        destinationType={"city-planner"}
        title={
          <p style={!isPageWide ? { fontSize: "22px" } : {}}>
            Effortless Travel Planning!
            <br />
            Let AI Be Your Expert Guide.
          </p>
        }
        _startPlanningFunction={() => openTailoredModal(router)}
      />

      <div
        style={{ zIndex: "1", backgroundColor: "white", position: "relative" }}
      >
        <DesktopBanner
          loading={desktopBannerLoading}
          onclick={() => openTailoredModal(router)}
          text="Want to personalize your own experience?"
        ></DesktopBanner>

        <SetWidthContainer>
          <Heading
            textAlign="left"
            bold
            noline
            fontSize={isPageWide ? "32px" : "24px"}
            align="center"
            aligndesktop="left"
            margin={!isPageWide ? "2.5rem 0.5rem 0rem 0.5rem" : "3rem 0"}
          >
            How it works?
          </Heading>
          <HowItWorksContainer>
            <HowItWorks
              images={howitworksimgs}
              content={HowitWorksContentsArr}
              headings={HowitWorksHeadingsArr}
            ></HowItWorks>
          </HowItWorksContainer>

          {props.token && myPlansArr.length && plansCount ? (
            <Heading
              noline
              fontSize={isPageWide ? "32px" : "24px"}
              align="left"
              aligndesktop="left"
              margin={
                !isPageWide ? "2.5rem 0.5rem 1.5rem 0.5rem" : "3rem 0 2rem 0"
              }
              bold
              textAlign="left"
            >
              {"My Trips (" + plansCount + ")"}
            </Heading>
          ) : null}
          {props.token && myPlansArr.length ? (
            <>
              <Experiences
                margin="2.5rem 0"
                experiences={myPlansArr}
              ></Experiences>
              <Button
                link="/dashboard"
                onclickparams={null}
                borderWidth="1px"
                fontSizeDesktop="12px"
                fontWeight="500"
                borderRadius="6px"
                margin="1.5rem auto"
                padding="0.5rem 2rem"
              >
                View All
              </Button>
            </>
          ) : null}
        </SetWidthContainer>

        <SetWidthContainer style={{}}>
          {props.locations && props.locations.length ? (
            <>
              <Heading
                noline
                textAlign="left"
                fontSize={isPageWide ? "32px" : "24px"}
                align="center"
                aligndesktop="left"
                margin={
                  !isPageWide ? "2.5rem 0.5rem 1.5rem 0.5rem" : "3rem 0 2rem 0"
                }
                bold
              >
                Plan as per the best destinations
              </Heading>
              <Locations locations={props.locations} viewall></Locations>
            </>
          ) : null}

          {props.asiaLocations && props.asiaLocations.length ? (
            <>
              <Heading
                noline
                fontSize={isPageWide ? "32px" : "24px"}
                align="center"
                aligndesktop="left"
                margin={
                  !isPageWide ? "2.5rem 0.5rem 1.5rem 0.5rem" : "3rem 0 2rem 0"
                }
                bold
              >
                Trending destinations across Asia
              </Heading>
              <SwiperLocations
                locations={props.asiaLocations}
                country
              ></SwiperLocations>
            </>
          ) : null}

          {props.europeLocations && props.europeLocations.length ? (
            <>
              <Heading
                noline
                fontSize={isPageWide ? "32px" : "24px"}
                align="center"
                aligndesktop="left"
                margin={
                  !isPageWide ? "2.5rem 0.5rem 1.5rem 0.5rem" : "3rem 0 2rem 0"
                }
                bold
              >
                Trending destinations across Europe
              </Heading>
              <SwiperLocations
                locations={props.europeLocations}
                country
              ></SwiperLocations>
            </>
          ) : null}

          <>
            <Heading
              noline
              textAlign="left"
              fontSize={isPageWide ? "32px" : "24px"}
              align="center"
              aligndesktop="left"
              margin={
                !isPageWide ? "2.5rem 0.5rem 1.5rem 0.5rem" : "3rem 0 2rem 0"
              }
              bold
            >
              Plan your trip anywhere in the world
            </Heading>
            <Continentcarousel></Continentcarousel>
          </>
          {props.ThemeData && props.ThemeData.length ? (
            <>
              <Heading
                noline
                textAlign="left"
                fontSize={isPageWide ? "32px" : "24px"}
                align="center"
                aligndesktop="left"
                margin={
                  !isPageWide ? "2.5rem 0.5rem 1.5rem 0.5rem" : "3rem 0 2rem 0"
                }
                bold
              >
                Plan trip as per mood
              </Heading>
              <PlanAsPerTheme ThemeData={props.ThemeData} />
            </>
          ) : null}

          <Heading
            noline
            textAlign="left"
            fontSize={isPageWide ? "32px" : "24px"}
            align="center"
            aligndesktop="left"
            margin={
              !isPageWide ? "2.5rem 0.5rem 1.5rem 0.5rem" : "3rem 0 2rem 0"
            }
            bold
          >
            Why plan with us?
          </Heading>
          <PlanWithUs />

          <Heading
            noline
            textAlign="left"
            fontSize={isPageWide ? "32px" : "24px"}
            align="center"
            aligndesktop="left"
            margin={
              !isPageWide ? "2.5rem 0.5rem 1.5rem 0.5rem" : "3rem 0 2rem 0"
            }
            bold
          >
            Happy Community of The Tarzan Way
          </Heading>
          <CaseStudies></CaseStudies>
        </SetWidthContainer>

        <SetWidthContainer>
          {/* <Heading    align="center" aligndesktop="left" margin={!isPageWide ? "2.5rem 0.5rem 1.5rem 0.5rem" : "3rem 0 5rem 0"}  bold>Travel with a purpose</Heading>         */}
          {/* <Heading align="center" aligndesktop="left" margin={!isPageWide ? "2.5rem 0.5rem 1.5rem 0.5rem" : '5rem 0'} bold>Live a different lifestyle</Heading> */}
        </SetWidthContainer>

        <br></br>
        {/* <PersonaliseModal showPersonaliseModal={showPersonaliseModal} handlePersonaliseClose={handlePersonaliseClose} handlePersonaliseShow={handlePersonaliseShow}></PersonaliseModal> */}
        {!isPageWide && (
          <div>
            <Banner
              onclick={() => openTailoredModal(router)}
              text="Want to craft your own travel experience?"
              buttontext="Start Now"
              color="black"
              buttonbgcolor="#f7e700"
            ></Banner>
          </div>
        )}
        {/* <Chatbot history={props.history}/>     */}
      </div>
      <WhatsappFloating message="Hey, I need help planning my trip." />
    </div>
  );
};

// const mapStateToPros = (state) => {
//   return{
//     auth: state.auth.authentication,
//     name: state.auth.userName
//   }
// }

// export default connect(mapStateToPros)(Homepage);
export default Homepage;
>>>>>>> 1508de44ad0be19fb604d07dac60074142f6c707

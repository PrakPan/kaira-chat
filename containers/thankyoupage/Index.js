import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styled from 'styled-components';
import DesktopBanner from '../../components/containers/Banner';
import Experiences from '../../components/containers/Experiences';
import Heading from '../../components/newheading/heading/Index';
import axiomyplansinstance from '../../services/sales/MyPlans';
import Button from '../../components/ui/button/Index';
import HowItWorks from '../../components/containers/HowItWorksSlideshow';
import Banner from '../homepage/banner/Mobile';
import Locations from '../../components/containers/plannerlocations/Index';
import media from '../../components/media';
import CaseStudies from '../travelplanner/CaseStudies/Index';
import WhatsappFloating from '../../components/WhatsappFloating';
import PlanAsPerTheme from '../homepage/PlanAsPerTheme';
import PlanWithUs from '../../components/WhyPlanWithUs/Index';
import HeroBanner from '../../components/containers/HeroBanner/HeroBanner';
import openTailoredModal from '../../services/openTailoredModal';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
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
const Index = (props) => {
  const [myPlansArr, setMyPlansArr] = useState([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [plansCount, setPlansCount] = useState(null);

  let isPageWide = media('(min-width: 768px)');
  useEffect(() => {
    if (props.token) {
      const MyPlans = JSON.parse(localStorage.getItem('MyPlans'));
      if (MyPlans && MyPlans.access_token === props.token) {
        setMyPlansArr(MyPlans.plans);
        setPlansCount(MyPlans.count);
        setPlansLoading(false);
      } else {
        axiomyplansinstance
          .get('?limit=3&offset=0', {
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
              'MyPlans',
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
    'media/website/whyus-1.webp',
    'media/website/whyus-2.webp',
    'media/website/whyus-3.webp',
    'media/website/how4.png',
  ];

  const router = useRouter();
  const [desktopBannerLoading, setDesktopBannerLoading] = useState(false);

  const [escapeState, setEscapeState] = useState(false);
  useEffect(() => {
    setEscapeState(true);
  }, []);
  return (
    <div>
      <HeroBanner
        image={
          isPageWide
            ? 'media/website/thank-you-banner.jpg'
            : 'media/website/homepage-banner-mobile.png'
        }
        destinationType={'city-planner'}
        title={
          <p>
            Thank you for putting
            <br />
            your faith in us
          </p>
        }
        subheading={
          <p>
            It takes one step to begin the journey of a thousand miles.
            <br />
            We will get in touch with you within 12 hours. {':)'}
          </p>
        }
        _startPlanningFunction={() => openTailoredModal(router)}
      />

      <div
        style={{ zIndex: '1', backgroundColor: 'white', position: 'relative' }}
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
            fontSize={isPageWide ? '32px' : '24px'}
            align="center"
            aligndesktop="left"
            margin={!isPageWide ? '2.5rem 0.5rem 0rem 0.5rem' : '3rem 0'}
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
              fontSize={isPageWide ? '32px' : '24px'}
              align="center"
              aligndesktop="left"
              margin={
                !isPageWide ? '2.5rem 0.5rem 1.5rem 0.5rem' : '3rem 0 2rem 0'
              }
              bold
              textAlign="left"
            >
              {'My Trips (' + plansCount + ')'}
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
                fontSize={isPageWide ? '32px' : '24px'}
                align="center"
                aligndesktop="left"
                margin={
                  !isPageWide ? '2.5rem 0.5rem 1.5rem 0.5rem' : '3rem 0 2rem 0'
                }
                bold
              >
                Plan as per the best destinations
              </Heading>
              <Locations locations={props.locations} viewall></Locations>
            </>
          ) : null}

          {props.ThemeData && props.ThemeData.length ? (
            <>
              <Heading
                noline
                textAlign="left"
                fontSize={isPageWide ? '32px' : '24px'}
                align="center"
                aligndesktop="left"
                margin={
                  !isPageWide ? '2.5rem 0.5rem 1.5rem 0.5rem' : '3rem 0 2rem 0'
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
            fontSize={isPageWide ? '32px' : '24px'}
            align="center"
            aligndesktop="left"
            margin={
              !isPageWide ? '2.5rem 0.5rem 1.5rem 0.5rem' : '3rem 0 2rem 0'
            }
            bold
          >
            Why plan with us?
          </Heading>
          <PlanWithUs />

          <Heading
            noline
            textAlign="left"
            fontSize={isPageWide ? '32px' : '24px'}
            align="center"
            aligndesktop="left"
            margin={
              !isPageWide ? '2.5rem 0.5rem 1.5rem 0.5rem' : '3rem 0 2rem 0'
            }
            bold
          >
            Happy Community of The Tarzan Way
          </Heading>
          <CaseStudies></CaseStudies>
        </SetWidthContainer>
        <br></br>
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
      </div>
      <WhatsappFloating message="Hey, I need help planning my trip." />
    </div>
  );
};

export default Index;

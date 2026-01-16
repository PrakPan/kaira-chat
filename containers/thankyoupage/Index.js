import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styled from "styled-components";
import DesktopBanner from "../../components/containers/Banner";
import Experiences from "../../components/containers/Experiences";
import Heading from "../../components/newheading/heading/Index";
import axiomyplansinstance from "../../services/sales/MyPlans";
import Button from "../../components/ui/button/Index";
import HowItWorks from "../../components/containers/HowItWorksSlideshow";
import Banner from "../homepage/banner/Mobile";
import Locations from "../../components/containers/plannerlocations/Index";
import media from "../../components/media";
import CaseStudies from "../travelplanner/CaseStudies/Index";
import PlanAsPerTheme from "../homepage/PlanAsPerTheme";
import PlanWithUs from "../../components/WhyPlanWithUs/Index";
import HeroBanner from "../../components/containers/HeroBanner/HeroBanner";
import openTailoredModal from "../../services/openTailoredModal";
import SwiperLocations from "../../components/containers/SwiperLocations/Index";
import Continentcarousel from "../../components/continentcarousel/continentcarousel";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { imgUrlEndPoint } from "../../components/theme/ThemeConstants";
import HeroSection from "../../components/revamp/destination/HeroSection";
import TailoredFormMobileModal from "../../components/modals/TailoredFomrMobile";

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
  const router = useRouter();
  const [desktopBannerLoading, setDesktopBannerLoading] = useState(false);
  const [myPlansArr, setMyPlansArr] = useState([]);
  const [plansCount, setPlansCount] = useState(null);
  const [showTailoredModal, setShowTailoredModal] = useState(false);

  let isPageWide = media("(min-width: 768px)");

  useEffect(() => {
    if (props.token) {
      const MyPlans = JSON.parse(localStorage.getItem("MyPlans"));
      if (MyPlans && MyPlans.access_token === props.token) {
        setMyPlansArr(MyPlans.plans);
        setPlansCount(MyPlans.count);
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
          })
          .catch((err) => {});
      }
    }
  }, [props.token]);

  //JSX for How it works
  const HowitWorksHeadingsArr = [
    <HowItWorksHeading className="">
      Handpick Your Selection
    </HowItWorksHeading>,
    <HowItWorksHeading className="">
      Unleash AI's Itinerary Wizardry!
    </HowItWorksHeading>,
    <HowItWorksHeading className="">
      Easy Bookings with 24x7 Concierge
    </HowItWorksHeading>,
    <HowItWorksHeading className="">
      No Commissions - Pay for what you get
    </HowItWorksHeading>,
  ];

  const HowitWorksContentsArr = [
    <HowItWorksText className="">
      From solo travel to workcation, honeymoon to family travel, tell us about
      your mood, budget & timeline.
    </HowItWorksText>,
    <HowItWorksText className="">
      Get a unique itinerary completely personalized for you, with all bookings
      in one place.
    </HowItWorksText>,
    <HowItWorksText className="">
      From your stays to activities, book-it-all in one click, and enjoy 24x7
      assistance while you explore.
    </HowItWorksText>,
    <HowItWorksText className="">
      No hidden charges during & after bookings. Pay For What You Get.
    </HowItWorksText>,
  ];

  const howitworksimgs = [
    "media/website/whyus-1.webp",
    "media/website/whyus-2.webp",
    "media/website/whyus-3.webp",
    "media/website/how4.png",
  ];

  return (
    <div>
      <HeroSection
          image={
          isPageWide
            ? `${imgUrlEndPoint}media/website/thank-you-banner.jpg`
            : `${imgUrlEndPoint}media/website/homepage-banner-mobile.png`
        }
        destinationType={"city-planner"}
        title={
          
            `Thank you for putting your faith in us`
       
        }
        subtitle={`It takes one step to begin the journey of a thousand miles. We will get in touch with you within 12 hours. :)`}
        // _startPlanningFunction={() => openTailoredModal(router)}
        page={"Thank you Page"}
        slug={'thank-you'}
        setShowTailoredModal={setShowTailoredModal}
        />
      {/* <HeroBanner
        image={
          isPageWide
            ? "media/website/thank-you-banner.jpg"
            : "media/website/homepage-banner-mobile.png"
        }
        destinationType={"city-planner"}
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
            We will get in touch with you within 12 hours. {":)"}
          </p>
        }
        _startPlanningFunction={() => openTailoredModal(router)}
        page={"Thank you Page"}
      /> */}

      <div
        style={{ zIndex: "1", backgroundColor: "white", position: "relative" }}
      >
        <DesktopBanner
          loading={desktopBannerLoading}
          onclick={() => setShowTailoredModal(true)}
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
              page={"Thank you Page"}
              setShowTailoredModal={setShowTailoredModal}
            ></HowItWorks>
          </HowItWorksContainer>

          {props.token && myPlansArr.length ? (
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
                textAlign="left"
              >
                {"My Trips "} {plansCount ? `(${plansCount})` : null}
              </Heading>
              <Experiences
                margin="2.5rem 0"
                experiences={myPlansArr}
                page={"Thank you Page"}
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
                Plan as per the best destinations in India
              </Heading>
              <Locations
                locations={props.locations}
                page={"Thank you Page"}
                viewall
              ></Locations>
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
                Top countries to visit in Europe
              </Heading>
              <SwiperLocations
                locations={props.europeLocations}
                country
                page={"Thank you Page"}
                continent={"Europe"}
              ></SwiperLocations>

              <Button
                link="/europe"
                fontWeight="500"
                boxShadow
                borderRadius="8px"
                bgColor="white"
                margin="2.5rem auto"
                // width="20rem"
                padding="0.5rem 2rem"
                borderWidth="1px"
              >
                {"Start your journey to Europe now!"}
              </Button>
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
                Top countries to visit in Asia
              </Heading>
              <SwiperLocations
                locations={props.asiaLocations}
                country
                page={"Thank you Page"}
                continent={"Asia"}
              ></SwiperLocations>

              <Button
                link="/asia"
                fontWeight="500"
                boxShadow
                borderRadius="8px"
                bgColor="white"
                margin="2.5rem auto"
                // width="20rem"
                padding="0.5rem 2rem"
                borderWidth="1px"
              >
                {"Start your journey to Asia now!"}
              </Button>
            </>
          ) : null}

          {props.continetCarousel && props.continetCarousel.length ? (
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
              <Continentcarousel
                data={props.continetCarousel}
                page={"Thank you Page"}
              ></Continentcarousel>
            </>
          ) : (
            <></>
          )}

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
              <PlanAsPerTheme
                ThemeData={props.ThemeData}
                Count={props.Count}
                page={"Thank you Page"}
              />
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


      <TailoredFormMobileModal
            destinationType={"city-planner"}
            page_id={props.page_id}
            children_cities={props.children_cities}
            destination={props.destination}
            cities={props.cities}
            onHide={() => {
              setShowTailoredModal(false);
            }}
            show={showTailoredModal}
            eventDates={props.eventDates}
          />
    </div>
  );
};

export default Index;

import React, { useState, useEffect, useLayoutEffect } from "react";
import { useRouter } from "next/router";
import "bootstrap/dist/css/bootstrap.min.css";
import styled from "styled-components";
import DesktopBanner from "../../components/containers/Banner";
import Experiences from "../../components/containers/Experiences";
import axiomyplansinstance from "../../services/sales/MyPlans";
import HowItWorks from "../../components/containers/HowItWorksSlideshow";
import SwiperLocations from "../../components/containers/SwiperLocations/Index";
import Banner from "./banner/Mobile";
import Locations from "../../components/containers/plannerlocations/Index";
import Button from "../../components/ui/button/Index";
import media from "../../components/media";
import CaseStudies from "../travelplanner/CaseStudies/Index";
import PlanAsPerTheme from "./PlanAsPerTheme";
import PlanWithUs from "../../components/WhyPlanWithUs/Index";
import HeroBanner from "../../components/containers/HeroBanner/HeroBanner";
import openTailoredModal from "../../services/openTailoredModal";
import Continentcarousel from "../../components/continentcarousel/continentcarousel";
import { logEvent } from "../../services/ga/Index";
import H3 from "../../components/heading/H3";

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
  const router = useRouter();
  const [myPlansArr, setMyPlansArr] = useState([]);
  const [plansCount, setPlansCount] = useState(null);
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

  const handleButtonClick = (location) => {
    logEvent({
      action: "View_Destination",
      params: {
        page: "Home Page",
        event_category: "Button Click",
        event_label: "View Destination",
        event_value: location,
        event_action: `Top countries to visit${" in " + location}`,
      },
    });
  };

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

  return (
    <div
      className={"Homepage font-lexend"}
      id="homepage-anchor"
      style={{ visibility: props.hidden ? "hidden" : "visible" }}
    >
      <HeroBanner
        image={
          isPageWide
            ? "media/website/banners/homepage-herobanner-3.webp"
            : "media/website/banners/homepage-herobanner-mobile.webp"
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
        resizeMode={"fill"}
        page={"Home Page"}
      />

      <DesktopBanner
        onclick={() => openTailoredModal(router)}
        text="Want to personalize your own experience?"
      ></DesktopBanner>

      <SetWidthContainer>
        <HowItWorksContainer>
          <H3
            style={{
              color: "black",
              padding: "5px",
              margin: !isPageWide ? "2.5rem 0.5rem 0rem 0.5rem" : "3rem 0",
            }}
          >
            How it works?
          </H3>
          <HowItWorks
            images={howitworksimgs}
            content={HowitWorksContentsArr}
            headings={HowitWorksHeadingsArr}
            page={"Home Page"}
          ></HowItWorks>
        </HowItWorksContainer>

        {props.token && myPlansArr.length ? (
          <>
            <H3
              style={{
                color: "black",
                margin: !isPageWide
                  ? "2.5rem 0.5rem 1.5rem 0.5rem"
                  : "3rem 0 2rem 0",

                padding: "5px",
              }}
            >
              {"My Trips "} {plansCount ? `(${plansCount})` : null}
            </H3>
            <Experiences
              margin="2.5rem 0"
              experiences={myPlansArr}
              page={"Home Page"}
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
            <H3
              style={{
                color: "black",
                margin: !isPageWide
                  ? "2.5rem 0.5rem 1.5rem 0.5rem"
                  : "3rem 0 2rem 0",
                padding: "5px",
              }}
            >
              Plan as per the best destinations in India
            </H3>
            <Locations
              locations={props.locations}
              page={"Home Page"}
              viewall
            ></Locations>
          </>
        ) : null}

        {props.europeLocations && props.europeLocations.length ? (
          <>
            <H3
              style={{
                color: "black",
                margin: !isPageWide
                  ? "2.5rem 0.5rem 1.5rem 0.5rem"
                  : "3rem 0 2rem 0",
                padding: "5px",
              }}
            >
              Top countries to visit in Europe
            </H3>

            <SwiperLocations
              locations={props.europeLocations}
              country
              page={"Home Page"}
              continent={"Europe"}
            ></SwiperLocations>

            <Button
              link="/europe"
              onclickparam={"Europe"}
              fontWeight="500"
              boxShadow
              borderRadius="8px"
              bgColor="white"
              margin="2.5rem auto"
              padding="0.5rem 2rem"
              borderWidth="1px"
            >
              {"Start your journey to Europe now!"}
            </Button>
          </>
        ) : null}

        {props.asiaLocations && props.asiaLocations.length ? (
          <>
            <H3
              style={{
                color: "black",
                margin: !isPageWide
                  ? "2.5rem 0.5rem 1.5rem 0.5rem"
                  : "3rem 0 2rem 0",
                padding: "5px",
              }}
            >
              Top countries to visit in Asia
            </H3>

            <SwiperLocations
              locations={props.asiaLocations}
              country
              page={"Home Page"}
              continent={"Asia"}
            ></SwiperLocations>

            <Button
              link="/asia"
              onclickparam={"Asia"}
              fontWeight="500"
              boxShadow
              borderRadius="8px"
              bgColor="white"
              margin="2.5rem auto"
              padding="0.5rem 2rem"
              borderWidth="1px"
            >
              {"Start your journey to Asia now!"}
            </Button>
          </>
        ) : null}

        {props.continetCarousel.length ? (
          <>
            <H3
              style={{
                color: "black",
                margin: !isPageWide
                  ? "2.5rem 0.5rem 1.5rem 0.5rem"
                  : "3rem 0 2rem 0",
                padding: "5px",
              }}
            >
              Plan your trip anywhere in the world
            </H3>

            <Continentcarousel
              data={props.continetCarousel}
              page={"Home Page"}
            ></Continentcarousel>
          </>
        ) : null}

        {props.ThemeData && props.ThemeData.length ? (
          <>
            <H3
              style={{
                color: "black",
                margin: !isPageWide
                  ? "2.5rem 0.5rem 1.5rem 0.5rem"
                  : "3rem 0 2rem 0",
                padding: "5px",
              }}
            >
              Plan trip as per mood
            </H3>

            <PlanAsPerTheme
              ThemeData={props.ThemeData}
              Count={props.Count}
              page={"Home Page"}
            />
          </>
        ) : null}

        <H3
          style={{
            color: "black",
            margin: !isPageWide
              ? "2.5rem 0.5rem 1.5rem 0.5rem"
              : "3rem 0 2rem 0",
            padding: "5px",
          }}
        >
          Why plan with us?
        </H3>
        <PlanWithUs />

        <H3
          style={{
            color: "black",
            margin: !isPageWide
              ? "2.5rem 0.5rem 1.5rem 0.5rem"
              : "3rem 0 2rem 0",
            padding: "5px",
          }}
        >
          Happy Community of The Tarzan Way
        </H3>
        <CaseStudies></CaseStudies>
      </SetWidthContainer>

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
  );
};

export default Homepage;

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
import ExperienceCard from "../../components/cards/newitinerarycard-main/ExperienceCard";
import axios from "axios";
import { MERCURY_HOST } from "../../services/constants";
import SwiperCarousel from "../../components/SwiperCarousel";

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
const GridCard = styled.div`
  margin: 1rem 0.5rem;
`;

const Homepage = (props) => {
  const router = useRouter();
  const [myPlansArr, setMyPlansArr] = useState([]);
  const [plansCount, setPlansCount] = useState(null);
  const [trips, setTrips] = useState([]);
  let isPageWide = media("(min-width: 768px)");

  const fetchTrips = async (allPlans) => {
    try {
      const query = allPlans ? "" : "?limit=3&offset=0";
      const tripsResponse = await axios.get(
        `${MERCURY_HOST}/api/v1/itinerary/my-plans/${query}`,
        {
          headers: {
            Authorization: "Bearer " + props?.token,
          },
        }
      );
      const newTrips = tripsResponse?.data?.data?.plans;
      const count = tripsResponse?.data?.results;
      setPlansCount(count);
      setTrips(newTrips);
    } catch (err) {
      console.log("[ERROR][TripsResponse:getStaticProps]: ", err.message);
    }
  };

  useEffect(() => {
    if (props.token) {
      fetchTrips(false);
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
            ? "media/website/banners/ocean.jpg"
            : "media/website/banners/ocean.jpg"
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

      {trips.length > 0 && (
        <SetWidthContainer>
          <H3
            style={{
              color: "black",
              padding: "5px",
              margin: !isPageWide ? "2.5rem 0.5rem 0rem 0.5rem" : "3rem 0",
            }}
          >
            My Trips ({plansCount})
          </H3>
          <div className="hidden-mobile">
            <SwiperCarousel
              navigationButtons={true}
              slidesPerView={3}
              cards={trips.map((trip, i) => (
                <ExperienceCard
                  key={trip?.id}
                  data={trip}
                  slug={trip?.slug}
                  rating={trip?.rating}
                  budget={trip?.payment_information.per_person_discounted_cost}
                  group_type={trip?.group_type}
                  number_of_adults={trip?.number_of_adults}
                  filter={trip[0]}
                  id={trip?.id}
                  text={trip?.short_text}
                  experience={trip?.name}
                  images={trip?.images}
                  starting_cost={
                    trip?.payment_information?.show_per_person_cost
                      ? trip?.payment_information.per_person_discounted_cost
                      : trip?.payment_information?.discounted_cost
                  }
                  duration={
                    trip?.duration ||
                    (trip?.duration_number && trip?.duration_unit
                      ? trip?.duration_number
                      : null)
                  }
                  location={trip?.locations?.[0]?.name}
                  locations={trip?.itinerary_locations}
                  hardcoded={trip?.payment_info ? true : false}
                />
              ))}
            />
          </div>

          <div className="hidden-desktop">
            <SwiperCarousel
              slidesPerView={1}
              initialIndex={0}
              cards={trips.map((trip, i) => (
                <ExperienceCard
                  data={trip}
                  slug={trip?.slug}
                  rating={trip?.rating}
                  budget={trip?.payment_information.per_person_discounted_cost}
                  group_type={trip?.group_type}
                  number_of_adults={trip?.number_of_adults}
                  filter={trip?.experience_filters?.[0]}
                  id={trip?.id}
                  text={trip?.short_text}
                  experience={trip?.name}
                  images={trip?.images}
                  starting_cost={
                    trip?.payment_information?.show_per_person_cost
                      ? trip?.payment_information.per_person_discounted_cost
                      : trip?.payment_information?.discounted_cost
                  }
                  duration={
                    trip?.duration ||
                    (trip?.duration_number && trip?.duration_unit
                      ? trip?.duration_number
                      : null)
                  }
                  location={trip?.locations?.[0]?.name}
                  locations={trip?.itinerary_locations}
                  hardcoded={trip?.payment_info ? true : false}
                />
              ))}
            />
          </div>
          <Button
            fontWeight="500"
            boxShadow
            borderRadius="8px"
            bgColor="white"
            margin="2.5rem auto"
            padding="0.5rem 2rem"
            borderWidth="1px"
            onclick={() => fetchTrips(true)}
          >
            {"View all plans"}
          </Button>
        </SetWidthContainer>
      )}
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
              onclick={() => {
                logEvent({
                  action: "View_All_Trips",
                  params: {
                    page: "Home Page",
                    event_category: "Button Click",
                    event_label: "View All",
                    event_action: "My Trips Section",
                  },
                });
              }}
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
              onclick={() => {
                logEvent({
                  action: "Start_Journey",
                  params: {
                    page: "Home Page",
                    event_category: "Button Click",
                    event_label: "Start your journey to Europe now!",
                    event_action: "Europe Section",
                    destination: "Europe",
                  },
                });
              }}
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
              onclick={() => {
                logEvent({
                  action: "Start_Journey",
                  params: {
                    page: "Home Page",
                    event_category: "Button Click",
                    event_label: "Start your journey to Asia now!",
                    event_action: "Asia Section",
                    destination: "Asia",
                  },
                });
              }}
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

            <PlanAsPerTheme ThemeData={props.ThemeData} page={"Home Page"} />
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

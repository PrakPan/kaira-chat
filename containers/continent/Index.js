import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import DesktopPersonaliseBanner from "../../components/containers/Banner";
import HeroBanner from "../../components/containers/HeroBanner/HeroBanner";
import MobileBanner from "../city/Banner/Mobile";
import media from "../../components/media";
import validateTextSize from "../../services/textSizeValidator";
import styled from "styled-components";
import Overview from "../travelplanner/Overview";
import openTailoredModal from "../../services/openTailoredModal";
import Button from "../../components/ui/button/Index";
import BannerTwo from "../travelplanner/BannerTwo";
import WhyPlanWithUs from "../../components/WhyPlanWithUs/PlanWithUsWithEnquiry";
import Reviews from "../travelplanner/CaseStudies/Index";
import ChatWithUs from "../../components/containers/ChatWithUs/ChatWithUs";
import SwiperLocations from "../../components/containers/SwiperLocations/Index";
import Continentcarousel from "../../components/continentcarousel/continentcarousel";
import AsSeenIn from "../testimonial/AsSeenIn";
import PathNavigation from "../travelplanner/PathNavigation";
import Experience from "../../components/containers/Experiences";
import Locations from "../../components/containers/newplannerlocations/Index";
import dynamic from "next/dynamic";
import { logEvent } from "../../services/ga/Index.js";
import H3 from "../../components/heading/H3.js";
const MapBox = dynamic(() => import("../../components/Map.js"), {
  ssr: false,
});

const SetWidthContainer = styled.div`
  width: 100%;
  margin: auto;
  @media screen and (min-width: 768px) {
    width: 85%;
  }
`;

const MapGridContainer = styled.div`
  display: grid;
  grid-gap: 30px;

  @media screen and (min-width: 768px) {
    width: 100%;

    grid-template-columns: auto 500px;
    grid-gap: 40px;
    margin: 0 auto 0 auto;
  }
`;

const MapContainer = styled.div`
  @media screen and (min-width: 768px) {
    padding-top: 108px;
  }
`;

const MapInfo = styled.div`
  b {
    font-weight: 600;
  }
`;

const Index = (props) => {
  console.log("locations is:",props.locations)
  const router = useRouter();
  let isPageWide = media("(min-width: 768px)");
  const [userItineraries, setUserItineraries] = useState([]);
  const [hotLocations, setHotLocations] = useState([]);

  useEffect(() => {
    const hot_locations = [];
    if (props?.data?.cities) {
      props.data.cities.map((location, i) => {
        if (location?.is_hot_location) {
          hot_locations.push(location);
        }
      });
    }
    props?.data?.components?.map((item)=>{
      if(item.carousel=="itinerary-1"){
        setUserItineraries(item.itineraries)
      }
    })
    console.log("locations is:",hot_locations)
    setHotLocations(hot_locations);
  }, [props?.data?.components?.[0]?.itineraries]);

  const InfoWindowContainer = (location) => (
    <MapInfo>
      <b>{location.name}</b>
      <div>
        {location.most_popular_for?.map((e, i) =>
          i != 0 ? <span key={i}>{", " + e}</span> : <span key={i}>{e}</span>
        )}
      </div>
    </MapInfo>
  );

  const handlePlanButtonClick = (location) => {
    openTailoredModal(router, props.data.id, props.data.destination);

    logEvent({
      action: "Plan_Itinerary",
      params: {
        page: "Continent Page",
        event_category: "Button Click",
        event_label: "Create your free Itinerary",
        event_action: location,
      },
    });
  };

  return (
    <div>
      {isPageWide ? (
        <DesktopPersonaliseBanner
          onclick={() =>
            openTailoredModal(router, props.data.id, props.data.destination)
          }
          text={validateTextSize(
            `Craft a personalized itinerary to ${props.data.destination} now!`,
            9,
            `Craft a trip to ${props.data.destination} now!`
          )}
        ></DesktopPersonaliseBanner>
      ) : (
        <MobileBanner
          cityName={props.data.destination}
          onClick={() =>
            openTailoredModal(router, props.data.id, props.data.destination)
          }
        />
      )}

      <div>
        <HeroBanner
          image={props.data.image}
          page_id={props.data.id}
          title={`${props.data.slug
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")} Trip Planner`}
          page={"Continent Page"}
        />

        <SetWidthContainer>
          <PathNavigation path={props.data.path} />

          {props.locations && props.locations.length ? (
            <>
              <H3
                style={{
                  textAlign: isPageWide ? "left" : "center",
                  margin: isPageWide ? "3.5rem 0rem" : "1.5rem 0.5rem",
                }}
              >
                Top countries to visit in {props.data.destination}
              </H3>
              <SwiperLocations
                locations={props.locations}
                page_id={props.data.id}
                destination={props.data.destination}
                viewall
                country
                page={"Continent Page"}
                continent={props?.data?.destination}
              ></SwiperLocations>
              <Button
                onclick={() =>
                  handlePlanButtonClick(
                    `Top countries to visit in ${props?.data?.destination}`
                  )
                }
                borderWidth="1px"
                fontWeight="500"
                borderRadius="6px"
                margin="2rem auto"
                padding="0.5rem 2rem"
              >
                Create your free itinerary
              </Button>
            </>
          ) : null}

          <MapGridContainer>
            <Overview
              overview_heading={props.data.overview_heading}
              overview_text={props.data.overview_text}
            ></Overview>

            <MapContainer>
              {props.data.cities && props.data.cities.length ? (
                <MapBox
                  InfoWindowContainer={InfoWindowContainer}
                  locations={props.data.cities}
                  height="300px"
                />
              ) : null}
            </MapContainer>
          </MapGridContainer>

          <Button
            onclick={() =>
              handlePlanButtonClick(
                `A little about ${props?.data?.destination}`
              )
            }
            borderWidth="1px"
            fontWeight="500"
            borderRadius="6px"
            margin="2rem auto"
            padding="0.5rem 2rem"
          >
            Create your travel plan now!
          </Button>

          {userItineraries.length ? (
            <>
              <H3
                style={{
                  textAlign: isPageWide ? "left" : "center",
                  margin: !isPageWide
                    ? "2.5rem 0.5rem 1.5rem 0.5rem"
                    : "2.5rem 0 2.5rem 0",
                }}
              >
                Trips by our users
              </H3>
              <Experience
                experiences={userItineraries}
                page={"Continent Page"}
              />
            </>
          ) : null}

          {hotLocations.length ? (
            <>
              <H3
                style={{
                  textAlign: isPageWide ? "left" : "center",
                  margin: !isPageWide
                    ? "2.5rem 0.5rem 1.5rem 0.5rem"
                    : "2.5rem 0 4.5rem 0",
                }}
              >
                {props.data.slug
                  ? "Popular locations to visit in " + props.data.slug
                  : "Popular Locations"}
              </H3>
              <Locations
                locations={hotLocations}
                page={"Continent Page"}
                viewall
              ></Locations>
            </>
          ) : null}

          <H3
            style={{
              margin: "3.5rem 0 3.5rem 0",
              textAlign: isPageWide ? "left" : "center",
            }}
          >
            How it works?
          </H3>
          <div>
            <BannerTwo
              page_id={props.data.id}
              destination={props.data.destination}
            ></BannerTwo>
          </div>

          {props.continetCarousel.length ? (
            <>
              <H3
                style={{
                  textAlign: isPageWide ? "left" : "center",
                  margin: isPageWide ? "3.5rem 0rem" : "1.5rem 0.5rem",
                }}
              >
                Plan your trip anywhere in the world
              </H3>
              <Continentcarousel
                data={props.continetCarousel}
                page={"Continent Page"}
              ></Continentcarousel>
              <Button
                onclick={() =>
                  handlePlanButtonClick("Plan your trip anywhere in the world")
                }
                borderWidth="1px"
                fontWeight="500"
                borderRadius="6px"
                margin="2rem auto"
                padding="0.5rem 2rem"
              >
                Create your free itinerary
              </Button>
            </>
          ) : (
            <></>
          )}

          <H3
            style={{
              textAlign: isPageWide ? "left" : "center",
              margin: isPageWide ? "3.5rem 0rem" : "1.5rem 0.5rem",
            }}
          >
            Why plan with us?
          </H3>
          <WhyPlanWithUs page_id={props.data.id} />

          <H3
            style={{
              margin: "4rem 0 2.5rem 0",
              textAlign: isPageWide ? "left" : "center",
            }}
          >
            What our customers say?
          </H3>
          <Reviews></Reviews>

          <H3
            style={{
              margin: "4rem 0 2.5rem 0",
              textAlign: isPageWide ? "left" : "center",
            }}
          >
            What they say?
          </H3>
          <AsSeenIn />

          <ChatWithUs planner page_id={props.data.id}></ChatWithUs>
        </SetWidthContainer>
      </div>
    </div>
  );
};

export default Index;

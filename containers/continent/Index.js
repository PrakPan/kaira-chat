import React from "react";
import DesktopPersonaliseBanner from "../../components/containers/Banner";
import HeroBanner from "../../components/containers/HeroBanner/HeroBanner";
import MobileBanner from "../city/Banner/Mobile";
import media from "../../components/media";
import validateTextSize from "../../services/textSizeValidator";
import styled from "styled-components";
import WhatsappFloating from "../../components/WhatsappFloating";
import Overview from "../travelplanner/Overview";
import openTailoredModal from "../../services/openTailoredModal";
import Button from "../../components/ui/button/Index";
import BannerTwo from "../travelplanner/BannerTwo";
import OldLocations from "../../components/containers/plannerlocations/Index";
import WhyPlanWithUs from "../../components/WhyPlanWithUs/PlanWithUsWithEnquiry";
import Reviews from "../travelplanner/CaseStudies/Index";
import ChatWithUs from "../../components/containers/ChatWithUs/ChatWithUs";
import SwiperLocations from "../../components/containers/SwiperLocations/Index";
import Continentcarousel from "../../components/continentcarousel/continentcarousel";
import PlanAsPerContinent from '../../containers/homepage/PlanAsPerContinent'
import CountryCarousel from "./CountryCarousel";

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
const Heading = styled.h2`
  font-size: 32px;
  font-weight: 700;
  margin: 1.5rem 0.5rem;
  text-align: center;

  @media screen and (min-width: 768px) {
    text-align: left;
    margin: 3.5rem 0rem;
  }
`;

const Index = (props) => {
  let isPageWide = media("(min-width: 768px)");

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
      <WhatsappFloating message="Hey, I need help planning my trip." />
      <div>
        <HeroBanner
          image={props.data.image}
          page_id={props.data.id}
          // destination={props.data.destination}
          // cities={props.reccomendedCitiesData}
          title={`${props.data.destination} Trip Planner`}
        />
        <SetWidthContainer>
          <MapGridContainer>
            <Overview
              overview_heading={props.data.overview_heading}
              overview_text={props.data.overview_text}
            ></Overview>
            <MapContainer>
              {/* <MapContainer
                locations={props.experienceData.locations}
                InfoWindowContainer={InfoWindowContainer}
                height="300px"
                defaultZoom={12}
              ></Map> */}
            </MapContainer>
          </MapGridContainer>
          <Button
            onclick={() =>
              openTailoredModal(router, props.data.id, props.data.destination)
            }
            borderWidth="1px"
            fontWeight="500"
            borderRadius="6px"
            margin="2rem auto"
            padding="0.5rem 2rem"
          >
            Create your travel plan now!
          </Button>
          <Heading align="left" style={{ margin: "3.5rem 0 3.5rem 0" }}>
            How it works?
          </Heading>
          <div>
            <BannerTwo
              page_id={props.data.id}
              destination={props.data.destination}
            ></BannerTwo>
          </div>
          {props.locations && props.locations.length ? (
            <>
              <Heading>
                Trending destinations across {props.data.destination}
              </Heading>
              <SwiperLocations
                locations={props.locations}
                page_id={props.data.id}
                destination={props.data.destination}
                viewall
                // country={country}
                country
              ></SwiperLocations>
            </>
          ) : null}
          {/* <CountryCarousel
            destination={props.data.destination}
            slug={props.data.link}
          /> */}
          <>
            <Heading>Plan your trip anywhere in the world</Heading>
            <Continentcarousel></Continentcarousel>
            <Button
              onclick={() =>
                openTailoredModal(router, props.data.id, props.data.destination)
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
          <>
            <Heading>Plan as per continents across the world</Heading>
            <PlanAsPerContinent />
          </>
          <Heading style={{ margin: "3.5rem 0 3.5rem 0" }}>
            Why plan with us?
          </Heading>
          <WhyPlanWithUs
            page_id={props.data.id}
            // destination={props.data.destination}
          />
          <Heading style={{ margin: "4rem 0 2.5rem 0" }}>
            What our customers say?
          </Heading>
          <Reviews></Reviews>
          <ChatWithUs planner page_id={props.data.id}></ChatWithUs>
        </SetWidthContainer>
      </div>
    </div>
  );
};

export default Index;

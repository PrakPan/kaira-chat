import React, { useState, useEffect } from "react";
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
import { useRouter } from "next/router";
import AsSeenIn from "../testimonial/AsSeenIn";
import PathNavigation from "../travelplanner/PathNavigation";
import Experience from "../../components/containers/Experiences";
import Locations from "../../components/containers/newplannerlocations/Index";
import dynamic from "next/dynamic";
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
  const router = useRouter();
  const [userItineraries, setUserItineraries] = useState([]);
  const [hotLocations, setHotLocations] = useState([]);

  useEffect(() => {
    const hot_locations = [];
    if (props?.data?.locations) {
      props.data.locations.map((location, i) => {
        if (location?.is_hot_location) {
          hot_locations.push(location);
        }
      });
    }
    setHotLocations(hot_locations);
    setUserItineraries(props?.data?.itinerary_data);
  }, [props?.data?.itinerary_data, props?.data?.loccations]);

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

  return (
    <div>
      {isPageWide ? (
        <DesktopPersonaliseBanner
          onclick={() =>
            openTailoredModal(router, props.data.id, props.data.name)
          }
          text={validateTextSize(
            `Craft a personalized itinerary to ${props.data.name} now!`,
            9,
            `Craft a trip to ${props.data.name} now!`
          )}
        ></DesktopPersonaliseBanner>
      ) : (
        <MobileBanner
          cityName={props.data.name}
          onClick={() =>
            openTailoredModal(router, props.data.id, props.data.name)
          }
        />
      )}
      {/* <WhatsappFloating message="Hey, I need help planning my trip." /> */}
      <div>
        <HeroBanner
          image={props.data.image}
          page_id={props.data.id}
          destination={props.data.name}
          // cities={props.reccomendedCitiesData}
          title={`${props.data.name} Trip Planner`}
        />
        <SetWidthContainer>
          <PathNavigation path={props.data.path} />

          {hotLocations.length ? (
            <>
              <Heading
                align="center"
                aligndesktop="left"
                margin={
                  !isPageWide
                    ? "2.5rem 0.5rem 1.5rem 0.5rem"
                    : "2.5rem 0 4.5rem 0"
                }
                bold
              >
                {props.data.name
                  ? "Popular locations to visit in " + props.data.name
                  : "Popular Locations"}
              </Heading>
              <Locations locations={hotLocations} viewall></Locations>
            </>
          ) : null}

          <MapGridContainer>
            <Overview
              overview_heading={"A little about " + props.data.name}
              overview_text={props.data.short_description}
            ></Overview>
            <MapContainer>
              {props.data.locations && props.data.locations.length ? (
                <MapBox
                  InfoWindowContainer={InfoWindowContainer}
                  locations={props.data.locations}
                  height="300px"
                />
              ) : null}
            </MapContainer>
          </MapGridContainer>
          <Button
            onclick={() =>
              openTailoredModal(router, props.data.id, props.data.name)
            }
            borderWidth="1px"
            fontWeight="500"
            borderRadius="6px"
            margin="2rem auto"
            padding="0.5rem 2rem"
          >
            Create your travel plan now!
          </Button>

          {userItineraries?.length ? (
            <>
              <Heading
                align="center"
                aligndesktop="left"
                margin={
                  !isPageWide
                    ? "2.5rem 0.5rem 1.5rem 0.5rem"
                    : "2.5rem 0 2.5rem 0"
                }
                bold
              >
                Trips by our users
              </Heading>
              <Experience experiences={userItineraries} />
            </>
          ) : null}

          {props.data.states && props.data.states.length ? (
            <>
              <Heading>Trending destinations across {props.data.name}</Heading>
              <OldLocations
                locations={props.data.states}
                page_id={props.data.id}
                destination={props.data.name}
                viewall
                // country={country}
                planner
              ></OldLocations>
              <Button
                onclick={() =>
                  openTailoredModal(router, props.data.id, props.data.name)
                }
                borderWidth="1px"
                fontWeight="500"
                borderRadius="6px"
                margin="2rem auto"
                padding="0.5rem 2rem"
              >
                Create your travel plan now!
              </Button>
            </>
          ) : null}

          <Heading
            align="left"
            margin={!isPageWide ? "2.5rem 0.5rem 0rem 0.5rem" : "3rem 0"}
          >
            How it works?
          </Heading>
          <BannerTwo
            page_id={props.data.id}
            destination={props.data.name}
          ></BannerTwo>

          {props.locations && props.locations.length ? (
            <>
              <Heading>
                Other destinations to explore in {props.data.continent}
              </Heading>
              <SwiperLocations
                locations={props.locations}
                page_id={props.data.id}
                destination={props.data.name}
                viewall
                // country={country}
                country
              ></SwiperLocations>
              <Button
                onclick={() =>
                  openTailoredModal(router, props.data.id, props.data.name)
                }
                borderWidth="1px"
                fontWeight="500"
                borderRadius="6px"
                margin="2rem auto"
                padding="0.5rem 2rem"
              >
                Create your travel plan now!
              </Button>
            </>
          ) : null}

          {props.continetCarousel.length ? (
            <>
              <Heading>Plan your trip to anywhere in the world</Heading>
              <Continentcarousel
                data={props.continetCarousel}
              ></Continentcarousel>
              <Button
                onclick={() =>
                  openTailoredModal(router, props.data.id, props.data.name)
                }
                borderWidth="1px"
                fontWeight="500"
                borderRadius="6px"
                margin="2rem auto"
                padding="0.5rem 2rem"
              >
                Create your travel plan now!
              </Button>
            </>
          ) : (
            <></>
          )}

          <Heading style={{ margin: "3.5rem 0 3.5rem 0" }}>
            Why plan with us?
          </Heading>
          <WhyPlanWithUs
            page_id={props.data.id}
            destination={props.data.name}
          />

          <Heading style={{ margin: "4rem 0 2.5rem 0" }}>
            Happy Community of The Tarzan Way
          </Heading>
          <Reviews></Reviews>

          <Heading style={{ margin: "4rem 0 2.5rem 0" }}>
            What they say?
          </Heading>
          <AsSeenIn />

          <ChatWithUs planner page_id={props.data.id}></ChatWithUs>
        </SetWidthContainer>
      </div>
    </div>
  );
};

export default Index;

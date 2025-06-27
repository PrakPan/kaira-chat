import React, { useState, useEffect } from "react";
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
import Poi from "../../containers/newcityplanner/pois/Index";
import Activity from "../../containers/newcityplanner/activities/Index";
import { logEvent } from "../../services/ga/Index.js";
import H3 from "../../components/heading/H3";
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

const MenuItem = styled.div`
  @media screen and (min-width: 1400px) {
    margin-right: ${(props) => (props.single ? "29%" : "0")};
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
    setUserItineraries(props?.data?.itineraries);
  }, [props?.data?.itineraries, props?.data?.loccations]);

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
    openTailoredModal(router, props.data.id, props.data.name);

    logEvent({
      action: "Plan_Itinerary",
      params: {
        page: "Country Page",
        event_category: "Button Click",
        event_label: "Create your travel plan now!",
        event_action: location,
      },
    });
  };

  if (!props?.data) return null;

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
          cityName={props?.data?.name}
          onClick={() =>
            openTailoredModal(router, props.data.id, props.data.name)
          }
        />
      )}

      <div>
        <HeroBanner
          image={props?.data?.image}
          page_id={props?.data?.id}
          type={props?.type}
          destination={props?.data?.name}
          title={`${props?.data?.name} Trip Planner`}
          page={"Country Page"}
        />
        <SetWidthContainer>
          <PathNavigation path={props?.data?.path} />

          {hotLocations.length ? (
            <>
              <H3
                style={{
                  textAlign: isPageWide ? "left" : "center",
                  margin: isPageWide
                    ? "2.5rem 0 4.5rem 0"
                    : "2.5rem 0.5rem 1.5rem 0.5rem",
                }}
              >
                {props?.data?.name
                  ? "Popular locations to visit in " + props?.data?.name
                  : "Popular Locations"}
              </H3>
              <Locations
                locations={hotLocations}
                page={"Country Page"}
                state={props?.data?.name}
                viewall
              ></Locations>
            </>
          ) : null}

          <MapGridContainer>
            <Overview
              overview_heading={"A little about " + props?.data?.name}
              overview_text={props?.data?.short_description}
            ></Overview>
            <MapContainer>
              {props?.data?.locations && props?.data?.locations?.length ? (
                <MapBox
                  InfoWindowContainer={InfoWindowContainer}
                  locations={props?.data?.locations}
                  height="300px"
                />
              ) : null}
            </MapContainer>
          </MapGridContainer>
          <Button
            onclick={() =>
              handlePlanButtonClick(`A little about ${props?.data?.name}`)
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
              <H3
                style={{
                  textAlign: isPageWide ? "left" : "center",
                  margin: isPageWide
                    ? "2.5rem 0 2.5rem 0"
                    : "2.5rem 0.5rem 1.5rem 0.5rem",
                }}
              >
                Trips by our users
              </H3>
              <Experience experiences={userItineraries} page={"Country Page"} />
            </>
          ) : null}

          {props.data.activities.length ? (
            <div id="Activities">
              <H3
                style={{
                  textAlign: isPageWide ? "left" : "center",
                  margin: isPageWide ? "3.5rem 0rem" : "1.5rem 0.5rem",
                }}
              >
                Things to do in {props?.data?.name}
              </H3>
              <Activity
                data={props?.data}
                activities={props?.data?.activities}
                city={props?.data?.name}
                handlePlanButtonClick={handlePlanButtonClick}
                page={"Country Page"}
                removeDelete={true}
              />
            </div>
          ) : null}

          {props.data.pois.length ? (
            <MenuItem id="Places">
              <H3
                style={{
                  textAlign: isPageWide ? "left" : "center",
                  margin: isPageWide ? "3.5rem 0rem" : "1.5rem 0.5rem",
                }}
              >
                Places to visit in {props?.data?.name}
              </H3>
              <Poi
                data={props?.data}
                pois={props?.data?.pois}
                city={props?.data?.name}
                handlePlanButtonClick={handlePlanButtonClick}
                page={"Country Page"}
                removeDelete={true}
                removeChange={true}
              />
            </MenuItem>
          ) : null}

          {props.data.states && props.data.states.length ? (
            <>
              <H3
                style={{
                  textAlign: isPageWide ? "left" : "center",
                  margin: isPageWide ? "3.5rem 0rem" : "1.5rem 0.5rem",
                }}
              >
                Trending destinations across {props?.data?.name}
              </H3>
              <OldLocations
                locations={props.data.states}
                page_id={props.data.id}
                destination={props.data.name}
                viewall
                country={props.data.name}
                planner
                page={"Country Page"}
              ></OldLocations>
              <Button
                onclick={() =>
                  handlePlanButtonClick(
                    `Trending destinations across ${props.data.name}`
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
            </>
          ) : null}

          <H3
            style={{
              textAlign: isPageWide ? "left" : "center",
              margin: isPageWide ? "3rem 0rem" : "2.5rem 0.5rem 0rem 0.5rem",
            }}
          >
            How it works?
          </H3>
          <BannerTwo
            page_id={props.data.id}
            destination={props.data.name}
          ></BannerTwo>

          {props.locations && props.locations.length ? (
            <>
              <H3
                style={{
                  textAlign: isPageWide ? "left" : "center",
                  margin: isPageWide ? "3.5rem 0rem" : "1.5rem 0.5rem",
                }}
              >
                Other destinations to explore in {props.data.continent}
              </H3>
              <SwiperLocations
                locations={props.locations}
                page_id={props.data.id}
                destination={props.data.name}
                viewall
                country
                page={"Country Page"}
                continent={props.data.continent}
              ></SwiperLocations>
              <Button
                onclick={() =>
                  handlePlanButtonClick(
                    `Other destinations to explore in ${props.data.continent}`
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
            </>
          ) : null}

          {props.continetCarousel.length ? (
            <>
              <H3
                style={{
                  textAlign: isPageWide ? "left" : "center",
                  margin: isPageWide ? "3.5rem 0rem" : "1.5rem 0.5rem",
                }}
              >
                Plan your trip to anywhere in the world
              </H3>
              <Continentcarousel
                data={props.continetCarousel}
                page={"Country Page"}
              ></Continentcarousel>
              <Button
                onclick={() =>
                  handlePlanButtonClick(
                    `Plan your trip to anywhere in the world`
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
            </>
          ) : (
            <></>
          )}

          <H3
            style={{
              textAlign: isPageWide ? "left" : "center",
              margin: "3.5rem 0 3.5rem 0",
            }}
          >
            Why plan with us?
          </H3>
          <WhyPlanWithUs
            page_id={props.data.id}
            destination={props.data.name}
          />

          <H3
            style={{
              textAlign: isPageWide ? "left" : "center",
              margin: "4rem 0 2.5rem 0",
            }}
          >
            Happy Community of The Tarzan Way
          </H3>
          <Reviews></Reviews>

          <H3
            style={{
              textAlign: isPageWide ? "left" : "center",
              margin: "4rem 0 2.5rem 0",
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

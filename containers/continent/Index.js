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
import Locations from "../../components/containers/newplannerlocations/Index";
import dynamic from "next/dynamic";
import { logEvent } from "../../services/ga/Index.js";
import H3 from "../../components/heading/H3.js";
import Navigation from "../../components/theme/Navigation.jsx";
import PrimaryHeading from "../../components/heading/PrimaryHeading.jsx";
import SecondaryHeading from "../../components/heading/Secondary.jsx";
import Destination1Carousel from "../../components/theme/Destination1Carousel.jsx";
import { PlanYourTripButton } from "../travelplanner/ThemePage.jsx";
import Itinerary1Carousel from "../../components/theme/Itinerary1Carousel.jsx";
import Image from "next/image.js";
import Itinerary2Carousel from "../../components/theme/Itinerary2Carousel.jsx";
import Activity1Carousel from "../../components/theme/Activity1Carousel.jsx";
import Reviews1Carousel from "../../components/theme/Reviews1Carousel.jsx";
import Poi1Carousel from "../../components/theme/Poi1Carousel.jsx";
import { convertDbNameToCapitalFirst } from "../../helper/convertDbnameToCapitalFirst.js";

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
  console.log("locations is:", props.locations);
  const router = useRouter();
  let isPageWide = media("(min-width: 768px)");
  const [userItineraries, setUserItineraries] = useState([]);
  const [hotLocations, setHotLocations] = useState([]);

  useEffect(() => {
    const hot_locations = [];
    if (props?.data?.cities) {
      props.data.cities.map((location, i) => {
          hot_locations.push(location);
      });
    }
    props?.data?.components?.map((item) => {
      if (item.carousel == "itinerary-1") {
        setUserItineraries(item.itineraries);
      }
    });
    console.log("locations is:", hot_locations);
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
          title={`${convertDbNameToCapitalFirst(props.data.slug)} Trip Planner`}
          page={"Continent Page"}
          type={props.type}
          destination={props.destination}
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
                Top countries to visit in{" "}
                {props.destination
                  .split("_")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
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

          {props?.data?.components?.length > 0 &&
            props?.data?.components?.map((component) => (
              <>
                <div className="mx-3 space-y-12 mt-5">
                  <div className="space-y-3">
                    <PrimaryHeading className="mx-auto text-center">
                      {component?.heading}
                    </PrimaryHeading>
                    <SecondaryHeading className="mx-auto text-center">
                      {component.text}
                    </SecondaryHeading>
                  </div>

                  {component.carousel === "destination-1" ? (
                    <>
                      <Destination1Carousel
                        handlePlanButton={handlePlanButton}
                        setDestination={setDestination}
                        packages={[
                          ...component.cities,
                          ...component.states,
                          ...component.countries,
                        ]}
                      />
                      <PlanYourTripButton text={"Start your journey now!"} />
                    </>
                  ) : component.carousel === "destination-2" ? (
                    <></>
                  ) : component.carousel === "itinerary-1" ? (
                    <>
                      <Itinerary1Carousel itineraries={component.itineraries} />
                      <PlanYourTripButton />
                    </>
                  ) : component.carousel === "itinerary-2" ? (
                    <div className="w-full relative">
                      {props.slug === "honeymoon-2025" && (
                        <>
                          <Image
                            src={`https://d31aoa0ehgvjdi.cloudfront.net/media/themes/red-hearts.png`}
                            className="object-fill absolute -left-[1rem] top-[10rem] md:-left-[9rem] md:top-0"
                            alt="Tilted Hearts"
                            height={300}
                            width={500}
                            style={{
                              opacity: "50%",
                            }}
                          />

                          <Image
                            src={`https://d31aoa0ehgvjdi.cloudfront.net/media/themes/red-hearts.png`}
                            className="object-fill absolute -right-[1rem] top-[35rem] md:-right-[6rem] md:top-0"
                            alt="Tilted Hearts"
                            height={300}
                            width={500}
                            style={{
                              opacity: "50%",
                            }}
                          />
                        </>
                      )}

                      <Itinerary2Carousel elements={component.elements} />
                    </div>
                  ) : component.carousel === "activity-1" ? (
                    <>
                      <Activity1Carousel activities={component.activities} />{" "}
                      <PlanYourTripButton text={"Create your free itinerary"} />
                    </>
                  ) : component.carousel === "review-1" ? (
                    <div className="relative">
                      {props.slug === "honeymoon-2025" && (
                        <div className="-z-10 w-fit absolute -top-[16rem] right-0 md:-top-[9rem] overflow-hidden">
                          <Image
                            src={`https://d31aoa0ehgvjdi.cloudfront.net/media/themes/tilted-heart.png`}
                            className="object-fill"
                            alt="Tilted Hearts"
                            height={200}
                            width={200}
                            style={{ transform: "rotate(45deg)" }}
                          />
                        </div>
                      )}

                      <Reviews1Carousel reviews={component.reviews} />
                      <PlanYourTripButton />
                    </div>
                  ) : component.carousel == "poi-1" ? (
                    <>
                    <Poi1Carousel pois={component.pois} />
                    <PlanYourTripButton />
                    </>
                  ) : null}
                </div>
              </>
            ))}

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
                  ? "Popular locations to visit in " +
                    props.data.slug
                      .split("_")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")
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

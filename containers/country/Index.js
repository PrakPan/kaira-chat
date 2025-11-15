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
import HeroSection from "../../components/revamp/destination/HeroSection.jsx";
import MostLovedItinerariesSection from "../../components/revamp/destination/MostLovedItinerariesSection.jsx";
import { imgUrlEndPoint } from "../../components/theme/ThemeConstants.js";
const MapBox = dynamic(() => import("../../components/Map.js"), {
  ssr: false,
});
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DestinationCard from "../../components/revamp/common/components/card/DestinationCard.jsx";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import POIDetailsDrawer from "../../components/drawers/poiDetails/POIDetailsDrawer.js";
import CtaBoardingSection from "../../components/revamp/home/CtaBoardingSection.jsx";
import JourneySimplified from "../../components/revamp/home/JourneySimplified.jsx";
import WhatMakesUsSection from "../../components/revamp/home/WhatMakesUsSection.jsx";
import CurveImageGallery from "../../components/theme/CurveImageGallery.jsx";
import PartnersSection from "../../components/theme/PartnersSection.jsx";

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

  const [activeDrawer, setActiveDrawer] = useState(null);

  const handleOpenDrawer = (data, type) => {
    setActiveDrawer({ data, type });
  };

  const handleCloseDrawer = () => {
    setActiveDrawer(null);
  };

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
      {/* {isPageWide ? (
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
      )} */}

      <div>
        <HeroSection
          title={validateTextSize(
            `Craft a personalized itinerary to ${props.data.name} now!`,
            9,
            `Craft a trip to ${props.data.name} now!`
          )}
          image={`${imgUrlEndPoint}${props?.data?.image}`}
        />
        {/* <HeroBanner
          image={props?.data?.image}
          page_id={props?.data?.id}
          type={props?.type}
          destination={props?.data?.name}
          title={`${props?.data?.name} Trip Planner`}
          page={"Country Page"}
        /> */}
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
              {/* <Locations
                locations={hotLocations}
                page={"Country Page"}
                state={props?.data?.name}
                viewall
              ></Locations> */}
              <div className="relative px-2 sm:px-0">
                <Swiper
                  style={{ height: "376px" }}
                  modules={[Navigation]}
                  spaceBetween={16}
                  slidesPerView={1}
                  navigation={{
                    nextEl: ".PlacesBragSection-next",
                    prevEl: ".PlacesBragSection-prev",
                    clickable: true,
                  }}
                  breakpoints={{
                    // when window width is >= 640px
                    640: {
                      slidesPerView: 1.5,
                      spaceBetween: 16,
                    },
                    // when window width is >= 768px
                    768: {
                      slidesPerView: 2,
                      spaceBetween: 20,
                    },
                    // when window width is >= 1024px
                    1024: {
                      slidesPerView: 3,
                      spaceBetween: 24,
                    },
                  }}
                >
                  {hotLocations.map((destination) => (
                    <SwiperSlide key={destination.id}>
                      <div className="w-full px-1">
                        <DestinationCard
                          title={destination.title || destination.name}
                          description={
                            destination.description || destination.tagline
                          }
                          one_liner_description={destination?.state?.one_liner_description || destination?.one_liner_description}
                          image={destination.image}
                          tags={
                            destination.tags ||
                            (destination.continent
                              ? [destination.continent]
                              : [])
                          }
                          gradientOverlay={destination.gradientOverlay}
                          onClick={() => {
                            console.log(
                              `Clicked on ${
                                destination.name || destination.title
                              }`
                            );
                            window.location.replace("/" + destination.path);
                          }}
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
                <div className="PlacesBragSection-prev" aria-hidden>
                  <div
                    className="absolute left-3 sm:left-1 z-10"
                    style={{
                      top: "calc(376px / 2)",
                      transform: "translateY(-50%)",
                    }}
                  >
                    <div className="w-8 sm:w-10 h-8 sm:h-10 bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center transform transition-all duration-300 sm:hover:scale-110 cursor-pointer">
                      <FontAwesomeIcon
                        icon={faChevronLeft}
                        className="text-white group-hover:text-white text-md transition-colors duration-300 transform"
                      />
                    </div>
                  </div>
                </div>

                {/* Custom Next Button - centered to image height (376px) */}
                <div className="PlacesBragSection-next" aria-hidden>
                  <div
                    className="absolute right-3 sm:right-1 z-10"
                    style={{
                      top: "calc(376px / 2)",
                      transform: "translateY(-50%)",
                    }}
                  >
                    <div className="w-8 sm:w-10 h-8 sm:h-10 bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center transform transition-all duration-300 sm:hover:scale-110 cursor-pointer">
                      <FontAwesomeIcon
                        icon={faChevronRight}
                        className="text-white hover:text-white text-md transition-colors duration-300 transform"
                      />
                    </div>
                  </div>
                </div>
              </div>
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
            fontWeight="400"
            borderRadius="6px"
            margin="2rem auto"
            padding="0.8rem 2rem"
            bgColor="#07213A"
            color="white"
          >
            + Create a trip now!
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
              {/* <MostLovedItinerariesSection apiItineraries={userItineraries} /> */}
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
              {/* <Activity
                data={props?.data}
                activities={props?.data?.activities}
                city={props?.data?.name}
                handlePlanButtonClick={handlePlanButtonClick}
                page={"Country Page"}
                removeDelete={true}
              /> */}

              <div className="relative px-2 sm:px-0">
                <Swiper
                  style={{ height: "auto" }}
                  modules={[Navigation]}
                  spaceBetween={16}
                  slidesPerView={1}
                  navigation={{
                    nextEl: ".PlacesBragSection-n",
                    prevEl: ".PlacesBragSection-p",
                    clickable: true,
                  }}
                  breakpoints={{
                    // when window width is >= 640px
                    640: {
                      slidesPerView: 1.5,
                      spaceBetween: 16,
                    },
                    // when window width is >= 768px
                    768: {
                      slidesPerView: 2,
                      spaceBetween: 20,
                    },
                    // when window width is >= 1024px
                    1024: {
                      slidesPerView: 3,
                      spaceBetween: 24,
                    },
                  }}
                >
                  {props.data.activities.map((destination) => (
                    <SwiperSlide key={destination.id}>
                      <div className="w-full px-1">
                        <DestinationCard
                          title={destination.title || destination.name}
                          description={
                            destination.description || destination.tagline
                          }
                          image={destination.image}
                          rating={destination.rating}
                          reviewCount={destination.user_ratings_total}
                          showImageText={false}
                          tags={
                            destination.tags ||
                            (destination.continent
                              ? [destination.continent]
                              : [])
                          }
                          gradientOverlay={destination.gradientOverlay}
                          onClick={() =>
                            handleOpenDrawer(destination, "activity")
                          }
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
                <div className="PlacesBragSection-p" aria-hidden>
                  <div
                    className="absolute left-3 sm:left-1 z-10"
                    style={{
                      top: "calc(376px / 2)",
                      transform: "translateY(-50%)",
                    }}
                  >
                    <div className="w-8 sm:w-10 h-8 sm:h-10 bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center transform transition-all duration-300 sm:hover:scale-110 cursor-pointer">
                      <FontAwesomeIcon
                        icon={faChevronLeft}
                        className="text-white group-hover:text-white text-md transition-colors duration-300 transform"
                      />
                    </div>
                  </div>
                </div>

                {/* Custom Next Button - centered to image height (376px) */}
                <div className="PlacesBragSection-n" aria-hidden>
                  <div
                    className="absolute right-3 sm:right-1 z-10"
                    style={{
                      top: "calc(376px / 2)",
                      transform: "translateY(-50%)",
                    }}
                  >
                    <div className="w-8 sm:w-10 h-8 sm:h-10 bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center transform transition-all duration-300 sm:hover:scale-110 cursor-pointer">
                      <FontAwesomeIcon
                        icon={faChevronRight}
                        className="text-white hover:text-white text-md transition-colors duration-300 transform"
                      />
                    </div>
                  </div>
                </div>
              </div>
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
              {/* <Poi
                data={props?.data}
                pois={props?.data?.pois}
                city={props?.data?.name}
                handlePlanButtonClick={handlePlanButtonClick}
                page={"Country Page"}
                removeDelete={true}
                removeChange={true}
              /> */}
              <div className="relative px-2 sm:px-0">
                <Swiper
                  style={{ height: "auto" }}
                  modules={[Navigation]}
                  spaceBetween={16}
                  slidesPerView={1}
                  navigation={{
                    nextEl: ".PlacesBragSection-ne",
                    prevEl: ".PlacesBragSection-pr",
                    clickable: true,
                  }}
                  breakpoints={{
                    // when window width is >= 640px
                    640: {
                      slidesPerView: 1.5,
                      spaceBetween: 16,
                    },
                    // when window width is >= 768px
                    768: {
                      slidesPerView: 2,
                      spaceBetween: 20,
                    },
                    // when window width is >= 1024px
                    1024: {
                      slidesPerView: 3,
                      spaceBetween: 24,
                    },
                  }}
                >
                  {props.data.pois.map((destination) => (
                    <SwiperSlide key={destination.id}>
                      <div className="w-full px-1">
                        <DestinationCard
                          title={destination.title || destination.name}
                          description={
                            destination.description || destination.tagline
                          }
                          image={destination.image}
                          rating={destination.rating}
                          reviewCount={destination.user_ratings_total}
                          showImageText={false}
                          tags={
                            destination.tags ||
                            (destination.continent
                              ? [destination.continent]
                              : [])
                          }
                          gradientOverlay={destination.gradientOverlay}
                          onClick={() => handleOpenDrawer(destination, "poi")}
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
                <div className="PlacesBragSection-pr" aria-hidden>
                  <div
                    className="absolute left-3 sm:left-1 z-10"
                    style={{
                      top: "calc(376px / 2)",
                      transform: "translateY(-50%)",
                    }}
                  >
                    <div className="w-8 sm:w-10 h-8 sm:h-10 bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center transform transition-all duration-300 sm:hover:scale-110 cursor-pointer">
                      <FontAwesomeIcon
                        icon={faChevronLeft}
                        className="text-white group-hover:text-white text-md transition-colors duration-300 transform"
                      />
                    </div>
                  </div>
                </div>

                {/* Custom Next Button - centered to image height (376px) */}
                <div className="PlacesBragSection-ne" aria-hidden>
                  <div
                    className="absolute right-3 sm:right-1 z-10"
                    style={{
                      top: "calc(376px / 2)",
                      transform: "translateY(-50%)",
                    }}
                  >
                    <div className="w-8 sm:w-10 h-8 sm:h-10 bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center transform transition-all duration-300 sm:hover:scale-110 cursor-pointer">
                      <FontAwesomeIcon
                        icon={faChevronRight}
                        className="text-white hover:text-white text-md transition-colors duration-300 transform"
                      />
                    </div>
                  </div>
                </div>
              </div>
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
              {/* <OldLocations
                locations={props.data.states}
                page_id={props.data.id}
                destination={props.data.name}
                viewall
                country={props.data.name}
                planner
                page={"Country Page"}
              ></OldLocations> */}
              <div className="relative px-2 sm:px-0">
                <Swiper
                  style={{ height: "376px" }}
                  modules={[Navigation]}
                  spaceBetween={16}
                  slidesPerView={1}
                  navigation={{
                    nextEl: ".PlacesBragSection-nex",
                    prevEl: ".PlacesBragSection-pre",
                    clickable: true,
                  }}
                  breakpoints={{
                    // when window width is >= 640px
                    640: {
                      slidesPerView: 1.5,
                      spaceBetween: 16,
                    },
                    // when window width is >= 768px
                    768: {
                      slidesPerView: 2,
                      spaceBetween: 20,
                    },
                    // when window width is >= 1024px
                    1024: {
                      slidesPerView: 3,
                      spaceBetween: 24,
                    },
                  }}
                >
                  {props.data.states.map((destination) => (
                    <SwiperSlide key={destination.id}>
                      <div className="w-full px-1">
                        <DestinationCard
                          title={destination.title || destination.name}
                          description={
                            destination.description || destination.tagline
                          }
                          one_liner_description={destination?.one_liner_description}
                          image={destination.image}
                          tags={
                            destination.tags ||
                            (destination.continent
                              ? [destination.continent]
                              : [])
                          }
                          gradientOverlay={destination.gradientOverlay}
                          onClick={() => {
                            console.log(
                              `Clicked on ${
                                destination.name || destination.title
                              }`
                            );
                            window.location.replace("/" + destination.path);
                          }}
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
                <div className="PlacesBragSection-pre" aria-hidden>
                  <div
                    className="absolute left-3 sm:left-1 z-10"
                    style={{
                      top: "calc(376px / 2)",
                      transform: "translateY(-50%)",
                    }}
                  >
                    <div className="w-8 sm:w-10 h-8 sm:h-10 bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center transform transition-all duration-300 sm:hover:scale-110 cursor-pointer">
                      <FontAwesomeIcon
                        icon={faChevronLeft}
                        className="text-white group-hover:text-white text-md transition-colors duration-300 transform"
                      />
                    </div>
                  </div>
                </div>

                {/* Custom Next Button - centered to image height (376px) */}
                <div className="PlacesBragSection-nex" aria-hidden>
                  <div
                    className="absolute right-3 sm:right-1 z-10"
                    style={{
                      top: "calc(376px / 2)",
                      transform: "translateY(-50%)",
                    }}
                  >
                    <div className="w-8 sm:w-10 h-8 sm:h-10 bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center transform transition-all duration-300 sm:hover:scale-110 cursor-pointer">
                      <FontAwesomeIcon
                        icon={faChevronRight}
                        className="text-white hover:text-white text-md transition-colors duration-300 transform"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <Button
                onclick={() =>
                  handlePlanButtonClick(
                    `Trending destinations across ${props.data.name}`
                  )
                }
                borderWidth="1px"
                fontWeight="400"
                borderRadius="6px"
                margin="2rem auto"
                padding="0.8rem 2rem"
                bgColor="#07213A"
                color="white"
              >
                + Create a trip now!
              </Button>
            </>
          ) : null}

          {/* <H3
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
          ></BannerTwo> */}

          <JourneySimplified />

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
              {/* <SwiperLocations
                locations={props.locations}
                page_id={props.data.id}
                destination={props.data.name}
                viewall
                country
                page={"Country Page"}
                continent={props.data.continent}
              ></SwiperLocations> */}
              <div className="relative px-2 sm:px-0">
                <Swiper
                  style={{ height: "376px" }}
                  modules={[Navigation]}
                  spaceBetween={16}
                  slidesPerView={1}
                  navigation={{
                    nextEl: ".PlacesBragSection-nextt",
                    prevEl: ".PlacesBragSection-prevv",
                    clickable: true,
                  }}
                  breakpoints={{
                    // when window width is >= 640px
                    640: {
                      slidesPerView: 1.5,
                      spaceBetween: 16,
                    },
                    // when window width is >= 768px
                    768: {
                      slidesPerView: 2,
                      spaceBetween: 20,
                    },
                    // when window width is >= 1024px
                    1024: {
                      slidesPerView: 3,
                      spaceBetween: 24,
                    },
                  }}
                >
                  {props.locations.map((destination) => (
                    <SwiperSlide key={destination.id}>
                      <div className="w-full px-1">
                        <DestinationCard
                          title={destination.title || destination.name}
                          description={
                            destination.description || destination.tagline
                          }
                          one_liner_description={destination?.one_liner_description}
                          image={destination.image}
                          tags={
                            destination.tags ||
                            (destination.continent
                              ? [destination.continent]
                              : [])
                          }
                          gradientOverlay={destination.gradientOverlay}
                          onClick={() => {
                            console.log(
                              `Clicked on ${
                                destination.name || destination.title
                              }`
                            );
                            window.location.replace("/" + destination.path);
                          }}
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
                <div className="PlacesBragSection-prevv" aria-hidden>
                  <div
                    className="absolute left-3 sm:left-1 z-10"
                    style={{
                      top: "calc(376px / 2)",
                      transform: "translateY(-50%)",
                    }}
                  >
                    <div className="w-8 sm:w-10 h-8 sm:h-10 bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center transform transition-all duration-300 sm:hover:scale-110 cursor-pointer">
                      <FontAwesomeIcon
                        icon={faChevronLeft}
                        className="text-white group-hover:text-white text-md transition-colors duration-300 transform"
                      />
                    </div>
                  </div>
                </div>

                {/* Custom Next Button - centered to image height (376px) */}
                <div className="PlacesBragSection-nextt" aria-hidden>
                  <div
                    className="absolute right-3 sm:right-1 z-10"
                    style={{
                      top: "calc(376px / 2)",
                      transform: "translateY(-50%)",
                    }}
                  >
                    <div className="w-8 sm:w-10 h-8 sm:h-10 bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center transform transition-all duration-300 sm:hover:scale-110 cursor-pointer">
                      <FontAwesomeIcon
                        icon={faChevronRight}
                        className="text-white hover:text-white text-md transition-colors duration-300 transform"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <Button
                onclick={() =>
                  handlePlanButtonClick(
                    `Other destinations to explore in ${props.data.continent}`
                  )
                }
                borderWidth="1px"
                fontWeight="400"
                borderRadius="6px"
                margin="2rem auto"
                padding="0.8rem 2rem"
                bgColor="#07213A"
                color="white"
              >
                + Create a trip now!
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
                fontWeight="400"
                borderRadius="6px"
                margin="2rem auto"
                padding="0.8rem 2rem"
                bgColor="#07213A"
                color="white"
              >
                + Create a trip now!
              </Button>
            </>
          ) : (
            <></>
          )}

          {/* <H3
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
          /> */}
          <WhatMakesUsSection />

          {/* <H3
            style={{
              textAlign: isPageWide ? "left" : "center",
              margin: "4rem 0 2.5rem 0",
            }}
          >
            Happy Community of The Tarzan Way
          </H3>
          <Reviews></Reviews> */}

          <CurveImageGallery />

          {/* <H3
            style={{
              textAlign: isPageWide ? "left" : "center",
              margin: "4rem 0 2.5rem 0",
            }}
          >
            What they say?
          </H3> */}
          {/* <AsSeenIn /> */}
          <PartnersSection />

          <ChatWithUs planner page_id={props.data.id}></ChatWithUs>
        </SetWidthContainer>
      </div>

      <CtaBoardingSection />

      {activeDrawer?.type === "poi" && (
        <POIDetailsDrawer
          show={true}
          iconId={activeDrawer.data.id}
          handleCloseDrawer={handleCloseDrawer}
          name={activeDrawer.data.name}
          id={activeDrawer.data.id}
          activityData={{
            type: "poi",
            id: activeDrawer.data.id,
          }}
          removeDelete={true}
          removeChange={true}
        />
      )}

      {activeDrawer?.type === "activity" && (
        <POIDetailsDrawer
          show={true}
          ActivityiconId={activeDrawer.data.id}
          handleCloseDrawer={handleCloseDrawer}
          name={activeDrawer.data.name}
          removeDelete={true}
        ></POIDetailsDrawer>
      )}
    </div>
  );
};

export default Index;

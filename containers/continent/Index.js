import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import DesktopPersonaliseBanner from "../../components/containers/Banner";
import HeroBanner from "../../components/containers/HeroBanner/HeroBanner";
import MobileBanner from "../city/Banner/Mobile";
import media from "../../components/media";
import validateTextSize from "../../services/textSizeValidator";
import styled from "styled-components";
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
import { logEvent } from "../../services/ga/Index.js";
import H3 from "../../components/heading/H3.js";
// import Navigation from "../../components/theme/Navigation.jsx";
import PrimaryHeading from "../../components/heading/PrimaryHeading.jsx";
import SecondaryHeading from "../../components/heading/Secondary.jsx";
import Destination1Carousel from "../../components/theme/Destination1Carousel.jsx";
import { PlanYourTripButton } from "../travelplanner/ThemePage.jsx";
import Itinerary1Carousel from "../../components/theme/Itinerary1Carousel.jsx";
import Image from "next/image.js";
import Itinerary2Carousel from "../../components/theme/Itinerary2Carousel.jsx";
import Activity1Carousel from "../../components/theme/Activity1Carousel.jsx";
import Reviews1Carousel from "../../components/theme/Reviews1Carousel.jsx";
import { convertDbNameToCapitalFirst } from "../../helper/convertDbnameToCapitalFirst.js";
import Poi from "../newcityplanner/pois/Index.js";
import TailoredFormMobileModal from "../../components/modals/TailoredFomrMobile.js";
import Overview from "../themes/Overview.jsx";
import Element from "../newcityplanner/elements/Index.js";
import LocationsBlog from "../../components/containers/plannerlocations/Index.js";
import Activity from "../newcityplanner/activities/Index.js";
import HeroSection from "../../components/revamp/destination/HeroSection.jsx";
import MostLovedItinerariesSection from "../../components/revamp/destination/MostLovedItinerariesSection.jsx";
import { imgUrlEndPoint } from "../../components/theme/ThemeConstants.js";
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
import TravelVibeSection from "../../components/revamp/home/TravelVibeSection.jsx";
import ActivityCard from "../newcityplanner/activities/ActivityCard.js";
import PoiCard from "../newcityplanner/pois/PoiCard.js";
import POIDetailsDrawer from "../../components/drawers/poiDetails/POIDetailsDrawer.js";
import CtaBoardingSection from "../../components/revamp/home/CtaBoardingSection.jsx";
import JourneySimplified from "../../components/revamp/home/JourneySimplified.jsx";
import WhatMakesUsSection from "../../components/revamp/home/WhatMakesUsSection.jsx";
import CurveImageGallery from "../../components/theme/CurveImageGallery.jsx";
import styles from "../../styles/pages/revamp/home.module.scss";
import PartnersSection from "../../components/theme/PartnersSection.jsx";
import TestimonialCarousel from "../../components/theme/TestimonialCarousel.jsx";
import DesktopBanner from "../../components/containers/Banner.js"


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
  const router = useRouter();
  let isPageWide = media("(min-width: 768px)");
  const [userItineraries, setUserItineraries] = useState([]);
  const [hotLocations, setHotLocations] = useState([]);
  const [showTailoredModal, setShowTailoredModal] = useState(false);
  const [destination, setDestination] = useState(null);
  const [desktopBannerLoading, setDesktopBannerLoading] = useState(false);

  const [activeDrawer, setActiveDrawer] = useState(null);

  const handleOpenDrawer = (data, type) => {
    setActiveDrawer({ data, type });
  };

  const handleCloseDrawer = () => {
    setActiveDrawer(null);
  };

  const handlePlanButton = (pageId, destination, type) => {
    handlePlanButtonClick;
  };

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
    setHotLocations(hot_locations);
  }, [props?.data?.components?.[0]?.itineraries]);

  const handlePlanButtonClick = (location) => {
    // openTailoredModal(
    
    //   router,
    //   props.data.id,
    //   convertDbNameToCapitalFirst(props.data.slug),
    //   props.type
    // );
    router.push({
        pathname: "/new-trip",
        query: { source: props?.data?.slug || 'home' }
    });

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
      <div>
        <HeroSection
          title={validateTextSize(
            `Craft a personalized itinerary to ${convertDbNameToCapitalFirst(
              props.data.slug
            )} now!`,
            9,
            `Craft a trip to ${props.data.destination} now!`
          )}
          image={`${imgUrlEndPoint}${props.data.image}`}
          slug={props?.data?.slug}
        />

        <SetWidthContainer>

             <DesktopBanner
            loading={desktopBannerLoading}
            onclick={() =>
              {router.push({
        pathname: "/new-trip",
        query: { source: props?.data?.slug || 'home' }
    });}
              // openTailoredModal(
              //   router,
              //   props.data.id,
              //   convertDbNameToCapitalFirst(props.data.slug)
              // )
            }
            text={`Craft a personalized itinerary${
              props.data.slug
                ? " to " +
                  convertDbNameToCapitalFirst(props.data.slug) +
                  " now"
                : ""
            }!`}
          ></DesktopBanner>


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
                  {props.locations.map((destination) => (
                    <SwiperSlide key={destination.id}>
                      <div className="w-full px-1">
                        <DestinationCard
                          title={destination.title || destination.name}
                          description={
                            destination.one_liner_description ||
                            destination.tagline
                          }
                          one_liner_description={
                            destination.one_liner_description
                          }
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
              <Button
                onclick={() =>
                  handlePlanButtonClick(
                    `Top countries to visit in ${props?.data?.destination}`
                  )
                }
                borderWidth="1px"
                fontWeight="300"
                borderRadius="8px"
                margin="2rem auto"
                padding="0.8rem 2rem"
                bgColor="#07213A"
                color="white"
              >
                Create your free itinerary
              </Button>
            </>
          ) : null}

          {/* <MapGridContainer> */}
          {props?.data?.slug != 'europe-continent' && <Overview
            heading={props.data.overview_heading}
            text={props.data.overview_text}
            image={props.data.overview_image}
            slug={props.data.slug}
            page_id={props.data.id}
            type={props.type}
            destination={convertDbNameToCapitalFirst(props.data.slug)}
          ></Overview>}

          {/* <MapContainer>
              {props.data.cities && props.data.cities.length ? (
                <MapBox
                  InfoWindowContainer={InfoWindowContainer}
                  locations={props.data.cities}
                  height="300px"
                />
              ) : null}
            </MapContainer> */}
          {/* </MapGridContainer> */}

          {/* <Button
            onclick={() =>
              handlePlanButtonClick(
                `A little about ${props?.data?.destination}`
              )
            }
            borderWidth="1px"
            fontWeight="300"
            borderRadius="8px"
            margin="2rem auto"
            padding="0.8rem 2rem"
            bgColor="#07213A"
            color="white"
          >
            Create your travel plan now!
          </Button> */}

          {props?.data?.components?.length > 0 &&
            props?.data?.components?.map((component) => {
              const isActivityOrPoi =
                component.carousel.toLowerCase().includes("activity") ||
                component.carousel.toLowerCase().includes("poi");
              return (
                <>
                  <div className="py-12 sm:py-16 lg:py-20 px-0 sm:px-4 lg:px-8">
                    <div className="space-y-3 lg:py-8">
                      <PrimaryHeading
                        className={`mx-auto text-center ${
                          isActivityOrPoi ? "text-left" : ""
                        }`}
                      >
                        {component?.heading}
                      </PrimaryHeading>
                      <SecondaryHeading className="mx-auto text-center">
                        {component.text}
                      </SecondaryHeading>
                    </div>

                    {component.carousel === "destination-1" ? (
                      <>
                        <Destination1Carousel
                          handlePlanButton={handlePlanButtonClick}
                          setDestination={setDestination}
                          packages={[
                            ...component.cities,
                            ...component.states,
                            ...component.countries,
                          ]}
                        />
                        <PlanYourTripButton
                          page_id={props.data.id}
                          destination={convertDbNameToCapitalFirst(
                            props.data.slug
                          )}
                          type={props?.type}
                        />
                      </>
                    ) : component.carousel === "destination-2" ? (
                      <>
                        <Element
                          data={component.elements}
                          elements={component?.elements}
                          city={component?.name}
                          // handlePlanButtonClick={()=>{}}
                          // {handlePlanButtonClick}
                          slug={props?.slug}
                          page={"Country Page"}
                        />
                        <PlanYourTripButton text={"+ Plan Itinerary For Free"} />
                      </>
                    ) : component.carousel === "destination-3" ? (
                      <>
                        {/* <SwiperLocations
                        locations={component?.countries}
                        page_id={component?.id}
                        destination={component?.name}
                        viewall
                        country
                        page={"Country Page"}
                        continent={component?.countries}
                      ></SwiperLocations> */}

                        <div className="relative px-2 sm:px-0">
                          <Swiper
                            style={{ height: "386px" }}
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
                            {component?.countries.map((destination) => (
                              <SwiperSlide key={destination.id}>
                                <div className="w-full px-1">
                                  <DestinationCard
                                    title={
                                      destination.title || destination.name
                                    }
                                    description={
                                      destination.one_liner_description ||
                                      destination.tagline
                                    }
                                    one_liner_description={
                                      destination.one_liner_description
                                    }
                                    image={destination.image}
                                    tags={
                                      destination.tags ||
                                      (destination.continent
                                        ? [destination.continent]
                                        : [])
                                    }
                                    gradientOverlay={
                                      destination.gradientOverlay
                                    }
                                    onClick={() => {
                                      console.log(
                                        `Clicked on ${
                                          destination.name || destination.title
                                        }`
                                      );
                                      window.location.replace(
                                        "/" + destination.path
                                      );
                                    }}
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

                        <PlanYourTripButton
                          text={"Create your travel plan now!"}
                        />
                      </>
                    ) : component.carousel === "destination-4" ? (
                      <>
                        <div className="space-y-4">
                          {/* <Locations
                          locations={component?.cities}
                          page={"Continent Page"}
                          viewall
                        ></Locations> */}
                          <div className="relative px-2 sm:px-0">
                            <Swiper
                              style={{ height: "386px" }}
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
                              {component?.cities.map((destination) => (
                                <SwiperSlide key={destination.id}>
                                  <div className="w-full px-1">
                                    <DestinationCard
                                      title={
                                        destination.title || destination.name
                                      }
                                      description={
                                        destination.one_liner_description ||
                                        destination.tagline
                                      }
                                      one_liner_description={
                                        destination.one_liner_description
                                      }
                                      image={destination.image}
                                      tags={
                                        destination.tags ||
                                        (destination.continent
                                          ? [destination.continent]
                                          : [])
                                      }
                                      gradientOverlay={
                                        destination.gradientOverlay
                                      }
                                      onClick={() => {
                                        console.log(
                                          `Clicked on ${
                                            destination.name ||
                                            destination.title
                                          }`
                                        );
                                        window.location.replace(
                                          "/" + destination.path
                                        );
                                      }}
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
                        </div>
                      </>
                    ) : component.carousel === "destination-5" ? (
                      <>
                        <Poi
                          elevation={component?.elevation}
                          data={component?.data}
                          thingsToDoPage={component?.thingsToDoPage}
                          pois={component?.pois}
                          city={component?.name}
                        />
                      </>
                    ) : component.carousel === "destination-6" ? (
                      <>
                        <Continentcarousel
                          data={props.continetCarousel}
                          page={"Country Page"}
                        ></Continentcarousel>
                        <PlanYourTripButton
                          text={"Create your travel plan now!"}
                        />
                      </>
                    ) : component.carousel === "state-1" ? (
                      <>
                        <LocationsBlog
                          locations={component?.states}
                          page_id={component?.id}
                          destination={component?.name}
                          viewall
                          country={component?.name}
                          planner
                          page={"Country Page"}
                        ></LocationsBlog>
                        <PlanYourTripButton
                          text={"Create your travel plan now!"}
                        />
                      </>
                    ) : component.carousel === "Activity-2" ? (
                      <>
                        {/* <Activity
                        data={component.activities}
                        activities={component?.activities}
                        city={component?.name}
                        // handlePlanButtonClick={()=>{}}
                        // {handlePlanButtonClick}
                        slug={props?.slug}
                        page={"Country Page"}
                      /> */}
                        <div className="relative px-2 sm:px-0">
                          <Swiper
                            style={{ height: "auto" }}
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
                            {component?.activities.map((activity) => (
                              <SwiperSlide key={activity.id}>
                                <div className="w-full px-1">
                                  <DestinationCard
                                    title={activity.title || activity.name}
                                    description={
                                      activity.one_liner_description ||
                                      activity.tagline
                                    }
                                    one_liner_description={
                                      activity.one_liner_description
                                    }
                                    image={activity.image}
                                    rating={activity.rating}
                                    reviewCount={activity.user_ratings_total}
                                    showImageText={false}
                                    tags={
                                      activity.tags ||
                                      (activity.continent
                                        ? [activity.continent]
                                        : [])
                                    }
                                    gradientOverlay={activity.gradientOverlay}
                                    onClick={() =>
                                      handleOpenDrawer(activity, "activity")
                                    }
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
                        <PlanYourTripButton text={"+ Plan Itinerary For Free"} />
                      </>
                    ) : component.carousel === "itinerary-1" ? (
                      <>
                        <Itinerary1Carousel
                          itineraries={component.itineraries}
                        />
                        {/* <MostLovedItinerariesSection
                          apiItineraries={component.itineraries}
                        /> */}
                        <PlanYourTripButton
                          page_id={props.data.id}
                          destination={convertDbNameToCapitalFirst(
                            props.data.slug
                          )}
                          type={props?.type}
                        />
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
                        {/* <Activity1Carousel activities={component.activities} />{" "} */}
                        <div className="relative px-2 sm:px-0">
                          <Swiper
                            style={{ height: "auto" }}
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
                                slidesPerView: 4,
                                spaceBetween: 24,
                              },
                            }}
                          >
                            {component?.activities.map((activity) => (
                              <SwiperSlide key={activity.id}>
                                <div className="w-full px-1">
                                  <DestinationCard
                                    title={activity.title || activity.name}
                                    description={
                                      activity.one_liner_description ||
                                      activity.tagline
                                    }
                                    one_liner_description={
                                      activity.one_liner_description
                                    }
                                    image={activity.image}
                                    rating={activity.rating}
                                    reviewCount={activity.user_ratings_total}
                                    showImageText={false}
                                    tags={
                                      activity.tags ||
                                      (activity.continent
                                        ? [activity.continent]
                                        : [])
                                    }
                                    gradientOverlay={activity.gradientOverlay}
                                    onClick={() =>
                                      handleOpenDrawer(activity, "activity")
                                    }
                                  />
                                </div>
                              </SwiperSlide>
                            ))}
                          </Swiper>
                          {/* Custom Prev Button */}
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
                        <PlanYourTripButton
                          page_id={props.data.id}
                          destination={convertDbNameToCapitalFirst(
                            props.data.slug
                          )}
                          type={props?.type}
                        />
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
                        <PlanYourTripButton
                          page_id={props.data.id}
                          destination={convertDbNameToCapitalFirst(
                            props.data.slug
                          )}
                          type={props?.type}
                        />
                      </div>
                    ) : component.carousel == "poi-1" ? (
                      <>
                        {/* <Poi
                        data={props?.data}
                        pois={component.pois}
                        city={props.destination}
                        page={"Continent Page"}
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
                              nextEl: ".PlacesBragSection-nn",
                              prevEl: ".PlacesBragSection-pp",
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
                                slidesPerView: 4,
                                spaceBetween: 24,
                              },
                            }}
                          >
                            {component?.pois.map((poi) => (
                              <SwiperSlide key={poi.id}>
                                <div className="w-full px-1">
                                  <DestinationCard
                                    title={poi.title || poi.name}
                                    description={
                                      poi.one_liner_description || poi.tagline
                                    }
                                    one_liner_description={
                                      poi.one_liner_description
                                    }
                                    image={poi.image}
                                    rating={poi.rating}
                                    reviewCount={poi.user_ratings_total}
                                    showImageText={false}
                                    tags={
                                      poi.tags ||
                                      (poi.continent ? [poi.continent] : [])
                                    }
                                    gradientOverlay={poi.gradientOverlay}
                                    onClick={() => handleOpenDrawer(poi, "poi")}
                                  />
                                </div>
                              </SwiperSlide>
                            ))}
                          </Swiper>
                          {/* Custom Prev Button */}
                          <div className="PlacesBragSection-pp" aria-hidden>
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
                          <div className="PlacesBragSection-nn" aria-hidden>
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

                        {/* <Poi1Carousel pois={component.pois} /> */}
                        <PlanYourTripButton
                          page_id={props.data.id}
                          destination={convertDbNameToCapitalFirst(
                            props.data.slug
                          )}
                          type={props?.type}
                        />
                      </>
                    ) : null}
                  </div>
                </>
              );
            })}

          {/* <H3
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
          </div> */}

          <JourneySimplified />

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
              {/* <TravelVibeSection travels={props.continetCarousel}/> */}
              <Continentcarousel
                data={props.continetCarousel}
                page={"Continent Page"}
              ></Continentcarousel>
              <Button
                onclick={() =>
                  handlePlanButtonClick("Plan your trip anywhere in the world")
                }
                borderWidth="1px"
                fontWeight="300"
                borderRadius="8px"
                margin="2rem auto"
                padding="0.8rem 2rem"
                bgColor="#07213A"
                color="white"
              >
                Create your free itinerary
              </Button>
            </>
          ) : (
            <></>
          )}

          {/* <H3
            style={{
              textAlign: isPageWide ? "left" : "center",
              margin: isPageWide ? "3.5rem 0rem" : "1.5rem 0.5rem",
            }}
          >
            Why plan with us?
          </H3>
          <WhyPlanWithUs page_id={props.data.id} /> */}

          <WhatMakesUsSection />

          {/* <H3
            style={{
              margin: "4rem 0 2.5rem 0",
              textAlign: isPageWide ? "left" : "center",
            }}
          >
            What our customers say?
          </H3>
          <Reviews></Reviews> */}

          <CurveImageGallery />
          <TestimonialCarousel />

          {/* <H3
            style={{
              margin: "4rem 0 2.5rem 0",
              textAlign: isPageWide ? "left" : "center",
            }}
          >
            What they say?
          </H3> */}
          {/* <AsSeenIn /> */}
          <PartnersSection />

          <ChatWithUs planner page_id={props.data.id}></ChatWithUs>
        </SetWidthContainer>
      </div>
      <TailoredFormMobileModal
        destinationType={destination?.type}
        page_id={destination?.pageId}
        destination={destination?.name}
        onHide={() => {
          setShowTailoredModal(false);
        }}
        show={showTailoredModal}
      />

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

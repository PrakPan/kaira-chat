import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import "bootstrap/dist/css/bootstrap.min.css";
import styled from "styled-components";
import DesktopBanner from "../../components/containers/Banner";
import Experiences from "../../components/containers/Experiences";
import media from "../../components/media";
import BannerTwo from "./BannerTwo";
import ChatWithUs from "../../components/containers/ChatWithUs/ChatWithUs";
import Reviews from "./CaseStudies/Index";
import ExperienceCard from "../../components/cards/newitinerarycard-main/ExperienceCard";
import Overview from "./Overview";
import Button from "../../components/ui/button/Index";
import Locations from "../../components/containers/newplannerlocations/Index";
import OldLocations from "../../components/containers/plannerlocations/Index";
import MobileBanner from "./MobileBanner";
import WhyPlanWithUs from "../../components/WhyPlanWithUs/PlanWithUsWithEnquiry";
import HeroBanner from "../../components/containers/HeroBanner/HeroBanner";
import openTailoredModal from "../../services/openTailoredModal";
import dynamic from "next/dynamic";
import AsSeenIn from "../testimonial/AsSeenIn";
import PathNavigation from "./PathNavigation.js";
import { logEvent } from "../../services/ga/Index";
import H3 from "../../components/heading/H3";
import { convertDbNameToCapitalFirst } from "../../helper/convertDbnameToCapitalFirst.js";
import HeroBannerLadakh from "../../components/containers/HeroBanner/HeroBannerLadakh.js";
import HeroSection from "../../components/revamp/destination/HeroSection.jsx";
import MostLovedItinerariesSection from "../../components/revamp/destination/MostLovedItinerariesSection.jsx";
import validateTextSize from "../../services/textSizeValidator.js";
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
import CtaBoardingSection from "../../components/revamp/home/CtaBoardingSection.jsx";
import JourneySimplified from "../../components/revamp/home/JourneySimplified.jsx";
import Carousel3D from "../../components/theme/CurveImageGallery.jsx";
import WhatMakesUsSection from "../../components/revamp/home/WhatMakesUsSection.jsx";
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

const MapInfo = styled.div`
  b {
    font-weight: 600;
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
    padding-top: 116px;
  }
`;

const Homepage = (props) => {
  const router = useRouter();
  let isPageWide = media("(min-width: 768px)");
  const [userItineraries, setUserItineraries] = useState([]);
  const [TTWItineraries, setTTWItineraries] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [desktopBannerLoading, setDesktopBannerLoading] = useState(false);
  const [overviewHeading, setOverviewHeading] = useState(null);
  const [headings, setHeadings] = useState([]);

  useEffect(() => {
    let iti_exclusive = [];
    let iti_customer = [];
    try {
      for (var i = 0; i < props.experienceData.itineraries.length; i++) {
        if (props.experienceData.itineraries[i].owner === "TTW")
          iti_exclusive.push(
            <ExperienceCard
              data={props.experienceData.itineraries[i]}
              key={props.experienceData.itineraries[i].short_text}
              hardcoded={
                props.experienceData.itineraries[i].payment_info ? true : false
              }
              filter={
                props.experienceData.itineraries[i].experience_filters
                  ? props.experienceData.itineraries[i].experience_filters[0]
                  : null
              }
              rating={props.experienceData.itineraries[i].rating}
              slug={props.experienceData.itineraries[i].slug}
              id={props.experienceData.itineraries[i].id}
              number_of_adults={
                props.experienceData.itineraries[i].number_of_adults
              }
              locations={
                props.experienceData.itineraries[i]["itinerary_locations"]
              }
              text={props.experienceData.itineraries[i].short_text}
              experience={props.experienceData.itineraries[i].name}
              cost={
                props.experienceData.itineraries[i].payment_info
                  ? props.experienceData.itineraries[i].payment_info.length
                    ? props.experienceData.itineraries[i].payment_info[0].cost
                    : null
                  : null
              }
              duration_number={
                props.experienceData.itineraries[i].duration_number
              }
              duration_unit={props.experienceData.itineraries[i].duration_unit}
              location={
                props.experienceData.itineraries[i]["experience_region"]
              }
              starting_cost={
                props.experienceData.itineraries[i].payment_info
                  ? props.experienceData.itineraries[i].payment_info
                      .per_person_total_cost
                  : props.experienceData.itineraries[i].starting_price
              }
              images={props.experienceData.itineraries[i].images}
            ></ExperienceCard>
          );
        else
          iti_customer.push(
            <ExperienceCard
              data={props.experienceData.itineraries[i]}
              key={props.experienceData.itineraries[i].short_text}
              hardcoded={
                props.experienceData.itineraries[i].payment_info ? true : false
              }
              filter={
                props.experienceData.itineraries[i].experience_filters
                  ? props.experienceData.itineraries[i].experience_filters[0]
                  : null
              }
              rating={props.experienceData.itineraries[i].rating}
              slug={props.experienceData.itineraries[i].slug}
              id={props.experienceData.itineraries[i].id}
              number_of_adults={
                props.experienceData.itineraries[i].number_of_adults
              }
              locations={
                props.experienceData.itineraries[i]["itinerary_locations"]
              }
              text={props.experienceData.itineraries[i].short_text}
              experience={props.experienceData.itineraries[i].name}
              cost={
                props.experienceData.itineraries[i].payment_info
                  ? props.experienceData.itineraries[i].payment_info.length
                    ? props.experienceData.itineraries[i].payment_info[0].cost
                    : null
                  : null
              }
              duration_number={
                props.experienceData.itineraries[i].duration_number
              }
              duration_unit={props.experienceData.itineraries[i].duration_unit}
              location={
                props.experienceData.itineraries[i]["experience_region"]
              }
              starting_cost={
                props.experienceData.itineraries[i].payment_information
                  ? props.experienceData.itineraries[i].payment_information
                      .per_person_total_cost
                  : props.experienceData.itineraries[i].starting_price
              }
              images={props.experienceData.itineraries[i].images}
            ></ExperienceCard>
          );
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (props.experienceData?.headings) {
      let headings = props.experienceData?.headings;
      headings.sort((a, b) => a?.priority - b?.priority);
      setHeadings(headings);
    }
  }, [props.experienceData?.headings]);

  useEffect(() => {
    const user = [];
    const ttw = [];
    if (props.experienceData.itineraries) {
      props.experienceData.itineraries.map((e) => {
        if (e.owner !== "TTW") user.push(e);
        else ttw.push(e);
      });
    }
    setUserItineraries(user);
    setTTWItineraries(ttw);
  }, [props.experienceData.itineraries]);

  useEffect(() => {
    // The counter changed!
    setOverviewHeading(
      `A little about ${convertDbNameToCapitalFirst(props.experienceData.slug)}`
    );
    return () => setOverviewHeading(null);
  }, [router.query.link, props.experienceData]);

  var country;
  if (props.experienceData.ancestors) {
    if (
      props.experienceData.ancestors.length &&
      props.experienceData.ancestors[0].level == "Country" &&
      props.experienceData.ancestors[0].name
    ) {
      country = props.experienceData.ancestors[0].name;
    }
  }

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
    openTailoredModal(
      router,
      props.experienceData.id,
      convertDbNameToCapitalFirst(props.experienceData.slug)
    );

    logEvent({
      action: "Plan_Itinerary",
      params: {
        page: "State Page",
        event_category: "Button Click",
        event_label: "Create your travel plan now!",
        event_action: location,
      },
    });
  };

  return (
    <div
      className={"Homepage"}
      id="homepage-anchor"
      style={{ visibility: props.hidden ? "hidden" : "visible" }}
    >
      {props?.experienceData?.slug == "ladakh" ? (
        <>
          <HeroBannerLadakh
            image={props.experienceData.image}
            page_id={props.page_id}
            type={props.type}
            destination={convertDbNameToCapitalFirst(props.experienceData.slug)}
            cities={props.experienceData.locations}
            children_cities={props.experienceData.children}
            title={props.experienceData.banner_heading}
            subheading={props.experienceData.banner_text}
            page={"State Page"}
            eventDates={props.eventDates}
          />
        </>
      ) : (
        <>
          {/* <HeroBanner
        image={props.experienceData.image}
        page_id={props.page_id}
        type={props.type}
        destination={convertDbNameToCapitalFirst(props.experienceData.slug)}
        cities={props.experienceData.locations}
        children_cities={props.experienceData.children}
        title={props.experienceData.banner_heading}
        subheading={props.experienceData.banner_text}
        page={"State Page"}
        eventDates={props.eventDates}
      /> */}

          <HeroSection
            title={props.experienceData.banner_heading}
            subtitle={props.experienceData.banner_text}
            image={`${imgUrlEndPoint}${props.experienceData.image}`}
          />

          <SetWidthContainer>
            <PathNavigation path={props.experienceData.path} />
            <>
              <H3
                style={{
                  textAlign: isPageWide ? "left" : "center",
                  margin: isPageWide
                    ? "2.5rem 0 4.5rem 0"
                    : "2.5rem 0.5rem 1.5rem 0.5rem",
                }}
              >
                {props.experienceData.slug
                  ? "Top locations across " +
                    convertDbNameToCapitalFirst(props.experienceData?.slug)
                  : "Top Locations"}
              </H3>
              {/* <Locations
            locations={props.experienceData.locations}
            viewall
            page={"State Page"}
            state={props?.experienceData?.destination}
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
                  {props.experienceData.locations.map((destination) => (
                    <SwiperSlide key={destination.id}>
                      <div className="w-full px-1">
                        <DestinationCard
                          title={destination.title || destination.name}
                          description={
                            destination.description || destination.tagline
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
            </>

            {headings.map((heading, index) => (
              <div key={index}>
                <H3
                  style={{
                    textAlign: isPageWide ? "left" : "center",
                    margin: isPageWide
                      ? "2.5rem 0 2.5rem 0"
                      : "2.5rem 0.5rem 1.5rem 0.5rem",
                  }}
                >
                  {heading.name}
                </H3>
                <Experiences
                  experiences={heading?.itineraries}
                  page={"State Page"}
                ></Experiences>

                {index % 2 ? (
                  <Button
                    onclick={() => handlePlanButtonClick(heading.name)}
                    borderWidth="1px"
                    fontWeight="500"
                    borderRadius="6px"
                    margin="2rem auto"
                    padding="0.5rem 2rem"
                  >
                    Create your travel plan now!
                  </Button>
                ) : null}
              </div>
            ))}

            {userItineraries.length ? (
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
                <MostLovedItinerariesSection apiItineraries={userItineraries} />
                {/* <Experiences
              experiences={userItineraries}
              page={"State Page"}
            ></Experiences> */}
              </>
            ) : null}

            <MapGridContainer>
              <Overview
                locations={props.experienceData.locations}
                overview_heading={overviewHeading}
                overview_text={props.experienceData.short_description}
              ></Overview>
              <MapContainer>
                {props.experienceData.locations &&
                props.experienceData.locations.length ? (
                  <MapBox
                    InfoWindowContainer={InfoWindowContainer}
                    locations={props.experienceData.locations}
                    height="300px"
                  />
                ) : (
                  <></>
                )}
              </MapContainer>
            </MapGridContainer>
            <Button
              onclick={() =>
                handlePlanButtonClick(
                  `A little about ${props?.experienceData?.slug}`
                )
              }
              borderWidth="1px"
              fontWeight="500"
              borderRadius="6px"
              margin="2rem auto"
              padding="0.5rem 2rem"
            >
              {props.experienceData.page_type !== "Theme"
                ? `Craft a trip to ${convertDbNameToCapitalFirst(
                    props.experienceData.slug
                  )} now!`
                : "Create your travel plan now!"}
            </Button>
          </SetWidthContainer>

          <SetWidthContainer>
            <JourneySimplified />
            {/* <H3
          style={{
            textAlign: isPageWide ? "left" : "center",
            margin: isPageWide ? "3rem 0" : "2.5rem 0.5rem 0rem 0.5rem",
          }}
        >
          How it works?
        </H3>
        <div>
          <BannerTwo
            page_id={props.experienceData.id}
            destination={convertDbNameToCapitalFirst(props.experienceData.slug)}
            cities={props.experienceData.locations}
          ></BannerTwo>
        </div> */}

            {TTWItineraries.length ? (
              <>
                <H3
                  style={{
                    textAlign: isPageWide ? "left" : "center",
                    margin: isPageWide
                      ? "2.5rem 0 2.5rem 0"
                      : "2.5rem 0.5rem 1.5rem 0.5rem",
                  }}
                >
                  Tarzan Way Community Top Picks
                </H3>
                <Experiences
                  mobileGrid
                  experiences={
                    showMore ? TTWItineraries : TTWItineraries.slice(0, 4)
                  }
                  page={"State Page"}
                ></Experiences>
              </>
            ) : null}

            {/* {!TTWItineraries.length || isPageWide ? null : showMore ? (
          <Button
            onclick={() =>
              handlePlanButtonClick(`Tarzan Way Community Top Picks`)
            }
            borderWidth="1px"
            fontWeight="500"
            borderRadius="6px"
            margin="2rem auto"
            padding="0.5rem 2rem"
          >
            Unlock your adventure
          </Button>
        ) : (
          <Button
            onclick={() => setShowMore(true)}
            borderWidth="1px"
            fontWeight="500"
            borderRadius="6px"
            margin="2rem auto"
            padding="0.5rem 2rem"
          >
            View more
          </Button>
        )}

        {userItineraries.length ? (
          <Button
            onclick={() => handlePlanButtonClick(`Unlock your adventure`)}
            borderWidth="1px"
            fontWeight="500"
            borderRadius="6px"
            margin="2rem auto"
            padding="0.5rem 2rem"
          >
            Unlock your adventure
          </Button>
        ) : null} */}
          </SetWidthContainer>

          <DesktopBanner
            loading={desktopBannerLoading}
            onclick={() =>
              openTailoredModal(
                router,
                props.experienceData.id,
                convertDbNameToCapitalFirst(props.experienceData.slug)
              )
            }
            text={`Craft a personalized itinerary${
              props.experienceData.slug
                ? " to " +
                  convertDbNameToCapitalFirst(props.experienceData.slug) +
                  " now"
                : ""
            }!`}
          ></DesktopBanner>

          <div className="hidden-desktop">
            <MobileBanner
              handleClick={() =>
                openTailoredModal(
                  router,
                  props.experienceData.id,
                  convertDbNameToCapitalFirst(props.experienceData.slug)
                )
              }
              city={convertDbNameToCapitalFirst(props.experienceData.slug)}
            />
          </div>

          <SetWidthContainer>
            {props.locations && props.locations.length ? (
              <>
                <H3
                  style={{
                    textAlign: isPageWide ? "left" : "center",
                    margin: isPageWide ? "3.5rem 0rem" : "1.5rem 0.5rem",
                  }}
                >
                  Other Destinations
                </H3>
                {/* <OldLocations
              locations={props.locations}
              page_id={props.experienceData.id}
              destination={convertDbNameToCapitalFirst(props.experienceData.slug)}
              viewall
              country={country}
              planner
            ></OldLocations> */}
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
                              destination.description || destination.tagline
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
              </>
            ) : null}

            {/* <H3
          style={{
            textAlign: isPageWide ? "left" : "center",
            margin: "3.5rem 0 3.5rem 0",
          }}
        >
          Why plan with us?
        </H3>
        <WhyPlanWithUs
          page_id={props.experienceData.id}
          destination={convertDbNameToCapitalFirst(props.experienceData.slug)}
          cities={props.experienceData.locations}
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
            <Carousel3D />
          </SetWidthContainer>

          <SetWidthContainer>
            <H3
              style={{
                textAlign: isPageWide ? "left" : "center",
                margin: "4rem 0 2.5rem 0",
              }}
            >
              What they say?
            </H3>
            <AsSeenIn />
            <ChatWithUs planner page_id={props.experienceData.id}></ChatWithUs>

            <CtaBoardingSection />
          </SetWidthContainer>
        </>
      )}
    </div>
  );
};

export default Homepage;

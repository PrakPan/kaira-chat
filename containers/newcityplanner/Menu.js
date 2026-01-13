import styled from "styled-components";
import Brief from "./MenuItems/Brief";
import TopRecommendations from "./MenuItems/TopRecommendation";
import Poi from "./pois/Index";
import Activity from "./activities/Index";
import FoodToEat from "./MenuItems/FoodToEat";
import WhyPlanWithUs from "../../components/WhyPlanWithUs/PlanWithUsWithEnquiry";
import Reviews from "../travelplanner/CaseStudies/Index";
import ChatWithUs from "../../components/containers/ChatWithUs/ChatWithUs";
import NearbyLocations from "./MenuItems/NearbyLocations";
import AsSeenIn from "../testimonial/AsSeenIn";
import PathNavigation from "../travelplanner/PathNavigation";
import H3 from "../../components/heading/H3";
import media from "../../components/media";
import openTailoredModal from "../../services/openTailoredModal";
import { useRouter } from "next/router";
import { logEvent } from "../../services/ga/Index";
import { imgUrlEndPoint } from "../../components/theme/ThemeConstants.js";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DestinationCard from "../../components/revamp/common/components/card/DestinationCard";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import MostLovedItinerariesSection from "../../components/revamp/destination/MostLovedItinerariesSection";
import CtaBoardingSection from "../../components/revamp/home/CtaBoardingSection.jsx";
import Carousel3D from "../../components/theme/CurveImageGallery.jsx";
import WhatMakesUsSection from "../../components/revamp/home/WhatMakesUsSection.jsx";
import PartnersSection from "../../components/theme/PartnersSection.jsx";
import TestimonialCarousel from "../../components/theme/TestimonialCarousel.jsx";
import { useState } from "react";
import DesktopBanner from "../../components/containers/Banner.js";
import { convertDbNameToCapitalFirst } from "../../helper/convertDbnameToCapitalFirst.js";
import Link from "next/link.js";
import POIDetailsDrawer from "../../components/drawers/poiDetails/POIDetailsDrawer.js";

const MenuContainer = styled.div`
  width: 95%;
  margin: auto;
  @media screen and (min-width: 768px) {
    width: 85%;
  }

  #Brief {
    grid-area: Brief;
  }
  #Itinerary {
    grid-area: Itinerary;
  }
  #Places {
    grid-area: Places;
  }
  #Food {
    grid-area: Food;
  }
  #Reach {
    grid-area: Reach;
  }
  #Survival {
    grid-area: Survival;
  }
  #Folklore {
    grid-area: Folklore;
  }
  #Why {
    grid-area: Why;
  }
  #Customers {
    grid-area: Customers;
  }

  #nearby-places {
    grid-area: nearby-places;
  }
  ${(props) =>
    props.thingsToDoPage
      ? 'display : grid;grid-template-areas : "Places" "Food" "nearby-places" "Itinerary" "Reach" "Survival" "Folklore" "Why" "Customers"'
      : ""}
`;

const MenuItem = styled.div`
  @media screen and (min-width: 1400px) {
    margin-right: ${(props) => (props.single ? "29%" : "0")};
  }
`;

const P = styled.p`link
  font-weight: 300;
  text-align: left;
  line-height: 32px;
  @media screen and (min-width: 768px) {
    font-size: 16px;
  }
`;

const Menu = (props) => {
  let isPageWide = media("(min-width: 768px)");
  const router = useRouter();
  const [desktopBannerLoading, setDesktopBannerLoading] = useState(false);

  const [activeDrawer, setActiveDrawer] = useState(null);

  const handleOpenDrawer = (data, type) => {
    setActiveDrawer({ data, type });
  };
  const handleCloseDrawer = () => {
    setActiveDrawer(null);
  };
  const handlePlanButtonClick = () => {
    // openTailoredModal(router, props.data.id, props.data.name, props.type);
    router.push({
      pathname: "/new-trip",
      query: { ...router.query, source: props?.data?.slug || "home" },
    });

    logEvent({
      action: "Plan_Itinerary",
      params: {
        page: props.page ? props.page : "Home Page",
        event_category: "Button Click",
        event_label: "Plan Itinerary For Free",
        event_action: "How it works?",
      },
    });
  };

  return (
    <MenuContainer thingsToDoPage={props.thingsToDoPage}>
      <DesktopBanner
        loading={desktopBannerLoading}
        onclick={
          () => {
            router.push({
              pathname: "/new-trip",
              query: { ...router.query, source: props?.data?.slug || "home" },
            });
          }
          // openTailoredModal(
          //   router,
          //   props.data.id,
          //   convertDbNameToCapitalFirst(props.data.slug)
          // )
        }
        text={`Craft a personalized itinerary${props.data?.slug
            ? " to " + convertDbNameToCapitalFirst(props.data?.slug) + " now"
            : ""
          }!`}
      ></DesktopBanner>
      <PathNavigation path={props.data?.path} />

      {!!props.data.itineraries.length && (
        <MenuItem id="Itinerary">
          <H3
            style={{
              lineHeight: "48px",
              marginBlock: isPageWide ? "3.5rem" : "1.5rem",
            }}
          >
            Trips by our users to {props.data.name}
          </H3>
          {/* <MostLovedItinerariesSection
            apiItineraries={props.data.itineraries}
          /> */}
          <TopRecommendations itineraries={props.data.itineraries} />
        </MenuItem>
      )}

      {props.data.short_description && !props.thingsToDoPage && (
        <MenuItem id="Brief">
          <H3 style={{ margin: "30px 0 30px 0" }}>
            {"A little about " + props.data.name}
          </H3>
          <Brief
            short_description={props.data.short_description}
            lat={props.data.lat}
            lon={props.data.long}
            name={props.data.name}
            elevation={
              props.data.elevation &&
              props.data.elevation.length &&
              props.data.elevation[0]?.elevation
            }
          />
        </MenuItem>
      )}

      {props.data.activities.length ? (
        <MenuItem id="Activities">
          <H3
            style={{
              lineHeight: "48px",
              marginBlock: isPageWide ? "3.5rem" : "1.5rem",
            }}
          >
            Things to do in {props.data.name}
          </H3>
          {/* <Activity
            data={props.data}
            activities={props.data.activities}
            city={props.data.name}
            removeDelete={props?.removeDelete}
            handlePlanButtonClick={handlePlanButtonClick}
          /> */}

          <div className="relative px-2 sm:px-0">
            <Swiper
              style={{ height: "auto" }}
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
              {props.data.activities.map((destination) => (
                <SwiperSlide key={destination.id}>
                  <div className="w-full px-1">
                    <DestinationCard
                      title={destination?.display_name || destination.title || destination.name}
                      description={
                        destination.description || destination.tagline
                      }
                      image={destination.image}
                      rating={destination.rating}
                      one_liner_description={destination?.one_liner_description}
                      reviewCount={destination.user_ratings_total}
                      showImageText={false}
                      tags={
                        destination.tags ||
                        (destination.continent ? [destination.continent] : [])
                      }
                      gradientOverlay={destination.gradientOverlay}
                      onClick={() => handleOpenDrawer(destination, "activity")}
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

          <div className=" flex items-center justify-center mt-8 lg:mt-10">
            <Link href={`/new-trip/?source=${props?.data?.slug || "home"}`}>
              <button
                variant="filled"
                size="medium"
                onClick={() => {
                  console.log("Create a Trip Now! clicked");
                }}
                className="!bg-primary-indigo !border-primary-indigo !text-white hover:!bg-primary-indigo/90 !font-medium !text-base !px-6 !py-3 !rounded-lg"
              >
                + Create a Trip Now!
              </button>
            </Link>
          </div>
        </MenuItem>
      ) : null}

      {!!props.data.pois.length && (
        <MenuItem id="Places">
          <H3
            style={{
              lineHeight: "48px",
              marginBlock: isPageWide ? "3.5rem" : "1.5rem",
            }}
          >
            Places to visit in {props.data.name}
          </H3>
          {/* <Poi
            elevation={props.elevation}
            data={props.data}
            thingsToDoPage={props.thingsToDoPage}
            pois={props.data.pois}
            city={props.data.name}
            removeDelete={props?.removeDelete}
            removeChange={true}
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
              {props.data.pois.map((destination) => (
                <SwiperSlide key={destination.id}>
                  <div className="w-full px-1">
                    <DestinationCard
                      title={destination?.display_name || destination.title || destination.name}
                      description={
                        destination.description || destination.tagline
                      }
                      one_liner_description={destination?.one_liner_description}
                      image={destination.image}
                      rating={destination.rating}
                      reviewCount={destination.user_ratings_total}
                      showImageText={false}
                      tags={
                        destination.tags ||
                        (destination.continent ? [destination.continent] : [])
                      }
                      onClick={() => handleOpenDrawer(destination, "poi")}
                      gradientOverlay={destination.gradientOverlay}
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

          <div className=" flex items-center justify-center mt-8 lg:mt-10">
            <Link href={`/new-trip/?source=${props?.data?.slug || "home"}`}>
              <button
                variant="filled"
                size="medium"
                onClick={() => {
                  console.log("Create a Trip Now! clicked");
                }}
                className="!bg-primary-indigo !border-primary-indigo !text-white hover:!bg-primary-indigo/90 !font-medium !text-base !px-6 !py-3 !rounded-lg"
              >
                + Create a Trip Now!
              </button>
            </Link>
          </div>
        </MenuItem>
      )}

      <MenuItem id="nearby-places">
        {/* <NearbyLocations
          nearbyCities={props.nearbyCities}
          state={props.destination}
          page={"City Page"}
          data={props.data}
        /> */}
        <H3
          style={{
            marginBlock: isPageWide ? "3.5rem" : "1.5rem",
          }}
        >
          Nearby Locations to {props.data.name}
        </H3>
        <div className="relative px-2 sm:px-0">
          <Swiper
            style={{ height: "376px" }}
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
            {props.nearbyCities.map((destination) => (
              <SwiperSlide key={destination.id}>
                <div className="w-full px-1">
                  <DestinationCard
                    title={destination.title || destination.name}
                    description={destination.description || destination.tagline}
                    image={destination.image}
                    one_liner_description={destination?.one_liner_description}
                    tags={
                      destination.tags ||
                      (destination.continent ? [destination.continent] : [])
                    }
                    gradientOverlay={destination.gradientOverlay}
                    onClick={() => {
                      console.log(
                        `Clicked on ${destination.name || destination.title}`
                      );
                      window.location.replace("/" + destination.path);
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

        <div className=" flex items-center justify-center mt-8 lg:mt-10">
          <Link href={`/new-trip/?source=${props?.data?.slug || "home"}`}>
            <button
              variant="filled"
              size="medium"
              onClick={() => {
                console.log("Create a Trip Now! clicked");
              }}
              className="!bg-primary-indigo !border-primary-indigo !text-white hover:!bg-primary-indigo/90 !font-medium !text-base !px-6 !py-3 !rounded-lg"
            >
              + Create a Trip Now!
            </button>
          </Link>
        </div>
      </MenuItem>

      {!!props.data.foods.length && (
        <MenuItem id="Food" single>
          <H3
            style={{
              lineHeight: "48px",
              marginBlock: isPageWide ? "3.5rem" : "1.5rem",
            }}
          >
            Food to eat
          </H3>
          <FoodToEat foods={props.data.foods} />
        </MenuItem>
      )}

      {props.data.conveyance_available && (
        <MenuItem id="Reach" single>
          <H3
            style={{
              lineHeight: "48px",
              marginBlock: isPageWide ? "3.5rem" : "1.5rem",
              marginBottom: "1rem",
            }}
          >
            How to reach
          </H3>
          <P className="font-light">{props.data.conveyance_available}</P>
        </MenuItem>
      )}

      {props.data.survival_tips_and_tricks && (
        <MenuItem id="Survival" single>
          <H3
            style={{
              lineHeight: "48px",
              marginBlock: isPageWide ? "3.5rem" : "1.5rem",
              marginBottom: "1rem",
            }}
          >
            Survival Tips & Tricks
          </H3>
          <P>{props.data.survival_tips_and_tricks}</P>
        </MenuItem>
      )}

      {props.data.folklore_or_story && (
        <MenuItem id="Folklore" single>
          <H3
            style={{
              lineHeight: "48px",
              marginBlock: isPageWide ? "3.5rem" : "1.5rem",
              marginBottom: "1rem",
            }}
          >
            Folklore or Story
          </H3>
          <P>{props.data.folklore_or_story}</P>
        </MenuItem>
      )}

      <MenuItem id="Why">
        {/* <H3
          style={{
            lineHeight: "48px",
            marginBlock: isPageWide ? "3.5rem" : "1.5rem",
          }}
        >
          Why plan with us?
        </H3>
        <WhyPlanWithUs
          page_id={props.data.id}
          destination={props.destination}
        /> */}
        <WhatMakesUsSection />
      </MenuItem>

      <MenuItem id="Customers">
        {/* <H3
          style={{
            lineHeight: "48px",
            marginBlock: isPageWide ? "3.5rem" : "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          Happy Community of The Tarzan Way
        </H3>
        <Reviews />  */}
        <Carousel3D />
        <TestimonialCarousel />
      </MenuItem>

      <MenuItem>
        {/* <H3
          style={{
            lineHeight: "48px",
            marginBlock: isPageWide ? "3.5rem" : "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          What they say?
        </H3> */}
        {/* <AsSeenIn /> */}
        <PartnersSection />
        <ChatWithUs />

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
      </MenuItem>
    </MenuContainer>
  );
};

export default Menu;

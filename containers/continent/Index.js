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
    openTailoredModal(
      router,
      props.data.id,
      convertDbNameToCapitalFirst(props.data.slug),
      props.type
    );

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
      {/* {isPageWide ? (
        <DesktopPersonaliseBanner
          onclick={() =>
            openTailoredModal(
              router,
              props.data.id,
              convertDbNameToCapitalFirst(props.data.slug),
              props.type
            )
          }
          text={validateTextSize(
            `Craft a personalized itinerary to ${convertDbNameToCapitalFirst(
              props.data.slug
            )} now!`,
            9,
            `Craft a trip to ${props.data.destination} now!`
          )}
        ></DesktopPersonaliseBanner>
      ) : (
        <MobileBanner
          cityName={props.data.destination}
          onClick={() =>
            openTailoredModal(
              router,
              props.data.id,
              convertDbNameToCapitalFirst(props.data.slug),
              props.type
            )
          }
        />
      )} */}
      {/* <HeroSection/> */}

      <div>
        {/* <HeroBanner
          image={props.data.image}
          page_id={props.data.id}
          title={`${convertDbNameToCapitalFirst(props.data.slug)} Trip Planner`}
          page={"Continent Page"}
          type={props.type}
          destination={props.destination}
        /> */}
        <HeroSection title={validateTextSize(
            `Craft a personalized itinerary to ${convertDbNameToCapitalFirst(
              props.data.slug
            )} now!`,
            9,
            `Craft a trip to ${props.data.destination} now!`
          )}
          image={`${imgUrlEndPoint}${props.data.image}`}/>

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
              {/* <SwiperLocations
                locations={props.locations}
                page_id={props.data.id}
                destination={props.data.destination}
                viewall
                country
                page={"Continent Page"}
                continent={props?.data?.destination}
              ></SwiperLocations> */}
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
            description={destination.one_liner_description || destination.tagline}
            one_liner_description={destination.one_liner_description}
            image={destination.image}
            tags={destination.tags || (destination.continent ? [destination.continent] : [])}
            gradientOverlay={destination.gradientOverlay}
            onClick={() => {
              console.log(`Clicked on ${destination.name || destination.title}`);
            }}
          />
        </div>
      </SwiperSlide>
    ))}
          </Swiper>
          {/* Custom Prev Button */}
          <div className="PlacesBragSection-prev" aria-hidden>
            <div className="absolute left-3 sm:left-1 top-1/2 -translate-y-1/2 z-10">
              <div className="w-8 sm:w-10 h-8 sm:h-10 bg-black/80 backdrop-blur-sm   hover:!bg-primary-yellow rounded-full flex items-center justify-center transform transition-all duration-300 sm:hover:scale-110 cursor-pointer">
                <FontAwesomeIcon
                  icon={faChevronLeft}
                  className="text-white group-hover:text-white text-md transition-colors duration-300 transform "
                />
              </div>
            </div>
          </div>

          {/* Custom Next Button */}
          <div className="PlacesBragSection-next" aria-hidden>
            <div className="absolute right-3 sm:right-1 top-1/2 -translate-y-1/2 z-10">
              <div className="w-8 sm:w-10 h-8 sm:h-10 bg-black/80 backdrop-blur-sm   hover:!bg-primary-yellow rounded-full flex items-center justify-center transform transition-all duration-300 sm:hover:scale-110 cursor-pointer">
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className="text-white hover:text-white text-md transition-colors duration-300 transform "
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
                fontWeight="500"
                borderRadius="6px"
                margin="2rem auto"
                padding="0.5rem 2rem"
              >
                Create your free itinerary
              </Button>
            </>
          ) : null}

          {/* <MapGridContainer> */}
          <Overview
            heading={props.data.overview_heading}
            text={props.data.overview_text}
            image={props.data.overview_image}
            slug={props.data.slug}
            page_id={props.data.id}
            type={props.type}
            destination={convertDbNameToCapitalFirst(props.data.slug)}
          ></Overview>

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
                <div className="space-y-12 mt-5">
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
                      <PlanYourTripButton text={"Plan Itinerary For Free"} />
                    </>
                  ) : component.carousel === "destination-3" ? (
                    <>
                      <SwiperLocations
                        locations={component?.countries}
                        page_id={component?.id}
                        destination={component?.name}
                        viewall
                        country
                        page={"Country Page"}
                        continent={component?.countries}
                      ></SwiperLocations>
                      
                      <PlanYourTripButton
                        text={"Create your travel plan now!"}
                      />
                    </>
                  ) : component.carousel === "destination-4" ? (
                    <>
                      <div className="space-y-4">
                        <Locations
                          locations={component?.cities}
                          page={"Continent Page"}
                          viewall
                        ></Locations>
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
           {component?.activities.map((destination) => (
      <SwiperSlide key={destination.id}>
        <div className="w-full px-1">
          <DestinationCard
            title={destination.title || destination.name}
            description={destination.one_liner_description || destination.tagline}
            one_liner_description={destination.one_liner_description}
            image={destination.image}
            rating={destination.rating}
            reviewCount={destination.user_ratings_total}
            showImageText={false}
            tags={destination.tags || (destination.continent ? [destination.continent] : [])}
            gradientOverlay={destination.gradientOverlay}
            onClick={() => {
              console.log(`Clicked on ${destination.name || destination.title}`);
            }}
          />
        </div>
      </SwiperSlide>
    ))}
          </Swiper>
          {/* Custom Prev Button */}
          <div className="PlacesBragSection-prev" aria-hidden>
            <div className="absolute left-3 sm:left-1 top-1/2 -translate-y-1/2 z-10">
              <div className="w-8 sm:w-10 h-8 sm:h-10 bg-black/80 backdrop-blur-sm   hover:!bg-primary-yellow rounded-full flex items-center justify-center transform transition-all duration-300 sm:hover:scale-110 cursor-pointer">
                <FontAwesomeIcon
                  icon={faChevronLeft}
                  className="text-white group-hover:text-white text-md transition-colors duration-300 transform "
                />
              </div>
            </div>
          </div>

          {/* Custom Next Button */}
          <div className="PlacesBragSection-next" aria-hidden>
            <div className="absolute right-3 sm:right-1 top-1/2 -translate-y-1/2 z-10">
              <div className="w-8 sm:w-10 h-8 sm:h-10 bg-black/80 backdrop-blur-sm   hover:!bg-primary-yellow rounded-full flex items-center justify-center transform transition-all duration-300 sm:hover:scale-110 cursor-pointer">
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className="text-white hover:text-white text-md transition-colors duration-300 transform "
                />
              </div>
            </div>
          </div>
        </div>
                      <PlanYourTripButton text={"Plan Itinerary For Free"} />
                    </>
                  ) : component.carousel === "itinerary-1" ? (
                    <>
                      {/* <Itinerary1Carousel itineraries={component.itineraries} /> */}
                     < MostLovedItinerariesSection apiItineraries={component.itineraries} />
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
           {component?.activities.map((destination) => (
      <SwiperSlide key={destination.id}>
        <div className="w-full px-1">
          <DestinationCard
            title={destination.title || destination.name}
            description={destination.one_liner_description || destination.tagline}
            one_liner_description={destination.one_liner_description}
            image={destination.image}
            rating={destination.rating}
            reviewCount={destination.user_ratings_total}
            showImageText={false}
            tags={destination.tags || (destination.continent ? [destination.continent] : [])}
            gradientOverlay={destination.gradientOverlay}
            onClick={() => {
              console.log(`Clicked on ${destination.name || destination.title}`);
            }}
          />
        </div>
      </SwiperSlide>
    ))}
          </Swiper>
          {/* Custom Prev Button */}
          <div className="PlacesBragSection-prev" aria-hidden>
            <div className="absolute left-3 sm:left-1 top-1/2 -translate-y-1/2 z-10">
              <div className="w-8 sm:w-10 h-8 sm:h-10 bg-black/80 backdrop-blur-sm   hover:!bg-primary-yellow rounded-full flex items-center justify-center transform transition-all duration-300 sm:hover:scale-110 cursor-pointer">
                <FontAwesomeIcon
                  icon={faChevronLeft}
                  className="text-white group-hover:text-white text-md transition-colors duration-300 transform "
                />
              </div>
            </div>
          </div>

          {/* Custom Next Button */}
          <div className="PlacesBragSection-next" aria-hidden>
            <div className="absolute right-3 sm:right-1 top-1/2 -translate-y-1/2 z-10">
              <div className="w-8 sm:w-10 h-8 sm:h-10 bg-black/80 backdrop-blur-sm   hover:!bg-primary-yellow rounded-full flex items-center justify-center transform transition-all duration-300 sm:hover:scale-110 cursor-pointer">
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className="text-white hover:text-white text-md transition-colors duration-300 transform "
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
           {component?.pois.map((destination) => (
      <SwiperSlide key={destination.id}>
        <div className="w-full px-1">
          <DestinationCard
            title={destination.title || destination.name}
            description={destination.one_liner_description || destination.tagline}
            one_liner_description={destination.one_liner_description}
            image={destination.image}
            rating={destination.rating}
            reviewCount={destination.user_ratings_total}
            showImageText={false}
            tags={destination.tags || (destination.continent ? [destination.continent] : [])}
            gradientOverlay={destination.gradientOverlay}
            onClick={() => {
              console.log(`Clicked on ${destination.name || destination.title}`);
            }}
          />
        </div>
      </SwiperSlide>
    ))}
          </Swiper>
          {/* Custom Prev Button */}
          <div className="PlacesBragSection-prev" aria-hidden>
            <div className="absolute left-3 sm:left-1 top-1/2 -translate-y-1/2 z-10">
              <div className="w-8 sm:w-10 h-8 sm:h-10 bg-black/80 backdrop-blur-sm   hover:!bg-primary-yellow rounded-full flex items-center justify-center transform transition-all duration-300 sm:hover:scale-110 cursor-pointer">
                <FontAwesomeIcon
                  icon={faChevronLeft}
                  className="text-white group-hover:text-white text-md transition-colors duration-300 transform "
                />
              </div>
            </div>
          </div>

          {/* Custom Next Button */}
          <div className="PlacesBragSection-next" aria-hidden>
            <div className="absolute right-3 sm:right-1 top-1/2 -translate-y-1/2 z-10">
              <div className="w-8 sm:w-10 h-8 sm:h-10 bg-black/80 backdrop-blur-sm   hover:!bg-primary-yellow rounded-full flex items-center justify-center transform transition-all duration-300 sm:hover:scale-110 cursor-pointer">
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className="text-white hover:text-white text-md transition-colors duration-300 transform "
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
            ))}

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
      <TailoredFormMobileModal
        destinationType={destination?.type}
        page_id={destination?.pageId}
        destination={destination?.name}
        onHide={() => {
          setShowTailoredModal(false);
        }}
        show={showTailoredModal}
      />
    </div>
  );
};

export default Index;

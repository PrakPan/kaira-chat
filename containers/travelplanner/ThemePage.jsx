import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import "bootstrap/dist/css/bootstrap.min.css";
import styled from "styled-components";
import media from "../../components/media";
import ThemeBanner from "../../components/containers/ThemeBanner/ThemeBanner";
import openTailoredModal from "../../services/openTailoredModal";
import { logEvent } from "../../services/ga/Index";
import Overview from "../themes/Overview.jsx";
import Image from "next/image.js";
import TailoredFormMobileModal from "../../components/modals/TailoredFomrMobile";
import ThemeFaqs from "../themes/ThemeFaqs.jsx";
import Destination1Carousel from "../../components/theme/Destination1Carousel.jsx";
import Activity1Carousel from "../../components/theme/Activity1Carousel.jsx";
import Reviews1Carousel from "../../components/theme/Reviews1Carousel.jsx";
import Itinerary2Carousel from "../../components/theme/Itinerary2Carousel.jsx";
import PrimaryHeading from "../../components/heading/PrimaryHeading.jsx";
import SecondaryHeading from "../../components/heading/Secondary.jsx";
import Itinerary1Carousel from "../../components/theme/Itinerary1Carousel.jsx";
import DesktopPersonaliseBanner from "../../components/containers/Banner";
import MobileBanner from "../city/Banner/Mobile";
import validateTextSize from "../../services/textSizeValidator";
import SecondaryButton from "../../components/ui/SecondaryButton.jsx";
import BannerTwo from "./BannerTwo.js";
import Continentcarousel from "../../components/continentcarousel/continentcarousel.js";
import WhyPlanWithUs from "../../components/WhyPlanWithUs/Index.js";
import AsSeenIn from "../testimonial/AsSeenIn.js";
import ChatWithUs from "../../components/containers/ChatWithUs/ChatWithUs.js";
import SwiperLocations from "../../components/containers/SwiperLocations/Index";
import Button from "../../components/ui/button/Index";
import OldLocations from "../../components/containers/plannerlocations/Index";
import Locations from "../../components/containers/newplannerlocations/Index";
import Activity2 from "../newcityplanner/activities/Index.js";
import Poi from "../newcityplanner/pois/Index";
import PathNavigation from "./PathNavigation.js";
import ThemeBackground from "../../components/theme/ThemeBackgroundImages.jsx";
import { imgUrlEndPoint } from "../../components/theme/ThemeConstants.js";
import BudgetFriendly from "../../components/theme/BudgetFriendly.jsx";
import ImageCarousel from "./ImageCaraousel.js";
import Element from "../newcityplanner/elements/Index.js";
import ThemeHeadline from "./ThemeHeadines.js";
import HeroBannerLadakh from "../../components/containers/HeroBanner/HeroBannerLadakh.js";
import { convertDbNameToCapitalFirst } from "../../helper/convertDbnameToCapitalFirst.js";
import LadakhLogo from "../../components/cards/LadakhLogo.js";
import Destination7Carousel from "../../components/theme/Destination7Carousel.jsx";
import Activity3Carousel from "../../components/theme/Activity3Carousel.jsx";
import Element2 from "../newcityplanner/elements/Element2.jsx";
import CurveImageGallery from "../../components/theme/CurveImageGallery.jsx";
import { Padding } from "@mui/icons-material";
import CurvedSwiper from "../../components/theme/CurveImageGallery.jsx";
import JourneyType from "../../components/theme/journeyType.jsx";
import OverviewThailand from "../themes/OverviewThailand.jsx";
import HeroSection from "../../components/revamp/destination/HeroSection.jsx";
import MostLovedItinerariesSection from "../../components/revamp/destination/MostLovedItinerariesSection.jsx";
import ItineraryCardV2 from "../../components/revamp/destination/ItineraryCardV2.jsx";
import ActivityCardV2 from "../../components/revamp/destination/ActivityCardV2.jsx";
import CountryCardV2 from "../../components/revamp/destination/CountryCardV2.jsx";
import HeroV2 from "../../components/revamp/destination/HeroV2.jsx";
import destinationStyles from "../../styles/pages/revamp/destination.module.scss";
import CarouselNavigation from "../../components/theme/Navigation.jsx";
import PartnersSection from "../../components/theme/PartnersSection.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import POIDetailsDrawer from "../../components/drawers/poiDetails/POIDetailsDrawer.js";
import DestinationCard from "../../components/revamp/common/components/card/DestinationCard.jsx";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import TestimonialCarousel from "../../components/theme/TestimonialCarousel.jsx";
import TravelVibeSection from "../../components/revamp/home/TravelVibeSection.jsx";
import JourneySimplified from "../../components/revamp/home/JourneySimplified.jsx";

const SetWidthContainer = styled.div`
  width: 100%;
  margin: auto;
  font-weight: 350px;
  @media screen and (min-width: 768px) {
    width: 85%;
    font-weight: 350px;
  }
`;

export default function ThemePage(props) {

  let isPageWide = media("(min-width: 768px)");
  const router = useRouter();
  const [components, setComponents] = useState([]);
  const [navigationComponents, setNavigationComponents] = useState([]);
  const [showTailoredModal, setShowTailoredModal] = useState(false);
  const [destination, setDestination] = useState(null);

  const [activeDrawer, setActiveDrawer] = useState(null);

  const handleOpenDrawer = (data, type) => {
    setActiveDrawer({ data, type });
  };
  const handleCloseDrawer = () => {
    setActiveDrawer(null);
  };

  useEffect(() => {
    if (props.experienceData?.components) {
      let components = props.experienceData?.components;
      components.sort((a, b) => a?.priority - b?.priority);

      setComponents(components);

      // Separate components based on `is_navigation_type`

      // const otherComponents = components.filter(
      //   (component) => !component.is_navigation_type
      // );
      // // setNavigationComponents(navComponents);
      // setComponents(otherComponents);
    }
  }, []);

  const handlePlanButton = (pageId, destination, type) => {
    // router.push({
    //   pathname: "/new-trip",
    //   query: { 
    //     ...router.query,
    //     source: props?.slug || 'home' }
    // });
    // if (isPageWide) {
      setShowTailoredModal(true);
    // } else {
    //   openTailoredModal(router, pageId, destination, type);
    // }

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
    <div className={`mb-5 ${destinationStyles.destinationPage}`}>
      {/* {props?.slug === 'la-tomatina-spain-2025' && <ThemeHeadline text={`Join the World's Biggest Tomato Fight – La Tomatina 2025`} />} */}
      {/* {isPageWide ? (
        <DesktopPersonaliseBanner
          onclick={() =>
            openTailoredModal(
              router,
              props.experienceData.id,
              props.experienceData.destination
            )
          }
          text={validateTextSize(
            `Craft a personalized itinerary now!`,
            9,
            `Craft a trip now!`
          )}
        ></DesktopPersonaliseBanner>
      ) : (
        <MobileBanner
          cityName={props.experienceData.destination ?? null}
          onClick={() =>
            openTailoredModal(
              router,
              props.experienceData.id,
              props.experienceData.destination
            )
          }
        />
      )} */}

      <HeroV2
        destinationLabel={convertDbNameToCapitalFirst(
          props.experienceData.slug || ""
        )}
        kicker={
          props.experienceData?.locations?.length
            ? `${props.experienceData.locations.length}+ ${convertDbNameToCapitalFirst(
                props.experienceData.slug || ""
              )} destinations curated`
            : `Plan your ${convertDbNameToCapitalFirst(
                props.experienceData.slug || ""
              )} trip with Kaira`
        }
        title={props.experienceData.banner_heading}
        description={props.experienceData.banner_text}
        prompts={(props.experienceData?.locations || [])
          .slice(0, 4)
          .map((loc) => {
            const n = loc.display_name || loc.name || loc.title || "";
            return n ? `Plan ${n}` : null;
          })
          .filter(Boolean)}
        polaroids={(() => {
          const fromLocations = (props.experienceData?.locations || [])
            .slice(0, 4)
            .map((loc) => ({
              image: loc.image
                ? loc.image.startsWith("http")
                  ? loc.image
                  : `${imgUrlEndPoint}${loc.image}`
                : "",
              caption: loc.display_name || loc.name || loc.title,
            }))
            .filter((p) => p.image);
          if (fromLocations.length) return fromLocations;
          if (props.experienceData?.image) {
            return [
              {
                image: `${imgUrlEndPoint}${props.experienceData.image}`,
                caption: convertDbNameToCapitalFirst(
                  props.experienceData.slug || ""
                ),
              },
            ];
          }
          return [];
        })()}
        setShowTailoredModal={setShowTailoredModal}
        meta={
          <>
            <span>
              <span className="star">★</span> <b>4.8</b> Google · 1,200+ reviews
            </span>
            <span>·</span>
            <span>
              <b>{props.experienceData?.locations?.length || 0}</b> destinations
            </span>
            <span>·</span>
            <span>
              <b>IATA</b>-protected
            </span>
          </>
        }
      />
      {props.slug === "ladakh" && <LadakhLogo />}

      {props.slug === "japan-cherry-blossom" && (
        <div className="relative">
          {isPageWide && (
            <div className="absolute  left-0 -z-10 w-full md:w-[9.3%] h-[10rem]">
              <Image
                src={`${imgUrlEndPoint}media/themes/japan-banner-right.png`}
                fill
                className="absolute bottom-0 object-fill"
              />
            </div>
          )}

          {isPageWide && (
            <div className="absolute -top-1 right-0 -z-10 w-[10%] h-[10rem]">
              <Image
                src={`${imgUrlEndPoint}media/themes/japan-banner-right.png`}
                fill
                className="absolute bottom-0 object-fill"
              />
            </div>
          )}
        </div>
      )}

      {props.slug === "honeymoon-2025" && (
        <div className="relative">
          <div className="absolute -top-10 left-0 -z-10 w-full md:w-[50%] h-[10rem]">
            <Image
              src={`${imgUrlEndPoint}media/themes/Hearts.png`}
              fill
              className="absolute bottom-0 object-fill"
            />
          </div>

          {isPageWide && (
            <div className="absolute -top-10 right-0 -z-10 w-[50%] h-[10rem]">
              <Image
                src={`${imgUrlEndPoint}media/themes/Hearts.png`}
                fill
                className="absolute bottom-0 object-fill"
              />
            </div>
          )}
        </div>
      )}

      <SetWidthContainer>
        {props?.slug === "japan-cherry-blossom" && (
          <PathNavigation path={"asia/japan"} />
        )}
        {props.experienceData.overview_heading &&
          props.experienceData.overview_text &&
          props?.slug !== "ladakh" &&
          props?.slug !== "thailand" && props?.slug !== "dubai" && props?.slug !== "japan" && props?.slug !== "singapore" && props?.slug !== "bali" && props?.slug != 'europe-continent' ? (
          <Overview
            heading={props.experienceData.overview_heading}
            text={props.experienceData.overview_text}
            image={props.experienceData.overview_image}
            slug={props.slug}
          />
        ) : null}
        {props?.slug == "thailand" && (
          <>
            <OverviewThailand
              heading={props.experienceData.overview_heading}
              text={props.experienceData.overview_text}
              image={props.experienceData.overview_image}
              slug={props.slug}
            />
            <PlanYourTripLadakhButton
              className={
                "bg-[#F7E700] text-[16px] font-semibold !border-[1px] rounded-[16px]! w-[240px] !h-[56px] !px-0 !py-0"
              }
              text={"+ Plan Your Trip Now!"}
              page_id={props.country?.id}
              type={"country"}
              destination={convertDbNameToCapitalFirst(
                props.experienceData.slug
              )}
              slug={props?.slug}
            />
          </>
        )}

        <div className="mt-5">
          {components &&
            components.map((component, index) => {
              if (component.type === "Menu" && !component.parent) {
                const navComponents = components.filter(
                  (childComponent) => childComponent.parent === component.id
                );

                return navComponents.length > 0 ? (
                  <div key={index} className={`mx-3 space-y-12 mt-5`}>
                    {props?.slug === "perfect-proposals-2025" ? (
                      <>
                        <ThemeBackground
                          component={component}
                          slug={props?.slug}
                        />
                      </>
                    ) : (
                      <PrimaryHeading> {component.heading}</PrimaryHeading>
                    )}

                    <CarouselNavigation slug={props?.slug} components={navComponents} />

                    <PlanYourTripButton text={"+ Plan Itinerary For Free"} slug={props?.slug} />
                  </div>
                ) : null;
              }

              return (
                !component.parent && (
                  <div key={index} className="mx-3 space-y-12 mt-5">
                    <div className="space-y-3">
                      {(props?.slug === "perfect-proposals-2025" &&
                        (component?.priority == 13 ||
                          component?.priority == 9)) ||
                        component.heading == "The Gallery Section" ? (
                        ""
                      ) : (
                        <PrimaryHeading
                          className={` ${props?.slug != "japan-cherry-blossom"
                            ? "mx-auto text-center"
                            : "mt-7"
                            }
                          ${props?.slug == "ladakh" &&
                            component.carousel == "destination-7" &&
                            "max-w-[600px]"
                            }
                          `}
                        >
                          {component.heading}
                        </PrimaryHeading>
                      )}
                      <SecondaryHeading
                        className={`mx-auto text-center ${props?.slug == "ladakh" &&
                          component.carousel == "destination-7" &&
                          "max-w-[800px] text-[#7C7C7C]"
                          }`}
                      >
                        {component.text}
                      </SecondaryHeading>
                    </div>

                    <ThemeBackground component={component} slug={props?.slug} />
                    {props.slug === "japan-cherry-blossom" &&
                      component?.priority == 4 &&
                      isPageWide && (
                        <div className="relative w-full">
                          <div className="absolute -left-[9vw] md:-left-[9vw] -top-[20rem] -z-10 w-full md:w-[50%] h-[100rem]">
                            <Image
                              src={`${imgUrlEndPoint}media/themes/japan-places-destination.png`}
                              fill
                              className="absolute bottom-0 object-fill"
                            />
                          </div>
                        </div>
                      )}

                    {props.slug === "japan-cherry-blossom" &&
                      component?.priority == 1 &&
                      isPageWide && (
                        <div className="relative w-full">
                          <div className="absolute -left-[20vw] -top-[10rem] -z-10 w-full md:w-[28%] h-[20rem]">
                            <Image
                              src={`${imgUrlEndPoint}media/themes/other-destination.png`}
                              fill
                              className="absolute bottom-0 object-fill"
                            />
                          </div>
                        </div>
                      )}

                    {props.slug === "japan-cherry-blossom" &&
                      component?.priority == 8 &&
                      isPageWide && (
                        <div className="relative w-full">
                          <div className="absolute -right-[8vw] -top-[10rem] -z-10 w-full md:w-[20%] h-[10rem]">
                            <Image
                              src={`${imgUrlEndPoint}media/themes/japan-corner.png`}
                              fill
                              className="absolute bottom-0 object-fill"
                            />
                          </div>
                        </div>
                      )}

                    {props.slug === "japan-cherry-blossom" &&
                      component?.priority == 7 &&
                      isPageWide && (
                        <div className="relative w-full">
                          <div className="absolute -right-[9vw] -top-[12rem] -z-10 w-full md:w-[20%] h-[30rem]">
                            <Image
                              src={`${imgUrlEndPoint}media/themes/other-destination.png`}
                              fill
                              className="absolute bottom-0 object-fill"
                            />
                          </div>

                          <div className="absolute -left-[9vw] top-[3rem] -z-10 w-full md:w-[28%] h-[30rem]">
                            <Image
                              src={`${imgUrlEndPoint}media/themes/other-destination.png`}
                              fill
                              className="absolute bottom-0 object-fill"
                            />
                          </div>
                        </div>
                      )}

                    {/* Rendering Static Components */}

                    {component.type === "Generic" &&
                      component?.heading ===
                      "How We Keep It Budget-Friendly?" && (
                        <div>
                          <BudgetFriendly
                            page_id={props.experienceData?.id}
                            destination={props.experienceData?.destination}
                          ></BudgetFriendly>
                        </div>
                      )}

                    {component.type === "Why Choose Us?" &&
                      // component?.heading ===
                      //   "How We Keep It Budget-Friendly?" && (
                      <div>
                        <BudgetFriendly
                          page_id={props.experienceData?.id}
                          destination={props.experienceData?.destination}
                        ></BudgetFriendly>
                      </div>
                      // )
                    }

                    {component.type === "How it works?" && (
                      <div>
                        <BannerTwo
                          page_id={props.experienceData?.id}
                          destination={props.experienceData?.destination}
                        ></BannerTwo>
                      </div>
                    )}

                    {component.carousel === "Journey" && (
                      <div>
                        <JourneySimplified/>
                      </div>
                    )}

                     {component.carousel === "Travel-Match" && (
                      <div>
                        <TravelVibeSection isTheme={true}/>
                      </div>
                    )}

                    {component.type === "Generic" &&
                      component.heading === "Why plan with us?" && (
                        <WhyPlanWithUs page_id={props.experienceData?.id} />
                      )}

                    {/* Render specific carousel components based on type */}
                    {component.carousel === "destination-1" ? (
                      <>
                        <div className={destinationStyles.carouselWrap}>
                          <Swiper
                            modules={[Navigation]}
                            spaceBetween={16}
                            slidesPerView={1.1}
                            navigation={{
                              nextEl: `.Dest1-next-${index}`,
                              prevEl: `.Dest1-prev-${index}`,
                              clickable: true,
                            }}
                            breakpoints={{
                              640: { slidesPerView: 2, spaceBetween: 16 },
                              768: { slidesPerView: 2.5, spaceBetween: 16 },
                              1024: { slidesPerView: 3, spaceBetween: 16 },
                            }}
                          >
                            {[
                              ...component.cities.map((item) => ({
                                ...item,
                                type: "City",
                              })),
                              ...component.states.map((item) => ({
                                ...item,
                                type: "State",
                              })),
                              ...component.countries.map((item) => ({
                                ...item,
                                type: "Country",
                              })),
                            ].map((item, i) => (
                              <SwiperSlide key={item.id || `dest1-${i}`}>
                                <div className="h-full">
                                  <CountryCardV2
                                    item={item}
                                    hot={i === 0}
                                  />
                                </div>
                              </SwiperSlide>
                            ))}
                          </Swiper>
                          <div
                            className={`Dest1-prev-${index} ${destinationStyles.carouselNav} ${destinationStyles.carouselNavPrev}`}
                            aria-hidden
                          >
                            <FontAwesomeIcon icon={faChevronLeft} />
                          </div>
                          <div
                            className={`Dest1-next-${index} ${destinationStyles.carouselNav} ${destinationStyles.carouselNavNext}`}
                            aria-hidden
                          >
                            <FontAwesomeIcon icon={faChevronRight} />
                          </div>
                        </div>
                        <PlanYourTripButton text={"Start your journey now!"} slug={props?.slug} />
                      </>
                    ) : component.carousel === "itinerary-1" ? (
                      <>
                        <div className={destinationStyles.itinGrid}>
                          {component.itineraries
                            ?.slice(0, 4)
                            ?.map((it, i) => (
                              <ItineraryCardV2
                                key={it.id || i}
                                itinerary={it}
                              />
                            ))}
                        </div>
                        {props?.slug == "ladakh" ? (
                          <PlanYourTripLadakhButton
                            className={
                              "bg-[#F7E700] text-[16px] font-semibold !border-[1px] rounded-[16px]! w-[240px] !h-[56px] !px-0 !py-0"
                            }
                            text={"+ Plan Your Trip Now!"}
                            page_id={props.state?.id}
                            type={"state"}
                            destination={convertDbNameToCapitalFirst(
                              props.experienceData.slug
                            )}
                            slug={props?.slug}
                          />
                        ) : (
                          <PlanYourTripButton slug={props?.slug} />
                        )}
                      </>
                    ) : component.carousel === "itinerary-2" ? (
                      <div className="w-full relative">
                        {props.slug === "honeymoon-2025" && (
                          <>
                            <Image
                              src={`${imgUrlEndPoint}media/themes/red-hearts.png`}
                              className="object-fill absolute -left-[1rem] top-[10rem] md:-left-[9rem] md:top-0"
                              alt="Tilted Hearts"
                              height={300}
                              width={500}
                              style={{
                                opacity: "50%",
                              }}
                            />

                            <Image
                              src={`${imgUrlEndPoint}media/themes/red-hearts.png`}
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
                        <div className={destinationStyles.carouselWrap}>
                          <Swiper
                            modules={[Navigation]}
                            spaceBetween={16}
                            slidesPerView={1.1}
                            navigation={{
                              nextEl: ".PlacesBragSection-next",
                              prevEl: ".PlacesBragSection-prev",
                              clickable: true,
                            }}
                            breakpoints={{
                              640: { slidesPerView: 2.2, spaceBetween: 16 },
                              768: { slidesPerView: 3, spaceBetween: 16 },
                              1024: { slidesPerView: 4, spaceBetween: 16 },
                            }}
                          >
                            {component.activities.map((activity, i) => (
                              <SwiperSlide key={activity.id || i}>
                                <div className="h-full">
                                  <ActivityCardV2
                                    item={activity}
                                    kairaPick={i % 3 === 0}
                                    onClick={(d) =>
                                      handleOpenDrawer(d, "activity")
                                    }
                                  />
                                </div>
                              </SwiperSlide>
                            ))}
                          </Swiper>
                          <div
                            className={`PlacesBragSection-prev ${destinationStyles.carouselNav} ${destinationStyles.carouselNavPrev}`}
                            aria-hidden
                          >
                            <FontAwesomeIcon icon={faChevronLeft} />
                          </div>
                          <div
                            className={`PlacesBragSection-next ${destinationStyles.carouselNav} ${destinationStyles.carouselNavNext}`}
                            aria-hidden
                          >
                            <FontAwesomeIcon icon={faChevronRight} />
                          </div>
                        </div>
                        <PlanYourTripButton
                          text={"Create your free itinerary"}
                          slug={props?.slug}
                        />
                      </>
                    ) : component.carousel === "review-1" ? (
                      <div className="relative">
                        {props.slug === "honeymoon-2025" && (
                          <div className="-z-10 w-fit absolute -top-[16rem] right-0 md:-top-[9rem] overflow-hidden">
                            <Image
                              src={`${imgUrlEndPoint}media/themes/tilted-heart.png`}
                              className="object-fill"
                              alt="Tilted Hearts"
                              height={200}
                              width={200}
                              style={{ transform: "rotate(45deg)" }}
                            />
                          </div>
                        )}


                        <TestimonialCarousel headingNotVisible={true} reviews={component.reviews} />

                        {props?.slug == "ladakh" ? (
                          <PlanYourTripLadakhButton
                            page_id={props.state?.id}
                            type={"state"}
                            destination={convertDbNameToCapitalFirst(
                              props.experienceData.slug
                            )}
                            className={
                              "bg-[#F7E700] text-[16px] font-semibold !border-[1px] rounded-[16px]! w-[240px] !h-[56px] !px-0 !py-0"
                            }
                            text={"+ Plan Your Trip Now!"}
                            slug={props?.slug}
                          />
                        ) : (
                          <PlanYourTripButton slug={props?.slug} />
                        )}
                      </div>
                    ) : component.carousel === "destination-3" || component.carousel === "country-1" ? (
                      <>
                        <div className={destinationStyles.carouselWrap}>
                          <Swiper
                            modules={[Navigation]}
                            spaceBetween={16}
                            slidesPerView={1.1}
                            navigation={{
                              nextEl: `.Dest3-next-${index}`,
                              prevEl: `.Dest3-prev-${index}`,
                              clickable: true,
                            }}
                            breakpoints={{
                              640: { slidesPerView: 2, spaceBetween: 16 },
                              768: { slidesPerView: 2.5, spaceBetween: 16 },
                              1024: { slidesPerView: 3, spaceBetween: 16 },
                            }}
                          >
                            {(component?.countries || []).map((item, i) => (
                              <SwiperSlide key={item.id || `dest3-${i}`}>
                                <div className="h-full">
                                  <CountryCardV2 item={item} hot={i === 0} />
                                </div>
                              </SwiperSlide>
                            ))}
                          </Swiper>
                          <div
                            className={`Dest3-prev-${index} ${destinationStyles.carouselNav} ${destinationStyles.carouselNavPrev}`}
                            aria-hidden
                          >
                            <FontAwesomeIcon icon={faChevronLeft} />
                          </div>
                          <div
                            className={`Dest3-next-${index} ${destinationStyles.carouselNav} ${destinationStyles.carouselNavNext}`}
                            aria-hidden
                          >
                            <FontAwesomeIcon icon={faChevronRight} />
                          </div>
                        </div>
                        <PlanYourTripButton
                          text={"Create your travel plan now!"}
                          slug={props?.slug}
                        />
                      </>
                    ) : component.carousel === "state-1" ? (
                      <>
                        <div className={destinationStyles.carouselWrap}>
                          <Swiper
                            modules={[Navigation]}
                            spaceBetween={16}
                            slidesPerView={1.1}
                            navigation={{
                              nextEl: `.State1-next-${index}`,
                              prevEl: `.State1-prev-${index}`,
                              clickable: true,
                            }}
                            breakpoints={{
                              640: { slidesPerView: 2, spaceBetween: 16 },
                              768: { slidesPerView: 2.5, spaceBetween: 16 },
                              1024: { slidesPerView: 3, spaceBetween: 16 },
                            }}
                          >
                            {(component?.states || []).map((item, i) => (
                              <SwiperSlide key={item.id || `state1-${i}`}>
                                <div className="h-full">
                                  <CountryCardV2 item={item} hot={i === 0} />
                                </div>
                              </SwiperSlide>
                            ))}
                          </Swiper>
                          <div
                            className={`State1-prev-${index} ${destinationStyles.carouselNav} ${destinationStyles.carouselNavPrev}`}
                            aria-hidden
                          >
                            <FontAwesomeIcon icon={faChevronLeft} />
                          </div>
                          <div
                            className={`State1-next-${index} ${destinationStyles.carouselNav} ${destinationStyles.carouselNavNext}`}
                            aria-hidden
                          >
                            <FontAwesomeIcon icon={faChevronRight} />
                          </div>
                        </div>
                        <PlanYourTripButton
                          text={"Create your travel plan now!"}
                          slug={props?.slug}
                        />
                      </>
                    ) : component.carousel === "destination-4" ? (
                      <>
                        <div className={destinationStyles.carouselWrap}>
                          <Swiper
                            modules={[Navigation]}
                            spaceBetween={16}
                            slidesPerView={1.1}
                            navigation={{
                              nextEl: `.Dest4-next-${index}`,
                              prevEl: `.Dest4-prev-${index}`,
                              clickable: true,
                            }}
                            breakpoints={{
                              640: { slidesPerView: 2, spaceBetween: 16 },
                              768: { slidesPerView: 2.5, spaceBetween: 16 },
                              1024: { slidesPerView: 3, spaceBetween: 16 },
                            }}
                          >
                            {(component?.cities || []).map((item, i) => (
                              <SwiperSlide key={item.id || `dest4-${i}`}>
                                <div className="h-full">
                                  <CountryCardV2 item={item} hot={i === 0} />
                                </div>
                              </SwiperSlide>
                            ))}
                          </Swiper>
                          <div
                            className={`Dest4-prev-${index} ${destinationStyles.carouselNav} ${destinationStyles.carouselNavPrev}`}
                            aria-hidden
                          >
                            <FontAwesomeIcon icon={faChevronLeft} />
                          </div>
                          <div
                            className={`Dest4-next-${index} ${destinationStyles.carouselNav} ${destinationStyles.carouselNavNext}`}
                            aria-hidden
                          >
                            <FontAwesomeIcon icon={faChevronRight} />
                          </div>
                        </div>
                      </>
                    ) : component.carousel === "Activity-2" ? (
                      <>
                        <div className={destinationStyles.carouselWrap}>
                          <Swiper
                            modules={[Navigation]}
                            spaceBetween={16}
                            slidesPerView={1.1}
                            navigation={{
                              nextEl: `.Act2-next-${index}`,
                              prevEl: `.Act2-prev-${index}`,
                              clickable: true,
                            }}
                            breakpoints={{
                              640: { slidesPerView: 2.2, spaceBetween: 16 },
                              768: { slidesPerView: 3, spaceBetween: 16 },
                              1024: { slidesPerView: 4, spaceBetween: 16 },
                            }}
                          >
                            {(component.activities || []).map((activity, i) => (
                              <SwiperSlide key={activity.id || `act2-${i}`}>
                                <div className="h-full">
                                  <ActivityCardV2
                                    item={activity}
                                    kairaPick={i % 3 === 0}
                                    onClick={(d) =>
                                      handleOpenDrawer(d, "activity")
                                    }
                                  />
                                </div>
                              </SwiperSlide>
                            ))}
                          </Swiper>
                          <div
                            className={`Act2-prev-${index} ${destinationStyles.carouselNav} ${destinationStyles.carouselNavPrev}`}
                            aria-hidden
                          >
                            <FontAwesomeIcon icon={faChevronLeft} />
                          </div>
                          <div
                            className={`Act2-next-${index} ${destinationStyles.carouselNav} ${destinationStyles.carouselNavNext}`}
                            aria-hidden
                          >
                            <FontAwesomeIcon icon={faChevronRight} />
                          </div>
                        </div>
                        <PlanYourTripButton text={"+ Plan Itinerary For Free"} slug={props?.slug} />
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
                        <PlanYourTripButton text={"+ Plan Itinerary For Free"} slug={props?.slug} />
                      </>
                    ) : component.carousel === "destination-5" || component.carousel === "poi-1" ? (
                      <>
                        <div className={destinationStyles.carouselWrap}>
                          <Swiper
                            modules={[Navigation]}
                            spaceBetween={16}
                            slidesPerView={1.1}
                            navigation={{
                              nextEl: ".PlacesBragSection-n",
                              prevEl: ".PlacesBragSection-p",
                              clickable: true,
                            }}
                            breakpoints={{
                              640: { slidesPerView: 2.2, spaceBetween: 16 },
                              768: { slidesPerView: 3, spaceBetween: 16 },
                              1024: { slidesPerView: 4, spaceBetween: 16 },
                            }}
                          >
                            {component?.pois.map((poi, i) => (
                              <SwiperSlide key={poi.id || i}>
                                <div className="h-full">
                                  <ActivityCardV2
                                    item={poi}
                                    kairaPick={i % 3 === 0}
                                    onClick={(d) =>
                                      handleOpenDrawer(d, "poi")
                                    }
                                  />
                                </div>
                              </SwiperSlide>
                            ))}
                          </Swiper>
                          <div
                            className={`PlacesBragSection-p ${destinationStyles.carouselNav} ${destinationStyles.carouselNavPrev}`}
                            aria-hidden
                          >
                            <FontAwesomeIcon icon={faChevronLeft} />
                          </div>
                          <div
                            className={`PlacesBragSection-n ${destinationStyles.carouselNav} ${destinationStyles.carouselNavNext}`}
                            aria-hidden
                          >
                            <FontAwesomeIcon icon={faChevronRight} />
                          </div>
                        </div>
                      </>
                    ) : component.carousel === "destination-6" ? (
                      <>
                        <Continentcarousel
                          data={props.continetCarousel}
                          page={"Country Page"}
                        ></Continentcarousel>
                        <PlanYourTripButton
                          slug={props?.slug}
                          text={"Create your travel plan now!"}
                        />
                      </>
                    ) : component.carousel === "Image Caraousel" ? (
                      <>
                        <ImageCarousel slug={props?.slug} />
                        <PlanYourTripButton
                          slug={props?.slug}
                          text={"Create your travel plan now!"}
                        />
                      </>
                    ) : component.carousel === "destination-7" ? (
                      <>
                        <div className={destinationStyles.carouselWrap}>
                          <Swiper
                            modules={[Navigation]}
                            spaceBetween={16}
                            slidesPerView={1.1}
                            navigation={{
                              nextEl: `.Dest7-next-${index}`,
                              prevEl: `.Dest7-prev-${index}`,
                              clickable: true,
                            }}
                            breakpoints={{
                              640: { slidesPerView: 2, spaceBetween: 16 },
                              768: { slidesPerView: 2.5, spaceBetween: 16 },
                              1024: { slidesPerView: 3, spaceBetween: 16 },
                            }}
                          >
                            {(component?.cities || []).map((item, i) => (
                              <SwiperSlide key={item.id || `dest7-${i}`}>
                                <div className="h-full">
                                  <CountryCardV2 item={item} hot={i === 0} />
                                </div>
                              </SwiperSlide>
                            ))}
                          </Swiper>
                          <div
                            className={`Dest7-prev-${index} ${destinationStyles.carouselNav} ${destinationStyles.carouselNavPrev}`}
                            aria-hidden
                          >
                            <FontAwesomeIcon icon={faChevronLeft} />
                          </div>
                          <div
                            className={`Dest7-next-${index} ${destinationStyles.carouselNav} ${destinationStyles.carouselNavNext}`}
                            aria-hidden
                          >
                            <FontAwesomeIcon icon={faChevronRight} />
                          </div>
                        </div>
                        <PlanYourTripLadakhButton
                          page_id={props.state?.id}
                          type={"state"}
                          destination={convertDbNameToCapitalFirst(
                            props.experienceData.slug
                          )}
                          className={
                            "bg-[#F7E700] text-[16px] font-semibold !border-[1px] rounded-[16px]! w-[176px] !h-[56px] !px-0 !py-0"
                          }
                          text={"Plan a Trip Now!"}
                          slug={props?.slug}
                        />
                      </>
                    ) : component.carousel === "Activity-3" ? (
                      <>
                        <div className={destinationStyles.carouselWrap}>
                          <Swiper
                            modules={[Navigation]}
                            spaceBetween={16}
                            slidesPerView={1.1}
                            navigation={{
                              nextEl: `.Act3-next-${index}`,
                              prevEl: `.Act3-prev-${index}`,
                              clickable: true,
                            }}
                            breakpoints={{
                              640: { slidesPerView: 2.2, spaceBetween: 16 },
                              768: { slidesPerView: 3, spaceBetween: 16 },
                              1024: { slidesPerView: 4, spaceBetween: 16 },
                            }}
                          >
                            {(component.activities || []).map((activity, i) => (
                              <SwiperSlide key={activity.id || `act3-${i}`}>
                                <div className="h-full">
                                  <ActivityCardV2
                                    item={activity}
                                    kairaPick={i % 3 === 0}
                                    onClick={(d) =>
                                      handleOpenDrawer(d, "activity")
                                    }
                                  />
                                </div>
                              </SwiperSlide>
                            ))}
                          </Swiper>
                          <div
                            className={`Act3-prev-${index} ${destinationStyles.carouselNav} ${destinationStyles.carouselNavPrev}`}
                            aria-hidden
                          >
                            <FontAwesomeIcon icon={faChevronLeft} />
                          </div>
                          <div
                            className={`Act3-next-${index} ${destinationStyles.carouselNav} ${destinationStyles.carouselNavNext}`}
                            aria-hidden
                          >
                            <FontAwesomeIcon icon={faChevronRight} />
                          </div>
                        </div>
                        <PlanYourTripLadakhButton
                          page_id={props.state?.id}
                          type={"state"}
                          destination={convertDbNameToCapitalFirst(
                            props.experienceData.slug
                          )}
                          className={
                            "bg-[#F7E700] text-[16px] font-semibold !border-[1px] rounded-[16px]! w-[240px] !h-[56px] !px-0 !py-0"
                          }
                          text={"Create your free itinerary"}
                          slug={props?.slug}
                        />
                      </>
                    ) : component.carousel === "destination-8" ? (
                      <>
                        <Element2
                          data={component.elements}
                          elements={component?.elements}
                          city={component?.name}
                          // handlePlanButtonClick={()=>{}}
                          // {handlePlanButtonClick}
                          slug={props?.slug}
                          page={"Country Page"}
                        />
                        <PlanYourTripLadakhButton
                          page_id={props.state?.id}
                          type={"state"}
                          destination={convertDbNameToCapitalFirst(
                            props.experienceData.slug
                          )}
                          className={
                            "bg-[#F7E700] text-[16px] font-semibold !border-[1px] rounded-[16px]! w-[240px] !h-[56px] !px-0 !py-0"
                          }
                          text={"+ Plan Your Trip Now!"}
                          slug={props?.slug}
                        />
                      </>
                    ) : component.carousel == "images-1" ? (
                      <div>
                        <CurvedSwiper />
                        <PlanYourTripLadakhButton
                          className={
                            "bg-[#F7E700] text-[16px] font-semibold !border-[1px] rounded-[16px]! w-[240px] !h-[56px] !px-0 !py-0"
                          }
                          text={"+ Plan Your Trip Now!"}
                          page_id={props.state?.id}
                          type={"state"}
                          destination={convertDbNameToCapitalFirst(
                            props.experienceData.slug
                          )}
                          slug={props?.slug}
                        />
                      </div>
                    ) : component.carousel == "journey-1" ? (
                      <JourneyType
                        page_id={props.state?.id}
                        destination={convertDbNameToCapitalFirst(
                          props.experienceData.slug
                        )}
                        type={"state"}
                      />
                    ) : null}
                  </div>
                )
              );
            })}
        </div>

        {props.slug === "honeymoon-2025" && (
          <div className="relative">
            <div
              className="-z-10 absolute -top-[3rem] w-[18rem] h-[18rem]"
              style={{ transform: "rotate(-12deg)" }}
            >
              <Image
                src={`${imgUrlEndPoint}media/themes/tilted-heart.png`}
                className="object-fill"
                alt="Tilted Hearts"
                height={200}
                width={200}
              />
            </div>
          </div>
        )}

        <div className="my-[100px]">
          {props.experienceData.faq.length > 0 && (
            <ThemeFaqs faqs={props.experienceData.faq || props?.FAQ} />
          )}
        </div>
        {props?.experienceData?.slug === "japan-cherry-blossom" && (
          <>
            {isPageWide && (
              <div className="relative w-full">
                <div className="absolute -left-[8vw] top-[28rem] -z-10 w-full md:w-[20%] h-[10rem] ">
                  <Image
                    src={`${imgUrlEndPoint}media/themes/japan-corner.png`}
                    fill
                    className="absolute bottom-0 object-fill transform scale-x-[-1]"
                  />
                </div>
              </div>
            )}

            {/* <div className="space-y-3">
              <PrimaryHeading className="mx-auto text-center">
                What they say?
              </PrimaryHeading>
            </div> */}
            {/* <AsSeenIn /> */}
            {/* <PartnersSection />
            <ChatWithUs planner page_id={props.experienceData?.id}></ChatWithUs> */}
          </>
        )}
      </SetWidthContainer>

      <TailoredFormMobileModal
        destinationType={destination?.type}
        page_id={destination?.pageId}
        children_cities={props?.children_cities}
        destination={destination?.name}
        cities={props?.cities}
        onHide={() => {
          setShowTailoredModal(false);
        }}
        show={showTailoredModal}
      />


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
}

export const PlanYourTripButton = (props) => {
  let isPageWide = media("(min-width: 768px)");
  const [showTailoredModal, setShowTailoredModal] = useState(false);
  const router = useRouter();

  const handlePlanButton = () => {
    // if (isPageWide) {
      setShowTailoredModal(true);
    // } else {
    //   openTailoredModal(router, props.page_id, props.destination);
    // }

    // router.push({
    //   pathname: "/new-trip",
    //   query: { ...router.query, source: props?.slug || 'home' }
    // });

    logEvent({
      action: "Plan_Itinerary",
      params: {
        page: props.page ? props.page : "",
        event_category: "Button Click",
        event_label: "Plan Itinerary For Free!",
        event_action: "Banner",
      },
    });
  };

  return (

    <div className="flex items-center justify-center mt-5 text-white bg-[#07213A] rounded-md  w-fit mx-auto hover:opacity-90 cursor-pointer">
      <SecondaryButton onClick={handlePlanButton} className={props?.className}>
        {props.text
          ? props.text
          : props.slug === "honeymoon-2025"
            ? "Plan Your Honeymoon!"
            : "+ Plan Your Trip Now!"}
      </SecondaryButton>

      <TailoredFormMobileModal
        destinationType={"city-planner"}
        page_id={props.page_id}
        children_cities={props.children_cities}
        destination={props.destination}
        cities={props.cities}
        onHide={() => {
          setShowTailoredModal(false);
        }}
        show={showTailoredModal}
        eventDates={props.eventDates}
      />
    </div>
  );
};

export const PlanYourTripLadakhButton = (props) => {
  let isPageWide = media("(min-width: 768px)");
  const [showTailoredModal, setShowTailoredModal] = useState(false);
  const router = useRouter();

  const handlePlanButton = () => {
    // openTailoredModal(router, props.page_id, props.destination, props.type);
    // router.push({
    //   pathname: "/new-trip",
    //   query: { ...router.query, source: props?.slug || 'home' }
    // });
    setShowTailoredModal(true);

    logEvent({
      action: "Plan_Itinerary",
      params: {
        page: props.page ? props.page : "",
        event_category: "Button Click",
        event_label: "Plan Itinerary For Free!",
        event_action: "Banner",
      },
    });
  };

  return (
    <div className="flex items-center justify-center mt-5 bg-white">
      <button
        onClick={handlePlanButton}
        className={
          "border-2 border-black rounded-lg px-5 py-2 mx-auto hover:text-white hover:bg-black transition-all "
        }
      >
        {props.text}
      </button>

      <TailoredFormMobileModal
        destinationType={"city-planner"}
        page_id={props.page_id}
        children_cities={props.children_cities}
        destination={props.destination}
        cities={props.cities}
        onHide={() => {
          setShowTailoredModal(false);
        }}
        show={showTailoredModal}
        eventDates={props.eventDates}
      />
    </div>
  );
};

import React, { useState, useEffect } from "react";
import validateTextSize from "../../services/textSizeValidator";
import Button from "../../components/ui/button/Index";
import ChatWithUs from "../../components/containers/ChatWithUs/ChatWithUs";
import Continentcarousel from "../../components/continentcarousel/continentcarousel";
import PathNavigation from "../travelplanner/PathNavigation";
import { logEvent } from "../../services/ga/Index.js";
import Destination1Carousel from "../../components/theme/Destination1Carousel.jsx";
import { PlanYourTripButton } from "../travelplanner/ThemePage.jsx";
import Itinerary1Carousel from "../../components/theme/Itinerary1Carousel.jsx";
import Image from "next/image.js";
import Itinerary2Carousel from "../../components/theme/Itinerary2Carousel.jsx";
import Reviews1Carousel from "../../components/theme/Reviews1Carousel.jsx";
import { convertDbNameToCapitalFirst } from "../../helper/convertDbnameToCapitalFirst.js";
import Poi from "../newcityplanner/pois/Index.js";
import TailoredFormMobileModal from "../../components/modals/TailoredFomrMobile.js";
import Overview from "../themes/Overview.jsx";
import Element from "../newcityplanner/elements/Index.js";
import LocationsBlog from "../../components/containers/plannerlocations/Index.js";
import HeroSection from "../../components/revamp/destination/HeroSection.jsx";
import { imgUrlEndPoint } from "../../components/theme/ThemeConstants.js";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DestinationCard from "../../components/revamp/common/components/card/DestinationCard.jsx";
import {
  faChevronLeft,
  faChevronRight,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import POIDetailsDrawer from "../../components/drawers/poiDetails/POIDetailsDrawer.js";
import CtaBoardingSection from "../../components/revamp/home/CtaBoardingSection.jsx";
import JourneySimplified from "../../components/revamp/home/JourneySimplified.jsx";
import WhatMakesUsSection from "../../components/revamp/home/WhatMakesUsSection.jsx";
import CurveImageGallery from "../../components/theme/CurveImageGallery.jsx";
import PartnersSection from "../../components/theme/PartnersSection.jsx";
import TestimonialCarousel from "../../components/theme/TestimonialCarousel.jsx";
import DesktopBanner from "../../components/containers/Banner.js";
import styles from "../../styles/pages/revamp/destination.module.scss";

const carouselBreakpoints = {
  640: { slidesPerView: 1.5, spaceBetween: 16 },
  768: { slidesPerView: 2, spaceBetween: 20 },
  1024: { slidesPerView: 3, spaceBetween: 24 },
};

const wideCarouselBreakpoints = {
  640: { slidesPerView: 1.5, spaceBetween: 16 },
  768: { slidesPerView: 2, spaceBetween: 20 },
  1024: { slidesPerView: 4, spaceBetween: 24 },
};

const Index = (props) => {
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
    setShowTailoredModal(true);
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

  const destinationLabel = props.destination
    ? props.destination
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "";

  const renderCarousel = (
    items,
    keyPrefix,
    cardProps = {},
    onItemClick,
    slidesPerViewDesktop = 3,
    height = "376px",
  ) => {
    const prevClass = `${keyPrefix}-prev`;
    const nextClass = `${keyPrefix}-next`;
    const desktopBreakpoints =
      slidesPerViewDesktop === 4 ? wideCarouselBreakpoints : carouselBreakpoints;

    return (
      <div className={styles.carouselWrap}>
        <Swiper
          style={{ height: height === "auto" ? "auto" : height }}
          modules={[Navigation]}
          spaceBetween={16}
          slidesPerView={1}
          navigation={{
            nextEl: `.${nextClass}`,
            prevEl: `.${prevClass}`,
            clickable: true,
          }}
          breakpoints={desktopBreakpoints}
        >
          {items?.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="w-full px-1">
                <DestinationCard
                  title={item?.display_name || item.title || item.name}
                  description={item.one_liner_description || item.tagline}
                  one_liner_description={item.one_liner_description}
                  image={item.image}
                  rating={item.rating}
                  reviewCount={item.user_ratings_total}
                  tags={
                    item.tags ||
                    (item.continent ? [item.continent] : [])
                  }
                  gradientOverlay={item.gradientOverlay}
                  onClick={() =>
                    onItemClick
                      ? onItemClick(item)
                      : item.path && window.location.replace("/" + item.path)
                  }
                  setShowTailoredModal={setShowTailoredModal}
                  {...cardProps}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className={`${prevClass} ${styles.carouselNav} ${styles.carouselNavPrev}`} aria-hidden>
          <FontAwesomeIcon icon={faChevronLeft} />
        </div>
        <div className={`${nextClass} ${styles.carouselNav} ${styles.carouselNavNext}`} aria-hidden>
          <FontAwesomeIcon icon={faChevronRight} />
        </div>
      </div>
    );
  };

  return (
    <div className={styles.continentPage}>
      <HeroSection
        title={validateTextSize(
          `Your ${convertDbNameToCapitalFirst(
            props.data?.slug
          )} Trip, Designed Around You`,
          9,
          `Craft a trip to ${props.data?.destination} now!`
        )}
        image={`${imgUrlEndPoint}${props.data?.image}`}
        slug={props?.data?.slug}
        setShowTailoredModal={setShowTailoredModal}
      />

      {/* STATS STRIP */}
      <div className={styles.statsStrip}>
        <div className={styles.statsStripInner}>
          <div className={styles.stat}>
            <div className={styles.statLabel}>Destination</div>
            <div className={styles.statValue}>
              <span className={styles.serif}>{destinationLabel}</span>
            </div>
            <div className={styles.statSub}>Curated by Kaira</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statLabel}>Top countries</div>
            <div className={styles.statValue}>
              <span className={styles.serif}>
                {props.locations?.length || 0}
              </span>{" "}
              destinations
            </div>
            <div className={styles.statSub}>Hand-picked picks</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statLabel}>Itineraries</div>
            <div className={styles.statValue}>
              <span className={styles.serif}>
                {userItineraries?.length || 0}+
              </span>{" "}
              ready
            </div>
            <div className={styles.statSub}>Tweak anything in chat</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statLabel}>Trusted by</div>
            <div className={styles.statValue}>
              <span className={styles.serif}>10K+</span> travellers
            </div>
            <div className={styles.statSub}>From across India</div>
          </div>
        </div>
      </div>

      <div className={styles.container}>
        <DesktopBanner
          loading={desktopBannerLoading}
          onclick={() => setShowTailoredModal(true)}
          text={`Craft a personalized itinerary${
            props.data?.slug
              ? " to " + convertDbNameToCapitalFirst(props.data?.slug) + " now"
              : ""
          }!`}
        />

        <div className={styles.crumb}>
          <PathNavigation path={props.data?.path} />
        </div>

        {/* TOP COUNTRIES */}
        {props.locations && props.locations.length ? (
          <section className={styles.block}>
            <div className={styles.sectionHead}>
              <div className={styles.sectionHeadLeft}>
                <h2>
                  Top countries{" "}
                  <span className={styles.serif}>in {destinationLabel}.</span>
                </h2>
                <p className={styles.lede}>
                  Curated, not alphabetical.{" "}
                  <span className={styles.serif}>Best for first-timers</span>{" "}
                  sitting alongside the offbeat picks.
                </p>
              </div>
              <span
                className={styles.sectionLink}
                onClick={() =>
                  handlePlanButtonClick(
                    `Top countries to visit in ${props?.data?.destination}`
                  )
                }
              >
                See all destinations
                <FontAwesomeIcon icon={faArrowRight} />
              </span>
            </div>
            {renderCarousel(props.locations, "TopCountriesSection")}
            <div className="flex justify-center mt-8">
              <Button
                onclick={() =>
                  handlePlanButtonClick(
                    `Top countries to visit in ${props?.data?.destination}`
                  )
                }
                borderWidth="1px"
                fontWeight="300"
                borderRadius="999px"
                margin="0 auto"
                padding="0.8rem 2rem"
                bgColor="#0f1a2e"
                color="white"
              >
                Create your free itinerary
              </Button>
            </div>
          </section>
        ) : null}

        {/* OVERVIEW / EDITORIAL */}
        {props?.data?.slug != "europe-continent" && (
          <section className={`${styles.block} ${styles.editorialBlock}`}>
            <Overview
              heading={props.data?.overview_heading}
              text={props.data?.overview_text}
              image={props.data?.overview_image}
              slug={props.data?.slug}
              page_id={props.data?.id}
              type={props.type}
              destination={convertDbNameToCapitalFirst(props.data?.slug)}
            />
          </section>
        )}

        {/* COMPONENTS FROM API */}
        {props?.data?.components?.length > 0 &&
          props?.data?.components?.map((component, idx) => {
            const isActivityOrPoi =
              component.carousel.toLowerCase().includes("activity") ||
              component.carousel.toLowerCase().includes("poi");
            const tinted = component.carousel === "itinerary-1";
            return (
              <section
                key={`${component.carousel}-${idx}`}
                className={`${styles.block} ${
                  tinted ? styles.componentBlockTinted : ""
                }`}
              >
                <div
                  className={`${styles.sectionHead} ${
                    isActivityOrPoi ? "" : styles.sectionHeadCenter
                  }`}
                >
                  <div className={styles.sectionHeadLeft}>
                    {tinted && (
                      <div className={styles.itinPill}>
                        ★ Real trips, real travellers
                      </div>
                    )}
                    <h2>{component?.heading}</h2>
                    {component.text ? (
                      <p className={styles.lede}>{component.text}</p>
                    ) : null}
                  </div>
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
                      destination={convertDbNameToCapitalFirst(props.data?.slug)}
                      type={props?.type}
                    />
                  </>
                ) : component.carousel === "destination-2" ? (
                  <>
                    <Element
                      data={component.elements}
                      elements={component?.elements}
                      city={component?.name}
                      slug={props?.slug}
                      page={"Country Page"}
                    />
                    <PlanYourTripButton text={"+ Plan Itinerary For Free"} />
                  </>
                ) : component.carousel === "destination-3" ? (
                  <>
                    {renderCarousel(component?.countries, `Destination3-${idx}`)}
                    <PlanYourTripButton text={"Create your travel plan now!"} />
                  </>
                ) : component.carousel === "destination-4" ? (
                  <div className="space-y-4">
                    {renderCarousel(component?.cities, `Destination4-${idx}`)}
                  </div>
                ) : component.carousel === "destination-5" ? (
                  <Poi
                    elevation={component?.elevation}
                    data={component?.data}
                    thingsToDoPage={component?.thingsToDoPage}
                    pois={component?.pois}
                    city={component?.name}
                  />
                ) : component.carousel === "destination-6" ? (
                  <>
                    <Continentcarousel
                      data={props.continetCarousel}
                      page={"Country Page"}
                    />
                    <PlanYourTripButton text={"Create your travel plan now!"} />
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
                    />
                    <PlanYourTripButton text={"Create your travel plan now!"} />
                  </>
                ) : component.carousel === "Activity-2" ? (
                  <>
                    {renderCarousel(
                      component?.activities,
                      `Activity2-${idx}`,
                      { showImageText: false },
                      (activity) => handleOpenDrawer(activity, "activity"),
                      3,
                      "auto"
                    )}
                    <PlanYourTripButton text={"+ Plan Itinerary For Free"} />
                  </>
                ) : component.carousel === "itinerary-1" ? (
                  <>
                    <Itinerary1Carousel itineraries={component.itineraries} />
                    <PlanYourTripButton
                      page_id={props.data.id}
                      destination={convertDbNameToCapitalFirst(props.data?.slug)}
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
                          style={{ opacity: "50%" }}
                        />
                        <Image
                          src={`https://d31aoa0ehgvjdi.cloudfront.net/media/themes/red-hearts.png`}
                          className="object-fill absolute -right-[1rem] top-[35rem] md:-right-[6rem] md:top-0"
                          alt="Tilted Hearts"
                          height={300}
                          width={500}
                          style={{ opacity: "50%" }}
                        />
                      </>
                    )}
                    <Itinerary2Carousel elements={component.elements} />
                  </div>
                ) : component.carousel === "activity-1" ? (
                  <>
                    {renderCarousel(
                      component?.activities,
                      `Activity1-${idx}`,
                      { showImageText: false },
                      (activity) => handleOpenDrawer(activity, "activity"),
                      4,
                      "auto"
                    )}
                    <PlanYourTripButton
                      page_id={props.data.id}
                      destination={convertDbNameToCapitalFirst(props.data?.slug)}
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
                      destination={convertDbNameToCapitalFirst(props.data?.slug)}
                      type={props?.type}
                    />
                  </div>
                ) : component.carousel == "poi-1" ? (
                  <>
                    {renderCarousel(
                      component?.pois,
                      `Poi1-${idx}`,
                      { showImageText: false },
                      (poi) => handleOpenDrawer(poi, "poi"),
                      4,
                      "auto"
                    )}
                    <PlanYourTripButton
                      page_id={props.data.id}
                      destination={convertDbNameToCapitalFirst(props.data?.slug)}
                      type={props?.type}
                    />
                  </>
                ) : null}
              </section>
            );
          })}

        <JourneySimplified />

        {/* OTHER CONTINENTS */}
        {props.continetCarousel?.length ? (
          <section className={styles.block}>
            <div className={styles.sectionHead}>
              <div className={styles.sectionHeadLeft}>
                <h2>
                  Or maybe <span className={styles.serif}>elsewhere.</span>
                </h2>
                <p className={styles.lede}>
                  {destinationLabel} not it?{" "}
                  <span className={styles.serif}>Plan a trip</span> anywhere in
                  the world.
                </p>
              </div>
            </div>
            <Continentcarousel
              data={props.continetCarousel}
              page={"Continent Page"}
            />
            <div className="flex justify-center mt-8">
              <Button
                onclick={() =>
                  handlePlanButtonClick("Plan your trip anywhere in the world")
                }
                borderWidth="1px"
                fontWeight="300"
                borderRadius="999px"
                margin="0 auto"
                padding="0.8rem 2rem"
                bgColor="#0f1a2e"
                color="white"
              >
                Create your free itinerary
              </Button>
            </div>
          </section>
        ) : null}

        <WhatMakesUsSection />

        <CurveImageGallery />
        <TestimonialCarousel />

        <PartnersSection />

        <ChatWithUs planner page_id={props.data?.id} />
      </div>

      {/* FINAL CTA */}
      <section className={styles.finalCta}>
        <div className={styles.finalCtaInner}>
          <h2>
            {destinationLabel}, <span className={styles.serif}>your way.</span>
          </h2>
          <p>
            Tell Kaira your dates and vibe. She'll have a real plan back in
            under 2 minutes.
          </p>
          <button
            className={styles.btnPrimary}
            onClick={() =>
              handlePlanButtonClick(`Final CTA - ${destinationLabel}`)
            }
          >
            Plan my {destinationLabel} trip
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
          <div className={styles.finalCtaTrust}>
            No commitment · free to plan · pay only for what you pick.
          </div>
        </div>
      </section>

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
        />
      )}
    </div>
  );
};

export default Index;

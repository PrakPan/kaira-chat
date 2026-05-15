import React, { useState, useEffect } from "react";
import validateTextSize from "../../services/textSizeValidator";
import Overview from "../travelplanner/Overview";
import Button from "../../components/ui/button/Index";
import ChatWithUs from "../../components/containers/ChatWithUs/ChatWithUs";
import Continentcarousel from "../../components/continentcarousel/continentcarousel";
import PathNavigation from "../travelplanner/PathNavigation";
import Experience from "../../components/containers/Experiences";
import dynamic from "next/dynamic";
import { logEvent } from "../../services/ga/Index.js";
import HeroSection from "../../components/revamp/destination/HeroSection.jsx";
import { imgUrlEndPoint } from "../../components/theme/ThemeConstants.js";
const MapBox = dynamic(() => import("../../components/Map.js"), {
  ssr: false,
});
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
import { convertDbNameToCapitalFirst } from "../../helper/convertDbnameToCapitalFirst.js";
import TailoredFormMobileModal from "../../components/modals/TailoredFomrMobile.js";
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
  const [desktopBannerLoading, setDesktopBannerLoading] = useState(false);
  const [showTailoredModal, setShowTailoredModal] = useState(false);
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
      props.data.locations.map((location) => {
        if (location?.is_hot_location) {
          hot_locations.push(location);
        }
      });
    }
    setHotLocations(hot_locations);
    setUserItineraries(props?.data?.itineraries);
  }, [props?.data?.itineraries, props?.data?.locations]);

  const InfoWindowContainer = (location) => (
    <div>
      <b style={{ fontWeight: 600 }}>{location.name}</b>
      <div>
        {location.most_popular_for?.map((e, i) =>
          i != 0 ? <span key={i}>{", " + e}</span> : <span key={i}>{e}</span>
        )}
      </div>
    </div>
  );

  const handlePlanButtonClick = (location) => {
    setShowTailoredModal(true);
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

  const renderCarousel = (
    items,
    keyPrefix,
    cardProps = {},
    onItemClick,
    slidesPerViewDesktop = 3,
    height = "376px"
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
                  description={item.description || item.tagline}
                  one_liner_description={
                    item?.state?.one_liner_description ||
                    item?.one_liner_description
                  }
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

  const destinationName = props.data?.name || "";

  return (
    <div className={styles.destinationPage}>
      <HeroSection
        title={validateTextSize(
          `Your ${destinationName} Trip, Designed Around You`,
          9,
          `Craft a trip to ${destinationName} now!`
        )}
        image={`${imgUrlEndPoint}${props?.data?.image}`}
        slug={props?.data?.slug}
        setShowTailoredModal={setShowTailoredModal}
      />

      {/* STATS STRIP */}
      <div className={styles.statsStrip}>
        <div className={styles.statsStripInner}>
          <div className={styles.stat}>
            <div className={styles.statLabel}>Destination</div>
            <div className={styles.statValue}>
              <span className={styles.serif}>{destinationName}</span>
            </div>
            <div className={styles.statSub}>Curated by Kaira</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statLabel}>Top locations</div>
            <div className={styles.statValue}>
              <span className={styles.serif}>{hotLocations.length || 0}</span>{" "}
              hot picks
            </div>
            <div className={styles.statSub}>Hand-picked across {destinationName}</div>
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
            <div className={styles.statLabel}>Continent</div>
            <div className={styles.statValue}>
              <span className={styles.serif}>
                {convertDbNameToCapitalFirst(props.data?.continent || "")}
              </span>
            </div>
            <div className={styles.statSub}>Part of a wider Asia plan</div>
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
          <PathNavigation path={props?.data?.path} />
        </div>

        {/* TOP CITIES */}
        {hotLocations.length ? (
          <section className={styles.block}>
            <div className={styles.sectionHead}>
              <div className={styles.sectionHeadLeft}>
                <h2>
                  Popular cities{" "}
                  <span className={styles.serif}>in {destinationName}.</span>
                </h2>
                <p className={styles.lede}>
                  Hand-picked, not alphabetical.{" "}
                  <span className={styles.serif}>Best for first-timers</span>{" "}
                  alongside under-the-radar picks.
                </p>
              </div>
              <span
                className={styles.sectionLink}
                onClick={() => handlePlanButtonClick(`Popular cities in ${destinationName}`)}
              >
                See all locations
                <FontAwesomeIcon icon={faArrowRight} />
              </span>
            </div>
            {renderCarousel(hotLocations, "HotLocations")}
            <div className="flex justify-center mt-8">
              <Button
                onclick={() =>
                  handlePlanButtonClick(`Popular cities in ${destinationName}`)
                }
                borderWidth="1px"
                fontWeight="400"
                borderRadius="999px"
                margin="0 auto"
                padding="0.8rem 2rem"
                bgColor="#0f1a2e"
                color="white"
              >
                + Create a trip now!
              </Button>
            </div>
          </section>
        ) : null}

        {/* OVERVIEW / EDITORIAL */}
        <section className={`${styles.block} ${styles.editorialBlock}`}>
          <Overview
            overview_heading={"A little about " + destinationName}
            overview_text={props?.data?.short_description}
          />
          {props?.data?.locations && props?.data?.locations?.length ? (
            <div style={{ marginTop: 32 }}>
              <MapBox
                InfoWindowContainer={InfoWindowContainer}
                locations={props?.data?.locations}
                height="300px"
              />
            </div>
          ) : null}
        </section>

        {/* TRIPS BY USERS */}
        {userItineraries?.length ? (
          <section className={`${styles.block} ${styles.itinerariesBlock}`}>
            <div className={styles.sectionHead}>
              <div className={styles.sectionHeadLeft}>
                <div className={styles.itinPill}>★ Real trips, real travellers</div>
                <h2>
                  {destinationName} trips our{" "}
                  <span className={styles.serif}>travellers loved.</span>
                </h2>
                <p className={styles.lede}>
                  Hand-built routes across {destinationName}.{" "}
                  <span className={styles.serif}>Tweak anything</span> in chat.
                </p>
              </div>
            </div>
            <Experience experiences={userItineraries} page={"Country Page"} />
          </section>
        ) : null}

        {/* THINGS TO DO */}
        {props.data.activities?.length ? (
          <section className={styles.block} id="Activities">
            <div className={styles.sectionHead}>
              <div className={styles.sectionHeadLeft}>
                <h2>
                  Things to do{" "}
                  <span className={styles.serif}>in {destinationName}.</span>
                </h2>
                <p className={styles.lede}>
                  Activities we'd actually recommend —{" "}
                  <span className={styles.serif}>not a tourist trap list.</span>
                </p>
              </div>
            </div>
            {renderCarousel(
              props.data.activities,
              "Activities",
              { showImageText: false },
              (activity) => handleOpenDrawer(activity, "activity"),
              4,
              "auto"
            )}
            <div className="flex justify-center mt-8">
              <Button
                onclick={() => setShowTailoredModal(true)}
                borderWidth="1px"
                fontWeight="400"
                borderRadius="999px"
                margin="0 auto"
                padding="0.8rem 2rem"
                bgColor="#0f1a2e"
                color="white"
              >
                + Create a trip now!
              </Button>
            </div>
          </section>
        ) : null}

        {/* PLACES TO VISIT */}
        {props.data.pois?.length ? (
          <section className={styles.block} id="Places">
            <div className={styles.sectionHead}>
              <div className={styles.sectionHeadLeft}>
                <h2>
                  Places to visit{" "}
                  <span className={styles.serif}>in {destinationName}.</span>
                </h2>
                <p className={styles.lede}>
                  Iconic landmarks, hidden corners,{" "}
                  <span className={styles.serif}>and the in-betweens.</span>
                </p>
              </div>
            </div>
            {renderCarousel(
              props.data.pois,
              "Pois",
              { showImageText: false },
              (poi) => handleOpenDrawer(poi, "poi"),
              4,
              "auto"
            )}
            <div className="flex justify-center mt-8">
              <Button
                onclick={() => setShowTailoredModal(true)}
                borderWidth="1px"
                fontWeight="400"
                borderRadius="999px"
                margin="0 auto"
                padding="0.8rem 2rem"
                bgColor="#0f1a2e"
                color="white"
              >
                + Create a trip now!
              </Button>
            </div>
          </section>
        ) : null}

        {/* STATES INSIDE COUNTRY */}
        {props.data.states && props.data.states.length ? (
          <section className={styles.block}>
            <div className={styles.sectionHead}>
              <div className={styles.sectionHeadLeft}>
                <h2>
                  Trending destinations{" "}
                  <span className={styles.serif}>across {destinationName}.</span>
                </h2>
                <p className={styles.lede}>
                  Regions worth carving time for.{" "}
                  <span className={styles.serif}>Combine two or three.</span>
                </p>
              </div>
            </div>
            {renderCarousel(props.data.states, "States")}
            <div className="flex justify-center mt-8">
              <Button
                onclick={() =>
                  handlePlanButtonClick(
                    `Trending destinations across ${destinationName}`
                  )
                }
                borderWidth="1px"
                fontWeight="400"
                borderRadius="999px"
                margin="0 auto"
                padding="0.8rem 2rem"
                bgColor="#0f1a2e"
                color="white"
              >
                + Create a trip now!
              </Button>
            </div>
          </section>
        ) : null}

        <JourneySimplified />

        {/* OTHER COUNTRIES IN CONTINENT */}
        {props.locations && props.locations.length ? (
          <section className={styles.block}>
            <div className={styles.sectionHead}>
              <div className={styles.sectionHeadLeft}>
                <h2>
                  Other destinations to{" "}
                  <span className={styles.serif}>explore in {props.data.continent}.</span>
                </h2>
                <p className={styles.lede}>
                  {destinationName} not enough?{" "}
                  <span className={styles.serif}>Pair it with a neighbour.</span>
                </p>
              </div>
            </div>
            {renderCarousel(props.locations, "OtherInContinent")}
            <div className="flex justify-center mt-8">
              <Button
                onclick={() =>
                  handlePlanButtonClick(
                    `Other destinations to explore in ${props.data.continent}`
                  )
                }
                borderWidth="1px"
                fontWeight="400"
                borderRadius="999px"
                margin="0 auto"
                padding="0.8rem 2rem"
                bgColor="#0f1a2e"
                color="white"
              >
                + Create a trip now!
              </Button>
            </div>
          </section>
        ) : null}

        {/* WORLD CAROUSEL */}
        {props.continetCarousel?.length ? (
          <section className={styles.block}>
            <div className={styles.sectionHead}>
              <div className={styles.sectionHeadLeft}>
                <h2>
                  Plan your trip{" "}
                  <span className={styles.serif}>anywhere in the world.</span>
                </h2>
                <p className={styles.lede}>
                  Whatever the vibe —{" "}
                  <span className={styles.serif}>Kaira plans 60+ countries.</span>
                </p>
              </div>
            </div>
            <Continentcarousel
              data={props.continetCarousel}
              page={"Country Page"}
            />
            <div className="flex justify-center mt-8">
              <Button
                onclick={() =>
                  handlePlanButtonClick(`Plan your trip to anywhere in the world`)
                }
                borderWidth="1px"
                fontWeight="400"
                borderRadius="999px"
                margin="0 auto"
                padding="0.8rem 2rem"
                bgColor="#0f1a2e"
                color="white"
              >
                + Create a trip now!
              </Button>
            </div>
          </section>
        ) : null}

        <WhatMakesUsSection />

        <CurveImageGallery />
        <TestimonialCarousel />

        <PartnersSection />

        <ChatWithUs planner page_id={props.data.id} />
      </div>

      {/* FINAL CTA */}
      <section className={styles.finalCta}>
        <div className={styles.finalCtaInner}>
          <h2>
            {destinationName}, <span className={styles.serif}>your way.</span>
          </h2>
          <p>
            Tell Kaira your dates and vibe. She'll have a real plan back in
            under 2 minutes.
          </p>
          <button
            className={styles.btnPrimary}
            onClick={() => handlePlanButtonClick(`Final CTA - ${destinationName}`)}
          >
            Plan my {destinationName} trip
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
          <div className={styles.finalCtaTrust}>
            No commitment · free to plan · pay only for what you pick.
          </div>
        </div>
      </section>

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

export default Index;

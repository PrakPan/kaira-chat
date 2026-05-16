import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import "bootstrap/dist/css/bootstrap.min.css";
import DesktopBanner from "../../components/containers/Banner";
import Experiences from "../../components/containers/Experiences";
import ChatWithUs from "../../components/containers/ChatWithUs/ChatWithUs";
import Overview from "./Overview";
import Button from "../../components/ui/button/Index";
import MobileBanner from "./MobileBanner";
import openTailoredModal from "../../services/openTailoredModal";
import dynamic from "next/dynamic";
import PathNavigation from "./PathNavigation.js";
import { logEvent } from "../../services/ga/Index";
import { convertDbNameToCapitalFirst } from "../../helper/convertDbnameToCapitalFirst.js";
import HeroBannerLadakh from "../../components/containers/HeroBanner/HeroBannerLadakh.js";
import HeroV2 from "../../components/revamp/destination/HeroV2.jsx";
import validateTextSize from "../../services/textSizeValidator.js";
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
import CtaBoardingSection from "../../components/revamp/home/CtaBoardingSection.jsx";
import JourneySimplified from "../../components/revamp/home/JourneySimplified.jsx";
import Carousel3D from "../../components/theme/CurveImageGallery.jsx";
import WhatMakesUsSection from "../../components/revamp/home/WhatMakesUsSection.jsx";
import PartnersSection from "../../components/theme/PartnersSection.jsx";
import TestimonialCarousel from "../../components/theme/TestimonialCarousel.jsx";
import TailoredFormMobileModal from "../../components/modals/TailoredFomrMobile.js";
import styles from "../../styles/pages/revamp/destination.module.scss";
import ItineraryCardV2 from "../../components/revamp/destination/ItineraryCardV2.jsx";
import OverviewEditorial from "../../components/revamp/destination/OverviewEditorial.jsx";
const MapBox = dynamic(() => import("../../components/Map.js"), {
  ssr: false,
});

const carouselBreakpoints = {
  640: { slidesPerView: 1.5, spaceBetween: 16 },
  768: { slidesPerView: 2, spaceBetween: 20 },
  1024: { slidesPerView: 3, spaceBetween: 24 },
};

const Homepage = (props) => {
  const router = useRouter();
  const [userItineraries, setUserItineraries] = useState([]);
  const [TTWItineraries, setTTWItineraries] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [desktopBannerLoading, setDesktopBannerLoading] = useState(false);
  const [overviewHeading, setOverviewHeading] = useState(null);
  const [headings, setHeadings] = useState([]);
  const [showTailoredModal, setShowTailoredModal] = useState(false);

  useEffect(() => {
    if (props.experienceData?.headings) {
      let h = [...props.experienceData.headings];
      h.sort((a, b) => a?.priority - b?.priority);
      setHeadings(h);
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
    setOverviewHeading(
      `A little about ${convertDbNameToCapitalFirst(props.experienceData.slug)}`
    );
    return () => setOverviewHeading(null);
  }, [router.query.link, props.experienceData]);

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
        page: "State Page",
        event_category: "Button Click",
        event_label: "Create your travel plan now!",
        event_action: location,
      },
    });
  };

  const renderCarousel = (items, keyPrefix, onItemClick) => {
    const prevClass = `${keyPrefix}-prev`;
    const nextClass = `${keyPrefix}-next`;
    return (
      <div className={styles.carouselWrap}>
        <Swiper
          style={{ height: "376px" }}
          modules={[Navigation]}
          spaceBetween={16}
          slidesPerView={1}
          navigation={{
            nextEl: `.${nextClass}`,
            prevEl: `.${prevClass}`,
            clickable: true,
          }}
          breakpoints={carouselBreakpoints}
        >
          {items?.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="w-full px-1">
                <DestinationCard
                  title={item.title || item.name}
                  description={item.description || item.tagline}
                  one_liner_description={item?.one_liner_description}
                  image={item.image}
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

  if (props?.experienceData?.slug === "ladakh") {
    return (
      <div
        className={styles.destinationPage}
        id="homepage-anchor"
        style={{ visibility: props.hidden ? "hidden" : "visible" }}
      >
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
          setShowTailoredModal={setShowTailoredModal}
        />
      </div>
    );
  }

  const destinationName = convertDbNameToCapitalFirst(props.experienceData.slug);

  return (
    <div
      className={styles.destinationPage}
      id="homepage-anchor"
      style={{ visibility: props.hidden ? "hidden" : "visible" }}
    >
      <HeroV2
        destinationLabel={destinationName}
        kicker={`Plan your ${destinationName} trip with Kaira`}
        title={
          <>
            {destinationName},{" "}
            <span className={styles.serif}>however</span> you{" "}
            <span className={styles.highlight}>want it.</span>
          </>
        }
        description={
          <>
            Tell Kaira <b>your vibe and dates</b> — she'll craft a{" "}
            <span className={styles.serif}>{destinationName} trip</span> that{" "}
            <span className={styles.serif}>actually flows.</span>
          </>
        }
        polaroids={(props.experienceData?.locations || [])
          .slice(0, 4)
          .map((loc) => ({
            image: loc.image
              ? loc.image.startsWith("http")
                ? loc.image
                : `${imgUrlEndPoint}${loc.image}`
              : "",
            caption: loc.display_name || loc.name || loc.title,
          }))
          .filter((p) => p.image)}
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
              <span className={styles.serif}>
                {props.experienceData?.locations?.length || 0}
              </span>{" "}
              hand-picked
            </div>
            <div className={styles.statSub}>Across {destinationName}</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statLabel}>Trip ideas</div>
            <div className={styles.statValue}>
              <span className={styles.serif}>
                {(userItineraries?.length || 0) + (TTWItineraries?.length || 0)}+
              </span>{" "}
              ready
            </div>
            <div className={styles.statSub}>From real travellers</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statLabel}>Trusted by</div>
            <div className={styles.statValue}>
              <span className={styles.serif}>10K+</span> travellers
            </div>
            <div className={styles.statSub}>Across India</div>
          </div>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.crumb}>
          <PathNavigation path={props.experienceData.path} />
        </div>

        {/* TOP LOCATIONS */}
        {props.experienceData?.locations?.length ? (
          <section className={styles.block}>
            <div className={styles.sectionHead}>
              <div className={styles.sectionHeadLeft}>
                <h2>
                  Top locations{" "}
                  <span className={styles.serif}>across {destinationName}.</span>
                </h2>
                <p className={styles.lede}>
                  Curated cities and corners worth carving time for.
                </p>
              </div>
              <span
                className={styles.sectionLink}
                onClick={() => setShowTailoredModal(true)}
              >
                Plan with Kaira
                <FontAwesomeIcon icon={faArrowRight} />
              </span>
            </div>
            {renderCarousel(props.experienceData.locations, "StateTopLocations")}
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
                + Create a Trip Now!
              </Button>
            </div>
          </section>
        ) : null}

        {/* HEADINGS (Carousels per heading) */}
        {headings.map((heading, index) => (
          <section
            key={heading?.name || index}
            className={`${styles.block} ${
              index % 2 === 0 ? styles.itinerariesBlock : ""
            }`}
          >
            <div className={styles.sectionHead}>
              <div className={styles.sectionHeadLeft}>
                <h2>{heading.name}</h2>
              </div>
            </div>
            <Experiences
              experiences={heading?.itineraries}
              page={"State Page"}
            />
            {index % 2 ? (
              <div className="flex justify-center mt-8">
                <Button
                  onclick={() => handlePlanButtonClick(heading.name)}
                  borderWidth="1px"
                  fontWeight="500"
                  borderRadius="999px"
                  margin="0 auto"
                  padding="0.6rem 2rem"
                  bgColor="#0f1a2e"
                  color="white"
                >
                  Create your travel plan now!
                </Button>
              </div>
            ) : null}
          </section>
        ))}

        {/* USER TRIPS */}
         {userItineraries?.length ? (
          <section className={`${styles.block} ${styles.itinerariesBlock}`} style={{width: "100%"}}>
            <div className={styles.sectionHead}>
              <div className={styles.sectionHeadLeft}>
                <div className={styles.itinPill}>
                  ★ Real trips, real travellers
                </div>
                <h2>
                  Real {destinationName} trips our{" "}
                  <span className={styles.serif}>travellers loved.</span>
                </h2>
                <p className={styles.lede}>
                  Every itinerary below has been done.{" "}
                  <span className={styles.serif}>Tweak anything</span> in chat
                  — dates, hotels, duration.
                </p>
              </div>
            </div>
            <div className={styles.itinGrid}>
              {userItineraries.slice(0, 4).map((it, i) => (
                <ItineraryCardV2 key={it.id || i} itinerary={it} />
              ))}
            </div>
          </section>
        ) : null}

        {/* OVERVIEW */}
        <section className={`${styles.block} ${styles.editorialBlock}`}>
          <OverviewEditorial
             tag="Kaira's take"
              heading={
                overviewHeading ||
                `Why we send first-timers to ${destinationName}.`
              }
              text={
                props.experienceData?.overview_text || props?.experienceData?.short_description
              }
              image={
                props.experienceData?.overview_image 
                // ||
                // (hotLocations[0] && hotLocations[0].image)
              }
              ctaLabel={`Plan my ${destinationName} trip`}
              onCtaClick={() =>
                handlePlanButtonClick(`Editorial overview - ${destinationName}`)
              }
            locations={props.experienceData.locations}
            overview_heading={overviewHeading}
            overview_text={props.experienceData.short_description}
          />
          {/* {props.experienceData.locations?.length ? (
            <div style={{ marginTop: 32 }}>
              <MapBox
                InfoWindowContainer={InfoWindowContainer}
                locations={props.experienceData.locations}
                height="300px"
              />
            </div>
          ) : null} */}
          <div className="flex justify-center mt-8">
            <Button
              onclick={() =>
                handlePlanButtonClick(
                  `A little about ${props?.experienceData?.slug}`
                )
              }
              borderWidth="1px"
              fontWeight="500"
              borderRadius="999px"
              margin="0 auto"
              padding="0.6rem 2rem"
              bgColor="#0f1a2e"
              color="white"
            >
              {props.experienceData.page_type !== "Theme"
                ? `Craft a trip to ${destinationName} now!`
                : "Create your travel plan now!"}
            </Button>
          </div>
        </section>

        <JourneySimplified />

        {/* COMMUNITY TOP PICKS */}
        {TTWItineraries.length ? (
          <section className={styles.block}>
            <div className={styles.sectionHead}>
              <div className={styles.sectionHeadLeft}>
                <h2>
                  Community{" "}
                  <span className={styles.serif}>top picks.</span>
                </h2>
                <p className={styles.lede}>
                  Loved by The Tarzan Way community.
                </p>
              </div>
              {!showMore && TTWItineraries.length > 4 ? (
                <span
                  className={styles.sectionLink}
                  onClick={() => setShowMore(true)}
                >
                  View more
                  <FontAwesomeIcon icon={faArrowRight} />
                </span>
              ) : null}
            </div>
            <Experiences
              mobileGrid
              experiences={
                showMore ? TTWItineraries : TTWItineraries.slice(0, 4)
              }
              page={"State Page"}
            />
          </section>
        ) : null}

        <DesktopBanner
          loading={desktopBannerLoading}
          onclick={() => setShowTailoredModal(true)}
          text={`Craft a personalized itinerary${
            props.experienceData.slug
              ? " to " + destinationName + " now"
              : ""
          }!`}
        />

        <div className="hidden-desktop">
          <MobileBanner
            handleClick={() =>
              openTailoredModal(
                router,
                props.experienceData.id,
                destinationName
              )
            }
            city={destinationName}
          />
        </div>

        {/* OTHER DESTINATIONS */}
        {props.locations && props.locations.length ? (
          <section className={styles.block}>
            <div className={styles.sectionHead}>
              <div className={styles.sectionHeadLeft}>
                <h2>
                  Other{" "}
                  <span className={styles.serif}>destinations.</span>
                </h2>
                <p className={styles.lede}>
                  Pair {destinationName} with a neighbour.
                </p>
              </div>
            </div>
            {renderCarousel(props.locations, "OtherDestinations")}
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
                + Create a Trip Now!
              </Button>
            </div>
          </section>
        ) : null}

        {/* <WhatMakesUsSection />
        <Carousel3D />
        <TestimonialCarousel />
        <PartnersSection />
        <ChatWithUs planner page_id={props.experienceData.id} /> */}
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

      {/* <CtaBoardingSection /> */}

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

export default Homepage;

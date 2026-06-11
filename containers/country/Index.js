import React, { useState, useEffect } from "react";
import Button from "../../components/ui/button/Index";
import ChatWithUs from "../../components/containers/ChatWithUs/ChatWithUs";
import Continentcarousel from "../../components/continentcarousel/continentcarousel";
import PathNavigation from "../travelplanner/PathNavigation";
import dynamic from "next/dynamic";
import { logEvent } from "../../services/ga/Index.js";
import HeroV2 from "../../components/revamp/destination/HeroV2.jsx";
import OverviewEditorial from "../../components/revamp/destination/OverviewEditorial.jsx";
import CountryCardV2 from "../../components/revamp/destination/CountryCardV2.jsx";
import ItineraryCardV2 from "../../components/revamp/destination/ItineraryCardV2.jsx";
import ChatWithKairaCta from "../../components/revamp/destination/ChatWithKairaCta.jsx";
import ActivityCardV2 from "../../components/revamp/destination/ActivityCardV2.jsx";
import DestinationStatsStrip from "../../components/revamp/destination/DestinationStatsStrip.jsx";
import WhenToGoSection from "../../components/revamp/destination/WhenToGoSection.jsx";
import PlanningSection from "../../components/revamp/destination/PlanningSection.jsx";
import { imgUrlEndPoint } from "../../components/theme/ThemeConstants.js";
const MapBox = dynamic(() => import("../../components/Map.js"), {
  ssr: false,
});
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
import TestimonialCarousel from "../../components/theme/TestimonialCarousel.jsx";
import DesktopBanner from "../../components/containers/Banner.js";
import { convertDbNameToCapitalFirst } from "../../helper/convertDbnameToCapitalFirst.js";
import TailoredFormMobileModal from "../../components/modals/TailoredFomrMobile.js";
import styles from "../../styles/pages/revamp/destination.module.scss";

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

  const destinationName = props.data?.name || "";

  const normalizeImage = (img) =>
    img ? (img.startsWith("http") ? img : `${imgUrlEndPoint}${img}`) : "";

  const toPolaroid = (loc) => ({
    image: normalizeImage(loc?.image),
    caption: loc?.display_name || loc?.name || loc?.title,
  });

  // Polaroid priority on a country page: states, then hot locations, then any
  // other city, before falling back to activity / POI imagery.
  const stateImages = (props.data?.states || []).map(toPolaroid).filter((p) => p.image);
  const hotLocationImages = hotLocations.map(toPolaroid).filter((p) => p.image);
  const cityImages = (props.data?.locations || []).map(toPolaroid).filter((p) => p.image);

  const heroPolaroids = [...stateImages, ...hotLocationImages];

  const heroPrompts = (hotLocations.length
    ? hotLocations
    : props.data?.locations || []
  )
    .slice(0, 4)
    .map((loc) => {
      const name = loc.display_name || loc.name || loc.title || "";
      return name ? `Plan ${name}` : null;
    })
    .filter(Boolean);

  const heroActivities = (props.data?.activities || [])
    .map((a) => ({ image: normalizeImage(a?.image) }))
    .filter((p) => p.image);
  const heroPois = (props.data?.pois || [])
    .map((p) => ({ image: normalizeImage(p?.image) }))
    .filter((p) => p.image);

  return (
    <div className={styles.destinationPage}>
      <HeroV2
        destinationLabel={destinationName}
        kicker={
          userItineraries?.length
            ? `${userItineraries.length}+ ${destinationName} trips planned by Kaira`
            : `Plan your ${destinationName} trip with Kaira`
        }
        title={
          <>
            {destinationName}, planned around{" "}
            <span className={styles.serif}>your</span>{" "}
            <span className={styles.highlight}>moments.</span>
          </>
        }
        description={
          <>
            Tell Kaira <b>your dates and vibe</b> — she stitches the right cities
            into a route that{" "}
            <span className={styles.serif}>actually flows.</span> Local
            concierges check every booking before you pay.
          </>
        }
        prompts={
          props.data?.model_prompts?.length
            ? props.data.model_prompts
            : heroPrompts
        }
        polaroids={heroPolaroids}
        fallbackSources={[{ items: cityImages }]}
        activities={heroActivities}
        pois={heroPois}
        setShowTailoredModal={setShowTailoredModal}
        meta={
          <>
            <span>
              <span className="star">★</span> <b>4.9</b> Google · 1,200+ reviews
            </span>
            {/* <span>·</span> */}
            {/* <span>
              <b>{hotLocations.length || props.data?.locations?.length || 0}</b>{" "}
              cities curated
            </span> */}
            <span>·</span>
            <span>
              <b>IATA</b>-protected
            </span>
          </>
        }
      />

      {/* STATS STRIP */}
      <DestinationStatsStrip
        data={props.data}
        fallbacks={[
          {
            label: "Destination",
            value: <span className={styles.serif}>{destinationName}</span>,
            sub: "Curated by Kaira",
            when: !!destinationName,
          },
          {
            label: "Top locations",
            value: (
              <>
                <span className={styles.serif}>{hotLocations.length}</span> hot
                picks
              </>
            ),
            sub: `Hand-picked across ${destinationName}`,
            when: hotLocations.length > 0,
          },
          {
            label: "Itineraries",
            value: (
              <>
                <span className={styles.serif}>{props?.data?.itineraries_count || userItineraries?.length}+</span>{" "}
                ready
              </>
            ),
            sub: "Tweak anything in chat",
            when: userItineraries?.length > 0,
          },
          {
            label: "Continent",
            value: (
              <span className={styles.serif}>
                {convertDbNameToCapitalFirst(props.data?.continent || "")}
              </span>
            ),
            sub: "Part of a wider Asia plan",
            when: !!props.data?.continent,
          },
          {
            label: "Planning",
            value: (
              <>
                <span className={styles.serif}>Free</span> with Kaira
              </>
            ),
            sub: "AI itineraries, instantly",
          },
          {
            label: "Trusted by",
            value: (
              <>
                <span className={styles.serif}>10K+</span> travellers
              </>
            ),
            sub: "From across India",
          },
        ]}
      />

      <WhenToGoSection
        seasonalInfo={props.data?.seasonal_info}
        destinationName={destinationName}
        onSeeMore={() =>
          handlePlanButtonClick(`When to go - ${destinationName}`)
        }
      />

      <div className={styles.container}>
        <DesktopBanner
          loading={desktopBannerLoading}
          onclick={() => setShowTailoredModal(true)}
          text={`Craft a personalized itinerary${
            props.data?.slug
              ? " to " + convertDbNameToCapitalFirst(props.data?.slug) + " now"
              : ""
          }!`}
          destinationName={
            props.data?.slug
              ? convertDbNameToCapitalFirst(props.data?.slug)
              : undefined
          }
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
                  Top cities to visit{" "}
                  <span className={styles.serif}>in {destinationName}.</span>
                </h2>
                <p className={styles.lede}>
                  Hand-picked, not alphabetical.{" "}
                  <span className={styles.serif}>Best for first-timers</span>{" "}
                  alongside under-the-radar picks.
                </p>
              </div>
              {/* <span
                className={styles.sectionLink}
                onClick={() => handlePlanButtonClick(`Popular cities in ${destinationName}`)}
              >
                See all locations
                <FontAwesomeIcon icon={faArrowRight} />
              </span> */}
            </div>
            <div className={styles.countriesGrid}>
              {hotLocations.slice(0, 6).map((loc, idx) => (
                <CountryCardV2
                  key={loc.id || idx}
                  item={loc}
                  hot={idx === 0}
                />
              ))}
            </div>
            <div className="flex justify-center mt-8">
              {/* <Button
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
              </Button> */}
              <ChatWithKairaCta
                onClick={() =>
                  handlePlanButtonClick(`Popular cities in ${destinationName}`)
                }
              />
            </div>
          </section>
        ) : null}

        {/* OVERVIEW / EDITORIAL */}
        {props.data?.overview_text && (
          <section className={`${styles.block} ${styles.editorialBlock}`}>
            <OverviewEditorial
              tag="Kaira's take"
              heading={props.data?.overview_heading}
              text={props.data?.overview_text}
              image={
                props.data?.overview_image ||
                (hotLocations[0] && hotLocations[0].image)
              }
              onCtaClick={() =>
                handlePlanButtonClick(`Editorial overview - ${destinationName}`)
              }
            />
          </section>
        )}

        {/* TRIPS BY USERS */}
        {userItineraries?.length ? (
          <section className={`${styles.block} ${styles.itinerariesBlock}`}>
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

        {/* THINGS TO DO (ACTIVITIES + POIS COMBINED — Iconic experiences) */}
        {(props.data.activities?.length || props.data.pois?.length) ? (
          <section className={styles.block} id="Experiences">
            <div className={styles.sectionHead}>
              <div className={styles.sectionHeadLeft}>
                <h2>
                  Iconic <span className={styles.serif}>experiences.</span>
                </h2>
                <p className={styles.lede}>
                  The{" "}
                  <span className={styles.serif}>non-skippable bits.</span> All
                  bookable directly, all checked by humans before they go in
                  your trip.
                </p>
              </div>
            </div>
            <div className={styles.carouselWrap}>
              <Swiper
                modules={[Navigation]}
                spaceBetween={16}
                slidesPerView={1.1}
                navigation={{
                  nextEl: ".Experiences-next",
                  prevEl: ".Experiences-prev",
                  clickable: true,
                }}
                breakpoints={{
                  640: { slidesPerView: 2.2, spaceBetween: 16 },
                  768: { slidesPerView: 3, spaceBetween: 16 },
                  1024: { slidesPerView: 4, spaceBetween: 16 },
                }}
              >
                {[
                  ...(props.data.activities || []).map((a, i) => ({
                    item: a,
                    type: "activity",
                    i,
                  })),
                  ...(props.data.pois || []).map((p, i) => ({
                    item: p,
                    type: "poi",
                    i,
                  })),
                ].map(({ item, type, i }, slideIdx) => (
                  <SwiperSlide key={`${type}-${item.id || i}`}>
                    <div className="h-full">
                      <ActivityCardV2
                        item={item}
                        kairaPick={slideIdx % 3 === 0}
                        onClick={(d) => handleOpenDrawer(d, type)}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className={`Experiences-prev ${styles.carouselNav} ${styles.carouselNavPrev}`} aria-hidden>
                <FontAwesomeIcon icon={faChevronLeft} />
              </div>
              <div className={`Experiences-next ${styles.carouselNav} ${styles.carouselNavNext}`} aria-hidden>
                <FontAwesomeIcon icon={faChevronRight} />
              </div>
            </div>
            <div className="flex justify-center mt-8">
              {/* <Button
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
              </Button> */}
              <ChatWithKairaCta onClick={() => setShowTailoredModal(true)} />
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
            <div className={styles.countriesGrid}>
              {props.data.states.slice(0, 6).map((s, idx) => (
                <CountryCardV2 key={s.id || idx} item={s} hot={idx === 0} />
              ))}
            </div>
            <div className="flex justify-center mt-8">
              {/* <Button
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
              </Button> */}
              <ChatWithKairaCta
                onClick={() =>
                  handlePlanButtonClick(
                    `Trending destinations across ${destinationName}`
                  )
                }
              />
            </div>
          </section>
        ) : null}

        <JourneySimplified
          itinerary={userItineraries?.[0]}
          cities={
            props.data?.states?.length
              ? props.data.states
              : props.data?.locations
          }
          destinationName={destinationName}
        />

        {/* OTHER COUNTRIES IN CONTINENT */}
        {props.locations && props.locations.length ? (
          <section className={styles.block}>
            <div className={styles.sectionHead}>
              <div className={styles.sectionHeadLeft}>
                <h2>
                  Other destinations to{" "}
                  <span className={styles.serif}>
                    explore in {props.data.continent}.
                  </span>
                </h2>
                <p className={styles.lede}>
                  {destinationName} not enough?{" "}
                  <span className={styles.serif}>Pair it with a neighbour.</span>
                </p>
              </div>
            </div>
            <div className={styles.countriesGrid}>
              {props.locations.slice(0, 6).map((loc, idx) => (
                <CountryCardV2 key={loc.id || idx} item={loc} hot={idx === 0} />
              ))}
            </div>
            <div className="flex justify-center mt-8">
              {/* <Button
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
              </Button> */}
              <ChatWithKairaCta
                onClick={() =>
                  handlePlanButtonClick(
                    `Other destinations to explore in ${props.data.continent}`
                  )
                }
              />
            </div>
          </section>
        ) : null}

      </div>

      <PlanningSection
        destinationInfo={props.data?.destination_info}
        destinationName={destinationName}
      />

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
          <ChatWithKairaCta
            onClick={() =>
              handlePlanButtonClick(`Final CTA - ${destinationName}`)
            }
          />
          <div className={styles.finalCtaTrust}>
            No commitment · free to plan · pay only for what you pick.
          </div>
        </div>
      </section>


      

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

import React, { useState, useEffect } from "react";
import ChatWithUs from "../../components/containers/ChatWithUs/ChatWithUs";
import Continentcarousel from "../../components/continentcarousel/continentcarousel";
import PathNavigation from "../travelplanner/PathNavigation";
import { logEvent } from "../../services/ga/Index.js";
import Image from "next/image.js";
import { convertDbNameToCapitalFirst } from "../../helper/convertDbnameToCapitalFirst.js";
import Poi from "../newcityplanner/pois/Index.js";
import TailoredFormMobileModal from "../../components/modals/TailoredFomrMobile.js";
import Element from "../newcityplanner/elements/Index.js";
import LocationsBlog from "../../components/containers/plannerlocations/Index.js";
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

  const normalizeImage = (img) =>
    img ? (img.startsWith("http") ? img : `${imgUrlEndPoint}${img}`) : "";

  const toPolaroid = (loc) => ({
    image: normalizeImage(loc?.image),
    caption: loc?.display_name || loc?.name || loc?.title,
  });

  // Polaroid priority on a continent page: countries first, then hot
  // locations / cities, before falling back to activity / POI imagery.
  const heroPolaroids = (props.locations || []).map(toPolaroid).filter((p) => p.image);
  const heroCityFallback = (hotLocations.length ? hotLocations : props.data?.cities || [])
    .map(toPolaroid)
    .filter((p) => p.image);

  const heroPrompts = (props.locations || [])
    .slice(0, 4)
    .map((loc) => {
      const name = loc.display_name || loc.name || loc.title || "";
      return name ? `Plan ${name}` : null;
    })
    .filter(Boolean);

  const componentsList = props?.data?.components || [];
  const heroActivities = componentsList
    .flatMap((c) => c?.activities || [])
    .map((a) => ({ image: normalizeImage(a?.image) }))
    .filter((p) => p.image);
  const heroPois = componentsList
    .flatMap((c) => c?.pois || [])
    .map((p) => ({ image: normalizeImage(p?.image) }))
    .filter((p) => p.image);

  const renderCardCarousel = (
    items,
    keyPrefix,
    renderCard,
    slidesPerViewDesktop = 3,
    height = "auto",
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
          {items?.map((item, idx) => (
            <SwiperSlide key={item.id || `${keyPrefix}-${idx}`}>
              <div className="w-full px-1 h-full">
                {renderCard(item, idx)}
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

  const overviewCountText = `${props.locations?.length || 0} countries · ${userItineraries?.length || 0}+ trips planned`;

  return (
    <div className={styles.continentPage}>
      <HeroV2
        destinationLabel={destinationLabel}
        kicker={
          props.locations?.length
            ? `${props.locations.length}+ ${destinationLabel} destinations curated`
            : `Plan your ${destinationLabel} trip with Kaira`
        }
        title={
          <>
            {destinationLabel},{" "}
            <span className={styles.serif}>however</span> you{" "}
            <span className={styles.highlight}>want it.</span>
          </>
        }
        description={
          <>
            Tell Kaira <b>your vibe and dates</b> — she'll thread the right
            countries into a trip that{" "}
            <span className={styles.serif}>actually flows.</span>
          </>
        }
        prompts={
          props.data?.model_prompts?.length
            ? props.data.model_prompts
            : heroPrompts
        }
        polaroids={heroPolaroids}
        fallbackSources={[{ items: heroCityFallback }]}
        activities={heroActivities}
        pois={heroPois}
        setShowTailoredModal={setShowTailoredModal}
        meta={
          <>
            <span>
              <span className="star">★</span> <b>4.9</b> Google · 1,200+ reviews
            </span>
            <span>·</span>
            {/* <span>
              <b>{props.locations?.length || 0}</b> destinations
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
            value: <span className={styles.serif}>{destinationLabel}</span>,
            sub: "Curated by Kaira",
          },
          {
            label: "Top countries",
            value: (
              <>
                <span className={styles.serif}>
                  {props.locations?.length || 0}
                </span>{" "}
                destinations
              </>
            ),
            sub: "Hand-picked picks",
          },
          {
            label: "Itineraries",
            value: (
              <>
                <span className={styles.serif}>
                  {userItineraries?.length || 0}+
                </span>{" "}
                ready
              </>
            ),
            sub: "Tweak anything in chat",
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
        destinationName={destinationLabel}
        onSeeMore={() =>
          handlePlanButtonClick(`When to go - ${destinationLabel}`)
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
          <PathNavigation path={props.data?.path} />
        </div>

        {/* TOP COUNTRIES */}
        {props.locations && props.locations.length ? (
          <section className={styles.block}>
            <div className={styles.sectionHead}>
              <div className={styles.sectionHeadLeft}>
                <h2>
                  Top countries to visit{" "}
                  <span className={styles.serif}>in {destinationLabel}.</span>
                </h2>
                <p className={styles.lede}>
                  Curated, not alphabetical.{" "}
                  <span className={styles.serif}>Best for first-timers</span>{" "}
                  sitting alongside the offbeat picks.
                </p>
              </div>
              {/* <span
                className={styles.sectionLink}
                onClick={() =>
                  handlePlanButtonClick(
                    `Top countries to visit in ${props?.data?.destination}`
                  )
                }
              >
                See all destinations
                <FontAwesomeIcon icon={faArrowRight} />
              </span> */}
            </div>
            <div className={styles.countriesGrid}>
              {props.locations.slice(0, 4).map((loc, idx) => (
                <CountryCardV2
                  key={loc.id || idx}
                  item={loc}
                  hot={idx === 0}
                />
              ))}
            </div>
            <div className="flex justify-center mt-8">
              <ChatWithKairaCta
                onClick={() =>
                  handlePlanButtonClick(
                    `Top countries to visit in ${props?.data?.destination}`
                  )
                }
              />
            </div>
          </section>
        ) : null}

        {/* OVERVIEW / EDITORIAL */}
        {props?.data?.slug != "europe-continent" &&
          (props.data?.overview_heading || props.data?.overview_text) && (
            <section className={`${styles.block} ${styles.editorialBlock}`}>
              <OverviewEditorial
                tag="Kaira's take"
                heading={props.data?.overview_heading}
                text={props.data?.overview_text}
                image={props.data?.overview_image}
                onCtaClick={() =>
                  handlePlanButtonClick(`Editorial overview - ${destinationLabel}`)
                }
              />
            </section>
          )}

        {/* COMPONENTS FROM API */}
        {props?.data?.components?.length > 0 &&
          props?.data?.components?.map((component, idx) => {
            const carouselType = String(component.carousel || "").toLowerCase();
            const isActivity = carouselType.includes("activity");
            const isPoi = carouselType.includes("poi");
            const isItinerary1 = component.carousel === "itinerary-1";
            const tinted = isItinerary1;
            return (
              <section
                key={`${component.carousel}-${idx}`}
                className={`${styles.block} ${
                  tinted ? styles.componentBlockTinted : ""
                }`} 
              >
                <div
                  className={`${styles.sectionHead} ${
                    isActivity || isPoi ? "" : styles.sectionHeadCenter
                  }`} 
                >
                  <div className={styles.sectionHeadLeft}>
                    {tinted && (
                      <div className={styles.itinPill}>
                        ★ Real trips, real travellers
                      </div>
                    )}
                    <h2>
                      {isItinerary1
                        ? `Real ${destinationLabel} trips our `
                        : ""}
                      {isItinerary1 ? (
                        <span className={styles.serif}>travellers loved.</span>
                      ) : isActivity || isPoi ? (
                        <>
                          Iconic{" "}
                          <span className={styles.serif}>experiences.</span>
                        </>
                      ) : (
                        component?.heading
                      )}
                    </h2>
                    {component.text ? (
                      <p className={styles.lede}>{component.text}</p>
                    ) : isActivity || isPoi ? (
                      <p className={styles.lede}>
                        The{" "}
                        <span className={styles.serif}>
                          non-skippable bits.
                        </span>{" "}
                        All bookable directly, all checked by humans before
                        they go in your trip.
                      </p>
                    ) : null}
                  </div>
                </div>

                {component.carousel === "destination-1" ? (
                  <>
                    {renderCardCarousel(
                      [
                        ...component.cities,
                        ...component.states,
                        ...component.countries,
                      ],
                      `Destination1-${idx}`,
                      (item, i) => (
                        <CountryCardV2 item={item} hot={i === 0} />
                      )
                    )}
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
                  </>
                ) : component.carousel === "destination-3" ? (
                  <>
                    {renderCardCarousel(
                      component?.countries,
                      `Destination3-${idx}`,
                      (item, i) => <CountryCardV2 item={item} hot={i === 0} />
                    )}
                  </>
                ) : component.carousel === "destination-4" ? (
                  <div className="space-y-4">
                    {renderCardCarousel(
                      component?.cities,
                      `Destination4-${idx}`,
                      (item, i) => <CountryCardV2 item={item} hot={i === 0} />
                    )}
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
                  </>
                ) : component.carousel === "Activity-2" ||
                  component.carousel === "activity-1" ? (
                  <>
                    {renderCardCarousel(
                      component?.activities,
                      `Activity-${idx}`,
                      (item, i) => (
                        <ActivityCardV2
                          item={item}
                          kairaPick={i % 3 === 0}
                          onClick={(data) => handleOpenDrawer(data, "activity")}
                        />
                      ),
                      4,
                      "auto"
                    )}
                  </>
                ) : component.carousel === "itinerary-1" ? (
                  <>
                    <div className={styles.itinGrid}>
                      {component.itineraries?.slice(0, 4)?.map((it, i) => (
                        <ItineraryCardV2 key={it.id || i} itinerary={it} />
                      ))}
                    </div>
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
                    <div className={styles.itinGrid}>
                      {component.elements?.slice(0, 4)?.map((it, i) => (
                        <ItineraryCardV2 key={it.id || i} itinerary={it} />
                      ))}
                    </div>
                  </div>
                ) : component.carousel === "review-1" ? (
                  <div className="relative">
                    {renderCarousel(component.reviews, `Review-${idx}`)}
                  </div>
                ) : component.carousel == "poi-1" ? (
                  <>
                    {renderCardCarousel(
                      component?.pois,
                      `Poi-${idx}`,
                      (item, i) => (
                        <ActivityCardV2
                          item={item}
                          kairaPick={i % 3 === 0}
                          onClick={(data) => handleOpenDrawer(data, "poi")}
                        />
                      ),
                      4,
                      "auto"
                    )}
                  </>
                ) : null}
              </section>
            );
          })}

        <JourneySimplified
          itinerary={userItineraries?.[0]}
          cities={props.locations}
          destinationName={destinationLabel}
        />


      </div>

      <PlanningSection
        destinationInfo={props.data?.destination_info}
        destinationName={destinationLabel}
      />

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
          <ChatWithKairaCta
            onClick={() =>
              handlePlanButtonClick(`Final CTA - ${destinationLabel}`)
            }
          />
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

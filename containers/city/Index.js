import React, { useState } from "react";
import { useRouter } from "next/router";
import FullScreenGallery from "../../components/fullscreengallery/Index";
import NewMenu from "../newcityplanner/Menu";
import validateTextSize from "../../services/textSizeValidator";
import { convertDbNameToCapitalFirst } from "../../helper/convertDbnameToCapitalFirst";
import HeroV2 from "../../components/revamp/destination/HeroV2";
import DestinationStatsStrip from "../../components/revamp/destination/DestinationStatsStrip.jsx";
import WhenToGoSection from "../../components/revamp/destination/WhenToGoSection.jsx";
import PlanningSection from "../../components/revamp/destination/PlanningSection.jsx";
import ChatWithKairaCta from "../../components/revamp/destination/ChatWithKairaCta.jsx";
import ItineraryCardV2 from "../../components/revamp/destination/ItineraryCardV2.jsx";
import DesktopBanner from "../../components/containers/Banner.js";
import { imgUrlEndPoint } from "../../components/theme/ThemeConstants";
import TailoredFormMobileModal from "../../components/modals/TailoredFomrMobile";
import styles from "../../styles/pages/revamp/destination.module.scss";
import SectionCta from "../../components/revamp/home/SectionCta.jsx";

const Experience = (props) => {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryimages, setGalleryImages] = useState([]);
  const [showTailoredModal, setShowTailoredModal] = useState(false);
  const router = useRouter();

  // Chat with Kaira CTA → navigate the user to the /chat page.
  const handleChatWithKaira = () => {
    router.push("/chat");
  };

  const closeGalleryHandler = () => {
    let images = [];
    for (var i = 0; i < props.cityData.images.length; i++) {
      images.push(props.cityData.images[i].image);
    }
    setGalleryImages(images);
    setGalleryOpen(false);
  };

  if (galleryOpen) {
    return (
      <FullScreenGallery
        closeGalleryHandler={closeGalleryHandler}
        images={galleryimages}
      />
    );
  }

  const cityName = props.cityData.name;
  const cityDisplayName = convertDbNameToCapitalFirst(cityName);

  const cityPolaroids = (props.cityData?.images || []).map((img) => ({
    image: `${imgUrlEndPoint}${img.image}`,
    caption: img.caption || cityDisplayName,
  }));

  const hotLocationPolaroids = (props.hotLocations || [])
    .filter((loc) => loc?.image)
    .map((loc) => ({
      image: loc.image.startsWith("http")
        ? loc.image
        : `${imgUrlEndPoint}${loc.image}`,
      caption: loc.name ? convertDbNameToCapitalFirst(loc.name) : cityDisplayName,
    }));

  const activityPolaroids = [
    ...(props.cityData?.activities || []),
    ...(props.cityData?.pois || []),
  ]
    .filter((item) => item?.image)
    .map((item) => ({
      image: item.image.startsWith("http")
        ? item.image
        : `${imgUrlEndPoint}${item.image}`,
      caption: item.title || item.name || cityDisplayName,
    }));

  const polaroids = [
    ...hotLocationPolaroids,
    ...activityPolaroids,
    ...cityPolaroids, 
    
  ].slice(0, 4);

  

  return (
    <div className={styles.destinationPage}>
      <HeroV2
        destinationLabel={cityDisplayName || cityName}
        kicker={`Plan your ${cityDisplayName} trip with Kaira`}
        title={
          <>
            {cityDisplayName},{" "}
            <span className={styles.serif}>however</span> you{" "}
            <span className={styles.highlight}>want it.</span>
          </>
        }
        description={
          <>
            Tell Kaira <b>your vibe and dates</b> — she'll craft a{" "}
            <span className={styles.serif}>{cityDisplayName} trip</span> that{" "}
            <span className={styles.serif}>actually flows.</span>
          </>
        }
        polaroids={polaroids}
        activities={(props.cityData?.activities || [])
          .map((a) => ({
            image: a?.image
              ? a.image.startsWith("http")
                ? a.image
                : `${imgUrlEndPoint}${a.image}`
              : "",
          }))
          .filter((p) => p.image)}
        pois={(props.cityData?.pois || [])
          .map((p) => ({
            image: p?.image
              ? p.image.startsWith("http")
                ? p.image
                : `${imgUrlEndPoint}${p.image}`
              : "",
          }))
          .filter((p) => p.image)}
        prompts={
          props.cityData?.model_prompts?.length
            ? props.cityData.model_prompts
            : []
        }
        setShowTailoredModal={setShowTailoredModal}
      />

      {/* STATS STRIP */}
      <DestinationStatsStrip
        data={props.cityData}
        fallbacks={[
          {
            label: "City",
            value: <span className={styles.serif}>{cityDisplayName}</span>,
            sub: "Curated by Kaira",
            when: !!cityDisplayName,
          },
          {
            label: "Photos",
            value: (
              <>
                <span className={styles.serif}>
                  {props.cityData?.images?.length}
                </span>{" "}
                gallery shots
              </>
            ),
            sub: "Real, not stock",
            when: props.cityData?.images?.length > 0,
          },
          {
            label: "Nearby cities",
            value: (
              <>
                <span className={styles.serif}>
                  {props.reccomendedCitiesData?.length}
                </span>{" "}
                suggested
              </>
            ),
            sub: "Easy to combine",
            when: props.reccomendedCitiesData?.length > 0,
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
            sub: "Across India",
          },
        ]}
      />

      {/* REAL TRIPS, REAL TRAVELLERS */}
      {props.cityData?.itineraries?.length ? (
        <div className={styles.container}>
          <section className={`${styles.block} ${styles.itinerariesBlock}`}>
            <div className={styles.sectionHead}>
              <div className={styles.sectionHeadLeft}>
                <div className={styles.itinPill}>
                  ★ Real trips, real travellers
                </div>
                <h2>
                  Real {cityDisplayName} trips our{" "}
                  <span className={styles.serif}>travellers loved.</span>
                </h2>
                <p className={styles.lede}>
                  Every itinerary below has been done.{" "}
                  <span className={styles.serif}>Tweak anything</span> in chat —
                  dates, hotels, duration.
                </p>
              </div>
            </div>
            <div className={styles.itinGrid}>
              {props.cityData.itineraries.slice(0, 4).map((it, i) => (
                <ItineraryCardV2 key={it.id || i} itinerary={it} />
              ))}
            </div>
          </section>

          <SectionCta
          // label="End of · How it works"
          // heading="How it"
          // accent="works."
          ctaLabel="Start planning"
        />
        </div>
      ) : null}

      <WhenToGoSection
        seasonalInfo={props.cityData?.seasonal_info}
        destinationName={cityDisplayName}
      />

      <NewMenu
        data={props.cityData}
        destination={props?.cityData?.name}
        nearbyCities={props.reccomendedCitiesData}
        removeDelete={true}
      />

      <PlanningSection
        destinationInfo={props.cityData?.destination_info}
        destinationName={cityDisplayName}
      />

      {/* FINAL CTA */}
      <section className={styles.finalCta}>
        <div className={styles.finalCtaInner}>
          <h2>
            {cityDisplayName}, <span className={styles.serif}>your way.</span>
          </h2>
          <p>
            Tell Kaira your dates and vibe. She'll have a real plan back in
            under 2 minutes.
          </p>
          <ChatWithKairaCta
            onClick={handleChatWithKaira}
            // onClick={() => setShowTailoredModal(true)}
          />
          <div className={styles.finalCtaTrust}>
            No commitment · free to plan · pay only for what you pick.
          </div>
        </div>
      </section>

      <DesktopBanner
        onclick={handleChatWithKaira}
        text={`Craft a personalized itinerary to ${cityDisplayName} now!`}
        destinationName={cityDisplayName}
      />

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

export default Experience;

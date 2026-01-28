import Head from "next/head";
import dynamic from "next/dynamic";
import Script from "next/script";
import { useEffect } from "react";
import { connect } from "react-redux";

import NavigationMenu from "../components/revamp/home/NavigationMenu";
import HeroSection from "../components/revamp/home/HeroSection";
import JourneySimplified from "../components/revamp/home/JourneySimplified";
import TravelVibeSection from "../components/revamp/home/TravelVibeSection";
import WhereNextSection from "../components/revamp/home/WhereNextSection";
import WhatMakesUsSection from "../components/revamp/home/WhatMakesUsSection";
import NewFooter from "../components/newfooter/Index";
import MyTripsSection from "../components/revamp/destination/mytrips";
import TrustFactors from "../components/revamp/home/TrustFactors";

import * as authaction from "../store/actions/auth";
import setHotLocationSearch from "../store/actions/hotLocationSearch";

import styles from "../styles/pages/revamp/home.module.scss";

import axios from "axios";
import axiospagelistinstance from "../services/pages/list";
import axioscountrydetailsinstance from "../services/pages/country";
import axioslocationsinstance from "../services/search/search";
import { MERCURY_HOST } from "../services/constants";
import * as PagesToIdMapping from "../data/PagesToIdMapping.json";
import FaqSection from "../components/revamp/home/FaqSection";



/* ---------------- Lazy-loaded below-the-fold sections ---------------- */

const CurveImageGallery = dynamic(() => import("../components/theme/CurveImageGallery"),{
  ssr: false,
} );
const TestimonialCarousel = dynamic(() => import("../components/theme/TestimonialCarousel"),{
  ssr: false,
});
const PartnersSection = dynamic(() => import("../components/theme/PartnersSection"), {
  ssr: false,
});
const CtaBoardingSection = dynamic(() => import("../components/revamp/home/CtaBoardingSection"), {
  ssr: false,
});
const PlacesBragSection = dynamic(() => import("../components/revamp/home/PlacesBragSection"),{
  ssr: false,
});
const LuxuryEuropeDestinations = dynamic(() => import("../components/revamp/home/LuxuryEuropeDestinations"),{
  ssr: false,
});
const TravelerMadeItinerariesSection = dynamic(() => import("../components/revamp/home/TravelerMadeItinerariesSection"),{
  ssr: false,
});

/* -------------------------------------------------------------------- */

const Home = ({ token, hotLocationSearch, checkAuthState, setHotLocationSearch }) => {
  useEffect(() => {
    checkAuthState();

    if (hotLocationSearch?.length) {
      setHotLocationSearch(hotLocationSearch);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Travel Company | India | The Tarzan Way</title>
      <meta
          name="description"
          content="The Tarzan Way is the best trip-planning platform to craft your trips, your way using AI Trip Planner. Create, browse, customise travel itineraries, manage bookings - all in one place!"
        ></meta>
        <meta
          property="og:title"
          content="Travel Company | India | The Tarzan Way"
        />
        <meta
          property="og:description"
          content="The Tarzan Way is the best trip-planning platform to craft your trips, your way using AI Trip Planner. Create, browse, customise travel itineraries, manage bookings - all in one place!"
        />
        <meta property="og:image" content="/logoblack.svg" />
        <meta
          property="keywords"
          content="ai trip planner, trip planner, itinerary, travel plan, ai itinerary, ai plan, craft a trip, wanderlog, inspirock, tripit, local travel experience, customized trip planner, customized holiday packages, customized packages in computer, honeymoon travel packages, personalized travel package, hotels, flights, activities, transfers,"
        ></meta>

        <link rel="canonical" href="https://thetarzanway.com" />
        <link rel="stylesheet" crossorigin href="/vendor/panorama-slider.css" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "TravelAgency",
              name: "The Tarzan Way",
              image: "https://thetarzanway.com/logoblack.svg",
              url: "https://thetarzanway.com/",
              telephone: "+91 8448687703",
              address: {
                "@type": "PostalAddress",
                addressCountry: "IN",
              },
              openingHoursSpecification: {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ],
                opens: "00:00",
                closes: "23:59",
              },
              sameAs: [
                "https://www.facebook.com/thetarzanway/",
                "https://twitter.com/thetarzanway",
                "https://www.instagram.com/thetarzanway/",
                "https://www.linkedin.com/company/thetarzanway/",
              ],
            }),
          }}
        />
      </Head>

      <div className={styles.ttwRevamp}>
        <NavigationMenu />
        <HeroSection slug="home" />
        <TrustFactors />
        <JourneySimplified />

        {token && <MyTripsSection className="max-w-7xl" />}

        <PlacesBragSection />
        <LuxuryEuropeDestinations />
        <TravelerMadeItinerariesSection />
        <TravelVibeSection />
        <PartnersSection />
        <WhereNextSection />
        <WhatMakesUsSection />
        <CurveImageGallery />
        <TestimonialCarousel />
        <FaqSection />
        <CtaBoardingSection />
      </div>

      <NewFooter page="Homepage" />

      <Script src="/vendor/panorama-slider.js" strategy="lazyOnload" />
    </>
  );
};

/* ---------------- Redux ---------------- */

const mapStateToProps = (state) => ({
  token: state.auth.token,
});

const mapDispatchToProps = (dispatch) => ({
  checkAuthState: () => dispatch(authaction.checkAuthState()),
  setHotLocationSearch: (payload) => dispatch(setHotLocationSearch(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);

/* ---------------- getStaticProps ---------------- */

export async function getStaticProps() {
  let locations = [];
  let asiaLocations = [];
  let europeLocations = [];
  let continetCarousel = [];
  let hotLocationSearch = [];

  const pageId = PagesToIdMapping["asia/india"] ?? "";

  try {
    const [countryRes, themeRes, continentRes, hotRes] = await Promise.all([
      axios.get(`${MERCURY_HOST}/api/v1/geos/country/${pageId}`),
      axiospagelistinstance.get(
        "/?page_type=Theme&fields=id,slug,overview_image,tagline,path,image,name"
      ),
      axiospagelistinstance.get(
        "/?page_type=Continent&fields=id,slug,overview_image,tagline,path"
      ),
      axioslocationsinstance.get("hot_destinations/"),
    ]);

    locations = countryRes?.data?.data?.country?.states || [];
    hotLocationSearch = hotRes?.data || [];

    const continentPages = continentRes?.data?.data?.pages || [];

    const continentData = await Promise.all(
      continentPages.map(async (continent) => {
        const res = await axioscountrydetailsinstance.get(
          `/?continent=${continent.slug}&fields=id,name,path,tagline,image,is_hot_location&limit=100`
        );

        const countries = res?.data?.data?.countries || [];

        if (continent.slug === "asia") asiaLocations = countries;
        if (continent.slug === "europe") europeLocations = countries;

        return {
          ...continent,
          hot_destinations: countries.filter(c => c.is_hot_location).slice(0, 6),
        };
      })
    );

    continetCarousel = continentData;
  } catch (err) {
    console.error("[HomePage:getStaticProps]", err.message);
  }

  return {
    props: {
      locations,
      asiaLocations,
      europeLocations,
      continetCarousel,
      hotLocationSearch,
    },
    revalidate: 3600, 
  };
}

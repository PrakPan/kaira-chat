import Head from "next/head";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { connect } from "react-redux";

import NavigationMenu from "../components/revamp/home/NavigationMenu";
import HeroSection from "../components/revamp/home/HeroSection";
import JourneySimplified from "../components/revamp/home/JourneySimplified";
import WhereNextSection from "../components/revamp/home/WhereNextSection";
import WhatMakesUsSection from "../components/revamp/home/WhatMakesUsSection";
import NewFooter from "../components/newfooter/Index";
import MyTripsSection from "../components/revamp/destination/mytrips";
import TrustFactors from "../components/revamp/home/TrustFactors";
import FaqSection from "../components/revamp/home/FaqSection";

import * as authaction from "../store/actions/auth";
import setHotLocationSearch from "../store/actions/hotLocationSearch";

import styles from "../styles/pages/revamp/home.module.scss";

import axios from "axios";
import axiospagelistinstance from "../services/pages/list";
import axioscountrydetailsinstance from "../services/pages/country";
import axioslocationsinstance from "../services/search/search";
import { MERCURY_HOST } from "../services/constants";
import * as PagesToIdMapping from "../data/PagesToIdMapping.json";

// Polyfill for requestIdleCallback (Safari compatibility)
if (typeof window !== "undefined" && !window.requestIdleCallback) {
  window.requestIdleCallback = function (callback) {
    const start = Date.now();
    return setTimeout(function () {
      callback({
        didTimeout: false,
        timeRemaining: function () {
          return Math.max(0, 50 - (Date.now() - start));
        },
      });
    }, 1);
  };
  window.cancelIdleCallback = function (id) {
    clearTimeout(id);
  };
}

/* ---------------- Code-split below-the-fold sections (no SSR) ---------------- */

const TestimonialCarousel = dynamic(() => import("../components/theme/TestimonialCarousel"), {
  ssr: false,
  loading: () => <div style={{ height: 260, background: "#f3f4f6" }} />,
});
const PartnersSection = dynamic(() => import("../components/theme/PartnersSection"), {
  ssr: false,
  loading: () => <div style={{ height: 160, background: "#f3f4f6" }} />,
});
const LuxuryEuropeDestinations = dynamic(
  () => import("../components/revamp/home/LuxuryEuropeDestinations"),
  {
    ssr: false,
    loading: () => <div style={{ height: 260, background: "#f3f4f6" }} />,
  }
);
const TravelerMadeItinerariesSection = dynamic(
  () => import("../components/revamp/home/TravelerMadeItinerariesSection"),
  {
    ssr: false,
    loading: () => <div style={{ height: 260, background: "#f3f4f6" }} />,
  }
);

/* ---------------- Page ---------------- */

const Home = ({ token, hotLocationSearch, checkAuthState, setHotLocationSearch }) => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      requestIdleCallback(() => {
        checkAuthState();
        if (hotLocationSearch?.length) {
          setHotLocationSearch(hotLocationSearch);
        }
      });
    }
  }, []);

  return (
    <>
      <Head>
        <title>
          AI Trip Planner & Custom Travel Itineraries | The Tarzan Way
        </title>
        <meta
          name="description"
          content="The Tarzan Way is a smart AI Trip Planner designed to build custom travel itineraries in minutes. Use our AI Travel Planner to personalise trips, explore curated experiences, and manage bookings seamlessly."
        ></meta>
        <meta
          property="og:title"
          content="AI Trip Planner & Custom Travel Itineraries | The Tarzan Way"
        />
        <meta property="og:title" content="Travel Company | India | The Tarzan Way" />
        <meta
          property="og:description"
          content="Plan smarter with The Tarzan Way — an advanced AI Trip Planner and AI Travel Planner that creates personalized itineraries, flexible packages, and seamless travel experiences."
        />
        <meta property="og:image" content="/logoblack.svg" />
        <meta
          property="keywords"
          content="ai trip planner,ai travel planner,travel itinerary planner,custom travel itineraries,personalized travel planning,smart trip planner,automated itinerary builder,online trip planner,digital travel planner,travel planning platform,customized holiday packages,personalized travel package,luxury travel planning,honeymoon travel packages,family travel packages,international travel planner,travel packages with itinerary,create travel itinerary online,plan my trip online,The Tarzan Way, hotels,flights,activities,transfers local travel experience"
        ></meta>

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
        <NavigationMenu message={"Welcome to The Tarzan Way!"} />
        <HeroSection slug={"home"} />
        <TrustFactors />
        <JourneySimplified />

        {token && <MyTripsSection className="max-w-7xl" />}

        <LuxuryEuropeDestinations />
        <TravelerMadeItinerariesSection />
        <PartnersSection />
        <WhereNextSection />
        <WhatMakesUsSection />
        <TestimonialCarousel />
        <FaqSection />
      </div>

      <NewFooter page="Homepage" />
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
      axiospagelistinstance.get("/?page_type=Continent&fields=id,slug,overview_image,tagline,path"),
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
          hot_destinations: countries.filter((c) => c.is_hot_location).slice(0, 6),
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
    // revalidate: 3600,
  };
}

import Head from "next/head";
// import HomepageContainer from "../containers/homepage/Index";
import HeroSection from "../components/revamp/home/HeroSection";
import NavigationMenu from "../components/revamp/home/NavigationMenu";
import JourneySimplified from "../components/revamp/home/JourneySimplified";
import PlacesBragSection from "../components/revamp/home/PlacesBragSection";
import FullSlider from "../components/revamp/home/FullSlider";
import MostLovedItinerariesSection from "../components/revamp/destination/MostLovedItinerariesSection";
import TravelerMadeItinerariesSection from "../components/revamp/home/TravelerMadeItinerariesSection";
import TravelVibeSection from "../components/revamp/home/TravelVibeSection";
import WhereNextSection from "../components/revamp/home/WhereNextSection";
import WhatMakesUsSection from "../components/revamp/home/WhatMakesUsSection";
import CurveImageGallery from "../components/theme/CurveImageGallery";
import FaqSection from "../components/revamp/home/FaqSection";
import CtaBoardingSection from "../components/revamp/home/CtaBoardingSection";
import NewFooter from "../components/newfooter/Index";

// import Layout from "../components/Layout";
import { connect, useSelector } from "react-redux";
import * as authaction from "../store/actions/auth";
import setHotLocationSearch from "../store/actions/hotLocationSearch";
import { useEffect } from "react";
import styles from "../styles/pages/revamp/home.module.scss";
import axiospagelistinstance from "../services/pages/list";
import axioscountrydetailsinstance from "../services/pages/country";
import axiosCountInstance from "../services/itinerary/count";
import axioslocationsinstance from "../services/search/search";
import axios from "axios";
import { MERCURY_HOST } from "../services/constants";
import * as PagesToIdMapping from "../data/PagesToIdMapping.json";
import { useRouter } from "next/router";
import Login from "../components/modals/Login";
import MyTripsSection from "../components/revamp/destination/mytrips";
import TestimonialCarousel from "../components/theme/TestimonialCarousel";
import PartnersSection from "../components/theme/PartnersSection";
import LuxuryEuropeDestinations from "../components/revamp/home/LuxuryEuropeDestinations";



const Home = (props) => {
  useEffect(() => {
    props.checkAuthState();
    props.setHotLocationSearch(props.hotLocationSearch);
  }, []);
  const router = useRouter();
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

        <link rel="canonical" href={`https://thetarzanway.com`}></link>
        <script
          type="module"
          crossorigin
          src="/vendor/panorama-slider.js"
        ></script>
        <link
          rel="stylesheet"
          crossorigin
          href="/vendor/panorama-slider.css"
        ></link>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: `
            {
              "@context": "https://schema.org",
              "@type": "TravelAgency",
              "name": "The Tarzan Way",
              "image": "https://thetarzanway.com/logoblack.svg",
              "@id": "",
              "url": "https://thetarzanway.com/",
              "telephone": "+91 95821 25476",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "",
                "addressLocality": "",
                "postalCode": "",
                "addressCountry": "IN"
              },
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday"
                ],
                "opens": "00:00",
                "closes": "23:59"
              },
              "sameAs": [
                "https://www.facebook.com/thetarzanway/",
                "https://twitter.com/thetarzanway",
                "https://www.instagram.com/thetarzanway/",
                "https://www.linkedin.com/company/thetarzanway/",
                "https://in.pinterest.com/thetarzanway/"
              ]
            }
          `,
          }}
        />
      </Head>

      {/* <HomepageContainer
        asiaLocations={props.asiaLocations}
        europeLocations={props.europeLocations}
        token={props.token}
        locations={props.locations}
        ThemeData={props.ThemeData}
        continetCarousel={props.continetCarousel}
      ></HomepageContainer> */}

      <div className={styles.ttwRevamp}>
        <NavigationMenu />
        
        <HeroSection />
        testing
        <JourneySimplified />
        {props.token && <MyTripsSection className={'max-w-7xl'} />} 
        
          
        <PlacesBragSection />
        <LuxuryEuropeDestinations />
        <TravelerMadeItinerariesSection />
        {/* <FullSlider /> */}
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
      {/* <div id="login" className="width-[100%] z-[1650]">
        <Login
          show={props.showLogin}
          onhide={props.authCloseLogin}
          itinary_id={props?.itinary_id}
          zIndex={"3300"}
        />
      </div> */}
    </>
  );
};

const mapStateToPros = (state) => {
  return {
    token: state.auth.token,
    showLogin: state.auth.showLogin,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    checkAuthState: () => dispatch(authaction.checkAuthState()),
    authCloseLogin: () => dispatch(authaction.authCloseLogin()),
    setHotLocationSearch: (payload) => dispatch(setHotLocationSearch(payload)),
  };
};

export default connect(mapStateToPros, mapDispatchToProps)(Home);

export async function getStaticProps() {
  var ThemeData = [];
  var locations = [];
  var asiaLocations = [];
  var europeLocations = [];
  var continetCarousel = [];
  let Count = null;
  let hotLocationSearch = [];
  let pageId =
    PagesToIdMapping["asia/india"] != undefined
      ? PagesToIdMapping["asia/india"]
      : "";
  try {
    const pageListResponse = await axios.get(
      `${MERCURY_HOST}/api/v1/geos/country/${pageId}`
    );

    locations = pageListResponse.data.data.country.states;
  } catch (err) {
    console.log("[ERROR][PageListResponse:getStaticProps]: ", err.message);
  }

  try {
    const ThemeDataRes = await axiospagelistinstance.get(
      "/?page_type=Theme&fields=id,page_type,slug,overview_image,tagline,path,image,name"
    );
    ThemeData = ThemeDataRes.data.data.pages;
  } catch (err) {
    console.log("[ERROR][Fetch ThemeData]:", err.message);
  }

  let continetCarouselResponse = [];
  try {
    const continentData = await axiospagelistinstance.get(
      "/?page_type=Continent&fields=id,page_type,slug,overview_image,tagline,path"
    );
    continetCarouselResponse = continentData.data.data.pages;
  } catch (err) {
    console.log("[ERROR][Fetch ContinentData]:", err.message);
  }

  for (let i = 0; i < continetCarouselResponse.length; i++) {
    try {
      const countrydetailsResponse = await axioscountrydetailsinstance.get(
        `/?continent=${continetCarouselResponse[i].slug}&fields=id,name,path,tagline,image,is_hot_location,best_time,budget&limit=100`
      );

      if (continetCarouselResponse[i].slug.toLowerCase() === "asia") {
        asiaLocations = countrydetailsResponse.data.data.countries;
      }

      if (continetCarouselResponse[i].slug.toLowerCase() === "europe") {
        europeLocations = countrydetailsResponse.data.data.countries;
      }

      let hot_data = countrydetailsResponse.data.data.countries.filter(
        (country) => country.is_hot_location
      );
      hot_data = hot_data.slice(0, 6);

      continetCarousel.push({
        ...continetCarouselResponse[i],
        hot_destinations: hot_data,
      });
    } catch (err) {
      console.log(
        `[ERROR][CountryDetails for ${continetCarouselResponse[i].destination}]:`,
        err.message
      );
    }
  }

  try {
    const response = await axioslocationsinstance.get("hot_destinations/");
    if (response.data?.length) {
      hotLocationSearch = response.data;
    }
  } catch (err) {
    console.log(`[ERROR][HomePage][axioslocationsinstance:/hot_destinations]`);
  }

  return {
    props: {
      ThemeData,
      locations,
      asiaLocations,
      europeLocations,
      continetCarousel,
      hotLocationSearch,
    },
  };
}

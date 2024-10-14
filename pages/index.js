import Head from "next/head";
import HomepageContainer from "../containers/homepage/Index";
import Layout from "../components/Layout";
import { connect } from "react-redux";
import * as authaction from "../store/actions/auth";
import setHotLocationSearch from "../store/actions/hotLocationSearch";
import { useEffect } from "react";
import axiospagelistinstance from "../services/pages/list";
import axioscountrydetailsinstance from "../services/pages/country";
import axiosCountInstance from "../services/itinerary/count";
import axioslocationsinstance from "../services/search/search";


const Home = (props) => {
  useEffect(() => {
    props.checkAuthState();
    props.setHotLocationSearch(props.hotLocationSearch);
  }, []);

  return (
    <Layout>
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
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: `
            {
              "@context": "https://schema.org",
              "@type": "TravelAgency",
              "name": "The Tarzan Way",
              "image": "https://www.thetarzanway.com/logoblack.svg",
              "@id": "",
              "url": "https://www.thetarzanway.com/",
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

      <HomepageContainer
        asiaLocations={props.asiaLocations}
        europeLocations={props.europeLocations}
        token={props.token}
        locations={props.locations}
        ThemeData={props.ThemeData}
        continetCarousel={props.continetCarousel}
        Count={props.Count}
      ></HomepageContainer>
    </Layout>
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

  try {
    const pageListResponse = await axiospagelistinstance.get(
      `/?country=india&page_type=Theme,Continent,Destination&fields=id,destination,tagline,image,link,path,banner_heading,page_type,budget`
    );

    ThemeData = pageListResponse.data.filter(
      (data) => data.page_type === "Theme"
    );

    locations = pageListResponse.data.filter(
      (data) => data.page_type === "Destination"
    );

    const continetCarouselResponse = pageListResponse.data.filter(
      (data) => data.page_type === "Continent"
    );

    for (let i = 0; i < continetCarouselResponse.length; i++) {
      const countrydetailsResponse = await axioscountrydetailsinstance(
        `/all/?continent=${continetCarouselResponse[i].destination}&fields=id,name,path,tagline,image,is_hot_location,best_time,budget`
      );

      if (continetCarouselResponse[i].destination.toLowerCase() === "asia") {
        asiaLocations = countrydetailsResponse.data;
      }

      if (continetCarouselResponse[i].destination.toLowerCase() === "europe") {
        europeLocations = countrydetailsResponse.data;
      }

      let hot_data = countrydetailsResponse.data.filter(
        (country) => country.is_hot_location
      );

      hot_data = hot_data.slice(0, 6);

      continetCarousel.push({
        ...continetCarouselResponse[i],
        hot_destinations: hot_data,
      });
    }

    const countResponse = await axiosCountInstance.get("");
    let count = countResponse.data.user.toString().split("");

    if (count.length > 3) {
      for (let i = 1; i < 4; i++) {
        count.pop();
      }
      Count = count.join("") + "k";
    } else Count = +count.join("");
  } catch (err) {
    console.log("[ERROR][HomePage:getStaticProps]: ", err.message);
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
      Count,
      hotLocationSearch,
    },
  };
}

import Head from "next/head";
import HomepageContainer from "../containers/homepage/Index";
import Layout from "../components/Layout";
import { connect } from "react-redux";
import * as authaction from "../store/actions/auth";
import { useEffect } from "react";
import axiospagelistinstance from "../services/pages/list";
import axioscountrydetailsinstance from "../services/pages/country";
import axiosCountInstance from "../services/itinerary/count";

const Home = (props) => {
  useEffect(() => {
    props.checkAuthState();
  }, []);

  return (
    <Layout>
      <Head>
        <title>Travel Company | India | The Tarzan Way</title>
        <meta
          name="description"
          content="The Tarzan Way is a travel based startup with the vision to simplify travel and build immersive travel programs across India. We personalize travel package and provide unique travel experience for travel in India"
        ></meta>
        <meta
          property="og:title"
          content="Travel Company | India | The Tarzan Way"
        />
        <meta
          property="og:description"
          content="The Tarzan Way is a travel based startup with the vision to simplify travel and build immersive travel programs across India. We personalize travel package and provide unique travel experience for travel in India"
        />
        <meta property="og:image" content="/logoblack.svg" />
        <meta
          property="keywords"
          content="travel in india, tour in india, india travel, travel agents near me, plan a trip, travel and experience culture, local travel experience, customized trip planner india, customized holiday packages, customized packages in computer, customized travel, honeymoon travel packages, personalized travel package"
        ></meta>
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
  };
};

export async function getStaticProps() {
  var ThemeData = [];
  var locations = [];
  var asiaLocations = [];
  var europeLocations = [];
  var continetCarousel = [];
  let Count = null;

  try {
    const pageListResponse = await axiospagelistinstance.get(
      `/?country=india&page_type=Theme,Continent,Destination&fields=id,destination,tagline,image,link,path,banner_heading,page_type`
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
        `/all/?continent=${continetCarouselResponse[i].destination}&fields=id,name,path,tagline,image,is_hot_location`
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

  return {
    props: {
      ThemeData,
      locations,
      asiaLocations,
      europeLocations,
      continetCarousel,
      Count,
    },
  };
}

export default connect(mapStateToPros, mapDispatchToProps)(Home);

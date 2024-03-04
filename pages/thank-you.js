import ThankYouContainer from "../containers/thankyoupage/Index";
import Head from "next/head";
import Layout from "../components/Layout";
import { connect } from "react-redux";
import * as authaction from "../store/actions/auth";
import { useEffect } from "react";
import axiospagelistinstance from "../services/pages/list";
import axioscountrydetailsinstance from "../services/pages/country";

const Home = (props) => {
  useEffect(() => {
    props.checkAuthState();
  }, []);
  return (
    <Layout page={'Thank you Page'}>
      <Head>
        <title>Travel Company | India | The Tarzan Way</title>
        <meta
          name="description"
          content="The Tarzan Way is a travel based startup with the vision to simplify travel and build immersive travel programs across India. We personalize travel package and provide unique travel experience for travel in India"
        ></meta>
        <meta property="og:title" content="Thank You | The Tarzan Way" />
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

      <ThankYouContainer
        token={props.token}
        locations={props.locations}
        ThemeData={props.ThemeData}
        asiaLocations={props.asiaLocations}
        europeLocations={props.europeLocations}
        continetCarousel={props.continetCarousel}
      ></ThankYouContainer>
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
  } catch (err) {
    console.log("[ERROR][ThankyouPage:getStaticProps]: ", err.message);
  }

  return {
    props: {
      ThemeData,
      locations,
      asiaLocations,
      europeLocations,
      continetCarousel,
    },
  };
}

export default connect(mapStateToPros, mapDispatchToProps)(Home);

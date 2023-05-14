import ThankYouContainer from '../containers/thankyoupage/Index'
import Head from "next/head";
import Layout from "../components/Layout";
import { connect } from "react-redux";
import * as authaction from "../store/actions/auth";
import { useEffect } from "react";
import axiospagelistinstance from "../services/pages/list";
import axios from "axios";
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
          content="Thank You | The Tarzan Way"
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

      <ThankYouContainer
        token={props.token}
        locations={props.locations}
        ThemeData={props.ThemeData}
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
  var data = [];
  var locations = [];
  try {
    const res = await axios.get(
      `https://apis.tarzanway.com/page/list?country=India&page_type=Theme`
    );
    data = res.data;
  } catch (e) {
    data = [];
  }

  try {
    const loc = await axiospagelistinstance.get(``);
    locations = loc.data;
  } catch (e) {
    console.log(e);
    locations = [];
  }
  const ThemeData = data.map((e) => {
    return {
      id: e.id,
      link: e.link,
      image: e.image,
      banner_heading: e.banner_heading,
    };
  });
  if (!data) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      ThemeData,
      locations,
    },
  };
}

export default connect(mapStateToPros, mapDispatchToProps)(Home);
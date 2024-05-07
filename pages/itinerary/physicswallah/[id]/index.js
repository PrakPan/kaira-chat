import ItineraryContainer from "../../../../containers/itinerary/IndexsV2/Index";
import { useRouter } from "next/router";
import Layout from "../../../../components/Layout";
import Head from "next/head";
import { connect } from "react-redux";
import * as authaction from "../../../../store/actions/auth";
import { useEffect } from "react";

const Itinerary = (props) => {
  const router = useRouter();

  useEffect(() => {
    props.checkAuthState();
  }, []);

  return (
    <Layout itinerary staticnav hidecta PW>
      <Head>
        <title>Physics Wallah Itinerary | The Tarzan Way</title>
        <meta
          property="og:title"
          content="Physics Wallah Itinerary | The Tarzan Way"
        />
        <meta
          property="og:description"
          content="We envision to simplify travel and build immersive travel experiences."
        />
        <meta property="og:image" content="/logoblack.svg" />
      </Head>

      <ItineraryContainer
        key={router.asPath}
        id={router.query.id}
      ></ItineraryContainer>
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

export default connect(mapStateToPros, mapDispatchToProps)(Itinerary);

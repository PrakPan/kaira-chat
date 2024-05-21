import ItineraryContainer from "../../../containers/itinerary/IndexsV2/Index";
import { useRouter } from "next/router";
import LayoutV2 from "../../../components/LayoutV2";
import Head from "next/head";
import { connect } from "react-redux";
import * as authaction from "../../../store/actions/auth";
import { useEffect } from "react";
import { CONTENT_SERVER_HOST } from "../../../services/constants";

const Itinerary = (props) => {
  const router = useRouter();

  useEffect(() => {
    props.checkAuthState();
  }, []);

  return (
    <LayoutV2 staticnav itinerary>
      <Head>
        <title> Tailored Itinerary | The Tarzan Way </title>
        <meta property="og:title" content="Tailored Travel | The Tarzan Way" />
        <meta
          property="og:description"
          content="We envision to simplify travel and build immersive travel experiences."
        />
        <meta property="og:image" content="/logoblack.svg" />
      </Head>

      {router.query.id && (
        <ItineraryContainer id={router.query.id}></ItineraryContainer>
      )}
    </LayoutV2>
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

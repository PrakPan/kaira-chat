import ItineraryContainer from "../../../containers/itinerary/IndexsV2/Index";
import { useRouter } from "next/router";
import LayoutV2 from "../../../components/Layout";
import Head from "next/head";
import { connect } from "react-redux";
import * as authaction from "../../../store/actions/auth";
import setItineraryId from "../../../store/actions/itineraryId";
import { useEffect } from "react";

const Itinerary = (props) => {
  const router = useRouter();

  useEffect(() => {
    if (router.query.id) {
      props.setItineraryId(router.query.id);
    }
    props.checkAuthState();
  }, [router]);

  return (
    <LayoutV2 itinerary page={"Itinerary Page"}>
      <Head>
        <title> Tailored Itinerary | The Tarzan Way </title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        ></meta>
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
    setItineraryId: (payload) => dispatch(setItineraryId(payload)),
  };
};

export default connect(mapStateToPros, mapDispatchToProps)(Itinerary);

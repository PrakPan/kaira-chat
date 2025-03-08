import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { connect } from "react-redux";
import LayoutV2 from "../../../components/Layout";
import * as authaction from "../../../store/actions/auth";
import setItineraryId from "../../../store/actions/itineraryId";
import setHotLocationSearch from "../../../store/actions/hotLocationSearch";
import axioslocationsinstance from "../../../services/search/search";
import ItineraryContainer from "../../../containers/itinerary/ItineraryContainer";

const Itinerary = (props) => {
  const router = useRouter();

  useEffect(() => {
    if (router.query.id) {
      props.setItineraryId(router.query.id);
    }
    getHotLocationsSearch();
    props.checkAuthState();
  }, [router]);

  const getHotLocationsSearch = async () => {
    try {
      const response = await axioslocationsinstance.get("hot_destinations/");
      if (response.data?.length) {
        const hotLocationSearch = response.data;
        props.setHotLocationSearch(hotLocationSearch);
      }
    } catch (err) {
      console.log(
        `[ERROR][ItineraryPage][axioslocationsinstance:/hot_destinations]`
      );
    }
  };

  const getThemeComponents = async () => {
    try {
      const response = await axioslocationsinstance.get("");
      if (response.data?.length) {
        const hotLocationSearch = response.data;
        props.setHotLocationSearch(hotLocationSearch);
      }
    } catch (err) {
      console.log(
        `[ERROR][ItineraryPage][axioslocationsinstance:/hot_destinations]`
      );
    }
  };


  return (
    <LayoutV2 newYear staticnav itinerary page={"Itinerary Page"}>
      <Head>
        <title> Tailored Itinerary | The Tarzan Way </title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        ></meta>
      </Head>

      {router.query.id && (
        <ItineraryContainer mercuryItinerary id={router.query.id}></ItineraryContainer>
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
    setHotLocationSearch: (payload) => dispatch(setHotLocationSearch(payload)),
  };
};

export default connect(mapStateToPros, mapDispatchToProps)(Itinerary);

import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { connect, useSelector } from "react-redux";
import LayoutV2 from "../../../components/Layout";
import * as authaction from "../../../store/actions/auth";
import setItineraryId from "../../../store/actions/itineraryId";
import setHotLocationSearch from "../../../store/actions/hotLocationSearch";
import axioslocationsinstance from "../../../services/search/search";
import ItineraryContainer from "../../../containers/itinerary/ItineraryContainer";
import { useSearchParams } from "next/navigation";
import CityDetailsDrawer from "../../../components/drawers/cityDetails/CityDetailsDrawer";
import ScrollRestoration from "../../../components/ScrollRestoration";

const Itinerary = (props) => {
 const router = useRouter();
 const { drawer, city_id: cityId } = router.query;
 const itineraryId = useSelector((state) => state.ItineraryId);

  useEffect(() => {
  const id = router.query.id;
  if (id && itineraryId !== id) {
    props.setItineraryId(id);
  }
}, [router.query.id]);

useEffect(() => {
  getHotLocationsSearch();
  props.checkAuthState();
}, []); 


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
    <LayoutV2 newYear staticnav itinerary page={"Itinerary Page"} isItinerary={true}>
      <ScrollRestoration />
      <Head>
        <title> Tailored Itinerary | The Tarzan Way </title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        ></meta>
      </Head>

      {router.query.id && (
        <>
          <ItineraryContainer
            id={router.query.id}
            mercuryItinerary
          ></ItineraryContainer>
          {drawer == "showCityDetail" && cityId && <CityDetailsDrawer />}
        </>
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

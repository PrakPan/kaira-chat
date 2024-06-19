import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { connect } from "react-redux";
import ItineraryContainer from "../../containers/itinerary/IndexsV2/Index";
import LayoutV2 from "../../components/Layout";
import * as authaction from "../../store/actions/auth";
import setItineraryId from "../../store/actions/itineraryId";
import axiosplaninstance from "../../services/itinerary/plan";
import axiosIndexedItinerary from "../../services/itinerary/releasedForCustomer";

const IndexedItinerary = (props) => {
  const router = useRouter();

  useEffect(() => {
    if (router.query.id) {
      props.setItineraryId(router.query.id);
    }
    props.checkAuthState();
  }, [router]);

  function cityNames() {
    if (props?.Data?.cities) {
      const Cities = props.Data.cities;
      let city_names = "";
      for (let i = 0; i < Cities.length; i++) {
        if (i === Cities.length - 1) {
          city_names = city_names + Cities[i];
        } else {
          city_names = city_names + Cities[i] + ", ";
        }
      }

      return city_names;
    }

    return "";
  }

  return (
    <LayoutV2 staticnav itinerary page={"Itinerary Page"}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title> {props?.Data?.name} </title>
        <meta
          name="description"
          content={`Discover the best of ${cityNames()} with our complete ${
            props?.Data?.duration
          }-day itinerary. Explore iconic landmarks, hidden gems, and local experiences like a true traveler.`}
        />
        <meta
          name="keywords"
          content={`${cityNames()} itinerary, ${
            props?.Data?.duration
          }-day trip, multi-city travel, travel guide, ${cityNames()} attractions, things to do in ${cityNames()}`}
        />
        <meta
          property="og:title"
          content={`Complete ${
            props?.Data?.duration
          }-Day Itinerary for Exploring ${cityNames()}`}
        />
        <meta
          property="og:description"
          content={`Discover the best of ${cityNames()} with our complete ${
            props?.Data?.duration
          }-day itinerary. Explore iconic landmarks, hidden gems, and local experiences like a true traveler.`}
        />
        <meta property="og:image" content="/logoblack.svg" />
        <meta
          property="og:url"
          content={`https://thetarzanway.com/trips/${props?.Data?.ID}`}
        />
        <meta property="og:type" content="website" />
        <link
          rel="canonical"
          href={`https://thetarzanway.com/trips/${props?.Data?.ID}`}
        ></link>
      </Head>

      {router.query.id && (
        <ItineraryContainer id={router.query.id}></ItineraryContainer>
      )}
    </LayoutV2>
  );
};

export async function getStaticPaths() {
  let paths = [];

  try {
    const response = await axiosIndexedItinerary.get("/?limit=30&offset=0");
    const data = response?.data?.results;
    if (data?.length > 0) {
      for (let i of data) {
        paths.push({
          params: {
            id: i.id,
          },
        });
      }
    }
  } catch (err) {
    console.log("[ERROR][tripsPage:getStaticPaths]: ", err.message);
  }

  return {
    paths: paths,
    fallback: false,
  };
}

export async function getStaticProps(context) {
  let name = null;
  let duration = null;
  let cities = [];

  try {
    const res = await axiosplaninstance.get(
      `/?itinerary_id=${context.params.id}`
    );
    const data = res.data;
    name = data.name;
    duration = data.duration_number;
    cities = data.itinerary_locations;
  } catch (err) {
    console.error("[ERROR][tripsPage:getStaticProps]: ", err.message);
  }

  return {
    props: {
      Data: {
        ID: context.params.id,
        name,
        duration,
        cities,
      },
    },
  };
}

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

export default connect(mapStateToPros, mapDispatchToProps)(IndexedItinerary);

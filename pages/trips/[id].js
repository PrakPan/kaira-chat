import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { connect } from "react-redux";
import ItineraryContainer from "../../containers/itinerary/IndexsV2/Index";
import LayoutV2 from "../../components/Layout";
import * as authaction from "../../store/actions/auth";
import setItineraryId from "../../store/actions/itineraryId";
import axiosplaninstance from "../../services/itinerary/plan";

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
  const IDS = [
    "caecfa4d-4590-4c07-bed1-269d6c3aee87",
    "3676c206-9209-41fa-bab2-a6784557ff33",
    "8744b2a3-95d7-45e9-9f84-7800e690c7f1",
    "fee0fcaf-e089-400e-904d-d4fe18f01ac6",
    "428c132c-3b3a-410e-bd4d-c55850dac231",
    "bc75f358-ef3a-4cc5-b589-654e8f733964",
    "36fc1c31-afcd-457a-bd95-808778f060ac",
    "33bfb03f-42da-4544-bdb3-83380335732d",
    "ae2a9352-5f1b-464c-8c26-acac3c51533e",
    "b54315aa-30bd-4272-b65d-60a1c9a50cee",
  ];
  let paths = [];

  for (let id of IDS) {
    paths.push({
      params: {
        id: id,
      },
    });
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

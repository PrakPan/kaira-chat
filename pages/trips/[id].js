import ItineraryContainer from "../../../containers/itinerary/IndexsV2/Index";
import { useRouter } from "next/router";
import LayoutV2 from "../../../components/Layout";
import Head from "next/head";
import { connect } from "react-redux";
import * as authaction from "../../../store/actions/auth";
import setItineraryId from "../../../store/actions/itineraryId";
import { useEffect } from "react";

const IndexedItinerary = (props) => {
  const router = useRouter();

  useEffect(() => {
    if (router.query.id) {
      props.setItineraryId(router.query.id);
    }
    props.checkAuthState();
  }, [router]);

  return (
    <LayoutV2 staticnav itinerary page={"Itinerary Page"}>
      <Head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title> Tailored Itinerary | The Tarzan Way </title>
        <meta
          name="description"
          content="Discover the best of [City Name] with our complete 3-day itinerary. From iconic landmarks to hidden gems, explore [City Name] like a local."
        />
        <meta
          name="keywords"
          content="[City Name] itinerary, 3-day [City Name] trip, [City Name] travel guide, [City Name] attractions, things to do in [City Name]"
        />
        <meta
          property="og:title"
          content="Complete 3-Day Itinerary for Exploring [City Name]"
        />
        <meta
          property="og:description"
          content="Discover the best of [City Name] with our complete 3-day itinerary. From iconic landmarks to hidden gems, explore [City Name] like a local."
        />
        <meta property="og:image" content="/logoblack.svg" />
        <meta property="og:url" content="https://thetarzanway.com/trips/[id]" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://thetarzanway.com/trips/[id]"></link>
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

export default connect(mapStateToPros, mapDispatchToProps)(IndexedItinerary);

export async function getStaticPaths() {
  let paths = [];

  try {
    const res = await axiossearchInstance.get(
      "/?type=Location&fields=path,cta"
    );

    const data = res.data;

    for (var i = 0; i < data.length; i++) {
      const pathArr = data[i].path.split("/");
      var [continentSlug, countrySlug, stateSlug, citySlug] = pathArr;
      if (data[i].cta) {
        paths.push({
          params: {
            continent: continentSlug,
            country: countrySlug,
            state: stateSlug,
            city: citySlug,
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
  let data = null;

  try {
    const res = await axiosPoiCityInstance.get(`/?slug=${context.params.id}`);
    data = res.data;
  } catch (err) {
    console.error("[ERROR][tripsPage:getStaticProps]: ", err.message);
  }

  return {
    props: {
      Data: data,
    },
  };
}

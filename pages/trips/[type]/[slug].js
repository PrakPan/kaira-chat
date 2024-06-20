import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { connect } from "react-redux";
import ItineraryContainer from "../../../containers/itinerary/IndexsV2/Index";
import LayoutV2 from "../../../components/Layout";
import * as authaction from "../../../store/actions/auth";
import setItineraryId from "../../../store/actions/itineraryId";
import axiosplaninstance from "../../../services/itinerary/plan";
import axiosIndexedItinerary from "../../../services/itinerary/releasedForCustomer";

let TRIPS_CACHE = null;

const IndexedItinerary = ({ Data, setItineraryId, checkAuthState }) => {
  const router = useRouter();

  useEffect(() => {
    if (Data?.ID) {
      setItineraryId(Data?.ID);
    }
    checkAuthState();
  }, [router]);

  function cityNames() {
    if (Data?.cities) {
      const Cities = Data.cities;
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
        <title> {Data?.page_title} </title>
        <meta name="description" content={Data?.meta_description} />
        <meta
          name="keywords"
          content={`ai trip planner, trip planner, itinerary, ${cityNames()} trip planner, travel in ${cityNames()}, ${cityNames()} travel package, ${cityNames()} tour package, ${cityNames()} holiday package, travel plan, ai itinerary, ai plan, craft a trip, wanderlog, inspirock, tripit, local travel experience, customized trip planner, customized holiday packages, customized packages, honeymoon travel packages, solo travel, family travel, personalized travel package, hotels, flights, activities, transfers,`}
        />
        <meta property="og:title" content={Data?.social_title} />
        <meta property="og:description" content={Data?.social_description} />
        <meta property="og:image" content="/logoblack.svg" />
        <meta
          property="og:url"
          content={`https://thetarzanway.com/trips/${Data?.path}`}
        />
        <meta property="og:type" content="website" />
        <link
          rel="canonical"
          href={`https://thetarzanway.com/trips/${Data?.path}`}
        ></link>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: `
                {
                "@context": "https://schema.org/",
                "@type": "Product",
                "name": "${Data?.page_title}",
                "image": [
                  "https://d31aoa0ehgvjdi.cloudfront.net/${Data?.image}"
                ],
                "description": "${Data?.meta_description}",
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": ${Data?.review},
                  "reviewCount": ${Data?.rating_count}
                },
                "offers": {
                  "@type": "Offer",
                  "price": ${Data?.price},
                  "priceCurrency": "INR",
                  "availability": "LimitedAvailability",
                  "priceValidUntil": "${Data?.priceValid}"
                }
              }
            `,
          }}
        />
      </Head>

      {Data?.ID && <ItineraryContainer id={Data?.ID}></ItineraryContainer>}
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

async function fetchTripDataById(id) {
  const response = await axiosplaninstance.get(`/?itinerary_id=${id}`);
  const data = response.data;
  return data;
}

async function fetchAllSlugsWithIds() {
  const response = await axiosIndexedItinerary.get("");
  const trips = response.data.map((trip) => {
    let group_type = trip?.group_type
      ? trip.group_type.replaceAll(" ", "_").toLowerCase()
      : "group";
    return {
      group_type: group_type,
      slug: trip.slug,
      id: trip.id,
    };
  });

  return trips;
}

export async function getStaticPaths() {
  let paths = [];

  try {
    if (!TRIPS_CACHE) {
      TRIPS_CACHE = await fetchAllSlugsWithIds();
    }

    paths = TRIPS_CACHE.map((trip) => ({
      params: {
        type: trip.group_type,
        slug: trip.slug,
      },
    }));
  } catch (err) {
    console.log("[ERROR][tripsPage:getStaticPaths]: ", err.message);
  }

  return {
    paths: paths,
    fallback: false,
  };
}

export async function getStaticProps(context) {
  const { type, slug } = context.params;
  let ID = null;
  let page_title = null;
  let meta_description = null;
  let social_title = null;
  let social_description = null;
  let duration = null;
  let image = null;
  let review = null;
  let rating_count = null;
  let price = null;
  const priceValid = `${new Date().getFullYear()}-12-31`;
  const path = `${type}/${slug}`;
  let cities = [];

  try {
    if (!TRIPS_CACHE) {
      TRIPS_CACHE = await fetchAllSlugsWithIds();
    }

    const trip = TRIPS_CACHE.find((trip) => trip.slug === slug);
    const data = await fetchTripDataById(trip.id);

    ID = trip.id;
    page_title = data?.page_title;
    meta_description = data?.meta_description;
    social_title = data?.social_share_title;
    social_description = data?.social_media_description;
    duration = data?.duration_number;
    image = data?.images?.length > 0 ? data.images[0] : null;
    review = data?.review;
    rating_count = data?.rating_count;
    price = data?.payment_info?.per_person_total_cost / 100;
    cities = data?.itinerary_locations;
  } catch (err) {
    console.log("[ERROR][tripsPage:getStaticProps]: ", err.message);
  }

  return {
    props: {
      Data: {
        ID,
        page_title,
        meta_description,
        social_title,
        social_description,
        duration,
        image,
        review,
        rating_count,
        price,
        priceValid,
        path,
        cities,
      },
    },
  };
}

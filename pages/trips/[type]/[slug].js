import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { connect } from "react-redux";
import ItineraryContainer from "../../../containers/itinerary/IndexsV2/IndexedContainer";
import LayoutV2 from "../../../components/Layout";
import * as authaction from "../../../store/actions/auth";
import setItineraryId from "../../../store/actions/itineraryId";
import axiosplaninstance from "../../../services/itinerary/plan";
import axiosIndexedItinerary from "../../../services/itinerary/releasedForCustomer";
import axiosDaybyDayInstance from "../../../services/itinerary/daybyday/preview";
import axiosbreifinstance from "../../../services/itinerary/brief/preview";
import axiosRoutesInstance from "../../../services/itinerary/brief/route";
import axiosBookingsInstance from "../../../services/itinerary/bookings";
import axiosPaymentInstance from "../../../services/itinerary/payment";

let TRIPS_CACHE = null;

const IndexedItinerary = ({
  Data,
  daybyday,
  breif,
  routes,
  plan,
  bookings,
  payment,
  setItineraryId,
  checkAuthState,
}) => {
  const router = useRouter();

  useEffect(() => {
    if (Data?.ID) {
      setItineraryId(Data?.ID);
    }
    checkAuthState();
  }, [router]);

  function cityNames(str, start = false) {
    if (Data?.cities) {
      const Cities = Data.cities;
      let city_names = "";
      for (let i = 0; i < Cities.length; i++) {
        city_names = start
          ? city_names + str + " " + Cities[i] + ", "
          : city_names + Cities[i] + " " + str + ", ";
      }

      return city_names;
    }

    return "";
  }

  return (
    <LayoutV2 itinerary page={"Itinerary Page"}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title> {Data?.page_title} </title>
        <meta name="description" content={Data?.meta_description} />
        <meta
          name="keywords"
          content={`ai trip planner, trip planner, itinerary, ${cityNames(
            "trip planner"
          )}${cityNames("travel in", true)}${cityNames(
            "travel package"
          )}${cityNames("tour package")}${cityNames(
            "holiday package"
          )}travel plan, ai itinerary, ai plan, craft a trip, wanderlog, inspirock, tripit, local travel experience, customized trip planner, customized holiday packages, customized packages, honeymoon travel packages, solo travel, family travel, personalized travel package, hotels, flights, activities, transfers,`}
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

      {Data?.ID && (
        <ItineraryContainer
          id={Data?.ID}
          daybydayData={daybyday}
          breifData={breif}
          routesData={routes}
          planData={plan}
          bookingsData={bookings}
          paymentData={payment}
        ></ItineraryContainer>
      )}
    </LayoutV2>
  );
};

const mapStateToProps = (state) => {
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

export default connect(mapStateToProps, mapDispatchToProps)(IndexedItinerary);

async function fetchTripDataById(id) {
  let daybydayResponse = null;
  let breifResponse = null;
  let routesResponse = null;
  let bookingsResponse = null;
  let planResponse = null;
  let paymentResponse = null;

  try {
    const response = await axiosDaybyDayInstance.get(`/?itinerary_id=${id}`);
    daybydayResponse = response.data;
  } catch (err) {
    console.log("[ERROR][tripsPage:daybyday]: ", err.message);
  }

  try {
    const response = await axiosbreifinstance.get(`/?itinerary_id=${id}`);
    breifResponse = response.data;
  } catch (err) {
    console.log("[ERROR][tripsPage:breif]: ", err.message);
  }

  try {
    const response = await axiosRoutesInstance.get(`/?itinerary_id=${id}`);
    routesResponse = response.data;
  } catch (err) {
    console.log("[ERROR][tripsPage:routes]: ", err.message);
  }

  try {
    const response = await axiosBookingsInstance.get(`/?itinerary_id=${id}`);
    bookingsResponse = response.data;
  } catch (err) {
    console.log("[ERROR][tripsPage:bookings]: ", err.message);
  }

  try {
    const response = await axiosplaninstance.get(`/?itinerary_id=${id}`);
    planResponse = response.data;
  } catch (err) {
    console.log("[ERROR][tripsPage:plan]: ", err.message);
  }

  try {
    const response = await axiosPaymentInstance.post("", {
      itinerary_type: "Tailored",
      itinerary_id: id,
    });
    paymentResponse = response.data;
  } catch (err) {
    console.log("[ERROR][tripsPage:payment]: ", err.message);
  }

  return {
    daybydayResponse,
    breifResponse,
    routesResponse,
    bookingsResponse,
    planResponse,
    paymentResponse,
  };
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
  let daybyday = null;
  let breif = null;
  let routes = null;
  let bookings = null;
  let plan = null;
  let payment = null;

  try {
    if (!TRIPS_CACHE) {
      TRIPS_CACHE = await fetchAllSlugsWithIds();
    }

    const trip = TRIPS_CACHE.find((trip) => trip.slug === slug);

    const {
      planResponse,
      daybydayResponse,
      breifResponse,
      routesResponse,
      bookingsResponse,
      paymentResponse,
    } = await fetchTripDataById(trip.id);

    daybyday = daybydayResponse;
    breif = breifResponse;
    routes = routesResponse;
    bookings = bookingsResponse;
    plan = planResponse;
    payment = paymentResponse;

    ID = trip.id;
    page_title = planResponse?.page_title;
    meta_description = planResponse?.meta_description;
    social_title = planResponse?.social_share_title;
    social_description = planResponse?.social_media_description;
    duration = planResponse?.duration_number;
    image = planResponse?.images?.length > 0 ? planResponse.images[0] : null;
    review = planResponse?.review;
    rating_count = planResponse?.rating_count;
    price = planResponse?.payment_info?.per_person_total_cost / 100;
    cities = [...new Set(planResponse?.itinerary_locations)];
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
      daybyday,
      breif,
      routes,
      bookings,
      plan,
      payment,
    },
  };
}

import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { connect } from "react-redux";
import ItineraryContainer from "../../../containers/itinerary/IndexsV2/IndexedContainer";
import LayoutV2 from "../../../components/Layout";
import * as authaction from "../../../store/actions/auth";
import setItineraryId from "../../../store/actions/itineraryId";
import {
  fetchTripsIndex,
  fetchV1Itinerary,
} from "../../../services/itinerary/v1/archive";
import { adaptV1Snapshot } from "../../../lib/v1Itinerary";
import { titleFromSlug, descriptionFromSlug } from "../../../lib/tripsSeo";

// These pages used to be built from seven supplier-portal calls — the indexed
// list for getStaticPaths, then plan/day_by_day/brief/routes/bookings/payment
// per trip in getStaticProps. That portal is being switched off, so both now
// read the S3 archive through CloudFront: `trips/index.json` for the slug -> id
// mapping (the slug lives nowhere else) and `itineraries/<id>.json` for the
// content, which `adaptV1Snapshot` maps onto the shapes the container expects.
//
// Still prerendered rather than client-rendered: /trips exists for organic
// search, and one shared [type]/[slug] shell would ship identical <title>,
// description, canonical and JSON-LD on all 644 URLs — which the crawlers that
// build link previews (WhatsApp, Facebook, LinkedIn, Slack) would never see
// past, since they don't execute JS.
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

  // Title template: "{N} Days {Destination} Itinerary — {GroupType} Trip Plan".
  // Falls back to the CMS page_title when duration/cities aren't available.
  const groupTypeLabel = Data?.path
    ? (Data.path.split("/")[0] || "").replace(/^\w/, (c) => c.toUpperCase())
    : "";
  const tripsTitle =
    Data?.duration && Data?.cities?.length
      ? `${Data.duration} Days ${Data.cities[0]} Itinerary — ${groupTypeLabel} Trip Plan | The Tarzan Way`
      : Data?.page_title
        ? `${Data.page_title} | The Tarzan Way`
        : "Plan your trip with The Tarzan Way";

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
    <LayoutV2 staticnav itinerary page={"Itinerary Page"}>
      <Head>
        <title>{tripsTitle}</title>
        <meta name="description" content={Data?.meta_description} />
        <meta
          name="keywords"
          content={`ai trip planner, trip planner, itinerary, ${cityNames(
            "trip planner",
          )}${cityNames("travel in", true)}${cityNames(
            "travel package",
          )}${cityNames("tour package")}${cityNames(
            "holiday package",
          )}travel plan, ai itinerary, ai plan, craft a trip, wanderlog, inspirock, tripit, local travel experience, customized trip planner, customized holiday packages, customized packages, honeymoon travel packages, solo travel, family travel, personalized travel package, hotels, flights, activities, transfers,`}
        />
        <meta property="og:title" content={Data?.social_title} />
        <meta property="og:description" content={Data?.social_description} />
        <meta property="og:image" content="https://thetarzanway.com/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://thetarzanway.com/og-image.png" />
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
            // Built with JSON.stringify so missing fields (null review/price)
            // can't emit invalid JSON the way a string template would.
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Trip",
              name: Data?.page_title,
              description: Data?.meta_description,
              url: `https://thetarzanway.com/trips/${Data?.path}`,
              ...(Data?.image
                ? {
                    image: [
                      `https://d31aoa0ehgvjdi.cloudfront.net/${Data.image}`,
                    ],
                  }
                : {}),
              ...(Data?.price
                ? {
                    offers: {
                      "@type": "Offer",
                      price: Data.price,
                      priceCurrency: "INR",
                      availability: "https://schema.org/LimitedAvailability",
                      priceValidUntil: Data?.priceValid,
                    },
                  }
                : {}),
            }),
          }}
        />
      </Head>

      {Data?.ID && (
        <ItineraryContainer
          id={Data?.ID}
          page_title={Data?.page_title}
          social_title={Data?.social_title}
          social_description={Data?.social_description}
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
  // One CloudFront object replaces the six supplier calls this used to make.
  // A miss returns nulls rather than throwing so a single bad trip can't fail
  // the whole export — getStaticProps turns that into notFound.
  try {
    const snapshot = await fetchV1Itinerary(id);
    const adapted = adaptV1Snapshot(snapshot, id);
    if (!adapted) return { daybydayResponse: null };

    return {
      daybydayResponse: adapted.itinerary,
      breifResponse: adapted.breif,
      planResponse: adapted.plan,
      bookingsResponse: adapted.bookings,
      // The archive carries no route geometry and no pricing, so the route map
      // stays empty and every price/pay affordance renders nothing.
      routesResponse: [],
      paymentResponse: null,
    };
  } catch (err) {
    console.log("[ERROR][tripsPage:archive]: ", err.message);
    return { daybydayResponse: null };
  }
}

async function fetchAllSlugsWithIds() {
  // trips/index.json already carries the group_type the supplier returned, and
  // only lists trips whose itinerary object exists in the archive.
  const index = await fetchTripsIndex();

  return index
    .filter((trip) => trip?.slug && trip?.id)
    .map((trip) => ({
      group_type: trip.group_type
        ? trip.group_type.replaceAll(" ", "_").toLowerCase()
        : "family",
      slug: trip.slug,
      id: trip.id,
    }));
}

export async function getStaticPaths() {
  // Deliberately unguarded. This used to swallow the error and return an empty
  // path list, which with fallback:false emits *zero* trips pages — a silent
  // build that 404s all 644 indexed URLs and looks successful. Failing the
  // build is the safer outcome: the index is one small object, and if it can't
  // be read that is something to fix before deploying, not to ship past.
  if (!TRIPS_CACHE) {
    TRIPS_CACHE = await fetchAllSlugsWithIds();
  }

  return {
    paths: TRIPS_CACHE.map((trip) => ({
      params: { type: trip.group_type, slug: trip.slug },
    })),
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

    if (!trip || !trip.id) {
      return {
        notFound: true,
      };
    }

    const {
      planResponse,
      daybydayResponse,
      breifResponse,
      routesResponse,
      bookingsResponse,
      paymentResponse,
    } = await fetchTripDataById(trip.id);

    // No itinerary object behind the slug — don't publish an empty page.
    if (!daybydayResponse) {
      return { notFound: true };
    }

    daybyday = daybydayResponse;
    breif = breifResponse;
    routes = routesResponse;
    bookings = bookingsResponse;
    plan = planResponse;
    payment = paymentResponse;

    ID = trip.id;

    // The supplier's plan payload carried the whole SEO layer — page_title,
    // meta_description, social copy, itinerary_locations, review, rating and
    // price. None of it survived into the archive. The slug is a slugified
    // page_title, so the title and description are rebuilt from it; the rest
    // is left null and drops out of the head and JSON-LD rather than being
    // invented (the template already spreads image/price in conditionally).
    page_title = titleFromSlug(slug);
    meta_description = descriptionFromSlug(slug);
    social_title = page_title
      ? `${page_title} | The Tarzan Way`
      : null;
    social_description = meta_description;

    duration = planResponse?.duration_number ?? null;
    image = daybydayResponse?.images?.length ? daybydayResponse.images[0] : null;

    // `cities` drives the "{N} Days {City} Itinerary" title and the keywords
    // meta. The archive ships cities without names, so this stays empty and the
    // title falls through to page_title above.
    cities = [];
  } catch (err) {
    console.log("[ERROR][tripsPage:getStaticProps]: ", err.message);

    return {
      notFound: true,
    };
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
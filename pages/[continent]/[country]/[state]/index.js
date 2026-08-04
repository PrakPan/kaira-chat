import Head from "next/head";
import { useEffect } from "react";
import { connect } from "react-redux";
import StatePage from "../../../../containers/travelplanner/Index";
import Layout from "../../../../components/Layout";
import axiosTravelPlannerInstance from "../../../../services/pages/travel-planner";
import axiossearchallinstance from "../../../../services/search/all";
import axiospagelistinstance from "../../../../services/pages/list";
import axioslocationsinstance from "../../../../services/search/search";
import setHotLocationSearch from "../../../../store/actions/hotLocationSearch";
import axios from "axios";
import { MERCURY_HOST } from "../../../../services/constants";
import { isDestinationIndexable } from "../../../../lib/seo/indexableDestinations";
import * as PagesToIdMapping from "../../../../data/PagesToIdMapping.json";
import { convertDbNameToCapitalFirst } from "../../../../helper/convertDbnameToCapitalFirst";
import ThemePage from "../../../../containers/travelplanner/ThemePage"
import { useRouter } from "next/router";
import { useAnalytics } from "../../../../hooks/useAnalytics";

const TravelPlanner = (props) => {
  const router = useRouter();
  // const { trackPageView } = useAnalytics();
  useEffect(() => {
    props.setHotLocationSearch(props.hotLocationSearch);
    // trackPageView(props.Type, `${props.Data?.name} Page`)
  }, [props?.hotLocationSearch]);

  const faq = [
    {
      "question": "What makes The Tarzan Way's 2025 proposal services unique?",
      "answer": "The Tarzan Way’s Proposal 2025 services are designed for unforgettable, hyper-personalized proposals. We curate dreamy locations, unique themes, and exclusive experiences, all tailored to your love story—ensuring a magical “Yes!” moment like no other!"
    },
    {
      "question": "Can I customize my itinerary?",
      "answer": "Absolutely! The Tarzan Way offers fully customizable honeymoon itineraries to match your preferences, travel style, and budget. Whether you want a romantic beach escape, an adventurous mountain retreat, or a cultural experience, we can tailor your trip to perfection."
    },
    {
      "question": "Can I plan a surprise proposal with your team?",
      "answer": "Of course! Our team specializes in discreetly planning surprise proposals while ensuring every detail is perfect."
    },
    {
      "question": "Do you offer travel and accommodation assistance along with the proposal?",
      "answer": "Yes! We can take care of flights, hotels, transportation, and everything needed for a stress-free proposal trip."
    },
    {
      "question": "Can we include adventure activities in our proposal package?-",
      "answer": "Absolutely! You can add adventure activities like trekking, scuba diving, or paragliding to make your honeymoon exciting."
    },
    {
      "question": "Can I propose at a specific landmark or private venue?",
      "answer": "Yes! We can help arrange proposals at iconic landmarks, private villas, resorts, or any special location of your choice."
    },
    {
      "question": "Can you help with ring presentation ideas?",
      "answer": "Of course! Whether you want the ring hidden in a dessert, presented by a scuba diver, or delivered by a drone, we can make it happen!"
    },
    {
      "question": "How does The Tarzan Way ensure a stress-free proposal?",
      "answer": "The Tarzan Way ensures a stress-free proposal by taking care of each and everything- from your stays, transfers to proposal bookings. We make sure to make your day THE BEST."
    },
    {
      "question": "What are some unique proposal ideas you offer?",
      "answer": "We offer ideas like proposing under the Northern Lights in Iceland, a hot air balloon proposal in Jaipur, or a shikara proposal in Kashmir."
    },
    {
      "question": "What are your cancellation and refund policies?",
      "answer": "Our policies depend on the destination and package. Please refer to our cancellation guidelines or contact us for details."
    },
    {
      "question": "Which place is best for a proposal?",
      "answer": "The best place for a proposal depends on your love story! Whether it's a private beach, a breathtaking mountain peak, a historic castle, or a dreamy candlelit setup, The Tarzan Way curates the perfect destination based on your partner’s preferences, making the moment truly unforgettable."
    }
  ]

  // ── SEO metadata with fallbacks ──────────────────────────────────────────
  // The CMS often ships an empty meta_description / meta_keywords and a generic
  // social_share_title for STATE pages, which previously shipped empty
  // <meta description>, empty og:*, empty keywords and no structured data —
  // measurably weaker than city pages. Derive sensible fallbacks so every state
  // page has a complete, page-specific set of tags. Mirrors the city page.
  const stateName =
    props.Data?.name || convertDbNameToCapitalFirst(props.Data?.slug) || "";
  const canonicalUrl = `https://thetarzanway.com/${props.path}`;
  const pageTitle = `Plan Your Trip to ${convertDbNameToCapitalFirst(
    props.Data?.slug
  )} | AI Trip Planner & Custom Travel Itineraries | The Tarzan Way`;

  // Description: prefer CMS meta_description, then the richer editorial copy,
  // then a name-based default. Collapse whitespace and trim to a snippet length
  // at a word boundary so long paragraphs don't get cut mid-word.
  const rawDescription =
    props.Data?.meta_description ||
    props.Data?.short_description ||
    props.Data?.one_liner_description ||
    props.Data?.tagline ||
    `Plan your trip to ${stateName} with The Tarzan Way's AI itinerary. Discover the top places to visit, things to do, ideal duration, best time to visit, and build a custom, bookable travel plan.`;
  let metaDescription = String(rawDescription).replace(/\s+/g, " ").trim();
  if (metaDescription.length > 300) {
    metaDescription =
      metaDescription.slice(0, 300).replace(/\s+\S*$/, "").trim() + "…";
  }

  // og:title: the CMS social_share_title is frequently the generic site default
  // for states; fall back to the page-specific title in that case.
  const GENERIC_SHARE_TITLE = "The Tarzan Way | Personalized Travel Experiences";
  const ogTitle =
    props.Data?.social_share_title &&
    props.Data.social_share_title.trim() &&
    props.Data.social_share_title.trim() !== GENERIC_SHARE_TITLE
      ? props.Data.social_share_title
      : pageTitle;

  // keywords: fall back to a name-derived set when the CMS field is empty.
  const rawKeywords = Array.isArray(props?.Data?.meta_keywords)
    ? props.Data.meta_keywords.join(", ")
    : props?.Data?.meta_keywords;
  const metaKeywords =
    rawKeywords && String(rawKeywords).trim()
      ? rawKeywords
      : `${stateName} trip planner, ${stateName} itinerary, things to do in ${stateName}, places to visit in ${stateName}, ${stateName} tour package, ${stateName} travel guide, best time to visit ${stateName}, ${stateName} holiday packages, AI trip planner`;

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: stateName,
    description: metaDescription,
    url: canonicalUrl,
  };

  return (
    <Layout
      page_id={props.Data?.id}
      destination={props.Data?.destination}
      page={"State Page"}
    >
      <Head>
        {/* Ticket 2.1: states not in the keep-list are noindexed (crawlable,
            so equity still flows via follow). */}
        {!isDestinationIndexable(props.path) && (
          <meta name="robots" content="noindex,follow" />
        )}
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription}></meta>
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content="https://thetarzanway.com/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://thetarzanway.com/og-image.png" />
        <meta property="keywords" content={metaKeywords}></meta>

        <script
          type="module"
          crossorigin
          src="/vendor/panorama-slider.js"
        ></script>
        <link
          rel="stylesheet"
          crossorigin
          href="/vendor/panorama-slider.css"
        ></link>

        <link rel="canonical" href={canonicalUrl}></link>
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </Head>

      {/* {props.pageData ? (
    <ThemePage themePage experienceData={props.Data?.page_data} slug={props.Data?.page_data?.slug} state={props?.Data} data={props?.Data}/>
  ) : ( */}
    <StatePage
      experienceData={props.Data}
      locations={props.locations}
      page_id={props.page_id || ""}
      type={props?.Type}
    />
  {/* )} */}
    </Layout>
  );
};

export async function getStaticPaths() {
  let paths = [];

  try {
    // mercury api
    const res = await axiossearchallinstance.get("/all/?type=State");
    const data = res.data;

    const allPaths = [...data];

    for (var i = 0; i < allPaths?.length; i++) {
      const pathArr = allPaths[i].path.split("/");
      var [continentSlug, countrySlug, stateSlug] = pathArr;
      paths.push({
        params: {
          continent: continentSlug,
          country:countrySlug!="None"? countrySlug.toLowerCase().replace(/ /g, "_"):countrySlug,
          state: stateSlug,
        },
      });
    }
  } catch (err) {
    console.error(
      "[ERROR][statePage:axiossearchallinstance][/?type=State&fields=path]: ",
      err.message
    );
  }

  return {
    paths:paths,
    fallback:false
  }
  return {
    paths: [
      {
        params: {
          continent: "europe",
          country: "portugal",
          state: "madeira",
        },
      },
    ], fallback: false,
  };
}

export async function getStaticProps(context) {
  const { continent, country, state } = context.params;

  const path = `${continent}/${country}/${state}`;
  let data = null;
  let locations = [];
  let hotLocationSearch = [];
  let Type = "State";
  let Id = PagesToIdMapping?.[path] != undefined ? PagesToIdMapping?.[path] : "";
  console.log("id is: ",Id)
  let isThemePage = false;
  //mercury api
  await axios
    .get(`${MERCURY_HOST}/api/v1/geos/state/${Id}`)
    .then((res) => {
     const stateData = res.data.data.state;
     locations = stateData?.nearest_states || [];
     data = stateData;
    if (stateData?.page_data && Object.keys(stateData?.page_data).length > 0) {
      isThemePage = true;
    }
  })
    .catch((err) => {
      console.log(
        `[ERROR][statePage:axiosTravelPlannerInstance][${state}]: `,
        err.message
      );
    });

  //mercury api
  await axios
    .get(
      `${MERCURY_HOST}/api/v1/geos/state/?fields=id,name,budget,tagline&country_name=${country}&limit=100`
    )
    .then((res) => {
      // locations = res?.data?.data?.nearest_states || res.data.data.states;
    })
    .catch((err) => {
      console.log(
        `[ERROR][statePage:axiospagelistinstance][${country}]: `,
        err.message
      );
    });

  //mercury api
  await axioslocationsinstance
    .get(`hot_destinations/?state=${state}/`)
    .then((res) => {
      if (res.data?.length) {
        hotLocationSearch = res.data;
      }
    })
    .catch((err) => {
      console.log(
        `[ERROR][StatePage][axioslocationsinstance:/hot_destinations/?state=${state}/]`,
        err.message
      );
    });

  if (!data) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      Data: data,
      locations,
      path,
      hotLocationSearch,
      page_id: PagesToIdMapping[path] || "",
      Type,
      pageData: isThemePage,
    },
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setHotLocationSearch: (payload) => dispatch(setHotLocationSearch(payload)),
  };
};

export default connect(null, mapDispatchToProps)(TravelPlanner);

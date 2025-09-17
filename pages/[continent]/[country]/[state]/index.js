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
import * as PagesToIdMapping from "../../../../data/PagesToIdMapping.json";
import { convertDbNameToCapitalFirst } from "../../../../helper/convertDbnameToCapitalFirst";
import ThemePage from "../../../../containers/travelplanner/ThemePage"

const TravelPlanner = (props) => {
  useEffect(() => {
    console.log("props states are:", props);
    props.setHotLocationSearch(props.hotLocationSearch);
  }, []);

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

  return (
    <Layout
      page_id={props.Data.id}
      destination={props.Data.destination}
      page={"State Page"}
    >
      <Head>
        <title>
          Plan Your Trip to {convertDbNameToCapitalFirst(props.Data.slug)} | Trip Planner & Itinerary
          | The Tarzan Way
        </title>
        <meta
          name="description"
          content={`${props.Data.meta_description}`}
        ></meta>
        <meta
          property="og:title"
          content={`${props.Data.social_share_title}`}
        />
        <meta
          property="og:description"
          content={`${props.Data.meta_description}`}
        />
        <meta property="og:image" content="/logoblack.svg" />
        <meta
          property="keywords"
          content={`${Array.isArray(props?.Data?.meta_keywords)
              ? props?.Data?.meta_keywords.join(", ")
              : props?.Data?.meta_keywords
            }`}
        ></meta>

        <link
          rel="canonical"
          href={`https://thetarzanway.com/${props.path}`}
        ></link>
      </Head>

      {props.pageData ? (
    <ThemePage themePage experienceData={props.Data?.page_data} slug={props.Data?.page_data?.slug} state={props?.Data}/>
  ) : (
    <StatePage
      experienceData={props.Data}
      locations={props.locations}
      page_id={props.page_id || ""}
      type={props?.Type}
    />
  )}
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

    for (var i = 0; i < allPaths.length; i++) {
      const pathArr = allPaths[i].path.split("/");
      var [continentSlug, countrySlug, stateSlug] = pathArr;
      paths.push({
        params: {
          continent: continentSlug,
          country: countrySlug.replace(/ /g, "_"),
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
  let Id = PagesToIdMapping[path] != undefined ? PagesToIdMapping[path] : "";
  console.log("id is: ",Id)
  let isThemePage = false;
  //mercury api
  await axios
    .get(`${MERCURY_HOST}/api/v1/geos/state/${Id}`)
    .then((res) => {
      const stateData = res.data.data.state;
      data = stateData;
      if (stateData.page_data!=null && Object.keys(stateData.page_data).length > 0) {
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
      locations = res.data.data.states;
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

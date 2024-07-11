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

const TravelPlanner = (props) => {
  useEffect(() => {
    props.setHotLocationSearch(props.hotLocationSearch);
  }, []);

  return (
    <Layout
      page_id={props.Data.id}
      destination={props.Data.destination}
      page={"State Page"}
    >
      <Head>
        <title>
          Plan Your Trip to {props.Data.destination} | Trip Planner & Itinerary
          | The Tarzan Way
        </title>
        <meta
          name="description"
          content={`Plan your dream trip to ${props.Data.destination} with The Tarzan Way's AI itinerary. Explore top attractions, local cuisine, and book your flights, accommodations, and transfers all in one go ${props.Data.destination}.`}
        ></meta>
        <meta
          property="og:title"
          content={`Plan Your Trip to ${props.Data.destination} | Trip Planner & Itinerary | The Tarzan Way`}
        />
        <meta
          property="og:description"
          content={`Plan your dream trip to ${props.Data.destination} with The Tarzan Way's AI itinerary. Explore top attractions, local cuisine, and book your flights, accommodations, and transfers all in one go ${props.Data.destination}.`}
        />
        <meta property="og:image" content="/logoblack.svg" />
        <meta
          property="keywords"
          content={`${props.Data.destination} trip planner, ai trip planner, trip planner, itinerary, travel plan, ai itinerary, ai plan, craft a trip, travel in ${props.Data.destination}, ${props.Data.destination} tour package, experience ${props.Data.destination} culture, ${props.Data.destination} holiday package, local travel experience, customized trip planner, customized holiday packages, customized packages in computer, honeymoon travel packages, personalized travel package, best places in ${props.Data.destination}, places to visit in ${props.Data.destination}, best activities in ${props.Data.destination}, things to do in ${props.Data.destination}, package for ${props.Data.destination}, top places in ${props.Data.destination}, wanderlog, inspirock, tripit, hotels, flights, activities, transfers, solo travel, family travel,`}
        ></meta>

        <link
          rel="canonical"
          href={`https://thetarzanway.com/${props.path}`}
        ></link>
      </Head>

      <StatePage
        experienceData={props.Data}
        locations={props.locations}
      ></StatePage>
    </Layout>
  );
};

export async function getStaticPaths() {
  let paths = [];

  try {
    const res = await axiossearchallinstance.get("/?type=State&fields=path");
    const data = res.data;

    let themePages = null;

    try {
      const themeRes = await axiospagelistinstance.get(
        "/?fields=path&page_type=Theme"
      );

      themePages = themeRes.data;
    } catch (err) {
      console.error(
        "[ERROR][statePage:axiospagelistinstance][/?fields=path&page_type=Theme]: ",
        err.message
      );
    }

    themePages = themePages.map((page) => {
      return {
        path: "asia/India/" + page.path,
      };
    });

    const allPaths = [...data, ...themePages];

    for (var i = 0; i < allPaths.length; i++) {
      const pathArr = allPaths[i].path.split("/");
      var [continentSlug, countrySlug, stateSlug] = pathArr;
      paths.push({
        params: {
          continent: continentSlug,
          country: countrySlug.toLowerCase().replace(/ /g, "_"),
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
    paths: paths,
    fallback: false,
  };
}

export async function getStaticProps(context) {
  var locations = [];
  let data = null;
  let hotLocationSearch = [];
  const { continent, country, state } = context.params;
  const path = `${continent}/${country}/${state}`;

  try {
    const res = await axiosTravelPlannerInstance.get(
      `/?link=${context.params.state}`
    );
    data = res.data;
  } catch (err) {
    console.log(
      `[ERROR][statePage:axiosTravelPlannerInstance][${context.params.state}]: `,
      err.message
    );
  }

  if (!data) {
    return {
      notFound: true,
    };
  }

  try {
    const loc = await axiospagelistinstance.get(
      `/?country=${context.params.country}&page_type=Destination&fields=id,ancestors,path,destination,name,tagline,image,link,budget`
    );
    locations = loc.data;
  } catch (err) {
    console.log(
      `[ERROR][statePage:axiospagelistinstance][${context.params.country}]: `,
      err.message
    );
  }

  try {
    const response = await axioslocationsinstance.get(
      `hot_destinations/?state=${state}/`
    );
    if (response.data?.length) {
      hotLocationSearch = response.data;
    }
  } catch (err) {
    console.log(
      `[ERROR][StatePage][axioslocationsinstance:/hot_destinations/?state=${state}/]`
    );
  }

  return {
    props: {
      Data: data,
      locations,
      path,
      hotLocationSearch,
    },
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setHotLocationSearch: (payload) => dispatch(setHotLocationSearch(payload)),
  };
};

export default connect(null, mapDispatchToProps)(TravelPlanner);

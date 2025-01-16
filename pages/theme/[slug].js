import Head from "next/head";
import { useEffect } from "react";
import { connect } from "react-redux";

import ThemePage from "../../containers/travelplanner/ThemePage";
import Layout from "../../components/Layout";
import { axiosPageInstance } from "../../services/pages/travel-planner";
import axiospagelistinstance, {
  axiosPageList,
} from "../../services/pages/list";
import axioslocationsinstance from "../../services/search/search";
import setHotLocationSearch from "../../store/actions/hotLocationSearch";

const TravelPlanner = (props) => {
  useEffect(() => {
    let locations = props.Data?.locations;
    if (locations?.length) {
      locations = locations.map((location) => {
        return {
          country: location?.state?.country,
          is_active: true,
          lat: location?.lat,
          long: location?.long,
          name: location?.name,
          parent: location?.state?.country,
          path: location?.path,
          resource_id: location?.id,
          type: "state",
          start_date: props.Data?.event_dates[location.id]?.start_date,
          end_date: props.Data?.event_dates[location.id]?.end_date,
        };
      });

      props.setHotLocationSearch(locations);
    } else {
      props.setHotLocationSearch(props.hotLocationSearch);
    }
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

      <ThemePage
        themePage
        experienceData={props.Data}
        locations={props.locations}
        eventDates={
          props.Data?.event_dates &&
          Object.keys(props.Data.event_dates).length !== 0
        }
      ></ThemePage>
    </Layout>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    setHotLocationSearch: (payload) => dispatch(setHotLocationSearch(payload)),
  };
};

export default connect(null, mapDispatchToProps)(TravelPlanner);

export async function getStaticPaths() {
  let paths = [];

  try {
    const response = await axiosPageList.get("?page_type=Theme");

    if (response?.data?.success) {
      paths = response.data.data.pages.map((path) => ({
        params: {
          slug: path.slug,
        },
      }));
    } else {
      throw Error("API Failed");
    }
  } catch (err) {
    console.log("[ERROR][themePage:getStaticPaths]: ", err.message);
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
  const { slug } = context.params;

  try {
    const res = await axiosPageInstance.get(`/${slug}`);
    if (res.data?.success) {
      data = res.data.data;
    } else {
      throw Error("API Failed");
    }
  } catch (err) {
    console.log(
      `[ERROR][themePage:axiosTravelPlannerInstance][${slug}]: `,
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
      `/?page_type=Destination&fields=id,ancestors,path,destination,name,tagline,image,link,budget`
    );
    locations = loc.data;
  } catch (err) {
    console.log(`[ERROR][themePage:axiospagelistinstance]: `, err.message);
  }

  try {
    const response = await axioslocationsinstance.get(
      `hot_destinations/?state=${slug}/`
    );
    if (response.data?.length) {
      hotLocationSearch = response.data;
    }
  } catch (err) {
    console.log(
      `[ERROR][ThemePage][axioslocationsinstance:/hot_destinations/?state=${slug}/]`,
      err.message
    );
  }

  return {
    props: {
      Data: data,
      locations,
      hotLocationSearch,
    },
  };
}

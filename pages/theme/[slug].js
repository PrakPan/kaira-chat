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
    let locations = props.Data?.locations || [];
    if (locations.length) {
      const mappedLocations = locations.map((location) => ({
        country: location?.state?.country,
        is_active: true,
        lat: location?.lat,
        long: location?.long,
        name: location?.name,
        parent: location?.state?.country,
        path: location?.path,
        resource_id: location?.id,
        type: "state",
        start_date: props.Data?.event_dates[location.id]?.start_date || null,
        end_date: props.Data?.event_dates[location.id]?.end_date || null,
      }));
      props.setHotLocationSearch(mappedLocations);
    }
  }, [props.Data]);

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

const mapDispatchToProps = (dispatch) => ({
  setHotLocationSearch: (payload) => dispatch(setHotLocationSearch(payload)),
});

export default connect(null, mapDispatchToProps)(TravelPlanner);

export async function getStaticPaths() {
  try {
    const response = await axiosPageList.get("?page_type=Theme");

    if (response?.data?.success) {
      const paths = response.data.data.pages.map((path) => ({
        params: { slug: path.slug },
      }));
      return { paths, fallback: false };
    } else {
      console.error("Failed to fetch paths.");
      return { paths: [], fallback: false };
    }
  } catch (err) {
    console.error("[ERROR][getStaticPaths]: ", err.message);
    return { paths: [], fallback: false };
  }
}

export async function getStaticProps({ params }) {
  const { slug } = params;
  let data = null;
  let locations = [];
  let hotLocationSearch = [];

  try {
    const res = await axiosPageInstance.get(`/${slug}`);
    console.log("slug",slug);
    if (res?.data?.success) {
      data = res.data.data;
      console.log("response",res.data);
    }
  } catch (err) {
    console.error(`[ERROR][getStaticProps:slug:${slug}]: `, err.message);
  }

  try {
    const locRes = await axiospagelistinstance.get(
      "/?page_type=Destination&fields=id,ancestors,path,destination,name,tagline,image,link,budget"
    );
    locations = locRes?.data || [];
  } catch (err) {
    console.error("[ERROR][getStaticProps:locations]: ", err.message);
  }

  try {
    const hotDestRes = await axioslocationsinstance.get(
      `hot_destinations/?state=${slug}/`
    );
    if (hotDestRes?.data?.length) {
      hotLocationSearch = hotDestRes.data;
    }
  } catch (err) {
    console.error("[ERROR][getStaticProps:hot_destinations]: ", err.message);
  }

  if (!data) {
    return { notFound: true };
  }

  return {
    props: { Data: data, locations, hotLocationSearch },
  };
}

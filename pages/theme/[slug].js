import Head from "next/head";
import { useEffect } from "react";
import { connect } from "react-redux";

import ThemePage from "../../containers/travelplanner/ThemePage";
import Layout from "../../components/Layout";
import { axiosPageInstance } from "../../services/pages/travel-planner";
import { axiosPageList } from "../../services/pages/list";
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
      destination={props.Data.name}
      page={"State Page"}
    >
      <Head>
        <title>
          {props.Data.social_share_title
            ? props.Data.social_share_title
            : "Plan Your Trip to  | Trip Planner & Itinerary | The Tarzan Way"}
        </title>
        <meta
          name="description"
          content={
            props.Data.meta_description
              ? props.Data.meta_description
              : `Plan your dream trip to ${props.Data.name} with The Tarzan Way's AI itinerary. Explore top attractions, local cuisine, and book your flights, accommodations, and transfers all in one go ${props.Data.destination}.`
          }
        ></meta>
        <meta
          property="og:title"
          content={
            props.Data.social_share_title
              ? props.Data.social_share_title
              : `Plan Your Trip to ${props.Data.name} | Trip Planner & Itinerary | The Tarzan Way`
          }
        />
        <meta
          property="og:description"
          content={
            props.Data.meta_description
              ? props.Data.meta_description
              : `Plan your dream trip to ${props.Data.name} with The Tarzan Way's AI itinerary. Explore top attractions, local cuisine, and book your flights, accommodations, and transfers all in one go ${props.Data.name}.`
          }
        />
        <meta property="og:image" content="/logoblack.svg" />
        <meta
          property="keywords"
          content={
            props.Data.meta_keywords
              ? props.Data.meta_keywords
              : `${props.Data.name} trip planner, ai trip planner, trip planner, itinerary, travel plan, ai itinerary, ai plan, craft a trip, travel in ${props.Data.name}, ${props.Data.name} tour package, experience ${props.Data.name} culture, ${props.Data.name} holiday package, local travel experience, customized trip planner, customized holiday packages, customized packages in computer, honeymoon travel packages, personalized travel package, best places in ${props.Data.name}, places to visit in ${props.Data.name}, best activities in ${props.Data.name}, things to do in ${props.Data.name}, package for ${props.Data.name}, top places in ${props.Data.name}, wanderlog, inspirock, tripit, hotels, flights, activities, transfers, solo travel, family travel,`
          }
        ></meta>

        <link
          rel="canonical"
          href={`https://thetarzanway.com/theme/${props.slug}`}
        ></link>
      </Head>

      <ThemePage
        themePage
        experienceData={props.Data}
        slug={props.slug}
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
      hotLocationSearch,
      slug,
    },
  };
}

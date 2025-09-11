import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { connect } from "react-redux";

import ThemePage from "../../containers/travelplanner/ThemePage";
import Layout from "../../components/Layout";
import { axiosPageInstance } from "../../services/pages/travel-planner";
import { axiosPageList } from "../../services/pages/list";
import axioslocationsinstance from "../../services/search/search";
import setHotLocationSearch from "../../store/actions/hotLocationSearch";

const TravelPlanner = ({
  Data,
  hotLocationSearch,
  slug,
  setHotLocationSearch,
}) => {
  // const router = useRouter();
  // const [Data, setData] = useState(null);
  // const [hotLocationSearch, sethotLocationSearch] = useState([]);
  // const [slug, setSlug] = useState(null);

  // useEffect(() => {
  //   if (router.query.slug) {
  //     setSlug(router.query.slug);
  //   }
  // }, [router]);

  // useEffect(() => {
  //   fetchData();
  // }, [slug]);

  useEffect(() => {
    setHotLocationSearch(hotLocationSearch);
  }, [hotLocationSearch]);

  const fetchData = async () => {
    if (slug) {
      try {
        const res = await axiosPageInstance.get(`/${slug}/`);
        if (res?.data?.success) {
          setData(res.data.data);
        } else {
          router.replace("/404"); // Redirect to 404 if data is not found
          return;
        }
      } catch (err) {
        console.error(`[ERROR][getStaticProps:slug:${slug}]: `, err.message);
        router.replace("/404"); // Redirect to 404 if data is not found
        return;
      }

      try {
        const hotDestRes = await axioslocationsinstance.get(
          `hot_destinations/?state=${slug}/`
        );
        if (hotDestRes?.data?.length) {
          sethotLocationSearch(hotDestRes.data);
        }
      } catch (err) {
        console.error(
          `[ERROR][ThemePage][axioslocationsinstance:/hot_destinations/?state=${slug}/]: `,
          err.message
        );
      }
    }
  };

  if (!Data) return null;

  return (
    <Layout
      page_id={Data.id}
      destination={Data.name}
      page={"Theme Page"}
      slug={slug}
    >
      <Head>
        <title>
          {Data.social_share_title
            ? Data.social_share_title
            : "Plan Your Trip to  | Trip Planner & Itinerary | The Tarzan Way"}
        </title>
        <meta
          name="description"
          content={
            Data.meta_description
              ? Data.meta_description
              : `Plan your dream trip to ${Data.name} with The Tarzan Way's AI itinerary. Explore top attractions, local cuisine, and book your flights, accommodations, and transfers all in one go ${Data.destination}.`
          }
        ></meta>
        <meta
          property="og:title"
          content={
            Data.social_share_title
              ? Data.social_share_title
              : `Plan Your Trip to ${Data.name} | Trip Planner & Itinerary | The Tarzan Way`
          }
        />
        <meta
          property="og:description"
          content={
            Data.meta_description
              ? Data.meta_description
              : `Plan your dream trip to ${Data.name} with The Tarzan Way's AI itinerary. Explore top attractions, local cuisine, and book your flights, accommodations, and transfers all in one go ${Data.name}.`
          }
        />
        <meta property="og:image" content="/logoblack.svg" />
        <meta
          property="keywords"
          content={
            Data.meta_keywords
              ? Data.meta_keywords
              : `${Data.name} trip planner, ai trip planner, trip planner, itinerary, travel plan, ai itinerary, ai plan, craft a trip, travel in ${Data.name}, ${Data.name} tour package, experience ${Data.name} culture, ${Data.name} holiday package, local travel experience, customized trip planner, customized holiday packages, customized packages in computer, honeymoon travel packages, personalized travel package, best places in ${Data.name}, places to visit in ${Data.name}, best activities in ${Data.name}, things to do in ${Data.name}, package for ${Data.name}, top places in ${Data.name}, wanderlog, inspirock, tripit, hotels, flights, activities, transfers, solo travel, family travel,`
          }
        ></meta>

        <link
          rel="canonical"
          href={`https://thetarzanway.com/theme/${slug}`}
        ></link>
      </Head>

      <ThemePage themePage experienceData={Data} slug={slug}></ThemePage>
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
  let hotLocationSearch = [];

  try {
    const res = await axiosPageInstance.get(`/${slug}`);
    if (res?.data?.success) {
      data = res.data.data;
    }
  } catch (err) {
    console.error(`[ERROR][getStaticProps:slug:${slug}]: `, err.message);
  }

  try {
    const hotDestRes = await axioslocationsinstance.get(
      `hot_destinations/?state=${slug}/`
    );
    if (hotDestRes?.data?.length) {
      hotLocationSearch = hotDestRes.data;
    }
  } catch (err) {
    console.error(
      `[ERROR][ThemePage][axioslocationsinstance:/hot_destinations/?state=${slug}/]: `,
      err.message
    );
  }

  if (!data) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      Data: data,
      hotLocationSearch,
      slug,
    },
  };
}

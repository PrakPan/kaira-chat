import Head from "next/head";
import Layout from "../components/Layout";
import { useState, useEffect } from "react";
import ContinentPage from "../containers/continent/Index";
import axioscountrydetailsinstance from "../services/pages/country";
import axiospagelistinstance from '../services/pages/list'
import axiospagedetailsinstance from '../services/pages/pagedetails'
import axios from "axios";
const TravelPlanner = (props) => {
  const [data, setData] = useState({
    page_title: null,
    meta_description: null,
    social_media_description: null,
    meta_keywords: null,
    social_share_title: null,
  });
  useEffect(() => {
    // setData(DATA);
  }, []);

  return (
    <Layout destination={props.Data.destination} id={props.Data.id}>
      <Head>
        <title>{props.Data.page_title}</title>
        <meta name="description" content={props.Data.short_description}></meta>
        <meta property="og:title" content={props.Data.page_title} />
        <meta property="og:description" content={props.Data.overview_text} />
        <meta property="og:image" content="/logoblack.svg" />
        <meta property="keywords" content={props.Data.meta_keywords}></meta>
      </Head>
      <ContinentPage
        contientTheme={props.contientTheme}
        data={props.Data}
        locations={props.locations}
        continetCarousel={props.continetCarousel}
      ></ContinentPage>
    </Layout>
  );
};

export async function getStaticPaths() {

  // const res = await axios.get(
  //   "https://apis.tarzanway.com/page/list?page_type=Continents"
  // );
const res = await axiospagelistinstance("?page_type=Continents");
  const data = res.data;
  let paths = [];
  for (var i = 0; i < data.length; i++) {
    // const pathArr = data[i].path.split("/");
    // var [continentSlug, countrySlug, stateSlug] = pathArr;
    paths.push({
      params: {
        continent: data[i].path,
      },
    });
  }

  return {
    paths: paths,
    fallback: "blocking",
  };
}
export async function getStaticProps(context) {
  const res = await axiospagedetailsinstance(
    "?link=" + context.params.continent
  );
  const data = res.data;
  const themeData = await axiospagelistinstance("?page_type=Continents");
  const contientTheme = themeData.data;

  // contient carousel :-
  // const continentData = await axiospagelistinstance("?page_type=Continents");
  const continetCarousel = [];
  for (let i = 0; i < contientTheme.length; i++) {
    const hot_destinations = await axioscountrydetailsinstance(
      `/all?continent=${contientTheme[i].destination}&hot_destinations=true`
    );
    const hot_data = hot_destinations.data.filter((e, i) => {
      if (i < 6) return e;
    });
    continetCarousel.push({ ...contientTheme[i], hot_destinations: hot_data });
  }

  const response = await axioscountrydetailsinstance(
    "/all?continent=" + data.destination
  );
  const locations = response.data;
  if (!data) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      Data: data,
      locations,
      contientTheme,
      continetCarousel,
    },
  };
}

export default TravelPlanner;

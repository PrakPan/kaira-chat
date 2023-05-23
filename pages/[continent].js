import Head from "next/head";
import Layout from "../components/Layout";
import { useState, useEffect } from "react";
import ContinentPage from "../containers/continent/Index";
import axioscountrydetailsinstance from "../services/pages/country";
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
      <ContinentPage data={props.Data} locations={props.locations}></ContinentPage>
    </Layout>
  );
};

export async function getStaticPaths() {

  const res = await axios.get(
    "https://apis.tarzanway.com/page/list?page_type=Continents"
  );
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

  // const res = await axios.get(
  //   `https://apis.tarzanway.com/poi/country/${context.params.country}`
  // );
  const res = await axiospagedetailsinstance('?link=' + context.params.continent);
  const data = res.data;

  // const response = await axios.get(
    // "https://apis.tarzanway.com/poi/country/all"
  // );
const response = await axioscountrydetailsinstance("/all?continent=" + context.params.continent);
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
    },
  };
}

export default TravelPlanner;

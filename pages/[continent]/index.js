import Head from "next/head";
import Layout from "../../components/Layout";
import { useState, useEffect } from "react";
import ContinentPage from "../../containers/continent/Index";
import axioscountrydetailsinstance from "../../services/pages/country";
import axiospagelistinstance from "../../services/pages/list";
import axiospagedetailsinstance from "../../services/pages/pagedetails";

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
    <Layout destination={props.Data.destination} id={props.Data.id} page='Continent Page'>
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
  const res = await axiospagelistinstance("/?page_type=Continent&fields=path");
  const data = res.data;
  let paths = [];
  for (var i = 0; i < data.length; i++) {
    paths.push({
      params: {
        continent: data[i].path,
      },
    });
  }

  return {
    paths: paths,
    fallback: false,
  };
}
export async function getStaticProps(context) {
  let data = null;
  let contientTheme = [];
  let locations = [];
  const continetCarousel = [];

  try {
    const res = await axiospagedetailsinstance(
      "/?link=" + context.params.continent
    );
    data = res.data;
  } catch (err) {
    console.error('[ERROR][continentpage:getStaticProps]: ', err.message);
  }

  if (!data) {
    return {
      notFound: true,
    };
  }

  try {
    const themeData = await axiospagelistinstance(
      "/?page_type=Continent&fields=destination,tagline,image,path"
    );
    contientTheme = themeData.data;
  } catch (err) {
    console.error(err.message);
  }

  try {
    for (let i = 0; i < contientTheme.length; i++) {
      const countrydetailsResponse = await axioscountrydetailsinstance(
        `/all/?continent=${contientTheme[i].destination}&fields=id,name,path,tagline,image,is_hot_location`
      );

      if (contientTheme[i].destination === data.destination) {
        locations = countrydetailsResponse.data;
      }

      let hot_data = countrydetailsResponse.data.filter(
        (d) => d.is_hot_location
      );
      hot_data = hot_data.slice(0, 6);

      continetCarousel.push({
        ...contientTheme[i],
        hot_destinations: hot_data,
      });
    }
  } catch (err) {
    console.error('[ERROR][continentpage:getStaticPaths]: ', err.message);
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

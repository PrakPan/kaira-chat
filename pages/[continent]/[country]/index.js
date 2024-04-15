import Head from "next/head";
import Layout from "../../../components/Layout";
import { useState, useEffect } from "react";
import CountryPage from "../../../containers/country/Index";
import axioscountrydetailsinstance from "../../../services/pages/country";
import axiospagelistinstance from "../../../services/pages/list";

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
    <Layout
      destination={props?.Data?.name}
      id={props?.Data?.id}
      page={"Country Page"}
    >
      <Head>
        <title>
          {/* {props.Data.name + " | Travel Guide |  The Tarzan Way"} */}
          {props?.Data?.name} | Trip Planner & Itinerary | The Tarzan Way
        </title>
        <meta
          name="description"
          // content={props.Data.short_description}
          content={`Discover ${props?.Data?.name} with The Tarzan Way's AI Trip Planner. Book your flights, accommodations, and transfers all in one go and discover must-visit destinations for an extraordinary journey.`}
        ></meta>
        <meta
          property="og:title"
          content={
            props?.Data?.name + " | Trip Planner & Itinerary | The Tarzan Way"
          }
        />
        <meta
          property="og:description"
          // content={props.Data.short_description}
          content={`Discover ${props?.Data?.name} with The Tarzan Way's AI Trip Planner. Book your flights, accommodations, and transfers all in one go and discover must-visit destinations for an extraordinary journey.`}
        />
        <meta property="og:image" content="/logoblack.svg" />
        <meta property="keywords" content={props?.Data?.meta_keywords}></meta>
      </Head>
      <CountryPage
        continetCarousel={props?.continetCarousel}
        data={props?.Data}
        locations={props?.locations}
      ></CountryPage>
    </Layout>
  );
};

export async function getStaticPaths() {
  let paths = [];
  try {
    const res = await axioscountrydetailsinstance.get("all/?fields=path");
    const data = res.data;
    for (var i = 0; i < data.length; i++) {
      const pathArr = data[i].path.split("/");
      var [continentSlug, countrySlug] = pathArr;
      paths.push({
        params: {
          continent: continentSlug,
          country: countrySlug,
          // state: stateSlug,
        },
      });
    }
  } catch (err) {
    console.error("[ERROR][country:getStaticPaths]: ", err.message);
  }

  return {
    paths: paths,
    fallback: false,
  };
}
export async function getStaticProps(context) {
  let data = null;
  let locations = [];
  const continetCarousel = [];
  try {
    const res = await axioscountrydetailsinstance.get(
      `${context.params.country}/`
    );
    data = res.data;

    if (!data) {
      return {
        notFound: true,
      };
    }

    const continentData = await axiospagelistinstance(
      "/?page_type=Continent&fields=destination,tagline,image,path"
    );
    for (let i = 0; i < continentData.data.length; i++) {
      const countrydetailsResponse = await axioscountrydetailsinstance(
        `/all/?continent=${continentData.data[i].destination}&fields=id,name,path,tagline,image,is_hot_location`
      );

      if (continentData.data[i].destination === data.continent) {
        locations = countrydetailsResponse.data;
      }

      let hot_data = countrydetailsResponse.data.filter(
        (d) => d.is_hot_location
      );
      hot_data = hot_data.slice(0, 6);

      continetCarousel.push({
        ...continentData.data[i],
        hot_destinations: hot_data,
      });
    }
  } catch (err) {
    console.error("[ERROR][countrypage:getStaticProps]: ", err.message);
  }

  return {
    props: {
      Data: data,
      locations,
      continetCarousel,
    },
  };
}

export default TravelPlanner;

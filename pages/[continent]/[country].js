import Head from "next/head";
import Layout from "../../components/Layout";
import { useState, useEffect } from "react";
import CountryPage from '../../containers/contry/Index';
import axioscountrydetailsinstance from '../../services/pages/country'
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
    <Layout destination={props.Data.name} id={props.Data.id}>
      <Head>
        <title>{props.Data.name + " | Travel Guide |  The Tarzan Way"}</title>
        <meta name="description" content={props.Data.short_description}></meta>
        <meta
          property="og:title"
          content={props.Data.name + " | Travel Guide |  The Tarzan Way"}
        />
        <meta
          property="og:description"
          content={props.Data.short_description}
        />
        <meta property="og:image" content="/logoblack.svg" />
        <meta property="keywords" content={props.Data.meta_keywords}></meta>
      </Head>
      {/* <LadakhContainer
        experienceData={props.Data}
        locations={props.locations}
      ></LadakhContainer> */}
      <CountryPage data={props.Data} locations={props.locations}></CountryPage>
    </Layout>
  );
};

export async function getStaticPaths() {
  //     const res = await fetch(`https://apis.tarzanway.com/page/list?country=india`)
  //     const data = await res.json();
  // const res = await axiosTravelPlannerInstance.get('/list')
  // const data = res.data

  // const res = await axiossearchallinstance.get('?type=State')
  // const res = await axios.get(
  //   "https://apis.tarzanway.com/search/all/?type=State"
  // );

  const res = await axioscountrydetailsinstance.get("all");
  const data = res.data;
  let paths = [];
  for (var i = 0; i < data.length; i++) {
    const pathArr = data[i].path.split("/");
    var [continentSlug, countrySlug, stateSlug] = pathArr;
      paths.push({
        params: {
          continent: continentSlug,
          country: countrySlug,
          // state: stateSlug,
        },
      });
  }

  return {
    paths: paths,
    fallback: "blocking",
  };
}
export async function getStaticProps(context) {
  //     const res = await fetch(`https://apis.tarzanway.com/page/?link=`+context.params.link)
  //     const data = await res.json()
  // const res = await axiosTravelPlannerInstance.get(
  //   `/?link=${context.params.state}`
  // );

  const res = await await axioscountrydetailsinstance.get(
    context.params.country
  );
    const data = res.data;

  const response = await axioscountrydetailsinstance.get("all");
  const locations = response.data

  // var locations = [];
  // var country = "India";
  // if (data.ancestors) {
  //   if (
  //     data.ancestors.length &&
  //     data.ancestors[0].level == "Country" &&
  //     data.ancestors[0].name
  //   ) {
  //     country = data.ancestors[0].name;
  //   }
  // }
  // try {
  //   const loc = await axiospagelistinstance.get(`/?country=${country}`);
  //   locations = loc.data;
  // } catch (e) {
  //   locations = [];
  // }
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

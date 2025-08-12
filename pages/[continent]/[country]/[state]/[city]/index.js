import { useRouter } from "next/router";
import Head from "next/head";
import { connect } from "react-redux";
import { useEffect } from "react";
import CityPage from "../../../../../containers/city/Index";
import Layout from "../../../../../components/Layout";
import axiosReccommendedCityInstance from "../../../../../services/poi/reccommededcities";
import axioslocationsinstance from "../../../../../services/search/search";
import setHotLocationSearch from "../../../../../store/actions/hotLocationSearch";
import {  MERCURY_HOST } from "../../../../../services/constants";
import axios from "axios";
import * as PagesToIdMapping from "../../../../../data/PagesToIdMapping.json"
const Experience = (props) => {
  console.log("experience props are:",props)
  const router = useRouter();
  if (router.isFallback) {
    return <div>Loading...</div>; // fallback loading UI
  }
  useEffect(() => {
    props.setHotLocationSearch(props.hotLocationSearch);
  }, []);

  const schemaData = {
    "@context": "https://schema.org/",
    "@type": "item",
    name: props.cityData.name,
    description: props.cityData.short_description,
  };

  return (
    <Layout
      destination={props.cityData.name}
      id={props.cityData.id}
      page={"City Page"}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      ></script>
      <Head>
        <meta
          name="description"
          content={`${props.cityData.meta_description}`}
        />
        <meta
          property="og:title"
          content={`${props.cityData.social_share_title}`}
        />
        <meta
          property="og:description"
          content={`${props.cityData.meta_description}`}
        />
        <meta property="og:image" content="/logoblack.svg" />
        <title>
          Plan Your Trip to {props.cityData.name} | Trip Planner & Itinerary |
          The Tarzan Way
        </title>
        <meta
          property="keywords"
          content={`${Array.isArray(props?.cityData?.meta_keywords)
            ? props?.cityData?.meta_keywords.join(", ")
            : props?.cityData?.meta_keywords}`}
        ></meta>

        <link
          rel="canonical"
          href={`https://thetarzanway.com/${props.path}`}
        ></link>
      </Head>

      <CityPage
        reccomendedCitiesData={props.reccomendedCitiesData}
        cityData={props.cityData}
        id={router.query.city}
        page_id={props.page_id}
        type={props?.Type}
      ></CityPage>
    </Layout>
  );
};

export async function getStaticPaths() {
  let paths = [];

  try {
    //mercury api
    const res = await axios.get(
      `${MERCURY_HOST}/api/v1/geos/search/all/?type=City`
    );

    let data = res.data;

    for (var i = 0; i < data.length; i++) {
      const pathArr = data[i].path.split("/");
      var [continentSlug, countrySlug, stateSlug, citySlug] = pathArr;
      if (data[i]) {
        paths.push({
          params: {
            continent: continentSlug,
            country: countrySlug,
            state: stateSlug,
            city: citySlug,
          }
        });
      }
    }
  } catch (err) {
    console.log(
      "[ERROR][cityPage:axiossearchInstance][/?type=Location&fields=path,cta]: ",
      err.message
    );
  }

  return {
    paths: paths,
    fallback: false,
  };
}

export async function getStaticProps(context){
  const { continent, country, state, city } = context.params;
  const path = `${continent}/${country}/${state}/${city}`;
  let Id=PagesToIdMapping[path]!=undefined?PagesToIdMapping[path]:""
  let Type="City"
  let data
  let reccomendedCitiesData
  let hotLocationSearch=[]

  //mercury api
  await axios.get(`${MERCURY_HOST}/api/v1/geos/city/${Id}/`).then((res)=>{
    data= res.data.data.city
  }).catch((err)=>{
    console.error(
      `[ERROR][cityPage:axiosPoiCityInstance][/?slug=${context.params.city}]: `,
      err.message
    );
    return null
  })

 // mercury api
 await axiosReccommendedCityInstance.get(`/?city_id=${Id}`)
  .then((res) => {
    const reccoData = res.data?.data ?? [];

    reccomendedCitiesData = Array.isArray(reccoData)
      ? reccoData.map((e) => ({
          id: e?.id ?? null,
          image: e?.image ?? null,
          lat: e?.latitude ?? null,
          long: e?.longitude ?? null,
          most_popular_for: Array.isArray(e?.most_popular_for) ? e.most_popular_for : [],
          name: e?.name ?? "",
          path: e?.path ?? "",
          budget: e?.budget ?? null,
        }))
      : [];
  })
  .catch((err) => {
    console.error(
      `[ERROR][cityPage:axiosReccommendedCityInstance][/?city_id=${Id}]: `,
      err.message
    );
    reccomendedCitiesData = [];
  });


  //mercury api
  await axioslocationsinstance.get(
    `hot_destinations/?state=${state}`
  ).then((response)=>{

    if (response.data?.length) {

      hotLocationSearch= response.data;
    }
  }).catch((err)=>{
    console.log(
      `[ERROR][CityPage][axioslocationsinstance:/hot_destinations/?state=${state}/]`
    );
    return []
  })

  if (!data) {
    console.log("here")
    return {
      notFound: true,
    };
  }

  console.log("data :",data.name)
  return {
    props: {
      cityData: data,
      reccomendedCitiesData,
      path,
      hotLocationSearch,
      page_id:Id,
      Type
    },
  };
}

// export async function getStaticProps(context) {
//   console.log("start:",new Date())
//   let reccomendedCitiesData = [];
//   let data = null;
//   let hotLocationSearch = [];
//   let Id=""
//   let Type="Country"
//   const { continent, country, state, city } = context.params;
//   const path = `${continent}/${country}/${state}/${city}`;

//   try{
//     const res=await axios.get(`${MERCURY_HOST}/api/v1/geos/pages/all/?path=${path}`)
//     if (res?.data?.path){
//     Id=res?.data?.path?.id
//     Type=res?.data?.path?.type
//     }
//   } catch(err){

//   }

//   try {
//     const res = await axios.get(`${CONTENT_SERVER_HOST}/poi/city/?slug=${context.params.city}`);
//     data = res.data;
//   } catch (err) {
//     console.error(
//       `[ERROR][cityPage:axiosPoiCityInstance][/?slug=${context.params.city}]: `,
//       err.message
//     );
//   }

//   if (!data) {
//     return {
//       notFound: true,
//     };
//   }

//   try {
//     const resp = await axiosReccommendedCityInstance.get(
//       `/?slug=${context.params.city}&limit=6`
//     );

//     const reccoData = resp.data;
//     reccomendedCitiesData = reccoData.map((e) => ({
//       id: e.id,
//       image: e.image,
//       lat: e.lat,
//       long: e.long,
//       most_popular_for: e.most_popular_for,
//       name: e.name,
//       path: e.path,
//       budget: e.budget,
//     }));
//   } catch (err) {
//     console.error(
//       `[ERROR][cityPage:axiosReccommendedCityInstance][/?slug=${context.params.city}&limit=6]: `,
//       err.message
//     );
//   }

//   try {
//     const response = await axioslocationsinstance.get(
//       `hot_destinations/?state=${state}/`
//     );
//     if (response.data?.length) {
//       hotLocationSearch = response.data;
//     }
//   } catch (err) {
//     console.log(
//       `[ERROR][CityPage][axioslocationsinstance:/hot_destinations/?state=${state}/]`
//     );
//   }
//   console.log("end:",new Date())

//   return {
//     props: {
//       cityData: data,
//       reccomendedCitiesData,
//       path,
//       hotLocationSearch,
//       page_id:Id,
//       Type
//     },
//   };
// }

const mapDispatchToProps = (dispatch) => {
  return {
    setHotLocationSearch: (payload) => dispatch(setHotLocationSearch(payload)),
  };
};

export default connect(null, mapDispatchToProps)(Experience);

import Head from "next/head";
import { connect } from "react-redux";
import { useEffect } from "react";
import Layout from "../../../components/Layout";
import CountryPage from "../../../containers/country/Index";
import axioscountrydetailsinstance, {
  getCountryPaths,
} from "../../../services/pages/country";
import axiospagelistinstance from "../../../services/pages/list";
import axioslocationsinstance from "../../../services/search/search";
import setHotLocationSearch from "../../../store/actions/hotLocationSearch";
import axios from "axios";
import { MERCURY_HOST } from "../../../services/constants";
import * as PagesToIdMapping from "../../../public/PagesToIdMapping.json";

const TravelPlanner = (props) => {
  useEffect(() => {
    props.setHotLocationSearch(props.hotLocationSearch);
  }, []);

  return (
    <Layout
      destination={props?.Data?.name}
      id={props?.Data?.id}
      page={"Country Page"}
    >
      <Head>
        <title>
          {props?.Data?.name} | Trip Planner & Itinerary | The Tarzan Way
        </title>
        <meta
          name="description"
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
          content={`Discover ${props?.Data?.name} with The Tarzan Way's AI Trip Planner. Book your flights, accommodations, and transfers all in one go and discover must-visit destinations for an extraordinary journey.`}
        />
        <meta property="og:image" content="/logoblack.svg" />
        <meta
          property="keywords"
          content={`${props?.Data?.name} trip planner, ai trip planner, trip planner, itinerary, travel plan, ai itinerary, ai plan, craft a trip, travel in ${props?.Data?.name}, ${props?.Data?.name} tour package, experience ${props?.Data?.name} culture, ${props?.Data?.name} holiday package, local travel experience, customized trip planner, customized holiday packages, customized packages in computer, honeymoon travel packages, personalized travel package, best places in ${props?.Data?.name}, places to visit in ${props?.Data?.name}, best activities in ${props?.Data?.name}, things to do in ${props?.Data?.name}, package for ${props?.Data?.name}, top places in ${props?.Data?.name}, wanderlog, inspirock, tripit, hotels, flights, activities, transfers, solo travel, family travel,`}
        ></meta>

        <link
          rel="canonical"
          href={`https://thetarzanway.com/${props.path}`}
        ></link>
      </Head>

      <CountryPage
        continetCarousel={props?.continetCarousel}
        data={props?.Data}
        locations={props?.locations}
        page_id={props.page_id || ""}
        type={props?.Type}
      ></CountryPage>
    </Layout>
  );
};

export async function getStaticPaths() {
  let paths = [];
  try {
    const res = await getCountryPaths.get(
      `${MERCURY_HOST}/api/v1/geos/search/all/?type=Country`
    );
    const data = res.data;
    for (var i = 0; i < data.length; i++) {
      const pathArr = data[i].path.split("/");
      var [continentSlug, countrySlug] = pathArr;
      paths.push({
        params: {
          continent: continentSlug,
          country: countrySlug,
        },
      });
    }
  } catch (err) {
    console.error("[ERROR][countryPage:getStaticPaths]: ", err.message);
  }

  return {
    paths: paths,
    fallback: false,
  };
}

// export async function getStaticProps(context) {
//   let data = null;
//   let locations = [];
//   let continetCarousel = [];
//   let hotLocationSearch = [];
//   let Type = "Country";
//   const { continent, country } = context.params;
//   const path = `${continent}/${country}`;
//   let pageId = PagesToIdMapping[path]!=undefined?PagesToIdMapping[path]:"";

//   try {
//     const [countryRes, continentRes, hotDestRes] = await Promise.all([
//       axioscountrydetailsinstance.get(      `${MERCURY_HOST}/api/v1/geos/search/all/?type=Country`      ),
//       axiospagelistinstance.get("/?page_type=Continent&fields=destination,tagline,image,path"),
//       axioslocationsinstance.get(`hot_destinations/?country=${country}/`)
//     ]);

//     data = countryRes.data;
//     console.log("data is:",data)
//     if (!data) {
//       return {
//         notFound: true,
//       };
//     }
//     locations = data.see_also;

//     if (hotDestRes?.data?.length) {
//       hotLocationSearch = hotDestRes.data;
//     }

//     const continentData = continentRes.data;
//     const continentPromises = continentData.map(async (cont) => {
//       const resp = await axioscountrydetailsinstance.get(
//         `/all/?continent=${cont.destination}&fields=id,name,path,tagline,image,is_hot_location,best_time`
//       );
//       const hot_data = resp.data.filter((d) => d.is_hot_location).slice(0, 6);
//       return {
//         ...cont,
//         hot_destinations: hot_data,
//       };
//     });

//     continetCarousel = await Promise.all(continentPromises);

//   } catch (err) {
//     console.error("[ERROR][countryPage:getStaticProps]: ", err.message);
//   }

//   return {
//     props: {
//       Data: data,
//       locations,
//       continetCarousel,
//       path,
//       hotLocationSearch,
//       page_id:PagesToIdMapping[path]!=undefined?PagesToIdMapping[path]:"",
//       Type,
//     },
//   };
// }

export async function getStaticProps(context) {
  let data = null;
  let locations = [];
  const continetCarousel = [];
  let hotLocationSearch = [];
  let Type = "Country";
  const { continent, country } = context.params;
  const path = `${continent}/${country}`;
  let pageId = PagesToIdMapping[path]!=undefined?PagesToIdMapping[path]:"";


  try {
    //dev api
    const res = await axios.get(
      `${MERCURY_HOST}/api/v1/geos/search/all/?type=Country`
    );
    data = res.data;
    console.log('data is:', data)
    locations = data?.see_also || [];

    if (!data) {
      return {
        notFound: true,
      };
    }

    //add in api
    const continentData = await axiospagelistinstance.get(
      "/?page_type=Continent&fields=destination,tagline,image,path"
    );
    for (let i = 0; i < continentData.data.length; i++) {
      const countrydetailsResponse = await axioscountrydetailsinstance(
        `/all/?continent=${continentData.data[i].destination}&fields=id,name,path,tagline,image,is_hot_location,best_time`
      );

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
    console.error("[ERROR][countryPage:getStaticProps]: ", err.message);
  }

  try {
    //dev api
    const response = await axioslocationsinstance.get(
      `hot_destinations/?country=${country}/`
    );
    if (response.data?.length) {
      hotLocationSearch = response.data;
    }
  } catch (err) {
    console.log(
      `[ERROR][CountryPage][axioslocationsinstance:/hot_destinations/?continent=${continent}/]`
    );
  }

  return {
    props: {
      Data: data,
      locations,
      continetCarousel,
      path,
      hotLocationSearch,
      page_id: PagesToIdMapping[path],
      Type,
    },
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setHotLocationSearch: (payload) => dispatch(setHotLocationSearch(payload)),
  };
};

export default connect(null, mapDispatchToProps)(TravelPlanner);

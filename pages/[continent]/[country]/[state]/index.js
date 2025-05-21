import Head from "next/head";
import { useEffect } from "react";
import { connect } from "react-redux";
import StatePage from "../../../../containers/travelplanner/Index";
import Layout from "../../../../components/Layout";
import axiosTravelPlannerInstance from "../../../../services/pages/travel-planner";
import axiossearchallinstance from "../../../../services/search/all";
import axiospagelistinstance from "../../../../services/pages/list";
import axioslocationsinstance from "../../../../services/search/search";
import setHotLocationSearch from "../../../../store/actions/hotLocationSearch";
import axios from "axios";
import { MERCURY_HOST } from "../../../../services/constants";
import * as PagesToIdMapping from "../../../../public/PagesToIdMapping.json"

const TravelPlanner = (props) => {
  useEffect(() => {
    props.setHotLocationSearch(props.hotLocationSearch);
  }, []);

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
          content={`${props.Data.meta_description}`}
        ></meta>
        <meta
          property="og:title"
          content={`${props.Data.social_share_title}`}
        />
        <meta
          property="og:description"
          content={`${props.Data.meta_description}`}
        />
        <meta property="og:image" content="/logoblack.svg" />
        <meta
          property="keywords"
          content={`${
            Array.isArray(props?.Data?.meta_keywords)
              ? props?.Data?.meta_keywords.join(", ")
              : props?.Data?.meta_keywords
          }`}
        ></meta>

        <link
          rel="canonical"
          href={`https://thetarzanway.com/${props.path}`}
        ></link>
      </Head>

      <StatePage
        experienceData={props.Data}
        locations={props.locations}
        page_id={props.page_id || ""}
        type={props?.Type}
      ></StatePage>
    </Layout>
  );
};

export async function getStaticPaths() {
  let paths = [];

  try {
    const res = await axiossearchallinstance.get("/all/");
    const data = res.data;

    const allPaths = [...data];

    for (var i = 0; i < allPaths.length; i++) {
      const pathArr = allPaths[i].path.split("/");
      var [continentSlug, countrySlug, stateSlug] = pathArr;
      paths.push({
        params: {
          continent: continentSlug,
          country: countrySlug.toLowerCase().replace(/ /g, "_"),
          state: stateSlug,
        },
      });
    }
  } catch (err) {
    console.error(
      "[ERROR][statePage:axiossearchallinstance][/?type=State&fields=path]: ",
      err.message
    );
  }

  return {
    paths: paths,
    fallback: false,
  };
}

export async function getStaticProps(context) {
  const { continent, country, state } = context.params;
  const path = `${continent}/${country}/${state}`;

  let data = null;
  let locations = [];
  let hotLocationSearch = [];
  let Type = "State";


  const dataPromise = axiosTravelPlannerInstance
    .get(`/?link=${state}`)
    .then(res => {
      data = res.data;
    })
    .catch(err => {
      console.log(`[ERROR][statePage:axiosTravelPlannerInstance][${state}]: `, err.message);
    });

  const locationsPromise = axiospagelistinstance
    .get(`/?country=${country}&page_type=Destination&fields=id,ancestors,path,destination,name,tagline,image,link,budget`)
    .then(res => {
      locations = res.data;
    })
    .catch(err => {
      console.log(`[ERROR][statePage:axiospagelistinstance][${country}]: `, err.message);
    });

  const hotLocationPromise = axioslocationsinstance
    .get(`hot_destinations/?state=${state}/`)
    .then(res => {
      if (res.data?.length) {
        hotLocationSearch = res.data;
      }
    })
    .catch(err => {
      console.log(`[ERROR][StatePage][axioslocationsinstance:/hot_destinations/?state=${state}/]`, err.message);
    });

  await Promise.all([ dataPromise, locationsPromise, hotLocationPromise]);

  if (!data) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      Data: data,
      locations,
      path,
      hotLocationSearch,
      page_id: PagesToIdMapping[path],
      Type,
    },
  };
}


// export async function getStaticProps(context) {
//   var locations = [];
//   let data = null;
//   let hotLocationSearch = [];
//   let pageId = "";
//   let Type = "Country";
//   console.log("start date:",new Date())
//   const { continent, country, state } = context.params;
//   const path = `${continent}/${country}/${state}`;
//   try {
//     const res = await axios.get(
//       `${MERCURY_HOST}/api/v1/geos/pages/all/?path=${path}`
//     );
//     if (res?.data?.path) {
//       pageId = res?.data?.path?.id;
//       Type = res.data.path.type;
//     }
//   } catch (err) {
//     console.error("Path api error:", err);
//   }

//   try {
//     const res = await axiosTravelPlannerInstance.get(
//       `/?link=${context.params.state}`
//     );
//     data = res.data;
//   } catch (err) {
//     console.log(
//       `[ERROR][statePage:axiosTravelPlannerInstance][${context.params.state}]: `,
//       err.message
//     );
//   }

//   if (!data) {
//     return {
//       notFound: true,
//     };
//   }

//   try {
//     const loc = await axiospagelistinstance.get(
//       `/?country=${context.params.country}&page_type=Destination&fields=id,ancestors,path,destination,name,tagline,image,link,budget`
//     );
//     locations = loc.data;
//   } catch (err) {
//     console.log(
//       `[ERROR][statePage:axiospagelistinstance][${context.params.country}]: `,
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
//       `[ERROR][StatePage][axioslocationsinstance:/hot_destinations/?state=${state}/]`,
//       err.message
//     );
//   }
//   console.log("end date:",new Date())

//   return {
//     props: {
//       Data: data,
//       locations,
//       path,
//       hotLocationSearch,
//       page_id: pageId,
//       Type,
//     },
//   };
// }

const mapDispatchToProps = (dispatch) => {
  return {
    setHotLocationSearch: (payload) => dispatch(setHotLocationSearch(payload)),
  };
};

export default connect(null, mapDispatchToProps)(TravelPlanner);

import Head from "next/head";
import Layout from "../../../components/Layout";
import CountryPageWrapper from "../../../components/country/CountryPageWrapper";
import axioscountrydetailsinstance, {
  getCountryPaths,
} from "../../../services/pages/country";
import axiospagelistinstance from "../../../services/pages/list";
import axioslocationsinstance from "../../../services/search/search";
import axios from "axios";
import { MERCURY_HOST } from "../../../services/constants";
import * as PagesToIdMapping from "../../../data/PagesToIdMapping.json";

const TravelPlanner = (props) => {
  const pageTitle = props.pageTitle || `${props?.Data?.name || 'Travel'} | Trip Planner & Itinerary | The Tarzan Way`;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta
          name="description"
          content={`Discover ${props?.Data?.name} with The Tarzan Way's AI Trip Planner. Book your flights, accommodations, and transfers all in one go and discover must-visit destinations for an extraordinary journey.`}
        />
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
        />
        <link
          rel="canonical"
          href={`https://thetarzanway.com/${props.path}`}
        />
      </Head>
      <Layout
        destination={props?.Data?.name}
        id={props?.Data?.id}
        page={"Country Page"}
      >
        <CountryPageWrapper
          continetCarousel={props?.continetCarousel}
          data={props?.Data}
          locations={props?.locations}
          page_id={props.page_id || ""}
          type={props?.Type}
          pageData={props.pageData}
          hotLocationSearch={props.hotLocationSearch}
        />
      </Layout>
    </>
  );
};

export async function getStaticPaths() {
  let paths = [];
  try {
    //mercury api
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
    fallback: false
  };
}

export async function getStaticProps(context) {
  let data = null;
  let locations = [];
  const continetCarousel = [];
  let hotLocationSearch = [];
  let Type = "Country";
  const { continent, country } = context.params;
  const path = `${continent}/${country}`;
  let pageId = PagesToIdMapping[path] !== undefined ? PagesToIdMapping[path] : "";

  let isThemePage = false;
  let pageTitle = `${country.charAt(0).toUpperCase() + country.slice(1)} | Trip Planner & Itinerary | The Tarzan Way`;

  try {
    // Fetch country data
    const res = await axios.get(`${MERCURY_HOST}/api/v1/geos/country/${pageId}`);
    data = res.data.data.country;
    
    // Update pageTitle with actual country name if available
    if (data?.name) {
      pageTitle = `${data.name} | Trip Planner & Itinerary | The Tarzan Way`;
    }
    
    if (data?.page_data && Object.keys(data?.page_data).length > 0) {
      isThemePage = true;
    }
    locations = data?.see_also || [];

    if (!data) {
      return {
        notFound: true,
      };
    }

    // Fetch continent data
    const continentData = await axiospagelistinstance.get(
      "/?page_type=Continent&fields=id,page_type,slug,overview_image,tagline,path"
    );
    for (let i = 0; i < continentData.data.data.pages.length; i++) {
      let continentSlug = continentData.data.data.pages[i].slug;

      const countrydetailsResponse = await axioscountrydetailsinstance.get(
        `?limit=100&offset=0&continent=${continentSlug}`
      );

      let hot_data = countrydetailsResponse.data.data.countries.filter(
        (d) => d.is_hot_location
      );
      hot_data = hot_data.slice(0, 6);

      continetCarousel.push({
        ...continentData.data.data.pages[i],
        hot_destinations: hot_data,
      });
    }
  } catch (err) {
    console.error("[ERROR][countryPage:getStaticProps]: ", err.message);
  }

  try {
    // Fetch hot location search data
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
      pageData: isThemePage,
      pageTitle,
    },
  };
}

export default TravelPlanner;

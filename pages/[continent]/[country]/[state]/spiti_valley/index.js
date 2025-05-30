import Head from "next/head";
import { useEffect } from "react";
import { connect } from "react-redux";
import Layout from "../../../../../components/Layout";
import ContinentPage from "../../../../../containers/continent/Index";
import axioscountrydetailsinstance from "../../../../../services/pages/country";
import axiospagelistinstance from "../../../../../services/pages/list";
import axiospagedetailsinstance from "../../../../../services/pages/pagedetails";
import axioslocationsinstance from "../../../../../services/search/search";
import setHotLocationSearch from "../../../../../store/actions/hotLocationSearch";
import { useRouter } from "next/router";
import { convertDbNameToCapitalFirst } from "../../../../../helper/convertDbnameToCapitalFirst";

const TravelPlanner = (props) => {
  
  const router = useRouter();
  if (router.isFallback) {
    return <div>Loading...</div>; // fallback loading UI
  }
  useEffect(() => {
    props.setHotLocationSearch(props.hotLocationSearch);
  }, []);

  return (
    <Layout
      destination={props.Data.destination}
      id={props.Data.id}
      page="Continent Page"
    >
      <Head>
        <title>{`${convertDbNameToCapitalFirst(props.Data.slug)} Trip Planner & Itinerary | Travel Company | India | The Tarzan Way`}</title>
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

      <ContinentPage
        contientTheme={props.contientTheme}
        data={props.Data}
        locations={props.locations}
        continetCarousel={props.continetCarousel}
        destination={convertDbNameToCapitalFirst(props.Data.slug)}
        type="Page"
      ></ContinentPage>
    </Layout>
  );
};

export async function getStaticPaths() {
  let paths = [];
  try {
    //mercury api
    const res = await axiospagelistinstance.get(
      "?page_type=Subregion&fields=path"
    );
    const data = res.data.data.pages;
    const pathArr = data[i].path.split("/");
      var [continentSlug, countrySlug, stateSlug, citySlug] = pathArr;

    for (var i = 0; i < data.length; i++) {
      paths.push({
        params: {  
          continent: continentSlug,
          country: countrySlug,
          state: stateSlug
        },  
      });
    }
  } catch (err) {
    console.log("[ERROR][continentPage:getStaticPaths]: ", err.message);
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
  let hotLocationSearch = [];
  const { continent, country, state } = context.params;
  const path = `spiti_valley`;

  try {
    // mercury server
    const res = await axiospagedetailsinstance.get(
       path+"/"
    );

    console.log("res is:",res.data.data)
    data = res.data.data;

  } catch (err) {
    console.error("[ERROR][continentPage:getStaticProps]: ", err.message);
  }

  if (!data) {
    return {
      notFound: true,
    };
  }

  try {
    // mercury
    const themeData = await axiospagelistinstance.get(
      "/?page_type=Continent&fields=id,page_type,slug,overview_image,tagline,path"
    );

    contientTheme = themeData.data.data.pages;
  } catch (err) {
    console.error(err.message);
  }

  try {
    for (let i = 0; i < contientTheme.length; i++) {
      // mercury api
      const countrydetailsResponse = await axioscountrydetailsinstance.get(
        `?limit=100&offset=0&continent=${contientTheme[i].slug}`
      );

      if (contientTheme[i].slug === continent) {
        locations = countrydetailsResponse.data.data.countries;
      }

      let hot_data = countrydetailsResponse.data.data.countries.filter(
        (d) => d.is_hot_location
      );
      hot_data = hot_data.slice(0, 6);
      continetCarousel.push({
        ...contientTheme[i],
        hot_destinations: hot_data,
      });
    }
  } catch (err) {
    console.error("[ERROR][continentPage:getStaticPaths]: ", err.message);
  }

  try {
    // mercury
    const response = await axioslocationsinstance.get(
      `hot_destinations/?continent=${continent}/`
    );
    if (response.data?.length) {
      hotLocationSearch = response.data;
    }
  } catch (err) {
    console.log(
      `[ERROR][ContinentPage][axioslocationsinstance:/hot_destinations/?continent=${continent}/]`
    );
  }

  return {
    props: {
      Data: data,
      locations,
      contientTheme,
      continetCarousel,
      path,
      hotLocationSearch,
      destination:continent
    },
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setHotLocationSearch: (payload) => dispatch(setHotLocationSearch(payload)),
  };
};

export default connect(null, mapDispatchToProps)(TravelPlanner);

import Head from "next/head";
import { useEffect } from "react";
import { connect } from "react-redux";
import Layout from "../../components/Layout";
import ContinentPage from "../../containers/continent/Index";
import axioscountrydetailsinstance from "../../services/pages/country";
import axiospagelistinstance from "../../services/pages/list";
import axiospagedetailsinstance from "../../services/pages/pagedetails";
import axioslocationsinstance from "../../services/search/search";
import setHotLocationSearch from "../../store/actions/hotLocationSearch";
import { useRouter } from "next/router";
import { convertDbNameToCapitalFirst } from "../../helper/convertDbnameToCapitalFirst";

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
        <title>{`${props.Data.slug
              .split("_")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")} Trip Planner & Itinerary | Travel Company | India | The Tarzan Way`}</title>
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
          href={`https://www.thetarzanway.com/${props.path}`}
        ></link>
      </Head>

      <ContinentPage
        contientTheme={props.contientTheme}
        data={props.Data}
        locations={props.locations}
        continetCarousel={props.continetCarousel}
        destination={convertDbNameToCapitalFirst(props.Data.slug)}
        type={props.Type}
      ></ContinentPage>
    </Layout>
  );
};

export async function getStaticPaths() {
  let paths = [];
  try {
    //mercury api
    const res = await axiospagelistinstance.get(
      "?page_type=Continent&fields=path"
    );
    const data = res.data.data.pages;

    for (var i = 0; i < data.length; i++) {
      paths.push({
        params: {
          continent: data[i]['path'],
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
  const { continent } = context.params;
  const path = `${continent}`;

  try {
    // mercury server
    const res = await axiospagedetailsinstance.get(
       context.params.continent
    );
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
      console.log("continent path is:",contientTheme[i].path)
      // mercury api
      const countrydetailsResponse = await axioscountrydetailsinstance.get(
        `?limit=100&offset=0&continent=${contientTheme[i].path}`
      );

      if (contientTheme[i].slug === continent) {
        locations = countrydetailsResponse.data.data.countries;
      }

      let hot_data = countrydetailsResponse.data.data.countries.filter(
        (d) => d.is_hot_location
      );
      hot_data = hot_data.slice(0, 6);
      console.log("hot_data is:",hot_data)
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
      destination:continent,
      Type:"Page"
    },
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setHotLocationSearch: (payload) => dispatch(setHotLocationSearch(payload)),
  };
};

export default connect(null, mapDispatchToProps)(TravelPlanner);

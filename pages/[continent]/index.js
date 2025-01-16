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

const TravelPlanner = (props) => {
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
        <title>{`${props.Data.destination} Trip Planner & Itinerary | Travel Company | India | The Tarzan Way`}</title>
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
      ></ContinentPage>
    </Layout>
  );
};

export async function getStaticPaths() {
  let paths = [];
  try {
    const res = await axiospagelistinstance(
      "/?page_type=Continent&fields=path"
    );
    const data = res.data;

    for (var i = 0; i < data.length; i++) {
      paths.push({
        params: {
          continent: data[i].path,
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
    const res = await axiospagedetailsinstance(
      "/?link=" + context.params.continent
    );
    data = res.data;
  } catch (err) {
    console.error("[ERROR][continentPage:getStaticProps]: ", err.message);
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
        `/all/?continent=${contientTheme[i].destination}&fields=id,name,path,tagline,image,is_hot_location,best_time,budget`
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
    console.error("[ERROR][continentPage:getStaticPaths]: ", err.message);
  }

  try {
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
    },
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setHotLocationSearch: (payload) => dispatch(setHotLocationSearch(payload)),
  };
};

export default connect(null, mapDispatchToProps)(TravelPlanner);

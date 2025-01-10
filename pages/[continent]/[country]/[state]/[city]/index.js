import { useRouter } from "next/router";
import Head from "next/head";
import { connect } from "react-redux";
import { useEffect } from "react";
import CityPage from "../../../../../containers/city/Index";
import Layout from "../../../../../components/Layout";
import axiossearchInstance from "../../../../../services/search/all";
import axiosPoiCityInstance from "../../../../../services/poi/city";
import axiosReccommendedCityInstance from "../../../../../services/poi/reccommededcities";
import axioslocationsinstance from "../../../../../services/search/search";
import setHotLocationSearch from "../../../../../store/actions/hotLocationSearch";

const Experience = (props) => {
  const router = useRouter();
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
      ></CityPage>
    </Layout>
  );
};

export async function getStaticPaths() {
  let paths = [];

  try {
    const res = await axiossearchInstance.get(
      "/?type=Location&fields=path,cta"
    );

    const data = res.data;

    for (var i = 0; i < data.length; i++) {
      const pathArr = data[i].path.split("/");
      var [continentSlug, countrySlug, stateSlug, citySlug] = pathArr;
      if (data[i].cta) {
        paths.push({
          params: {
            continent: continentSlug,
            country: countrySlug,
            state: stateSlug,
            city: citySlug,
          },
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

export async function getStaticProps(context) {
  let reccomendedCitiesData = [];
  let data = null;
  let hotLocationSearch = [];
  const { continent, country, state, city } = context.params;
  const path = `${continent}/${country}/${state}/${city}`;

  try {
    const res = await axiosPoiCityInstance.get(`/?slug=${context.params.city}`);
    data = res.data;
  } catch (err) {
    console.error(
      `[ERROR][cityPage:axiosPoiCityInstance][/?slug=${context.params.city}]: `,
      err.message
    );
  }

  if (!data) {
    return {
      notFound: true,
    };
  }

  try {
    const resp = await axiosReccommendedCityInstance.get(
      `/?slug=${context.params.city}&limit=6`
    );

    const reccoData = resp.data;
    reccomendedCitiesData = reccoData.map((e) => ({
      id: e.id,
      image: e.image,
      lat: e.lat,
      long: e.long,
      most_popular_for: e.most_popular_for,
      name: e.name,
      path: e.path,
      budget: e.budget,
    }));
  } catch (err) {
    console.error(
      `[ERROR][cityPage:axiosReccommendedCityInstance][/?slug=${context.params.city}&limit=6]: `,
      err.message
    );
  }

  try {
    const response = await axioslocationsinstance.get(
      `hot_destinations/?state=${state}/`
    );
    if (response.data?.length) {
      hotLocationSearch = response.data;
    }
  } catch (err) {
    console.log(
      `[ERROR][CityPage][axioslocationsinstance:/hot_destinations/?state=${state}/]`
    );
  }

  return {
    props: {
      cityData: data,
      reccomendedCitiesData,
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

export default connect(null, mapDispatchToProps)(Experience);

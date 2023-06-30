import ExperienceContainer from "../../../../containers/city/Index";
import Layout from "../../../../components/Layout";
import { useRouter } from "next/router";
import axiosallCityInstance from "../../../../services/travel-guide/SearchAllLocation";
import axiosPoiCityInstance from "../../../../services/poi/city";
import axiosReccommendedCityInstance from "../../../../services/poi/reccommededcities";
import Head from "next/head";
import axios from "axios";
const Experience = (props) => {
  const schemaData = {
    "@context": "https://schema.org/",
    "@type": "item",
    name: props.cityData.name,
    description: props.cityData.short_description,
  };
  const router = useRouter();

  return (
    <Layout destination={props.cityData.name} id={props.cityData.id}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      ></script>
      <Head>
        <meta
          name="description"
          // content={props.cityData.short_description}
          content={`Explore ${props.cityData.name} with The Tarzan Way's AI travel itinerary. Immerse yourself in iconic landmarks, hidden treasures of ${props.cityData.name}, and book your flights, accommodations, and transfers all in one go.`}
        />
        <meta
          property="og:title"
          // content={props.cityData.name + " | Travel Guide |  The Tarzan Way"}
          content={`Plan Your Trip to ${props.cityData.name} | Trip Planner & Itinerary | The Tarzan Way`}
        />
        <meta
          property="og:description"
          // content={props.cityData.short_description}
          content={`Explore ${props.cityData.name} with The Tarzan Way's AI travel itinerary. Immerse yourself in iconic landmarks, hidden treasures of ${props.cityData.name}, and book your flights, accommodations, and transfers all in one go.`}
        />
        <meta property="og:image" content="/logoblack.svg" />
        <title>
          {/* {props.cityData.name + " | Travel Guide |  The Tarzan Way"} */}
          Plan Your Trip to {props.cityData.name} | Trip Planner & Itinerary | The Tarzan Way
        </title>
        <meta
          property="keywords"
          content="best places to visit in india, best places to visit in kasol, best places to visit in ladakh, best places to visit in andaman, best places to visit in manali, best places to visit in delhi, best places to visit in rajasthan, package for ladakh, package for manali, package for delhi, package for andaman, package for kashmir"
        ></meta>
      </Head>
      <ExperienceContainer
        reccomendedCitiesData={props.reccomendedCitiesData}
        cityData={props.cityData}
        id={router.query.city}
      ></ExperienceContainer>
    </Layout>
  );
};

export async function getStaticPaths() {
  // const res = await fetch(`https://apis.tarzanway.com/search/all/?type=Location`)

  // const data = await res.json();

  const res = await axiosallCityInstance.get("");
    // const res = await axios.get(
    //   "https://dev.apis.tarzanway.com/search/all/?type=Location"
    // );

  const data = res.data;

  let paths = [];
    for (var i = 0; i < data.length; i++) {
        const pathArr = data[i].path.split("/");
          var [continentSlug , countrySlug, stateSlug, citySlug] = pathArr;
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
  return {
    paths: paths,
    fallback: "blocking",
  };
}
export async function getStaticProps(context) {
  // const res = await fetch(`https://apis.tarzanway.com/poi/city/?slug=`+context.params.city)
  // const data = await res.json()

  const res = await axiosPoiCityInstance.get(`/?slug=${context.params.city}`);
  const data = res.data;

  try {
    const resp = await axiosReccommendedCityInstance.get(
      `/?slug=${context.params.city}&limit=6`
    );
    // const resp = await fetch(`https://apis.tarzanway.com/poi/city/recommended?slug=`+context.params.city)

    const reccoData = resp.data;
    var reccomendedCitiesData = reccoData.map((e) => ({
      id: e.id,
      image: e.image,
      lat: e.lat,
      long: e.long,
      most_popular_for: e.most_popular_for,
      name: e.name,
      path: e.path,
    }));
  } catch {
    var reccomendedCitiesData = null;
  }

  if (!data) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      cityData: data,
      reccomendedCitiesData,
    },
  };
}

export default Experience;

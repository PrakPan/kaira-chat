import ExperienceContainer from "../../../../containers/city/Index";
import Layout from "../../../../components/Layout";
import { useRouter } from "next/router";
import axiossearchInstance from "../../../../services/search/all";
import axiosPoiCityInstance from "../../../../services/poi/city";
import axiosReccommendedCityInstance from "../../../../services/poi/reccommededcities";
import Head from "next/head";

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
          Plan Your Trip to {props.cityData.name} | Trip Planner & Itinerary |
          The Tarzan Way
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
  const res = await axiossearchInstance.get("/?type=Location&fields=path,cta");

  const data = res.data;

  let paths = [];
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
  return {
    paths: paths,
    fallback: "blocking",
  };
}
export async function getStaticProps(context) {
  let reccomendedCitiesData = [];
  let data;

  try {
    const res = await axiosPoiCityInstance.get(`/?slug=${context.params.city}`);
    data = res.data;
  } catch (err) {
    console.error(err.message);
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
    }));
  } catch (err) {
    console.error(err.message);
  }

  return {
    props: {
      cityData: data,
      reccomendedCitiesData,
    },
  };
}

export default Experience;

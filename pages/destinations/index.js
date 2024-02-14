import SwiperLocations from "../../components/containers/SwiperLocations/Index";
import axiosAllDestinationsInstance from "../../services/pages/allDestinations";
import Layout from "../../components/Layout";
import styled from "styled-components";
import { useRouter } from "next/router";
import Head from "next/head";
import HeroBanner from "../../components/containers/HeroBanner/HeroBanner";

const Heading = styled.h2`
  font-size: 32px;
  font-weight: 700;
  margin: 1.5rem 0.5rem;
  text-align: center;

  @media screen and (min-width: 768px) {
    text-align: left;
    margin: 3.5rem 0rem;
  }
`;

export default function AllDestinations({ allDestinations }) {
  const router = useRouter();

  const handlePlanButton = async (continent) => {
    await router.push(`/${continent}`);
  };

  return (
    <Layout destination={"All Destinations"} id={""}>
      <Head>
        <title>Travel Company | India | The Tarzan Way</title>
        <meta name="description" content={""}></meta>
        <meta property="og:title" content={"Travel Company | India | The Tarzan Way"} />
        <meta property="og:description" content={""} />
        <meta property="og:image" content="/logoblack.svg" />
        <meta property="keywords" content={""}></meta>
      </Head>
      <HeroBanner
        image={allDestinations[0].locations[0].image}
        // page_id={props.data.id}
        destination={""}
        title={`All Destinations Trip Planner`}
      />

      <div className="flex flex-col lg:px-5 py-5">
        {allDestinations && allDestinations.length
          ? allDestinations.map((dest, index) => (
              <div key={index}>
                <Heading>
                  Top countries to visit in {dest.continent.title}
                </Heading>
                <SwiperLocations
                  locations={dest.locations}
                  // page_id={props.data.id}
                  destination={dest.continent.title}
                  viewall
                  country
                ></SwiperLocations>
                <div className="w-full flex items-center justify-center mt-3">
                  <button
                    onClick={() => handlePlanButton(dest.continent.slug)}
                    className="text-center border-black border-1 rounded-lg px-3 py-1 hover:bg-black hover:text-white transition duration-500 ease-in-out"
                  >
                    Craft your travel plan to {dest.continent.title}
                  </button>
                </div>
              </div>
            ))
          : null}
      </div>
    </Layout>
  );
}

export async function getStaticProps(context) {
  const CONTINENTS = [
    { slug: "asia", title: "Asia" },
    { slug: "africa", title: "Africa" },
    { slug: "caribbean", title: "Caribbean" },
    { slug: "oceania", title: "Oceania" },
    { slug: "europe", title: "Europe" },
    { slug: "north_america", title: "North America" },
    { slug: "south_america", title: "South America" },
  ];
  try {
    const allDestinations = [];
    for (let i = 0; i < CONTINENTS.length; i++) {
      const response = await axiosAllDestinationsInstance(
        `/all?continent=${CONTINENTS[i].slug}&fields=id,name,path,tagline,image`
      );
      const locations = response.data;
      allDestinations.push({
        continent: CONTINENTS[i],
        locations,
      });
    }
    return {
      props: {
        allDestinations,
      },
    };
  } catch (err) {
    console.log("[Error][AllDestinationsPage]: ", err.message);
    return {
      props: {
        allDestinations: [],
      },
    };
  }
}

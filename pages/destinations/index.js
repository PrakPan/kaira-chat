import SwiperLocations from "../../components/containers/SwiperLocations/Index";
import axiosAllDestinationsInstance from "../../services/pages/allDestinations";
import Layout from "../../components/Layout";
import styled from "styled-components";
import { useRouter } from "next/router";
import Head from "next/head";
import HeroBanner from "../../components/containers/HeroBanner/HeroBanner";
import Button from "../../components/ui/button/Index";

const Container = styled.div`
  width: 100%;
  margin: auto;
  @media screen and (min-width: 768px) {
    width: 85%;
  }
`;

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

  const handlePlanButton = (continent) => {
    router.push(`/${continent}`);
  };

  return (
    <Layout destination={"All Destinations"} id={""}>
      <Head>
        <title>Travel Company | India | The Tarzan Way</title>
        <meta name="description" content={""}></meta>
        <meta
          property="og:title"
          content={"Travel Company | India | The Tarzan Way"}
        />
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

      <Container className="flex flex-col justify-center">
        {allDestinations && allDestinations.length
          ? allDestinations.map((dest, index) => (
              <div key={index} className="">
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
                <div className="w-full flex items-center justify-center mt-5">
                  <Button
                    onclick={() => handlePlanButton(dest.continent.slug)}
                    borderWidth="1px"
                    fontWeight="500"
                    borderRadius="6px"
                    margin="2rem auto"
                    padding="0.5rem 2rem"
                  >
                    Create your travel plan to {dest.continent.title}
                  </Button>
                </div>
              </div>
            ))
          : null}
      </Container>
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

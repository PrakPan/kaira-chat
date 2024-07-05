import axiosAllDestinationsInstance from "../../services/pages/allDestinations";
import axiospagelistinstance from "../../services/pages/list";
import axiosCountInstance from "../../services/itinerary/count";
import Layout from "../../components/Layout";
import Head from "next/head";
import DestinationsPageContainer from "../../containers/destinationspage/Index";

export default function AllDestinations(props) {
  return (
    <Layout destination={"All Destinations"} id={""} page={"Destinations page"}>
      <Head>
        <title>
          All Destinations Trip Planner & Itinerary | Travel Company | India |
          The Tarzan Way
        </title>
        <meta
          name="description"
          content={
            "The Tarzan Way is the best trip-planning platform to craft your trips, your way using AI Trip Planner. Create, browse, customise travel itineraries, manage bookings - all in one place!"
          }
        ></meta>
        <meta
          property="og:title"
          content="All Destinations Trip Planner & Itinerary | Travel Company | India |
          The Tarzan Way"
        />
        <meta
          property="og:description"
          content={
            "The Tarzan Way is the best trip-planning platform to craft your trips, your way using AI Trip Planner. Create, browse, customise travel itineraries, manage bookings - all in one place!"
          }
        />
        <meta property="og:image" content="/logoblack.svg" />
        <meta
          property="keywords"
          content="ai trip planner, trip planner, itinerary, travel plan, ai itinerary, ai plan, craft a trip, wanderlog, inspirock, tripit, local travel experience, customized trip planner, customized holiday packages, customized packages in computer, honeymoon travel packages, personalized travel package, hotels, flights, activities, transfers,"
        ></meta>

        <link
          rel="canonical"
          href={`https://thetarzanway.com/destinations`}
        ></link>
      </Head>

      <DestinationsPageContainer
        allDestinations={props.allDestinations}
        ThemeData={props.ThemeData}
        Count={props.Count}
      />
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

  let ThemeData = [];
  const allDestinations = [];
  let Count = null;

  try {
    for (let i = 0; i < CONTINENTS.length; i++) {
      const response = await axiosAllDestinationsInstance(
        `/all/?continent=${CONTINENTS[i].slug}&fields=id,name,path,tagline,image,best_time`
      );
      const locations = response.data;
      allDestinations.push({
        continent: CONTINENTS[i],
        locations,
      });
    }

    const countResponse = await axiosCountInstance.get("");
    let count = countResponse.data.user.toString().split("");

    if (count.length > 3) {
      for (let i = 1; i < 4; i++) {
        count.pop();
      }
      Count = count.join("") + "k";
    } else Count = +count.join("");
  } catch (err) {
    console.log("[Error][AllDestinationsPage:getStaticProps]: ", err.message);
  }

  try {
    const pageListResponse = await axiospagelistinstance.get(
      `/?page_type=Theme&fields=id,destination,tagline,image,link,path,banner_heading`
    );
    ThemeData = pageListResponse.data;
  } catch (err) {
    console.log("[Error][AllDestinationsPage:getStaticProps]: ", err.message);
  }

  return {
    props: {
      allDestinations,
      ThemeData,
      Count,
    },
  };
}

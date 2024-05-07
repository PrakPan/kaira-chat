import StatePage from "../../../../containers/travelplanner/Index";
import Head from "next/head";
import Layout from "../../../../components/Layout";
import axiosTravelPlannerInstance from "../../../../services/pages/travel-planner";
import axiossearchallinstance from "../../../../services/search/all";
import axiospagelistinstance from "../../../../services/pages/list";

const TravelPlanner = (props) => {
  return (
    <Layout
      page_id={props.Data.id}
      destination={props.Data.destination}
      page={"State Page"}
    >
      <Head>
        <title>
          Plan Your Trip to {props.Data.destination} | Trip Planner & Itinerary
          | The Tarzan Way
        </title>
        <meta
          name="description"
          content={`Plan your dream trip to ${props.Data.destination} with The Tarzan Way's AI itinerary. Explore top attractions, local cuisine, and book your flights, accommodations, and transfers all in one go ${props.Data.destination}.`}
        ></meta>
        <meta
          property="og:title"
          content={`Plan Your Trip to ${props.Data.destination} | Trip Planner & Itinerary | The Tarzan Way`}
        />
        <meta
          property="og:description"
          content={`Plan your dream trip to ${props.Data.destination} with The Tarzan Way's AI itinerary. Explore top attractions, local cuisine, and book your flights, accommodations, and transfers all in one go ${props.Data.destination}.`}
        />
        <meta property="og:image" content="/logoblack.svg" />
        <meta property="keywords" content={props.Data.meta_keywords}></meta>
      </Head>

      <StatePage
        experienceData={props.Data}
        locations={props.locations}
      ></StatePage>
    </Layout>
  );
};

export async function getStaticPaths() {
  let paths = [];

  try {
    const res = await axiossearchallinstance.get("/?type=State&fields=path");
    const data = res.data;

    const themeRes = await axiospagelistinstance.get(
      "/?fields=path&page_type=Theme"
    );

    let themePages = themeRes.data;
    themePages = themePages.map((page) => {
      return {
        path: "asia/India/" + page.path,
      };
    });

    const allPaths = [...data, ...themePages];

    for (var i = 0; i < allPaths.length; i++) {
      const pathArr = allPaths[i].path.split("/");
      var [continentSlug, countrySlug, stateSlug] = pathArr;
      paths.push({
        params: {
          continent: continentSlug,
          country: countrySlug.toLowerCase().replace(/ /g, "_"),
          state: stateSlug,
        },
      });
    }
  } catch (err) {
    console.error("[ERROR][statePage:getStaticPaths]: ", err.message);
  }

  return {
    paths: paths,
    fallback: false,
  };
}
export async function getStaticProps(context) {
  var locations = [];
  let data = null;

  try {
    const res = await axiosTravelPlannerInstance.get(
      `/?link=${context.params.state}`
    );
    data = res.data;
  } catch (err) {
    console.log("[ERROR][statePage:getStaticProps]: ", err.message);
  }

  if (!data) {
    return {
      notFound: true,
    };
  }

  try {
    const loc = await axiospagelistinstance.get(
      `/?country=${context.params.country}&page_type=Destination&fields=id,ancestors,path,destination,name,tagline,image,link`
    );
    locations = loc.data;
  } catch (err) {
    console.log("[ERROR][statePage:getStaticProps]: ", err.message);
  }

  return {
    props: {
      Data: data,
      locations,
    },
  };
}

export default TravelPlanner;

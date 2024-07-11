import Head from "next/head";
import Layout from "../../components/Layout";
import ContinentPage from "../../containers/continent/Index";
import axioscountrydetailsinstance from "../../services/pages/country";
import axiospagelistinstance from "../../services/pages/list";
import axiospagedetailsinstance from "../../services/pages/pagedetails";

const TravelPlanner = (props) => {
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
          content={`Discover ${props.Data.destination} with The Tarzan Way’s AI Trip Planner. Book your flights, accommodations, and transfers all in one go and discover must-visit ${props.Data.destination} destinations for an extraordinary journey! `}
        ></meta>
        <meta
          property="og:title"
          content={`${props.Data.destination} Trip Planner & Itinerary | Travel Company | India | The Tarzan Way`}
        />
        <meta
          property="og:description"
          content={`Discover ${props.Data.destination} with The Tarzan Way’s AI Trip Planner. Book your flights, accommodations, and transfers all in one go and discover must-visit ${props.Data.destination} destinations for an extraordinary journey! `}
        />
        <meta property="og:image" content="/logoblack.svg" />
        <meta
          property="keywords"
          content={`${props.Data.destination} trip planner, ai trip planner, trip planner, itinerary, travel plan, ai itinerary, ai plan, craft a trip, travel in ${props.Data.destination}, ${props.Data.destination} tour package, experience ${props.Data.destination} culture, ${props.Data.destination} holiday package, local travel experience, customized trip planner, customized holiday packages, customized packages in computer, honeymoon travel packages, personalized travel package, best places in ${props.Data.destination}, places to visit in ${props.Data.destination}, best activities in ${props.Data.destination}, things to do in ${props.Data.destination}, package for ${props.Data.destination}, top places in ${props.Data.destination}, wanderlog, inspirock, tripit, hotels, flights, activities, transfers, solo travel, family travel,`}
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

  return {
    props: {
      Data: data,
      locations,
      contientTheme,
      continetCarousel,
      path,
    },
  };
}

export default TravelPlanner;

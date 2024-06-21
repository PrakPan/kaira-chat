import ExperiencesContainer from "../../containers/guides/Index";
import Layout from "../../components/Layout";
import Head from "next/head";
import travelGuideInstance from "../../services/travel-guide/travel-guide";

const Guide = (props) => {
  return (
    <Layout>
      <Head>
        <title>Travel Guides | Travel India | The Tarzan Way</title>
        <meta
          name="description"
          content="We envision to simplify travel and build immersive travel experiences."
        />
        <meta
          property="og:title"
          content="Travel Guides | Travel India | The Tarzan Way"
        />
        <meta
          property="og:description"
          content="We envision to simplify travel and build immersive travel experiences."
        />
        <meta property="og:image" content="/logoblack.svg" />
        <meta
          property="keywords"
          content="ai trip planner, trip planner, itinerary, travel plan, ai itinerary, ai plan, craft a trip, wanderlog, inspirock, tripit, local travel experience, customized trip planner, customized holiday packages, customized packages in computer, honeymoon travel packages, personalized travel package, hotels, flights, activities, transfers,"
        ></meta>

        <link
          rel="canonical"
          href={`https://thetarzanway.com/travel-guide`}
        ></link>
      </Head>
      <ExperiencesContainer guideData={props.data}></ExperiencesContainer>
    </Layout>
  );
};

export async function getStaticProps(context) {
  let data;

  try {
    const res = await travelGuideInstance.get("/");
    data = res.data;
  } catch (err) {
    console.error("[ERROR][travleguidepage:getStaticProps]: ", err.message);
  }

  if (!data) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      data: data,
    },
  };
}

export default Guide;

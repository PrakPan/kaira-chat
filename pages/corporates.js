import CovidContainer from "../containers/corporates[dev]/Index";
import Head from "next/head";
import Layout from "../components/Layout";
import itineraryplaninstance from "../services/itinerary/plan";

const Covid = (props) => {
  return (
    <Layout>
      <Head>
        <title>
          Corporate Travel Support | Business Travel India | The Tarzan Way
        </title>
        <meta
          name="description"
          content="Streamline corporate travel with our AI-powered planning and support. Enjoy personalized itineraries, cost savings, and 24/7 assistance for a hassle-free business travel experience."
        ></meta>
        <meta
          property="og:title"
          content="Corporate Travel Support | Business Travel India | The Tarzan Way"
        />
        <meta
          property="og:description"
          content="Streamline corporate travel with our AI-powered planning and support. Enjoy personalized itineraries, cost savings, and 24/7 assistance for a hassle-free business travel experience."
        />
        <meta property="og:image" content="/logoblack.svg" />
        <meta
          name="keyword"
          content="ai trip planner, trip planner, itinerary, travel plan, ai itinerary, ai plan, craft a trip, corporate trip, business trip, business travel,  large group, group trips, group travel package, travel allowance, wanderlog, inspirock, tripit, local travel experience, customized trip planner, customized holiday packages, customized packages in computer, honeymoon travel packages, personalized travel package, hotels, flights, activities, transfers, solo travel, family travel"
        />

        <link
          rel="canonical"
          href={`https://thetarzanway.com/corporates`}
        ></link>
      </Head>

      <CovidContainer {...props}></CovidContainer>
    </Layout>
  );
};

export async function getStaticProps() {
  let workcation_ids = [
    "cfa2e275-3978-44d6-85df-9e1e00557e93",
    "ae7a290c-d77b-483f-9da0-07b1e5ff238c",
    "18db9b62-b8d4-4a6a-8600-b9ca4df389f9",
  ];

  let offbeat_ids = [
    "553f6a52-40af-40b9-bc18-10121194026d",
    "a74a8d7f-6218-4a8f-943e-57c13b9e441f",
    "772e2aab-16f0-48d1-a485-23ca05c09a07",
  ];

  let getaway_ids = [
    "0c400b2c-031d-424b-877e-14009fd6f0b7",
    "13a9bc8c-f5ae-4728-a2a3-60f3db170920",
    "c11a421c-d60f-40b1-bfa4-ab87548f7bd3",
  ];

  var workcation_experience = [];
  var offbeat_experiences = [];
  var getaway_experiences = [];

  for (let i = 0; i < workcation_ids.length; i++) {
    try {
      const res = await itineraryplaninstance.get(
        "/?itinerary_id=" + workcation_ids[i]
      );
      if (res.data.message !== "not found")
        workcation_experience.push(res.data);
    } catch (e) {
      console.log("[ERROR][corporatespage:getStaticProps]: ", e.message);
    }
  }

  for (let i = 0; i < offbeat_ids.length; i++) {
    try {
      const res = await itineraryplaninstance.get(
        "/?itinerary_id=" + offbeat_ids[i]
      );
      if (res.data.id) offbeat_experiences.push(res.data);
    } catch (e) {
      console.log("[ERROR][corporatespage:getStaticProps]: ", e.message);
    }
  }

  for (let i = 0; i < getaway_ids.length; i++) {
    try {
      const res = await itineraryplaninstance.get(
        "/?itinerary_id=" + getaway_ids[i]
      );
      if (res.data.id) getaway_experiences.push(res.data);
    } catch (e) {
      console.log("[ERROR][corporatespage:getStaticProps]: ", e.message);
    }
  }

  return {
    props: {
      workcation_experience,
      offbeat_experiences,
      getaway_experiences,
    },
  };
}

export default Covid;

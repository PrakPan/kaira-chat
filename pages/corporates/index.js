import CovidContainer from "../../containers/corporates[dev]/Index";
import Head from "next/head";
import Layout from "../../components/Layout";
import itineraryplaninstance from "../../services/itinerary/plan";
import axiospagelistinstance from "../../services/pages/list";


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

  let getaways_delhi_ids = [
    "3ad0311a-e500-42bb-9453-65e4f93e7bf8",
    "26e9f57c-6efd-4280-9291-a90b4bd088c8",
    "3a7c5d08-7ebb-4383-a2d3-d18e67e18dac",
    "1412fe78-2e7e-49cd-a946-132a73e263ca",
    "eb2f0fe2-8d91-465a-800b-a3f1f98ab97c"
  ];

  let experiential_getaways = [
    "bdd34d4d-485b-45bc-9568-bc53b8fed39f",
    "f24fd741-2339-466a-9977-9357ce252bf1",
    "eda17cdf-eade-40a3-b281-daf51831e3ff"
  ]

  var workcation_experience = [];
  var offbeat_experiences = [];
  var getaway_experiences = [];
  var getaways_delhi_experiences = [];
  var experiential_experiences = []
  var locations = [];

  try {
    const pageListResponse = await axiospagelistinstance.get(
      `/?country=india&page_type=Destination&fields=id,destination,tagline,image,link,path,banner_heading,page_type,budget`
    );

    locations = pageListResponse.data;
  } catch (err) {
    console.log("[ERROR][corporatespage:getStaticProps]: ", err.message);
  }



  for (let i = 0; i < workcation_ids.length; i++) {
    try {
      const res = await itineraryplaninstance.get(
        "/?itinerary_id=" + workcation_ids[i]
      );
      if (res?.data?.message !== 'Not found') {
        const data = {
          id: workcation_ids[i],
          ...res.data
        }

        workcation_experience.push(data);
      }
    } catch (e) {
      console.log("[ERROR][corporatespage:getStaticProps]: ", e.message);
    }
  }

  for (let i = 0; i < getaways_delhi_ids.length; i++) {
    try {
      const res = await itineraryplaninstance.get(
        "/?itinerary_id=" + getaways_delhi_ids[i]
      );

      if (res?.data?.message !== 'Not found') {
        const data = {
          id: getaways_delhi_ids[i],
          ...res.data,
        }

        getaways_delhi_experiences.push(data);
      }
    } catch (e) {
      console.log("[ERROR][corporatespage:getStaticProps]: ", e.message);
    }
  }

  for (let i = 0; i < experiential_getaways.length; i++) {
    try {
      const res = await itineraryplaninstance.get(
        "/?itinerary_id=" + experiential_getaways[i]
      );

      if (res?.data?.message !== 'Not found') {
        const data = {
          id: experiential_getaways[i],
          ...res.data,
        }

        experiential_experiences.push(data);
      }
    } catch (e) {
      console.log("[ERROR][corporatespage:getStaticProps]: ", e.message);
    }
  }

  return {
    props: {
      workcation_experience,
      offbeat_experiences,
      getaway_experiences,
      getaways_delhi_experiences,
      experiential_experiences,
      locations
    },
  };
}

export default Covid;

import CovidContainer from "../containers/corporates[dev]/Index";
import Head from "next/head";
import Layout from "../components/Layout";
import itineraryplaninstance from "../services/itinerary/plan";
const Covid = (props) => {
  return (
    <Layout>
      <Head>
        <title>Travel Support | Travel India | The Tarzan Way </title>
        <meta
          name="description"
          content="Keeping safe from coronavirus while traveling in India is very important and we have taken a number of steps to make sure that your travel experience in India is the safest and we are taking multiple steps to prevent anything happening to our travelers while traveling in India during the pandemic outbreak of coronavirus"
        ></meta>
        <meta
          property="og:title"
          content="COVID-19 Safety | Safe Travel India | The Tarzan Way"
        />
        <meta
          property="og:description"
          content="Keeping safe from coronavirus while traveling in India is very important and we have taken a number of steps to make sure that your travel experience in India is the safest and we are taking multiple steps to prevent anything happening to our travelers while traveling in India during the pandemic outbreak of coronavirus"
        />
        <meta property="og:image" content="/logoblack.svg" />
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
'553f6a52-40af-40b9-bc18-10121194026d',
'a74a8d7f-6218-4a8f-943e-57c13b9e441f',
'772e2aab-16f0-48d1-a485-23ca05c09a07'
  ]
  var workcation_experience = [];
  var offbeat_experiences = []
  for (let i = 0; i < workcation_ids.length; i++) {
    try {
      const res = await itineraryplaninstance.get(
        "/?itinerary_id=" + workcation_ids[i]
      );
      workcation_experience.push(res.data);
    } catch (e) {
      console.log(e);
    }
  }
    for (let i = 0; i < offbeat_ids.length; i++) {
      try {
        const res = await itineraryplaninstance.get(
          "/?itinerary_id=" + offbeat_ids[i]
        );
        offbeat_experiences.push(res.data);
      } catch (e) {
        console.log(e);
      }
    }
  return {
    props: {
      workcation_experience,
      offbeat_experiences,
    },
  };
}

export default Covid;

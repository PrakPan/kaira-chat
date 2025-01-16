import Head from "next/head";
import Layout from "../../components/Layout";
import ThankyouPage from "../../containers/corporates[dev]/ThankyouPage";

export default function ThankYou() {
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

      <ThankyouPage />
    </Layout>
  );
}

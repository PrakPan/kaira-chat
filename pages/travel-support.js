import CovidContainer from "../containers/travelsupport/Index";
import Head from "next/head";
import Layout from "../components/Layout";

const Covid = () => {
  return (
    <Layout>
      <Head>
        <title>Travel Support | Travel India | The Tarzan Way </title>
        <meta
          name="description"
          content="Planning a travel experience can be time consuming and overwhelming, here is your travel buddy to help you plan the perfect travel experience in India for you and your loved ones"
        ></meta>
        <meta
          property="og:title"
          content="Travel Support | Travel India | The Tarzan Way "
        />
        <meta
          property="og:description"
          content="Planning a travel experience can be time consuming and overwhelming, here is your travel buddy to help you plan the perfect travel experience in India for you and your loved ones"
        />
        <meta property="og:image" content="https://thetarzanway.com/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://thetarzanway.com/og-image.png" />
        <meta
          property="keywords"
          content="ai trip planner, trip planner, itinerary, travel plan, ai itinerary, ai plan, craft a trip, wanderlog, inspirock, tripit, local travel experience, customized trip planner, customized holiday packages, customized packages in computer, honeymoon travel packages, personalized travel package, hotels, flights, activities, transfers,"
        ></meta>

        <link
          rel="canonical"
          href={`https://thetarzanway.com/travel-support`}
        ></link>
      </Head>

      <CovidContainer></CovidContainer>
    </Layout>
  );
};

export default Covid;

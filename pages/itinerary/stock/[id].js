import ItineraryContainer from "../../../containers/itinerary/Indexs/Stock";
import { useRouter } from "next/router";
import Layout from "../../../components/Layout";
import Head from "next/head";

const Itinerary = () => {
  const router = useRouter();
  return (
    <Layout itinerary>
      <Head>
        <title> Tailored Itinerary | The Tarzan Way </title>
        <meta property="og:title" content="Tailored Travel | The Tarzan Way" />
        <meta
          property="og:description"
          content="We envision to simplify travel and build immersive travel experiences."
        />
        <meta property="og:image" content="https://thetarzanway.com/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://thetarzanway.com/og-image.png" />
      </Head>

      <ItineraryContainer id={router.query.id}></ItineraryContainer>
    </Layout>
  );
};

export default Itinerary;

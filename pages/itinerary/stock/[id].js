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
        <meta property="og:image" content="/logoblack.svg" />
      </Head>

      <ItineraryContainer id={router.query.id}></ItineraryContainer>
    </Layout>
  );
};

export default Itinerary;

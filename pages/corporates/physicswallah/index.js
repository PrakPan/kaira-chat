import PWContainer from "../../../containers/PW/Index";
import Layout from "../../../components/Layout";
import Head from "next/head";

const Itinerary = () => {
  return (
    <Layout hidehomecta hidecta PW>
      <Head>
        <title> Physics Wallah and TTW | TTW Corporates </title>
        <meta property="og:title" content="Tailored Travel | The Tarzan Way" />
        <meta
          property="og:description"
          content="We envision to simplify travel and build immersive travel experiences."
        />
        <meta property="og:image" content="/logoblack.svg" />
      </Head>

      <PWContainer></PWContainer>
    </Layout>
  );
};

export default Itinerary;

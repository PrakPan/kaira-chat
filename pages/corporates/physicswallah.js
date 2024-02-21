import PWContainer from "../../containers/PW/Index";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import Head from "next/head";
import { useEffect } from "react";

const Itinerary = () => {
  const router = useRouter();
  useEffect(() => {}, []);

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

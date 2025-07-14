import CovidContainer from "../containers/covid/Index";
import Head from "next/head";
import Layout from "../components/Layout";

const Covid = () => {
  return (
    <Layout>
      <Head>
        <title>COVID-19 Safety | Safe Travel India | The Tarzan Way </title>
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
        <meta
          property="keywords"
          content="safe travel during covid india, safe travel destinations covid, safe travel destinations after covid, safe travel india destinations, safe travel locations 2020, safe travel india, safe travel india post covid, safe travel recommendations, safe travel recommendations india, safety during travel, travel safety india, travel safety post covid, travel safety coronavirus, safety travel india, safe travel meaning, safety, travel packages india, can you travel safely during covid, how do you travel safely india, how to travel safe india, travel safe india, is travel safe in india, travel safety india post covid "
        ></meta>

        <link
          rel="canonical"
          href={`https://thetarzanway.com/covid-19-safe-travel-india`}
        ></link>
      </Head>

      <CovidContainer></CovidContainer>
    </Layout>
  );
};

export default Covid;

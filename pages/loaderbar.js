import Head from "next/head";
import Layout from "../components/Layout";
import LoaderContainer from "../containers/loaderbar/Index";

const Loader = () => {
  return (
    <Layout>
      <Head>
        <title>LoaderBar| The Tarzan Way | Travel India</title>
        <meta name="robots" content="noindex"></meta>
        <script
          src="https://kit.fontawesome.com/4f480de2c1.js"
          crossOrigin="anonymous"
        ></script>
      </Head>
      
      <LoaderContainer></LoaderContainer>
    </Layout>
  );
};

export default Loader;

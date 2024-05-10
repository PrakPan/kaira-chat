import Head from "next/head";
import Layout from "../components/Layout";
import PrivacyContainer from "../containers/privacy/index";

const Privacy = () => {
  return (
    <Layout>
      <Head>
        <title>Privacy-Policy | The Tarzan Way | Travel India</title>
        <meta name="robots" content="noindex"></meta>
      </Head>
      
      <PrivacyContainer></PrivacyContainer>
    </Layout>
  );
};

export default Privacy;

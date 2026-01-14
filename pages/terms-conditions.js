import Head from "next/head";
import Layout from "../components/Layout";
import TermsContainer from "../containers/terms-conditions/index";

const Terms = () => {
  return (
    <Layout isTerms={true}>
      <Head>
        <title>Terms-Conditions | The Tarzan Way | Travel India</title>
        <meta name="robots" content="noindex"></meta>
      </Head>

      <TermsContainer />
    </Layout>
  );
};

export default Terms;

import DashboardContainer from "../../containers/userprofile/Index";
import Layout from "../../components/Layout";
import Head from "next/head";
import usePageLoaded from "../../components/custom hooks/usePageLoaded";

const Dashboard = (props) => {
  const isPageLoaded = usePageLoaded();

  if (isPageLoaded) {
    return (
      <Layout page={"Dashboard Page"}>
        <Head>
          <title>Dashboard | The Tarzan Way</title>
          <meta property="og:title" content="Dahsboard | The Tarzan Way" />
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
        
        <DashboardContainer></DashboardContainer>
      </Layout>
    );
  } else return <div></div>;
};

export default Dashboard;

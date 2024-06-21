import ContactContainer from "../containers/contact/Index";
import Head from "next/head";
import Layout from "../components/Layout";

const Contact = () => {
  return (
    <Layout>
      <Head>
        <title>Contact Us | The Tarzan Way | Travel India</title>
        <meta name="robots" content="noindex"></meta>

        <meta
          name="description"
          content="You can contact us here for travel enquiries, applications, and partnerships, contact us on the numbers provided or mail at info@thetarzanway.com"
        ></meta>
        <meta
          property="og:title"
          content="Contact Us | The Tarzan Way | Travel India"
        />
        <meta
          property="og:description"
          content="You can contact us here for travel enquiries, applications, and partnerships, contact us on the numbers provided or mail at info@thetarzanway.com"
        />
        <meta property="og:image" content="/logoblack.svg" />
        <meta
          property="keywords"
          content="ai trip planner, trip planner, itinerary, travel plan, ai itinerary, ai plan, craft a trip, wanderlog, inspirock, tripit, local travel experience, customized trip planner, customized holiday packages, customized packages in computer, honeymoon travel packages, personalized travel package, hotels, flights, activities, transfers,"
        ></meta>

        <link
          rel="canonical"
          href={`https://thetarzanway.com/contact`}
        ></link>
      </Head>
      <ContactContainer></ContactContainer>
    </Layout>
  );
};

export default Contact;

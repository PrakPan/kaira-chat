import FullImage from "../containers/aboutus/FullImg";
import Vision from "../containers/aboutus/Vision/Vision";
import Timeline from "../containers/aboutus/Timeline/index";
import Mission from "../containers/aboutus/Mission/Mission";
import Numbers from "../containers/aboutus/Numbers/Numbers";
import Values from "../containers/aboutus/values/Values";
import StartJourney from "../components/containers/ChatWithUs/ChatWithUs";
import Head from "next/head";
import Layout from "../components/Layout";
import Team from "../containers/aboutus/Ourteam/Index";
import usePageLoaded from "../components/custom hooks/usePageLoaded";
import CtaBoardingSection from "../components/revamp/home/CtaBoardingSection";

const AboutUsContainer = () => {
  const isPageLoaded = usePageLoaded();

  if (isPageLoaded)
    return (
      <Layout>
        <Head>
          <title>About Us | Travel India | The Tarzan Way</title>
          <meta
            name="description"
            content="The Tarzan Way is the best trip-planning platform to craft your trips, your way using AI Trip Planner. Create, browse, customise travel itineraries, manage bookings - all in one place. Here’s our journey on how we started as a travel startup in India to curate experiential travel programs and provide tailored custom-made travel itineraries!"
          ></meta>
          <meta
            property="og:title"
            content="About Us | Travel India | The Tarzan Way"
          />
          <meta
            property="og:description"
            content="The Tarzan Way is the best trip-planning platform to craft your trips, your way using AI Trip Planner. Create, browse, customise travel itineraries, manage bookings - all in one place. Here’s our journey on how we started as a travel startup in India to curate experiential travel programs and provide tailored custom-made travel itineraries!"
          />
          <meta property="og:image" content="/logoblack.svg" />
          <meta
            property="keywords"
            content="ai trip planner, trip planner, itinerary, travel plan, ai itinerary, ai plan, craft a trip, wanderlog, inspirock, tripit, local travel experience, customized trip planner, customized holiday packages, customized packages in computer, honeymoon travel packages, personalized travel package, hotels, flights, activities, transfers,"
          ></meta>
          <link
            rel="canonical"
            href={`https://thetarzanway.com/about-us`}
          ></link>
        </Head>

        <FullImage></FullImage>
        <Timeline></Timeline>
        <Vision></Vision>
        <Mission></Mission>
        <Numbers></Numbers>
        <Values></Values>
        <Team></Team>
        <StartJourney
          heading="Start your travel journey with us!"
          text=" "
          button="Plan a Trip now!"
          buttonLink="/new-trip"
          margin="1.5rem auto"
          img={"media/website/getstarted.svg"}
        />
        <CtaBoardingSection />

      </Layout>
    );
  else return <div></div>;
};

export default AboutUsContainer;

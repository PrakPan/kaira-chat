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

const AboutUsContainer = () => {
  const isPageLoaded = usePageLoaded();

  if (isPageLoaded)
    return (
      <Layout>
        <Head>
          <title>About Us | Travel India | The Tarzan Way</title>
          <meta
            name="description"
            content="Here's our journey on how we started a travel startup that personalizes and customizes a travel package based on how the user is. The Tarzan Way is a travel-startup based out of India with the vision to build immersive travel experiences and simplify travel across the country. We curate experiential travel programs and provide tailored custom-made travel itineraries."
          ></meta>
          <meta
            property="og:title"
            content="About Us | Travel India | The Tarzan Way"
          />
          <meta
            property="og:description"
            content="Here's our journey on how we started a travel startup that personalizes and customizes a travel package based on how the user is. The Tarzan Way is a travel-startup based out of India with the vision to build immersive travel experiences and simplify travel across the country. We curate experiential travel programs and provide tailored custom-made travel itineraries."
          />
          <meta property="og:image" content="/logoblack.svg" />
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
          button="Personalise Now"
          margin="1.5rem auto"
          img={"media/website/getstarted.svg"}
        />
      </Layout>
    );
  else return <div></div>;
};

export default AboutUsContainer;

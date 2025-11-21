import Head from "next/head";
import styles from "../styles/pages/revamp/home.module.scss";
import HeroSection from "../components/revamp/destination/HeroSection";
import NavigationMenu from "../components/revamp/home/NavigationMenu";
import JourneySimplified from "../components/revamp/home/JourneySimplified";
import MostLovedItinerariesSection from "../components/revamp/destination/MostLovedItinerariesSection";
const DestinationPage = () => {
  return (
    <>
      <Head>
        <title>DestinationPage | Travel India | The Tarzan Way </title>
        <meta name="robots" content="noindex"></meta>

        <meta
          name="description"
          content="Get to know the people who make us who we are and what they have to say about their experience while traveling in India with The Tarzan Way. They have personalized their travel experiences and have the best time of their lives while traveling in India"
        ></meta>
        <meta
          property="og:title"
          content="DestinationPage | Travel India | The Tarzan Way "
        />
        <meta
          property="og:description"
          content="Get to know the people who make us who we are and what they have to say about their experience while traveling in India with The Tarzan Way. They have personalized their travel experiences and have the best time of their lives while traveling in India"
        />
        <meta property="og:image" content="/logoblack.svg" />
        <meta
          property="keywords"
          content="ai trip planner, trip planner, itinerary, travel plan, ai itinerary, ai plan, craft a trip, wanderlog, inspirock, tripit, local travel experience, customized trip planner, customized holiday packages, customized packages in computer, honeymoon travel packages, personalized travel package, hotels, flights, activities, transfers,"
        ></meta>

        <link
          rel="canonical"
          href={`https://thetarzanway.com/DestinationPage`}
        ></link>
      </Head>

      <div className={styles.destinationPage}>
        <NavigationMenu />
        <HeroSection />
        <JourneySimplified />
        <MostLovedItinerariesSection />
      </div>
    </>
  );
};

export default DestinationPage;

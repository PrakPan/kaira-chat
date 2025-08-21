import Head from "next/head";
import { HeroSection } from "../components/v2/home";
import Navigation from "../components/v2/home/NavigationMenu";
import styles from "../styles/pages/v2/home.module.scss";

const Home = () => {
  return (
    <>
      <Head>
        <title>Travel Company | India | The Tarzan Way</title>
        <meta
          name="description"
          content="The Tarzan Way is the best trip-planning platform to craft your trips, your way using AI Trip Planner. Create, browse, customise travel itineraries, manage bookings - all in one place!"
        />
        <meta
          property="og:title"
          content="Travel Company | India | The Tarzan Way"
        />
        <meta
          property="og:description"
          content="The Tarzan Way is the best trip-planning platform to craft your trips, your way using AI Trip Planner. Create, browse, customise travel itineraries, manage bookings - all in one place!"
        />
        <meta property="og:image" content="/logoblack.svg" />
        <meta
          property="keywords"
          content="ai trip planner, trip planner, itinerary, travel plan, ai itinerary, ai plan, craft a trip, wanderlog, inspirock, tripit, local travel experience, customized trip planner, customized holiday packages, customized packages in computer, honeymoon travel packages, personalized travel package, hotels, flights, activities, transfers,"
        />
        <link rel="canonical" href={`https://thetarzanway.com`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: `
            {
              "@context": "https://schema.org",
              "@type": "TravelAgency",
              "name": "The Tarzan Way",
              "image": "https://thetarzanway.com/logoblack.svg",
              "@id": "",
              "url": "https://thetarzanway.com/",
              "telephone": "+91 95821 25476",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "",
                "addressLocality": "",
                "postalCode": "",
                "addressCountry": "IN"
              },
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday"
                ],
                "opens": "00:00",
                "closes": "23:59"
              },
              "sameAs": [
                "https://www.facebook.com/thetarzanway/",
                "https://twitter.com/thetarzanway",
                "https://www.instagram.com/thetarzanway/",
                "https://www.linkedin.com/company/thetarzanway/",
                "https://in.pinterest.com/thetarzanway/"
              ]
            }
          `,
          }}
        />
      </Head>

      <div className={styles.ttwRevamp}>
        <Navigation />
        <HeroSection />
      </div>
    </>
  );
};

export default Home;

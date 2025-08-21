import Head from "next/head";
import Navigation from "../components/v2/home/NavigationMenu";
import styles from "../styles/pages/v2/home.module.scss";

const Services = () => {
  return (
    <>
      <Head>
        <title>Our Services | The Tarzan Way</title>
        <meta
          name="description"
          content="Discover our comprehensive travel services including AI trip planning, custom itineraries, and personalized travel experiences."
        />
        <meta property="og:title" content="Our Services | The Tarzan Way" />
        <meta
          property="og:description"
          content="Discover our comprehensive travel services including AI trip planning, custom itineraries, and personalized travel experiences."
        />
        <meta property="og:image" content="/logoblack.svg" />
        <link rel="canonical" href={`https://thetarzanway.com/services`} />
      </Head>

      <div className={styles.ttwRevamp}>
        <Navigation />
        <main style={{ padding: "2rem", textAlign: "center", minHeight: "70vh" }}>
          <h1>Our Services</h1>
          <p>Comprehensive travel services for your perfect journey:</p>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li>🤖 AI Trip Planning</li>
            <li>🗺️ Custom Itineraries</li>
            <li>✈️ Flight & Hotel Bookings</li>
            <li>🎯 Personalized Experiences</li>
          </ul>
          <p>More detailed content coming soon...</p>
        </main>
      </div>
    </>
  );
};

export default Services;

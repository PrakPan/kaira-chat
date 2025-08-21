import Head from "next/head";
import Navigation from "../components/v2/home/NavigationMenu";
import styles from "../styles/pages/v2/home.module.scss";

const About = () => {
  return (
    <>
      <Head>
        <title>About Us | The Tarzan Way</title>
        <meta
          name="description"
          content="Learn about The Tarzan Way - your trusted travel companion for creating unforgettable journeys."
        />
        <meta property="og:title" content="About Us | The Tarzan Way" />
        <meta
          property="og:description"
          content="Learn about The Tarzan Way - your trusted travel companion for creating unforgettable journeys."
        />
        <meta property="og:image" content="/logoblack.svg" />
        <link rel="canonical" href={`https://thetarzanway.com/about`} />
      </Head>

      <div className={styles.ttwRevamp}>
        <Navigation />
        <main style={{ padding: "2rem", textAlign: "center", minHeight: "70vh" }}>
          <h1>About The Tarzan Way</h1>
          <p>Your trusted travel companion for creating unforgettable journeys.</p>
          <p>More content coming soon...</p>
        </main>
      </div>
    </>
  );
};

export default About;

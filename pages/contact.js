import Head from "next/head";
import Navigation from "../components/v2/home/NavigationMenu";
import styles from "../styles/pages/v2/home.module.scss";

const Contact = () => {
  return (
    <>
      <Head>
        <title>Contact Us | The Tarzan Way</title>
        <meta
          name="description"
          content="Get in touch with The Tarzan Way team. We're here to help you plan your perfect travel experience."
        />
        <meta property="og:title" content="Contact Us | The Tarzan Way" />
        <meta
          property="og:description"
          content="Get in touch with The Tarzan Way team. We're here to help you plan your perfect travel experience."
        />
        <meta property="og:image" content="/logoblack.svg" />
        <link rel="canonical" href={`https://thetarzanway.com/contact`} />
      </Head>

      <div className={styles.ttwRevamp}>
        <Navigation />
        <main style={{ padding: "2rem", textAlign: "center", minHeight: "70vh" }}>
          <h1>Contact Us</h1>
          <p>Get in touch with our travel experts!</p>
          <div style={{ margin: "2rem 0" }}>
            <p>📞 Phone: +91 95821 25476</p>
            <p>📧 Email: info@thetarzanway.com</p>
            <p>🌐 Website: thetarzanway.com</p>
          </div>
          <p>Contact form and more details coming soon...</p>
        </main>
      </div>
    </>
  );
};

export default Contact;

import { useEffect } from "react";
import Head from "next/head";
import { connect, useSelector } from "react-redux";
import BotApp from "../../components/bot-components/BotAppClient";
import setHotLocationSearch from "../../store/actions/hotLocationSearch";
import * as authaction from "../../store/actions/auth";

// Keyword split from the homepage: the homepage targets "AI trip planner";
// this page targets "AI travel agent" / "plan my trip with AI".
const CHAT_TITLE = "AI Travel Agent — Plan My Trip with AI | The Tarzan Way";
const CHAT_DESCRIPTION =
  "Plan your trip with AI. Kaira is an AI travel agent that builds a complete, bookable itinerary in seconds — flights, stays, activities and routes — reviewed by a local human expert before it reaches you.";

const ChatPage = ({ checkAuthState }) => {
  useEffect(() => {
    checkAuthState();
  }, []);

  // The chat fills the viewport, so the SEO signal lives in the head (title,
  // description, canonical, OG, structured data) rather than a visible content
  // block — that keeps the keyword targeting crawlable with no extra page
  // scroll. A visible-but-hidden shell would be devalued by Google (it renders
  // JS and indexes the rendered DOM), so it is intentionally omitted here.
  const appLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Kaira — AI Travel Agent",
    url: "https://thetarzanway.com/chat",
    applicationCategory: "TravelApplication",
    operatingSystem: "Web",
    description: CHAT_DESCRIPTION,
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    provider: {
      "@type": "TravelAgency",
      name: "The Tarzan Way",
      url: "https://thetarzanway.com",
    },
  };

  return (
    <>
      <Head>
        <title>{CHAT_TITLE}</title>
        <meta name="description" content={CHAT_DESCRIPTION} />
        <link rel="canonical" href="https://thetarzanway.com/chat" />
        <meta property="og:title" content={CHAT_TITLE} />
        <meta property="og:description" content={CHAT_DESCRIPTION} />
        <meta property="og:url" content="https://thetarzanway.com/chat" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://thetarzanway.com/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(appLd) }}
        />
      </Head>
      <BotApp />
    </>
  );
};

const mapStateToPros = (state) => {
  return {
    token: state.auth.token,
    showLogin: state.auth.showLogin,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    checkAuthState: () => dispatch(authaction.checkAuthState()),
    authCloseLogin: () => dispatch(authaction.authCloseLogin()),
    setHotLocationSearch: (payload) => dispatch(setHotLocationSearch(payload)),
  };
};

export default connect(mapStateToPros, mapDispatchToProps)(ChatPage);

import { useEffect, useRef, useState } from "react";
import Theme from "../public/Theme";
import "../styles.css";
import "../styles/globals.css";
import { store } from "../store/store";
import "bootstrap/dist/css/bootstrap.min.css";
import "overlayscrollbars/overlayscrollbars.css";
import { useRouter } from "next/router";
import * as ga from "../services/ga/Index";
import { FACEBOOK_PIXEL_ID } from "../services/constants";
import { GOOGLE_CLIENT_ID } from "../services/constants";
import { GoogleOAuthProvider } from "@react-oauth/google";
import dynamic from "next/dynamic";
import Head from "next/head";
import Script from "next/script";

function MyApp({ Component, pageProps, store }) {
  const router = useRouter();
  const ref = useRef();
  const [isChatbotLoaded, setIsChatBotLoaded] = useState(false);
  useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  useEffect(() => {
    const handleRouteChange = (url) => {
      ga.pageview(url);
    };
    //When the component is mounted, subscribe to router changes
    //and log those page views
    router.events.on("routeChangeComplete", handleRouteChange);

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method
    import("react-facebook-pixel")
      .then((x) => x.default)
      .then((ReactPixel) => {
        ReactPixel.init(FACEBOOK_PIXEL_ID); // facebookPixelId
        ReactPixel.pageView();

        router.events.on("routeChangeComplete", () => {
          ReactPixel.pageView();
        });
      });
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);
  
  return (
    <>
      <Head>
        <meta
          name="google-site-verification"
          content="JBrEGecffz4oDnRTLJNj0Mxly-wVGeieQdS1k7NZvaY"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=5"
        ></meta>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <link
        rel="stylesheet"
        href="https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/themes/df-messenger-default.css"
      />
      <Script
        src="https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/df-messenger.js"
        async
        onLoad={() => {setIsChatBotLoaded(true)}}
      />
      {typeof window !== "undefined" && isChatbotLoaded && (
        <>
          <df-messenger
            location="asia-south1"
            project-id="ai-chabot-451908"
            agent-id="7a31b76b-858c-4efe-837a-43fb35d5b8f5"
            language-code="en"
            intent="WELCOME"
          >
            
            <df-messenger-chat-bubble chat-title="Personalized Travel Plan"            
            //  chat-icon="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" to change floater icon, change this link

             ></df-messenger-chat-bubble>
          </df-messenger>
        </>
      )}

      <style>
        {`
          df-messenger {
            z-index: 1024;

            position:fixed;
            --df-messenger-font-color: #333333;
            --df-messenger-font-family: "Poppins", sans-serif;
            --df-messenger-chat-background: #F3F6FC;
            --df-messenger-message-user-background: #ffffff;
            --df-messenger-message-bot-background: #F7e700;
            --df-messenger-input-placeholder-color: #757575;
            --df-messenger-input-text-color: #000000;
            --df-messenger-send-icon: #007bff;
            --df-messenger-chat-window-height:calc(100vh - 80px);
            --df-messenger-chat-window-width: 33vw; 
            --df-messenger-border-radius: 20px;
            --df-messenger-button-image: url('https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg');
            bottom: 0;
            right: 0;
            padding:4px;
            border:4px;
            border-radius:6px;
        }
}

        `}
      </style>
      <div ref={ref}>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <Theme>
            <Component {...pageProps} />
          </Theme>
        </GoogleOAuthProvider>
      </div>
    </>
  );
}
MyApp.getInitialProps = async ({ Component, ctx }) => {
  return {
    pageProps: {
      ...(Component.getInitialProps
        ? await Component.getInitialProps(ctx)
        : {}),
    },
  };
};

export default dynamic(() => Promise.resolve(store.withRedux(MyApp)), {
  ssr: false,
});

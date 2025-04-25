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
import styled from 'styled-components';

function MyApp({ Component, pageProps, store }) {
  const router = useRouter();
  const ref = useRef();
  useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);
  // useEffect(() => {
  //   try {
  //     if (!window.location.href.split("/").includes("itinerary")) return;

  //   setTimeout(() => {
  //     (function () {
  //       function getElement(xpath) {
  //         return document.evaluate(
  //           xpath,
  //           document,
  //           null,
  //           XPathResult.FIRST_ORDERED_NODE_TYPE,
  //           null
  //         ).singleNodeValue;
  //       }

  //       let dfMessengerBubble = getElement(
  //         "/html/body/df-messenger/div/df-messenger-chat-bubble"
  //       );
  //       if (!dfMessengerBubble)
  //         return console.error("df-messenger-chat-bubble not found");

  //       let dfMessengerChat =
  //         dfMessengerBubble?.shadowRoot.querySelector("df-messenger-chat");
  //       if (!dfMessengerChat)
  //         return console.error("df-messenger-chat not found");

  //       let userInputContainer = dfMessengerChat?.shadowRoot.querySelector(
  //         "df-messenger-user-input"
  //       );
  //       if (!userInputContainer)
  //         return console.error("df-messenger-user-input not found");

  //       let textArea =
  //         userInputContainer?.shadowRoot.querySelector("textarea");
  //       if (!textArea) return console.error("Textarea not found");

  //       textArea.value = `Give me more detail about this itinerary ${window.location.href}`;

  //       const enterEvent = new KeyboardEvent("keydown", {
  //         key: "Enter",
  //         code: "Enter",
  //         keyCode: 13,
  //         which: 13,
  //         bubbles: true,
  //       });
  //       textArea.dispatchEvent(enterEvent);
  //     })();
  //   }, 2000);
  //   } catch (error) {
  //     console.log("Error is:",error)
  //   }
  // }, []);
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
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
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

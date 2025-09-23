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
import styled from "styled-components";
import Script from "next/script";
import restartBot from "../helper/RestartBot";
import { useDispatch } from "react-redux";
import { authLogout } from "../store/actions/auth";
import { cleanExpiredLocalStorage } from "../services/localStorageUtils";
import JupiterAnalytics from "../components/jupyterAnalytics";

function MyApp({ Component, pageProps, store }) {
  const router = useRouter();
  const ref = useRef();
  const dispatch=useDispatch()
  useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  useEffect(() => {
    cleanExpiredLocalStorage(); 
  }, []);

  function setupTokenExpiryWatcher() {
    const expiry = localStorage.getItem('expirationDate');
    console.log("expiry is:",expiry)
    if (!expiry) return;
  
    const timeLeft = new Date(expiry).getTime()- Date.now();
    console.log("time left is:",timeLeft)
    if (timeLeft <= 0) {
    } else {
      setTimeout(() => {
        dispatch(authLogout());
        localStorage.removeItem("access_token");
        localStorage.removeItem("name");
        localStorage.removeItem("email");
        localStorage.removeItem("phone");
        localStorage.removeItem("user_id");
        localStorage.removeItem("expirationDate");
        localStorage.removeItem("MyPlans");
        localStorage.removeItem("user_image");
        restartBot()
      }, timeLeft);
    }
  }
  
  // Run this once on app load
  setupTokenExpiryWatcher();
  

  // useEffect(() => {
  //   const handleBrowserBack = (event) => {
  //     event.preventDefault();
  //     console.log("Browser back button pressed!");

  //     const confirmLeave = window.confirm("Are you sure you want to go back?");
  //     if (confirmLeave) {
  //       window.history.back(); // Allow back
  //     } else {
  //       window.history.pushState(null, null, window.location.href); // Stay on page
  //     }
  //   };

  //   if (typeof window !== "undefined") {
  //     window.history.pushState(null, null, window.location.href); // push a dummy state
  //     window.addEventListener("popstate", handleBrowserBack);
  //   }

  //   return () => {
  //     window.removeEventListener("popstate", handleBrowserBack);
  //   };
  // }, []);
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
  // In a client-side context
  
  


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
      <body>
        <Script
          src="https://app.crmone.com/assets/scripts/integrate-widgets.js"
          strategy="afterInteractive"
          onLoad={() => {
            console.log("CRMOne bot script loaded");
            restartBot(); // Start bot once script is ready
          }}
        />
      </body>
      <div ref={ref}>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <Theme>
             <JupiterAnalytics 
        apiEndpoint="/api/jupiter-analytics/track"
        apiKey={process.env.NEXT_PUBLIC_JUPITER_API_KEY}
        userId={pageProps.user?.id}
        batchSize={10}
        flushInterval={5000}
      />
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

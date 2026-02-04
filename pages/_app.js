import { useEffect, useRef } from "react";
import Theme from "../public/Theme";
import "../styles.css";
import "../styles/globals.css";
import { store } from "../store/store";
import "bootstrap/dist/css/bootstrap.min.css";
import "overlayscrollbars/overlayscrollbars.css";
import { useRouter } from "next/router";
import * as ga from "../services/ga/Index";
import { FACEBOOK_PIXEL_ID, GOOGLE_CLIENT_ID } from "../services/constants";
import { GoogleOAuthProvider } from "@react-oauth/google";
import dynamic from "next/dynamic";
import Head from "next/head";
import Script from "next/script";
import { useDispatch, useSelector } from "react-redux";
import { authLogout } from "../store/actions/auth";
import { cleanExpiredLocalStorage } from "../services/localStorageUtils";

// Polyfill for requestIdleCallback (Safari compatibility)
if (typeof window !== "undefined" && !window.requestIdleCallback) {
  window.requestIdleCallback = function (callback) {
    const start = Date.now();
    return setTimeout(function () {
      callback({
        didTimeout: false,
        timeRemaining: function () {
          return Math.max(0, 50 - (Date.now() - start));
        },
      });
    }, 1);
  };
  window.cancelIdleCallback = function (id) {
    clearTimeout(id);
  };
}

// Lazy-loaded components (non-critical)
const ClarityInit = dynamic(() => import("../components/ClarityInit"), {
  ssr: false,
});

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const ref = useRef();
  const dispatch = useDispatch();
  const { id } = useSelector((state) => state.auth);

  // Remove server-side JSS to avoid FOUC
  useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) jssStyles.parentElement.removeChild(jssStyles);
  }, []);

  // Clean expired local storage
  useEffect(() => {
    cleanExpiredLocalStorage();
  }, []);

  // Token expiry watcher
  useEffect(() => {
    if (typeof window === "undefined") return;

    const expiry = localStorage.getItem("expirationDate");
    if (!expiry) return;

    const timeLeft = new Date(expiry).getTime() - Date.now();
    if (timeLeft <= 0) {
      dispatch(authLogout());
      localStorage.clear();
    } else {
      const timer = setTimeout(() => {
        dispatch(authLogout());
        [
          "access_token",
          "name",
          "email",
          "phone",
          "user_id",
          "expirationDate",
          "MyPlans",
          "user_image",
        ].forEach((key) => localStorage.removeItem(key));
      }, timeLeft);
      return () => clearTimeout(timer);
    }
  }, []);

  // Analytics & routing
  useEffect(() => {
    const handleRouteChange = (url) => {
      requestIdleCallback(() => {
        ga.pageview(url);
        if (window.fbq) window.fbq("track", "PageView");
        if (window.JupiterAnalytics?.trackPageView)
          window.JupiterAnalytics.trackPageView(url);
      });
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => router.events.off("routeChangeComplete", handleRouteChange);
  }, [router.events]);

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=5"
        />
        <meta
          name="google-site-verification"
          content="JBrEGecffz4oDnRTLJNj0Mxly-wVGeieQdS1k7NZvaY"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      {/* Google Analytics */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-EV1KHKN8VV"
        strategy="afterInteractive"
      />
      <Script strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-EV1KHKN8VV');
        `}
      </Script>

      {/* Facebook Pixel */}
      <Script strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}
          (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${FACEBOOK_PIXEL_ID}');
          fbq('track', 'PageView');
        `}
      </Script>

      {/* Jupiter Analytics */}
      <Script
        src="https://dev.jupiter.tarzanway.com/jupiter.js"
        strategy="afterInteractive"
      />
      <Script strategy="afterInteractive">
        {`
          if(window.JupiterAnalytics){
            window.JupiterAnalytics.init({ siteId: 'tarzanway-web', apiHost: 'https://dev.jupiter.tarzanway.com' });
          }
        `}
      </Script>

      <div id="modal-root"></div>

      {/* App */}
      <div ref={ref}>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <ClarityInit />
          <Theme>
            <Component {...pageProps} />
          </Theme>
        </GoogleOAuthProvider>
      </div>

      {/* CRMOne Bot */}
      <Script
        src="https://app.crmone.com/assets/scripts/integrate-widgets.js"
        strategy="afterInteractive"
      />
    </>
  );
}

// Support for page-level getInitialProps
MyApp.getInitialProps = async ({ Component, ctx }) => {
  return {
    pageProps: {
      ...(Component.getInitialProps
        ? await Component.getInitialProps(ctx)
        : {}),
    },
  };
};

// Wrap Redux store and disable SSR for heavy hydration
export default dynamic(() => Promise.resolve(store.withRedux(MyApp)), {
  ssr: false,
});
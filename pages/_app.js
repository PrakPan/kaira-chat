import { useEffect, useRef, useState } from "react";
import Theme from "../public/Theme";
import "../styles.css";
import "../styles/globals.css";
import { store } from "../store/store";
import "bootstrap/dist/css/bootstrap.min.css";
import "overlayscrollbars/overlayscrollbars.css";
import "../containers/itinerary/typography.css";
import "../styles/kaira-sidebar.css";
import { useRouter } from "next/router";
import * as ga from "../services/ga/Index";
import { FACEBOOK_PIXEL_ID, GOOGLE_CLIENT_ID, JUPITER_HOST } from "../services/constants";
import { GoogleOAuthProvider } from "@react-oauth/google";
import dynamic from "next/dynamic";
import Head from "next/head";
import Script from "next/script";
import { useDispatch, useSelector } from "react-redux";
import { authLogout } from "../store/actions/auth";
import { cleanExpiredLocalStorage } from "../services/localStorageUtils";
import { bootstrapUserLocation } from "../services/userLocationBootstrap";
import { changeUserLocation } from "../store/actions/userLocation";
import { usePathname } from "next/navigation";
import JupyterAnalytics from "../components/JupyterAnalytics";
import { captureAdParams, captureLandingPage } from "../helper/adAttribution";

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

// Browser fullscreen on the user's first tap (Android Chrome/Firefox, iPad
// Safari; a silent no-op on iPhone, which has no element fullscreen). Renders
// nothing — it is an effect with a component's lifecycle. ssr:false keeps it
// out of the server payload; it is not needed for first paint.
const FullscreenOnFirstGesture = dynamic(
  () => import("../components/FullscreenOnFirstGesture"),
  { ssr: false },
);

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const ref = useRef();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [currentPath, setCurrentPath] = useState('');
  const newPath=usePathname()


  const [jupiterInitialized, setJupiterInitialized] = useState(false);
  const initializationAttempts = useRef(0);
  const maxAttempts = 10;
  const { id } = useSelector(state => state.auth);
  const userLocation = useSelector((state) => state.UserLocation?.location);

  useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) jssStyles.parentElement.removeChild(jssStyles);
  }, []);

  // Clean expired local storage
  useEffect(() => {
    cleanExpiredLocalStorage();
  }, []);

  // Resolve + cache the visitor's location app-wide (3-day cache, Delhi
  // fallback) so the location field never hangs on "Getting your location…".
  useEffect(() => {
    bootstrapUserLocation((loc) => dispatch(changeUserLocation({ location: loc })));
  }, [dispatch]);

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
        // Pass the title too — without it every page_view landed with
        // page_title: undefined.
        if (window.JupiterAnalytics?.trackPageView)
          window.JupiterAnalytics.trackPageView(url, document.title);
      });
    };

    // routeChangeComplete only covers client-side navigations, so the very
    // first page of a visit — the landing page, and every deep link and
    // refresh — was never reported to Jupiter at all. Fire it once here, after
    // the tracker has had a chance to load (it is an afterInteractive script,
    // so it isn't on window yet when this effect first runs).
    let cancelled = false;
    const trackInitialPageView = (attempt = 0) => {
      if (cancelled) return;
      if (window.JupiterAnalytics?.trackPageView) {
        window.JupiterAnalytics.trackPageView(
          router.asPath,
          document.title,
        );
        return;
      }
      if (attempt < 20) setTimeout(() => trackInitialPageView(attempt + 1), 500);
    };
    trackInitialPageView();

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      cancelled = true;
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  // Persist ad attribution params (utm_*, gclid, ...) across navigation:
  // capture from the URL into sessionStorage, then re-append any missing ones
  // back onto the URL so they stay visible as the user navigates.
  useEffect(() => {
    if (!router.isReady) return;

    // First-touch: remember the very first page the user landed on so it can be
    // sent as `landing_page` when a chat is later initiated from /chat.
    captureLandingPage();

    const persistAdParams = () => {
      const stored = captureAdParams();

      // Add-only: never overwrite a param already present in the URL. This
      // protects overloaded keys like `source` (e.g. `?source=tailored`).
      const missing = {};
      Object.entries(stored).forEach(([key, value]) => {
        if (router.query[key] === undefined) missing[key] = value;
      });

      if (Object.keys(missing).length > 0) {
        router.replace(
          { pathname: router.pathname, query: { ...router.query, ...missing } },
          undefined,
          { shallow: true },
        );
      }
    };

    persistAdParams();
    router.events.on("routeChangeComplete", persistAdParams);
    return () => router.events.off("routeChangeComplete", persistAdParams);
  }, [router.isReady, router.events]);

  return (
    <>
      <Head>
        {/* The single viewport for the whole app (Next disallows it in _document).

            `viewport-fit=cover` lets the page paint edge to edge — under the
            notch/dynamic island, under the home indicator, under a display
            cutout in landscape. It is also what makes every
            `env(safe-area-inset-*)` in this codebase resolve to something other
            than 0 on iOS: without it those values are hard 0 and the padding
            they guard silently does nothing. See the --safe-* tokens in
            styles/globals.css for the tokens to pad with.

            `interactive-widget=resizes-content` is what makes the on-screen
            keyboard shrink the LAYOUT viewport rather than only the visual one.
            Chrome's default (`resizes-visual`) leaves the layout viewport — and
            therefore `100dvh`, and therefore the app shell — at full height when
            the keyboard opens, so the shell's bottom row stays exactly where it
            was: underneath the keyboard. That is why Kaira's composer went out
            of reach on Android the moment it was focused, while iOS (which
            ignores this key and scrolls the field into view itself) was fine.
            With `resizes-content` the shell shrinks to the space above the
            keyboard and its foot rides up with it. */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content"
        />
        {/* Default title; per-page <title> tags override this via next/head
            deduplication, so every page ends up with exactly one title. */}
        <title>AI Trip Planner & Custom Travel Itineraries | The Tarzan Way</title>
        <meta
          name="google-site-verification"
          content="JBrEGecffz4oDnRTLJNj0Mxly-wVGeieQdS1k7NZvaY"
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

      {/* Jupiter Analytics is loaded by <JupyterAnalytics /> below (which pulls
          /jupyter-partytown.js and owns window.JupiterAnalytics). There used to
          be a second loader here for `${JUPITER_HOST}/jupiter.js` — that URL
          404s, and its companion inline script called
          window.JupiterAnalytics.init(), a method the real tracker doesn't
          expose, so it threw and raced the real tracker for the same global. */}

      <div id="modal-root"></div>

      {/* App */}
      <div ref={ref}>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <ClarityInit />
          <FullscreenOnFirstGesture />
          <Theme>
            <JupyterAnalytics
              apiEndpoint={JUPITER_HOST}
              userId={id || null}
              batchSize={10}
              flushInterval={3000}
              siteId="tarzanway-web"
              anonymousId="abc"
            /> 
           
            <Component {...pageProps}  />
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

// Wrap Redux store. next-redux-wrapper's withRedux is SSR-safe, so the app is
// server-rendered normally — do NOT wrap this in dynamic(ssr:false), which
// blanks the entire tree on the server (empty <div id="__next">) and defeats
// SSR/SEO. Fix any hydration mismatch at the specific component instead.
export default store.withRedux(MyApp);
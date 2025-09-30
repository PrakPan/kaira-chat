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
import { useDispatch, useSelector } from "react-redux";
import { authLogout } from "../store/actions/auth";
import Loading from "./loading";
import { usePathname } from "next/navigation";
import { cleanExpiredLocalStorage } from "../services/localStorageUtils";
import JupiterAnalytics from "../components/jupyterAnalytics";

function MyApp({ Component, pageProps, store }) {
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

  useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  useEffect(() => {
    cleanExpiredLocalStorage();
  }, []);

  useEffect(() => {
    if(currentPath=="") {
      setCurrentPath(newPath)
      return
    }
    const handleStart = (url) => {
      const isSameItineraryPage = currentPath===newPath
      
      if (isSameItineraryPage) {
        return;
      }
      setCurrentPath(newPath)
      
      setLoading(true);
    };
    
    const handleComplete = (url) => {
      setCurrentPath(newPath);
      setLoading(false);
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router, currentPath]);

  function setupTokenExpiryWatcher() {
    if (typeof window === 'undefined') return;
    
    const expiry = localStorage.getItem('expirationDate');
    if (!expiry) return;

    const timeLeft = new Date(expiry).getTime() - Date.now();
    
    if (timeLeft <= 0) {
      dispatch(authLogout());
      localStorage.clear();
      restartBot();
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
      }, timeLeft);
    }
  }

  useEffect(() => {
    setupTokenExpiryWatcher();
  }, []);

  useEffect(() => {
    const handleRouteChange = (url) => {
      ga.pageview(url);
      
      // Track with Jupiter Analytics if available
      if (window.JupiterAnalytics?.trackPageView) {
        window.JupiterAnalytics.trackPageView(url);
      }

      // Facebook Pixel - only on client side
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'PageView');
      }
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    // Initialize Facebook Pixel - ONLY on client side
    if (typeof window !== 'undefined') {
      import("react-facebook-pixel")
        .then((x) => x.default)
        .then((ReactPixel) => {
          ReactPixel.init(FACEBOOK_PIXEL_ID);
          ReactPixel.pageView();
        })
        .catch(err => console.error('Facebook Pixel load error:', err));
    }

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  // Jupiter Analytics initialization
  useEffect(() => {
    if (typeof window === 'undefined' || jupiterInitialized) return;

    const tryInitialize = () => {
      initializationAttempts.current += 1;

      if (window.JupiterAnalytics) {
        const analytics = window.JupiterAnalytics;
        
        // Try different initialization methods
        const initMethods = [
          'initializeAnalytics',
          'init',
          'initialize'
        ];

        for (const method of initMethods) {
          if (typeof analytics[method] === 'function') {
            try {
              analytics[method]({
                userId: id || null,
                siteId: 'tarzanway-web',
                apiHost: 'https://dev.jupiter.tarzanway.com',
                anonymousId: "abc",
              });
              setJupiterInitialized(true);
              console.log(`✅ Jupiter initialized via ${method}`);
              return;
            } catch (error) {
              console.error(`Error with ${method}:`, error);
            }
          }
        }
      }

      // Retry if not successful and under max attempts
      if (initializationAttempts.current < maxAttempts) {
        setTimeout(tryInitialize, 1000);
      } else {
        console.warn('⚠️ Jupiter Analytics initialization failed');
        setJupiterInitialized(true);
      }
    };

    const initTimeout = setTimeout(tryInitialize, 1000);
    return () => clearTimeout(initTimeout);
  }, [id, jupiterInitialized]);

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
      </Head>

      <div id="modal-root"></div>
      {loading && <Loading />}

      {/* CRMOne bot - load after page is interactive */}
      <Script
        src="https://app.crmone.com/assets/scripts/integrate-widgets.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log("CRMOne bot script loaded");
          if (typeof restartBot === 'function') {
            restartBot();
          }
        }}
      />

      <div ref={ref}>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <Theme>
            <JupiterAnalytics
              apiEndpoint="https://dev.jupiter.tarzanway.com"
              userId={id || null}
              batchSize={10}
              flushInterval={3000}
              siteId="tarzanway-web"
              anonymousId="abc"
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
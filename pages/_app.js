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
  const dispatch = useDispatch();
  const [jupiterInitialized, setJupiterInitialized] = useState(false);
  const initializationAttempts = useRef(0);
  const maxAttempts = 10; // Limit retry attempts

  useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  useEffect(() => {
    cleanExpiredLocalStorage(); 
  }, []);

  const [partytownStatus, setPartytownStatus] = useState('checking');

  // Debug Partytown initialization
  useEffect(() => {
    const checkPartytown = () => {
      console.log('🔍 Checking Partytown status...');
      
      fetch('/~partytown/partytown-sw.js')
        .then(response => {
          console.log('📁 Partytown SW file accessible:', response.ok);
          if (!response.ok) {
            setPartytownStatus('files_missing');
            console.error('❌ Run: npx partytown copylib public/~partytown');
          }
        })
        .catch(err => {
          console.error('❌ Partytown files not found:', err);
          setPartytownStatus('files_missing');
        });

      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
          const partytownSW = registrations.find(sw => 
            sw.scope.includes('partytown') || 
            sw.active?.scriptURL.includes('partytown')
          );
          console.log('🔧 Partytown Service Worker found:', !!partytownSW);
          if (partytownSW) {
            setPartytownStatus('active');
          }
        });
      }

      setTimeout(() => {
        const testPassed = window.PARTYTOWN_TEST_PASSED;
        const jupiterLoaded = window.JupiterAnalytics;
        
        console.log('🧪 Test results:', {
          partytown_test: testPassed,
          jupiter_loaded: !!jupiterLoaded,
          jupiter_ready: jupiterLoaded?.getState?.()?.isInitialized
        });

        if (testPassed && jupiterLoaded) {
          setPartytownStatus('working');
        } else if (!testPassed) {
          setPartytownStatus('scripts_failed');
        }
      }, 3000);
    };

    if (document.readyState === 'complete') {
      checkPartytown();
    } else {
      window.addEventListener('load', checkPartytown);
    }

    return () => window.removeEventListener('load', checkPartytown);
  }, []);

  function setupTokenExpiryWatcher() {
    const expiry = localStorage.getItem('expirationDate');
    console.log("expiry is:", expiry);
    if (!expiry) return;
  
    const timeLeft = new Date(expiry).getTime() - Date.now();
    console.log("time left is:", timeLeft);
    if (timeLeft <= 0) {
      // Token already expired, logout immediately
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
        restartBot();
      }, timeLeft);
    }
  }
  
  setupTokenExpiryWatcher();

  useEffect(() => {
    const handleRouteChange = (url) => {
      ga.pageview(url);
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    import("react-facebook-pixel")
      .then((x) => x.default)
      .then((ReactPixel) => {
        ReactPixel.init(FACEBOOK_PIXEL_ID);
        ReactPixel.pageView();
        router.events.on("routeChangeComplete", () => {
          ReactPixel?.pageView();
        });
      });

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  // FIXED: Jupiter Analytics initialization with proper error handling
  useEffect(() => {
    if (typeof window === 'undefined' || jupiterInitialized) return;

    const tryInitialize = () => {
      initializationAttempts.current += 1;
      
      console.log(`🔄 Jupiter initialization attempt ${initializationAttempts.current}/${maxAttempts}`);

      // Check if Jupiter component has exposed initialization method
      if (window.JupiterAnalytics?.initializeAnalytics) {
        try {
          console.log('📦 Calling JupiterAnalytics.initializeAnalytics()');
          window.JupiterAnalytics.initializeAnalytics({
            userId: pageProps.user?.id || null,
            siteId: 'tarzanway-web',
            apiHost: 'https://dev.jupiter.tarzanway.com',
            anonymousId: "abc",
          });
          setJupiterInitialized(true);
          console.log('✅ Jupiter Analytics initialized successfully');
        } catch (error) {
          console.error('❌ Error initializing Jupiter Analytics:', error);
          setJupiterInitialized(true); // Stop retrying on error
        }
      } else if (window.JupiterAnalytics?.init) {
        // Alternative initialization method
        try {
          console.log('📦 Calling JupiterAnalytics.init()');
          window.JupiterAnalytics.init({
            userId: pageProps.user?.id || null,
            siteId: 'tarzanway-web',
            apiHost: 'https://dev.jupiter.tarzanway.com',
            anonymousId: "abc",
          });
          setJupiterInitialized(true);
          console.log('✅ Jupiter Analytics initialized successfully (via init)');
        } catch (error) {
          console.error('❌ Error initializing Jupiter Analytics via init:', error);
          setJupiterInitialized(true);
        }
      } else if (initializationAttempts.current >= maxAttempts) {
        console.warn('⚠️ Jupiter Analytics initialization failed after maximum attempts');
        console.log('Available Jupiter methods:', Object.keys(window.JupiterAnalytics || {}));
        setJupiterInitialized(true); // Stop retrying
      } else {
        console.warn('⏳ JupiterAnalytics not ready yet. Retrying...');
        setTimeout(tryInitialize, 1000); // Increased timeout to reduce spam
      }
    };

    // Start initialization attempts
    const initTimeout = setTimeout(tryInitialize, 1000); // Give components time to mount

    return () => clearTimeout(initTimeout);
  }, [pageProps.user?.id, jupiterInitialized]);

  // Alternative: Handle Jupiter Analytics through ref callback
  const handleJupiterRef = (jupiterInstance) => {
    if (jupiterInstance && !jupiterInitialized) {
      console.log('📦 Jupiter Analytics component mounted, attempting direct initialization');
      try {
        // If the component exposes direct methods
        if (jupiterInstance.initialize) {
          jupiterInstance.initialize({
            userId: pageProps.user?.id || null,
            siteId: 'tarzanway-web',
            apiHost: 'https://dev.jupiter.tarzanway.com',
            anonymousId: "abc",
          });
          setJupiterInitialized(true);
          console.log('✅ Jupiter Analytics initialized via component ref');
        }
      } catch (error) {
        console.error('❌ Error initializing Jupiter via component ref:', error);
      }
    }
  };

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
            restartBot();
          }}
        />
      </body>
      <div ref={ref}>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <Theme>
            <JupiterAnalytics 
              ref={handleJupiterRef}
              apiEndpoint="https://dev.jupiter.tarzanway.com"
              userId={pageProps.user?.id}
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
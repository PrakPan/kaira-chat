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
import { useDispatch } from "react-redux";
import { authLogout } from "../store/actions/auth";
import Loading from "./loading";

function MyApp({ Component, pageProps, store }) {
  const router = useRouter();
  const ref = useRef();
  const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
  useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

    useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  function setupTokenExpiryWatcher() {
    const expiry = localStorage.getItem("expirationDate");
    console.log("expiry is:", expiry);
    if (!expiry) return;

    const timeLeft = new Date(expiry).getTime() - Date.now();
    console.log("time left is:", timeLeft);
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
          name="viewport"
          content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=5"
        />
        <meta
          name="google-site-verification"
          content="JBrEGecffz4oDnRTLJNj0Mxly-wVGeieQdS1k7NZvaY"
        />
      </Head>
      {loading&&<Loading/>}
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

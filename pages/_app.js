import { useEffect, useRef } from "react";
import Theme from "../public/Theme";
import "../styles.css";
import "../styles/globals.css";
import { store } from "../store/store";
import "bootstrap/dist/css/bootstrap.min.css";
import "overlayscrollbars/overlayscrollbars.css";
import { useRouter } from "next/router";
import * as ga from "../lib/ga/Index";
import { FACEBOOK_PIXEL_ID } from "../services/constants";
import dynamic from "next/dynamic";
import media from "../components/media";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GOOGLE_CLIENT_ID } from "../services/constants";

function MyApp({ Component, pageProps, store }) {
  const router = useRouter();
  const ref = useRef();
  let isPageWide = media("(min-width: 768px)");

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
    <div ref={ref}>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <Theme>
          <Component {...pageProps} />
        </Theme>
      </GoogleOAuthProvider>
    </div>
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

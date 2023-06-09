import { useEffect, useState } from 'react';
import '../styles/globals.css';
import Theme from '../public/Theme';
import '../styles.css';
import { store } from '../store/store';
import 'bootstrap/dist/css/bootstrap.min.css';

import 'bootstrap/dist/css/bootstrap.min.css';

// import { hotjar } from 'react-hotjar'

import { useRouter } from 'next/router';

import * as ga from '../lib/ga/Index';
import { FACEBOOK_PIXEL_ID } from '../services/constants';
import mixpanel from 'mixpanel-browser';
import dynamic from 'next/dynamic';

function MyApp({ Component, pageProps, store }) {
  const router = useRouter();
  useEffect(() => {
    // mixpanel.init('a87174a5773c86d78b1c1b8d51015a16', {debug: true, ignore_dnt: true});

    // mixpanel.track('Sign up');
    // window.scrollTo(0, 0);
    // localStorage.removeItem('access_token');
    // Remove the server-side injected CSS.
    // const { asPath } = useRouter()
    // hotjar.initialize(HOTJAR_HJID, HOTJAR_HJSV)

    const jssStyles = document.querySelector('#jss-server-side');
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
    router.events.on('routeChangeComplete', handleRouteChange);

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method
    import('react-facebook-pixel')
      .then((x) => x.default)
      .then((ReactPixel) => {
        ReactPixel.init(FACEBOOK_PIXEL_ID); // facebookPixelId
        ReactPixel.pageView();

        router.events.on('routeChangeComplete', () => {
          ReactPixel.pageView();
        });
      });
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  useEffect(() => {
  console.log('NARUTO')
},[])

  // Freshchat bot :-
  var name
    if(localStorage.getItem("name")) name = localStorage.getItem("name").split(" ");
 var email = localStorage.getItem("email");
  
  useEffect(() => {
     function handleWidgetLoaded() {
         
          if (name.length && email) {
            window.fcWidget.user.setFirstName(name[0]);
            window.fcWidget.user.setEmail(email);
          }
      }

    if (window.fcWidget) {
      // If the widget is already available, add the event listener
      window.fcWidget.on('widget:loaded', handleWidgetLoaded);
    } else {
      // If the widget is not available, wait for it to be loaded
      window.fcWidgetOnload = handleWidgetLoaded;
    }

    return () => {
      // Clean up the event listener on component unmount
      if (window.fcWidget) {
        window.fcWidget.off('widget:loaded', handleWidgetLoaded);
      }
    };
  }, []);

  
  return (
    <Theme>
      <Component {...pageProps} />
    </Theme>
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

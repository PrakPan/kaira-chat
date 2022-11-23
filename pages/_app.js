import {useEffect} from 'react'
import '../styles/globals.css'
import Theme from '../public/Theme';
import '../styles.css'
 import {store} from '../store/store';
import 'bootstrap/dist/css/bootstrap.min.css'
 
import 'bootstrap/dist/css/bootstrap.min.css'
 
// import { hotjar } from 'react-hotjar'

import { useRouter } from 'next/router'
 
import * as ga from '../lib/ga/Index';
import {FACEBOOK_PIXEL_ID} from '../services/constants';

function MyApp({ Component, pageProps, store }) {
  const router = useRouter()
 
  useEffect(() => {
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
      ga.pageview(url)
    }
    //When the component is mounted, subscribe to router changes
    //and log those page views
    router.events.on('routeChangeComplete', handleRouteChange)

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method
    import('react-facebook-pixel')
    .then((x) => x.default)
    .then((ReactPixel) => {
      ReactPixel.init(FACEBOOK_PIXEL_ID) // facebookPixelId
      ReactPixel.pageView()

      router.events.on('routeChangeComplete', () => {
        ReactPixel.pageView()
      })
    })
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])
  return   ( <Theme>
     
          <Component {...pageProps} />
        

    </Theme>);

}
MyApp.getInitialProps = async ({ Component, ctx }) => {
  return {
    pageProps: {
      ...(Component.getInitialProps
        ? await Component.getInitialProps(ctx)
        : {})
    }
  };
}
export default store.withRedux(MyApp);
 

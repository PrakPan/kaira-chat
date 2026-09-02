import Document, { Html, Head, Main, NextScript } from "next/document";
import styled, { ServerStyleSheet } from "styled-components";
import { CONTENT_SERVER_HOST, GOOGLE_ANALTICS_ID } from "../services/constants";

const Container = styled.div`
  margin-right: -0.6rem;
  margin-bottom: 5rem;
  @media screen and (min-width: 768px) {
    margin-bottom: 0rem;
    margin-right: 0.2rem;
  }
`;

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet();
    const page = await ctx.renderPage((App) => (props) =>
      sheet.collectStyles(<App {...props} />)
    );
    const styleTags = sheet.getStyleElement();
    return { ...page, styleTags };
  }

  render() {
    const isProduction =
      process.env.NODE_ENV === "production" &&
      !CONTENT_SERVER_HOST.includes("dev");
    const cleanGTMId = GOOGLE_ANALTICS_ID?.replace(/['"]/g, "");

    return (
      <Html id="html" lang="en">
        <Head>
          {/* No <title> or viewport here — a title in _document renders a
              SECOND title tag on every page, and Next.js disallows viewport in
              _document. Both live in _app.js (next/head), which dedupes against
              page-level tags. */}

          {/* ---------- Fonts (non render-blocking, SSR-safe) ----------
              All families in a single request. Loaded as media="print" so the
              CSS download never blocks first paint; the inline script flips it
              to media="all" once it lands. With display=swap, text paints in
              the fallback immediately and swaps in with no invisible-text gap.

              NOTE: a string `onLoad` on <link> is silently dropped by React's
              SSR, so the old preload→stylesheet swap never fired — every Google
              font stayed at rel="preload" and was never applied. That's why
              Instrument Serif fell back to plain (Times) italic. */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="true"
          />

          {/* ALL families in ONE non-blocking request. media="print" keeps the
              CSS download off the critical render path; the inline script below
              flips it to media="all" once it lands. display=swap paints text in
              the fallback face immediately (so LCP fires on that paint) then
              swaps with no invisible-text gap.

              Previously TWO extra rel="stylesheet" links (Geist/Instrument/
              JetBrains Mono, and Poppins) sat below with no media="print" and
              render-blocked first paint by ~1.1s on mobile — the exact thing
              the print-swap above was meant to avoid. They are folded into this
              single request so nothing blocks. */}
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&family=Inter:wght@100;200;300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&family=Poppins:wght@300;400;500;600;700&display=swap"
            media="print"
            data-ttw-fonts="true"
          />
          <script
            dangerouslySetInnerHTML={{
              __html:
                "(function(){var l=document.querySelector('link[data-ttw-fonts]');if(!l)return;if(l.sheet){l.media='all';}else{l.addEventListener('load',function(){l.media='all';});}})();",
            }}
          />
          <noscript>
            <link
              rel="stylesheet"
              href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&family=Inter:wght@100;200;300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&family=Poppins:wght@300;400;500;600;700&display=swap"
            />
          </noscript>

          {/* LCP image: the Kaira avatar is the largest paint on destination
              pages and prominent in the home hero. It is a plain <img> that
              hydrates in behind JS, so without a preload the browser discovers
              it seconds late on mobile. Preload + fetchpriority pulls it to the
              front of the queue. */}
          <link
            rel="preload"
            as="image"
            href="/KairaInsta.jpg"
            fetchpriority="high"
          />

          {/* Google Maps + ChatKit are NOT loaded here anymore (CWV): loading
              them in <head> on every page was a large render-blocking cost.
              ChatKit's CDN bundle was unused (the chat uses a custom hook), so
              it's removed entirely. Google Maps is now loaded on demand by the
              map components via loadGoogleMaps() (utils/loadGoogleMaps). */}


          {/* ---------- Partytown: REMOVED (it never worked) ----------
              <Partytown forward={["gtag","mixpanel"]} /> used to sit here, with
              experimental.nextScriptWorkers in next.config.js.

              It never executed a single script in production. Two different
              `partytown = {...}` globals were being written under the same
              script id "partytown-config": this component's, and the one in
              components/JupyterAnalytics.jsx (forward: ['JupiterAnalytics',
              'JUPITER_CONFIG'], no `lib`). next/script dedupes by id, so the
              two collided and the worker library was never fetched.

              Verified on live production: 0 network requests for partytown.js,
              document.querySelector('script[src*=partytown]') === null. The one
              script assigned to it (the Freshworks widget below) therefore
              never ran, and neither did mixpanel — a script tagged
              type="text/partytown" with no Partytown library is inert.

              So this was pure cost: the inline bootstrap plus a copy of the
              Partytown lib emitted into the export, buying nothing, while
              silently disabling whatever was handed to it. Anything genuinely
              worth moving off the main thread should go into the GTM container
              or use next/script strategy="worker" — which needs a single,
              uncontested partytown config. */}

          {/* ---------- Google Tag Manager ---------- */}
          {isProduction && cleanGTMId && (
            <script
              defer
              dangerouslySetInnerHTML={{
                __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.defer=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${cleanGTMId}');`,
              }}
            />
          )}

          {/* ---------- Google Ads / gtag ---------- */}
          {isProduction && (
            <>
              <script
                defer
                dangerouslySetInnerHTML={{
                  __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
`,
                }}
              />

              <script
                defer
                src="https://www.googletagmanager.com/gtag/js?id=AW-738037519"
              />

              <script
                defer
                dangerouslySetInnerHTML={{
                  __html: `
gtag('js', new Date());
gtag('config', 'AW-738037519');
`,
                }}
              />
            </>
          )}

          {/* ---------- Third-party widgets ---------- */}
          {isProduction && (
            <>
              {/* Freshworks chat widget — LEFT DISABLED ON PURPOSE.

                  This was tagged type="text/partytown", which meant it never
                  executed: confirmed on live production, in.fw-cdn.com is not
                  requested at all. Removing Partytown (above) would have
                  silently switched this widget ON for the first time, so it is
                  commented out instead to keep behaviour identical.

                  The site already runs Kaira and the CRMOne widget, so turning
                  a third chat surface on is a product decision, not a
                  performance one. To enable it, uncomment — as a plain deferred
                  script it will run on the main thread and cost ~1 more
                  third-party connection:

                  <script defer src="//in.fw-cdn.com/30401267/225580.js" chat="false" />
              */}

              {/* Clarity runs on the main thread so its recorder can observe
                  the real DOM. */}
              <script
                dangerouslySetInnerHTML={{
                  __html: `(function(c,l,a,r,i,t,y){
c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "dxk3hzpt0s");`,
                }}
              />
            </>
          )}

          {/* ---------- Mixpanel ---------- */}
          <script
            defer
            dangerouslySetInnerHTML={{
              __html: `(function(f,b){if(!b.__SV){var e,g,i,h;window.mixpanel=b;b._i=[];
b.init=function(e,f,c){function g(a,d){var b=d.split(".");2==b.length&&(a=a[b[0]],d=b[1]);
a[d]=function(){a.push([d].concat(Array.prototype.slice.call(arguments,0)))}}var a=b;
"undefined"!==typeof c?a=b[c]=[]:c="mixpanel";a.people=a.people||[];
a.toString=function(a){var d="mixpanel";"mixpanel"!==c&&(d+="."+c);
a||(d+=" (stub)");return d};a.people.toString=function(){return a.toString(1)+".people (stub)"};
i="disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split(" ");
for(h=0;h<i.length;h++)g(a,i[h]);var j="set set_once union unset remove delete".split(" ");
a.get_group=function(){function b(c){d[c]=function(){call2_args=arguments;
call2=[c].concat(Array.prototype.slice.call(call2_args,0));a.push([e,call2])}}
for(var d={},e=["get_group"].concat(Array.prototype.slice.call(arguments,0)),c=0;c<j.length;c++)
b(j[c]);return d};b._i.push([e,f,c])};b.__SV=1.2;
e=f.createElement("script");e.type="text/javascript";e.async=!0;
e.src="undefined"!==typeof MIXPANEL_CUSTOM_LIB_URL?
MIXPANEL_CUSTOM_LIB_URL:"file:"===f.location.protocol&&"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\/\\//)?
"https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js":"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";
g=f.getElementsByTagName("script")[0];g.parentNode.insertBefore(e,g)}})(document,window.mixpanel||[]);
mixpanel.init('a87174a5773c86d78b1c1b8d51015a16', {debug: false});`,
            }}
          />

          {/* ---------- Favicon / app icons ---------- */}
          <link rel="icon" href="/favicon.ico" sizes="any" />
          <link rel="icon" type="image/svg+xml" href="/logo/ttw-icon.svg" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
          <link rel="manifest" href="/site.webmanifest" />
          <meta name="theme-color" content="#0b1220" />

          {/* ---------- Home-screen web app ----------
              On iPhone this is the ONLY route to a genuinely chrome-free app:
              Safari on iPhone does not implement the Fullscreen API for
              anything but <video> (it works on iPad only), so a tab always
              keeps its address bar. Added to the Home Screen, the same site
              launches with no Safari chrome at all.

              iOS 26 opens every home-screen site as a web app on its own and
              honours the manifest's `display: standalone`, so these tags are
              for older iOS — harmless, and still the only way to name the icon
              and pick the status-bar treatment there.

              status-bar-style `default` keeps the status bar opaque and starts
              the web view BELOW it. `black-translucent` would run the page
              under the clock instead: the bot shell handles that (its header
              pads by --safe-top) but ordinary marketing pages do not, and a
              home-screen launch can land on any of them. */}
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="Tarzan Way" />

          {this.props.styleTags}
        </Head>

        <body>
          <style>
            {`
#chatbot-iframe-container {
  bottom: 0;
  right: 0;
  margin-right: 20px;
  margin-bottom: 10px;
  z-index:1024 !important;
}
#chatbot-iframe-container iframe {
  width: 100%;
  height: 100%;
  border: none;
}
@media (max-width: 765px) {
  #chatbot-iframe-container {
    margin-bottom: 60px;
    margin-right: 16px;
    height: calc(100% - 60px) !important;
    min-height: auto !important;
    width: calc(100% - 20px) !important;
  }
}
`}
          </style>

          {isProduction && (
            <noscript>
              <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${cleanGTMId}`}
                height="0"
                width="0"
                style={{ display: "none", visibility: "hidden" }}
              />
            </noscript>
          )}

          <Main />
          <div id="modal-portal" />
          <div id="popup-portal" />
          <NextScript />
        </body>
      </Html>
    );
  }
}

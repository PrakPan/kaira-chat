import Document, { Html, Head, Main, NextScript } from "next/document";
import styled, { ServerStyleSheet } from "styled-components";
import { CONTENT_SERVER_HOST, GOOGLE_ANALTICS_ID } from "../services/constants";
import Script from "next/script";
import { Partytown } from '@builder.io/partytown/react';

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
    const page = await ctx.renderPage(
      (App) => (props) => sheet.collectStyles(<App {...props} />)
    );

    const styleTags = sheet.getStyleElement();

    
    return { ...page, styleTags };
  }

  render() {
    const isProduction = process.env.NODE_ENV === "production" && !CONTENT_SERVER_HOST.includes("dev");
    
    // Clean the GTM ID by removing any quotes
    const cleanGTMId = GOOGLE_ANALTICS_ID?.replace(/['"]/g, '');

    
    return (
      <Html id="html" lang="en">
        <Head>
          <title>Trip Planner & Itinerary | The Tarzan Way</title>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=5"
          />

          <meta 
  name="viewport" 
  content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" 
/>
          
          
          {/* Partytown Configuration */}
          <Partytown 
            debug={isProduction}
            forward={[
              'gtag', 
              'mixpanel',
            ]}
          />

          {/* Google Tag Manager */}
          {isProduction && cleanGTMId && (
  <>
    {/* Google Tag Manager - Head */}
    <script
      dangerouslySetInnerHTML={{
        __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${cleanGTMId}');`,
      }}
    />
  </>
)}
          {/* {isProduction && (
            <>
              <script
                dangerouslySetInnerHTML={{
                  __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${cleanGTMId}');`,
                }}
              />

              <script
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${cleanGTMId}`}
              />

              <script
                dangerouslySetInnerHTML={{
                  __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${cleanGTMId}', {
              page_path: window.location.pathname,
              });
              `,
                }}
              />
            </>
          )} */}
          {/*  End Google Tag Manager */}

          {/* Partytown Scripts */}
          {isProduction && (
            <>
              <script
                type="text/partytown"
                src="//in.fw-cdn.com/30401267/225580.js"
                chat="false"
              ></script>

              <script
                type="text/partytown"
                dangerouslySetInnerHTML={{
                  __html: ` (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "dxk3hzpt0s");`,
                }}
              />
            </>
          )}

          {/* Mixpanel */}
          <script
            type="text/javascript"
            dangerouslySetInnerHTML={{
              __html: `
                (function(f,b){if(!b.__SV){var e,g,i,h;window.mixpanel=b;b._i=[];b.init=function(e,f,c){function g(a,d){var b=d.split(".");2==b.length&&(a=a[b[0]],d=b[1]);a[d]=function(){a.push([d].concat(Array.prototype.slice.call(arguments,0)))}}var a=b;"undefined"!==typeof c?a=b[c]=[]:c="mixpanel";a.people=a.people||[];a.toString=function(a){var d="mixpanel";"mixpanel"!==c&&(d+="."+c);a||(d+=" (stub)");return d};a.people.toString=function(){return a.toString(1)+".people (stub)"};i="disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split(" ");
                for(h=0;h<i.length;h++)g(a,i[h]);var j="set set_once union unset remove delete".split(" ");a.get_group=function(){function b(c){d[c]=function(){call2_args=arguments;call2=[c].concat(Array.prototype.slice.call(call2_args,0));a.push([e,call2])}}for(var d={},e=["get_group"].concat(Array.prototype.slice.call(arguments,0)),c=0;c<j.length;c++)b(j[c]);return d};b._i.push([e,f,c])};b.__SV=1.2;e=f.createElement("script");e.type="text/javascript";e.async=!0;e.src="undefined"!==typeof MIXPANEL_CUSTOM_LIB_URL?
                MIXPANEL_CUSTOM_LIB_URL:"file:"===f.location.protocol&&"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\/\//)?"https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js":"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";g=f.getElementsByTagName("script")[0];g.parentNode.insertBefore(e,g)}})(document,window.mixpanel||[]);
                mixpanel.init('a87174a5773c86d78b1c1b8d51015a16', {debug: true});
                mixpanel.track('Sign up');
              `,
            }}
          ></script>

          <link
            rel="icon"
            href="https://d31aoa0ehgvjdi.cloudfront.net/media/website/logoyellow.png"
          />

          <link rel="preconnect" href="https://fonts.googleapis.com" />

          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="true"
          />

          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
            rel="stylesheet"
          />

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
              ></iframe>
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
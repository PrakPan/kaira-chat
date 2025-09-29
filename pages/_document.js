// import Document, { Html, Head, Main, NextScript } from "next/document";
// import styled, { ServerStyleSheet } from "styled-components";
// import { CONTENT_SERVER_HOST, GOOGLE_ANALTICS_ID } from "../services/constants";
// import Script from "next/script";
// const Container = styled.div`
//   margin-right: -0.6rem;
//   margin-bottom: 5rem;
//   @media screen and (min-width: 768px) {
//     margin-bottom: 0rem;
//     margin-right: 0.2rem;
//   }
// `;

// export default class MyDocument extends Document {
//   static async getInitialProps(ctx) {
//     // Step 1: Create an instance of ServerStyleSheet
//     const sheet = new ServerStyleSheet();
//     // Step 2: Retrieve styles from components in the page
//     const page = await ctx.renderPage(
//       (App) => (props) => sheet.collectStyles(<App {...props} />)
//     );

//     // Step 3: Extract the styles as <style> tags
//     const styleTags = sheet.getStyleElement();

//     // Step 4: Pass styleTags as a prop
//     return { ...page, styleTags };
//   }

//   render() {
//     return (
//       <Html id="html" lang="en">
//         <Head>
//           <meta
//             name="viewport"
//             content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=5"
//           ></meta>
//           <link
//             rel="stylesheet"
//             href="https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/themes/df-messenger-default.css"
//           />
//           {/* Google Tag Manager */}
//           {process.env.NODE_ENV === "production" &&
//             !CONTENT_SERVER_HOST.includes("dev") && (
//               <>
//                 <script
//                   dangerouslySetInnerHTML={{
//                     __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
//                 new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
//                 j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
//                 'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
//                 })(window,document,'script','dataLayer','${GOOGLE_ANALTICS_ID}');`,
//                   }}
//                 />

//                 <script
//                   async
//                   src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALTICS_ID}`}
//                 />

//                 <script
//                   dangerouslySetInnerHTML={{
//                     __html: `
//                 window.dataLayer = window.dataLayer || [];
//                 function gtag(){dataLayer.push(arguments);}
//                 gtag('js', new Date());
//                 gtag('config', '${GOOGLE_ANALTICS_ID}', {
//                 page_path: window.location.pathname,
//                 });
//                 `,
//                   }}
//                 />
//               </>
//             )}
//           {/*  End Google Tag Manager */}

//           {/* Partytown */}
//           {process.env.NODE_ENV === "production" &&
//             !CONTENT_SERVER_HOST.includes("dev") && (
//               <>
//                 <script
//                   type="text/partytown"
//                   src="//in.fw-cdn.com/30401267/225580.js"
//                   chat="false"
//                 ></script>

//                 <script
//                   type="text/partytown"
//                   dangerouslySetInnerHTML={{
//                     __html: ` (function(c,l,a,r,i,t,y){
//                     c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
//                     t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
//                     y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
//                 })(window, document, "clarity", "script", "dxk3hzpt0s");`,
//                   }}
//                 />
//               </>
//             )}

//           <script
//             type="text/javascript"
//             dangerouslySetInnerHTML={{
//               __html: `
//                 (function(f,b){if(!b.__SV){var e,g,i,h;window.mixpanel=b;b._i=[];b.init=function(e,f,c){function g(a,d){var b=d.split(".");2==b.length&&(a=a[b[0]],d=b[1]);a[d]=function(){a.push([d].concat(Array.prototype.slice.call(arguments,0)))}}var a=b;"undefined"!==typeof c?a=b[c]=[]:c="mixpanel";a.people=a.people||[];a.toString=function(a){var d="mixpanel";"mixpanel"!==c&&(d+="."+c);a||(d+=" (stub)");return d};a.people.toString=function(){return a.toString(1)+".people (stub)"};i="disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split(" ");
//                 for(h=0;h<i.length;h++)g(a,i[h]);var j="set set_once union unset remove delete".split(" ");a.get_group=function(){function b(c){d[c]=function(){call2_args=arguments;call2=[c].concat(Array.prototype.slice.call(call2_args,0));a.push([e,call2])}}for(var d={},e=["get_group"].concat(Array.prototype.slice.call(arguments,0)),c=0;c<j.length;c++)b(j[c]);return d};b._i.push([e,f,c])};b.__SV=1.2;e=f.createElement("script");e.type="text/javascript";e.async=!0;e.src="undefined"!==typeof MIXPANEL_CUSTOM_LIB_URL?
//                 MIXPANEL_CUSTOM_LIB_URL:"file:"===f.location.protocol&&"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\/\//)?"https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js":"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";g=f.getElementsByTagName("script")[0];g.parentNode.insertBefore(e,g)}})(document,window.mixpanel||[]);
//                 mixpanel.init('a87174a5773c86d78b1c1b8d51015a16', {debug: true});
//                 mixpanel.track('Sign up');
//               `,
//             }}
//           ></script>

//           <link
//             rel="icon"
//             href="https://d31aoa0ehgvjdi.cloudfront.net/media/website/logoyellow.png"
//           />

//           <link rel="preconnect" href="https://fonts.googleapis.com" />

//           <link
//             rel="preconnect"
//             href="https://fonts.gstatic.com"
//             crossOrigin="true"
//           />

//           <link
//             href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,600;0,700;0,800;1,300;1,400;1,600;1,700;1,800&display=swap"
//             rel="stylesheet"
//           ></link>

//           <link
//             href="https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,wght@0,200;0,300;0,400;0,600;0,700;0,800;0,900;1,200;1,300;1,400;1,600;1,700;1,800;1,900&display=swap"
//             rel="stylesheet"
//           ></link>

//           <link
//             rel="preconnect"
//             href="https://fonts.gstatic.com"
//             crossOrigin="true"
//           />

//           <link
//             href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
//             rel="stylesheet"
//           />

//           <link
//             href="https://fonts.googleapis.com/css2?family=Lexend:wght@100;200;300;400;500;600;700;800;900&display=swap"
//             rel="stylesheet"
//           />

//           {/* Step 5: Output the styles in the head  */}
//           {this.props.styleTags}
//         </Head>

//         <body>
//           {/* <script src="https://app.crmone.com/assets/scripts/integrate-widgets.js" />
//           <script
//             dangerouslySetInnerHTML={{
//               __html: `
//               createBot({ botId: "680b71a4a47fab68f44972ab" });
//             `,
//             }}
//           /> */}
//           <style>
//           {`
//             #chatbot-iframe-container {
//               bottom: 0;
//               right: 0;
//               margin-right: 20px;
//               margin-bottom: 10px;
//               z-index:1024 !important;
//             }

//             #chatbot-iframe-container iframe {
//               width: 100%;
//               height: 100%;
//               border: none;
//             }


//           @media (max-width: 765px) {
//             #chatbot-iframe-container {
//               margin-bottom: 60px;
//               margin-right: 16px;
//               height: calc(100% - 60px) !important;
//               min-height: auto !important;
//               width: calc(100% - 20px) !important;
//             }
        
//           }
//         `}
//         </style>


//           {/* <script src="https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/df-messenger.js" />
//           <>
//             <df-messenger
//               location="asia-south1"
//               project-id="ai-chabot-451908"
//               agent-id="680b71a4a47fab68f44972ab"
//               language-code="en"
//               intent="WELCOME"
//             >
//               <Container>
//                 <df-messenger-chat-bubble
//                   chat-title="Personalized Travel Plan"
//                   chat-icon="https://images.thetarzanway.com/media/chatbot.png"
//                   chat-title-icon="https://openmoji.org/data/color/svg/1F4AC.svg"
//                   // to change floater icon, change this link
//                 ></df-messenger-chat-bubble>
//               </Container>
//             </df-messenger>

//             <style>
//               {`
//             df-messenger {
//               z-index: 1024;
//               position: fixed;
//               --df-messenger-font-color: #333333;
//               --df-messenger-font-family: "Poppins", sans-serif;
//               --df-messenger-chat-background: #F3F6FC;
//               --df-messenger-message-user-background: #ffffff;
//               --df-messenger-message-bot-background: #F7e700;
//               --df-messenger-input-placeholder-color: #757575;
//               --df-messenger-input-text-color: #000000;
//               --df-messenger-send-icon: #007bff;
//               --df-messenger-chat-window-height: calc(100vh - 80px);
//               --df-messenger-chat-window-width: 40vw;
//               --df-messenger-border-radius: 9px;
//               --df-messenger-button-size: 80px;
//               --df-messenger-chat-bubble-icon-size: 80px;
//               --df-messenger-send-icon-color: black;
//               bottom: 0;
//               right: 0;
//               padding: 4px;
//               border: 4px;
//               border-radius: 6px;
//               margin-right: 20px;
//               margin-bottom: 10px;
//               background-size: contain;
//               background-repeat: no-repeat;
//             }

//             .df-messenger-chat-bubble-icon {
//               margin-top: 5px;
//             }

//             @media (max-width: 768px) {
//               df-messenger {
//                 bottom: 60px;
//                 margin-right: 16px;
//               }
//             }
//           `}
//             </style>
//           </> */}
//           {/* Google Tag Manager (noscript) */}
//           {process.env.NODE_ENV === "production" &&
//             !CONTENT_SERVER_HOST.includes("dev") && (
//               <noscript>
//                 <iframe
//                   src={
//                     "https://www.googletagmanager.com/ns.html?id=" +
//                     GOOGLE_ANALTICS_ID
//                   }
//                   height="0"
//                   width="0"
//                   style={{ display: "none", visibility: "hidden" }}
//                 ></iframe>
//               </noscript>
//             )}
//           {/* End Google Tag Manager (noscript) */}

//           <Main />
//           <div id="modal-portal" />
//           <div id="popup-portal" />

//           <NextScript />
//         </body>
//       </Html>
//     );
//   }
// }


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
    // Step 1: Create an instance of ServerStyleSheet
    const sheet = new ServerStyleSheet();
    // Step 2: Retrieve styles from components in the page
    const page = await ctx.renderPage(
      (App) => (props) => sheet.collectStyles(<App {...props} />)
    );

    // Step 3: Extract the styles as <style> tags
    const styleTags = sheet.getStyleElement();

    // Step 4: Pass styleTags as a prop
    return { ...page, styleTags };
  }

  render() {
    const isProduction = process.env.NODE_ENV === "production" && !CONTENT_SERVER_HOST.includes("dev");
    const isDevelopment = process.env.NODE_ENV === "development";
    
    // Enable Partytown in both dev and prod for testing
    const enablePartytown = true;
    
    // Debug logs
    console.log('🐛 Document render debug:', {
      NODE_ENV: process.env.NODE_ENV,
      CONTENT_SERVER_HOST,
      isProduction,
      isDevelopment,
      enablePartytown
    });
    
    return (
      <Html id="html" lang="en">
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=5"
          />
          
          {enablePartytown && (
            <>
              {console.log('🔧 Rendering Partytown component')}
              <Partytown 
                debug={true}
                forward={[
                  'gtag', 
                  'dataLayer.push', 
                  'fbq',
                  'clarity',
                  'mixpanel',
                  'JupiterAnalytics', 
                  'JUPITER_CONFIG'
                ]}
                // Removed lib="/~partytown/" for static export
              />
              <script
                dangerouslySetInnerHTML={{
                  __html: `
                    console.log('🚀 Partytown config script loaded');
                    partytown = {
                      debug: true,
                      logCalls: true,
                      logGetters: true,
                      logSetters: true,
                      forward: [
                        'gtag', 
                        'dataLayer.push', 
                        'fbq',
                        'clarity',
                        'mixpanel',
                        'JupiterAnalytics', 
                        'JUPITER_CONFIG'
                      ]
                    };
                    console.log('🔧 Partytown config:', partytown);
                  `,
                }}
              />
            </>
          )}

          {/* Test script to verify Partytown is working */}
          {console.log('🧪 Adding Partytown test script')}
          <script
            type="text/partytown"
            src="/partytown-test.js"
          />

          {/* Your custom Jupiter Analytics script - MUST LOAD FIRST */}
          {console.log('📦 Adding Jupiter script')}
          <script
            type="text/partytown"
            dangerouslySetInnerHTML={{
              __html: `
                console.log('📦 Loading Jupiter Analytics inline...');
                
                // Check if we're in a web worker (Partytown context)
                console.log('🔍 Context check - typeof window:', typeof window);
                console.log('🔍 Context check - typeof self:', typeof self);
                console.log('🔍 Context check - typeof importScripts:', typeof importScripts);
                
                // Load the external script
                if (typeof importScripts === 'function') {
                  console.log('🔄 Loading via importScripts...');
                  try {
                    importScripts('/jupyter-partytown.js');
                    console.log('✅ Jupiter script loaded via importScripts');
                  } catch (e) {
                    console.error('❌ ImportScripts failed:', e);
                  }
                } else {
                  console.log('🔄 Loading via script tag...');
                  const script = document.createElement('script');
                  script.src = '/jupyter-partytown.js';
                  script.onload = () => console.log('✅ Jupiter script loaded via script tag');
                  script.onerror = (e) => console.error('❌ Script tag failed:', e);
                  document.head.appendChild(script);
                }
              `
            }}
          />

          {/* Additional debugging script */}
          <script
            type="text/partytown"
            dangerouslySetInnerHTML={{
              __html: `
                // Detailed debugging
                setTimeout(() => {
                  console.log('🔍 Detailed Partytown Status Check:');
                  console.log('- Window object exists:', typeof window !== 'undefined');
                  console.log('- JupiterAnalytics exists:', !!window.JupiterAnalytics);
                  console.log('- JupiterAnalytics type:', typeof window.JupiterAnalytics);
                  
                  if (window.JupiterAnalytics) {
                    console.log('- JupiterAnalytics methods:', Object.keys(window.JupiterAnalytics));
                    
                    // Test the state method
                    try {
                      const state = window.JupiterAnalytics.getState();
                      console.log('- getState() result:', state);
                    } catch (e) {
                      console.error('- getState() error:', e);
                    }
                  }
                  
                  console.log('- All window props containing "Jupiter":', 
                    Object.keys(window).filter(k => k.includes('Jupiter') || k.includes('jupiter')));
                  
                  console.log('- All window props containing "analytics":', 
                    Object.keys(window).filter(k => k.toLowerCase().includes('analytics')));
                    
                  console.log('- PARTYTOWN_TEST_PASSED:', window.PARTYTOWN_TEST_PASSED);
                    
                }, 3000);
              `
            }}
          />
          <script
            type="text/partytown"
            dangerouslySetInnerHTML={{
              __html: `
                // Fallback Jupiter Analytics
                setTimeout(() => {
                  if (typeof window !== 'undefined' && !window.JupiterAnalytics) {
                    console.log('🚨 Creating fallback Jupiter Analytics...');
                    
                    window.JupiterAnalytics = {
                      track: (name, props) => console.log('📊 Track:', name, props),
                      trackBulk: (events) => console.log('📦 Bulk:', events),
                      trackHotelCardClicked: (itin, hotel, source) => console.log('🏨 Hotel click:', itin, hotel, source),
                      getState: () => ({ isInitialized: true, fallback: true }),
                      identifyUser: (id, traits) => console.log('👤 Identify:', id, traits),
                      trackPageView: (page, title, itin) => console.log('📄 Page:', page, title, itin),
                      trackItineraryPageView: (itin, first) => console.log('📋 Itinerary:', itin, first),
                      trackSwitchItinerary: (from, to) => console.log('🔄 Switch:', from, to),
                      trackUserLogin: (id) => console.log('🔐 Login:', id),
                      trackUserLogout: (id) => console.log('🚪 Logout:', id),
                      trackPaymentAttempted: (itin, amt, curr, method, success) => console.log('💳 Payment:', itin, amt, curr, method, success),
                      trackBookingConfirmed: (itin, ids, amt, curr) => console.log('✅ Booking:', itin, ids, amt, curr),
                      trackCTAClicked: (itin, cta, loc) => console.log('🖱️ CTA:', itin, cta, loc),
                      flushEvents: () => console.log('🔄 Flush'),
                      init: () => console.log('🚀 Init fallback')
                    };
                    
                    console.log('✅ Fallback Jupiter Analytics ready');
                  }
                }, 2000);
              `
            }}
          />

          {/* Google Tag Manager */}
          {console.log('📊 Analytics condition check:', { isProduction, isDevelopment, willRender: (isProduction || isDevelopment) })}
          {(isProduction || isDevelopment) && (
            <>
              {console.log('🔥 Rendering Google Analytics scripts')}
              <script
                type="text/partytown"
                dangerouslySetInnerHTML={{
                  __html: `
                    console.log('📡 GTM script starting...');
                    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GOOGLE_ANALTICS_ID}');
                    console.log('✅ GTM script loaded');
                  `,
                }}
              />

              <script
                type="text/partytown"
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALTICS_ID}`}
              />

              <script
                type="text/partytown"
                dangerouslySetInnerHTML={{
                  __html: `
                    console.log('🎯 GTag config script starting...');
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GOOGLE_ANALTICS_ID}', {
              page_path: window.location.pathname,
              });
                    console.log('✅ GTag config loaded');
              `,
                }}
              />
            </>
          )}

          {/* Freshworks and Clarity - now available in dev too */}
          {(isProduction || isDevelopment) && (
            <>
              <script
                type="text/partytown"
                src="//in.fw-cdn.com/30401267/225580.js"
                chat="false"
              />

              <script
                type="text/partytown"
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

          {/* Mixpanel - now with type="text/partytown" */}
          {console.log('🎵 Adding Mixpanel script')}
          <script
            type="text/partytown"
            dangerouslySetInnerHTML={{
              __html: `
                console.log('🎵 Mixpanel script starting...');
                (function(f,b){if(!b.__SV){var e,g,i,h;window.mixpanel=b;b._i=[];b.init=function(e,f,c){function g(a,d){var b=d.split(".");2==b.length&&(a=a[b[0]],d=b[1]);a[d]=function(){a.push([d].concat(Array.prototype.slice.call(arguments,0)))}}var a=b;"undefined"!==typeof c?a=b[c]=[]:c="mixpanel";a.people=a.people||[];a.toString=function(a){var d="mixpanel";"mixpanel"!==c&&(d+="."+c);a||(d+=" (stub)");return d};a.people.toString=function(){return a.toString(1)+".people (stub)"};i="disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split(" ");
                for(h=0;h<i.length;h++)g(a,i[h]);var j="set set_once union unset remove delete".split(" ");a.get_group=function(){function b(c){d[c]=function(){call2_args=arguments;call2=[c].concat(Array.prototype.slice.call(call2_args,0));a.push([e,call2])}}for(var d={},e=["get_group"].concat(Array.prototype.slice.call(arguments,0)),c=0;c<j.length;c++)b(j[c]);return d};b._i.push([e,f,c])};b.__SV=1.2;e=f.createElement("script");e.type="text/javascript";e.async=!0;e.src="undefined"!==typeof MIXPANEL_CUSTOM_LIB_URL?
                MIXPANEL_CUSTOM_LIB_URL:"file:"===f.location.protocol&&"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\/\//)?"https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js":"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";g=f.getElementsByTagName("script")[0];g.parentNode.insertBefore(e,g)}})(document,window.mixpanel||[]);
                console.log('🎵 Mixpanel init starting...');
                mixpanel.init('a87174a5773c86d78b1c1b8d51015a16', {debug: true});
                console.log('🎵 Mixpanel tracking event...');
                mixpanel.track('Sign up');
                console.log('✅ Mixpanel setup complete');
              `,
            }}
          />

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
            href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,600;0,700;0,800;1,300;1,400;1,600;1,700;1,800&display=swap"
            rel="stylesheet"
          />

          <link
            href="https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,wght@0,200;0,300;0,400;0,600;0,700;0,800;0,900;1,200;1,300;1,400;1,600;1,700;1,800;1,900&display=swap"
            rel="stylesheet"
          />

          <link
            href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
            rel="stylesheet"
          />

          <link
            href="https://fonts.googleapis.com/css2?family=Lexend:wght@100;200;300;400;500;600;700;800;900&display=swap"
            rel="stylesheet"
          />

          {/* Step 5: Output the styles in the head  */}
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

          {/* Google Tag Manager (noscript) */}
          {(isProduction || isDevelopment) && (
            <noscript>
              <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${GOOGLE_ANALTICS_ID}`}
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

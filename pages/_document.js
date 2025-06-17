import Document, { Html, Head, Main, NextScript } from "next/document";
import styled, { ServerStyleSheet } from "styled-components";
import { CONTENT_SERVER_HOST, GOOGLE_ANALTICS_ID } from "../services/constants";
import Script from "next/script";
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
    return (
      <Html id="html" lang="en">
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=5"
          ></meta>
          <link
            rel="stylesheet"
            href="https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/themes/df-messenger-default.css"
          />
          {/* Google Tag Manager */}
          {process.env.NODE_ENV === "production" &&
            !CONTENT_SERVER_HOST.includes("dev") && (
              <>
                <script
                  dangerouslySetInnerHTML={{
                    __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${GOOGLE_ANALTICS_ID}');`,
                  }}
                />

                <script
                  async
                  src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALTICS_ID}`}
                />

                <script
                  dangerouslySetInnerHTML={{
                    __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GOOGLE_ANALTICS_ID}', {
                page_path: window.location.pathname,
                });
                `,
                  }}
                />
              </>
            )}
          {/*  End Google Tag Manager */}

          {/* Partytown */}
          {process.env.NODE_ENV === "production" &&
            !CONTENT_SERVER_HOST.includes("dev") && (
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
            href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,600;0,700;0,800;1,300;1,400;1,600;1,700;1,800&display=swap"
            rel="stylesheet"
          ></link>

          <link
            href="https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,wght@0,200;0,300;0,400;0,600;0,700;0,800;0,900;1,200;1,300;1,400;1,600;1,700;1,800;1,900&display=swap"
            rel="stylesheet"
          ></link>

          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="true"
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
          {/* <script src="https://app.crmone.com/assets/scripts/integrate-widgets.js" />
          <script
            dangerouslySetInnerHTML={{
              __html: `
              createBot({ botId: "680b71a4a47fab68f44972ab" });
            `,
            }}
          /> */}
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
              min-height: calc(100% - 60px) !important;
              width: calc(100% - 20px) !important;
            }
        
          }
        `}
        </style>


          {/* <script src="https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/df-messenger.js" />
          <>
            <df-messenger
              location="asia-south1"
              project-id="ai-chabot-451908"
              agent-id="680b71a4a47fab68f44972ab"
              language-code="en"
              intent="WELCOME"
            >
              <Container>
                <df-messenger-chat-bubble
                  chat-title="Personalized Travel Plan"
                  chat-icon="https://images.thetarzanway.com/media/chatbot.png"
                  chat-title-icon="https://openmoji.org/data/color/svg/1F4AC.svg"
                  // to change floater icon, change this link
                ></df-messenger-chat-bubble>
              </Container>
            </df-messenger>

            <style>
              {`
            df-messenger {
              z-index: 1024;
              position: fixed;
              --df-messenger-font-color: #333333;
              --df-messenger-font-family: "Poppins", sans-serif;
              --df-messenger-chat-background: #F3F6FC;
              --df-messenger-message-user-background: #ffffff;
              --df-messenger-message-bot-background: #F7e700;
              --df-messenger-input-placeholder-color: #757575;
              --df-messenger-input-text-color: #000000;
              --df-messenger-send-icon: #007bff;
              --df-messenger-chat-window-height: calc(100vh - 80px);
              --df-messenger-chat-window-width: 40vw;
              --df-messenger-border-radius: 9px;
              --df-messenger-button-size: 80px;
              --df-messenger-chat-bubble-icon-size: 80px;
              --df-messenger-send-icon-color: black;
              bottom: 0;
              right: 0;
              padding: 4px;
              border: 4px;
              border-radius: 6px;
              margin-right: 20px;
              margin-bottom: 10px;
              background-size: contain;
              background-repeat: no-repeat;
            }

            .df-messenger-chat-bubble-icon {
              margin-top: 5px;
            }

            @media (max-width: 768px) {
              df-messenger {
                bottom: 60px;
                margin-right: 16px;
              }
            }
          `}
            </style>
          </> */}
          {/* Google Tag Manager (noscript) */}
          {process.env.NODE_ENV === "production" &&
            !CONTENT_SERVER_HOST.includes("dev") && (
              <noscript>
                <iframe
                  src={
                    "https://www.googletagmanager.com/ns.html?id=" +
                    GOOGLE_ANALTICS_ID
                  }
                  height="0"
                  width="0"
                  style={{ display: "none", visibility: "hidden" }}
                ></iframe>
              </noscript>
            )}
          {/* End Google Tag Manager (noscript) */}

          <Main />
          <div id="modal-portal" />
          <div id="popup-portal" />

          <NextScript />
        </body>
      </Html>
    );
  }
}

import Document, {Html, Head, Main, NextScript } from 'next/document';
// Import styled components ServerStyleSheet
import { ServerStyleSheet } from 'styled-components';
import Layout from '../components/Layout';
import { GOOGLE_ANALTICS_ID } from '../services/constants';
// import Script from 'next/script';
export default class MyDocument extends Document {
  
  static getInitialProps({ renderPage }) {
    // Step 1: Create an instance of ServerStyleSheet
    const sheet = new ServerStyleSheet();

    // Step 2: Retrieve styles from components in the page
    const page = renderPage((App) => (props) =>
      sheet.collectStyles(<App {...props} />),
    );

    // Step 3: Extract the styles as <style> tags
    const styleTags = sheet.getStyleElement();

    // Step 4: Pass styleTags as a prop
    return { ...page, styleTags };
  }

  render() {
    return (
      <Html id="html">
        <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1"></meta>
 <script async src="https://www.googletagmanager.com/gtag/js?id=AW-738037519"></script>
<script
dangerouslySetInnerHTML={{
  __html: `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'AW-738037519');
  `}}
  />
  <script type="text/javascript" dangerouslySetInnerHTML={{
  __html: ` (function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "dxk3hzpt0s");`}}/>
   

    <script
          async
          src={"https://www.googletagmanager.com/gtag/js?id="+GOOGLE_ANALTICS_ID}
        />
       

<script
src='//in.fw-cdn.com/30401267/225580.js'
chat='false'>
</script>
          <script
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GOOGLE_ANALTICS_ID}', {
              page_path: window.location.pathname,
            });
          `}}
          />
     
           <link rel="icon" href="/logoblack.svg" />
          <link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true"/>
       <link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,600;0,700;0,800;1,300;1,400;1,600;1,700;1,800&display=swap" rel="stylesheet"></link>
      <link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,wght@0,200;0,300;0,400;0,600;0,700;0,800;0,900;1,200;1,300;1,400;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet"></link>
           {/* Step 5: Output the styles in the head  */}
          {this.props.styleTags}
        
 
        
         </Head>
         <body>
    
          <Main />
          <NextScript />
        </body>
       </Html>
    );
  }
}


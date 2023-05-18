import ItineraryContainer from '../../../containers/itinerary/IndexsV2/Index';
import { useRouter } from 'next/router';
import LayoutV2 from '../../../components/LayoutV2';
import Head from 'next/head';
import { connect } from 'react-redux';
import * as authaction from '../../../store/actions/auth';

import { useEffect } from 'react';
// import Script from "next/script";
const Itinerary = (props) => {
  const router = useRouter();

  useEffect(() => {
    // const script = document.createElement("script");
    // script.src =(() => {(function (d, w, c) { if(!d.getElementById("spd-busns-spt")) { var n = d.getElementsByTagName('script')[0], s = d.createElement('script'); var loaded = false; s.id = "spd-busns-spt"; s.async = "async"; s.setAttribute("data-self-init", "false"); s.setAttribute("data-init-type", "opt"); s.src = 'https://cdn.in-freshbots.ai/assets/share/js/freshbots.min.js'; s.setAttribute("data-client", "3225c221f3048e75e5a6ef1d6a5227c59290c8f1"); s.setAttribute("data-bot-hash", "74b6cd8cbe305eba5699361061f2c6fc1ec8607b"); s.setAttribute("data-env", "prod"); s.setAttribute("data-region", "in"); if (c) { s.onreadystatechange = s.onload = function () { if (!loaded) { c(); } loaded = true; }; } n.parentNode.insertBefore(s, n); } }) (document, window, function () { Freshbots.initiateWidget({ autoInitChat: false, getClientParams: function () { return {"cstmr::eml":"","cstmr::phn":"","cstmr::nm":""}; } }, function(successResponse) { }, function(errorResponse) { }); });});
    // script.async = true;
    // document.body.appendChild(script);

    props.checkAuthState();
  }, []);
  return (
    <LayoutV2 itinerary hidecta>
      {/* <script src='//in.fw-cdn.com/30401267/225580.js' chat='true'></script> */}
      <Head>
        <title> Tailored Itinerary | The Tarzan Way </title>
        <meta property="og:title" content="Tailored Travel | The Tarzan Way" />
        <meta
          property="og:description"
          content="We envision to simplify travel and build immersive travel experiences."
        />
        <meta property="og:image" content="/logoblack.svg" />
        {/* <script
              src='https://thetarzanway-web.s3.us-west-2.amazonaws.com/scripts/itinerarybot.js'
         
          /> */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
                
                (function (d, w, c) { if(!d.getElementById("spd-busns-spt")) { var n = d.getElementsByTagName('script')[0], s = d.createElement('script'); var loaded = false; s.id = "spd-busns-spt"; s.async = "async"; s.setAttribute("data-self-init", "false"); s.setAttribute("data-init-type", "opt"); s.src = 'https://cdn.in-freshbots.ai/assets/share/js/freshbots.min.js'; s.setAttribute("data-client", "3225c221f3048e75e5a6ef1d6a5227c59290c8f1"); s.setAttribute("data-bot-hash", "74b6cd8cbe305eba5699361061f2c6fc1ec8607b"); s.setAttribute("data-env", "prod"); s.setAttribute("data-region", "in"); if (c) { s.onreadystatechange = s.onload = function () { if (!loaded) { c(); } loaded = true; }; } n.parentNode.insertBefore(s, n); } }) (document, window, function () { Freshbots.initiateWidget({ autoInitChat: false, getClientParams: function () { return {"cstmr::eml":"","cstmr::phn":"","cstmr::nm":""}; } }, function(successResponse) { }, function(errorResponse) { }); });
            `,
          }}
        />
      </Head>
      {/* <script dangerouslySetInnerHTML={{
    __html: `(function (d, w, c) { if(!d.getElementById("spd-busns-spt")) { var n = d.getElementsByTagName('script')[0], s = d.createElement('script'); var loaded = false; s.id = "spd-busns-spt"; s.async = "async"; s.setAttribute("data-self-init", "false"); s.setAttribute("data-init-type", "opt"); s.src = 'https://cdn.in-freshbots.ai/assets/share/js/freshbots.min.js'; s.setAttribute("data-client", "3225c221f3048e75e5a6ef1d6a5227c59290c8f1"); s.setAttribute("data-bot-hash", "74b6cd8cbe305eba5699361061f2c6fc1ec8607b"); s.setAttribute("data-env", "prod"); s.setAttribute("data-region", "in"); if (c) { s.onreadystatechange = s.onload = function () { if (!loaded) { c(); } loaded = true; }; } n.parentNode.insertBefore(s, n); } }) (document, window, function () { Freshbots.initiateWidget({ autoInitChat: false, getClientParams: function () { return {"cstmr::eml":"","cstmr::phn":"","cstmr::nm":""}; } }, function(successResponse) { }, function(errorResponse) { }); });`}}/> */}
      {router.query.id && (
        <ItineraryContainer
          key={router.asPath}
          id={router.query.id}
        ></ItineraryContainer>
      )}
    </LayoutV2>
  );
};

const mapStateToPros = (state) => {
  return {
    token: state.auth.token,
    showLogin: state.auth.showLogin,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    checkAuthState: () => dispatch(authaction.checkAuthState()),
    authCloseLogin: () => dispatch(authaction.authCloseLogin()),
  };
};

export default connect(mapStateToPros, mapDispatchToProps)(Itinerary);

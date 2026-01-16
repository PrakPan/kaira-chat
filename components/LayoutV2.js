import React, { Component, useEffect } from "react";
import Header from "./navbar/Index";
import Footer from "./newfooter/Index";
import LoginModal from "../components/modals/Login";
import { connect } from "react-redux";
import * as authaction from "../store/actions/auth";
import TailoredFormMobileModal from "./modals/TailoredFomrMobile";
import { useState } from "react";
import { useRouter } from "next/router";
import { closeTailoredModal } from "../services/openTailoredModalV2";
import media from "./media";
import { memo } from "react";

const LayoutV2 = (props) => {
  const router = useRouter();
  let isPageWide = media("(min-width: 768px)");
  const [showMoiblePlanner, setShowMobilePlanner] = useState(false);

  useEffect(() => {
    props.checkAuthState();
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (router.isReady) {
      const queries = router.query;
      if (queries["tailored-travel"]) {
        setShowMobilePlanner(true);
      } else setShowMobilePlanner(false);
    }
  }, [router.isReady, router.asPath]);

  return (
    <div className="layout h-full">
      <Header
        staticnav={props.staticnav}
        PW={props.PW}
        ctaonclick={props.ctaonclick}
        hidecta={props.hidecta}
        hidehomecta={props.hidehomecta}
        id={props.id}
        destination={props.destination}
      />
      <div
        style={{ marginTop: props.staticnav && !isPageWide ? "0px" : "72px" }}
      >
        {props.children}
      </div>
      <LoginModal
        show={props.showLogin}
        onhide={props.token && !props.phone ? null : props.authCloseLogin}
      ></LoginModal>
      <TailoredFormMobileModal
        destinationType={"city-planner"}
        onHide={() => {
          setShowMobilePlanner(false);
        }}
        show={showMoiblePlanner}
      />

      {!props.itinerary ? <Footer></Footer> : null}
    </div>
  );
};

const mapStateToPros = (state) => {
  return {
    token: state.auth.token,
    token: state.auth.phone,
    showLogin: state.auth.showLogin,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    checkAuthState: () => dispatch(authaction.checkAuthState()),
    authCloseLogin: () => dispatch(authaction.authCloseLogin()),
  };
};

export default connect(mapStateToPros, mapDispatchToProps)(memo(LayoutV2));

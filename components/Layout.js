import React, { Component, useEffect } from 'react';
import Header from './navbar/Index';
import Footer from './newfooter/Index';
import LogInModal from '../components/modals/Login';
import { connect } from 'react-redux';
import * as authaction from '../store/actions/auth';
import TailoredFormMobileModal from './modals/TailoredFomrMobile';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { closeTailoredModal } from '../services/openTailoredModal';
import media from './media'
const Layout = (props) => {
  let isPageWide = media("(min-width: 768px)");

  useEffect(() => {
    props.checkAuthState();
    window.scrollTo(0, 0);
  }, []);
  const [showMoiblePlanner, setShowMobilePlanner] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      const queries = router.query;
      if (queries['tailored-travel']) {
        setShowMobilePlanner(true);
      } else setShowMobilePlanner(false);
    }
  }, [router.isReady, router.asPath]);

  return (
    <div className="layout">
      <Header
        PW={props.PW}
        staticnav={props.staticnav}
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

      <LogInModal
        show={props.showLogin}
        onhide={props.token && !props.phone ? null : props.authCloseLogin}
      ></LogInModal>
      <TailoredFormMobileModal
        destinationType={"city-planner"}
        onHide={() => {
          setShowMobilePlanner(false);
          closeTailoredModal(router);
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
export default connect(mapStateToPros, mapDispatchToProps)(Layout);

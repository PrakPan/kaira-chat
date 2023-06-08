import React, { Component, useEffect } from 'react';
import Header from './navbar/Index';
import Footer from './newfooter/Index';
import LoginModal from '../components/modals/Login';
import { connect } from 'react-redux';
import * as authaction from '../store/actions/auth';
import TailoredFormMobileModal from './modals/TailoredFomrMobile';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { closeTailoredModal } from '../services/openTailoredModalV2';
const LayoutV2 = (props) => {
  useEffect(() => {
    props.checkAuthState();
    window.scrollTo(0, 0);
  }, []);
  const [showMoiblePlanner, setShowMobilePlanner] = useState(false);
  const router = useRouter();
  console.log('router');
  console.log(router);

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
        staticnav={props.staticnav}
        PW={props.PW}
        ctaonclick={props.ctaonclick}
        hidecta={props.hidecta}
        hidehomecta={props.hidehomecta}
        id={props.id}
        destination={props.destination}
      />
      <div style={{ marginTop: "72px" }}>{props.children}</div>
      <LoginModal
        show={props.showLogin}
        onhide={props.token && !props.phone ? null : props.authCloseLogin}
      ></LoginModal>
      {router.query.id && (
        <TailoredFormMobileModal
          destinationType={"city-planner"}
          onHide={() => {
            setShowMobilePlanner(false);
            closeTailoredModal(router, router.query.id);
          }}
          show={showMoiblePlanner}
        />
      )}

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
export default connect(mapStateToPros, mapDispatchToProps)(LayoutV2);

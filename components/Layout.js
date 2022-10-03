
import React, { Component, useEffect } from 'react';
import Header from './navbar/Index';
import Footer from './footer/Index';
import LoginModal from '../components/modals/Login';
import { connect } from 'react-redux';
import * as authaction from '../store/actions/auth'
const Layout = (props) => {
  useEffect(() => {
      props.checkAuthState();
      window.scrollTo(0,0);
  },[]);

    return (
      <div className='layout'>
        <Header ctaonclick={props.ctaonclick} hidecta={props.hidecta} hidehomecta={props.hidehomecta} />
        {props.children}
        <LoginModal
          show={props.showLogin}
          onhide={props.token && !props.phone ? null : props.authCloseLogin}>
        </LoginModal>
        {!props.itinerary ? <Footer></Footer> : null}
      </div>
    );
  }
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
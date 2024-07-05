import React, { useEffect } from "react";
import Header from "./navbar/Index";
import Footer from "./newfooter/Index";
import { connect } from "react-redux";
import * as authaction from "../store/actions/auth";
import media from "./media";
import NotificationPopup from "./ui/NotificationPopup";

const Layout = React.memo((props) => {
  let isPageWide = media("(min-width: 768px)");

  useEffect(() => {
    props.checkAuthState();
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    var name;
    if (localStorage.getItem("name"))
      name = localStorage.getItem("name").split(" ");
    var email = localStorage.getItem("email");

    function handleWidgetLoaded() {
      if (name?.length && email) {
        window.fcWidget.user.setFirstName(name[0]);
        window.fcWidget.user.setEmail(email);
      }
    }

    if (window.fcWidget) {
      if (!props.token) {
        window.fcWidget.user.clear();
      } else {
        window.fcWidget.on("widget:loaded", handleWidgetLoaded());
      }
    } else {
      setTimeout(() => {
        if (window.fcWidget) {
          if (!props.token) {
            window.fcWidget.user.clear();
          } else {
            window.fcWidget.on("widget:loaded", handleWidgetLoaded());
          }
        }
      }, 5000);
    }

    return () => {
      if (window.fcWidget) {
        window.fcWidget.off("widget:loaded", handleWidgetLoaded());
      }
    };
  }, [props.token]);

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
        page={props.page}
        itinerary={props.itinerary}
      />

      <div
        style={{ marginTop: props.staticnav && !isPageWide ? "0px" : "72px" }}
      >
        {props.children}
      </div>

      <NotificationPopup />
      {!props.itinerary ? <Footer></Footer> : null}
    </div>
  );
});

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

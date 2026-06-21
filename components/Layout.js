import React, { useEffect, useLayoutEffect, useState } from "react";
import Header from "./navbar/Index";
import Footer from "./newfooter/Index";
import { connect } from "react-redux";
import * as authaction from "../store/actions/auth";
import media from "./media";
import NotificationPopup from "./ui/NotificationPopup";
import { changeUserLocation } from "../store/actions/userLocation";
import Cookies from "js-cookie";
import { bootstrapUserLocation } from "../services/userLocationBootstrap";
import NavigationMenu from "./revamp/home/NavigationMenu";
import TailoredFormMobileModal from "./modals/OldFormTailoredFomrMobile";
import { useRouter } from "next/router";
import { closeTailoredModal } from "../services/openTailoredModalV2";
import TrustFactor from "./tailoredform/TrustFactor";

const Layout = React.memo((props) => {
  let isPageWide = media("(min-width: 768px)");
  const router = useRouter();
  const [showMoiblePlanner, setShowMobilePlanner] = useState(false);

   useEffect(() => {
      if (router.isReady) {
        const queries = router.query;
        if (queries["tailored-travel"]) {
          setShowMobilePlanner(true);
        } else setShowMobilePlanner(false);
      }
    }, [router.isReady, router.asPath]);

  useLayoutEffect(() => {
    bootstrapUserLocation((loc) => props.changeUserLocation({ location: loc }));
  }, []);

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
    <div className={`layout ${props?.isItinerary == true || props?.isTerms == true ?  '' : 'overflow-x-hidden'}`}>
      <NavigationMenu isItinerary={props?.isItinerary} message={"Welcome to The Tarzan Way!"}/>

      <div
        style={{ marginTop: props.isItinerary === true
        ? (isPageWide ? "22px" : "0px")
        : "0px" }}
      >
        {props.children}
      </div>

      {props?.slug == 'AI-generic' && (
        <TailoredFormMobileModal
          destinationType={"city-planner"}
          onHide={() => {
          setShowMobilePlanner(false);
          closeTailoredModal(router);
          }}
          show={showMoiblePlanner}
        />
      )}
      <NotificationPopup />
      {!props.itinerary ? (
        <Footer page={props.page} slug={props.slug}></Footer>
      ) : null}
     
    

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
    changeUserLocation: (payload) => dispatch(changeUserLocation(payload)),
  };
};

export default connect(mapStateToPros, mapDispatchToProps)(Layout);

import React, { useEffect, useLayoutEffect } from "react";
import Header from "./navbar/Index";
import Footer from "./newfooter/Index";
import { connect } from "react-redux";
import * as authaction from "../store/actions/auth";
import media from "./media";
import NotificationPopup from "./ui/NotificationPopup";
import { changeUserLocation } from "../store/actions/userLocation";
import Cookies from "js-cookie";
import NavigationMenu from "./revamp/home/NavigationMenu";

const Layout = React.memo((props) => {
  let isPageWide = media("(min-width: 768px)");

  useLayoutEffect(() => {
    const userLocation = Cookies.get("userLocation");

    if (!userLocation) getUserIp();
    else {
      props.changeUserLocation({ location: JSON.parse(userLocation) });
    }

    async function getUserIp() {
      try {
        const res = await axios.get("https://api.ipify.org?format=json");
        const IpAddress = res.data.ip;
        if (IpAddress) getUserLocation(IpAddress);
      } catch (e) {}
    }

    async function getUserLocation(ip) {
      try {
        const res = await axios.get(
          `https://apis.tarzanway.com/search/user_location/?ip=${ip}`
        );

        const data = res.data;
        if (res.data) {
          Cookies.set("userLocation", JSON.stringify(data), { expires: 3 });
          props.changeUserLocation({ location: data });
        }
      } catch (e) {}
    }
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
    <div className="layout overflow-x-hidden">
      <NavigationMenu/>

      <div
        style={{ marginTop: props.isItinerary === true
        ? (isPageWide ? "72px" : "0px")
        : "0px" }}
      >
        {props.children}
      </div>

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

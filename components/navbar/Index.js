import React, { useState, useEffect } from "react";

import * as logout from "../../store/actions/logout";
import * as authaction from "../../store/actions/auth";
import { connect } from "react-redux";

import IndexDesktop from "./Desktop";
import media from "../media";
import NewMobile from "./mobile/Index";
import axiosnotificationsinstance from "../../services/user/notifications/notifications";
import LogInModal from "../modals/Login";
import TailoredFormMobileModal from "../modals/TailoredFomrMobile";
import { closeTailoredModal } from "../../services/openTailoredModal";
import { useRouter } from "next/router";

const Navbar = React.memo((props) => {
  let isPageWide = media("(min-width: 768px)");
  const [hideNav, setHideNav] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [headerColor, setHeaderColor] = useState("black");
  const [notOpenCount, setNotOpenCount] = useState();
  const [showLoginModal , setShowLoginModal] = useState(false)
  let notopencount = 0;
  let [notifications, setNotifications] = useState([]);
  const [showMoiblePlanner, setShowMobilePlanner] = useState(false);
  const router = useRouter();
    useEffect(() => {
      if (router.isReady) {
        const queries = router.query;
        if (queries["tailored-travel"]) {
          setShowMobilePlanner(true);
        } else setShowMobilePlanner(false);
      }
    }, [router.isReady, router.asPath]);

  useEffect(() => {
    if (props.token)
      axiosnotificationsinstance
        .get("", {
          headers: {
            Authorization: `Bearer ${props.token}`,
          },
        })
        .then((res) => {
          for (var i = 0; i < res.data.length; i++) {
            if (res.data[i].status == "Not opened") {
              notopencount = notopencount + 1;
            }
          }
          setNotifications(res.data);
          setNotOpenCount(notopencount);
        })
        .catch((err) => {});
  }, [props.token]);

  useEffect(() => {
    let prevScroll = window.pageYOffset;
    let scrollhandler = () => {
      if (window.pageYOffset < 10) {
        setHideNav(false);
        setHeaderColor("black");
      } else setHeaderColor("white");
      let currentScroll = window.pageYOffset;
      //sfroll up
      if (prevScroll >= currentScroll) {
        setHideNav(false);
      }
      //scroll down
      else {
        if (window.pageYOffset < 10) setHeaderColor("black");
        else setHideNav(true);
        // else setHeaderColor('black');
      }
      prevScroll = currentScroll;
    };
    if (!props.staticnav) {
      window.addEventListener("scroll", scrollhandler);
      return () => {
        window.removeEventListener("scroll", scrollhandler);
      };
    }
  });

  const _deleteNotificationHandler = (id) => {
    if (props.token)
      axiosnotificationsinstance
        .delete("?id=" + id, {
          headers: {
            Authorization: `Bearer ${props.token}`,
          },
        })
        .then((res) => {
          setNotifications(res.data);
        })
        .catch((err) => {});
  };
  const _openAllNotificationsHandler = () => {
    if (props.token)
      axiosnotificationsinstance
        .patch(
          "",
          {},
          {
            headers: {
              Authorization: `Bearer ${props.token}`,
            },
          }
        )
        .then((res) => {
          setNotOpenCount(0);
        })
        .catch((err) => {});
  };
  return (
    <div className="font-lexend">
      <div className="hidden-desktop">
        {!hideNav && (
          <NewMobile
            PW={props.PW}
            staticnav={props.staticnav}
            id={props.id}
            destination={props.destination}
            _openAllNotificationsHandler={_openAllNotificationsHandler}
            hidecta={props.hidecta}
            ctaonclick={props.ctaonclick}
            _deleteNotificationHandler={_deleteNotificationHandler}
            notifications={notifications}
            hideNav={hideNav}
            showMobileSearch={showMobileSearch}
            setShowMobileSearch={setShowMobileSearch}
            setHideNav={setHideNav}
            notOpenCount={notOpenCount}
            setShowLoginModal={setShowLoginModal}
          ></NewMobile>
        )}
      </div>
      <div className="hidden-mobile">
        {/* <div
            style={{
              display: hideNav ? "none !important" : "initial !important",
            }}
          > */}
        {!hideNav && (
          <IndexDesktop
            staticnav={props.staticnav}
            id={props.id}
            destination={props.destination}
            PW={props.PW}
            ctaonclick={props.ctaonclick}
            hidehomecta={props.hidehomecta}
            hidecta={props.hidecta}
            _deleteNotificationHandler={_deleteNotificationHandler}
            _openAllNotificationsHandler={_openAllNotificationsHandler}
            notOpenCount={notOpenCount}
            notifications={notifications}
            token={props.token}
            setShowLoginModal={setShowLoginModal}
          ></IndexDesktop>
        )}
        {/* </div> */}
      </div>
      <LogInModal
        show={showLoginModal}
        // onhide={props.token && !props.phone ? null : props.authCloseLogin}
        onhide={() => setShowLoginModal(false)}
      ></LogInModal>
      <TailoredFormMobileModal
        destinationType={"city-planner"}
        onHide={() => {
          setShowMobilePlanner(false);
          closeTailoredModal(router);
        }}
        show={showMoiblePlanner}
      />
    </div>
  );
});
const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    name: state.auth.name,
    image: state.auth.image,
    // showLogin: state.auth.showLogin,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onLogout: () => dispatch(logout.logout()),
    authShowLogin: () => dispatch(authaction.authShowLogin()),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Navbar));

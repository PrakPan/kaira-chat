import React, { useState, useEffect } from "react";
import * as logout from "../../store/actions/logout";
import * as authaction from "../../store/actions/auth";
import { connect, useDispatch } from "react-redux";
import { OverlayScrollbars } from "overlayscrollbars";
import "overlayscrollbars/overlayscrollbars.css";
import IndexDesktop from "./Desktop";
import media from "../media";
import NewMobile from "./mobile/Index";
import LogInModal from "../modals/Login";
import TailoredFormMobileModal from "../modals/TailoredFomrMobile";
import { closeTailoredModal } from "../../services/openTailoredModal";
import { useRouter } from "next/router";

const Navbar = ((props) => {
  let isPageWide = media("(min-width: 768px)");
  const [scrollbarInstance, setScrollbarInstance] = useState(null);
  const [hideNav, setHideNav] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [notOpenCount, setNotOpenCount] = useState();
  const [showLoginModal, setShowLoginModal] = useState(false);
  let [notifications, setNotifications] = useState([]);
  const [showMoiblePlanner, setShowMobilePlanner] = useState(false);
  const router = useRouter();
  const dispatch=useDispatch();

  
  useEffect(() => {
    if (router.isReady) {
      const queries = router.query;
      if (queries["tailored-travel"]) {
        setShowMobilePlanner(true);
      } else setShowMobilePlanner(false);
    }
  }, [router.isReady, router.asPath]);

  const options = {
    overflow: {
      y: props.overflow,
    },
    scrollbars: {
      autoHide: "scroll",
    },
  };

  useEffect(() => {
    if (scrollbarInstance) {
      scrollbarInstance.destroy();
    }
    const scrollPosition = window.scrollY;
    const newScrollbarInstance = OverlayScrollbars(document.body, options);
    window.scrollTo(0, scrollPosition);
    setScrollbarInstance(newScrollbarInstance);
  }, [isPageWide, props.overflow]);


  useEffect(() => {
    let prevScroll = window.pageYOffset;
    let scrollhandler = () => {
      if (window.pageYOffset < 10) {
        setHideNav(false);
      } else {
      }
      let currentScroll = window.pageYOffset;
      if (prevScroll >= currentScroll) {
        setHideNav(false);
      } else {
        if (!window.pageYOffset < 10) {
          setHideNav(true);
        }
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

  const _deleteNotificationHandler = (id) => {};

  const _openAllNotificationsHandler = () => {};

  return (
    <div className="">
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
            setShowLoginModal={setShowLoginModal}
            page={props.page}
            itinerary={props.itinerary}
          ></IndexDesktop>
        )}
      </div>

      <LogInModal
        show={props.showLogin}
        onhide={()=>authaction.authCloseLogin()}
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
    overflow: state.scroll.overflow,
    showLogin: state.auth.showLogin,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onLogout: () => dispatch(logout.logout()),
    authShowLogin: () => dispatch(authaction.authShowLogin()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Navbar));

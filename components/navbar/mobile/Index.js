import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import Link from "next/link";
import { useRouter } from "next/router";
import * as authaction from "../../../store/actions/auth";
import { connect, useSelector } from "react-redux";
import ImageLoader from "../../ImageLoader";
import * as logout from "../../../store/actions/logout";
import Notifications from "../../modals/Notifications/Index";
import SearchMobile from "../../search/homepage/mobile/Index";
import openTailoredModal from "../../../services/openTailoredModal";
import usePageLoaded from "../../custom hooks/usePageLoaded";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faUser } from "@fortawesome/free-solid-svg-icons";
import styles from "../../revamp/home/NavigationMenu.module.scss";
import Button from "../../revamp/common/components/button";
import { useAnalytics } from "../../../hooks/useAnalytics";

const Container = styled.div`
  background-color: white;
  padding: 0 5vw;
  position: ${(props) => (props.staticnav ? "static" : "fixed")} !important;
  top: 0 !important;
  width: 100vw;
  height: 72px;
  z-index: 1500;
  display: flex;
  justify-content: space-between;
  box-shadow: 0px 1px 1px 0px rgb(0 0 0 / 14%);
`;

const DropdownContainer = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  width: 250px;
  max-height: 80vh;
  overflow-y: auto;
  z-index: 1000;
  opacity: ${(props) => (props.show ? 1 : 0)};
  visibility: ${(props) => (props.show ? 'visible' : 'hidden')};
  transform: ${(props) => (props.show ? 'translateY(0)' : 'translateY(-10px)')};
  transition: all 0.2s ease-in-out;
`;

const ListContainer = styled.div`
  padding: 0.5rem 0;
`;

const ListItem = styled.div`
  padding: 1rem 15px;
  display: flex;
  gap: 13px;
  align-items: center;
  font-family: Poppins;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: #01202b;
`;

const RedDot = styled.div`
  width: 1rem;
  padding: 0.15rem 0.25rem;
  height: 1rem;
  line-height: 1;
  font-size: 0.75rem;
  border-radius: 50%;
  background-color: #f7e700;
  display: inline-block;
  position: relative;
  top: -1rem;
  left: 2.95rem;
  z-index: 1000;
  color: black;
`;

const CompanyName = styled.div`
  position: absolute;
  left: 33px;
  top: 18px;
  font-size: 14px;
  font-weight: 600;
  @media screen and (min-width: 768px) {
    left: 34px;
    top: 23px;
  }
`;

const Heading = styled.p`
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  text-transform: uppercase;
  color: #7a7a7a;
  margin: 1rem 0;
  padding: 0 1rem;
`;

const HamburgerIcon = (
  <div style={{ opacity: 0.9 }}>
    <div
      style={{
        borderBottom: "2px solid",
        width: "1.7rem",
        marginBottom: "0.3rem",
      }}
    ></div>
    <div
      style={{
        borderBottom: "2px solid",
        width: "1rem",
        marginBottom: "0.3rem",
      }}
    ></div>
    <div style={{ borderBottom: "2px solid", width: "1.2rem" }}></div>
  </div>
);

const Mobile = (props) => {
  const router = useRouter();
  const isPageLoaded = usePageLoaded();
  const [toggleMenu, setToggleMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const dropdownRef = useRef();
  const {trackUserLogout} = useAnalytics();
  const {id} = useSelector(state=>state.auth);

  useEffect(() => {
    setShowLogo(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setToggleMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const _handleNotifications = () => {
    setToggleMenu(false);
    setShowNotifications(true);
  };

  const _handleLogin = () => {
    setToggleMenu(false);
    props.setShowLoginModal(true);
  };

  const _handleHomepageRedirect = () => {
    if (props.PW) router.push("/corporates/physicswallah");
    else router.push("/");
    setToggleMenu(false);
  };

  var LinksArr = [
    {
      type: "main",
      onclick: () => _handleNotifications(),
      text: "Notifications",
      icon: "media/icons/navigation/bell.png",
    },
    {
      type: "main",
      link: "/dashboard",
      text: "My Trips",
      icon: "media/icons/navigation/trip.svg",
    },
    {
      type: "main",
      link: "http://blog.thetarzanway.com/",
      text: "Travel Feed",
      icon: "media/icons/navigation/chat.png",
    },
    {
      type: "main",
      onclick: () => openTailoredModal(router),
      text: "Tailor-made travel",
      icon: "media/icons/navigation/page.png",
    },
    {
      type: "main",
      link: "/testimonials",
      text: "Reviews",
      icon: "media/icons/navigation/testimonial.png",
    },
    {
      type: "others",
      link: "/contact",
      text: "Contact Us",
      icon: "media/icons/navigation/call.png",
    },
    {
      type: "others",
      link: "/covid-19-safe-travel-india",
      text: "Covid 19 Safety",
      icon: "media/icons/navigation/health-insurance.png",
    },
  ];

  if (!props.token) LinksArr = LinksArr.filter((e) => e.link != "/dashboard");

  const MainLinksDiv = LinksArr.map((e, i) => {
    if (e.type === "main")
      return (
        <ListItem
          key={i}
          onClick={e.onclick && e.onclick}
          style={
            router.pathname === e.link ? { backgroundColor: "#ffff4a45" } : {}
          }
        >
          {e.icon && (
            <ImageLoader
              leftalign
              url={e.icon}
              height="20px"
              width="20px"
              dimensions={{ height: 50, width: 50 }}
              dimensionsMobile={{ height: 50, width: 50 }}
              widthmobile="20px"
              noPlaceholder={true}
            />
          )}
          {e.link && (
            <StyledLink
              style={{ textDecoration: "none" }}
              href={e.link}
              className="next-link"
              passHref={true}
            >
              {e.text}
            </StyledLink>
          )}
          {e.onclick && <div onClick={e.onclick}>{e.text}</div>}
        </ListItem>
      );
  });

  const OtherLinksDiv = LinksArr.map((e, i) => {
    if (e.type == "others")
      return (
        <ListItem
          key={i}
          onClick={e.onclick && e.onclick}
          style={
            router.pathname === e.link ? { backgroundColor: "#ffff4a45" } : {}
          }
        >
          {e.icon && (
            <ImageLoader
              leftalign
              url={e.icon}
              height="20px"
              width="20px"
              dimensions={{ height: 50, width: 50 }}
              dimensionsMobile={{ height: 50, width: 50 }}
              widthmobile="20px"
              noPlaceholder={true}
            />
          )}
          {e.link && (
            <StyledLink
              style={{ textDecoration: "none" }}
              href={e.link}
              className="next-link"
              passHref={true}
            >
              {e.text}
            </StyledLink>
          )}
          {e.onclick && <div onClick={e.onclick}>{e.text}</div>}
        </ListItem>
      );
  });

  return (
    <div key={props.notOpenCount} ref={dropdownRef} style={{ position: 'relative' }}>
            <div onClick={() => setToggleMenu(!toggleMenu)}>

      {!props.token?<Button
            className={styles.hamburger}
            variant="filled"
          >
            <FontAwesomeIcon icon={faUser} className="w-4 h-4" />
          </Button>:<ImageLoader
          borderRadius="50%"
          url={
            props.image !== "null" && props.image !== null
              ? props.image
              : "media/icons/navigation/profile-user.png"
          }
          noPlaceholder={true}
          width="48px"
          height="48px"
        />
          }
          </div>
  {/* <ImageLoader
          borderRadius="50%"
          url={
            props.image !== "null" && props.image !== null
              ? props.image
              : "media/icons/navigation/profile-user.png"
          }
          onClick={() => setToggleMenu(!toggleMenu)}
          noPlaceholder={true}
          width="48px"
          height="48px"
        /> */}


      <DropdownContainer show={toggleMenu}>
        <ListContainer>
          {!props.token?<ListItem style={{ backgroundColor: "#F8F8F8" }}>
            <FontAwesomeIcon icon={faUser} className="w-4 h-4" />
            <div onClick={props.handleCTAClick}>Login/Signup</div>
          </ListItem>:<>
          <ListItem style={{ backgroundColor: "#F8F8F8" }}>
            <FontAwesomeIcon icon={faUser} className="w-4 h-4" />
            <div>My Profile</div>
          </ListItem>
          </>}

          {MainLinksDiv}

          <Heading>OTHERS</Heading>

          {OtherLinksDiv}

          {props.token && (
            <ListItem onClick={() => { props.onLogout(); setToggleMenu(false); trackUserLogout(id); }}>
              <ImageLoader
                leftalign
                url={"media/icons/navigation/logout.png"}
                height="20px"
                width="20px"
                dimensions={{ height: 50, width: 50 }}
                dimensionsMobile={{ height: 50, width: 50 }}
                widthmobile="20px"
                noPlaceholder={true}
              />
              <div>Logout</div>
            </ListItem>
          )}
        </ListContainer>
      </DropdownContainer>

      {props.showMobileSearch ? (
        <div className="hidden-desktop" style={{ width: "100%" }}>
          <SearchMobile
            onclose={() => props.setShowMobileSearch(false)}
            open={true}
          ></SearchMobile>
        </div>
      ) : null}

      <Notifications
        _deleteNotificationHandler={props._deleteNotificationHandler}
        _openAllNotificationsHandler={props._openAllNotificationsHandler}
        notifications={props.notifications}
        show={showNotifications}
        handleClose={() => setShowNotifications(false)}
      ></Notifications>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    name: state.auth.name,
    image: state.auth.image,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    authShowLogin: () => dispatch(authaction.authShowLogin()),
    onLogout: () => dispatch(logout.logout()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Mobile);

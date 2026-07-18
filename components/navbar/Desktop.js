import React, { useState } from "react";
import styled from "styled-components";
import ProfilDropDown from "./ProfileDropDown";
import ProfileDropDownLoggedOut from "./ProfileDropDownLoggedOut";
import Link from "next/link";
import * as logout from "../../store/actions/logout";
import * as authaction from "../../store/actions/auth";
import { connect, useSelector } from "react-redux";
import { useRouter } from "next/router";
import Button from "../ui/button/Index";
import Notifications from "../modals/Notifications/Index";
import urls from "../../services/urls";
import ImageLoader from "../ImageLoader";
import DesktopSearch from "../search/header/desktop/Index";
import { ImSearch } from "react-icons/im";
import media from "../media";
import openTailoredModal from "../../services/openTailoredModal";
import { logEvent } from "../../services/ga/Index";
import { useAnalytics } from "../../hooks/useAnalytics";
import BrandLockup from "../brand/BrandLockup";

const NavbarContainer = styled.div`
  position: relative;
  color: black;
  display: flex;

  @media screen and (min-width: 768px) {
    transition: all 0.3s ease-in-out;
    height: 80px;
    width: 100%;
    &:hover {
      opacity: 1;
    }
  }
`;

const CenterNav = styled.div`
  width: 85%;
  margin: auto;
  height: 100%;
  display: grid;
  grid-template-columns: ${(props) =>
    props.hidecta ? "3.5fr 2fr 0.95fr" : "0fr 2fr 0.5fr"};
  align-items: center;
  &:hover {
    cursor: pointer;
  }
`;

const TTWLogoContainer = styled(CenterNav)`
  justify-content: center;
  position: relative;
  @media screen and (min-width: 768px) {
    justify-content: flex-start;
  }
`;

/* The full brand lockup (mark + wordmark + "Powered by Kaira" tagline) via
   BrandLockup, which composes the parts so the tagline stays legible at 40px. */
const NAV_LOCKUP_STYLE = {
  margin: "0.5rem 0.5rem 0.5rem 2rem",
  cursor: "pointer",
};

const Header = styled.div`
  position: ${(props) => (props.staticnav ? "static" : "fixed")} !important;
  z-index: 1003;
  height: 80px;
  transition: height ease-out 0.5s;
  top: 0 !important;
  width: 100vw !important;
  box-shadow: 0px 1px 1px 0px rgb(0 0 0 / 14%);
  @media screen and (min-width: 768px) {
  }
`;

const TopContainer = styled.div`
  border-style: solid;
  border-width: 1px;
  border-radius: 6px;
  border-color: #e4e4e4;
  width: 100%;
  margin: auto;
  height: 50px;
  z-index: 101;
  background-color: white;
`;

const SearchContainer = styled.div`
  width: 100%;
  margin-block: auto;
  position: absolute;
`;

const Search = styled.input`
  border: none !important;
  width: 80%;
  margin-top: 12px;
  margin-inline: 40px;
  &:focus {
    outline: none;
  }
`;

const Navbar = (props) => {
  const router = useRouter();
  const isTablet = media("(min-width: 950px)");
  const [showMobileNavItems, setShowMobileNavItems] = useState(false);
  const [showDropDownProfileListMobile, setShowDropDownProfileListMobile] =
    useState(false);
  const [showDropDownProfileList, setShowDropDownProfileList] = useState(false);
  const [Height, setHeight] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [toggleSearch, setToggleSearch] = useState(false);

  const {id} = useSelector(state=>state.auth);
  const {trackUserLogout} = useAnalytics();
    const toggleProfileList = () => {
    setShowDropDownProfileList(!showDropDownProfileList);
    setShowDropDownProfileListMobile(!showDropDownProfileListMobile);
    if (showMobileNavItems == true) {
      setShowMobileNavItems(false);
    }
    if (showMobileNavItems == false) {
      setHeight(!Height);
    }
  };

  const _handleNotifications = () => {
    setShowNotifications(true);
  };

  const _handleHomepageRedirect = () => {
    router.push("/");
  };

  const _handlePWRedirect = () => {
    router.push("/corporates/physicswallah");
  };

  const handleCreateTripButton = () => {
    openTailoredModal(router, props.id, props.destination);

    logEvent({
      action: "Plan_Itinerary",
      params: {
        page: props.page ? props.page : "Home Page",
        event_category: "Button Click",
        event_label: "Create a Trip",
        event_action: "Navbar",
      },
    });
  };

  // Dark header gets the on-dark lockup (navy tile + hairline, cream wordmark).
  const lockupVariant = props.headerColor === "black" ? "dark" : "light";

  return (
    <div>
      <Header staticnav={props.staticnav} changeHeight={Height}>
        <NavbarContainer
          bgColor={props.bgColor}
          hideNav={props.hideNav}
          style={{
            backgroundColor:
              props.headerColor === "black" ? "rgba(0,0,0,0.7)" : "white",
            opacity: props.hideNav ? "0" : "1",
          }}
        >
          <CenterNav staticnav={props.staticnav} hidecta={props.hidecta}>
            <TTWLogoContainer>
              {props.hidehomecta ? (
                <BrandLockup
                  size={40}
                  variant={lockupVariant}
                  style={NAV_LOCKUP_STYLE}
                />
              ) : (
                <Link
                  style={{ textDecoration: "none" }}
                  href={!props.PW ? urls.HOMEPAGE : "/corporates/physicswallah"}
                >
                  <BrandLockup
                    size={40}
                    variant={lockupVariant}
                    style={NAV_LOCKUP_STYLE}
                    onClick={
                      !props.PW ? _handleHomepageRedirect : _handlePWRedirect
                    }
                  />
                </Link>
              )}
            </TTWLogoContainer>

            {props.itinerary || (!props.hidecta && !props.staticnav) ? (
              <div
                style={{
                  position: "absolute",
                  left: isTablet ? "32%" : "26%",
                  height: "100%",
                  width: "37%",
                }}
                className="center-div"
                onClick={() => setToggleSearch(true)}
              >
                <TopContainer>
                  <SearchContainer>
                    <Search placeholder="Where do you want to go?"></Search>
                    <ImSearch
                      style={{
                        position: "absolute",
                        top: "17px",
                        left: "13px",
                        color: "#B0BABF",
                        pointerEvents: "none",
                      }}
                    />
                  </SearchContainer>
                </TopContainer>
              </div>
            ) : null}

            {toggleSearch ? (
              <DesktopSearch
                onclose={() => setToggleSearch(false)}
              ></DesktopSearch>
            ) : (
              <div></div>
            )}

            <div className="flex flex-row items-center justify-center">
              {!props.hidecta ? (
                <Button
                  fontWeight="500"
                  borderColor="black"
                  borderWidth="1px"
                  hoverBgColor="black"
                  hoverColor="white"
                  bgColor="#F7e700"
                  borderRadius="6px"
                  margin="0 1.5rem 0 0"
                  padding="0.5rem 0.75rem"
                  onclick={
                    props.ctaonclick ? props.ctaonclick : handleCreateTripButton
                  }
                >
                  Create a Trip
                </Button>
              ) : null}

              {props.token ? (
                <ProfilDropDown
                  setShowDropDownProfileList={setShowDropDownProfileList}
                  showDropDownProfileList={showDropDownProfileList}
                  showDropDownProfileListMobile={showDropDownProfileListMobile}
                  toggleProfileList={toggleProfileList}
                  onLogout={()=>{props.onLogout(); trackUserLogout(id)}}
                  token={props.token}
                  headerColor={props.headerColor}
                  name={props.name}
                  image={props.image}
                  notifications={props.notifications}
                  _handleNotifications={_handleNotifications}
                  notOpenedCount={props.notOpenCount}
                  authShowLogin={props.authShowLogin}
                />
              ) : (
                <ProfileDropDownLoggedOut
                  setShowDropDownProfileList={setShowDropDownProfileList}
                  showDropDownProfileList={showDropDownProfileList}
                  showDropDownProfileListMobile={showDropDownProfileListMobile}
                  toggleProfileList={toggleProfileList}
                  onLogout={()=>{props.onLogout(); trackUserLogout(id)}}
                  setShowLoginModal={props.setShowLoginModal}
                  token={props.token}
                  headerColor={props.headerColor}
                  authShowLogin={props.authShowLogin}
                />
              )}
            </div>
          </CenterNav>
        </NavbarContainer>

        <Notifications
          _deleteNotificationHandler={props._deleteNotificationHandler}
          _openAllNotificationsHandler={props._openAllNotificationsHandler}
          notifications={props.notifications}
          show={showNotifications}
          handleClose={() => setShowNotifications(false)}
        ></Notifications>
      </Header>
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
    onLogout: () => dispatch(logout.logout()),
    authShowLogin: () => dispatch(authaction.authShowLogin()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);

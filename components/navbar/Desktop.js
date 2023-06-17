import React, { useState, useEffect } from "react";
import styled from "styled-components";

import ProfilDropDown from "./ProfileDropDown";
import ProfileDropDownLoggedOut from "./ProfileDropDownLoggedOut";
import Link from "next/link";
import * as logout from "../../store/actions/logout";
import * as authaction from "../../store/actions/auth";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import Button from "../ui/button/Index";
import Notifications from "../modals/Notifications/Index";
import urls from "../../services/urls";
import ImageLoader from "../ImageLoader";
import DesktopSearch from "../search/header/desktop/Index";
import { ImSearch } from "react-icons/im";
import media from "../media";
import openTailoredModal from "../../services/openTailoredModal";
const NavItemsContainer = styled.div`
  display: none;

  @media screen and (min-width: 768px) {
    margin-right: 0rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

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
  // ${props=>props.staticnav && 'padding-right : 2%'};
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

const NavItem = styled.div`
  color: white;
  padding: 1rem 0rem 0.5rem 0rem;
  @media screen and (min-width: 768px) {
    cursor: pointer;
    padding: 0rem;
    margin: 0 1.5rem;
    white-space: nowrap;
    border: none;
    transition: all 0.2s ease-in-out;
    &:hover {
      color: lightgrey;
    }
  }
`;

const Header = styled.div`
  position: ${(props) => (props.staticnav ? "static" : "fixed")} !important;
  z-index: 1003;
  height: 80px;

  transition: height ease-out 0.5s;
  top: 0 !important;
  width: 100vw !important;

  box-shadow: 0px 1px 1px 0px rgb(0 0 0 / 14%);
  @media screen and (min-width: 768px) {
    // height: 10vh;
  }
`;
const CompanyName = styled.p`
position: absolute;
    left: 30px;
    top: 40px;
    font-size : 14px;
}
  &:hover{
    cursor: pointer;
  };
  margin-left: 0.5rem;
`;

const StyledLink = styled.a`
  text-decoration: none;
  display: block;
  margin: auto;
  width: max-content;
  padding: 0.5rem 0;
  border-style: none none solid none;
  border-color: transparent;
  border-width: 1px;
  font-weight: 600;

  &:hover {
    color: black;
    text-decoration: none;
    border-style: none none solid none;
    border-color: #f7e700;
    border-width: 1px;
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
  // display: grid;
  // grid-template-columns: max-content auto;
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

  {
    /* toggle hamburger */
  }
  const [showDropDownProfileListMobile, setShowDropDownProfileListMobile] =
    useState(false);
  {
    /* toggle mobile profilelist */
  }
  const [showDropDownProfileList, setShowDropDownProfileList] = useState(false);

  const [Height, setHeight] = useState(false);

  const toggleMobileNavItems = () => {
    setShowMobileNavItems(!showMobileNavItems);
    if (showDropDownProfileListMobile == true) {
      setShowDropDownProfileListMobile(false);
    }
    if (showDropDownProfileListMobile == false) {
      setHeight(!Height);
    }
  };

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

  const [showNotifications, setShowNotifications] = useState(false);
  const _handleNotifications = () => {
    setShowNotifications(true);
  };
  // const router  = useRouter();
  const _handleHomepageRedirect = () => {
    router.push("/");
  };
  const _handlePWRedirect = () => {
    router.push("/corporates/physicswallah");
  };

  const [toggleSearch, setToggleSearch] = useState(false);
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
                <ImageLoader
                  hoverpointer
                  leftalign
                  width="55px"
                  widthmobile="55px"
                  margin="0.5rem 0.5rem 0.5rem 2rem"
                  url={"media/website/logo-only.svg"}
                ></ImageLoader>
              ) : props.headerColor === "black" ? (
                <Link
                  style={{ textDecoration: "none" }}
                  href={!props.PW ? urls.HOMEPAGE : "/corporates/physicswallah"}
                >
                  <ImageLoader
                    hoverpointer
                    onclick={
                      !props.PW ? _handleHomepageRedirect : _handlePWRedirect
                    }
                    width="55px"
                    widthmobile="55px"
                    leftalign
                    url={"media/website/logowhite.svg"}
                    margin="0.5rem 0.5rem 0.5rem 2rem"
                  ></ImageLoader>
                </Link>
              ) : (
                <Link href={urls.HOMEPAGE}>
                  <ImageLoader
                    hoverpointer
                    onclick={
                      !props.PW ? _handleHomepageRedirect : _handlePWRedirect
                    }
                    leftalign
                    width="55px"
                    widthmobile="55px"
                    margin="0.5rem 0.5rem 0.5rem 2rem"
                    url={"media/website/logo-only.svg"}
                  ></ImageLoader>
                </Link>
              )}{" "}
              <div>
                {props.hidehomecta ? (
                  <CompanyName
                    style={{
                      color: props.headerColor === "black" ? "white" : "black",
                      margin: "0 0rem 0 0.25rem",
                      fontSize: "2.25vh",
                      fontWeight: "700",
                      lineHeight: 1,
                      display: !props.PW ? "inline" : "block",
                      letterSpacing: "0",
                    }}
                  >
                    {"thetarzanway"}
                  </CompanyName>
                ) : (
                  <Link
                    href={
                      !props.PW ? urls.HOMEPAGE : "/corporates/physicswallah"
                    }
                  >
                    <CompanyName
                      style={{
                        color:
                          props.headerColor === "black" ? "white" : "black",
                        margin: "0 0 0 0.25rem",
                        fontWeight: "600",
                        lineHeight: 1,
                        display: "inline",
                        letterSpacing: "0",
                      }}
                    >
                      thetarzanway
                    </CompanyName>
                  </Link>
                )}
                {/* {
       props.PW ?  
       <Link href={'/corporates/physicswallah'}><CompanyName style={{color: props.headerColor === 'black' ? 'white': 'black', margin: "0.5vh 0 0 0.25rem", fontSize: "1.75vh", fontWeight: '300', lineHeight: '1.2', display: !props.PW ? 'inline' : 'block', letterSpacing: '0'}} >{'Physics Wallah Holidays'}</CompanyName></Link>
: null
      } */}
              </div>
              {/* </Link> */}
            </TTWLogoContainer>

            {/* <input /> */}
            {!props.hidecta && (
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
            )}
            {toggleSearch ? (
              <DesktopSearch
                onclose={() => setToggleSearch(false)}
              ></DesktopSearch>
            ) : (
              <div></div>
            )}
            {/* <SearchBar />  */}
            <NavItemsContainer
              style={{ marginRight: props.token ? "0rem" : "0" }}
            >
              {/* <NavItem>
              <Link href={urls.travel_experiences.BASE} className="next-link" passHref={true}>
               {router.pathname === '/travel-experiences' ? <StyledLink style={{color: props.headerColor === 'black' ? 'white' : 'black', borderColor:  '#f7e700'}}>Experiences</StyledLink> : <StyledLink style={{color: props.headerColor === 'black' ? 'white' : 'black'}}>Experiences</StyledLink>}
              </Link>
            </NavItem> */}
              {/* <NavItem>
                <StyledLink href="http://blog.thetarzanway.com/" style={{color: props.headerColor === 'black' ? 'white' : 'black'}}>Feed</StyledLink>
            </NavItem> */}
              <NavItem style={{ paddingInline: "1.5rem" }}>
                {/* <Link href={urls.CONTACT} passHref={true}>
              {  router.pathname === '/contact' ?<StyledLink style={{color: props.headerColor === 'black' ? 'white' : 'black', borderColor: '#f7e700' , fontWeight : '500'}}>Contact</StyledLink> : <StyledLink style={{color: props.headerColor === 'black' ? 'white' : 'black'}}>Contact</StyledLink>}
              </Link> */}
              </NavItem>

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
                    props.ctaonclick
                      ? props.ctaonclick
                      : () =>
                          openTailoredModal(router, props.id, props.destination)
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
                  onLogout={props.onLogout}
                  authShowLogin={props.authShowLogin}
                  token={props.token}
                  headerColor={props.headerColor}
                  name={props.name}
                  image={props.image}
                  notifications={props.notifications}
                  _handleNotifications={_handleNotifications}
                  notOpenedCount={props.notOpenCount}
                />
              ) : (
                <ProfileDropDownLoggedOut
                  setShowDropDownProfileList={setShowDropDownProfileList}
                  showDropDownProfileList={showDropDownProfileList}
                  showDropDownProfileListMobile={showDropDownProfileListMobile}
                  toggleProfileList={toggleProfileList}
                  onLogout={props.onLogout}
                  authShowLogin={props.authShowLogin}
                  token={props.token}
                  headerColor={props.headerColor}
                />
              )}
            </NavItemsContainer>
          </CenterNav>
          {/* } */}
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

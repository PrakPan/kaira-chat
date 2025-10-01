import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";
import { TTW } from "../assets";
import { menuAnimations } from "../common/animations/menuAnimations";
import { useMobileMenu } from "../common/hooks/useMobileMenu";
import styles from "./NavigationMenu.module.scss";
import SearchInput from "../common/components/searchInput";
import Button from "../common/components/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { connect, useDispatch } from "react-redux";
import {  authShowLogin } from "../../../store/actions/auth";
import useMediaQuery from "../../media";
import ProfileDropDown from "../../navbar/ProfileDropDown";
import { authLogout } from "../../../store/actions/auth";
import MobileMenu from "../../navbar/mobile/Index";
import ImageLoader from "../../ImageLoader";

const NavigationMenu = (props) => {
  const {
    isMobileMenuOpen,
    toggleMobileMenu,
    closeMobileMenu,
    sidebarRef,
    overlayRef,
    menuItemsRef,
  } = useMobileMenu();
  console.log("navigation props", props);
  const router = useRouter();
  const [showDropDownProfileList, setShowDropDownProfileList] = useState(false);
  const [showDropDownProfileListMobile, setShowDropDownProfileListMobile] = useState(false);
  const isMidScreen = useMediaQuery("(min-width:786px)");
  const [Height, setHeight] = useState(false);
  const [showMobileNavItems, setShowMobileNavItems] = useState(false);
  const [hideNav, setHideNav] = useState(false);
  const dispatch = useDispatch();
  // Memoized active path checker to prevent unnecessary re-renders
  const isActive = useCallback(
    (path) => router.pathname.startsWith(path),
    [router.pathname]
  );

  // Memoized handlers to prevent unnecessary re-renders
  const handleMenuItemHover = useCallback((element, isHovering) => {
    menuAnimations.hoverMenuItem(element, isHovering);
  }, []);

  const handleCTAClick = useCallback(
    (e) => {
      menuAnimations.pulseCTA(e.target);
      dispatch(authShowLogin());
      closeMobileMenu();
    },
    [closeMobileMenu]
  );

  // Memoized menu items to prevent unnecessary re-renders
  const desktopMenuItems = useMemo(
    () => [], // Empty array since navigation items are removed
    [isActive]
  );

  const mobileMenuItems = useMemo(
    () => [], // Empty array since navigation items are removed
    [isActive, closeMobileMenu, handleMenuItemHover]
  );
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
  const _deleteNotificationHandler = (id) => {};

  const _openAllNotificationsHandler = () => {};


  return (
    <>
      <nav className={styles.navigationMenu + " " + props.className} role="navigation">
        <div className="hover-pointer" onClick={() => router.push("/")}>
          <Image src={TTW} alt="TTW Logo" priority />
        </div>
        {isMidScreen && <SearchInput />}
        {/* Desktop Menu */}
        <ul className={styles.menuList} role="menubar">
          <li className="mr-4"></li>
          {desktopMenuItems}
          <li></li>
          {props.token ? (
            <ProfileDropDown 
            name={props.name}
            image={props.image}
            onLogout={props.onLogout}
            authShowLogin={props.authShowLogin}
            setShowDropDownProfileList={setShowDropDownProfileList}
            showDropDownProfileList={showDropDownProfileList}
            showDropDownProfileListMobile={showDropDownProfileListMobile}
            notifications={[]}
            toggleProfileList={toggleProfileList}
            token={props.token}
            />
          ) : (
            <Button size="small" onClick={handleCTAClick}>
              Login/Signup
            </Button>
          )}
        </ul>

        {/* Hamburger Menu Button */}
        <div className="flex gap-4 md:hidden">
          <MobileMenu 
          id={props.id}
          _openAllNotificationsHandler={_openAllNotificationsHandler}
          hidecta={false}
          ctaonclick={handleCTAClick}
          _deleteNotificationHandler={_deleteNotificationHandler}
          notifications={[]}
          hideNav={hideNav}
          showMobileSearch={false}
          setShowMobileSearch={()=>{}}
          setHideNav={setHideNav}
          notOpenCount={null}
          setShowLoginModal={authShowLogin}
          staticnav ={true}
          itinerary={true}
          />
          {!props.token?<Button
            className={styles.hamburger}
            onClick={toggleMobileMenu}
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
      </nav>

      {/* Mobile Sidebar Overlay */}
      <div
        ref={overlayRef}
        className={styles.mobileOverlay}
        onClick={toggleMobileMenu}
        role="button"
        tabIndex={-1}
        aria-hidden={!isMobileMenuOpen}
        onKeyDown={(e) => e.key === "Enter" && toggleMobileMenu()}
      />

      {/* Mobile Sidebar */}
      <div
        ref={sidebarRef}
        className={styles.mobileSidebar}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        <div className={styles.sidebarHeader}>
          <Image src={TTW} alt="TTW Logo" className={styles.sidebarLogo} />
          <button
            className={styles.closeButton}
            onClick={toggleMobileMenu}
            aria-label="Close mobile menu"
            type="button"
          >
            ×
          </button>
        </div>

        <ul className={styles.mobileMenuList} role="menu">
          {mobileMenuItems}
        </ul>

        <div
          ref={(el) => (menuItemsRef.current[0] = el)}
          className={styles.sidebarActions}
        >
          <button
            className={`cta-button ${styles.mobileCta}`}
            onClick={handleCTAClick}
            type="button"
          >
            Get Started
          </button>
        </div>
      </div>
    </>
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
    onLogout: () => dispatch(authLogout()),
    authShowLogin: () => dispatch(authShowLogin()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NavigationMenu);
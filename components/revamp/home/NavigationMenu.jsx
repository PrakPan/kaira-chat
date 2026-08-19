import Link from "next/link";
import { useRouter } from "next/router";
import {usePathname} from "next/navigation"
import { useCallback, useMemo, useState, useEffect } from "react";
import BrandLockup from "../../brand/BrandLockup";
import { menuAnimations } from "../common/animations/menuAnimations";
import { useMobileMenu } from "../common/hooks/useMobileMenu";
import styles from "./NavigationMenu.module.scss";
import SearchInput from "../common/components/searchInput";
import Button from "../common/components/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { connect, useDispatch, useSelector } from "react-redux";
import {  authShowLogin, authCloseLogin } from "../../../store/actions/auth";
import useMediaQuery from "../../media";
import ProfileDropDown from "../../navbar/ProfileDropDown";
import { authLogout } from "../../../store/actions/auth";
import MobileMenu from "../../navbar/mobile/Index";
import ImageLoader from "../../ImageLoader";
import * as logout from "../../../store/actions/logout";
import axios from "axios";
import { MERCURY_HOST } from "../../../services/constants";
import setHotLocationSearch from "../../../store/actions/hotLocationSearch";
import BotLoginModal from "../../bot-components/components/BotLoginModal";

// `Login` and `TailoredFormMobileModal` used to be imported here. Neither was
// rendered — BotLoginModal (below) is the live login modal, and the
// TailoredFormMobileModal JSX has been commented out since "Plan with Kaira"
// started routing to /chat?intake=1. Both imports were static, so they still
// dragged their full closure into the shared chunk on every page that renders
// the nav. If either is reinstated, load it with next/dynamic.

const NavigationMenu = (props) => {
  const {
    isMobileMenuOpen,
    toggleMobileMenu,
    closeMobileMenu,
    sidebarRef,
    overlayRef,
    menuItemsRef,
  } = useMobileMenu();
  const router = useRouter();
  const pathname = usePathname();
  const [showDropDownProfileList, setShowDropDownProfileList] = useState(false);
  const [showDropDownProfileListMobile, setShowDropDownProfileListMobile] = useState(false);
  const isMidScreen = useMediaQuery("(min-width:786px)");
  const [Height, setHeight] = useState(false);
  const [showMobileNavItems, setShowMobileNavItems] = useState(false);
  const [hideNav, setHideNav] = useState(false);
  const itinerary = useSelector(state=>state.Itinerary);
  const [showMoiblePlanner, setShowMobilePlanner] = useState(false);
  const dispatch = useDispatch();
  // Memoized active path checker to prevent unnecessary re-renders
  const isActive = useCallback(
    (path) => router.pathname.startsWith(path),
    [router.pathname]
  );
  const slideIndex = Number(router.query.slideIndex) || 0;

  // localStorage is browser-only; reading it during render crashes SSR. Read it
  // after mount so the server (and the first client render) see null, keeping
  // hydration in sync, then reflect the real token on the client.
  // Re-read on every redux auth-token change so login/logout update instantly:
  // logout clears localStorage and resets props.token, which re-runs this and
  // flips the UI to Login/Signup without needing a page refresh.
  const [accessToken, setAccessToken] = useState(null);
  useEffect(() => {
    setAccessToken(localStorage.getItem("access_token"));
  }, [props.token]);


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
  // A crawlable primary-nav link to the destinations hub (which links out to
  // every continent). Rendered as a real <a> so it's part of the link graph.
  const navLinkStyle = {
    color: "inherit",
    textDecoration: "none",
    fontWeight: 500,
    whiteSpace: "nowrap",
  };

  // const desktopMenuItems = useMemo(
  //   () => [
  //     <li key="nav-destinations" className="mr-4" role="none">
  //       <Link href="/destinations" role="menuitem" style={navLinkStyle}>
  //         Destinations
  //       </Link>
  //     </li>,
  //   ],
  //   [isActive]
  // );

  // const mobileMenuItems = useMemo(
  //   () => [
  //     <li key="nav-destinations-m" role="none">
  //       <Link
  //         href="/destinations"
  //         role="menuitem"
  //         style={navLinkStyle}
  //         onClick={closeMobileMenu}
  //       >
  //         Destinations
  //       </Link>
  //     </li>,
  //   ],
  //   [isActive, closeMobileMenu, handleMenuItemHover]
  // );
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
  useEffect(() => {
    axios.get(`${MERCURY_HOST}/api/v1/geos/search/hot_destinations`).then((res) => {
      dispatch(setHotLocationSearch(res.data));
    });
  }, [props]);

  const attachUserToItinerary = async () => {
  if (itinerary?.customer) {
    return; 
  }
  
  try {
    const response = await axios.get(
      `${MERCURY_HOST}/api/v1/itinerary/${router.query.id}/attach-user/`,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
      }
    );
      
  
  } catch (error) {
    console.error('Error attaching user to itinerary:', error);
  }
};


  return (
    <>
    <div className="w-100 bg-text-white"> 
      <nav className={styles.navigationMenu + " " + props.className + " max-ph:!p-md max-ph:shadow-soft"} role="navigation">
        <Link href="/" className={"hover-pointer " + styles.logo} aria-label="The Tarzan Way — home">
          {/* Desktop shows the full lockup (mark + wordmark + tagline); mobile
              shows only the mark, so the wordmark can't overflow the row and
              force a horizontal scroll. Exactly one is ever visible.

              The Tailwind classes duplicate what the SCSS module already does,
              on purpose. BotApp is `dynamic(..., { ssr: false })`, so this
              component paints as soon as its JS chunk lands while
              NavigationMenu.module.scss is still in flight as a separate async
              <link>. In that window every `styles.*` class is inert and BOTH
              lockups rendered. Tailwind ships in the global stylesheet in
              <head>, so it is always applied.

              The `ttw-nav-*` classes are defined in styles/globals.css — see
              the block there for why they're global and why the breakpoints
              carry the .98. */}
          <BrandLockup
            size={38}
            variant="light"
            className={`${styles.logoFull} ttw-nav-lockup-full`}
          />
          <BrandLockup
            size={30}
            variant="light"
            markOnly
            className={`${styles.logoMark} ttw-nav-lockup-mark`}
          />
        </Link>
        {pathname!="/new-trip"&& <SearchInput />}
        {/* Desktop Menu */}
        {/* Mirrors the module's own max-width rule — see the lockup note above
            for why it is duplicated in Tailwind. Without it the desktop menu
            rendered alongside the mobile avatar until the async module
            stylesheet arrived. 767.98px so it stays the exact complement of the
            `md:hidden` on the mobile block below. */}
        <ul
          className={`${styles.menuList} ttw-desktop-only`}
          role="menubar"
        >
          {/* <li className="mr-4"></li>
          {desktopMenuItems}
          <li></li> */}
          {props.token?<>{(pathname!="/dashboard"&&pathname!="/new-trip")&&<button className="MediumIndigoButton" onClick={()=>router.push("/dashboard")}>
                  My Trips
          </button>}</>: null}
          
          {(pathname!="/new-trip")&& (!pathname?.includes("/itinerary")) && pathname=="/dashboard"&& <button className="MediumIndigoButton w-fit" onClick={()=>router.push("/chat?intake=1")}>
                  Plan with Kaira <svg viewBox="0 0 12 12"  height="14" width="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 10L10 2M10 2H4M10 2V8"></path></svg>
          </button>}
          
          {accessToken ? (
            <ProfileDropDown
            pill
            name={props.name}
            image={props.image}
            onLogout={props.onLogout}
            authShowLogin={props.authShowLogin}
            setShowDropDownProfileList={setShowDropDownProfileList}
            showDropDownProfileList={showDropDownProfileList}
            showDropDownProfileListMobile={showDropDownProfileListMobile}
            notifications={[]}
            toggleProfileList={toggleProfileList}
            token={accessToken}
            />
          ) : (
            <Button size="small" onClick={handleCTAClick}>
              Login/Signup
            </Button>
          )}
        </ul>

        {/* Hamburger Menu Button */}
        <div className="flex gap-2 md:hidden">
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
          handleCTAClick={handleCTAClick}
          />
          
          {/* {!props.token?<Button
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
          } */}
        </div>
      </nav>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div
        ref={overlayRef}
        className={`${styles.mobileOverlay} ttw-nav-mobile-overlay`}
        onClick={toggleMobileMenu}
        role="button"
        tabIndex={-1}
        aria-hidden={!isMobileMenuOpen}
        onKeyDown={(e) => e.key === "Enter" && toggleMobileMenu()}
      />

      {/* Mobile Sidebar */}
      <div
        ref={sidebarRef}
        className={`${styles.mobileSidebar} ttw-nav-mobile-sidebar`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        <div className={styles.sidebarHeader}>
          <BrandLockup size={34} variant="dark" className={styles.sidebarLogo} />
          <button
            className={styles.closeButton}
            onClick={toggleMobileMenu}
            aria-label="Close mobile menu"
            type="button"
          >
            ×
          </button>
        </div>

        {/* <ul className={styles.mobileMenuList} role="menu">
          {mobileMenuItems}
        </ul> */}

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
        {slideIndex!=4&&<div id="login" className="width-[100%] z-[1650]">
        <BotLoginModal
          show={props.showLogin}
          onhide={props.authCloseLogin}
          itinary_id={props?.itinary_id}
          zIndex={"3300"}
          message={props?.message}
          onSuccess={async ()=>{
            if(props?.isItinerary && router.query.id){
              await attachUserToItinerary();
            }
          }}
        />
      </div>}
      </div>

      {/* Plan with Kaira now opens /chat?intake=1 (empty in-chat intake form)
          instead of the tailored-form modal. Old modal kept commented for
          fallback. */}
      {/* <TailoredFormMobileModal
        destinationType={"city-planner"}
        onHide={() => {
          setShowMobilePlanner(false);
          // closeTailoredModal(router);
        }}
        show={showMoiblePlanner}
      /> */}

    </>
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    name: state.auth.name,
    image: state.auth.image,
    showLogin: state.auth.showLogin,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onLogout: () => dispatch(logout.logout()),
    authShowLogin: () => dispatch(authShowLogin()),
    authCloseLogin: () => dispatch(authCloseLogin()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NavigationMenu);
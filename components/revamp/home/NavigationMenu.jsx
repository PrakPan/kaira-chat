import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";
import { TTW } from "../assets";
import { menuAnimations } from "../common/animations/menuAnimations";
import { useMobileMenu } from "../common/hooks/useMobileMenu";
import styles from "./NavigationMenu.module.scss";
import SearchInput from "../common/components/searchInput";
import Button from "../common/components/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faUser } from "@fortawesome/free-solid-svg-icons";

const NavigationMenu = () => {
  const router = useRouter();
  const {
    isMobileMenuOpen,
    toggleMobileMenu,
    closeMobileMenu,
    sidebarRef,
    overlayRef,
    menuItemsRef,
  } = useMobileMenu();

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

  return (
    <>
      <nav className={styles.navigationMenu} role="navigation">
        <Image src={TTW} alt="TTW Logo" priority />

        <SearchInput />
        {/* Desktop Menu */}
        <ul className={styles.menuList} role="menubar">
          <li className="mr-4"></li>
          {desktopMenuItems}
          <li></li>
          <Button size="small" onClick={handleCTAClick}>
            Login/Signup
          </Button>
        </ul>

        {/* Hamburger Menu Button */}
        <Button
          className={styles.hamburger}
          onClick={toggleMobileMenu}
          variant="filled"
        >
          <FontAwesomeIcon icon={faBars} className="w-4 h-4" />
        </Button>
        <Button
          className={styles.hamburger}
          onClick={toggleMobileMenu}
          variant="filled"
        >
          <FontAwesomeIcon icon={faUser} className="w-4 h-4" />
        </Button>
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

export default NavigationMenu;

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

const NAVIGATION_ITEMS = [
  { href: "/blogs", label: "Blogs" },
  { href: "/contactus", label: "Contact Us" },
  { href: "/reviews", label: "Reviews" },
];

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
    () =>
      NAVIGATION_ITEMS.map((item) => (
        <li key={item.href}>
          <Link
            className={`${styles.menuItem} ${
              isActive(item.href) ? styles.active : ""
            }`}
            href={item.href}
          >
            {item.label}
          </Link>
        </li>
      )),
    [isActive]
  );

  const mobileMenuItems = useMemo(
    () =>
      NAVIGATION_ITEMS.map((item, index) => (
        <li key={item.href} ref={(el) => (menuItemsRef.current[index] = el)}>
          <Link
            className={`${styles.mobileMenuItem} ${
              isActive(item.href) ? styles.active : ""
            }`}
            href={item.href}
            onClick={closeMobileMenu}
            onMouseEnter={(e) => handleMenuItemHover(e.target, true)}
            onMouseLeave={(e) => handleMenuItemHover(e.target, false)}
            role="menuitem"
          >
            {item.label}
          </Link>
        </li>
      )),
    [isActive, closeMobileMenu, handleMenuItemHover]
  );

  return (
    <>
      <nav className={styles.navigationMenu} role="navigation">
        <Image src={TTW} alt="TTW Logo" priority />

        {/* Desktop Menu */}
        <ul className={styles.menuList} role="menubar">
          <li className="mr-4">
            <SearchInput />
          </li>
          {desktopMenuItems}
          <li>
            <Button onClick={handleCTAClick}>Login/Signup</Button>
          </li>
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
          ref={(el) => (menuItemsRef.current[NAVIGATION_ITEMS.length] = el)}
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

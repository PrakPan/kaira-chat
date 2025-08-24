import { useCallback, useEffect, useRef, useState } from "react";
import { menuAnimations } from "../animations/menuAnimations";

/**
 * Custom hook for managing mobile menu state and animations
 * @returns {Object} Menu state and control functions
 */
export const useMobileMenu = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Refs for GSAP animations
  const sidebarRef = useRef(null);
  const overlayRef = useRef(null);
  const menuItemsRef = useRef([]);

  // Initialize menu animations on mount
  useEffect(() => {
    menuAnimations.initializeMenu(sidebarRef, overlayRef, menuItemsRef);
  }, []);

  // Cleanup animations on unmount
  useEffect(() => {
    return () => {
      menuAnimations.killAllAnimations?.();
    };
  }, []);

  // Toggle menu with proper state management
  const toggleMobileMenu = useCallback(() => {
    if (!isMobileMenuOpen) {
      setIsMobileMenuOpen(true);
      menuAnimations.openMenu(sidebarRef, overlayRef, menuItemsRef);
      menuAnimations.animateHamburger(true);
    } else {
      menuAnimations.closeMenu(sidebarRef, overlayRef, menuItemsRef, () => {
        setIsMobileMenuOpen(false);
      });
      menuAnimations.animateHamburger(false);
    }
  }, [isMobileMenuOpen]);

  // Close menu (for link clicks)
  const closeMobileMenu = useCallback(() => {
    if (isMobileMenuOpen) {
      toggleMobileMenu();
    }
  }, [isMobileMenuOpen, toggleMobileMenu]);

  // Keyboard navigation support
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        toggleMobileMenu();
      }
    },
    [isMobileMenuOpen, toggleMobileMenu]
  );

  // Add keyboard listener
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return {
    isMobileMenuOpen,
    toggleMobileMenu,
    closeMobileMenu,
    sidebarRef,
    overlayRef,
    menuItemsRef,
  };
};

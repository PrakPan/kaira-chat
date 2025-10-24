import { gsap } from "gsap";

/**
 * Menu Animation Functions
 * High-performance GSAP animations for mobile sidebar menu
 * @namespace menuAnimations
 */

// Animation constants for consistency and easy tweaking
const ANIMATION_CONFIG = {
  durations: {
    fast: 0.2,
    medium: 0.3,
    slow: 0.4,
  },
  easing: {
    in: "power2.in",
    out: "power2.out",
    inOut: "power2.inOut",
    bounce: "power3.out",
  },
  stagger: {
    fast: 0.05,
    medium: 0.1,
    slow: 0.15,
  },
};

// Store active timelines for cleanup
const activeTimelines = new Set();

export const menuAnimations = {
  /**
   * Initialize menu elements to hidden state
   */
  initializeMenu: (sidebarRef, overlayRef, menuItemsRef) => {
    if (!sidebarRef.current || !overlayRef.current) return;

    gsap.set(sidebarRef.current, {
      x: "100%",
      willChange: "transform",
    });
    gsap.set(overlayRef.current, {
      opacity: 0,
      visibility: "hidden",
      willChange: "opacity",
    });

    if (menuItemsRef.current?.length) {
      gsap.set(menuItemsRef.current, {
        x: 50,
        opacity: 0,
        willChange: "transform, opacity",
      });
    }
  },

  /**
   * Open menu with coordinated timeline animation
   */
  openMenu: (sidebarRef, overlayRef, menuItemsRef) => {
    const tl = gsap.timeline({
      onStart: () => activeTimelines.add(tl),
      onComplete: () => activeTimelines.delete(tl),
    });

    tl.to(overlayRef.current, {
      opacity: 1,
      visibility: "visible",
      duration: ANIMATION_CONFIG.durations.medium,
      ease: ANIMATION_CONFIG.easing.out,
    })
      .to(
        sidebarRef.current,
        {
          x: "0%",
          duration: ANIMATION_CONFIG.durations.slow,
          ease: ANIMATION_CONFIG.easing.bounce,
        },
        "-=0.1"
      )
      .to(
        menuItemsRef.current,
        {
          x: 0,
          opacity: 1,
          duration: ANIMATION_CONFIG.durations.medium,
          stagger: ANIMATION_CONFIG.stagger.medium,
          ease: ANIMATION_CONFIG.easing.out,
        },
        "-=0.2"
      );

    return tl;
  },

  /**
   * Close menu with reverse animation
   */
  closeMenu: (sidebarRef, overlayRef, menuItemsRef, onComplete) => {
    const tl = gsap.timeline({
      onStart: () => activeTimelines.add(tl),
      onComplete: () => {
        activeTimelines.delete(tl);
        onComplete?.();
      },
    });

    tl.to(menuItemsRef.current, {
      x: 50,
      opacity: 0,
      duration: ANIMATION_CONFIG.durations.fast,
      stagger: ANIMATION_CONFIG.stagger.fast,
      ease: ANIMATION_CONFIG.easing.in,
    })
      .to(
        sidebarRef.current,
        {
          x: "100%",
          duration: ANIMATION_CONFIG.durations.medium,
          ease: ANIMATION_CONFIG.easing.in,
        },
        "-=0.1"
      )
      .to(
        overlayRef.current,
        {
          opacity: 0,
          visibility: "hidden",
          duration: ANIMATION_CONFIG.durations.medium,
          ease: ANIMATION_CONFIG.easing.in,
        },
        "-=0.2"
      );

    return tl;
  },

  /**
   * Animate hamburger menu transformation
   */
  animateHamburger: (isOpen) => {
    const lines = document.querySelectorAll(".hamburgerLine");
    if (!lines.length) return;

    const tl = gsap.timeline({
      onStart: () => activeTimelines.add(tl),
      onComplete: () => activeTimelines.delete(tl),
    });

    if (isOpen) {
      tl.to(lines[0], {
        rotation: 45,
        y: 6,
        duration: ANIMATION_CONFIG.durations.medium,
        ease: ANIMATION_CONFIG.easing.out,
      })
        .to(
          lines[1],
          {
            opacity: 0,
            x: 10,
            duration: ANIMATION_CONFIG.durations.medium,
            ease: ANIMATION_CONFIG.easing.out,
          },
          0
        )
        .to(
          lines[2],
          {
            rotation: -45,
            y: -6,
            duration: ANIMATION_CONFIG.durations.medium,
            ease: ANIMATION_CONFIG.easing.out,
          },
          0
        );
    } else {
      tl.to(lines, {
        rotation: 0,
        y: 0,
        x: 0,
        opacity: 1,
        duration: ANIMATION_CONFIG.durations.medium,
        ease: ANIMATION_CONFIG.easing.out,
      });
    }

    return tl;
  },

  /**
   * Subtle hover animation for menu items
   */
  hoverMenuItem: (element, isHovering) => {
    if (!element) return;

    gsap.to(element, {
      x: isHovering ? 10 : 0,
      duration: ANIMATION_CONFIG.durations.medium,
      ease: ANIMATION_CONFIG.easing.out,
      overwrite: "auto",
    });
  },

  /**
   * Pulse animation for CTA buttons
   */
  pulseCTA: (element) => {
    if (!element) return;

    const tl = gsap.timeline({
      onStart: () => activeTimelines.add(tl),
      onComplete: () => activeTimelines.delete(tl),
    });

    tl.to(element, {
      scale: 1.05,
      duration: ANIMATION_CONFIG.durations.fast,
      ease: ANIMATION_CONFIG.easing.out,
      yoyo: true,
      repeat: 1,
    });

    return tl;
  },

  /**
   * Kill all active animations for cleanup
   */
  killAllAnimations: () => {
    activeTimelines.forEach((tl) => {
      if (tl && tl.kill) {
        tl.kill();
      }
    });
    activeTimelines.clear();
  },
};

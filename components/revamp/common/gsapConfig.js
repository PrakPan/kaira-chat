import { useGSAP } from "@gsap/react";
import gsap from "gsap";

// Register the useGSAP plugin once
gsap.registerPlugin(useGSAP);

// Common animation configurations
export const ANIMATION_CONFIG = {
  // Common easing functions
  ease: {
    backOut: "back.out(1.7)",
    powerOut: "power2.out",
    powerInOut: "power2.inOut",
  },

  // Common animation durations
  duration: {
    fast: 0.8,
    medium: 1,
    slow: 3,
  },

  // Common initial states
  initialStates: {
    fromBottom: {
      y: 100,
      opacity: 0,
    },
    fromBottomSmall: {
      y: 30,
      opacity: 0,
    },
    hidden: {
      opacity: 0,
    },
  },

  // Common stagger configurations
  stagger: {
    short: { amount: 0.3, from: "start" },
    medium: { amount: 0.4, from: "start" },
    long: { amount: 1.2, from: "start" },
  },
};

// Utility function for creating entrance animations
export const createEntranceAnimation = (elements, config = {}) => {
  const {
    duration = ANIMATION_CONFIG.duration.fast,
    ease = ANIMATION_CONFIG.ease.backOut,
    stagger = ANIMATION_CONFIG.stagger.medium,
    delay = 0,
  } = config;

  return {
    y: 0,
    opacity: 1,
    duration,
    ease,
    stagger,
    delay,
  };
};

// Utility function for creating floating animations
export const createFloatingSequence = (timeline, elements, config = {}) => {
  const {
    movements = [
      { y: -8, duration: 3, stagger: { amount: 0.3, from: "start" } },
      { y: 8, duration: 3, stagger: { amount: 0.3, from: "center" } },
      { y: -5, duration: 2.5, stagger: { amount: 0.2, from: "end" } },
      { y: 0, duration: 2, stagger: { amount: 0.4, from: "random" } },
    ],
    startDelay = "+=0.5",
  } = config;

  movements.forEach((movement, index) => {
    const position = index === 0 ? startDelay : undefined;
    timeline.to(
      elements,
      {
        ...movement,
        ease: ANIMATION_CONFIG.ease.powerInOut,
      },
      position
    );
  });

  return timeline;
};

// Utility function for creating floating icon animations (for WhatMakesUsSection)
export const createFloatingIconAnimations = (iconRefs) => {
  const icons = iconRefs.map((ref) => ref.current).filter(Boolean);

  icons.forEach((icon, index) => {
    if (icon) {
      // Create floating animation with different parameters for each icon
      gsap.to(icon, {
        y: `${10 + index * 3}px`, // Different floating heights
        x: `${5 + index * 2}px`, // Slight horizontal movement
        rotation: `${2 + index}deg`, // Slight rotation
        duration: 2 + index * 0.3, // Different durations
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
        delay: index * 0.2, // Staggered start times
      });

      // Add a secondary floating motion
      gsap.to(icon, {
        scale: 1.05,
        duration: 1.5 + index * 0.2,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
        delay: index * 0.1,
      });
    }
  });

  // Return cleanup function
  return () => {
    icons.forEach((icon) => {
      if (icon) {
        gsap.killTweensOf(icon);
      }
    });
  };
};

// Utility function for splitting text into animated words
export const splitTextIntoWords = (container, selector = ".heading-text") => {
  const headings = container.querySelectorAll(selector);

  headings.forEach((heading) => {
    const text = heading.textContent;
    const words = text.split(" ");

    // Clear the heading and rebuild with wrapped words
    heading.innerHTML = words
      .map(
        (word) =>
          `<span class="word" style="display: inline-block; overflow: hidden;">
        <span style="display: inline-block;">${word}</span>
      </span>`
      )
      .join(" ");
  });

  return container.querySelectorAll(".word span");
};

// Utility function for creating sequential content animations
export const createSequentialContentAnimation = (
  timeline,
  elements,
  config = {}
) => {
  const {
    delays = ["+=0.3", "+=0.2"],
    duration = ANIMATION_CONFIG.duration.medium,
    ease = ANIMATION_CONFIG.ease.powerOut,
  } = config;

  elements.forEach((element, index) => {
    timeline.to(
      element,
      {
        opacity: 1,
        y: 0,
        duration,
        ease,
      },
      delays[index] || "+=0.2"
    );
  });

  return timeline;
};

export { gsap, useGSAP };

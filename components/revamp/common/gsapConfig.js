import { useGSAP } from "@gsap/react";
import gsap from "gsap";

// Register GSAP plugin
gsap.registerPlugin(useGSAP);

// Disable lag smoothing to prevent micro jumps on macOS resume
gsap.ticker.lagSmoothing(false);

// --- SSR-safe helpers ---
// Returns true if user prefers reduced motion
export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Returns true if running on Safari
export const isSafari = () => {
  if (typeof navigator === "undefined") return false;
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
};

// Run animation code only if motion is allowed
export const runIfMotionAllowed = (fn) => {
  if (!prefersReducedMotion()) fn();
};

// Common animation configurations
export const ANIMATION_CONFIG = {
  ease: {
    backOut: "back.out(1.7)",
    powerOut: "power2.out",
    powerInOut: "power2.inOut",
  },
  duration: {
    fast: 0.8,
    medium: 1,
    slow: 3,
  },
  initialStates: {
    fromBottom: { y: 100, opacity: 0 },
    fromBottomSmall: { y: 30, opacity: 0 },
    hidden: { opacity: 0 },
  },
  stagger: {
    short: { each: 0.05, from: "start" },
    medium: { each: 0.08, from: "start" },
    long: { each: 0.12, from: "start" },
  },
};

// 🪄 Utility: Entrance animation
export const createEntranceAnimation = (elements, config = {}) => {
  const {
    duration = ANIMATION_CONFIG.duration.fast,
    ease = ANIMATION_CONFIG.ease.backOut,
    stagger = ANIMATION_CONFIG.stagger.long,
    delay = 0,
  } = config;

  return {
    y: 0,
    opacity: 1,
    duration,
    ease,
    stagger,
    delay,
    force3D: true, // GPU acceleration
    willChange: "transform, opacity",
  };
};

// 🌊 Utility: Floating animation (simplified infinite loop)
export const createFloatingSequence = (timeline, elements, config = {}) => {
  const {
    y = 8,
    duration = 3,
    stagger = { each: 0.15, from: "center" },
    startDelay = "+=0.5",
  } = config;

  runIfMotionAllowed(() => {
    timeline.to(
      elements,
      {
        y,
        ease: ANIMATION_CONFIG.ease.powerInOut,
        duration,
        repeat: -1,
        yoyo: true,
        stagger,
        force3D: true,
        willChange: "transform",
      },
      startDelay
    );
  });

  return timeline;
};

// 🌈 Utility: Floating icon animations (optimized for macOS)
export const createFloatingIconAnimations = (iconRefs) => {
  const icons = iconRefs.map((ref) => ref.current).filter(Boolean);
  const timelines = [];

  runIfMotionAllowed(() => {
    icons.forEach((icon, index) => {
      if (icon) {
        // GPU compositing hints
        gsap.set(icon, {
          willChange: "transform, opacity",
          transform: "translate3d(0, 0, 0)",
          backfaceVisibility: "hidden",
        });

        // Single continuous floating timeline
        const tl = gsap.timeline({ repeat: -1, yoyo: true });

        tl.to(icon, {
          y: `${10 + index * 3}px`,
          x: `${5 + index * 2}px`,
          rotation: `${2 + index}deg`,
          scale: 1.05,
          duration: 2 + index * 0.3,
          ease: "power2.inOut",
          delay: index * 0.2,
          force3D: true,
          willChange: "transform",
        });

        timelines.push(tl);
      }
    });
  });

  // Cleanup
  return () => {
    timelines.forEach((tl) => tl.kill());
  };
};

// ✂️ Utility: Split text into animated words
export const splitTextIntoWords = (container, selector = ".heading-text") => {
  const headings = container.querySelectorAll(selector);

  headings.forEach((heading) => {
    const text = heading.textContent;
    const words = text.split(" ");

    heading.innerHTML = words
      .map(
        (word) =>
          `<span class="word" style="display:inline-block;overflow:hidden;will-change:transform,opacity;">
             <span style="display:inline-block;transform:translate3d(0,0,0);backface-visibility:hidden;">${word}</span>
           </span>`
      )
      .join(" ");
  });

  return container.querySelectorAll(".word span");
};

// 🧩 Utility: Sequential content animations
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

  runIfMotionAllowed(() => {
    elements.forEach((element, index) => {
      timeline.to(
        element,
        {
          opacity: 1,
          y: 0,
          duration,
          ease,
          force3D: true,
          willChange: "transform, opacity",
        },
        delays[index] || "+=0.2"
      );
    });
  });

  return timeline;
};

export { gsap, useGSAP };

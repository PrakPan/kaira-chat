import { useRef } from "react";
import {
  ANIMATION_CONFIG,
  createEntranceAnimation,
  createSequentialContentAnimation,
  gsap,
  splitTextIntoWords,
  useGSAP,
} from "../common/gsapConfig";
import styles from "./HeadingContent.module.scss";
import Link from "next/link";
import Button from "../common/components/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const HeadingContent = ({ title, subtitle }) => {
  const headingRef = useRef(null);
  const containerRef = useRef(null);
  const contentWrapperRef = useRef(null);
  const buttonRef = useRef(null);

  useGSAP(
    () => {
      // Check if refs are properly attached
      if (
        !headingRef.current ||
        !contentWrapperRef.current ||
        !buttonRef.current
      ) {
        console.warn("GSAP refs not properly attached");
        return;
      }

      // Split text into words and get word elements
      const wordElements = splitTextIntoWords(headingRef.current);

      // Set initial states using shared configuration
      gsap.set(wordElements, ANIMATION_CONFIG.initialStates.fromBottom);
      gsap.set(
        [contentWrapperRef.current, buttonRef.current],
        ANIMATION_CONFIG.initialStates.fromBottomSmall
      );

      // Create timeline for coordinated animations
      const tl = gsap.timeline();

      // Animate words appearing from bottom with stagger
      tl.to(
        wordElements,
        createEntranceAnimation(wordElements, {
          stagger: ANIMATION_CONFIG.stagger.long,
        })
      );

      // Animate content wrapper and button together
      tl.to([contentWrapperRef.current, buttonRef.current], {
        opacity: 1,
        y: 0,
        duration: ANIMATION_CONFIG.duration.fast,
        ease: ANIMATION_CONFIG.ease.backOut,
        stagger: 0.05,
      });
    },
    { scope: containerRef }
  );
  return (
    <div ref={containerRef} className={styles.headingContent}>
      <div ref={headingRef}>
        <h1 className={`${styles.title} heading-text`}>Bonjour, Paris! </h1>
        <h1 className={`${styles.title} heading-text`}>
          Crafted by AI, Inspired by You.
        </h1>
      </div>
      <div ref={contentWrapperRef} className={styles.contentWrapper}>
        <p className={`${styles.subtitle} text-text-focused`}>
          From hidden cafés to iconic landmarks, your Paris trip is crafted with
          smart planning and a <br /> personal touch—so every moment feels made
          just for you.
        </p>
      </div>
      <div ref={buttonRef}>
        <Link href="/new-trip">
          <Button
            variant="filled"
            color="default"
            size="medium"
            className="mt-6 !bg-primary-indigo !border-primary-indigo hover:!bg-primary-indigo/90"
          >
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
              <span>Get your Customised Itinerary</span>
            </div>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default HeadingContent;

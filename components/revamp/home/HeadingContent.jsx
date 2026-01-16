import { useRef, useState } from "react";
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
import openTailoredModal from "../../../services/openTailoredModal";
import { closeTailoredModal } from "../../../services/openTailoredModalV2";
import TailoredFormMobileModal from "../../modals/TailoredFomrMobile";
import { useRouter } from "next/router";

const HeadingContent = ({ title, subtitle }) => {
  const headingRef = useRef(null);
  const containerRef = useRef(null);
  const contentWrapperRef = useRef(null);
  const buttonRef = useRef(null);
  const [showMoiblePlanner, setShowMobilePlanner] = useState(false);
  const router = useRouter();

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
        <h1 className={`${styles.title} heading-text`}>
          Your Trip, Your Vibe{" "}
        </h1>
        <h1 className={`${styles.title} heading-text`}>Our AI's on It</h1>
      </div>
      <div ref={contentWrapperRef} className={styles.contentWrapper}>
        <p className={`${styles.subtitle} text-text-focused`}>
          Solo? Couple? Group? We Plan Like It’s Just for You — Because It Is
        </p>
      </div>
      <div ref={buttonRef}>
        {/* <Link href="/new-trip"> */}
        <Button
          variant="filled"
          color="default"
          size="medium"
          className="mt-6 !bg-primary-indigo !border-primary-indigo hover:!bg-primary-indigo/90"
          onClick={() => {
            router.push(
              {
                pathname: router.pathname,
                query: {
                  ...router.query,
                  "tailored-travel": "true",
                },
              },
              undefined,
              { shallow: true }
            );
            setShowMobilePlanner(true);
          }}
        >
          <div className="flex items-center space-x-2">
            <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
            <span>Plan & Book My Trip with AI</span>
          </div>
        </Button>
        {/* </Link> */}
      </div>

      <TailoredFormMobileModal
        destinationType={"city-planner"}
        onHide={() => {
          setShowMobilePlanner(false);
          // closeTailoredModal(router);
        }}
        show={showMoiblePlanner}
      />
    </div>
  );
};

export default HeadingContent;

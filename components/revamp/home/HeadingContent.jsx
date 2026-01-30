

import { useRef, useState, useEffect } from "react";
import {
  ANIMATION_CONFIG,
  createEntranceAnimation,
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

  // Ensure first paint happens BEFORE animation
  useEffect(() => {
    document.documentElement.classList.add("hero-painted");
  }, []);

  useGSAP(
    () => {
      if (
        !headingRef.current ||
        !contentWrapperRef.current ||
        !buttonRef.current
      ) {
        return;
      }

      // Split heading text AFTER first paint
      const wordElements = splitTextIntoWords(headingRef.current);

      // IMPORTANT:
      // Visible on first paint → LCP-safe
      gsap.set(wordElements, {
        y: 0,
        opacity: 1,
        willChange: "transform",
      });

      gsap.set([contentWrapperRef.current, buttonRef.current], {
        y: 0,
        opacity: 1,
        willChange: "transform",
      });

      const tl = gsap.timeline({ delay: 0.1 });

      // Animate transform ONLY
      tl.from(wordElements, {
        y: 40,
        stagger: ANIMATION_CONFIG.stagger.long,
        duration: ANIMATION_CONFIG.duration.medium,
        ease: ANIMATION_CONFIG.ease.out,
      });

      tl.from(
        [contentWrapperRef.current, buttonRef.current],
        {
          y: 20,
          duration: ANIMATION_CONFIG.duration.fast,
          ease: ANIMATION_CONFIG.ease.out,
          stagger: 0.05,
        },
        "-=0.3"
      );
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className={styles.headingContent}>
      <div ref={headingRef}>
        <h1 className={`${styles.title} heading-text`}>
          Your Trip, Your Vibe
        </h1>
        <h1 className={`${styles.title} heading-text`}>
          Our AI&apos;s on It
        </h1>
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

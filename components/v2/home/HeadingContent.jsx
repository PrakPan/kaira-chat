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

const HeadingContent = ({ title, subtitle }) => {
  const headingRef = useRef(null);
  const containerRef = useRef(null);
  const contentWrapperRef = useRef(null);
  const buttonRef = useRef(null);

  useGSAP(
    () => {
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
          Your Trip. Your Vibe.{" "}
        </h1>
        <h1 className={`${styles.title} heading-text`}>Our AI's on It.</h1>
      </div>
      <div ref={contentWrapperRef} className={styles.contentWrapper}>
        <p className={`${styles.subtitle} text-text-focused`}>
          Solo? Couple? Group? We Plan Like It’s Just for You — Because It Is.
        </p>
      </div>
      <button
        ref={buttonRef}
        className="bg-slate-800 no-underline group cursor-pointer relative rounded-full p-px text-xs font-semibold leading-6 text-white inline-block mt-6"
      >
        <span className="absolute inset-0 overflow-hidden rounded-full">
          <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(251, 247, 19, 0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </span>
        <Link
          href="/new-trip"
          className="relative flex space-x-2 items-center z-10 rounded-full bg-zinc-950 py-2 px-6 ring-1 ring-white/10 text-white"
        >
          <span>Create a Trip in Seconds</span>
          <svg
            fill="none"
            height="16"
            viewBox="0 0 24 24"
            width="16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.75 8.75L14.25 12L10.75 15.25"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
          </svg>
        </Link>
        <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
      </button>
    </div>
  );
};

export default HeadingContent;

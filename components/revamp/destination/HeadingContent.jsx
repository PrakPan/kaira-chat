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
import { capitalizeFirstLetter } from "../../../utils/tailoredform";

const HeadingContent = ({ title, subtitle, slug=null }) => {
  const headingRef = useRef(null);
  const containerRef = useRef(null);
  const contentWrapperRef = useRef(null);
  const buttonRef = useRef(null);

  const isStrangerThings = slug === "strangerthings-2025";

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
    isStrangerThings ? 
    <div ref={containerRef} className={styles.headingContent} style={{height:"100%",width:"100%"}}>
    <div ref={headingRef}>
      <h1 className={`${styles.title} heading-text`}>{`${title || '' }`} </h1>
      <div ref={contentWrapperRef} className={styles.contentWrapper}>
        <p className={`${styles.subtitle} text-text-focused`}>
          {`${subtitle || '' }`}
        </p>
      </div>
    </div>
    
    {/* Combined container for button and subheading */}
    <div className="absolute bottom-[4%] sm:bottom-[8%] md:bottom-[10%] left-1/2 -translate-x-1/2 w-[90%] sm:w-auto flex flex-col items-center gap-3 sm:gap-4">
      <div ref={buttonRef}>
        <Link href={`/new-trip/?source=${slug || 'home'}`}>
          <Button
            variant="filled"
            color="default"
            size="medium"
            className="!bg-red-500 text-sm sm:text-base px-4 sm:px-6 whitespace-nowrap"
          >
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faPlus} className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{slug && slug != 'thank-you' ? `Create My Stranger Things Trip` : "Get your Customised Itinerary"}</span>
            </div>
          </Button>
        </Link>
      </div>
      
      <div ref={contentWrapperRef} className="text-center invisible">
        <p className={`${styles.subtitle}  text-text-focused !text-sm sm:text-sm md:!text-base `}>
          No generic plans. Just AI + Experts crafting journeys around your vibe, budget & dates.
        </p>
      </div>
    </div>
  </div> : <div ref={containerRef} className={styles.headingContent}>
      <div ref={headingRef}>
        <h1 className={`${styles.title} heading-text`}>{`${title || '' }`} </h1>
        {/* <h1 className={`${styles.title} heading-text`}>
          Crafted by AI, Inspired by You.
        </h1> */}
      </div>
      <div ref={contentWrapperRef} className={styles.contentWrapper}>
        <p className={`${styles.subtitle} text-text-focused`}>
          {subtitle ? subtitle : "No generic plans. Just AI + Experts crafting journeys around your vibe, budget & dates."}
        </p>
      </div>
      <div ref={buttonRef}>
        <Link href={`/new-trip/?source=${slug || 'home'}`}>
          <Button
            variant="filled"
            color="default"
            size="medium"
            className="mt-6 !bg-primary-indigo !border-primary-indigo hover:!bg-primary-indigo/90"
          >
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
              <span>Plan & Book My Trip with AI
                {/* {slug && slug != 'thank-you' ? `Create My ${capitalizeFirstLetter(slug)} Trip` : "Get your Customised Itinerary"} */}
                </span>
            </div>
          </Button>
        </Link>
      </div>
    </div> 
  );
};

export default HeadingContent;

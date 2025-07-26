"use client";

import Image from "next/image";
import { useRef } from "react";
import { heroImages } from "../assets";
import {
  ANIMATION_CONFIG,
  createEntranceAnimation,
  createFloatingSequence,
  gsap,
  useGSAP,
} from "../common/gsapConfig";
import HeadingContent from "./HeadingContent";
import styles from "./HeroSection.module.scss";

const HeroSection = ({ title, subtitle }) => {
  const imageRefs = useRef([]);
  const containerRef = useRef(null);
  const sectionRef = useRef(null);

  // GSAP animation using useGSAP hook
  useGSAP(
    () => {
      // Set initial state - images are below viewport and invisible
      gsap.set(imageRefs.current, {
        ...ANIMATION_CONFIG.initialStates.fromBottom,
        transformOrigin: "center bottom",
      });

      // Create timeline for coordinated animations
      const tl = gsap.timeline();

      // Initial pop-up animation with stagger effect
      tl.to(imageRefs.current, createEntranceAnimation(imageRefs.current));

      // Add floating animation sequence
      createFloatingSequence(tl, imageRefs.current);

      // Make the floating animation repeat infinitely
      tl.repeat(-1);
    },
    { scope: containerRef }
  );

  return (
    <section ref={sectionRef} className={styles.heroSection}>
      <HeadingContent title={title} subtitle={subtitle} />
      <div ref={containerRef} className={styles.backgroundWrapper}>
        {heroImages.map((image, index) => (
          <div
            key={index}
            ref={(el) => (imageRefs.current[index] = el)}
            className={styles.foregroundImage}
          >
            <Image src={image} alt={`Hero Image ${index + 1}`} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;

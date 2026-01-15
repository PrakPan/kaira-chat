"use client";

import Image from "next/image";
import { useRef, useState, useCallback } from "react";
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
  const [loadedImages, setLoadedImages] = useState(0);
  const [animationStarted, setAnimationStarted] = useState(false);

  const handleImageLoad = useCallback(() => {
    setLoadedImages((prev) => prev + 1);
  }, []);

  const allImagesLoaded = loadedImages >= heroImages.length;

  useGSAP(
    () => {
      if (!allImagesLoaded || animationStarted) return;

      // IMPORTANT:
      // Images are visible on first paint → LCP-safe
      gsap.set(imageRefs.current, {
        y: 0,
        opacity: 1,
        willChange: "transform",
        transformOrigin: "center bottom",
      });

      const tl = gsap.timeline();

      // Animate transform only (no opacity)
      tl.from(imageRefs.current, {
        y: 80,
        stagger: 0.15,
        ease: "power3.out",
        duration: 1,
      });

      // Floating animation (unchanged)
      createFloatingSequence(tl, imageRefs.current);

      tl.repeat(-1);
      setAnimationStarted(true);
    },
    { scope: containerRef, dependencies: [allImagesLoaded, animationStarted] }
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
            <Image
              src={image}
              alt={`Hero Image ${index + 1}`}
              onLoad={handleImageLoad}
              sizes="(max-width: 768px) 90vw, 600px"
              priority={index === 0}
              fetchPriority={index === 0 ? "high" : "auto"}
              loading={index === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;

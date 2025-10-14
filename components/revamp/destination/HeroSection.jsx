"use client";

import Image from "next/image";
import { useRef, useState, useCallback } from "react";
import {
  ANIMATION_CONFIG,
  createEntranceAnimation,
  createFloatingSequence,
  gsap,
  useGSAP,
} from "../common/gsapConfig";
import HeadingContent from "./HeadingContent";
import styles from "./HeroSection.module.scss";

const HeroSection = ({ title, subtitle, image }) => {
  const imageRefs = useRef([]);
  const containerRef = useRef(null);
  const sectionRef = useRef(null);
  const [loadedImages, setLoadedImages] = useState(0);
  const [animationStarted, setAnimationStarted] = useState(false);

  console.log("Img",image)

  // Use prop image if provided (single or array), otherwise use default heroImages
  const imagesToUse = image 
    ? (Array.isArray(image) ? image : [image])
    : null;

  // Track image loading
  const handleImageLoad = useCallback(() => {
    setLoadedImages((prev) => prev + 1);
  }, []);

  // Check if all images are loaded
  const allImagesLoaded = loadedImages >= imagesToUse.length;

  // GSAP animation using useGSAP hook - only start when all images are loaded
useGSAP(
  () => {
    if (!allImagesLoaded || animationStarted || imageRefs.current.length === 0) return;

    // Set initial state
    gsap.set(imageRefs.current, {
      ...ANIMATION_CONFIG.initialStates.fromBottom,
      transformOrigin: "center bottom",
    });

    // Create timeline
    const tl = gsap.timeline();

    // Entrance animation - make sure it ends with opacity: 1
    tl.to(imageRefs.current, {
      ...createEntranceAnimation(imageRefs.current),
      opacity: 1, // Explicitly ensure opacity ends at 1
    });

    // Floating animation
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
        {imagesToUse.map((img, index) => (
          <div 
            key={index} 
            ref={(el) => {
              if (el) imageRefs.current[index] = el;
            }}
            className={styles.imageContainer}
          >
            <Image
              src={img}
              alt={`Hero image ${index + 1}`}
              onLoad={handleImageLoad}
              fill
              priority={index === 0}
              style={{ objectFit: 'cover' }}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
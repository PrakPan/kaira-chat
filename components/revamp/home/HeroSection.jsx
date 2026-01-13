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

  // Track image loading
  const handleImageLoad = useCallback(() => {
    setLoadedImages((prev) => prev + 1);
  }, []);

  // Check if all images are loaded
  const allImagesLoaded = loadedImages >= heroImages.length;

  // GSAP animation using useGSAP hook - only start when all images are loaded
  useGSAP(
    () => {
      // Only start animation if all images are loaded and animation hasn't started yet
      if (!allImagesLoaded || animationStarted) return;

      // Set initial state - images are below viewport and invisible (original behavior)
      gsap.set(imageRefs.current, {
        ...ANIMATION_CONFIG.initialStates.fromBottom,
        transformOrigin: "center bottom",
        willChange: "transform, opacity", // perf hint without changing animation values
      });

      // Create timeline for coordinated animations (original sequence)
      const tl = gsap.timeline();

      // Initial pop-up animation with stagger effect (original helper)
      tl.to(imageRefs.current, createEntranceAnimation(imageRefs.current));

      // Floating animation sequence (original helper)
      createFloatingSequence(tl, imageRefs.current);

      // Infinite repeat (original)
      tl.repeat(-1);

      // Mark animation as started
      setAnimationStarted(true);
    },
    { scope: containerRef, dependencies: [allImagesLoaded, animationStarted] }
  );

  return (
    <>
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
                loading={index === 0 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </div>


      </section>

      <div className={styles.featuresSection}>
        <div className={styles.featuresContainer}>
     {[
            { src: "/google.svg", text: "4.8+ rated" },
            { src: "/assets/trustfactor/trust-factor-3.svg", text: "All Taxes & Fees Included" },
            { src: "/assets/trustfactor/trust-factor-2.svg", text: "24/7 Support" },
            { src: "/assets/trustfactor/trust-factor-4.svg", text: "Secure Payments" },
          ].map((item, i) => (
            <div key={i} className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <Image
                  src={item.src}
                  width={24}
                  height={24}
                  className="rounded-circle"
                  alt={item.text}
                  loading="lazy"
                />
              </div>
              <span className={styles.featureText}>{item.text}</span>
            </div>
          ))}
        </div>

        {/* Background Decorative Curved Lines */}
        <div className={styles.featuresBg}>
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M 0 30 Q 100 10, 200 30 T 400 30 T 600 30 T 800 30 T 1000 30 T 1200 30 T 1400 30"
              stroke="rgba(255, 255, 255, 0.15)"
              strokeWidth="2"
              fill="none"
              className={styles.bgCurve}
            />
            <path
              d="M 100 50 Q 200 35, 300 50 T 500 50 T 700 50 T 900 50 T 1100 50 T 1300 50"
              stroke="rgba(255, 255, 255, 0.12)"
              strokeWidth="2"
              fill="none"
              className={styles.bgCurve}
            />
            <path
              d="M 0 40 Q 150 25, 300 40 T 600 40 T 900 40 T 1200 40 T 1500 40"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="2"
              fill="none"
              className={styles.bgCurve}
            />
            <path
              d="M 50 20 Q 180 5, 310 20 T 570 20 T 830 20 T 1090 20 T 1350 20"
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="2"
              fill="none"
              className={styles.bgCurve}
            />
          </svg>
        </div>
      </div>
    </>
  );
};

export default HeroSection;

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
              priority={index < 2} 
            />
          </div>
        ))}
      </div>

     
    </section>

     <div className={styles.featuresSection}>
        <div className={styles.featuresContainer}>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              {/* <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="white"/>
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" fill="#4285F4"/>
                <path d="M16.9 8.9L15.5 7.5L10.5 12.5L8.5 10.5L7.1 11.9L10.5 15.3L16.9 8.9Z" fill="white"/>
                <path d="M12 6C8.69 6 6 8.69 6 12C6 15.31 8.69 18 12 18C15.31 18 18 15.31 18 12C18 8.69 15.31 6 12 6ZM10.5 14.5L7.5 11.5L8.56 10.44L10.5 12.38L15.44 7.44L16.5 8.5L10.5 14.5Z" fill="#34A853"/>
              </svg> */}
              <div className="w-6 h-6 relative rounded-full overflow-hidden">
              <Image src="/google.svg" width={24} height={24} alt="5 Star Rating" />
              </div>
            </div>
            <span className={styles.featureText}>4.8+ rated</span>
          </div>
          
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              {/* <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="6" width="18" height="14" rx="2" fill="white"/>
                <rect x="3" y="6" width="18" height="14" rx="2" stroke="white" strokeWidth="1.5"/>
                <path d="M3 10H21" stroke="#001F3F" strokeWidth="2"/>
                <rect x="6" y="13" width="4" height="2" rx="0.5" fill="#001F3F"/>
              </svg> */}
              <div className="w-6 h-6 relative rounded-full overflow-hidden">
              <Image src="/assets/trustfactor/trust-factor-3.svg" width={24} height={24} alt="All Taxes & Fees Included" />
              </div>
            </div>
            <span className={styles.featureText}>All Taxes & Fees Included</span>
          </div>
          
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              {/* <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="white"/>
                <path d="M9 12L11 14L15 10" stroke="#34A853" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg> */}
              <div className="w-6 h-6 relative rounded-full overflow-hidden">
              <Image src="/assets/trustfactor/trust-factor-2.svg" width={24} height={24} alt="No Hidden Charges" />
              </div>
            </div>
            {/* <span className={styles.featureText}>No Hidden Charges</span> */}
            <span className={styles.featureText}>24/7 Support</span>
          </div>
          
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              {/* <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="5" y="11" width="14" height="10" rx="2" fill="white"/>
                <path d="M8 11V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V11" stroke="white" strokeWidth="2"/>
                <circle cx="12" cy="16" r="1.5" fill="#001F3F"/>
                <path d="M12 17.5V19" stroke="#001F3F" strokeWidth="1.5" strokeLinecap="round"/>
              </svg> */}
              <div className="w-6 h-6 relative  overflow-hidden">
              <Image src="/assets/trustfactor/trust-factor-4.svg" width={24} height={24} alt="Secure Payments" />
              </div>
            </div>
            <span className={styles.featureText}>Secure Payments</span>
          </div>
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

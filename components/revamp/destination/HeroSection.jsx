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

 const trustFactors = [
    {
      icon: 
      "/assets/trustfactor/trust-factor-1.svg",
      text: "Trusted by 10,000+ Travelers",
      popupTitle: "No Hidden Charges",
      popupDescription:
        "All costs are transparent and disclosed upfront. What you see is what you pay - no surprises at checkout.",
    },
    {
      icon: 
      "/assets/trustfactor/trust-factor-2.svg",
      text: "24/7 Support",
      popupTitle: "No Hidden Charges",
      popupDescription:
        "Round-the-clock customer support with complete pricing transparency. No hidden fees, ever.",
    },
    {
      icon:
      "/assets/trustfactor/trust-factor-3.svg",
      text: "GST Invoice Provided",
      popupTitle: "No Hidden Charges",
      popupDescription:
        "Complete tax transparency with detailed GST invoices. All charges clearly itemized.",
    },
    {
      icon:
      "/assets/trustfactor/trust-factor-4.svg",
      text: "Secure Payments",
      popupTitle: "No Hidden Charges",
      popupDescription:
        "Safe and secure payment gateway with transparent pricing. No hidden transaction fees.",
    },
  ];


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



       {/* Features Section - Desktop Only */}
      <div className={styles.featuresSection}>
        <div className={styles.featuresContainer}>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <div className="w-6 h-6 relative rounded-full overflow-hidden">
              <Image src="/google.svg" width={24} height={24} alt="5 Star Rating" />
              </div>
            </div>
            <span className={styles.featureText}>4.8+ rated</span>
          </div>
          
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <div className="w-6 h-6 relative rounded-full overflow-hidden">
              <Image src="/assets/trustfactor/trust-factor-3.svg" width={24} height={24} alt="All Taxes & Fees Included" />
              </div>
            </div>
            <span className={styles.featureText}>All Taxes & Fees Included</span>
          </div>
          
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <div className="w-6 h-6 relative rounded-full overflow-hidden">
              <Image src="/payments.svg" width={24} height={24} alt="No Hidden Charges" />
              </div>
            </div>
            <span className={styles.featureText}>No Hidden Charges</span>
          </div>
          
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
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
    </section>
  );
};

export default HeroSection;
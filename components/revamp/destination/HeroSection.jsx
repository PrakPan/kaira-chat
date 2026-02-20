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
import TrustFactors from "./TrustFactors";
import media from "../../media";
import { imgUrlEndPoint } from "../../theme/ThemeConstants";

const HeroSection = ({ title, subtitle, image, slug=null,setShowTailoredModal}) => {
  const imageRefs = useRef([]);
  const containerRef = useRef(null);
  const sectionRef = useRef(null);
  const [loadedImages, setLoadedImages] = useState(0);
  const [animationStarted, setAnimationStarted] = useState(false);
  let isPageWide = media("(min-width: 768px)");


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
    <>
    <section ref={sectionRef} className={styles.heroSection}>
      <HeadingContent title={title} subtitle={subtitle} slug={slug ? slug : 'home'} setShowTailoredModal={setShowTailoredModal}/>
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
              src={slug == 'kashmir-2026' ?  '/kashmir-2026.jpg' :img}
              alt={`Hero image ${index + 1}`}
              onLoad={handleImageLoad}
              fill
              priority={index === 0}
              style={{ objectFit: 'cover'}}
            />
          </div>
        ))}
      </div>



       {/* Features Section - Desktop Only */}
       
    </section>
    <TrustFactors/>
    </>
  );
};

export default HeroSection;
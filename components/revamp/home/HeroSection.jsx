"use client";

import Image from "next/image";
import { useRef, useState, useCallback, useEffect } from "react";
import { heroImages } from "../assets";
import {
  createFloatingSequence,
  gsap,
} from "../common/gsapConfig";
import HeadingContent from "./HeadingContent";
import bg from "../assets/bg.webp";
import styles from "./HeroSection.module.scss";

export default function HeroSection({ title, subtitle }) {
  const imageRefs = useRef([]);
  const containerRef = useRef(null);
  const [loadedImages, setLoadedImages] = useState(0);
  const [animationStarted, setAnimationStarted] = useState(false);

  const handleImageLoad = useCallback(() => {
    setLoadedImages((prev) => prev + 1);
  }, []);

  const allImagesLoaded = loadedImages >= heroImages.length;

  // Start GSAP only after first paint + images loaded
  useEffect(() => {
    if (!allImagesLoaded || animationStarted) return;

    requestAnimationFrame(() => {
      gsap.set(imageRefs.current, {
        y: 0,
        opacity: 1,
        willChange: "transform",
      });

      const tl = gsap.timeline();

      tl.from(imageRefs.current, {
        y: 80,
        stagger: 0.15,
        ease: "power3.out",
        duration: 1,
      });

      createFloatingSequence(tl, imageRefs.current);
      tl.repeat(-1);
      setAnimationStarted(true);
    });
  }, [allImagesLoaded, animationStarted]);

  return (
    <section className={styles.heroSection}>
      {/* Background — LCP safe */}
      {/* <Image
        src={bg}
        alt=""
        fill
        priority
        sizes="100vw"
        className={styles.bgImage}
      /> */}

      {/* Text renders immediately */}
      <HeadingContent title={title} subtitle={subtitle} />
{/* 
      <div ref={containerRef} className={styles.backgroundWrapper}>
        {heroImages.map((image, index) => (
          <div
            key={index}
            ref={(el) => (imageRefs.current[index] = el)}
            className={styles.foregroundImage}
          >
            <Image
              src={image}
              alt=""
              onLoad={handleImageLoad}
              sizes="(max-width: 768px) 90vw, 600px"
              priority={index === 0}
              fetchPriority={index === 0 ? "high" : "auto"}
              loading={index === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}
      </div> */}
    </section>
  );
}

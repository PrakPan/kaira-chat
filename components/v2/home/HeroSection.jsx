'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Image from 'next/image';
import styles from './HeroSection.module.scss';
import f1 from '../assets/1.png';
import f2 from '../assets/2.png';
import f3 from '../assets/3.png';
import f4 from '../assets/4.png';
import HeadingContent from './HeadingContent';

const collect = [f1, f2, f3, f4];

// Register the useGSAP plugin
gsap.registerPlugin(useGSAP);

const HeroSection = ({ title, subtitle }) => {
  const imageRefs = useRef([]);
  const containerRef = useRef(null);
  const sectionRef = useRef(null);

  // GSAP animation using useGSAP hook
  useGSAP(() => {
    // Set initial state - images are below viewport and invisible
    gsap.set(imageRefs.current, {
      y: 100,
      opacity: 0,
      transformOrigin: "center bottom"
    });

    // Create timeline for coordinated animations
    const tl = gsap.timeline();

    // Initial pop-up animation with stagger effect
    tl.to(imageRefs.current, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "back.out(1.7)",
      stagger: {
        amount: 0.4, // Total time to stagger all animations
        from: "start" // Start from first image
      }
    });

    // Continuous floating animation - starts after initial animation
    tl.to(imageRefs.current, {
      y: -8,
      duration: 3,
      ease: "power2.inOut",
      stagger: {
        amount: 0.3,
        from: "start"
      }
    }, "+=0.5") // Start 0.5 seconds after previous animation
    .to(imageRefs.current, {
      y: 8,
      duration: 3,
      ease: "power2.inOut",
      stagger: {
        amount: 0.3,
        from: "center"
      }
    })
    .to(imageRefs.current, {
      y: -5,
      duration: 2.5,
      ease: "power2.inOut",
      stagger: {
        amount: 0.2,
        from: "end"
      }
    })
    .to(imageRefs.current, {
      y: 0,
      duration: 2,
      ease: "power2.inOut",
      stagger: {
        amount: 0.4,
        from: "random"
      }
    });

    // Make the floating animation repeat infinitely
    tl.repeat(-1);
  }, { scope: containerRef });

  return (
    <section ref={sectionRef} className={styles.heroSection}>
       <HeadingContent title={title} subtitle={subtitle} />
        <div ref={containerRef} className={styles.backgroundWrapper}>
          {collect.map((image, index) => (
            <div
              key={index}
              ref={(el) => (imageRefs.current[index] = el)}
              className={styles.foregroundImage}
            >
              <img src={image.src} alt={`Background ${index + 1}`} />
            </div>
          ))}
        </div>
    </section>
  );
};

export default HeroSection;

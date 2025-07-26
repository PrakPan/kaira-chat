import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import styles from './HeadingContent.module.scss';

// Register the useGSAP plugin
gsap.registerPlugin(useGSAP);

const HeadingContent = ({ title, subtitle }) => {
  const headingRef = useRef(null);
  const containerRef = useRef(null);
  const contentWrapperRef = useRef(null);

  useGSAP(() => {
    // Split text into words and wrap each word in a span
    const headings = headingRef.current.querySelectorAll('.heading-text');
    
    headings.forEach((heading) => {
      const text = heading.textContent;
      const words = text.split(' ');
      
      // Clear the heading and rebuild with wrapped words
      heading.innerHTML = words.map(word => 
        `<span class="word" style="display: inline-block; overflow: hidden;">
          <span style="display: inline-block;">${word}</span>
        </span>`
      ).join(' ');
    });

    // Get all word elements
    const wordElements = headingRef.current.querySelectorAll('.word span');

    // Set initial state for headings - words are below and invisible
    gsap.set(wordElements, {
      y: 100,
      opacity: 0
    });

    // Set initial state for content wrapper - invisible
    gsap.set(contentWrapperRef.current, {
      opacity: 0,
      y: 30
    });

    // Create timeline for coordinated animations
    const tl = gsap.timeline();

    // Animate words appearing from bottom with stagger
    tl.to(wordElements, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "back.out(1.7)",
      stagger: {
        amount: 1.2, // Total time to stagger all words
        from: "start"
      }
    })
    // Animate content wrapper fade-in after headings complete
    .to(contentWrapperRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power2.out"
    }, "+=0.3"); // Start 0.3 seconds after heading animation completes

  }, { scope: containerRef });
  return (
    <div ref={containerRef} className={styles.headingContent}>
      <div ref={headingRef}>
        <h1 className={`${styles.title} heading-text`}>Your Trip. Your Vibe. </h1>
        <h1 className={`${styles.title} heading-text`}>Our AI's on It.</h1>
      </div>
      <div ref={contentWrapperRef} className={styles.contentWrapper}>
        <p className={styles.subtitle}>Get trips that match your vibe, with AI-curated plans made just for you. With </p>
        <p className={styles.subtitle}>
          The Tarzan Way, travel feels easy, personal, and effortlessly cool.</p>
      </div>
    </div>
  );
};

export default HeadingContent;
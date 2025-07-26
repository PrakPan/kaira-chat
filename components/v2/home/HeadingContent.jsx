import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import styles from "./HeadingContent.module.scss";

// Register the useGSAP plugin
gsap.registerPlugin(useGSAP);

const HeadingContent = ({ title, subtitle }) => {
  const headingRef = useRef(null);
  const containerRef = useRef(null);
  const contentWrapperRef = useRef(null);
  const buttonRef = useRef(null);

  useGSAP(
    () => {
      // Split text into words and wrap each word in a span
      const headings = headingRef.current.querySelectorAll(".heading-text");

      headings.forEach((heading) => {
        const text = heading.textContent;
        const words = text.split(" ");

        // Clear the heading and rebuild with wrapped words
        heading.innerHTML = words
          .map(
            (word) =>
              `<span class="word" style="display: inline-block; overflow: hidden;">
          <span style="display: inline-block;">${word}</span>
        </span>`
          )
          .join(" ");
      });

      // Get all word elements
      const wordElements = headingRef.current.querySelectorAll(".word span");

      // Set initial state for headings - words are below and invisible
      gsap.set(wordElements, {
        y: 100,
        opacity: 0,
      });

      // Set initial state for content wrapper - invisible
      gsap.set(contentWrapperRef.current, {
        opacity: 0,
        y: 30,
      });

      // Set initial state for button - invisible
      gsap.set(buttonRef.current, {
        opacity: 0,
        y: 30,
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
          from: "start",
        },
      })
        // Animate content wrapper fade-in after headings complete
        .to(
          contentWrapperRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
          },
          "+=0.3"
        ) // Start 0.3 seconds after heading animation completes
        // Animate button fade-in after content wrapper
        .to(
          buttonRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
          },
          "+=0.2"
        ); // Start 0.2 seconds after content wrapper animation
    },
    { scope: containerRef }
  );
  return (
    <div ref={containerRef} className={styles.headingContent}>
      <div ref={headingRef}>
        <h1 className={`${styles.title} heading-text`}>
          Your Trip. Your Vibe.{" "}
        </h1>
        <h1 className={`${styles.title} heading-text`}>Our AI's on It.</h1>
      </div>
      <div ref={contentWrapperRef} className={styles.contentWrapper}>
        <p className={styles.subtitle}>
          Get trips that match your vibe, with AI-curated plans made just for
          you. With{" "}
        </p>
        <p className={styles.subtitle}>
          The Tarzan Way, travel feels easy, personal, and effortlessly cool.
        </p>
      </div>
      <button
        ref={buttonRef}
        className="bg-slate-800 no-underline group cursor-pointer relative rounded-full p-px text-xs font-semibold leading-6 text-white inline-block mt-6"
      >
        <span className="absolute inset-0 overflow-hidden rounded-full">
          <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(251, 247, 19, 0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </span>
        <div className="relative flex space-x-2 items-center z-10 rounded-full bg-zinc-950 py-2 px-6 ring-1 ring-white/10">
          <span>Create a Trip</span>
          <svg
            fill="none"
            height="16"
            viewBox="0 0 24 24"
            width="16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.75 8.75L14.25 12L10.75 15.25"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
          </svg>
        </div>
        <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
      </button>
    </div>
  );
};

export default HeadingContent;

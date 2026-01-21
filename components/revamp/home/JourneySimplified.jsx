import React, { useRef, useEffect, useState } from "react";
import Button from "../common/components/button";
import {
  ANIMATION_CONFIG,
  createEntranceAnimation,
  gsap,
  useGSAP,
} from "../common/gsapConfig";
import Link from "next/link";
import useMediaQuery from "../../media";
import TailoredFormMobileModal from "../../modals/TailoredFomrMobile";

const JourneySimplified = (props) => {
  // Refs for GSAP animations
  const containerRef = useRef(null);
  const headingRef = useRef(null);
  const stepsRef = useRef(null);
  const [showTailoredModal, setShowTailoredModal] = useState(false);
  // Custom SVG icons
  const StarIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
    >
      <path
        d="M23.75 11.25L25.3125 7.8125L28.75 6.25L25.3125 4.6875L23.75 1.25L22.1875 4.6875L18.75 6.25L22.1875 7.8125L23.75 11.25Z"
        fill="#FFD600"
      />
      <path
        d="M23.75 18.75L22.1875 22.1875L18.75 23.75L22.1875 25.3125L23.75 28.75L25.3125 25.3125L28.75 23.75L25.3125 22.1875L23.75 18.75Z"
        fill="#FFD600"
      />
      <path
        d="M14.375 11.875L11.25 5L8.125 11.875L1.25 15L8.125 18.125L11.25 25L14.375 18.125L21.25 15L14.375 11.875ZM12.4875 16.2375L11.25 18.9625L10.0125 16.2375L7.2875 15L10.0125 13.7625L11.25 11.0375L12.4875 13.7625L15.2125 15L12.4875 16.2375Z"
        fill="#FFD600"
      />
    </svg>
  );

  const HeartIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M16.5 3C14.76 3 13.09 3.81 12 5.09C10.91 3.81 9.24 3 7.5 3C4.42 3 2 5.42 2 8.5C2 12.28 5.4 15.36 10.55 20.04L12 21.35L13.45 20.03C18.6 15.36 22 12.28 22 8.5C22 5.42 19.58 3 16.5 3ZM12.1 18.55L12 18.65L11.9 18.55C7.14 14.24 4 11.39 4 8.5C4 6.5 5.5 5 7.5 5C9.04 5 10.54 5.99 11.07 7.36H12.94C13.46 5.99 14.96 5 16.5 5C18.5 5 20 6.5 20 8.5C20 11.39 16.86 14.24 12.1 18.55Z"
        fill="#FF1000"
      />
    </svg>
  );

  const DollarIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="27"
      height="20"
      viewBox="0 0 27 20"
      fill="none"
    >
      <path
        d="M15.9545 11.25C14.9318 11.25 14.0625 10.8854 13.3466 10.1562C12.6307 9.42708 12.2727 8.54167 12.2727 7.5C12.2727 6.45833 12.6307 5.57292 13.3466 4.84375C14.0625 4.11458 14.9318 3.75 15.9545 3.75C16.9773 3.75 17.8466 4.11458 18.5625 4.84375C19.2784 5.57292 19.6364 6.45833 19.6364 7.5C19.6364 8.54167 19.2784 9.42708 18.5625 10.1562C17.8466 10.8854 16.9773 11.25 15.9545 11.25ZM7.36364 15C6.68864 15 6.1108 14.7552 5.63011 14.2656C5.14943 13.776 4.90909 13.1875 4.90909 12.5V2.5C4.90909 1.8125 5.14943 1.22396 5.63011 0.734375C6.1108 0.244792 6.68864 0 7.36364 0H24.5455C25.2205 0 25.7983 0.244792 26.279 0.734375C26.7597 1.22396 27 1.8125 27 2.5V12.5C27 13.1875 26.7597 13.776 26.279 14.2656C25.7983 14.7552 25.2205 15 24.5455 15H7.36364ZM9.81818 12.5H22.0909C22.0909 11.8125 22.3313 11.224 22.8119 10.7344C23.2926 10.2448 23.8705 10 24.5455 10V5C23.8705 5 23.2926 4.75521 22.8119 4.26562C22.3313 3.77604 22.0909 3.1875 22.0909 2.5H9.81818C9.81818 3.1875 9.57784 3.77604 9.09716 4.26562C8.61648 4.75521 8.03864 5 7.36364 5V10C8.03864 10 8.61648 10.2448 9.09716 10.7344C9.57784 11.224 9.81818 11.8125 9.81818 12.5ZM23.3182 20H2.45455C1.77955 20 1.2017 19.7552 0.721023 19.2656C0.240341 18.776 0 18.1875 0 17.5V3.75H2.45455V17.5H23.3182V20Z"
        fill="#5CBA66"
      />
    </svg>
  );

  const ShieldIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
    >
      <path
        d="M12 1.89453L3 5.87695V11.8506C3 17.3762 6.84 22.5434 12 23.7978C17.16 22.5434 21 17.3762 21 11.8506V5.87695L12 1.89453ZM12 12.8362H19C18.47 16.9381 15.72 20.592 12 21.7369V12.8462H5V7.17124L12 4.07491V12.8362Z"
        fill="#6600FF"
      />
    </svg>
  );

  // Dynamic card data with custom SVG icons
  const journeyFeatures = [
    {
      id: 1,
      icon: <StarIcon />,
      title: "Dream It, Tell Us.",
      description:
        "Tell us your vibe — romantic, offbeat, solo, or group. Kaira turns it into a real plan instantly.",
      iconBgColor: "#FFF9DC",
    },
    {
      id: 2,
      icon: <HeartIcon />,
      title: "Smart + Soulful Itineraries.",
      description:
        "Built by AI + local experts, you get a plan that's logical and love-filled.",
      iconBgColor: "#FAEBEA",
    },
    {
      id: 3,
      icon: <DollarIcon />,
      title: "Transparent Pricing, Always.",
      description:
        "No hidden charges, commissions or shady operators. You pay for what you pick.",
      iconBgColor: "#EBFFED",
    },
    {
      id: 4,
      icon: <ShieldIcon />,
      title: "TTW All-Cover Shield.",
      description:
        "Travel with 24*7 concierge, local on-ground help & insurance advisory that has your back.",
      iconBgColor: "#F8F4FE",
    },
  ];

  // GSAP Animation for step-by-step process with Intersection Observer
  useGSAP(
    () => {
      // Check if refs are properly attached
      if (!headingRef.current || !stepsRef.current || !containerRef.current) {
        console.warn("GSAP refs not properly attached");
        return;
      }

      // Split the steps text into individual words/steps
      const stepsElement = stepsRef.current;
      const stepWords = stepsElement.textContent.split(/\s*→\s*/);

      // Clear the original content and create spans for each step
      stepsElement.innerHTML = "";
      const stepSpans = stepWords.map((step, index) => {
        const span = document.createElement("span");
        span.textContent = step.trim();
        span.className = "step-word";
        stepsElement.appendChild(span);

        // Add arrow after each step except the last one
        if (index < stepWords.length - 1) {
          const arrow = document.createElement("span");
          arrow.textContent = " → ";
          arrow.className = "step-arrow";
          stepsElement.appendChild(arrow);
        }

        return span;
      });

      // Get all elements (steps + arrows)
      const allElements = stepsElement.querySelectorAll(
        ".step-word, .step-arrow"
      );

      // Set initial states - make sure elements are hidden initially
      gsap.set(headingRef.current, {
        opacity: 0,
        y: 50,
      });
      gsap.set(allElements, {
        opacity: 0,
        y: 30,
        scale: 0.8,
      });

      // Create timeline that will be triggered manually
      const tl = gsap.timeline({
        paused: true, // Important: start paused
      });

      // Animate heading first
      tl.to(headingRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "back.out(1.7)",
      });

      // Animate each step with a smooth stagger
      tl.to(
        allElements,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "back.out(1.7)",
          stagger: {
            amount: 1.5, // Total time for all steps
            from: "start",
            ease: "power2.inOut",
          },
        },
        "-=0.3"
      ); // Start slightly before heading animation completes

      // Use Intersection Observer as fallback
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              tl.play();
              observer.unobserve(entry.target); // Only animate once
            }
          });
        },
        {
          threshold: 0.3, // Trigger when 30% of element is visible
          rootMargin: "-10% 0px -10% 0px", // Some margin for better timing
        }
      );

      // Start observing
      observer.observe(containerRef.current);

      // Cleanup function
      return () => {
        observer.disconnect();
      };
    },
    { scope: containerRef, dependencies: [] }
  );

  const isDesktop = useMediaQuery("(min-width:767px)");

  return (
    <section
      ref={containerRef}
      className="py-12 sm:py-16 lg:py-24 max-sm:px-2 sm:px-4 lg:px-8 bg-white"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16 lg:mb-20">
          <h2
            // ref={headingRef}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 lg:mb-6 px-5"
            style={{ maxFontSize: "40px" }}
          >
            {isDesktop ? "Because Great Trips Should Feel Easy" : "Your Journey, Simplified"}
          </h2>
          <p
            // ref={stepsRef}
            className="text-base font-normal text-gray-600 max-w-2xl mx-auto italic"
            style={{ fontStyle: "normal" }}
          >
            No chaos. No guesswork. Just good journeys.
            {/* Plan → Personalize → Pack → Peace of Mind */}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-12 lg:mb-16">
          {journeyFeatures.map((feature) => (
            <div
              key={feature.id}
              className="rounded-2xl p-6 lg:p-8 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {/* Icon */}
              <div
                className="w-16 h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center mx-auto mb-4 lg:mb-6"
                style={{ backgroundColor: feature.iconBgColor }}
              >
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="text-base font-medium text-gray-900 mb-3 lg:mb-4">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-sm font-normal text-gray-700 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
                {/* <Link href="/new-trip"> */}
                  <Button
                    variant="filled"
                    size="medium"
                    onClick={() => {
                      console.log("Create a Trip Now! clicked");
                      setShowTailoredModal(true);
                    }}
                    className="!bg-primary-indigo !border-primary-indigo !text-white hover:!bg-primary-indigo/90 !font-medium !text-base !px-6 !py-3 !rounded-lg"
                  >
                    Explore how Kaira plans trips →
                  </Button>
                {/* </Link> */}
              </div>
      </div>

       <TailoredFormMobileModal
        destinationType={"city-planner"}
        page_id={props.page_id}
        children_cities={props.children_cities}
        destination={props.destination}
        cities={props.cities}
        onHide={() => {
          setShowTailoredModal(false);
        }}
        show={showTailoredModal}
      />
    </section>
  );
};

export default JourneySimplified;

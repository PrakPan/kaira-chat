"use client";

import React, { useRef } from "react";
import Button from "../common/components/button";
import { gsap, useGSAP } from "../common/gsapConfig";
import Link from "next/link";

/* ---------------- ICONS ---------------- */

const StarIcon = React.memo(() => (
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
));

const HeartIcon = React.memo(() => (
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
));

const DollarIcon = React.memo(() => (
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
));

const ShieldIcon = React.memo(() => (
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
));

/* ---------------- DATA ---------------- */

const journeyFeatures = [
  {
    id: 1,
    icon: <StarIcon />,
    title: "Dream It, Tell Us.",
    description:
      "Tell us your vibe — romantic, offbeat, solo, or group. Kaira turns it into a real plan instantly.",
    bg: "#FFF9DC",
  },
  {
    id: 2,
    icon: <HeartIcon />,
    title: "Smart + Soulful Itineraries.",
    description:
      "Built by AI + local experts, you get a plan that's logical and love-filled.",
    bg: "#FAEBEA",
  },
  {
    id: 3,
    icon: <DollarIcon />,
    title: "Transparent Pricing, Always.",
    description:
      "No hidden charges, commissions or shady operators. You pay for what you pick.",
    bg: "#EBFFED",
  },
  {
    id: 4,
    icon: <ShieldIcon />,
    title: "TTW All-Cover Shield.",
    description:
      "Travel with 24/7 concierge, local on-ground help & insurance advisory.",
    bg: "#F8F4FE",
  },
];

/* ---------------- COMPONENT ---------------- */

const JourneySimplified = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          once: true,
        },
      });

      tl.from(cardsRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.15,
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="py-16 lg:py-24 px-4 bg-white"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Because Great Trips Should Feel Easy
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            No chaos. No guesswork. Just good journeys.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {journeyFeatures.map((feature, i) => (
            <div
              key={feature.id}
              ref={(el) => (cardsRef.current[i] = el)}
              className="rounded-2xl p-6 text-center hover:shadow-lg transition-transform hover:-translate-y-1"
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: feature.bg }}
              >
                {feature.icon}
              </div>
              <h3 className="text-base font-medium text-gray-900 mb-3 lg:mb-4">{feature.title}</h3>
              <p className="text-sm text-gray-700">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href="/new-trip">
            <Button
              variant="filled"
              size="medium"
              className="!bg-primary-indigo !text-white hover:!bg-primary-indigo/90"
            >
              Explore how Kaira plans trips →
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default JourneySimplified;

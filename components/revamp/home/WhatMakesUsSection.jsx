import Image from "next/image";
import { useRef, useEffect } from "react";
import { createFloatingIconAnimations } from "../common/gsapConfig";

/*
  WhatMakesUsSection
  Centered circular Japan image with six floating icon pills around it and two columns of feature copy.
*/

// Custom SVG icons matching JourneySimplified style
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

const LocationIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22S19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z"
      fill="#FF6B35"
    />
  </svg>
);

const MagicIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M7.5 5.6L5 7L7.5 8.4L9 5.6L7.5 5.6ZM19.5 15.4L22 14L19.5 12.6L18 15.4H19.5ZM22 2L20 7L14.5 3L22 2ZM15.5 8.5L12 4L8.5 8.5L4 12L8.5 15.5L12 20L15.5 15.5L20 12L15.5 8.5ZM12 13.5C11.2 13.5 10.5 12.8 10.5 12S11.2 10.5 12 10.5S13.5 11.2 13.5 12S12.8 13.5 12 13.5Z"
      fill="#FFD600"
    />
  </svg>
);

const TaskIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M19 3H14.82C14.4 1.84 13.3 1 12 1S9.6 1.84 9.18 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM12 3C12.55 3 13 3.45 13 4S12.55 5 12 5 11 4.55 11 4 11.45 3 12 3ZM10 17L6 13L7.41 11.59L10 14.17L16.59 7.58L18 9L10 17Z"
      fill="#5CBA66"
    />
  </svg>
);

const HeadsetIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M12 1C7 1 3 5 3 10V17C3 18.1 3.9 19 5 19H6C7.1 19 8 18.1 8 17V13C8 11.9 7.1 11 6 11H5V10C5 6.1 8.1 3 12 3S19 6.1 19 10V11H18C16.9 11 16 11.9 16 13V17C16 18.1 16.9 19 18 19H19C20.1 19 21 18.1 21 17V10C21 5 17 1 12 1Z"
      fill="#2196F3"
    />
  </svg>
);

const featuresLeft = [
  {
    icon: <HeartIcon />,
    iconBgColor: "#FAEBEA",
    title: "Smarter Than Any Search Engine.",
    desc: "AI pulls the best flights, stays & activities from 1100+ platforms — so you don’t waste hours comparing.",
  },
  {
    icon: <LocationIcon />,
    iconBgColor: "#FFF4F0",
    title: "Locals + Experts, On Your Side.",
    desc: "AI builds, humans perfect. Every trip is fine-tuned by on-ground experts & travel curators who know the real deal.",
  },
  {
    icon: <MagicIcon />,
    iconBgColor: "#FFF9DC",
    title: "Plans That Actually Flow.",
    desc: "No awkward gaps or wasted days — from airport pickups to late-night food tours, your itinerary just works.",
  },
];

const featuresRight = [
  {
    icon: <ShieldIcon />,
    iconBgColor: "#F8F4FE",
    title: "Always a Human Behind\nthe Screen. ",
    desc: "24×7 WhatsApp concierge. Got stuck, missed a flight, or want a table with a view? One ping and it’s done.",
  },
  {
    icon: <HeadsetIcon />,
    iconBgColor: "#E3F2FD",
    title: "Zero Guesswork, All Trust.",
    desc: "Backed by 1000+ reviews, global partners, and verified local hosts — you only get tried & trusted experiences.",
  },
  {
    icon: <TaskIcon />,
    iconBgColor: "#EBFFED",
    title: "No Stress, Just Plan B Ready.",
    desc: "Weather turned bad? Activity sold out? We’ll swap in an equally amazing alternative before you even ask.",
  },
];

const IconPill = ({ icon, iconBgColor, className, animationRef }) => (
  <div
    ref={animationRef}
    className={`w-14 h-14 rounded-full shadow-md flex items-center justify-center border-4 border-white ${className}`}
    style={{ backgroundColor: iconBgColor }}
  >
    {icon}
  </div>
);

export default function WhatMakesUsSection() {
  // Refs for GSAP animations
  const icon1Ref = useRef(null);
  const icon2Ref = useRef(null);
  const icon3Ref = useRef(null);
  const icon4Ref = useRef(null);
  const icon5Ref = useRef(null);
  const icon6Ref = useRef(null);

  // GSAP floating animations
  useEffect(() => {
    const iconRefs = [
      icon1Ref,
      icon2Ref,
      icon3Ref,
      icon4Ref,
      icon5Ref,
      icon6Ref,
    ];

    const cleanup = createFloatingIconAnimations(iconRefs);

    // Return cleanup function
    return cleanup;
  }, []);

  // Attempt to locate a Japan related image. Fallback to a placeholder if not found.
  const japanImg = "/assets/icons/test.jpeg"; // TODO: replace with actual Japan image path when available
  return (
    <section className="w-full py-12 sm:py-16 lg:py-20 px-0 sm:px-4 lg:px-8 bg-white font-inter overflow-hidden">
      <h2 className="text-center text-3xl md:text-4xl font-bold text-primary-indigo mb-14">
        What Makes Us Wander-ful
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-center max-w-[1320px] mx-auto"
      style={{ padding: "1rem" }}>
        {/* Left copy */}
        <div className="flex flex-col justify-center md:pr-8 md:[height:616px]">
          <div className="space-y-12">
            {featuresLeft.map((f) => (
              <div key={f.title} className="max-w-sm">
                <h3 className="font-semibold text-sm md:text-base tracking-wide text-primary-indigo whitespace-pre-line">
                  {f.title}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-text-default">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Center visual */}
        <div className="relative flex justify-center">
          <div
            className="relative rounded-full overflow-hidden"
            style={{ width: "432px", height: "560px" }}
          >
            <Image
              src={japanImg}
              alt="Traveler in Japan overlooking lake and cliffs"
              fill
              className="object-cover"
            />
          </div>

          {/* Floating pills - positioned to match screenshot */}
          {/* Heart icon - top left */}
          <IconPill
            icon={featuresLeft[0].icon}
            iconBgColor={featuresLeft[0].iconBgColor}
            className="absolute top-8 left-4"
            animationRef={icon1Ref}
          />
          {/* Shield icon - top right */}
          <IconPill
            icon={featuresRight[0].icon}
            iconBgColor={featuresRight[0].iconBgColor}
            className="absolute top-16 right-4"
            animationRef={icon2Ref}
          />
          {/* Location icon - middle left */}
          <IconPill
            icon={featuresLeft[1].icon}
            iconBgColor={featuresLeft[1].iconBgColor}
            className="absolute top-1/2 -left-8 -translate-y-1/2"
            animationRef={icon6Ref}
          />
          {/* Headset icon - middle right */}
          <IconPill
            icon={featuresRight[1].icon}
            iconBgColor={featuresRight[1].iconBgColor}
            className="absolute top-1/2 -right-8 -translate-y-1/2"
            animationRef={icon3Ref}
          />
          {/* Magic icon - bottom left */}
          <IconPill
            icon={featuresLeft[2].icon}
            iconBgColor={featuresLeft[2].iconBgColor}
            className="absolute bottom-16 left-4"
            animationRef={icon5Ref}
          />
          {/* Task icon - bottom right */}
          <IconPill
            icon={featuresRight[2].icon}
            iconBgColor={featuresRight[2].iconBgColor}
            className="absolute bottom-8 right-4"
            animationRef={icon4Ref}
          />
        </div>

        {/* Right copy */}
        <div className="flex flex-col justify-center md:pl-8 md:[height:616px]">
          <div className="space-y-12">
            {featuresRight.map((f) => (
              <div key={f.title} className="max-w-sm">
                <h3 className="font-semibold text-sm md:text-base tracking-wide text-primary-indigo">
                  {f.title}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-text-default">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

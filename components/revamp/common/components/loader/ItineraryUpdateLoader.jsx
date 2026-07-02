import React, { useEffect, useState } from "react";
import Image from "next/image";
import media from "../../../../media";

/**
 * Kaira-styled loader shown while an item is being added/updated in the itinerary.
 * Engaging: pulsing TTW logo + yellow→indigo progress bar + cycling sub-messages.
 *
 * Props:
 *  - message: primary line (per booking type, e.g. "Please wait while we update your bookings")
 *  - subMessages: string[] of rotating sub-lines (should be booking-type specific)
 *  - height: optional explicit height (defaults to 80vh desktop / 40vh mobile)
 *  - fullScreen: render as a fixed full-screen overlay on kaira paper bg
 */
const ItineraryUpdateLoader = ({
  message = "Please wait while we update your bookings",
  subMessages,
  height,
  fullScreen = false,
}) => {
  const lines =
    Array.isArray(subMessages) && subMessages.length
      ? subMessages
      : [
          "Securing the best options…",
          "Almost there…",
          "Updating your itinerary…",
        ];

  const isPageWide = media("(min-width: 768px)");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (lines.length <= 1) return undefined;
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % lines.length);
    }, 2500);
    return () => clearInterval(id);
  }, [lines.length]);

  const resolvedHeight = height || (isPageWide ? "80vh" : "40vh");

  return (
    <div
      style={!fullScreen ? { height: resolvedHeight } : undefined}
      className={`flex flex-col items-center justify-center text-center gap-5 ${
        fullScreen ? "fixed inset-0 z-50 bg-[#fafaf5]" : "w-full mx-auto"
      }`}
    >
      {/* Pulsing Kaira logo */}
      <div className="relative">
        <div className="w-20 h-20 bg-[#f7e700] rounded-full absolute -inset-2 animate-ping opacity-25" />
        <div className="w-16 h-16 bg-white rounded-full overflow-hidden flex items-center justify-center shadow-sm">
          <Image
            src="/KairaInsta.png"
            alt="Kaira"
            width={64}
            height={64}
            className="w-full h-full object-cover"
            priority
          />
        </div>
      </div>

      {/* Messages */}
      <div className="px-4">
        <p className="text-[#07213A] text-base font-semibold leading-snug">
          {message}
        </p>
        <p
          key={index}
          className="text-[#445069] text-sm mt-1 animate-fade-in"
        >
          {lines[index]}
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-48 h-1 bg-[#f4f3ec] rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-[#f7e700] to-[#07213A] rounded-full animate-loading-bar" />
      </div>

      <style jsx>{`
        @keyframes loading-bar {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-loading-bar {
          animation: loading-bar 2s ease-in-out infinite;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ItineraryUpdateLoader;

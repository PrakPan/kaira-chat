import React from "react";
import { TTW } from "../../../assets";
import Image from "next/image";

const PageLoader = ({ isLoading, message = "Loading..." }) => {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-white transition-all duration-300 ${
        isLoading
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100" />

      {/* Main loader content */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-6">
        {/* Logo with pulse animation */}
        <div className="relative">
          <div className="w-20 h-20 bg-primary-yellow rounded-full absolute -inset-2 animate-ping opacity-20" />
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
            <Image
              src={TTW}
              alt="The Tarzan Way"
              width={40}
              height={40}
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Loading text with typing animation */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-primary-indigo mb-2">
            The Tarzan Way
          </h3>
          <p className="text-gray-600 text-sm animate-pulse">{message}</p>
        </div>

        {/* Loading bar animation */}
        <div className="w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary-yellow to-primary-indigo rounded-full animate-loading-bar" />
        </div>

        {/* Spinning dots */}
        <div className="flex space-x-1">
          <div
            className="w-2 h-2 bg-primary-yellow rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <div
            className="w-2 h-2 bg-primary-yellow rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <div
            className="w-2 h-2 bg-primary-yellow rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>

      {/* Custom CSS for loading bar animation */}
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
      `}</style>
    </div>
  );
};

export default PageLoader;

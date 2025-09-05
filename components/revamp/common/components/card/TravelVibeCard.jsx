import React from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";

const TravelVibeCard = ({
  title,
  description,
  image,
  tags = [],
  gradientOverlay = "linear-gradient(178deg, rgba(0, 0, 0, 0.00) 49.92%, rgba(0, 0, 0, 0.70) 98.41%)",
  height = "320px",
  onClick,
  className = "",
  ...props
}) => {
  return (
    <div
      className={`relative group cursor-pointer rounded-lg sm:rounded-2xl overflow-hidden transform transition-all duration-300 sm:hover:-translate-y-2 sm:hover:shadow-2xl w-full ${className}`}
      style={{ height }}
      onClick={onClick}
      {...props}
    >
      {/* Background Image with Next.js Image */}
      <div className="absolute inset-0">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority
        />
        {/* Gradient Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: gradientOverlay,
          }}
        />
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="absolute top-3 sm:top-4 left-3 sm:left-4 flex flex-wrap gap-1 sm:gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 sm:px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs sm:text-sm font-medium rounded-full border border-white/30"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Arrow Icon */}
      <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
        <div className="w-8 sm:w-10 h-8 sm:h-10 bg-white backdrop-blur-sm border border-white/30 group-hover:bg-primary-yellow rounded-full flex items-center justify-center transform transition-all duration-300 sm:group-hover:scale-110">
          <FontAwesomeIcon
            icon={faArrowUp}
            className="text-black group-hover:text-black text-xs sm:text-sm transition-colors duration-300 transform rotate-45"
          />
        </div>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
        {/* Small description text above title */}
        <p className="text-white/80 text-xs sm:text-sm font-medium mb-1 tracking-wide uppercase">
          {description}
        </p>
        <h3 className="text-white font-bold mb-2 text-lg sm:text-xl md:text-2xl">
          {title}
        </h3>
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
};

export default TravelVibeCard;

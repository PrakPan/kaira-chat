import React from "react";

const SectionSkeleton = ({
  height = "h-96",
  title = "Loading content...",
  showCards = true,
  cardCount = 3,
}) => {
  return (
    <div className={`${height} bg-gray-50 animate-pulse`}>
      <div className="container mx-auto px-4 py-12">
        {/* Header skeleton */}
        <div className="text-center mb-12">
          <div className="h-8 sm:h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg mx-auto mb-4 max-w-lg"></div>
          <div className="h-4 bg-gray-200 rounded mx-auto max-w-md"></div>
        </div>

        {showCards && (
          <div
            className={`grid grid-cols-1 ${cardCount === 3 ? "md:grid-cols-2 lg:grid-cols-3" : "lg:grid-cols-2"} gap-6`}
          >
            {Array.from({ length: cardCount }, (_, index) => (
              <div
                key={index}
                className="bg-white rounded-lg overflow-hidden shadow-sm"
              >
                {/* Image skeleton */}
                <div className="h-48 bg-gradient-to-br from-gray-200 via-primary-yellow/10 to-gray-200"></div>

                {/* Content skeleton */}
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded mb-1 w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Loading indicator */}
        <div className="flex justify-center items-center mt-8">
          <div className="flex space-x-2">
            <div
              className="w-2 h-2 bg-primary-yellow rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-primary-yellow rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-primary-yellow rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></div>
          </div>
          <span className="ml-3 text-sm text-gray-500">{title}</span>
        </div>
      </div>
    </div>
  );
};

export default SectionSkeleton;

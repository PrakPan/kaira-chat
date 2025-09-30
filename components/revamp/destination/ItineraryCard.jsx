import React from "react";

const ItineraryCard = ({ itinerary, onClick }) => {
  return (
    <div className="w-[384px] cursor-pointer" onClick={onClick}>
      {/* Image Container */}
      <div className="bg-[#e4e4e4] h-[424px] overflow-hidden rounded-[24px] relative">
        <img
          src={itinerary.image}
          alt={itinerary.title}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Tags Overlay */}
        <div className="absolute top-6 left-6 flex flex-wrap gap-2">
          {itinerary.tags.map((tag, index) => (
            <div
              key={index}
              className="backdrop-blur-[25px] bg-white/32 border border-white/24 rounded-full px-4 py-2 h-[32px] flex items-center justify-center"
            >
              <span className="text-white text-sm font-semibold whitespace-nowrap">
                {tag}
              </span>
            </div>
          ))}
        </div>

        {/* Arrow Button */}
        <div className="absolute top-6 right-6">
          <div className="w-12 h-12 relative">
            <div className="absolute bottom-[-16.67%] left-[-8.33%] right-[-8.33%] top-0">
              <div className="w-full h-full bg-white rounded-full"></div>
            </div>
            <div className="absolute flex items-center justify-center left-[7px] top-[7px] w-6 h-6">
              <div className="flex-none rotate-[315deg]">
                <div className="bg-[#f7e700] relative w-6 h-6 rounded-sm flex items-center justify-center">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    className="text-white"
                  >
                    <path
                      d="M3 9L9 3M9 3H3M9 3V9"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Dots Indicator */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-16 h-2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <div className="w-2 h-2 bg-white/50 rounded-full"></div>
            <div className="w-2 h-2 bg-white/50 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Content Below Image */}
      <div className="mt-6">
        {/* Title */}
        <h3 className="text-black text-base font-semibold mb-2 leading-6 h-8 flex items-center">
          {itinerary.title}
        </h3>

        {/* Route */}
        <p className="text-[#6e757a] text-sm mb-6 leading-5 h-6 flex items-center">
          {itinerary.route}
        </p>

        {/* Divider */}
        <div className="w-full h-px bg-gray-200 mb-4"></div>

        {/* Highlights */}
        <div className="space-y-1 mb-6">
          {itinerary.highlights.map((highlight, index) => (
            <div key={index} className="flex items-start h-6">
              <div className="w-1.5 h-1.5 bg-[#6e757a] rounded-full mt-2 mr-2 flex-shrink-0"></div>
              <p className="text-[#6e757a] text-sm leading-5">
                {highlight.includes("+5") ? (
                  <>
                    {highlight.replace(" +5", "")}{" "}
                    <span className="text-[#07213a] underline font-bold">
                      +5
                    </span>
                  </>
                ) : (
                  highlight
                )}
              </p>
            </div>
          ))}
        </div>

        {/* Price Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div>
              <p className="text-black text-lg font-semibold h-8 flex items-center">
                {itinerary.price}
                <span className="text-sm font-normal ml-1">for 2 people</span>
              </p>
              <p className="text-[#6e757a] text-base line-through h-8 flex items-center">
                {itinerary.originalPrice}
              </p>
            </div>
          </div>

          <div className="bg-[#5cba66] rounded-full px-2 py-1 h-6 flex items-center justify-center">
            <span className="text-white text-xs font-semibold">
              {itinerary.discount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItineraryCard;

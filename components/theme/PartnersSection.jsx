import React, { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const PartnersSection = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
  const partners = [
    // {
    //   id: 1,
    //   name: "Physics Wallah",
    //   logo: "/P01.svg",
    //   alt: "Physics Wallah Logo"
    // },
    // {
    //   id: 2,
    //   name: "PwC",
    //   logo: "/P02.svg",
    //   alt: "PwC Logo"
    // },
    // {
    //   id: 3,
    //   name: "TEC Analytics",
    //   logo: "/P03.svg",
    //   alt: "TEC Analytics Logo"
    // },
    // {
    //   id: 4,
    //   name: "Fever FM",
    //   logo: "/Fever FM.png ",
    //   alt: "Fever FM"
    // },
    // {
    //   id: 5,
    //   name: "Cashify",
    //   logo: "/Cashify.png",
    //   alt: "Cashify"
    // },
    // {
    //   id: 6,
    //   name: "Budveiser",
    //   logo: "/Budveiser.png",
    //   alt: "Budveiser"
    // },
    {
      id: 1,
      name: "Expedia",
      logo: "/expedia.svg",
      alt: "Expedia Logo"
    },
    {
      id: 2,
      name: "MakeMyTrip",
      logo: "/mmt.svg",
      alt: "MakeMyTrip Logo"
    },
    {
      id: 3,
      name: "Agoda",
      logo: "/agoda.svg",
      alt: "Agoda Logo"
    },
    // {
    //   id: 10,
    //   name: "Expedia",
    //   logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Expedia_logo.svg/320px-Expedia_logo.svg.png",
    //   alt: "Expedia Logo"
    // },
    {
      id: 4,
      name: "Rail Europe",
      logo: "raileurope.png",
      alt: "Rail Europe Logo"
    },
    {
      id: 5,
      name: "GetYourGuide",
      logo: "getyourguide.png",
      alt: "GetYourGuide Logo"
    },
    {
      id: 6,
      name: "Tiqets",
      logo: "tiqets.svg",
      alt: "Tiqets Logo"
    },
    {
      id: 7,
      name: "Switzerland Tourism",
      logo: "/switzerland.svg",
      alt: "Switzerland Tourism Logo"
    }
  ];


  const partnersPerPage = 4;
  const maxIndex = Math.max(0, partners.length - partnersPerPage);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const visiblePartners = partners.slice(currentIndex, currentIndex + partnersPerPage);

  return (
    <div className="w-full bg-white py-16 px-4 sm:px-6 lg:px-8 pb-[6rem] ">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <h2 className="text-2xl  font-bold text-center mb-16 text-gray-900">
          Powered by Partners
        </h2>

        {/* Partners Grid */}
        <div className="relative flex items-center justify-center gap-4">
          {/* Left Arrow */}
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`flex-shrink-0 text-black ${
              currentIndex === 0
                ? ' text-gray-400 cursor-not-allowed'
                : ''
            }`}
            aria-label="Previous partners"
          >
            <FiChevronLeft size={24} />
          </button>

          {/* Partners Grid */}
          <div className="flex-1 overflow-hidden">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
              {visiblePartners.map((partner) => (
                <div
                  key={partner.id}
                  className="flex items-center justify-center h-24 transition-all duration-300 hover:scale-110"
                >
                  <img
                    src={partner.logo}
                    alt={partner.alt}
                    className="max-w-full max-h-full object-contain px-4"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = `<div class="text-gray-400 font-semibold text-sm text-center">${partner.name}</div>`;
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            disabled={currentIndex >= maxIndex}
            className={`flex-shrink-0 text-black ${
              currentIndex >= maxIndex
                ? ' text-gray-400 cursor-not-allowed'
                : ''
            }`}
            aria-label="Next partners"
          >
            <FiChevronRight size={24} />
          </button>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center items-center gap-2 mt-8">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentIndex === index
                  ? 'bg-yellow-300 w-8'
                  : 'bg-gray-300 w-2'
              }`}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PartnersSection;
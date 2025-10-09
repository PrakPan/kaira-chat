import React from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
// import "swiper/css/navigation";

const ItineraryCard = ({ itinerary, onClick }) => {
  // Normalize images: itinerary.image could be array or single
  const images = Array.isArray(itinerary.image)
    ? itinerary.image
    : [itinerary.image];

  return (
    <div className="w-full">
      {/* Image / Carousel Container */}
      <div className="bg-[#e4e4e4] h-[424px] overflow-hidden rounded-[24px] relative group">
        <Swiper
          modules={[Pagination, Navigation]}
          pagination={{ clickable: true }}
          // navigation={{ clickable: true }}
          className="h-full"
          style={{ height: "424px" }}
        >
          {images.map((img, idx) => (
            <SwiperSlide
              key={idx}
              className="h-full"
              style={{ cursor: "pointer" }}
            >
              <div className="w-full h-full relative">
                <Image
                  src={img}
                  alt={`${itinerary.title} ${idx + 1}`}
                  fill
                  className="object-cover object-center"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Tags Overlay */}
        <div className="pointer-events-none absolute top-6 left-6 flex flex-wrap gap-2 z-10">
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

        {/* Arrow Icon */}
        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-10">
          <div className="w-8 sm:w-10 h-8 sm:h-10 bg-white/80 backdrop-blur-sm border border-white/30 group-hover:!bg-primary-yellow rounded-full flex items-center justify-center transform transition-all duration-300 sm:group-hover:scale-110">
            <FontAwesomeIcon
              icon={faArrowUp}
              className="text-black group-hover:text-black text-xs sm:text-sm transition-colors duration-300 transform rotate-45"
            />
          </div>
        </div>

        {/* Override Swiper bullets inside the card */}
        <style jsx>{`
          :global(.swiper) {
            --swiper-theme-color: #f7e700;
          }
          :global(.swiper-pagination-bullet) {
            background: rgba(255, 255, 255, 0.6);
            opacity: 1;
          }
          :global(.swiper-pagination-bullet-active) {
            background: #f7e700; /* primary color */
          }
          /* Position bullets at bottom inside card */
          :global(.swiper-pagination) {
            bottom: 16px !important;
          }
        `}</style>
      </div>

      {/* Content Below Image */}
      <div className="mt-2">
        <h3 className="text-black text-base font-semibold mb-2 leading-6 h-8 flex items-center">
          {itinerary.title}
        </h3>
        <p className="text-[#6e757a] text-sm mb-2 leading-5 h-6 flex items-center">
          {itinerary.route}
        </p>
        <div className="w-full h-px bg-gray-200 mb-3"></div>
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
        <div className="flex flex-col">
          <div className="flex items-center space-x-3">
            <div>
              <p className="text-[#6e757a] text-base line-through h-8 flex items-center mb-0">
                {itinerary.originalPrice}
              </p>
            </div>
            <div className="bg-[#5cba66] rounded-full px-2 py-1 h-6 flex items-center justify-center">
              <span className="text-white text-xs font-semibold">
                {itinerary.discount}
              </span>
            </div>
          </div>
          <p className="text-black text-lg font-semibold h-8 flex items-center">
            {itinerary.price}
            <span className="text-sm font-normal ml-2 mt-1">for 2 people</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ItineraryCard;

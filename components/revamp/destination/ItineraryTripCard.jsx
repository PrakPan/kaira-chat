import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper";
import Link from "next/link";
import "swiper/css";
import "swiper/css/pagination";
// import "swiper/css/navigation";
import { imgUrlEndPoint } from "../../theme/ThemeConstants";

const ItineraryTripCard = ({ itinerary, onClick }) => {
  const images = Array.isArray(itinerary.image) ? itinerary.image : itinerary.images;

  

  return (
    <Link href={`/itinerary/${itinerary.id}`} className="no-underline">
    <div className="w-full"  style={{ cursor: "pointer" }}>
      <div className="bg-gray-200 h-[424px] overflow-hidden rounded-3xl relative group">
        <Swiper
          modules={[Navigation]}
          pagination={{ clickable: true }}
          className="h-full"
          style={{ height: "424px" }}
        >
          {images.map((img, idx) => (
            <SwiperSlide key={idx} className="h-full" style={{ cursor: "pointer" }}>
              <div className="w-full h-full relative">
                <img
                  src={imgUrlEndPoint+img}
                  alt={`${itinerary.title||itinerary.name} ${idx + 1}`}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="pointer-events-none absolute top-6 left-6 flex flex-wrap gap-2 z-10">
          {itinerary?.tags?.map((tag, index) => (
            <div
              key={index}
              className="backdrop-blur-md bg-[#F2F2F2E5] border border-white/25 rounded-full px-4 py-2 h-8 flex items-center justify-center"
            >
              <span className="text-black text-sm font-semibold whitespace-nowrap">
                {tag}
              </span>
            </div>
          ))}
        </div>

        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-10">
          <div className="w-8 sm:w-10 h-8 sm:h-10 bg-white/80 backdrop-blur-sm border border-white/30 group-hover:bg-[#f7e700] rounded-full flex items-center justify-center transform transition-all duration-300 sm:group-hover:scale-110">
            <svg className="w-4 h-4 text-black transform rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </div>
        </div>

        <style>{`
          .swiper-pagination-bullet {
            background: rgba(255, 255, 255, 0.6);
            opacity: 1;
          }
          .swiper-pagination-bullet-active {
            background: #f7e700;
          }
          .swiper-pagination {
            bottom: 16px !important;
          }
        `}</style>
      </div>

      <div className="mt-2">
        <h3 className="text-black text-base font-semibold mb-2 leading-6 h-8 flex items-center">
          {itinerary.title||itinerary.name}
        </h3>
        <p className="text-gray-600 text-sm mb-2 leading-5 h-6 flex items-center">
          {itinerary.route||itinerary.cities.map((city) => city.name).join(" → ")}
        </p>
        <div className="w-full h-px bg-gray-200 mb-3"></div>
        <div className="space-y-1 mb-3">
          {itinerary?.highlights?.map((highlight, index) => (
            <div key={index} className="flex items-start h-6">
              <div className="w-1.5 h-1.5 bg-gray-600 rounded-full mt-2 mr-2 flex-shrink-0"></div>
              <p className="text-gray-600 text-sm leading-5">
                {highlight.includes("+") ? (
                  <>
                    {highlight.split("+")[0]}
                    <span className="text-gray-900 underline font-bold">
                      +{highlight.split("+")[1]}
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
              <p className="text-gray-600 text-base line-through h-8 flex items-center mb-0">
                {itinerary?.originalPrice}
              </p>
            </div>
            <div className="bg-green-500 rounded-full px-2 py-1 h-6 flex items-center justify-center">
              <span className="text-white text-xs font-semibold">
                {itinerary?.discount||itinerary?.payment_information?.discount}
              </span>
            </div>
          </div>
          <p className="text-black text-lg font-semibold h-8 flex items-center">
            {itinerary?.price||itinerary?.payment_information?.discounted_cost}
            <span className="text-sm font-normal ml-2 mt-1">
              for {itinerary?.pax||itinerary?.payment_information?.pax} {itinerary?.pax||itinerary?.payment_information?.pax === 1 ? 'person' : 'people'}
            </span>
          </p>
        </div>
      </div>
    </div>
    </Link>
  );
};

export default ItineraryTripCard;

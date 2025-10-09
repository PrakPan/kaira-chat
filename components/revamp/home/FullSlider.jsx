import React from "react";
import { Japan } from "../assets";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

const FullSlider = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-24 px-4 sm:px-4 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="relative group">
          <Swiper
            modules={[Pagination, Navigation]}
            pagination={{ clickable: true }}
            navigation={{
              nextEl: ".fullslider-next",
              prevEl: ".fullslider-prev",
              clickable: true,
            }}
            className=""
          >
            {[1, 2, 3, 4, 5].map((i) => (
              <SwiperSlide key={i}>
                <Image
                  src="/s-1.png"
                  alt={`Slide ${i}`}
                  width={500}
                  height={300}
                  style={{
                    width: "100%",
                    borderRadius: 20,
                    objectFit: "cover",
                  }}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Prev Button */}
          <div className="fullslider-prev" aria-hidden>
            <div className="absolute left-3 sm:left-1 top-1/2 -translate-y-1/2 z-10">
              <div className="w-8 sm:w-10 h-8 sm:h-10 bg-white/80 backdrop-blur-sm border border-white/30 hover:!bg-primary-yellow rounded-full flex items-center justify-center transform transition-all duration-300 sm:hover:scale-110 cursor-pointer">
                <FontAwesomeIcon
                  icon={faChevronLeft}
                  className="text-black group-hover:text-black text-md transition-colors duration-300 transform "
                />
              </div>
            </div>
          </div>

          {/* Custom Next Button */}
          <div className="fullslider-next" aria-hidden>
            <div className="absolute right-3 sm:right-1 top-1/2 -translate-y-1/2 z-10">
              <div className="w-8 sm:w-10 h-8 sm:h-10 bg-white/80 backdrop-blur-sm border border-white/30 hover:!bg-primary-yellow rounded-full flex items-center justify-center transform transition-all duration-300 sm:hover:scale-110 cursor-pointer">
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className="text-black hover:text-black text-md transition-colors duration-300 transform "
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FullSlider;

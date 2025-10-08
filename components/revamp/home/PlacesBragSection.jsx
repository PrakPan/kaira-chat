import React from "react";
import { Japan } from "../assets";
import { DestinationCard } from "../common/components/card";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

const PlacesBragSection = () => {
  // Sample destination data - replace with your actual data
  const destinations = [
    {
      id: 1,
      title: "Japan",
      description:
        "Sippin' matcha, chasing cherry blossoms, and vibin' in Tokyo — Japan hits different.",
      image: Japan, // Replace with actual image path
      tags: ["Hidden Gem"],
      gradientOverlay:
        "linear-gradient(178deg, rgba(0, 0, 0, 0.00) 49.92%, rgba(0, 0, 0, 0.70) 98.41%)",
    },
    {
      id: 2,
      title: "Paris",
      description:
        "Croissants, couture, and Eiffel Tower vibes — Paris is your next aesthetic drop.",
      image: Japan, // Replace with actual image path
      tags: ["Trending", "Best for Couples"],
      gradientOverlay:
        "linear-gradient(178deg, rgba(0, 0, 0, 0.00) 49.92%, rgba(0, 0, 0, 0.70) 98.41%)",
    },
    {
      id: 3,
      title: "Maldives",
      description:
        "Sun, sand, and serious main character energy — Maldives is calling!",
      image: Japan, // Replace with actual image path
      tags: ["Under 1 Lakh"],
      gradientOverlay:
        "linear-gradient(178deg, rgba(0, 0, 0, 0.00) 49.92%, rgba(0, 0, 0, 0.70) 98.41%)",
    },
    {
      id: 4,
      title: "Japan",
      description:
        "Sippin' matcha, chasing cherry blossoms, and vibin' in Tokyo — Japan hits different.",
      image: Japan, // Replace with actual image path
      tags: ["Hidden Gem"],
      gradientOverlay:
        "linear-gradient(178deg, rgba(0, 0, 0, 0.00) 49.92%, rgba(0, 0, 0, 0.70) 98.41%)",
    },
    {
      id: 5,
      title: "Paris",
      description:
        "Croissants, couture, and Eiffel Tower vibes — Paris is your next aesthetic drop.",
      image: Japan, // Replace with actual image path
      tags: ["Trending", "Best for Couples"],
      gradientOverlay:
        "linear-gradient(178deg, rgba(0, 0, 0, 0.00) 49.92%, rgba(0, 0, 0, 0.70) 98.41%)",
    },
    {
      id: 6,
      title: "Maldives",
      description:
        "Sun, sand, and serious main character energy — Maldives is calling!",
      image: Japan, // Replace with actual image path
      tags: ["Under 1 Lakh"],
      gradientOverlay:
        "linear-gradient(178deg, rgba(0, 0, 0, 0.00) 49.92%, rgba(0, 0, 0, 0.70) 98.41%)",
    },
    {
      id: 7,
      title: "Japan",
      description:
        "Sippin' matcha, chasing cherry blossoms, and vibin' in Tokyo — Japan hits different.",
      image: Japan, // Replace with actual image path
      tags: ["Hidden Gem"],
      gradientOverlay:
        "linear-gradient(178deg, rgba(0, 0, 0, 0.00) 49.92%, rgba(0, 0, 0, 0.70) 98.41%)",
    },
    {
      id: 8,
      title: "Paris",
      description:
        "Croissants, couture, and Eiffel Tower vibes — Paris is your next aesthetic drop.",
      image: Japan, // Replace with actual image path
      tags: ["Trending", "Best for Couples"],
      gradientOverlay:
        "linear-gradient(178deg, rgba(0, 0, 0, 0.00) 49.92%, rgba(0, 0, 0, 0.70) 98.41%)",
    },
    {
      id: 9,
      title: "Maldives",
      description:
        "Sun, sand, and serious main character energy — Maldives is calling!",
      image: Japan, // Replace with actual image path
      tags: ["Under 1 Lakh"],
      gradientOverlay:
        "linear-gradient(178deg, rgba(0, 0, 0, 0.00) 49.92%, rgba(0, 0, 0, 0.70) 98.41%)",
    },
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-24 px-0 sm:px-4 lg:px-8 bg-white">
      <div className="w-full sm:max-w-7xl sm:mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16 px-4 sm:px-0">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6 leading-tight">
            Places You'll Brag About Forever.
          </h2>
          <p
            className="text-gray-600 max-w-2xl mx-auto px-2 sm:px-0"
            style={{ fontSize: "16px" }}
          >
            From jaw-dropping landmarks to hidden gems, these are the kind of
            spots that turn into stories, selfies, and serious travel envy.
          </p>
        </div>

        {/* Destinations Slider */}
        <div className="relative px-2 sm:px-0">
          <Swiper
            style={{ height: "376px" }}
            modules={[Navigation]}
            spaceBetween={16}
            slidesPerView={1}
            navigation={{
              nextEl: ".PlacesBragSection-next",
              prevEl: ".PlacesBragSection-prev",
              clickable: true,
            }}
            breakpoints={{
              // when window width is >= 640px
              640: {
                slidesPerView: 1.5,
                spaceBetween: 16,
              },
              // when window width is >= 768px
              768: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              // when window width is >= 1024px
              1024: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
            }}
          >
            {destinations.map((destination) => (
              <SwiperSlide key={destination.id}>
                <div className="w-full px-1">
                  <DestinationCard
                    title={destination.title}
                    description={destination.description}
                    image={destination.image}
                    tags={destination.tags}
                    gradientOverlay={destination.gradientOverlay}
                    onClick={() => {
                      console.log(`Clicked on ${destination.title}`);
                    }}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          {/* Custom Prev Button */}
          <div className="PlacesBragSection-prev" aria-hidden>
            <div className="absolute left-3 sm:left-1 top-1/2 -translate-y-1/2 z-10">
              <div className="w-8 sm:w-10 h-8 sm:h-10 bg-black/80 backdrop-blur-sm   hover:!bg-primary-yellow rounded-full flex items-center justify-center transform transition-all duration-300 sm:hover:scale-110 cursor-pointer">
                <FontAwesomeIcon
                  icon={faChevronLeft}
                  className="text-white group-hover:text-white text-md transition-colors duration-300 transform "
                />
              </div>
            </div>
          </div>

          {/* Custom Next Button */}
          <div className="PlacesBragSection-next" aria-hidden>
            <div className="absolute right-3 sm:right-1 top-1/2 -translate-y-1/2 z-10">
              <div className="w-8 sm:w-10 h-8 sm:h-10 bg-black/80 backdrop-blur-sm   hover:!bg-primary-yellow rounded-full flex items-center justify-center transform transition-all duration-300 sm:hover:scale-110 cursor-pointer">
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className="text-white hover:text-white text-md transition-colors duration-300 transform "
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlacesBragSection;

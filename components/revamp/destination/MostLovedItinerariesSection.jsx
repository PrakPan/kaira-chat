import React from "react";
import ItineraryCard from "./ItineraryCard";
import { Japan, backgroundImage } from "../assets";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faArrowRight,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

const MostLovedItinerariesSection = () => {
  // Sample itinerary data - replace with your actual data
  const itineraries = [
    {
      id: 1,
      title: "Romance & Riviera Escape.",
      route: "Paris(3N) → Nice(3N) → Avignon(1N)",
      price: "₹1,75,000",
      originalPrice: "₹2,25,000",
      discount: "10% off",
      tags: ["Best for Couples", "Romantic"],
      image: [Japan, Japan, Japan],
      highlights: [
        "Sunset Cruise along the Riviera.",
        "Beachfront Stroll & Private Dinner. +5",
      ],
    },
    {
      id: 2,
      title: "Alpine Adventures & Cultural Charm.",
      route: "Lyon(2N) → Chamonix(3N) → Annecy(2N)",
      price: "₹1,75,000",
      originalPrice: "₹2,25,000",
      discount: "10% off",
      tags: ["Adventure", "Cultural"],
      image: [Japan, Japan, Japan],
      highlights: [
        "Sunset Cruise along the Riviera.",
        "Beachfront Stroll & Private Dinner. +5",
      ],
    },
    {
      id: 3,
      title: "Historic Heart & Countryside Bliss.",
      route: "Paris(3N) → Loire Valley(2N) → Bordeaux(2N)",
      price: "₹1,75,000",
      originalPrice: "₹2,25,000",
      discount: "10% off",
      tags: ["Hidden Gem", "Historical"],
      image: [Japan, Japan, Japan],
      highlights: [
        "Sunset Cruise along the Riviera.",
        "Beachfront Stroll & Private Dinner. +5",
      ],
    },
    {
      id: 4,
      title: "Romance & Riviera Escape.",
      route: "Paris(3N) → Nice(3N) → Avignon(1N)",
      price: "₹1,75,000",
      originalPrice: "₹2,25,000",
      discount: "10% off",
      tags: ["Best for Couples", "Romantic"],
      image: [Japan, Japan, Japan],
      highlights: [
        "Sunset Cruise along the Riviera.",
        "Beachfront Stroll & Private Dinner. +5",
      ],
    },
    {
      id: 5,
      title: "Alpine Adventures & Cultural Charm.",
      route: "Lyon(2N) → Chamonix(3N) → Annecy(2N)",
      price: "₹1,75,000",
      originalPrice: "₹2,25,000",
      discount: "10% off",
      tags: ["Adventure", "Cultural"],
      image: [Japan, Japan, Japan],
      highlights: [
        "Sunset Cruise along the Riviera.",
        "Beachfront Stroll & Private Dinner. +5",
      ],
    },
    {
      id: 6,
      title: "Historic Heart & Countryside Bliss.",
      route: "Paris(3N) → Loire Valley(2N) → Bordeaux(2N)",
      price: "₹1,75,000",
      originalPrice: "₹2,25,000",
      discount: "10% off",
      tags: ["Hidden Gem", "Historical"],
      image: [Japan, Japan, Japan],
      highlights: [
        "Sunset Cruise along the Riviera.",
        "Beachfront Stroll & Private Dinner. +5",
      ],
    },
    {
      id: 7,
      title: "Romance & Riviera Escape.",
      route: "Paris(3N) → Nice(3N) → Avignon(1N)",
      price: "₹1,75,000",
      originalPrice: "₹2,25,000",
      discount: "10% off",
      tags: ["Best for Couples", "Romantic"],
      image: [Japan, Japan, Japan],
      highlights: [
        "Sunset Cruise along the Riviera.",
        "Beachfront Stroll & Private Dinner. +5",
      ],
    },
    {
      id: 8,
      title: "Alpine Adventures & Cultural Charm.",
      route: "Lyon(2N) → Chamonix(3N) → Annecy(2N)",
      price: "₹1,75,000",
      originalPrice: "₹2,25,000",
      discount: "10% off",
      tags: ["Adventure", "Cultural"],
      image: [Japan, Japan, Japan],
      highlights: [
        "Sunset Cruise along the Riviera.",
        "Beachfront Stroll & Private Dinner. +5",
      ],
    },
    {
      id: 9,
      title: "Historic Heart & Countryside Bliss.",
      route: "Paris(3N) → Loire Valley(2N) → Bordeaux(2N)",
      price: "₹1,75,000",
      originalPrice: "₹2,25,000",
      discount: "10% off",
      tags: ["Hidden Gem", "Historical"],
      image: [Japan, Japan, Japan],
      highlights: [
        "Sunset Cruise along the Riviera.",
        "Beachfront Stroll & Private Dinner. +5",
      ],
    },
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-24 px-0 sm:px-4 lg:px-8 bg-white">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-[40px] font-bold text-black mb-4 leading-[48px]">
            Our Most Loved Itineraries.
          </h2>
          <p className="text-[#6e757a] text-base max-w-2xl mx-auto leading-6">
            These itineraries are traveler favorites, packed with iconic sights,
            hidden gems, and unforgettable moments in every stop.
          </p>
        </div>

        {/* Itineraries Slider */}
        <div className="relative px-2 sm:px-0">
          <Swiper
            style={{ height: "677px" }}
            modules={[Navigation]}
            spaceBetween={16}
            slidesPerView={1}
            navigation={{
              nextEl: ".MostLovedItinerariesSection-next",
              prevEl: ".MostLovedItinerariesSection-prev",
              clickable: true,
            }}
            breakpoints={{
              // when window width is >= 640px
              640: {
                slidesPerView: 1,
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
            className="py-6"
          >
            {itineraries.map((itinerary) => (
              <SwiperSlide key={itinerary.id} className="flex justify-center">
                <ItineraryCard
                  itinerary={itinerary}
                  onClick={() => {
                    console.log(`Clicked on ${itinerary.title}`);
                  }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
          {/* Custom Prev Button */}
          <div className="MostLovedItinerariesSection-prev" aria-hidden>
            <div className="absolute left-3 sm:left-1 top-1/3 -translate-y-1/2 z-10">
              <div className="w-8 sm:w-10 h-8 sm:h-10 bg-black/80 backdrop-blur-sm   hover:!bg-primary-yellow rounded-full flex items-center justify-center transform transition-all duration-300 sm:hover:scale-110 cursor-pointer">
                <FontAwesomeIcon
                  icon={faChevronLeft}
                  className="text-white group-hover:text-white text-md transition-colors duration-300 transform "
                />
              </div>
            </div>
          </div>

          {/* Custom Next Button */}
          <div className="MostLovedItinerariesSection-next" aria-hidden>
            <div className="absolute right-3 sm:right-1 top-1/3 -translate-y-1/2 z-10">
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

export default MostLovedItinerariesSection;

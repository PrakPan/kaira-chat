import React from "react";
import TravelerItineraryCard from "./TravelerItineraryCard";
import { Japan, backgroundImage } from "../assets";
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

const TravelerMadeItinerariesSection = () => {
  // Sample traveler-made itinerary data
  const itineraries = [
    {
      id: 1,
      title: "Bali Bliss",
      duration: "6 Nights, 7 Days",
      price: "₹1,05,000",
      pricePerPerson: "for 1 person",
      creator: "Jatin Sharma",
      creatorAvatar: Japan,
      tags: ["Best for Couples", "Romantic"],
      image: Japan,
    },
    {
      id: 2,
      title: "Ladakh Road Adventure",
      duration: "8 Nights, 9 Days",
      price: "₹1,75,000",
      pricePerPerson: "for 2 people",
      creator: "Create",
      creatorAvatar: null,
      tags: ["Adventure", "Cultural"],
      image: Japan,
    },
    {
      id: 3,
      title: "Europe Under 2 Lakhs",
      duration: "12 Days, 4 Countries",
      price: "₹4,75,000",
      pricePerPerson: "for 4 people",
      creator: "Aayush and Family",
      creatorAvatar: Japan,
      tags: ["Hidden Gem", "Historical"],
      image: Japan,
    },
    {
      id: 4,
      title: "Thailand Paradise",
      duration: "5 Nights, 6 Days",
      price: "₹85,000",
      pricePerPerson: "for 2 people",
      creator: "Sarah Wilson",
      creatorAvatar: Japan,
      tags: ["Beach", "Tropical"],
      image: Japan,
    },
    {
      id: 5,
      title: "Japan Cultural Tour",
      duration: "10 Nights, 11 Days",
      price: "₹2,50,000",
      pricePerPerson: "for 2 people",
      creator: "Mike Chen",
      creatorAvatar: Japan,
      tags: ["Cultural", "Traditional"],
      image: Japan,
    },
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-[40px] font-bold text-black mb-4 leading-[48px]">
            Traveler-Made Itineraries.
          </h2>
          <p className="text-[#7d8590] text-base max-w-2xl mx-auto leading-6">
            These aren't just plans — they're journeys thousands of travelers
            created with love.
            <br />
            We would love to see what you can create now?
          </p>
        </div>

        {/* Itineraries Slider */}
        <div className="relative">
          <Swiper
            style={{ height: "677px" }}
            modules={[Navigation]}
            spaceBetween={16}
            slidesPerView={1}
            navigation={{
              nextEl: ".TravelerMadeItinerariesSection-next",
              prevEl: ".TravelerMadeItinerariesSection-prev",
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
                <TravelerItineraryCard
                  itinerary={itinerary}
                  onClick={() => {
                    console.log(`Clicked on ${itinerary.title}`);
                  }}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Prev Button */}
          <div className="TravelerMadeItinerariesSection-prev" aria-hidden>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
              <div className="w-10 h-10 bg-white border border-gray-200 shadow-md hover:bg-gray-50 rounded-full flex items-center justify-center transform transition-all duration-300 hover:scale-110 cursor-pointer">
                <FontAwesomeIcon
                  icon={faChevronLeft}
                  className="text-gray-600 text-sm transition-colors duration-300"
                />
              </div>
            </div>
          </div>

          {/* Custom Next Button */}
          <div className="TravelerMadeItinerariesSection-next" aria-hidden>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
              <div className="w-10 h-10 bg-white border border-gray-200 shadow-md hover:bg-gray-50 rounded-full flex items-center justify-center transform transition-all duration-300 hover:scale-110 cursor-pointer">
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className="text-gray-600 text-sm transition-colors duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TravelerMadeItinerariesSection;

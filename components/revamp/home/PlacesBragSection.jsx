import React, { useState, useRef } from "react";
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
import { imgUrlEndPoint } from "../../theme/ThemeConstants";
import Button from "../common/components/button";
import Link from "next/link";
const PlacesBragSection = () => {
  // Sample destination data - replace with your actual data
  const destinations = [
    {
      id: 1,
      title: "Thailand",
      description:
        "Immerse yourself in a land of vibrant cultures, stunning beaches, and ancient temples that awaken your sense of adventure and wonder.",
      tags: [
        "Adventure and Outdoors",
        "Spiritual",
        "Nature and Retreat",
        "Art and Culture",
        "Hidden Gem",
        "Very Popular",
      ],
      gradientOverlay:
        "linear-gradient(178deg, rgba(0, 0, 0, 0.00) 49.92%, rgba(0, 0, 0, 0.70) 98.41%)",
      link: "asia/thailand",
      image: `${imgUrlEndPoint}/media/countries/168442180095400023460388183594.jpg`,
    },
    {
      id: 2,
      title: "Vietnam",
      description:
        "Venture into a land of vibrant culture, stunning landscapes, and heartfelt history that awakens your sense of wonder.",
      tags: [
        "Nature and Retreat",
        "Heritage",
        "Art and Culture",
        "Very Popular",
      ],
      gradientOverlay:
        "linear-gradient(178deg, rgba(0, 0, 0, 0.00) 49.92%, rgba(0, 0, 0, 0.70) 98.41%)",
      link: "asia/vietnam",
      image: `${imgUrlEndPoint}/media/countries/175871326394452381134033203125.png`,
    },
    {
      id: 3,
      title: "Malaysia",
      description:
        "Discover a diverse land where vibrant cultures, lush rainforests, and pristine beaches create an enchanting tapestry of experiences.",
      tags: [
        "Adventure and Outdoors",
        "Spiritual",
        "Isolated",
        "Romantic",
        "Heritage",
        "Art and Culture",
        "Shopping",
        "Nature and Retreat",
        "Nightlife and Events",
      ],
      gradientOverlay:
        "linear-gradient(178deg, rgba(0, 0, 0, 0.00) 49.92%, rgba(0, 0, 0, 0.70) 98.41%)",
      link: "asia/malaysia",
      image: `${imgUrlEndPoint}/media/countries/168442089471308898925781250000.jpg`,
    },
    {
      id: 4,
      title: "Dubai",
      description:
        "Experience a dazzling oasis where futuristic skyscrapers, luxurious shopping, and vibrant nightlife create an unforgettable spectacle.",
        tags: [
          "Adventure and Outdoors",
          "Spiritual",
          "Isolated",
          "Romantic",
          "Heritage",
          "Art and Culture",
          "Shopping",
          "Nature and Retreat",
          "Nightlife and Events",
        ],
      gradientOverlay:
        "linear-gradient(178deg, rgba(0, 0, 0, 0.00) 49.92%, rgba(0, 0, 0, 0.70) 98.41%)",
      link: "asia/united_arab_emirates/dubai",
      image: `${imgUrlEndPoint}/media/cities/175731712356781172752380371094.jpg`,
    },
    {
      id: 5,
      title: "Singapore",
      description:
        "Discover a dynamic city where futuristic skyline, lush gardens, and vibrant multiculturalism ignite your senses and inspire wonder.",
      tags: ["Adventure and Outdoors","Art and Culture","Shopping"],
      gradientOverlay:
        "linear-gradient(178deg, rgba(0, 0, 0, 0.00) 49.92%, rgba(0, 0, 0, 0.70) 98.41%)",
      link: "asia/singapore",
      image: `${imgUrlEndPoint}/media/cities/170359716563205981254577636719.jpg`,
    },
    {
      id: 6,
      title: "Bali",
      description:
        "Discover a tropical paradise where lush rice terraces and vibrant culture blend into an unforgettable island escape.",
      tags: ["Adventure and Outdoors","spiritual","Nature and Retreat","Heritage","Art and Culture","Hidden Gem","Very Popular","Romantic"],
      gradientOverlay:
        "linear-gradient(178deg, rgba(0, 0, 0, 0.00) 49.92%, rgba(0, 0, 0, 0.70) 98.41%)",
      link: "asia/indonesia/bali",
      image: `${imgUrlEndPoint}/media/states/168449479198298645019531250000.jpeg`,
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [slideCount, setSlideCount] = useState(0);
  const swiperRef = useRef(null);

  const handleSwiper = (swiper) => {
    swiperRef.current = swiper;
    setActiveIndex(swiper.activeIndex);
    // For non-loop mode, slideCount = slides.length
    // For loop mode, Swiper duplicates slides, so subtract loopedSlides*2
    const count = swiper.loopedSlides
      ? swiper.slides.length - swiper.loopedSlides * 2
      : swiper.slides.length;
    setSlideCount(count);
  };

  const handleSlideChange = (swiper) => {
    setActiveIndex(swiper.activeIndex);
  };

  return (
    <section className="py-12 sm:py-16 lg:py-24 px-0 sm:px-4 lg:px-8 bg-white">
      <div className="w-full sm:max-w-7xl sm:mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16 px-4 sm:px-0">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6 leading-tight">
            Places You'll Brag About Forever
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
            onSwiper={handleSwiper}
            onSlideChange={handleSlideChange}
            navigation={{
              nextEl: ".fullslider-next",
              prevEl: ".fullslider-prev",
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
          >
            {destinations.map((destination) => (
              <SwiperSlide key={destination.id}>
                <div className="w-full">
                  <DestinationCard
                    placesBragSection={true}
                    title={destination.title}
                    description={destination.description}
                    image={destination.image}
                    tags={destination.tags}
                    link={destination.link}
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
          <div className="fullslider-prev" aria-hidden>
            <div className="absolute -left-3  top-1/2 -translate-y-1/2 z-10">
              <div className="w-8 sm:w-10 h-8 sm:h-10 bg-black/80 backdrop-blur-sm  rounded-full flex items-center justify-center transform transition-all duration-300 sm:hover:scale-110 cursor-pointer">
                <FontAwesomeIcon
                  icon={faChevronLeft}
                  className="text-white  text-md transition-colors duration-300 transform "
                />
              </div>
            </div>
          </div>

          {/* Custom Next Button */}
          <div className="fullslider-next" aria-hidden>
            <div className="absolute -right-3  top-1/2 -translate-y-1/2 z-10">
              <div className="w-8 sm:w-10 h-8 sm:h-10 bg-black/80 backdrop-blur-sm  rounded-full flex items-center justify-center transform transition-all duration-300 sm:hover:scale-110 cursor-pointer">
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className="text-white text-md transition-colors duration-300 transform "
                />
              </div>
            </div>
          </div>

             <div className=" flex items-center justify-center mt-8 lg:mt-10">
                <Link href="/new-trip">
                  <Button
                    variant="filled"
                    size="medium"
                    onClick={() => {
                      console.log("Create a Trip Now! clicked");
                    }}
                    className="!bg-primary-indigo !border-primary-indigo !text-white hover:!bg-primary-indigo/90 !font-medium !text-base !px-6 !py-3 !rounded-lg"
                  >
                    + Create a Trip Now!
                  </Button>
                </Link>
              </div>
        </div>
      </div>
    </section>
  );
};

export default PlacesBragSection;

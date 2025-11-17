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

const LuxuryEuropeDestinations = () => {
  // Sample destination data - replace with your actual data
  const destinations = [
    {
      id: 1,
      title: "France",
      description:
        "Journey through a land of iconic landmarks, world-class cuisine, and timeless romance that will captivate all of your senses.",
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
      link: "europe/france",
      image: `${imgUrlEndPoint}/media/countries/173131953880670285224914550781.webp`,
    },
    {
      id: 2,
      title: "Italy",
      description:
        "Immerse yourself in a land where timeless art, rich history, and exquisite cuisine create an eternal allure of passion and beauty.",
      tags: [
        "Historical Landmark",
        "Cultural Heartbeat",
        "Culinary Hub",
        "Artistic Soul",
      ],
      gradientOverlay:
        "linear-gradient(178deg, rgba(0, 0, 0, 0.00) 49.92%, rgba(0, 0, 0, 0.70) 98.41%)",
      link: "europe/italy",
      image: `${imgUrlEndPoint}/media/countries/168441961093255019187927246094.jpg`,
    },
    {
      id: 3,
      title: "Spain",
      description:
        "Immerse yourself in a vibrant tapestry of passionate dance, stunning architecture, and lively streets that embody Spain's fiery soul.",
      tags: [
        "Cultural Heartbeat",
        "Lively & Vibrant",
        "Architectural Wonder",
        "Artistic Soul",
      ],
      gradientOverlay:
        "linear-gradient(178deg, rgba(0, 0, 0, 0.00) 49.92%, rgba(0, 0, 0, 0.70) 98.41%)",
      link: "europe/spain",
      image: `${imgUrlEndPoint}/media/countries/175344481739372777938842773438.jpg`,
    },
    {
      id: 4,
      title: "Finland",
      description:
        "Escape to a land of serene lakes, enchanting forests, and the magical glow of the Northern Lights.",
        tags: [
          "Nature's Paradise",
          "Peaceful & Serene",
          "Winter Wonderland",
          "Offbeat Wonder",
        ],
      gradientOverlay:
        "linear-gradient(178deg, rgba(0, 0, 0, 0.00) 49.92%, rgba(0, 0, 0, 0.70) 98.41%)",
      link: "europe/finland",
      image: `${imgUrlEndPoint}/media/countries/168442263137298607826232910156.jpg`,
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
      title: "Prague",
      description:
        "Welcome to Prague, the city that has captured the heart of many travellers for centuries!",
      tags: ["Adventure and Outdoors","spiritual","Nature and Retreat","Heritage","Art and Culture","Hidden Gem","Very Popular","Romantic"],
      gradientOverlay:
        "linear-gradient(178deg, rgba(0, 0, 0, 0.00) 49.92%, rgba(0, 0, 0, 0.70) 98.41%)",
      link: "asia/indonesia/bali",
      image: `${imgUrlEndPoint}/media/cities/168553058279981160163879394531.jpeg`,
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
    <section className="py-12 sm:py-14 lg:py-16 px-0 sm:px-4 lg:px-8 bg-white">
      <div className="w-full sm:max-w-7xl sm:mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16 px-4 sm:px-0">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6 leading-tight">
            Elevating Luxury Across Europe
          </h2>
          <p
            className="text-gray-600 max-w-2xl mx-auto px-2 sm:px-0"
            style={{ fontSize: "16px" }}
          >
            Discover iconic cities, elite resorts, and unforgettable 
            experiences crafted for discerning travelers.
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
              nextEl: ".fullslider-n",
              prevEl: ".fullslider-p",
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
          <div className="fullslider-p" aria-hidden>
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
          <div className="fullslider-n" aria-hidden>
            <div className="absolute -right-3  top-1/2 -translate-y-1/2 z-10">
              <div className="w-8 sm:w-10 h-8 sm:h-10 bg-black/80 backdrop-blur-sm  rounded-full flex items-center justify-center transform transition-all duration-300 sm:hover:scale-110 cursor-pointer">
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className="text-white text-md transition-colors duration-300 transform "
                />
              </div>
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

    </section>
  );
};

export default LuxuryEuropeDestinations;

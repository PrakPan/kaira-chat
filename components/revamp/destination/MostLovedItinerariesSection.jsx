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
import { imgUrlEndPoint } from "../../theme/ThemeConstants";

const transformItineraryData = (apiItineraries) => {
  return apiItineraries.map((item) => {
    // Build route string from cities
    const route = item.cities
      .map((city) => `${city.name}(${city.duration}N)`)
      .join(" → ");

    // Get pricing info
    const payment = item.payment_information;
    const price = `₹${Math.round(payment.discounted_cost).toLocaleString('en-IN')}`;
    
    // Calculate original price (assuming 10% discount for demo)
    const originalPrice = `₹${Math.round(payment.discounted_cost * 1.1).toLocaleString('en-IN')}`;
    
    // Generate tags based on itinerary data
    const tags = [];
    if (item.number_of_adults === 2 && item.number_of_children === 0) {
      tags.push("Best for Couples");
    }
    if (item.name.toLowerCase().includes("romantic")) {
      tags.push("Romantic");
    } else if (item.name.toLowerCase().includes("adventure")) {
      tags.push("Adventure");
    } else if (item.name.toLowerCase().includes("cultural")) {
      tags.push("Cultural");
    }
    
    // Generate highlights from payment summary
    const highlights = [];
    const summary = payment.summary;
    
    if (summary.Activities?.count > 0) {
      highlights.push(`${summary.Activities.count} exciting activities included`);
    }
    if (summary.Stays?.count > 0) {
      highlights.push(`${summary.Stays.count} premium stays. +${Math.max(0, summary.Stays.count - 2)}`);
    }
    // export  const  imgUrlEndPoint = "https://d31aoa0ehgvjdi.cloudfront.net/";
    // Use city images from API
    const images = item.images && item.images.length > 0 
      ? item.images.map(img => {
          if (img.startsWith('http://') || img.startsWith('https://')) {
            return img;
          }
          // Otherwise, prepend your API domain
          return `https://d31aoa0ehgvjdi.cloudfront.net/${img}`;
        })
      : ['https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800'];
    return {
      id: item.id,
      title: item.name,
      route: route,
      price: price,
      originalPrice: originalPrice,
      discount: "10% off",
      tags: tags.length > 0 ? tags : ["Popular"],
      image: images,
      highlights: highlights.length > 0 ? highlights : ["Curated by " + item.curated_by],
      pax: payment.pax,
    };
  });
};

const MostLovedItinerariesSection = ({ apiItineraries }) => {
  // Transform API data or use sample data for demo
  const itineraries = apiItineraries 
    ? transformItineraryData(apiItineraries)
    : [
        {
          id: 1,
          title: "5N Tropical Escape to Andaman & Nicobar",
          route: "Port Blair(1N) → Neil Island(1N) → Havelock(2N)",
          price: "₹1,28,952",
          originalPrice: "₹1,41,847",
          discount: "10% off",
          tags: ["Best for Couples", "Island Paradise"],
          image: ["https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800"],
          highlights: ["4 exciting activities included", "4 premium stays. +2"],
          pax: 2,
        },
         {
          id: 2,
          title: "5N Tropical Escape to Andaman & Nicobar",
          route: "Port Blair(1N) → Neil Island(1N) → Havelock(2N)",
          price: "₹1,28,952",
          originalPrice: "₹1,41,847",
          discount: "10% off",
          tags: ["Best for Couples", "Island Paradise"],
          image: ["https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800"],
          highlights: ["4 exciting activities included", "4 premium stays. +2"],
          pax: 2,
        },
         {
          id: 3,
          title: "5N Tropical Escape to Andaman & Nicobar",
          route: "Port Blair(1N) → Neil Island(1N) → Havelock(2N)",
          price: "₹1,28,952",
          originalPrice: "₹1,41,847",
          discount: "10% off",
          tags: ["Best for Couples", "Island Paradise"],
          image: ["https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800"],
          highlights: ["4 exciting activities included", "4 premium stays. +2"],
          pax: 2,
        },
         {
          id: 4,
          title: "5N Tropical Escape to Andaman & Nicobar",
          route: "Port Blair(1N) → Neil Island(1N) → Havelock(2N)",
          price: "₹1,28,952",
          originalPrice: "₹1,41,847",
          discount: "10% off",
          tags: ["Best for Couples", "Island Paradise"],
          image: ["https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800"],
          highlights: ["4 exciting activities included", "4 premium stays. +2"],
          pax: 2,
        },
      ];


  return (
    <section className="px-0 sm:px-4 lg:px-8 bg-white">
      <div className="w-full max-w-7xl mx-auto">
        {itineraries?.[0]?.id === 1 && <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-4xl font-bold text-black mb-4 leading-tight">
            Our Most Loved Itineraries.
          </h2>
          <p className="text-gray-600 text-base max-w-2xl mx-auto leading-6">
            These itineraries are traveler favorites, packed with iconic sights,
            hidden gems, and unforgettable moments in every stop.
          </p>
        </div>}

        <div className="relative  sm:px-0">
          <Swiper
            style={{ height: "677px" }}
            modules={[Navigation]}
            spaceBetween={16}
            slidesPerView={1}
            navigation={{
              nextEl: ".custom-next",
              prevEl: ".custom-prev",
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

          <div className="custom-prev" aria-hidden="true">
            <div className="absolute left-3 sm:left-1 top-1/3 -translate-y-1/2 z-10">
              <div className="w-8 sm:w-10 h-8 sm:h-10 bg-black/80 backdrop-blur-sm hover:bg-yellow-400 rounded-full flex items-center justify-center transform transition-all duration-300 sm:hover:scale-110 cursor-pointer">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="custom-next" aria-hidden="true">
            <div className="absolute right-3 sm:right-1 top-1/3 -translate-y-1/2 z-10">
              <div className="w-8 sm:w-10 h-8 sm:h-10 bg-black/80 backdrop-blur-sm hover:bg-yellow-400 rounded-full flex items-center justify-center transform transition-all duration-300 sm:hover:scale-110 cursor-pointer">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MostLovedItinerariesSection;


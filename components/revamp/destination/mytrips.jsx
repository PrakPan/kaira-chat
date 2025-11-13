import React from "react";
import ItineraryTripCard from "./ItineraryTripCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
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
import { useState, useEffect } from "react";
import axios from "axios";
import { MERCURY_HOST } from "../../../services/constants";
import Itinerary2Carousel from "../../theme/Itinerary2Carousel";
import Itinerary1Carousel from "../../theme/Itinerary1Carousel";
import { useRouter } from "next/router";
import Button from "../../Button";



const MyTripsSection = ({ apiItineraries, className }) => {
  // Transform API data or use sample data for demo
  const [trips, setTrips] = useState([]);
  const [plansCount, setPlansCount] = useState(null);
  const token = localStorage.getItem("access_token");
  const router = useRouter();
  useEffect(() => {
    if (token) {
      fetchTrips(false);
    }
  }, [token]);
 
      const fetchTrips = async (allPlans) => {
        try {
          const query = allPlans ? "" : "?limit=3&offset=0";
          const tripsResponse = await axios.get(
            `${MERCURY_HOST}/api/v1/itinerary/my-plans/${query}`,
            {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          );
          const newTrips = tripsResponse?.data?.data?.plans;
          const count = tripsResponse?.data?.results;
          setPlansCount(count);
          setTrips(newTrips);
        } catch (err) {
          console.log("[ERROR][TripsResponse:getStaticProps]: ", err.message);
        }
      };

    const handlePlan = () => {
    router.push("/dashboard");
  };

  return (
    <section className="px-0 sm:px-4 lg:px-8 bg-white">
      <div className={`w-full mx-auto py-4 sm:py-4 lg:py-4 pb-0 ${className}`}>
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-4xl font-bold text-black mb-4 leading-tight">
              My Trips
            </h2>
            <p className="text-gray-600 text-base max-w-2xl mx-auto leading-6">
              View your trips and start planning your next adventure.
            </p>
          </div>

          <Itinerary1Carousel itineraries={trips}/>

           <Button
            fontWeight="500"
            boxShadow
            borderRadius="8px"
            bgColor="white"
            margin="2.5rem auto"
            padding="0.5rem 2rem"
            borderWidth="1px"
            onclick={handlePlan}
          >
            {"View all plans"}
          </Button>

        {/* <div className="relative  sm:px-0">
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
            {trips.map((itinerary) => (
              <SwiperSlide key={itinerary.id} className="flex justify-center">
                <ItineraryTripCard
                  itinerary={itinerary}
                  
                />
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="absolute inset-x-0 top-0 h-[424px] z-30 pointer-events-none">
            <div aria-hidden="true">
              <div className="absolute -left-3 md:-left-5 top-1/2 -translate-y-1/2">
                <div className="custom-prev w-8 sm:w-10 h-8 sm:h-10 bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center transform transition-all duration-300 sm:hover:scale-110 cursor-pointer pointer-events-auto">
                  <FontAwesomeIcon
                    icon={faChevronLeft}
                    className="text-white group-hover:text-white text-md transition-colors duration-300 transform "
                  />
                </div>
              </div>
            </div>

            <div aria-hidden="true">
              <div className="absolute -right-3 md:-right-5 top-1/2 -translate-y-1/2">
                <div className="custom-next w-8 sm:w-10 h-8 sm:h-10 bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center transform transition-all duration-300 sm:hover:scale-110 cursor-pointer pointer-events-auto">
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    className="text-white hover:text-white text-md transition-colors duration-300 transform "
                  />
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default MyTripsSection;

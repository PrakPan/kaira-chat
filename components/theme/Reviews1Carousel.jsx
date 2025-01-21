import Link from "next/link";
import React, { useEffect, useState } from "react";
import ImageLoader from "../ImageLoader";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper";
import "swiper/css";
import "swiper/swiper-bundle.css";
import "swiper/css/navigation";
import "swiper/swiper.min.css";
import "swiper/swiper-bundle.min.css";
import styled from "styled-components";
import media from "../../components/media";

const SwiperContainer = styled.div`
  position: relative;
  .swiper,
  .swiper-wrapper {
    position: initial;
    height: auto;
  }
  .swiper-button-prev {
    left: -10px;
    @media screen and (min-width: 768px) {
      ${(props) =>
        props.buttonSize ? `left: -${props.buttonSize / 2}px` : "left: -20px"};
    }
  }
  .swiper-button-next {
    right: -10px;
    @media screen and (min-width: 768px) {
      ${(props) =>
        props.buttonSize
          ? `right: -${props.buttonSize / 2}px`
          : "right: -20px"};
    }
  }
  .swiper-button-next,
  .swiper-button-prev {
    background: #01202b;
    color: white;
    border: none;
    border-radius: 100%;
    width: 30px;
    height: 30px;

    @media screen and (min-width: 768px) {
      ${(props) =>
        props.buttonSize ? `width: ${props.buttonSize}px` : "width: 40px"};
      ${(props) =>
        props.buttonSize ? `height: ${props.buttonSize}px` : "height: 40px"};
    }
  }
  .swiper-button-next::after {
    font-size: 0.8rem;
    font-weight: 900;
    translate: 1px 0px;
    @media screen and (min-width: 768px) {
      font-size: 1rem;
    }
  }
  .swiper-button-prev::after {
    font-size: 0.8rem;
    font-weight: 900;
    translate: -1px 0px;
    @media screen and (min-width: 768px) {
      font-size: 1rem;
    }
  }

  .swiper-slide img {
    width: 64px;
    height: 64px;
  }
`;

export default function Reviews1Carousel(props) {
  let isPageWide = media("(min-width: 768px)");
  const [cards, setCards] = useState([]);

  useEffect(() => {
    let arr = [];

    for (let review of props.reviews) {
      arr.push(
        <Review
          heading={review.heading}
          text={review.text}
          name={review.name}
          image={review.image}
          itinerary_link={review.itinerary_link}
          rating={review.rating}
        />
      );
    }

    setCards(arr);
  }, []);

  const handlePrevClick = (swiper) => {
    const currentIndex = swiper.activeIndex + 1;
    const slidesPerView = swiper.params.slidesPerView;
    const newIndex = currentIndex - slidesPerView;
    swiper.slideTo(newIndex);
  };

  const handleNextClick = (swiper) => {
    const currentIndex = swiper.activeIndex - 1;
    const slidesPerView = swiper.params.slidesPerView;
    const newIndex = currentIndex + slidesPerView;
    swiper.slideTo(newIndex);
  };

  return (
    <SwiperContainer className="relative drop-shadow-xl">
      <Swiper
        onInit={(swiper) => {
          swiper.params.navigation.nextEl.addEventListener("click", () =>
            handleNextClick(swiper)
          );
          swiper.params.navigation.prevEl.addEventListener("click", () =>
            handlePrevClick(swiper)
          );
        }}
        spaceBetween={25}
        centeredSlides={false}
        initialSlide={0}
        navigation={true}
        pagination={false}
        slidesPerView={isPageWide ? 3 : 1}
        modules={[Navigation, Pagination]}
        lazy={"true"}
      >
        {cards.map((e, i) => (
          <SwiperSlide key={i}>{e}</SwiperSlide>
        ))}
      </Swiper>
    </SwiperContainer>
  );
}

const ThemeTestimonial = ({ heading, text, name, image, rating }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md h-[350px] text-ellipsis flex flex-col justify-between">
      <div className="flex flex-col">
        <h3 className="text-sm font-semibold text-gray-800 flex-none">
          {heading}
        </h3>
        <p className="mt-2 text-sm  text-gray-600 h-auto">{text}</p>
      </div>
      <div className="mt-6 flex items-center">
        {/* Image Section */}
        <div className="relative w-12 h-12 flex-shrink-0">
          <ImageLoader url={image} borderRadius="100%" />
        </div>
        {/* Text Section */}
        <div className="ml-4 flex flex-col justify-center">
          <p className="text-sm font-semibold text-gray-800 mb-0">
            {"Kartik and Avani"}
          </p>
          <p className="text-yellow-500">
            {"★".repeat(rating)}{" "}
            <span className="text-gray-400">{"☆".repeat(5 - rating)}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

const Review = ({ heading, text, name, image, rating, itinerary_link }) => {
  return (
    <div className="h-[400px] md:h-[400px] flex flex-col justify-between bg-white p-4 rounded-lg">
      <div className="flex flex-col">
        <h3 className="text-sm font-semibold text-gray-800 flex-none">
          {heading}
        </h3>
        <p className="mt-2 text-sm  text-gray-600 h-auto">{text}</p>
      </div>

      <div className="flex flex-col gap-2">
        <Link
          href={itinerary_link}
          className="bg-[#F7E700] w-fit px-3 py-1 rounded-lg no-underline text-black focus:outline-none"
        >
          View Itinerary
        </Link>
        
        <div className="mt-6 flex items-center gap-3">
          {/* Image Section */}
          <div className="w-[65px] h-[65px]">
            <ImageLoader url={image} width={"65px"} height={"65px"} borderRadius="100%" />
          </div>

          {/* Text Section */}
          <div className="h-12 flex flex-col">
            <p className="text-sm font-semibold text-gray-800 mb-0">
              {name}
            </p>
            <p className="text-yellow-500">
              {"★".repeat(rating)}{" "}
              <span className="text-gray-400">{"☆".repeat(5 - rating)}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

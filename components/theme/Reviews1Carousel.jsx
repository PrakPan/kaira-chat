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

const Review = ({ heading, text, name, image, rating, itinerary_link }) => {
  return (
    <div className="h-[450px] flex flex-col gap-4 bg-white p-4 rounded-lg">
      <div className="flex items-center gap-3">
        {/* Image Section */}
        <div className="w-[65px] h-[65px]">
          <ImageLoader
            url={image}
            width={"65px"}
            height={"65px"}
            borderRadius="100%"
          />
        </div>

        {/* Text Section */}
        <div className="flex flex-col h-fit">
          <p className="text-[18px] leading-[27px] font-[500] mb-0">{name}</p>
          <div className="text-[#FEB739] text-xl">
            {"★".repeat(rating)}{" "}
            <span className="text-gray-400">{"☆".repeat(5 - rating)}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between h-full">
        <div>
          <h3 className="text-[16px] leading-[24px] font-[600]">
            {heading}
          </h3>
          <p className="text-[15px] leading-[24px] font-[350] text-[#323232] h-auto">
            {text}
          </p>
        </div>

        <Link
          href={itinerary_link}
          className="bg-[#F7E700] w-fit px-4 py-[12px] rounded-lg no-underline text-[15px] font-[600] text-black border-[1px] border-black focus:outline-none"
        >
          View Itinerary
        </Link>
      </div>
    </div>
  );
};

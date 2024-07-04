import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper";
import "swiper/css";
import "swiper/swiper-bundle.css";
import "swiper/css/navigation";
import "swiper/swiper.min.css";
import "swiper/swiper-bundle.min.css";
import styled from "styled-components";
import LazyLoad from "react-lazyload";

const SwiperContainer = styled.div`
  position: relative;
  ${(props) => props.pageDots && "margin-bottom : 2rem"};
  @media screen and (max-width: 768px) {
    ${(props) => !props.noPadding && "margin-inline: 0.5rem;"}
  }
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
    ${(props) =>
      props.navButtonBackground && `background : ${props.navButtonBackground}`};
    ${(props) => props.navButtonColor && `color : ${props.navButtonColor}`};
    border: none;
    border-radius: 100%;
    width: 30px;
    height: 30px;
    ${(props) => props.navButtonsTop && `top : ${props.navButtonsTop}`};

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
  .swiper-button-disabled {
    display: none;
  }
  .swiper-pagination {
    top: 101% !important;
  }
  .swiper-pagination-bullet-active {
    background: #f7e700;
    border: 1px solid;
  }
`;

const SwiperCarousel = (props) => {
  let cards = [];

  props.cards.map((card, index) => {
    cards.push(
      <div key={index}>
        <div>{card}</div>
      </div>
    );
  });

  const handleNextClick = (swiper) => {
    const currentIndex = swiper.activeIndex - 1;
    const slidesPerView = swiper.params.slidesPerView;
    const newIndex = currentIndex + slidesPerView;
    swiper.slideTo(newIndex);
  };

  const handlePrevClick = (swiper) => {
    const currentIndex = swiper.activeIndex + 1;
    const slidesPerView = swiper.params.slidesPerView;
    const newIndex = currentIndex - slidesPerView;
    swiper.slideTo(newIndex);
  };

  return (
    <SwiperContainer
      pageDots={props.pageDots}
      style={props.style}
      navButtonsTop={props.navButtonsTop}
      navButtonBackground={props.navButtonBackground}
      navButtonColor={props.navButtonColor}
      noPadding={props.noPadding}
      buttonSize={props.buttonSize}
    >
      <Swiper
        onInit={(swiper) => {
          if (props.navigationButtons) {
            swiper.params.navigation.nextEl.addEventListener("click", () =>
              handleNextClick(swiper)
            );
            swiper.params.navigation.prevEl.addEventListener("click", () =>
              handlePrevClick(swiper)
            );
          }
        }}
        spaceBetween={25}
        centeredSlides={props.centeredSlides}
        initialSlide={props.initialSlide || 0}
        navigation={props.navigationButtons}
        pagination={props.pageDots ? { clickable: true } : false}
        slidesPerView={props.slidesPerView || 6}
        modules={[Navigation, Pagination]}
        lazy={"true"}
      >
        {cards.map((e, i) => (
          <SwiperSlide key={i}>
            <LazyLoad>{e}</LazyLoad>
          </SwiperSlide>
        ))}
      </Swiper>
    </SwiperContainer>
  );
};

export default SwiperCarousel;

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper";
import "swiper/css";
import "swiper/swiper-bundle.css";
import "swiper/css/navigation";
import "swiper/swiper.min.css";
import "swiper/swiper-bundle.min.css";
import styled from "styled-components";

const SwiperContainer = styled.div`
  position: relative;
  .swiper,
  .swiper-wrapper {
    position: absolute;
    height: 100%;
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

  //   .swiper-slide img {
  //         width: 64px;
  //         height: 64px;
  //   }
`;

const ImageCarousel = ({ images, noCaption }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [emptyImages, setEmptyImages] = useState(false);
  const [mouseHovered, setMouseHovered] = useState(false);

  useEffect(() => {
    let interval;
    if (mouseHovered) {
      nextSlide();
      interval = setInterval(() => {
        if (currentIndex < images.length - 1) {
          nextSlide();
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [mouseHovered]);

  useEffect(() => {
    if (!images || !images.length) {
      setEmptyImages(true);
    }
  }, [images]);

  const nextSlide = (e) => {
    if (e) {
      e.stopPropagation();
    }
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = (e) => {
    if (e) {
      e.stopPropagation();
    }
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const getVisibleDots = () => {
    if (images.length <= 5) return images.map((_, i) => i);

    let dots = [currentIndex];
    let before = currentIndex;
    let after = currentIndex;

    // Add two dots before and after current if possible
    for (let i = 0; i < 2; i++) {
      before = before - 1 < 0 ? images.length - 1 : before - 1;
      after = after + 1 >= images.length ? 0 : after + 1;
      dots = [before, ...dots, after];
    }

    return dots.sort((a, b) => a - b);
  };

  const visibleDots = getVisibleDots();

  if (emptyImages) return null;

  return (
    <div
      onMouseEnter={() => setMouseHovered(true)}
      onMouseLeave={() => setMouseHovered(false)}
      className="relative w-full h-full"
    >
      <div className="absolute top-0 left-0 w-full h-full bg-gray-200 rounded-lg animate-pulse"></div>
      <div className="relative h-full overflow-hidden rounded-lg">
        {images.map((src, index) => (
          <div key={index} className="absolute w-full h-full">
            <div
              className={`absolute w-full h-full transition-opacity duration-500 ease-in-out ${
                index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image src={src.image} alt={`Slide ${index + 1}`} fill />
              {!noCaption && src?.caption &&(
                <div className="absolute left-2 top-2 text-white bg-black/50 p-2 rounded">
                  {src?.caption}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex flex-row gap-2 items-center">
        {visibleDots.map((index) => {
          const isPrevious =
            (currentIndex === 0 && index === images.length - 1) ||
            index === currentIndex - 1;
          const isNext =
            (currentIndex === images.length - 1 && index === 0) ||
            index === currentIndex + 1;
          const isCurrent = index === currentIndex;

          return (
            <div
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(index);
              }}
              className={`
                                w-3 h-3 rounded-full cursor-pointer
                                transition-all duration-500 ease-in-out
                                ${isPrevious ? "scale-75 bg-gray-300" : ""}
                                ${isNext ? "scale-75 bg-gray-300" : ""}
                                ${
                                  isCurrent
                                    ? "scale-100 bg-[#F7E700] border border-black"
                                    : ""
                                }
                                ${
                                  !isPrevious && !isNext && !isCurrent
                                    ? "scale-50 bg-gray-200"
                                    : ""
                                }
                            `}
            ></div>
          );
        })}
      </div>

      {mouseHovered && (
        <>
          <button
            onClick={(e) => prevSlide(e)}
            className="absolute -left-1 top-1/2 transform -translate-y-1/2 bg-[#01202b] text-white p-2 rounded-full w-10 h-10 d-flex justify-center items-center"
          >
            <MdNavigateBefore className="text-2xl" />
          </button>
          <button
            onClick={(e) => nextSlide(e)}
            className="absolute -right-1 top-1/2 transform -translate-y-1/2 bg-[#01202b] text-white p-2 rounded-full w-10 h-10 d-flex justify-center items-center"
          >
            <MdNavigateNext className="text-2xl" />
          </button>
        </>
       )} 
    </div>
  );
};

export default ImageCarousel;

export const Carousel = ({ images }) => {
  const handlePrevClick = (e, swiper) => {
    e.stopPropagation();
    const currentIndex = swiper.activeIndex + 1;
    const slidesPerView = swiper.params.slidesPerView;
    const newIndex = currentIndex - slidesPerView;
    swiper.slideTo(newIndex);
  };

  const handleNextClick = (e, swiper) => {
    e.stopPropagation();
    const currentIndex = swiper.activeIndex - 1;
    const slidesPerView = swiper.params.slidesPerView;
    const newIndex = currentIndex + slidesPerView;
    swiper.slideTo(newIndex);
  };

  return (
    <SwiperContainer className="w-full h-full">
      <Swiper
        onInit={(swiper) => {
          swiper.params.navigation.nextEl.addEventListener("click", (e) =>
            handleNextClick(e, swiper)
          );
          swiper.params.navigation.prevEl.addEventListener("click", (e) =>
            handlePrevClick(e, swiper)
          );
        }}
        spaceBetween={25}
        centeredSlides={false}
        initialSlide={0}
        navigation={true}
        pagination={true}
        slidesPerView={1}
        modules={[Navigation, Pagination]}
        lazy={"true"}
      >
        {images.map((src, i) => (
          <SwiperSlide key={i}>
            <div className="w-[50%] rounded-lg">
              {!noCaption && <div className={`absolute`}>{src?.caption}</div>}
              <Image src={src.image} alt={`Slide ${i + 1}`} fill />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </SwiperContainer>
  );
};

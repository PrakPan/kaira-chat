import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { IoIosStar } from "react-icons/io";
import { FaPlay } from "react-icons/fa";
import TRAVELERS from "./NewCaseStudies/ReviewsData";
import media from "../../components/media";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper";
import "swiper/css";
import "swiper/swiper-bundle.css";
import "swiper/css/navigation";
import "swiper/swiper.min.css";
import "swiper/swiper-bundle.min.css";
import styled from "styled-components";
import SecondaryHeading from "../../components/heading/Secondary";

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

export default function OurCustomers(props) {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    let arr = [];

    for (let traveler of TRAVELERS) {
      arr.push(
        <Review
          text={traveler.review}
          name={traveler.name}
          image={traveler.image}
          company={traveler.company}
        />
      );
    }

    setCards(arr);
  }, []);

  return (
    <div className="flex flex-col gap-5 px-3">
      <div className="flex flex-col gap-3 items-center">
        <div className="text-[27px] md:text-[40px] font-[700] md:leading-[60px]">
          What Our Customers Say About Us?
        </div>
        <div className="text-[16px] font-[350] leading-[24px]">
          Hear from our travelers! Discover how we've made their journeys
          unforgettable through personalized experiences and seamless service.
        </div>
      </div>

      {/* <Video /> */}

      <Carousel cards={cards} />
    </div>
  );
}

const Video = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const togglePlay = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="relative h-[250px] md:mx-[10%] md:h-[500px] bg-gray-200 rounded-lg flex items-center justify-center ">
      <video
        ref={videoRef}
        className="w-full h-full object-fill rounded-lg"
        poster="/assets/icons/test.jpeg"
        onClick={togglePlay}
        playsInline
      >
        <source src="/assets/videos/ttw.mp4" type="video/mp4" />
        {/* Your browser does not support the video tag. */}
      </video>
      {!isPlaying && (
        <button
          className="absolute inset-0 w-full h-full flex items-center justify-center"
          onClick={togglePlay}
        >
          <div className="w-20 h-20 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
            <FaPlay className="text-2xl text-white" />
          </div>
        </button>
      )}
    </div>
  );
};

const Carousel = ({ cards }) => {
  let isPageWide = media("(min-width: 768px)");

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
    <SwiperContainer className="relative drop-shadow-2xl">
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
};

const Review = ({ text, name, image, company }) => {
  return (
    <div className="h-[480px] flex flex-col justify-between bg-white p-4 rounded-lg">
      <SecondaryHeading>{text}</SecondaryHeading>

      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col gap-1 w-[75%]">
          <div
            className={`font-buffalo text-[#FB5F66] text-[40px] font-[400] leading-[56px] w-[90%] truncate`}
          >
            {name}
          </div>
          <div className={`text-lg font-[400] leading-[56px] truncate`}>
            {company}
          </div>
          <div className="flex flex-row gap-1 items-center">
            <IoIosStar className="text-lg text-[#FEB739]" />
            <IoIosStar className="text-lg text-[#FEB739]" />
            <IoIosStar className="text-lg text-[#FEB739]" />
            <IoIosStar className="text-lg text-[#FEB739]" />
            <IoIosStar className="text-lg text-[#FEB739]" />
          </div>
        </div>
        <div className="">
          <Image
            className="rounded-full"
            src={`https://d31aoa0ehgvjdi.cloudfront.net/${image}`}
            alt=""
            width={64}
            height={64}
          />
        </div>
      </div>
    </div>
  );
};

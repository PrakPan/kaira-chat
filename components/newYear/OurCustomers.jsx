import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper";
import "swiper/css";
import "swiper/swiper-bundle.css";
import "swiper/css/navigation";
import "swiper/swiper.min.css";
import "swiper/swiper-bundle.min.css";
import styled from "styled-components";
import { IoIosStar } from "react-icons/io";
import TRAVELERS from "../../public/content/travelers";
import media from "../../components/media"
import Link from "next/link";


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
    const [cards, setCards] = useState([])

    useEffect(() => {
        let arr = [];

        for (let traveler of TRAVELERS) {
            arr.push(
                <Review text={traveler.review} name={traveler.name} image={traveler.image} itineraryId={traveler.id} />
            )
        }

        setCards(arr);
    }, [])

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
                <div className="font-bold text-[30px] md:text-[40px] text-center">What Our Customers Say About Us?</div>
                <div className="text-[16px] text-center">
                    Hear from our travelers! Discover how we've made their journeys unforgettable through personalized experiences and seamless service.
                </div>
            </div>

            <Carousel cards={cards} />

            <Link
                href={"/testimonials"}
                className="no-underline text-gray-900 border-2 w-fit border-black px-3 py-1 rounded-lg mx-auto hover:text-white hover:bg-black transition-all"
            >View All Reviews</Link>
        </div>
    )
}


const Carousel = ({ cards }) => {
    let isPageWide = media("(min-width: 768px)");

    const handlePrevClick = (swiper) => {
        const currentIndex = swiper.activeIndex + 1;
        const slidesPerView = swiper.params.slidesPerView;
        const newIndex = currentIndex - slidesPerView;
        swiper.slideTo(newIndex);
    }

    const handleNextClick = (swiper) => {
        const currentIndex = swiper.activeIndex - 1;
        const slidesPerView = swiper.params.slidesPerView;
        const newIndex = currentIndex + slidesPerView;
        swiper.slideTo(newIndex);
    }

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
                    <SwiperSlide key={i}>
                        {e}
                    </SwiperSlide>
                ))}
            </Swiper>
        </SwiperContainer>
    );
}

const Review = ({ text, name, image, itineraryId }) => {
    return (
        <div className="h-[480px] md:h-[420px] flex flex-col justify-between bg-white p-4 rounded-lg">
            <div className="text-[16px] font-[400] leading-[26px] text-[#323232]">
                {text}
            </div>

            <div className="flex flex-col gap-2">
                <Link href={`/itinerary/${itineraryId}`} className="bg-[#F7E700] w-fit px-3 py-1 rounded-lg no-underline text-black">View Itinerary</Link>
                <div className="flex flex-row justify-between items-center">
                    <div className="flex flex-col gap-1 w-[75%]">
                        <div className={`font-buffalo text-[#FB5F66] text-[40px] font-[400] leading-[56px] w-[90%] truncate`}>
                            {name}
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
                        <Image className="rounded-full" src={`https://d31aoa0ehgvjdi.cloudfront.net/${image}`} alt="" width={64} height={64} />
                    </div>
                </div>
            </div>
        </div>
    )
}

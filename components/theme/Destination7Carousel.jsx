import React from "react";
import SecondaryHeading from "../heading/Secondary";
import CityCard from "../cards/CityCard";
import { useRouter } from "next/router";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import media from "../../components/media";

const Destination7Carousel = (props) => {
  const router = useRouter();
  let isPageWide = media("(min-width: 768px)");

  return (
    <div className="flex flex-col gap-6 justify-center items-center w-full">
      <Swiper
        slidesPerView={isPageWide ? 3 : 1.2}
        initialSlide={0}
        spaceBetween={20}
        className="!h-max"
        height={"max-content"}
        pageDots={!isPageWide}
        navButtonsTop={isPageWide ? "140px" : "175px"}
      >
        {props?.cities?.map((item, index) => (
          <SwiperSlide key={index} className="!h-max" height={"max-content"}>
            <div
              className="cursor-pointer w-full"
              onClick={() => router.push(`/${item?.path}`)}
            >
              <CityCard img={item?.image} name={item?.name} path={item?.path} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Destination7Carousel;

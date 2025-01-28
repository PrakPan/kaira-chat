import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { FreeMode, Navigation, Thumbs } from "swiper";
import ImageLoader from "../ImageLoader";

const SwiperGallery = (props) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  return (
    <div>
      <Swiper
        style={{
          "--swiper-navigation-color": "#fff",
          "--swiper-pagination-color": "#fff",
        }}
        loop={true}
        spaceBetween={10}
        navigation={true}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper2"
      >
        {props.images.map((image, index) => (
          <>
            <SwiperSlide className="relative" key={index}>
              <ImageLoader url={image.image} fit="cover" />
              <div className="bg-black text-white bg-opacity-50 py-1 px-2 text-lg absolute bottom-0 right-[50%] translate-x-[50%] mx-auto z-50">{ image.caption}</div>
            </SwiperSlide>
          </>
        ))}
      </Swiper>
      <Swiper
        onSwiper={setThumbsSwiper}
        loop={true}
        spaceBetween={10}
        slidesPerView={5}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper"
      >
        {props.images.map((image, index) => (
          <SwiperSlide key={index}>
            <ImageLoader url={image.image} fit="cover" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SwiperGallery;

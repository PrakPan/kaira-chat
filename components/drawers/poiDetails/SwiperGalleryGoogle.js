import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { FreeMode, Navigation, Thumbs } from "swiper";
import ImageLoaderGoogle from "./ImageLoaderGoogle";
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
              <ImageLoaderGoogle
                url={image.photo_reference}
                fit="cover"
                height={"400"}
                heightmobile={'400'}
              />
              <div className="bg-black text-white bg-opacity-50 py-1 px-2 text-lg absolute bottom-0 right-[50%] translate-x-[50%] mx-auto z-50">
                {image?.html_attribution}
              </div>
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
            <ImageLoaderGoogle
              url={props.mercury ? image : image.photo_reference}
              fit="cover"
              height="400"
              heightmobile="400"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SwiperGallery;



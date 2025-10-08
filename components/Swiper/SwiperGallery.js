import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { FreeMode, Navigation, Thumbs } from "swiper";
import ImageLoader from "../ImageLoader";
import styled from "styled-components";

const Container = styled.div`

 .swiper-button-next{
    top: 35%;
    right: 20%;
    position: fixed;
}

.swiper-button-prev{
   top: 35%;
    left: 20%;
    position: fixed;
}

.swiper-button-next::after, .swiper-button-prev::after {
    font-size: 12px !important;
    background: #000;
    kus: c;
    align-items: center;
    justify-content: center;
    display: flex;
    width: 30px;
    height: 30px;
    border-radius: 50%;
}

@media (max-width: 768px) {
    .swiper-button-next{
    top: 30%;
    right: 5%;
}

.swiper-button-prev{
    top: 30%;
    left: 5%;
 }
}
`



const SwiperGallery = (props) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  return (
    <Container>
      <div className="min-w-[50vw] max-w-[656px] justify-center mx-auto min-h-auto max-h-[512px] mb-3xl max-ph:!max-h-[320px]">
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
              <SwiperSlide className="relative !w-full !min-h-[512px] !max-h-[600px]  min-w-[50vw] max-w-[656px] h-auto max-ph:!min-h-[350px] max-ph:!max-h-[400px]  max-ph:!min-w-[100%] max-ph:!max-w-[100%]" key={index}>
                <img className="w-full rounded-6xl max-ph:!rounded-none"  src={image.image || image}  
                 onError={(e) => {
                e.currentTarget.src = "https://d31aoa0ehgvjdi.cloudfront.net/media/icons/bookings/notfounds/noroom.png"
              }}/>
                <div className="bg-text-smokywhite absolute rounded-67br text-sm font-500 leading-lg px-md py-xs absolute top-md left-md">
                  {image?.caption}
                </div>
              </SwiperSlide>
            </>
          ))}
        </Swiper>
      </div>
      <Swiper
        onSwiper={setThumbsSwiper}
        loop={true}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        breakpoints={{
          640: { slidesPerView: 4 },
          768: { slidesPerView: 6 },
          1024: { slidesPerView: 10 },
        }}
        className="mySwiper w-full !top-[90px]"
      >
        {props.images.map((image, index) => (
          <SwiperSlide key={index}>
            <img
              src={image.image || image}
              alt="hotel"
              onError={(e) => {
                console.log(e)
                e.currentTarget.src = "https://d31aoa0ehgvjdi.cloudfront.net/media/icons/bookings/notfounds/noroom.png"
              }}
              className="!w-[100px] !h-[100px] rounded-2xl"
            />

          </SwiperSlide>
        ))}
      </Swiper>
    </Container>
  );
};

export default SwiperGallery;

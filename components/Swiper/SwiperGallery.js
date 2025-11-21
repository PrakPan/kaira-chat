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
    top: 40%;
    right: 20%;
    position: fixed;
}

.swiper-button-prev{
   top: 40%;
    left: 20%;
    position: fixed;
}

.swiper-button-next, .swiper-button-prev{
    background: #fff;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    }

.swiper-button-next::after, .swiper-button-prev::after {
    font-size: 12px !important;
    kus: c;
    align-items: center;
    justify-content: center;
    display: flex;
    color: #000
}

@media (max-width: 768px) {
    .swiper-button-next{
    top: 35%;
    right: 5%;
}

.swiper-button-prev{
    top: 35%;
    left: 5%;
 }
}
`



const SwiperGallery = (props) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(1); // start from 1

  return (
    <Container>
      <div className="hidden max-ph:!flex justify-between items-baseline px-xl mb-lg"> <span className="text-black leading-xl-sm text-md-lg font-600">Photo Gallery</span> <span className="text-sm font-400 text-text-spacegrey">{currentIndex}/{props.images.length}</span> </div>
      <div className="min-w-[50vw] max-w-[50vw] max-h-[60vh] justify-center mx-auto min-h-auto mb-3xl max-ph:!min-h-[350px] max-ph:!max-h-[400px]  max-ph:!min-w-[100%] max-ph:!max-w-[100%]">
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
          onSlideChange={(swiper) => {
            setCurrentIndex(swiper.realIndex + 1);
          }}
          className="mySwiper2"
        >
          {props.images.map((image, index) => (
            <>
              <SwiperSlide className="relative min-w-[50vw] max-w-[50vw] max-h-[60vh] max-ph:!min-h-[350px] max-ph:!max-h-[400px]  max-ph:!min-w-[100%] max-ph:!max-w-[100%]" key={index}>
                <img className="w-full rounded-6xl max-ph:!rounded-none" src={props?.imgUrlEndPoint ? props.imgUrlEndPoint + image.image : image.image || image}
                  onError={(e) => {
                    e.currentTarget.src = "https://d31aoa0ehgvjdi.cloudfront.net/media/icons/bookings/notfounds/noroom.png"
                  }} />
                <div className="bg-text-smokywhite absolute rounded-67br text-sm font-500 leading-lg px-md py-xs absolute bottom-md left-1/2 -translate-x-1/2 whitespace-nowrap">
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
        className="mySwiper w-full !top-[0px]"
      >
        {props.images.map((image, index) => (
          <SwiperSlide key={index}>
            <img
              src={props?.imgUrlEndPoint ? props.imgUrlEndPoint + image.image : image.image || image}
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

import React, { useRef } from "react";
import SwiperCore, { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

SwiperCore.use([Navigation]);

const baseImages = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
  "https://images.unsplash.com/photo-1454496522488-7a8e488e8606",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
  "https://images.unsplash.com/photo-1434394354979-a235cd36269d",
  "https://images.unsplash.com/photo-1458668383970-8ddd3927deed",
];

const images = Array.from(
  { length: 30 },
  (_, i) => baseImages[i % baseImages.length]
);

export default function CurvedSwiper() {
  const swiperRef = useRef();

  return (
    <div className="w-full max-w-7xl mx-auto py-10 h-[500px] relative overflow-visible">
      <Swiper
        className="!h-[500px]"
        height={500}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        initialSlide={1}
        spaceBetween={20}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        breakpoints={{
          1280: {
            slidesPerView: 4,
            slidesOffsetBefore: 100,
            slidesOffsetAfter: 100,
          },
          1024: {
            slidesPerView: 3,
            slidesOffsetBefore: 80,
            slidesOffsetAfter: 80,
          },
          768: {
            slidesPerView: 2,
            slidesOffsetBefore: 40,
            slidesOffsetAfter: 40,
          },
          0: {
            slidesPerView: 1.2,
            slidesOffsetBefore: 20,
            slidesOffsetAfter: 20,
          },
        }}
      >
        {images.map((img, i) => (
          <SwiperSlide
            key={i}
            className="!h-[488px] !w-auto overflow-visible flex items-center justify-center"
          >
            {() => {
              const swiper = swiperRef.current;
              let rotateY = 0;

              if (swiper) {
                const current = swiper.realIndex + 1;
                const virtualIndex = i % images.length;
                const diff = virtualIndex - current;

                if (diff === -2) rotateY = 40;
                else if (diff === -1) rotateY = 30;
                else if (diff === 1) rotateY = -30;
                else if (diff === 2) rotateY = -40;
              }

              return (
                <div
                className="transition-transform duration-500 w-[336px] !h-[488px]"
                style={{
                  transform: `rotateY(${rotateY}deg)`,
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                }}
            
                >
                  <img
                    src={img}
                    alt="Slide"
                    className="rounded-3xl w-full h-full object-cover shadow-xl"
                    height={"488"}
                  />
                </div>
              );
            }}
          </SwiperSlide>
        ))}

        {/* Navigation Buttons */}
        <div className="swiper-button-prev !text-black" />
        <div className="swiper-button-next !text-black" />
      </Swiper>
    </div>
  );
}

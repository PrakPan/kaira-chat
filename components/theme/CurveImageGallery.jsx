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
    <div
      className="w-full max-w-7xl mx-auto py-10 h-[500px] relative overflow-visible"
      style={{ perspective: "1200px" }}
    >
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
            className="!w-auto overflow-visible flex items-center justify-center"
          >
            {() => {
              const swiper = swiperRef.current;
              let rotateY = 0;
              let height = 488;
              let clipPath = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";

              if (swiper) {
                const current = swiper.realIndex + 1;
                const virtualIndex = i % images.length;
                const diff = virtualIndex - current;

                if (diff === -2) {
                  rotateY = 10;
                  clipPath = "polygon(0% 0%, 100% 10%, 100% 90%, 0% 100%)";
                } else if (diff === -1) {
                  rotateY = 5;
                  clipPath = "polygon(0% 0%, 100% 6%, 100% 94%, 0% 100%)";
                } else if (diff === 1) {
                  rotateY = -5;
                  clipPath = "polygon(0% 6%, 100% 0%, 100% 100%, 0% 94%)";
                } else if (diff === 2) {
                  rotateY = -10;
                  clipPath = "polygon(0% 10%, 100% 0%, 100% 100%, 0% 90%)";
                } else if (diff === 0) {
                  // Center slide: height should match the shorter side of adjacent slides (~94%)
                  height = Math.round(488 * 0.94); // 458px
                }
              }

              return (
                <div
                  className="transition-transform duration-500 w-[336px] overflow-hidden"
                  style={{
                    height: `${height}px`,
                    transform: `rotateY(${rotateY}deg)`,
                    transformStyle: "preserve-3d",
                    backfaceVisibility: "hidden",
                    clipPath: clipPath,
                  }}
                >
                  <img
                    src={img}
                    alt="Slide"
                    className="rounded-3xl w-full h-full object-cover shadow-xl"
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

import React, { useState, useRef } from "react";
import PrimaryHeading from "../heading/PrimaryHeading";
import SecondaryHeading from "../heading/Secondary";
import media from "../media";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Image from "next/image";

const Carousel3D = () => {

const baseImages = [
  {
    image: "media/ladakh-carousel/pexels-yogendras31-14090506.jpg",
    title: null,
    caption: null,
  },
  {
    image: "media/ladakh-carousel/pexels-jay-baid-1420324-15560333.jpg",
    title: null,
    caption: null,
  },
  {
    image: "media/ladakh-carousel/pexels-itismowgli-1202975.jpg",
    title: null,
    caption: null,
  },
  {
    image: "media/ladakh-carousel/pexels-jay-baid-1420324-15844517.jpg",
    title: null,
    caption: null,
  },
  {
    image: "media/ladakh-carousel/Group-1000002319.png",
    title: null,
    caption: null,
  },
  {
    image: "media/ladakh-carousel/pexels-imdad-sayyed-1274214-32630752.jpg",
    title: null,
    caption: null,
  },
  {
    image: "media/ladakh-carousel/pexels-shashwat-basutkar-2154409035-33207999.jpg",
    title: null,
    caption: null,
  },
  {
    image: "media/ladakh-carousel/pexels-avinashpatel-3392154.jpg",
    title: null,
    caption: null,
  },
];


  const totalCount = 19;
  const images = [];

  for (let i = 0; i < totalCount; i++) {
    images.push(baseImages[i % baseImages.length]);
  }

  const totalSlides = images.length;
  const anglePerSlide = 360 / totalSlides;
  const radius = 2300;

  const [rotation, setRotation] = useState(0);
  const pointerStartX = useRef(null);

  // Add touch events in addition to pointer events for maximum compatibility
  return (
    <div>
      <div className="flex flex-col items-center ">
        <div className="max-w-[600px] text-center">
          <PrimaryHeading>
            What Your Ladakh Trip Could Look Like.
          </PrimaryHeading>
        </div>
        <div className="max-w-[800px] text-center text-[#7C7C7C]">
          <SecondaryHeading>
            A glimpse into the journeys, joy, and unforgettable moments our
            travelers have lived, all captured in these beautiful glimpses from
            around the world.
          </SecondaryHeading>
        </div>
      </div>
        <div className="flex bg-white text-white font-sans text-center relative mt-0 overflow-hidden hidden-mobile">
          <style>
            {`
        .perspective {
          perspective: 1800px;
          perspective-origin: 50% 50%;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .nav-button {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 40px;
          height: 40px;
          border-radius: 9999px;
          background-color: rgba(0, 0, 0, 0.5);
          color: white;
          font-size: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          cursor: pointer;
        }
        .nav-button:hover {
          background-color: rgba(0, 0, 0, 0.7);
        }
      `}
          </style>

          <div className="relative w-screen h-[700px] mx-auto perspective">
            {/* Left Navigation */}
            <Image
              src="/arrow-circle-left.svg"
              alt="left"
              className="nav-button !top-[45%] left-40 !bg-inherit"
              onClick={() => setRotation((prev) => prev - anglePerSlide)}
              width={48}
              height={48}
            />

            {/* Right Navigation */}
            <Image
              src="/arrow-circle-right.svg"
              alt="left"
              className="nav-button !top-[45%] right-40 !bg-inherit"
              onClick={() => setRotation((prev) => prev + anglePerSlide)}
              width={48}
              height={48}
            />

            <div
              className="absolute w-full h-full preserve-3d transition-transform duration-700"
              style={{ transform: `rotateY(${rotation}deg)` }}
            >
              {images.map((item, index) => {
                const angle = index * anglePerSlide;
                return (
                  <div
                    key={index}
                    className="absolute w-[700px] h-[900px] -top-[180px] left-[10px] rounded-[16px] flex items-center justify-center"
                    style={{
                      backgroundImage: `url(https://images.thetarzanway.com/${item.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
        <div className="hidden-desktop">
          <Swiper
            slidesPerView={1.2}
            initialSlide={0}
            spaceBetween={15}
            className="!h-max"
          >
            {images?.map((item, index) => (
              <SwiperSlide key={index}>
                <div className="relative aspect-[280/312] rounded-[16px] overflow-hidden">
                  <Image
                    src={"https://images.thetarzanway.com/" + item.image}
                    alt={`${index}_image`}
                    fill
                    className="object-cover"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
    </div>
  );
};

export default Carousel3D;

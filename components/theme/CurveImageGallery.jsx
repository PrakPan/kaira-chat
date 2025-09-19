import React, { useState, useRef, useEffect } from "react";
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
      image:
        "media/ladakh-carousel/pexels-shashwat-basutkar-2154409035-33207999.jpg",
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

  // Auto-slide functionality
  useEffect(() => {
    const autoSlideInterval = setInterval(() => {
      setRotation((prev) => prev + anglePerSlide);
    }, 3000); // Slide every 3 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(autoSlideInterval);
  }, [anglePerSlide]);

  // Add touch events in addition to pointer events for maximum compatibility
  return (
    <section className="w-full bg-white  font-inter">
      <div className="flex flex-col items-center">
        <div className="max-w-[600px] text-center">
          <h2 className="text-center text-3xl md:text-4xl font-bold text-primary-indigo mb-4">
            Memories Made with Us.
          </h2>
        </div>
        <div className="max-w-[800px] text-center">
          <p className="text-[16px] leading-relaxed text-text-default">
            A glimpse into the journeys, joy, and unforgettable moments our
            travelers have lived, all captured in these beautiful glimpses from
            around the world.
          </p>
        </div>
      </div>
      <div className="flex text-white font-sans text-center relative  overflow-hidden hidden-mobile -mt-15">
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
          {/* <Image
            src="/arrow-circle-left.svg"
            alt="left"
            className="nav-button !top-[45%] left-40 !bg-inherit"
            onClick={() => setRotation((prev) => prev - anglePerSlide)}
            width={48}
            height={48}
          /> */}

          {/* Right Navigation */}
          {/* <Image
            src="/arrow-circle-right.svg"
            alt="left"
            className="nav-button !top-[45%] right-40 !bg-inherit"
            onClick={() => setRotation((prev) => prev + anglePerSlide)}
            width={48}
            height={48}
          /> */}

          <div
            className="absolute w-full h-full preserve-3d transition-transform duration-700"
            style={{ transform: `rotateY(${rotation}deg)` }}
          >
            {images.map((item, index) => {
              const angle = index * anglePerSlide;
              // Determine if card is facing away (needs text flip correction)
              const isBackFacing =
                Math.abs((angle + rotation) % 360) > 90 &&
                Math.abs((angle + rotation) % 360) < 270;

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
                >
                  <div
                    className="absolute inset-0 text-white w-full h-full flex items-center justify-center"
                    style={{
                      transform: isBackFacing ? "rotateY(180deg)" : "none",
                      backgroundColor: "rgba(0, 0, 0, 0.2)",
                      borderRadius: "16px",
                    }}
                  >
                    <h1 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold">
                      Hello World {index + 1}
                    </h1>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="hidden-desktop px-4">
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
    </section>
  );
};

export default Carousel3D;

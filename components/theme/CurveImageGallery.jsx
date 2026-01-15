import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { imgUrlEndPoint } from "./ThemeConstants";

const tarzanWayEndPoint = `https://images.thetarzanway.com/`;


const Carousel3D = () => {
  const baseImages = [
    {
      image: `${tarzanWayEndPoint}media/ladakh-carousel/pexels-yogendras31-14090506.jpg`,
      title: "Leh Palace",
      description: "Ancient royal palace overlooking the Indus Valley",
      tags: ["Historic"],
    },
    {
      image: `${imgUrlEndPoint}media/website/compressedImage%20(3).jpeg`,
      title: "Pangong Lake",
      description: "Crystal clear high-altitude lake in the Himalayas",
      tags: ["Nature"],
    },
    {
      image: `${imgUrlEndPoint}media/website/compressedImage%20(4).jpeg`,
      title: "Nubra Valley",
      description: "Desert landscapes with double-humped camels",
      tags: ["Desert"],
    },
    {
      image: `${tarzanWayEndPoint}media/ladakh-carousel/pexels-jay-baid-1420324-15844517.jpg`,
      title: "Magnetic Hill",
      description: "Mysterious hill with gravitational anomaly",
      tags: ["Mystery"],
    },
    {
      image: `${tarzanWayEndPoint}media/ladakh-carousel/Group-1000002319.png`,
      title: "Shanti Stupa",
      description: "Buddhist white-domed stupa offering panoramic views",
      tags: ["Buddhist"],
    },
    {
      image: `${imgUrlEndPoint}media/website/compressedImage%20(5).jpeg`,
      title: "Tso Moriri",
      description: "High altitude wetland conservation reserve",
      tags: ["Wildlife"],
    },
    {
      image:
        `${tarzanWayEndPoint}media/ladakh-carousel/pexels-shashwat-basutkar-2154409035-33207999.jpg`,
      title: "Khardung La",
      description: "World's highest motorable road pass",
      tags: ["Adventure"],
    },
    {
      image: `${imgUrlEndPoint}media/website/compressedImage%20(6).jpeg`,
      title: "Hemis Monastery",
      description: "Largest monastic institution in Ladakh",
      tags: ["Monastery"],
    },
    {
      image: `${imgUrlEndPoint}media/website/compressedImage%20(1).jpeg`,
      title: "Stok Kangri Viewpoint",
      description: "A breathtaking viewpoint offering panoramic vistas of the Stok Range.",
      tags: ["Mountains"],
    },
    {
      image: `${imgUrlEndPoint}media/website/compressedImage%20(2).jpeg`,
      title: "Thiksey Monastery",
      description: "A majestic hilltop monastery known for its stunning architecture and morning prayers.",
      tags: ["Monastery"],
    },
    {
      image: `${tarzanWayEndPoint}media/website/compressedImage%20(10).jpeg`,
      title: "Khardung La Pass",
      description: "One of the world’s highest motorable roads surrounded by dramatic snow-capped peaks.",
      tags: ["Mountain Pass"],
    },
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-0 sm:px-4 lg:px-8 bg-white font-inter">
      <div className="flex flex-col items-center px-1">
        <div className="max-w-[600px] text-center">
          <h2 className="text-center text-3xl md:text-4xl font-bold text-primary-indigo mb-4">
            Memories Made with Us
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

      {/* Desktop Panorama Slider max-w-[1520px] mx-auto */}
      <div className="md:block ">
        <div
          className="panorama-slider text-antialiased"
          style={{
            height: "560px",
            display: "flex",
            alignItems: "center",
            background: "white",
            userSelect: "none",
          }}
        >
          <div
            className="swiper "
            style={{ height: "100%", paddingBlock: "20px" }}
          >
            <div className="swiper-wrapper">
              {baseImages.map((item, index) => (
                <div
                  key={index}
                  className="swiper-slide mx-1"
                  style={{ width: "375px", height: "416px" }}
                >
                  <div
                    className="relative w-100% h-100% group cursor-pointer text-white hover:text-black rounded-2xl overflow-hidden"
                    style={{ height: "416px" }}
                  >
                    <img
                      className="slide-image block w-full h-full object-cover"
                      src={`${item.image}`}
                      alt={item.title}
                      loading="lazy"
                    />
                    {/* Gradient Overlay */}
                    <div
                      className=" absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(178deg, rgba(0, 0, 0, 0.00) 49.92%, rgba(0, 0, 0, 0.70) 98.41%)",
                      }}
                    />
                    {/* Tags */}
                    {item.tags && item.tags.length > 0 && (
                      <div className="  absolute top-4 left-4 flex flex-wrap gap-2 z-10">
                        {item.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="text-black px-2 sm:px-3 py-1 bg-[#F2F2F2E5] backdrop-blur-[50px] text-xs sm:text-sm font-medium rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    {/* Arrow Icon */}
                    <div className="absolute top-4 right-4 z-10">
                      <div className="w-10 h-10 bg-black/50 backdrop-blur-sm border border-white/30 group-hover:bg-primary-yellow rounded-full flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 text-white hover:text-black">
                        <FontAwesomeIcon
                          icon={faArrowUp}
                          className="text-current group-hover:text-black text-sm transition-colors duration-300 transform rotate-45"
                        />
                      </div>
                    </div>
                    {/* Content */}
                    <div className=" absolute bottom-0 left-0 right-0 p-6 z-10">
                      {item.description && (
                        <p className="text-white/90 leading-relaxed text-md text-center">
                          {item.description}
                        </p>
                      )}
                      {item.title && (
                        <p className="text-white font-semibold mb-2 text-md text-center">
                          {item.title}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="swiper-pagination hidden"></div>
          </div>
        </div>
      </div>

      {/* Mobile Swiper */}
      <div className="hidden px-4">
        <Swiper
          slidesPerView={1.2}
          initialSlide={0}
          spaceBetween={15}
          className="!h-max"
          modules={[Pagination]}
          pagination={{ clickable: true }}
        >
          {baseImages.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-[352px] h-[416px] rounded-[16px] overflow-hidden group cursor-pointer">
                <Image
                  src={`https://images.thetarzanway.com/${item.image}`}
                  alt={item.title}
                  fill
                  className="object-cover"
                />

                {/* Gradient Overlay */}
                <div
                  className="absolute inset-0 rounded-[16px]"
                  style={{
                    background:
                      "linear-gradient(178deg, rgba(0, 0, 0, 0.00) 49.92%, rgba(0, 0, 0, 0.70) 98.41%)",
                  }}
                />

                {/* Tags */}
                {item.tags && item.tags.length > 0 && (
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1 z-10">
                    {item.tags.slice(0, 2).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full border border-white/30"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Arrow Icon */}
                <div className="absolute top-3 right-3 z-10">
                  <div className="w-8 h-8 bg-white/20 backdrop-blur-sm border border-white/30 group-hover:bg-yellow-400 rounded-full flex items-center justify-center transform transition-all duration-300 group-hover:scale-110">
                    <FontAwesomeIcon
                      icon={faArrowUp}
                      className="text-white group-hover:text-black text-xs transition-colors duration-300 transform rotate-45"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                  {item.description && (
                    <p className="text-white/90 leading-relaxed text-md text-center">
                      {item.description}
                    </p>
                  )}
                  {item.title && (
                    <p className="text-white font-semibold mb-2 text-md text-center">
                      {item.title}
                    </p>
                  )}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Carousel3D;

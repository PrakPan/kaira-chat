import Image from "next/image";
import React from "react";
import { PlanYourTripButton } from "../../containers/travelplanner/ThemePage";
import openTailoredModal from "../../services/openTailoredModal";
import { useRouter } from "next/router";
import SwiperCarousel from "../SwiperCarousel";

const data = [
  {
    title: "Slow & Soulful",
    image: "media/ladakh-carousel/image 446.png",
    tags: ["Monastery Stays", "Yoga", "Nature Walks"],
  },
  {
    title: "Adventure & Thrill",
    image: "media/ladakh-carousel/image 447.png",
    tags: ["ATV Rides", "Rafting", "Paragliding"],
  },
  {
    title: "Local & Raw",
    image: "media/ladakh-carousel/image 445.png",
    tags: ["Village Immersion", "Crafts", "Herding Goats"],
  },
];

const JourneyType = (props) => {
  const router = useRouter();
  const cards = data.map((item, index) => (
    <div
      key={`card_${index}`}
      className="relative w-full aspect-square overflow-hidden text-white rounded-[24px] cursor-pointer"
    >
      <Image
        src={`https://images.thetarzanway.com/${item.image}`}
        alt={item.title}
        fill
        className="object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent z-10" />

      {/* Bottom Text */}
      <div className="absolute bottom-4 left-4 right-4 z-20">
        <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
        <div className="flex flex-wrap gap-2">
          {item.tags.map((tag, tagIdx) => (
            <span
              key={`tag_${tagIdx}`}
              className="bg-white/40 border-white border-[0.5px] text-sm px-3 py-1 rounded-full backdrop-blur-md"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  ));
  return (
    <div
      className="w-full "
      onClick={() =>
        openTailoredModal(router, props.page_id, props.destination, props.type)
      }
    >
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">
        Choose Your Journey Type.
      </h2>
      <div className="flex gap-4  w-full hidden-mobile">
        {data.map((item, index) => (
          <div
            key={`card_${index}`}
            className="relative w-full w-1/3 aspect-square overflow-hidden text-white rounded-[24px] cursor-pointer"
          >
            <Image
              src={`https://images.thetarzanway.com/${item.image}`}
              alt={item.title}
              fill
              className="object-cover"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent z-10" />

            {/* Bottom Text */}
            <div className="absolute bottom-4 left-4 right-4 z-20">
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag, tagIdx) => (
                  <span
                    key={`tag_${tagIdx}`}
                    className="bg-white/40 border-white border-[0.5px] text-sm px-3 py-1 rounded-full backdrop-blur-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden-desktop">
        <SwiperCarousel
          slidesPerView={1.3}
          pageDots
          noPadding
          cards={cards}
        />
      </div>
    </div>
  );
};

export default JourneyType;

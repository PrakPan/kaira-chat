import React, { useState } from "react";
import { imgUrlEndPoint } from "../../components/theme/ThemeConstants";

export default function HeroSection({
  setFormData,
  formData,
  setIsModalOpen,
  isModalOpen,
}) {
  const images = [
    "/B11.png",
    "B12.png",
    "B13.png",
    "B21.png",
    "B23.png",
    "B31.png",
    "B41.png",
    "B51.png",
    "B32.png",
    "B42.png",
    "B52.png",
    "B62.png",
    "B71.png",
    "B72.png",
    "B73.png",
  ];

  const partners = [
    { name: "Physics Wallah", logo: "/P01.svg" },
    { name: "TEC Analytics", logo: "/P02.svg" },
    { name: "Generic Food", logo: "/P03.svg" },
    { name: "Budvieser", logo: "/P04.svg" },
    {
      name: "Fever FM",
      logo: "/Fever FM.png ",
      alt: "Fever FM",
    },
    {
      name: "Budveiser",
      logo: "/Budveiser.png",
      alt: "Budveiser",
    },
    {
      name: "Zapho",
      logo: `${imgUrlEndPoint}media/website/Zapho-pt.png`,
      alt: "Zapho",
    },
    {
      name: "Imperfecto",
      logo: `${imgUrlEndPoint}media/website/imperfecto-pt.png`,
      alt: "Imperfecto",
    },
    {
      name: "Mask Group",
      logo: `${imgUrlEndPoint}media/website/Mask-group-pt.png`,
      alt: "Mask Group",
    },
    {
      name: "Mob",
      logo: `${imgUrlEndPoint}media/website/Mob-logo-pt.png`,
      alt: "Mob",
    },
    {
      name: "Cox & Kings",
      logo: `${imgUrlEndPoint}media/website/cox__kings_logo.jpeg`,
      alt: "Cox & Kings",
    },
    {
      name: "Inorbit",
      logo: `${imgUrlEndPoint}media/website/Inorbit-pt.png`,
      alt: "Inorbit",
    },
    {
      name: "Shishi",
      logo: `${imgUrlEndPoint}media/website/shishi-pt.png`,
      alt: "Shishi",
    },
    {
      name: "Sleepy Owl",
      logo: `${imgUrlEndPoint}media/website/sleepy-owl.png`,
      alt: "Sleepy Owl",
    },
    {
      name: "Book My Show",
      logo: `${imgUrlEndPoint}media/website/bookmyshow-pt.png`,
      alt: "Book My Show",
    },
    {
      name: "Radisson Blu",
      logo: `${imgUrlEndPoint}media/website/radissonblu-pt.png`,
      alt: "Radisson Blu",
    },
    {
      name: "Zone Connect",
      logo: `${imgUrlEndPoint}media/website/ZoneConnectLogo-pt.png`,
      alt: "Zone Connect",
    },
  ];

  return (
    <div className=" bg-[#ffffe7] flex flex-col w-full mb-3 lg:mb-7">
      {/* Hero Section */}
      <section className="flex-1 mx-auto px-4  py-6 lg:py-8 w-full">
        {/* Desktop Layout */}
        <div className="!hidden lg:!grid lg:grid-cols-12 gap-3 xl:gap-4">
          {/* LEFT SIDE - 2 Columns with 3 Images */}
          <div className="col-span-2 flex flex-col gap-3 xl:gap-4">
            <div className="rounded-2xl xl:rounded-3xl overflow-hidden h-[12.5rem]">
              <img
                src={images[0]}
                alt="Team activity"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-2xl xl:rounded-3xl overflow-hidden h-[10.5rem]">
              <img
                src={images[1]}
                alt="City tour"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-2xl xl:rounded-3xl overflow-hidden h-[13rem] ">
              <img
                src={images[2]}
                alt="Group photo"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="col-span-2 flex flex-col gap-3 xl:gap-4">
            <div className="rounded-2xl xl:rounded-3xl overflow-hidden h-[11rem]">
              <img
                src={images[3]}
                alt="Outdoor activity"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="bg-[#FFD700] rounded-2xl xl:rounded-3xl p-4 xl:p-6 text-center flex flex-col justify-center h-[13rem]">
              <div className="text-3xl xl:text-5xl font-bold text-gray-900 mb-1">
                90+
              </div>
              <div className="text-gray-900 font-medium text-xs xl:text-sm">
                Tour
                <br />
                Destinations
              </div>
            </div>
            <div className="rounded-2xl xl:rounded-3xl overflow-hidden h-[13rem]">
              <img
                src={images[4]}
                alt="Team games"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* CENTER - 3 Images Top, Text, 3 Images Bottom */}
          <div className="col-span-4 flex flex-col gap-3 xl:gap-4">
            {/* Top 3 Images */}
            <div className="grid grid-cols-3 gap-3 xl:gap-4">
              <div className="rounded-2xl xl:rounded-3xl overflow-hidden h-[9rem] xl:h-45">
                <img
                  src={images[5]}
                  alt="Group event"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-2xl xl:rounded-3xl overflow-hidden h-[9rem] xl:h-45">
                <img
                  src={images[6]}
                  alt="Team building"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-2xl xl:rounded-3xl overflow-hidden h-[9rem] xl:h-45">
                <img
                  src={images[7]}
                  alt="Corporate event"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Main Heading and CTA */}
            <div className="flex flex-col items-center justify-center flex-1 text-center px-2">
              <h1 className="text-xl xl:text-2xl 2xl:text-6xl font-bold text-gray-900 mb-6 xl:mb-8 leading-tight">
                Designing Moments That
                <br />
                Build Teams
              </h1>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-[#0f1c2e] text-white px-8 sm:px-20 py-2.5 rounded-lg text-base hover:bg-[#1a2b3f] transition-colors"
              >
                Enquire Now
              </button>
            </div>

            {/* Bottom 3 Images */}
            <div className="grid grid-cols-3 gap-3 xl:gap-4">
              <div className="rounded-2xl xl:rounded-3xl overflow-hidden h-[9rem] xl:h-45">
                <img
                  src={images[8]}
                  alt="Office activity"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-2xl xl:rounded-3xl overflow-hidden h-[9rem] xl:h-45">
                <img
                  src={images[9]}
                  alt="Mountain view"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-2xl xl:rounded-3xl overflow-hidden h-[9rem] xl:h-45">
                <img
                  src={images[10]}
                  alt="Team photo"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - 2 Columns with 3 Images */}
          <div className="col-span-2 flex flex-col gap-3 xl:gap-4">
            <div className="bg-[#FFD700] rounded-2xl xl:rounded-3xl p-4 xl:p-6 text-center flex flex-col justify-center h-[11.5rem] xl:h-45">
              <div className="text-3xl xl:text-5xl font-bold text-gray-900 mb-1">
                15K+
              </div>
              <div className="text-gray-900 font-medium text-xs xl:text-sm">
                Travellers
                <br />
                Hosted
              </div>
            </div>
            <div className="rounded-2xl xl:rounded-3xl overflow-hidden h-[12.5rem] xl:h-45">
              <img
                src={images[11]}
                alt="Adventure"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="bg-[#FFD700] rounded-2xl xl:rounded-3xl p-4 xl:p-6 text-center flex flex-col justify-center h-[13rem] xl:h-45">
              <div className="text-3xl xl:text-5xl font-bold text-gray-900 mb-1">
                5K+
              </div>
              <div className="text-gray-900 font-medium text-xs xl:text-sm">
                Experiences
                <br />
                Delivered
              </div>
            </div>
          </div>

          <div className="col-span-2 flex flex-col gap-3 xl:gap-4">
            <div className="rounded-2xl xl:rounded-3xl overflow-hidden h-[12.5rem] xl:h-45">
              <img
                src={images[12]}
                alt="Team gathering"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-2xl xl:rounded-3xl overflow-hidden h-[10.5rem] xl:h-45">
              <img
                src={images[13]}
                alt="Outdoor fun"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-2xl xl:rounded-3xl overflow-hidden h-[13rem] xl:h-45">
              <img
                src={images[14]}
                alt="Sunset"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Mobile Layout - 2 Columns */}
        <div className="lg:hidden grid grid-cols-2 gap-3">
          {/* LEFT COLUMN - 3 items */}
          <div className="space-y-3">
            <div className="rounded-2xl overflow-hidden h-[10rem]">
              <img
                src={images[0]}
                alt="Team activity"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="bg-[#FFD700] rounded-2xl p-4 text-center h-[10rem] flex flex-col justify-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">90+</div>
              <div className="text-gray-900 font-medium text-xs">
                Tour
                <br />
                Destinations
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden h-[10rem]">
              <img
                src={images[1]}
                alt="City tour"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* RIGHT COLUMN - 3 items */}
          <div className="space-y-3">
            <div className="bg-[#FFD700] rounded-2xl p-4 text-center h-[10rem] flex flex-col justify-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">15K+</div>
              <div className="text-gray-900 font-medium text-xs">
                Travellers
                <br />
                Hosted
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden flex items-center justify-center h-[10rem]">
              {/* <img src={images[2]} alt="Group photo" className="w-full h-full object-cover" /> */}
              <div className="col-span-2 text-center">
                <h1 className="font-bold text-base text-gray-900 leading-tight">
                  Designing Moments That Build Teams
                </h1>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-[#0f1c2e] text-white px-10 py-2 rounded-[8px] text-sm hover:bg-[#1a2b3f] transition-colors"
                >
                  Enquire Now
                </button>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden h-[10rem]">
              <div className="bg-[#FFD700] rounded-2xl p-4 text-center h-[10rem] flex flex-col justify-center">
                <div className="text-3xl font-bold text-gray-900 mb-1">5K+</div>
                <div className="text-gray-900 font-medium text-xs">
                  Experience
                  <br />
                  Delivered
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="border rounded-6xl border-gray-200 bg-white py-2 lg:py-2 ml-4 mr-4">
        <div className="container mx-auto px-4">
          <div
            className="flex overflow-scroll justify-evenly items-center gap-6 lg:gap-12"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              overflow: "auto",
            }}
          >
            {partners.map((partner, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className=" flex items-center justify-center text-white font-bold text-xs">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="min-w-[60px]"
                  />
                </div>
                {/* <span className="text-gray-900 font-semibold text-sm lg:text-base">{partner.name}</span> */}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

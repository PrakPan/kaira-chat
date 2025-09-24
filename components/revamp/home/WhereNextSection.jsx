import React from "react";
import Image from "next/image";
import Button from "../common/components/button";
import { Japan } from "../assets";
import Link from "next/link";

const WhereNextSection = () => {
  // Traveler avatars data - using simple color-coded initials for now
  const travelers = [
    {
      id: 1,
      name: "Sarah",
      bgColor: "#FF6B6B",
    },
    {
      id: 2,
      name: "Mike",
      bgColor: "#4ECDC4",
    },
    {
      id: 3,
      name: "Emma",
      bgColor: "#45B7D1",
    },
    {
      id: 4,
      name: "Alex",
      bgColor: "#96CEB4",
    },
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div
          className="rounded-2xl lg:rounded-3xl p-8 lg:p-12"
          style={{ backgroundColor: "#FEF7B0" }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Content Side */}
            <div className="order-2 lg:order-1">
              <h2
                className="font-bold text-gray-900 mb-4 lg:mb-6 leading-tight"
                style={{ fontSize: "40px" }}
              >
                Where Will You Go Next?
                <br />
                Let's Plan It.
              </h2>

              <p
                className="font-normal text-gray-700 mb-6 lg:mb-8 leading-relaxed max-w-lg"
                style={{ fontSize: "18px" }}
              >
                Pick a place, pack your bags, and leave the planning to us —
                your next adventure is just a click away!
              </p>

              {/* CTA Button */}
              <div className="mb-8 lg:mb-10">
              <Link href="/new-trip">
                <Button
                  variant="filled"
                  size="medium"
                  onClick={() => {
                    console.log("Create a Trip Now! clicked");
                  }}
                  className="!bg-primary-indigo !border-primary-indigo !text-white hover:!bg-primary-indigo/90 !font-medium !text-base !px-6 !py-3 !rounded-lg"
                >
                  + Create a Trip Now!
                </Button>
                </Link>
              </div>

              {/* Travelers Section */}
              <div className="flex flex-col gap-3">
                {/* Avatar Stack */}
                <div className="flex -space-x-3">
                  {travelers.map((traveler, index) => (
                    <div
                      key={traveler.id}
                      className="w-10 h-10 rounded-full border-2 border-white overflow-hidden relative"
                      style={{
                        zIndex: index + 1,
                      }}
                    >
                      <Image
                        src={Japan}
                        alt={`${traveler.name} profile picture`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>

                {/* Count Text */}
                <div
                  style={{ fontSize: "14px" }}
                  className="font-normal text-gray-700"
                >
                  <span className="font-medium">
                    10k+ Travellers and Counting
                  </span>
                </div>
              </div>
            </div>

            {/* Image Side */}
            <div className="order-1 lg:order-2">
              <div className="relative rounded-2xl lg:rounded-3xl overflow-hidden shadow-lg">
                {/* Main Image */}
                <div className="relative aspect-[4/3] sm:aspect-[16/12] lg:aspect-[4/3]">
                  <Image
                    src={Japan}
                    alt="Beautiful Italy coastal town with colorful buildings and boats"
                    fill
                    className="object-cover"
                    priority
                  />

                  {/* Gradient Overlay */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(0, 0, 0, 0.00) 60%, rgba(0, 0, 0, 0.60) 100%)",
                    }}
                  />

                  {/* Location Badge */}
                  <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6">
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <span className="text-white text-sm font-medium">
                        Italy
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhereNextSection;

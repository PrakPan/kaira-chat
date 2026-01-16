import React, { useState } from "react";
import Image from "next/image";
import Button from "../common/components/button";
import { Pinned, Japan } from "../assets";
import Link from "next/link";
import useMediaQuery from "../../media";
import TailoredFormMobileModal from "../../modals/TailoredFomrMobile";

const WhereNextSection = () => {
  // Statistics data
  const stats = [
    {
      value: "100K+",
      label: "Happy Travellers & Counting",
    },
    {
      value: "500+",
      label: "Total Tour Destinations",
    },
    {
      value: "4.8",
      label: "Rated By Travellers",
    },
  ];
  const isDesktop = useMediaQuery("(min-width:767px)");
  const [showMoiblePlanner,setShowMobilePlanner] = useState(false);
  
  return (
    <section
      className="py-12 sm:py-16 lg:py-20 px-0 sm:px-4 lg:px-8"
      style={{ backgroundColor: "#FEFFC0" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Content Side */}
            <div className="order-2 lg:order-1"
             style={{ padding: "1rem" }}
            >
              <h2
                className="font-bold text-2xl sm:text-xl lg:text-4xl  leading-tight"
                // style={{ fontSize: "40px" }}
              >
                Where Will You Go Next?&nbsp;
                {isDesktop ? <br /> : null}
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
                {/* <Link href="/new-trip"> */}
                  <Button
                    variant="filled"
                    size="medium"
                    onClick={() => {
                      console.log("Create a Trip Now! clicked");
                      setShowMobilePlanner(true);
                    }}
                    className="!bg-primary-indigo !border-primary-indigo !text-white hover:!bg-primary-indigo/90 !font-medium !text-base !px-6 !py-3 !rounded-lg"
                  >
                    + Create a Trip Now!
                  </Button>
                {/* </Link> */}
              </div>

              {/* Statistics Section */}
              <div className="grid grid-cols-3 gap-4 sm:gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                      {stat.value}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-700 font-medium leading-tight">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Image Side */}
            <div className="order-1 lg:order-2">
              <div className="relative overflow-hidden">
                {/* Main Image */}
                <div className="relative h-[400px] sm:h-[500px] lg:h-[600px]">
                  <Image
                    src={Pinned}
                    alt="Beautiful Italy coastal town with colorful buildings and boats"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TailoredFormMobileModal
        destinationType={"city-planner"}
        onHide={() => {
          setShowMobilePlanner(false);
          // closeTailoredModal(router);
        }}
        show={showMoiblePlanner}
      />
    </section>
  );
};

export default WhereNextSection;

import Image from "next/image";
import { cta } from "../assets";
import Button from "../common/components/button";
import Link from "next/link";
import { useState } from "react";
import TailoredFormMobileModal from "../../modals/TailoredFomrMobile";

const CtaBoardingSection = (props) => {
  const [showTailoredModal,setShowTailoredModal] = useState(false);
  return (
    <section className="w-full py-12 sm:py-16 lg:py-20 px-0 sm:px-4 lg:px-8 bg-white font-inter">
      <div className="max-w-7xl mx-auto">
        <div
          className="relative rounded-2xl overflow-hidden flex items-center justify-center"
          style={{ height: "384px" }}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={cta}
              alt="Travel destination with water and buildings at sunset"
              fill
              className="object-cover"
              priority
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-black/15 to-black/5" />
          </div>

          {/* Content */}
          <div className="relative z-10 text-center max-w-3xl px-6">
            <h2 className="font-bold text-white mb-4 leading-tight text-[32px] md:text-[40px]">
              Let's Turn That Wanderlust Into a{" "}
              <span className="block">Boarding Pass</span>
            </h2>

            <p className="text-sm md:text-base text-white/90 mb-8 leading-relaxed max-w-lg mx-auto">
              We'll take you from "wish you fun" to a perfectly curated
              adventure. All you have to do is show up, grinning like Tarzan!
            </p>

            {/* <Link href="/new-trip"> */}
              <Button
                variant="filled"
                size="medium"
                onClick={() => {
                  console.log("Get Free Travel Consultation clicked");
                  setShowTailoredModal(true);
                }}
                className="!bg-primary-yellow !border-primary-yellow !text-primary-indigo hover:!bg-primary-yellow/90 hover:!text-primary-indigo"
              >
                Plan a Trip Now!
              </Button>
            {/* </Link> */}
          </div>
        </div>
      </div>
       <TailoredFormMobileModal
        destinationType={"city-planner"}
        page_id={props.page_id}
        children_cities={props.children_cities}
        destination={props.destination}
        cities={props.cities}
        onHide={() => {
          setShowTailoredModal(false);
        }}
        show={showTailoredModal}
      />
    </section>
  );
};

export default CtaBoardingSection;

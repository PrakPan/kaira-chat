import Image from "next/image";
import { cta } from "../assets";
import Button from "../common/components/button";

const CtaBoardingSection = () => {
  return (
    <section className="w-full bg-white py-16 px-4 md:px-10 lg:px-20 font-inter">
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
            <h2
              className="font-bold text-white mb-4 leading-tight"
              style={{ fontSize: "40px" }}
            >
              Let's Turn That Wanderlust Into a{" "}
              <span className="block">Boarding Pass</span>
            </h2>

            <p className="text-sm md:text-base text-white/90 mb-8 leading-relaxed max-w-lg mx-auto">
              We'll take you from "wish you fun" to a perfectly curated
              adventure. All you have to do is show up, grinning like Tazan!
            </p>

            <Button
              variant="filled"
              size="medium"
              onClick={() => {
                console.log("Get Free Travel Consultation clicked");
              }}
              className="!bg-primary-yellow !border-primary-yellow !text-primary-indigo hover:!bg-primary-yellow/90 hover:!text-primary-indigo"
            >
              Plan a Trip Now!
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaBoardingSection;

import Image from "next/image";
import { backgroundImage } from "../assets";

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
              src={backgroundImage}
              alt="Travel destination with water and buildings at sunset"
              fill
              className="object-cover"
              priority
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/30" />
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

            <button className="inline-flex items-center justify-center px-8 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-full transition-colors duration-300 text-sm md:text-base">
              Plan a Trip Here
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaBoardingSection;

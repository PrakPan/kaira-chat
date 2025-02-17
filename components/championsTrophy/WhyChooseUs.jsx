import React from "react";
import SwiperCarousel from "../SwiperCarousel";
import media from "../media";
import Image from "next/image";

const WhyChooseUs = () => {
  let isPageWide = media("(min-width: 768px)"); // Targeting md screens

  const features = [
    { id: 1, title: "Premium Match Tickets", description: "Get the best seats to witness every six, wicket, and victory roar!" },
    { id: 2, title: "Luxury Stay & Hospitality", description: "Stay at top-rated hotels with seamless transfers and elite service." },
    { id: 3, title: "Exclusive Fan Events", description: "Meet fellow cricket fanatics, enjoy pre-match parties, and celebrate post-game wins." },
    { id: 4, title: "Immersive City Tours", description: "Explore the vibrant host cities with exclusive guided experiences." },
  ];

  const featureCards = features.map((feature) => (
    <div
      key={feature.id}
      className="bg-white rounded-xl p-6 w-full max-w-sm mx-auto text-left border border-black hover:border-yellow-400 transition-colors"
      style={{
        height: "300px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <h3 className="text-2xl font-bold text-gray-900">0{feature.id}</h3>
      <h4 className="mt-3 text-lg font-semibold text-gray-800">{feature.title}</h4>
      <p className="mt-2 text-gray-600">{feature.description}</p>
    </div>
  ));

  return (
    <div
      className="relative py-2 px-4 overflow-x-visible"
      style={
        isPageWide
          ? { clipPath: "inset(-30% -20% 0px -25%)" } 
          : { }
      }
    >

      {/* Background Images */}
      <div className="absolute inset-0 overflow-x-visible -z-10">
        {isPageWide && <> <Image
          src="https://d31aoa0ehgvjdi.cloudfront.net/media/event/icc-why-choose-us.png"
          className="object-cover absolute -left-[1rem] top-[2rem] md:-left-[7rem] md:-top-[12rem]"
          alt="Tilted Hearts"
          height={400}
          width={600}
          style={{ opacity: "80%" }}
        />

        <Image
          src="https://d31aoa0ehgvjdi.cloudfront.net/media/event/icc-why-choose-us.png"
          className="object-cover absolute -right-[1rem] top-[5rem] md:-right-[7rem] md:top-[4.5rem] rotate-180"
          alt="Tilted Hearts"
          height={300}
          width={800}
          style={{ opacity: "80%" }}
        />
        </>}
      </div>

      <SwiperCarousel
        slidesPerView={isPageWide ? 4 : 1}
        navigationButtons={!isPageWide}
        cards={featureCards}
        pageDots={!isPageWide}
      />
    </div>
  );
};

export default WhyChooseUs;

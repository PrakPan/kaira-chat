import React from "react";
import Image from "next/image.js";

const WhyChooseUs = () => {
  const features = [
    {
      id: 1,
      title: "Premium Match Tickets",
      description:
        "Get the best seats to witness every six, wicket, and victory roar!",
    },
    {
      id: 2,
      title: "Luxury Stay & Hospitality",
      description:
        "Stay at top-rated hotels with seamless transfers and elite service.",
    },
    {
      id: 3,
      title: "Exclusive Fan Events",
      description:
        "Meet fellow cricket fanatics, enjoy pre-match parties, and celebrate post-game wins.",
    },
    {
      id: 4,
      title: "Immersive City Tours",
      description:
        "Explore the vibrant host cities with exclusive guided experiences.",
    },
  ];

  return (
    <div className="relative py-2 px-4">
      {/* Background Images */}
      <Image
        src={`https://d31aoa0ehgvjdi.cloudfront.net/media/event/icc-why-choose-us.png`}
        className="object-fill absolute -left-[1rem] top-[0rem] md:-left-[6rem] md:-top-[6rem]"
        alt="Tilted Hearts"
        height={400}
        width={400}
        style={{
          opacity: "80%",
        }}
      />

      <Image
        src={`https://d31aoa0ehgvjdi.cloudfront.net/media/event/icc-why-choose-us.png`}
        className="object-fill absolute -right-[1rem] top-[35rem] md:-right-[6rem] md:-top-[3rem]"
        alt="Tilted Hearts"
        height={300}
        width={500}
        style={{
          opacity: "80%",
          transform: "scaleX(-1)",
        }}
      />

<div className="container mx-auto grid gap-6 sm:grid-cols-1 md:grid-cols-4 justify-center">
  {features.map((feature) => (
    <div
      key={feature.id}
      className="bg-white rounded-xl p-6 w-full max-w-sm mx-auto text-left border border-black transition-transform transform hover:scale-105 hover:border-yellow-400 hover:border-2 relative hover:shadow-xl"
    >
      <h3 className="text-2xl font-bold text-gray-900">0{feature.id}</h3>
      <h4 className="mt-3 text-lg font-semibold text-gray-800">
        {feature.title}
      </h4>
      <p className="mt-2 text-gray-600">{feature.description}</p>
    </div>
  ))}
</div>

    </div>
  );
};

export default WhyChooseUs;

import React from "react";
import { Japan } from "../assets";
import { DestinationCard } from "../common/components/card";

const PlacesBragSection = () => {
  // Sample destination data - replace with your actual data
  const destinations = [
    {
      id: 1,
      title: "Japan",
      description:
        "Sippin' matcha, chasing cherry blossoms, and vibin' in Tokyo — Japan hits different.",
      image: Japan, // Replace with actual image path
      tags: ["Hidden Gem"],
      gradientOverlay:
        "linear-gradient(178deg, rgba(0, 0, 0, 0.00) 49.92%, rgba(0, 0, 0, 0.70) 98.41%)",
    },
    {
      id: 2,
      title: "Paris",
      description:
        "Croissants, couture, and Eiffel Tower vibes — Paris is your next aesthetic drop.",
      image: Japan, // Replace with actual image path
      tags: ["Trending", "Best for Couples"],
      gradientOverlay:
        "linear-gradient(178deg, rgba(0, 0, 0, 0.00) 49.92%, rgba(0, 0, 0, 0.70) 98.41%)",
    },
    {
      id: 3,
      title: "Maldives",
      description:
        "Sun, sand, and serious main character energy — Maldives is calling!",
      image: Japan, // Replace with actual image path
      tags: ["Under 1 Lakh"],
      gradientOverlay:
        "linear-gradient(178deg, rgba(0, 0, 0, 0.00) 49.92%, rgba(0, 0, 0, 0.70) 98.41%)",
    },
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-24 px-0 sm:px-4 lg:px-8 bg-white">
      <div className="w-full sm:max-w-7xl sm:mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16 px-4 sm:px-0">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6 leading-tight">
            Places You'll Brag About Forever.
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-2 sm:px-0">
            From jaw-dropping landmarks to hidden gems, these are the kind of
            spots that turn into stories, selfies, and serious travel envy.
          </p>
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-9 lg:gap-12 px-2 sm:px-0">
          {destinations.map((destination) => (
            <DestinationCard
              key={destination.id}
              title={destination.title}
              description={destination.description}
              image={destination.image}
              tags={destination.tags}
              gradientOverlay={destination.gradientOverlay}
              onClick={() => {
                console.log(`Clicked on ${destination.title}`);
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlacesBragSection;

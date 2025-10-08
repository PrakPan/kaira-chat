import React from "react";
import ItineraryCard from "./ItineraryCard";
import { Japan, backgroundImage } from "../assets";

const MostLovedItinerariesSection = () => {
  // Sample itinerary data - replace with your actual data
  const itineraries = [
    {
      id: 1,
      title: "Romance & Riviera Escape.",
      route: "Paris(3N) → Nice(3N) → Avignon(1N)",
      price: "₹1,75,000",
      originalPrice: "₹2,25,000",
      discount: "10% off",
      tags: ["Best for Couples", "Romantic"],
      image: [Japan, Japan],
      highlights: [
        "Sunset Cruise along the Riviera.",
        "Beachfront Stroll & Private Dinner. +5",
      ],
    },
    {
      id: 2,
      title: "Alpine Adventures & Cultural Charm.",
      route: "Lyon(2N) → Chamonix(3N) → Annecy(2N)",
      price: "₹1,75,000",
      originalPrice: "₹2,25,000",
      discount: "10% off",
      tags: ["Adventure", "Cultural"],
      image: [Japan, Japan],
      highlights: [
        "Sunset Cruise along the Riviera.",
        "Beachfront Stroll & Private Dinner. +5",
      ],
    },
    {
      id: 3,
      title: "Historic Heart & Countryside Bliss.",
      route: "Paris(3N) → Loire Valley(2N) → Bordeaux(2N)",
      price: "₹1,75,000",
      originalPrice: "₹2,25,000",
      discount: "10% off",
      tags: ["Hidden Gem", "Historical"],
      image: [Japan, Japan],
      highlights: [
        "Sunset Cruise along the Riviera.",
        "Beachfront Stroll & Private Dinner. +5",
      ],
    },
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-24 px-4 sm:px-8 lg:px-16 bg-white">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-[40px] font-bold text-black mb-4 leading-[48px]">
            Our Most Loved Itineraries.
          </h2>
          <p className="text-[#6e757a] text-base max-w-2xl mx-auto leading-6">
            These itineraries are traveler favorites, packed with iconic sights,
            hidden gems, and unforgettable moments in every stop.
          </p>
        </div>

        {/* Itineraries Grid */}
        <div className="flex flex-wrap justify-center gap-6 lg:gap-8">
          <div className="flex w-full gap-6 lg:gap-8 flex-wrap justify-center">
            {itineraries.map((itinerary) => (
              <ItineraryCard
                key={itinerary.id}
                itinerary={itinerary}
                onClick={() => {
                  console.log(`Clicked on ${itinerary.title}`);
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MostLovedItinerariesSection;

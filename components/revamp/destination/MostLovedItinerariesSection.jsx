import React from "react";
import ItineraryCard from "./ItineraryCard";

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
      image:
        "https://s3-alpha-sig.figma.com/img/dfb5/0425/b48d8f32ee2514abeb5fcbc7b5e82700?Expires=1759708800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=W8PO-4H6-VmW1PNXdc2ZU9zmY9JXs2WFxHODQfPPEuD8ESDVmRYeTg06avzAU67ZzpKhBbq9EJcrZA9Jkf6MHkWKNipDcaMrn7LlEHwrv6bxQvNSLLpTd8y7RjxLLI~ekpn3Y1rKRnHy-u0RyjX~v4bvQvZu5D0xFWoyxbAststKuOgdZviRkG0YLLbMADv0P8tOxfrCJIaDEsV~ABiRbQbya9aCh5xy0v9tjZasE5H3C6LR8VX3Vi0NAmARWxZw73pTtRus~vYOzSfnthMqfHYeZ26WRFoPOvgp~AkZsitiaNB~AisQKKbgE8awQzDGbSjdO8FJV~os838fg6MncQ__",
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
      image:
        "https://s3-alpha-sig.figma.com/img/82b9/f3e5/10b321fcbbe901f518eb46f202633cde?Expires=1759708800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=NK3Ch2bruw7zZGmoU0zHgBma4TC8Elly~~Vt4GZUoPvtns1ReX-Cqc-VQwF~2WRZDm7NnYhIlEhuZq7zStbJlgZ5XzB-6tFNAOZy3folAvHhD4b57Z4uaDSUHUSTUZHRG5kDtOkQrbomnmevsxJ5R1nidY1eQCEh5uRRJOcJlQ-6paKdNIjQqJ25d~sF0WzsfHpr5mg-ojiT55GeMfOPEyi0bxygVbLU4jSt38D01chzpExW6yOe3RMchr8LA8EjRjzXPq0u3IT9pm87m5gGcVDG0oxihYe~t4brL3COWqHhbt6MDaAXyaudGX7RxibQo~hBbN0cVkKR0OnGxG1smA__",
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
      image:
        "https://s3-alpha-sig.figma.com/img/9e37/5647/320ecb5a881ae6a228e570271b027071?Expires=1759708800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=a7VngbQxqfbwgxQwr6bPulRY9~kRYpKOUUPVtqgHLJlUZkXi~6b5hORmvdV8t3~bdIozqhMP4vCoNcJjvhJrBgS~6h62kmem-pmXVLqd03NJMiW~7JsSMTC2otcc37Ms~YXTt~75rVtzJeigngI2CB3ly2uyDgHLwQNrsJBVYmM12zq6N3TaWDGlkkVOppoQBhc62ype-mDl12N46ef0udXgC-2xuQOACs1ay5M1sLjkx5j6~mT5wvDIkMc1im8YCqnlme26gJhZgl4jFaJLDWjvvufQxAsM5DC9uqHF-2WL3vP0Wb-X6kxW~jV05fH5DplAQysVq7bUTZZ~xbaeog__",
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
    </section>
  );
};

export default MostLovedItinerariesSection;

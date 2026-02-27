import React, { useEffect, useState } from "react";

interface StartScreenProps {
  onPromptSelect: (prompt: string) => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onPromptSelect }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Stagger mount for entrance animation
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const relaxationTrips = [
    {
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop",
      label: "Beach + Spa vacation",
      prompt: "Help me plan a relaxing beach vacation with spa treatments",
    },
    {
      image:
        "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&h=400&fit=crop",
      label: "Bali relaxation plan",
      prompt:
        "Create a peaceful retreat itinerary for Bali focusing on scenic spots and relaxation",
    },
    {
      image:
        "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop",
      label: "Luxury Spa Retreat",
      prompt:
        "Plan a luxury spa retreat with wellness treatments and ocean views",
    },
  ];

  const adventureTrips = [
    {
      image:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600&h=400&fit=crop",
      label: "Mountain hiking adventure",
      prompt: "Plan an adventure trip with thrilling outdoor activities",
    },
    {
      image:
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&h=400&fit=crop",
      label: "Road trip explorer",
      prompt: "Plan an epic road trip with scenic routes and adventure stops",
    },
    {
      image:
        "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=600&h=400&fit=crop",
      label: "Water sports getaway",
      prompt:
        "Create an adventure itinerary focused on water sports and beach activities",
    },
  ];

  return (
    <div
      className="flex-1 h-full overflow-y-auto bg-white"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <style>{`
        .start-screen-scroll::-webkit-scrollbar { display: none; }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .anim-fade-up {
          animation: fadeSlideUp 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>

      <div className="start-screen-scroll px-6 py-8 mt-2">
        {/* Header */}
        {/* <div
          className="mb-8"
          style={{
            animation: mounted ? "fadeSlideUp 0.45s ease-out 0ms forwards" : "none",
            opacity: mounted ? undefined : 0,
          }}
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-1">
            Where to next?
          </h2>
          <p className="text-sm text-gray-400">
            Tap a card to start planning your perfect trip
          </p>
        </div> */}

        {/* Relaxation & Leisure Trips */}
        <div
          className="mb-10"
          style={{
            animation: mounted ? "fadeSlideUp 0.5s ease-out 80ms forwards" : "none",
            opacity: mounted ? undefined : 0,
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">🏖️</span>
            <h2 className="text-lg font-semibold text-gray-900">
              Relaxation & Leisure
            </h2>
          </div>
          <div
            className="flex gap-3 overflow-x-auto pb-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {relaxationTrips.map((trip, index) => (
              <TripCard
                key={`relaxation-${index}`}
                trip={trip}
                delay={index * 60}
                mounted={mounted}
                onSelect={onPromptSelect}
              />
            ))}
          </div>
        </div>

        {/* Adventure Trips */}
        <div
          style={{
            animation: mounted ? "fadeSlideUp 0.5s ease-out 160ms forwards" : "none",
            opacity: mounted ? undefined : 0,
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">🎒</span>
            <h2 className="text-lg font-semibold text-gray-900">
              Adventure Trips
            </h2>
          </div>
          <div
            className="flex gap-3 overflow-x-auto pb-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {adventureTrips.map((trip, index) => (
              <TripCard
                key={`adventure-${index}`}
                trip={trip}
                delay={160 + index * 60}
                mounted={mounted}
                onSelect={onPromptSelect}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface TripCardProps {
  trip: { image: string; label: string; prompt: string };
  delay: number;
  mounted: boolean;
  onSelect: (prompt: string) => void;
}

const TripCard: React.FC<TripCardProps> = ({ trip, delay, mounted, onSelect }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={() => onSelect(trip.prompt)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative overflow-hidden rounded-2xl flex-shrink-0"
      style={{
        width: "200px",
        height: "250px",
        animation: mounted
          ? `fadeSlideUp 0.5s ease-out ${delay}ms forwards`
          : "none",
        opacity: mounted ? undefined : 0,
        transform: hovered ? "scale(1.03)" : "scale(1)",
        transition: "transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease",
        boxShadow: hovered
          ? "0 12px 32px rgba(0,0,0,0.18)"
          : "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      <img
        src={trip.image}
        alt={trip.label}
        className="w-full h-full object-cover"
        style={{
          transform: hovered ? "scale(1.06)" : "scale(1)",
          transition: "transform 0.4s ease",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.15) 55%, transparent 100%)",
        }}
      />
      <div className="absolute bottom-3 left-3 right-3 text-left">
        <p className="text-white font-semibold text-sm drop-shadow-lg leading-tight">
          {trip.label}
        </p>
        <div
          className="flex items-center gap-1 mt-1 overflow-hidden"
          style={{
            maxHeight: hovered ? "20px" : "0",
            opacity: hovered ? 1 : 0,
            transition: "max-height 0.25s ease, opacity 0.25s ease",
          }}
        >
          <span className="text-white/80 text-xs">Tap to explore</span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeOpacity="0.8"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </button>
  );
};

export default StartScreen;
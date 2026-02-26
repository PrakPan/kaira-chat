import React from "react";

interface StartScreenProps {
  onPromptSelect: (prompt: string) => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onPromptSelect }) => {
 const relaxationTrips = [
  {
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop",
      // Turquoise tropical beach (Maldives-style)
    label: "Beach + Spa vacation",
    prompt: "Help me plan a relaxing beach vacation with spa treatments",
  },
  {
    image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&h=400&fit=crop",
      // Bali jungle infinity pool
    label: "Bali relaxation plan",
    prompt: "Create a peaceful retreat itinerary for Bali focusing on scenic spots and relaxation",
  },
  {
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop",
      // Luxury spa massage setup
    label: "Luxury Spa Retreat",
    prompt: "Plan a luxury spa retreat with wellness treatments and ocean views",
  },
];

const adventureTrips = [
  {
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600&h=400&fit=crop",
      // Mountain hiking at sunrise
    label: "Mountain hiking adventure",
    prompt: "Plan an adventure trip with thrilling outdoor activities",
  },
  {
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&h=400&fit=crop",
      // Scenic road trip through mountains
    label: "Road trip explorer",
    prompt: "Plan an epic road trip with scenic routes and adventure stops",
  },
  {
    image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=600&h=400&fit=crop",
      // Surfing action shot
    label: "Water sports getaway",
    prompt: "Create an adventure itinerary focused on water sports and beach activities",
  },
];


  return (
    <div className="flex-1 overflow-y-auto bg-white pb-16" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      <style>{`
        .start-screen-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="start-screen-scroll px-6 py-8">
        {/* Relaxation & Leisure Trips */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-2xl">🏖️</span>
            <h2 className="text-xl font-semibold text-gray-900">
              Relaxation & Leisure Trips
            </h2>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {relaxationTrips.map((trip, index) => (
              <button
                key={`relaxation-${index}`}
                onClick={() => onPromptSelect(trip.prompt)}
                className="group relative overflow-hidden rounded-2xl flex-shrink-0 hover:scale-[1.02] transition-transform duration-200"
                style={{ width: '200px', height: '250px' }}
              >
                <img
                  src={trip.image}
                  alt={trip.label}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-white font-medium text-base text-left drop-shadow-lg">
                    {trip.label}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Adventure Trips */}
        <div>
          <div className="flex items-center gap-2 mb-5">
            <span className="text-2xl">🎒</span>
            <h2 className="text-xl font-semibold text-gray-900">
              Adventure Trips
            </h2>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {adventureTrips.map((trip, index) => (
              <button
                key={`adventure-${index}`}
                onClick={() => onPromptSelect(trip.prompt)}
                className="group relative overflow-hidden rounded-2xl flex-shrink-0 hover:scale-[1.02] transition-transform duration-200"
                style={{ width: '200px', height: '250px' }}
              >
                <img
                  src={trip.image}
                  alt={trip.label}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-white font-medium text-base text-left drop-shadow-lg">
                    {trip.label}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;
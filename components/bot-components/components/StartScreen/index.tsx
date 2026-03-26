import React, { useEffect, useState } from "react";

interface StartScreenProps {
  onPromptSelect: (prompt: string) => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onPromptSelect }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const imgUrlEndPoint = "https://d31aoa0ehgvjdi.cloudfront.net/";

  // ── P1: Combined section — all 6 cards under one heading ──────────────────
  const allTrips = [
    {
      image:
        "https://d31aoa0ehgvjdi.cloudfront.net/media/website/Beach + Spa vacation.jpg",
      label: "Romantic Beach Escape",
      prompt:
        "Plan a romantic beach trip for 2. Suggest the best destinations — Maldives, Bali, or Goa — for 5–7 nights. Include stay options and things to do as a couple.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1540202404-1b927e27fa8b?w=1600",
      label: "Southeast Asia on a Budget",
      prompt:
        "I want to plan a Southeast Asia trip on a budget. Cover Bali, Thailand, or Vietnam — or a mix. Suggest the best 10–12 day itinerary with approximate costs for flights, stays, and food.",
    },
    {
      image:
        "https://d31aoa0ehgvjdi.cloudfront.net/media/website/Luxury Spa Retreat.jpg",
      label: "Total Unplug — Wellness Retreat",
      prompt:
        "I need a proper digital detox and wellness retreat. Suggest the best options in India or internationally — yoga, spa, nature — where I can completely switch off for 4–6 nights.",
    },
    {
      image:
        "https://d31aoa0ehgvjdi.cloudfront.net/media/website/Mountain hiking adventure.jpg",
      label: "Himalayan Road Trip",
      prompt:
        "Plan a 10-day Himalayan road trip — Spiti or Ladakh, starting from Delhi. I want scenic drives, camping, monasteries, and mountain stays.",
    },
    {
      image:
        "https://d31aoa0ehgvjdi.cloudfront.net/media/website/Road trip explorer.jpg",
      label: "Plan a Road Trip from My City",
      prompt:
        "I want to plan a road trip. Ask me which city I'm starting from and how many days I have — then suggest the best route, stops, and places to stay.",
    },
    {
      image:
        "https://d31aoa0ehgvjdi.cloudfront.net/media/website/Water sports getaway.jpg",
      label: "Water Sports Getaway",
      prompt:
        "Plan a 4-day water sports trip — surfing, kayaking, snorkelling. Goa, Andamans, or Bali. Budget ₹50K for 2.",
    },
  ];

  // ── P2: Trending This April — 3 cards ────────────────────────────────────
  const trendingTrips = [
    {
      image:
        "https://d31aoa0ehgvjdi.cloudfront.net/media/website/La-Tomatina-01.jpg",
      label: "Spain 🇪🇸 — La Tomatina",
      sublabel: "Book early — festival in August",
      prompt:
        "I want to attend La Tomatina in Spain. Help me plan the full trip — flights from India, where to stay near Buñol, and things to do around the festival.",
    },
    {
      image:
        "https://d31aoa0ehgvjdi.cloudfront.net/media/website/Rajasthan Desert Nights.jpg",
      label: "Rajasthan 🏰 — Desert Nights",
      sublabel: "Best before the summer heat",
      prompt:
        "Plan a 4-day Rajasthan trip. Desert camp under the stars in Jaisalmer, camel safari at golden hour, and a heritage hotel stay.",
    },
    {
      image:
        "https://d31aoa0ehgvjdi.cloudfront.net/media/website/Bali.jpg",
      label: "Bali 🇮🇩 — Shoulder Season",
      sublabel: "Fewer crowds, better villa prices",
      prompt:
        "Plan a 7-day Bali trip for April. Rice terraces, uncrowded temple, villa stay, and beach time. What's the best itinerary and budget?",
    },
  ];

  // ── P2: Prompt chips ──────────────────────────────────────────────────────
  const promptChips = [
    {
      label: "✦  Plan a Bali trip, ₹1.2L for 2",
      prompt:
        "Plan a 7-day Bali trip for 2 people. Budget ₹1.2 lakh. Include beaches, temples, and at least one villa stay.",
    },
    {
      label: "✦  Rajasthan desert camp, 4 nights",
      prompt:
        "Plan a 4-night Rajasthan trip. Desert camp in Jaisalmer, camel safari at golden hour, heritage hotel stay.",
    },
    {
      label: "✦  Best beaches in India this April",
      prompt:
        "What are the best beaches in India to visit in April? I prefer fewer crowds. Suggest itinerary options.",
    },
    {
      label: "✦  Surprise me — 4 days, ₹80K",
      prompt:
        "Surprise me with an offbeat trip. 4 days, budget ₹80,000. I like experiences over touristy places.",
    },
  ];

  // ── P2: What Kaira Does strip ─────────────────────────────────────────────
  const kairaSteps = [
    {
      icon: "✈",
      label: "Tell Kaira where",
      text: "Your destination, dates, budget — or just your vibe.",
    },
    {
      icon: "🗺",
      label: "Get a full plan",
      text: "Full itinerary, hotels, flights, and activities — instantly.",
    },
    {
      icon: "⚡",
      label: "Book in 30 seconds",
      text: "Confirm and book your entire trip. No tabs, no comparison sites.",
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
        .chip-btn {
          transition: background 0.18s ease, border-color 0.18s ease, color 0.18s ease, transform 0.18s ease;
        }
        .chip-btn:hover {
          background: #fffbeb;
          border-color: #fbbf24;
          color: #92400e;
          transform: translateY(-1px);
        }
        .chip-btn:active {
          transform: translateY(0);
        }
        .kaira-step {
          transition: background 0.18s ease;
        }
        .kaira-step:hover {
          background: #f9fafb;
        }
      `}</style>

      <div className="start-screen-scroll px-6 py-6 mt-2 space-y-8">

        

        {/* ── P1: From Relaxation to Adventure (combined, all 6 cards) ──────── */}
        <div
          style={{
            animation: mounted ? "fadeSlideUp 0.5s ease-out 140ms forwards" : "none",
            opacity: mounted ? undefined : 0,
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">🌅</span>
            <h2
              className="text-lg font-semibold text-gray-900"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              From Relaxation to Adventure
            </h2>
          </div>
          <div
            className="flex gap-3 overflow-x-auto pb-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {allTrips.map((trip, index) => (
              <TripCard
                key={`all-${index}`}
                trip={trip}
                delay={140 + index * 50}
                mounted={mounted}
                onSelect={onPromptSelect}
              />
            ))}
          </div>
        </div>

        {/* ── P2: Trending This April 🔥 ───────────────────────────────────── */}
        <div
          style={{
            animation: mounted ? "fadeSlideUp 0.5s ease-out 300ms forwards" : "none",
            opacity: mounted ? undefined : 0,
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">🔥</span>
            <h2
              className="text-lg font-semibold text-gray-900"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Trending This April
            </h2>
          </div>
          <div
            className="flex gap-3 overflow-x-auto pb-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {trendingTrips.map((trip, index) => (
              <TrendingCard
                key={`trending-${index}`}
                trip={trip}
                delay={300 + index * 50}
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

// ── TripCard (unchanged behaviour, updated data flows through) ──────────────
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
      className="group relative overflow-hidden rounded-2xl flex-shrink-0 max-w-[250px] aspect-[200/217]"
      style={{
        animation: mounted
          ? `fadeSlideUp 0.5s ease-out ${delay}ms forwards`
          : "none",
        opacity: mounted ? undefined : 0,
        transform: hovered ? "scale(1.03)" : "scale(1)",
        transition:
          "transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease",
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

// ── TrendingCard — wider card with sublabel badge ──────────────────────────
interface TrendingCardProps {
  trip: { image: string; label: string; sublabel: string; prompt: string };
  delay: number;
  mounted: boolean;
  onSelect: (prompt: string) => void;
}

const TrendingCard: React.FC<TrendingCardProps> = ({
  trip,
  delay,
  mounted,
  onSelect,
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={() => onSelect(trip.prompt)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative overflow-hidden rounded-2xl flex-shrink-0 max-w-[250px] aspect-[200/217]"
      style={{
        animation: mounted
          ? `fadeSlideUp 0.5s ease-out ${delay}ms forwards`
          : "none",
        opacity: mounted ? undefined : 0,
        transform: hovered ? "scale(1.03)" : "scale(1)",
        transition:
          "transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease",
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
            "linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)",
        }}
      />

    <div
  className="absolute top-3 left-2 flex items-center justify-center gap-[6px] px-[6px] py-[4px] rounded-[26px] text-[10px] font-medium leading-[14px]"
  style={{
    background: "#F7E700",
    color: "#07213A",
    fontFamily: "Inter",
  }}
>
  {trip.sublabel}
</div>

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
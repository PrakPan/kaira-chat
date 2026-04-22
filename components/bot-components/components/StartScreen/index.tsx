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
        "https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=1600",
      label: "Japan — Summer Season",
      tags: "Premium · Honeymoon",
      prompt:
        "Plan a summer trip to Japan for 2 people in July or August. I want to see Mount Fuji at dawn, experience Kyoto's Gion Matsuri festival, feel Tokyo's Shibuya energy, and explore Osaka's food alleys. Suggest the best 10-day itinerary, stays, and budget.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1600",
      label: "Greece — Island Hopping",
      tags: "Iconic · Couples",
      prompt:
        "Plan a Greek islands trip for a couple. I want Santorini sunsets, Mykonos beaches, the Athens Acropolis, and ferry rides between the islands. Suggest the best 10-day itinerary with stays and budget.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1600",
      label: "Australia & New Zealand",
      tags: "Adventure · Scenic",
      prompt:
        "Plan an Australia and New Zealand trip. Include Sydney Harbour, the Great Barrier Reef, Queenstown mountains, and Milford Sound fjords. Suggest the best itinerary across both countries, stays, and budget.",
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

  // ── TTW Running Campaign Themes — 6 cards ────────────────────────────────
  const campaignThemes = [
    {
      image:
        "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600",
      label: "Perfect Proposals",
      sublabel: "Say Yes Spots",
      prompt:
        "I am planning a marriage proposal trip. Suggest the most romantic destinations — international or India — with a beautiful setting, ideas to make it memorable, and where to stay. Budget is flexible.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1600",
      label: "Honeymoon Trip Planner",
      sublabel: "Romantic Escapes",
      prompt:
        "Plan a honeymoon trip for 2. Ask me our preferred vibe — beach, mountains, Europe, or Southeast Asia — and our budget, then suggest the best destination and a full itinerary.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600",
      label: "Road Trips 2025",
      sublabel: "Drive Diaries",
      prompt:
        "I want to plan a road trip. Ask me where I am based and how many days I have — then suggest the best route with stops, stays, and driving distances.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1600",
      label: "Europe Under Rs 1 Lakh",
      sublabel: "Big Trips, Small Budget",
      prompt:
        "I want to plan a Europe trip under Rs 1 lakh. Which countries are most budget-friendly? Suggest a 10 to 12 day itinerary with flights, stays, and transport all within budget.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=1600",
      label: "Japan in Autumn",
      sublabel: "Golden Gateways",
      prompt:
        "Plan a 10-day Japan trip for autumn. I want to see the fall foliage, visit Tokyo and Kyoto, experience local food culture, and stay in a mix of hotels and a ryokan. Suggest the best itinerary and budget.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1600",
      label: "The Great Migration — Kenya",
      sublabel: "Wildlife Bucket List",
      prompt:
        "I want to see the Great Migration in Kenya. When is the best time, which lodges are worth it, and what does a full Kenya safari trip cost for an Indian traveller? Plan it for me.",
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
  className="flex-1 h-full overflow-y-auto bg-white pb-16"
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

        {/* ── TTW's Trending Themes — 6 campaign cards ─────────────────────── */}
        <div
          style={{
            animation: mounted ? "fadeSlideUp 0.5s ease-out 460ms forwards" : "none",
            opacity: mounted ? undefined : 0,
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">🎯</span>
            <h2
              className="text-lg font-semibold text-gray-900"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              TTW's Trending Themes
            </h2>
          </div>
          <div
            className="flex gap-3 overflow-x-auto pb-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {campaignThemes.map((trip, index) => (
              <TrendingCard
                key={`theme-${index}`}
                trip={trip}
                delay={460 + index * 50}
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
  trip: { image: string; label: string; prompt: string; tags?: string };
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
      className="group relative overflow-hidden rounded-2xl flex-shrink-0 max-w-[180px] md:max-w-[250px] aspect-[200/217]"
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
      {trip.tags && (
        <div
          className="absolute top-3 left-2 flex items-center justify-center gap-[6px] px-[8px] py-[4px] rounded-[26px] text-[10px] font-medium leading-[14px]"
          style={{
            background: "rgba(255,255,255,0.92)",
            color: "#07213A",
            fontFamily: "Inter",
            backdropFilter: "blur(6px)",
          }}
        >
          {trip.tags}
        </div>
      )}
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
      className="group relative overflow-hidden rounded-2xl flex-shrink-0 max-w-[180px] md:max-w-[250px] aspect-[200/217]"
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
  className="max-ph:hidden absolute top-3 left-2 flex items-center justify-center gap-[6px] px-[6px] py-[4px] rounded-[26px] text-[10px] font-medium leading-[14px]"
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
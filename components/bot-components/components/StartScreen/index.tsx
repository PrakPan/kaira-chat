import React, { useEffect, useState } from "react";
import travellerStories from "../../../../data/travellerStories";
import type { ThemeConfig } from "../../types/themeConfig";

export interface TravellerStory {
  id: number;
  name: string;
  tripName: string;
  duration: string;
  groupType: string;
  destinations: string[];
  image: string;
  images?: string[];
  shortDescription: string;
  viewItineraryLink: string;
  rating: number;
  prompt: string;
}

interface StartScreenProps {
  onPromptSelect: (prompt: string) => void;
  onTravellerStorySelect?: (story: TravellerStory) => void;
  themeConfig?: ThemeConfig;
}

const StartScreen: React.FC<StartScreenProps> = ({
  onPromptSelect,
  onTravellerStorySelect,
  themeConfig,
}) => {
  const [mounted, setMounted] = useState(false);
  const [activeStoryId, setActiveStoryId] = useState<number | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const imgUrlEndPoint = "https://d31aoa0ehgvjdi.cloudfront.net/";

  // ── P1: Combined section — all 6 cards under one heading ──────────────────
 const defaultAllTrips = [
  {
    image: "https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=1600",
    label: "Japan — Summer Season",
    tags: "Premium · Honeymoon",
    description: "Fuji, Kyoto, Gion. All of it.",
    prompt: "Plan a summer trip to Japan for 2 people in July or August. I want to see Mount Fuji at dawn, experience Kyoto's Gion Matsuri festival, feel Tokyo's Shibuya energy, and explore Osaka's food alleys. Suggest the best 10-day itinerary, stays, and budget.",
  },
  {
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1600",
    label: "Greece — Island Hopping",
    tags: "Iconic · Couples",
    description: "Sunsets, ferries, and blue domes.",
    prompt: "Plan a Greek islands trip for a couple. I want Santorini sunsets, Mykonos beaches, the Athens Acropolis, and ferry rides between the islands. Suggest the best 10-day itinerary with stays and budget.",
  },
  {
    image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1600",
    label: "Australia & New Zealand",
    tags: "Adventure · Scenic",
    description: "Two countries. Infinite landscapes.",
    prompt: "Plan an Australia and New Zealand trip. Include Sydney Harbour, the Great Barrier Reef, Queenstown mountains, and Milford Sound fjords. Suggest the best itinerary across both countries, stays, and budget.",
  },
  {
    image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/Mountain hiking adventure.jpg",
    label: "Himalayan Road Trip",
    description: "Monasteries, mountains, and open roads.",
    prompt: "Plan a 10-day Himalayan road trip — Spiti or Ladakh, starting from Delhi. I want scenic drives, camping, monasteries, and mountain stays.",
  },
  {
    image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/Road trip explorer.jpg",
    label: "Plan a Road Trip from My City",
    description: "Your city. Your route. Let's go.",
    prompt: "I want to plan a road trip. Ask me which city I'm starting from and how many days I have — then suggest the best route, stops, and places to stay.",
  },
  {
    image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/Water sports getaway.jpg",
    label: "Water Sports Getaway",
    description: "Surf, snorkel, kayak. Repeat.",
    prompt: "Plan a 4-day water sports trip — surfing, kayaking, snorkelling. Goa, Andamans, or Bali. Budget ₹50K for 2.",
  },
];

  // ── P2: Trending This April — 3 cards ────────────────────────────────────
 const defaultTrendingTrips = [
  {
    image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/La-Tomatina-01.jpg",
    label: "Spain 🇪🇸 — La Tomatina",
    sublabel: "Book early — festival in August",
    description: "Tomatoes, chaos, and pure joy.",
    prompt: "I want to attend La Tomatina in Spain. Help me plan the full trip — flights from India, where to stay near Buñol, and things to do around the festival.",
  },
  {
    image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/Rajasthan Desert Nights.jpg",
    label: "Rajasthan 🏰 — Desert Nights",
    sublabel: "Best before the summer heat",
    description: "Stars above. Sand below. Magic.",
    prompt: "Plan a 4-day Rajasthan trip. Desert camp under the stars in Jaisalmer, camel safari at golden hour, and a heritage hotel stay.",
  },
  {
    image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/Bali.jpg",
    label: "Bali 🇮🇩 — Shoulder Season",
    sublabel: "Fewer crowds, better villa prices",
    description: "Same Bali. Half the tourists.",
    prompt: "Plan a 7-day Bali trip for April. Rice terraces, uncrowded temple, villa stay, and beach time. What's the best itinerary and budget?",
  },
];

  // ── TTW Running Campaign Themes — 6 cards ────────────────────────────────
 const defaultCampaignThemes = [
  {
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600",
    label: "Perfect Proposals",
    sublabel: "Say Yes Spots",
    description: "Say yes in the right place.",
    prompt: "I am planning a marriage proposal trip. Suggest the most romantic destinations — international or India — with a beautiful setting, ideas to make it memorable, and where to stay. Budget is flexible.",
  },
  {
    image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1600",
    label: "Honeymoon Trip Planner",
    sublabel: "Romantic Escapes",
    description: "Romance, curated for two.",
    prompt: "Plan a honeymoon trip for 2. Ask me our preferred vibe — beach, mountains, Europe, or Southeast Asia — and our budget, then suggest the best destination and a full itinerary.",
  },
  {
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600",
    label: "Road Trips 2025",
    sublabel: "Drive Diaries",
    description: "Your route. Your rules.",
    prompt: "I want to plan a road trip. Ask me where I am based and how many days I have — then suggest the best route with stops, stays, and driving distances.",
  },
  {
    image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1600",
    label: "Europe Under Rs 1 Lakh",
    sublabel: "Big Trips, Small Budget",
    description: "Big Europe. Honest budget.",
    prompt: "I want to plan a Europe trip under Rs 1 lakh. Which countries are most budget-friendly? Suggest a 10 to 12 day itinerary with flights, stays, and transport all within budget.",
  },
  {
    image: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=1600",
    label: "Japan in Autumn",
    sublabel: "Golden Gateways",
    description: "Gold leaves. Zero regrets.",
    prompt: "Plan a 10-day Japan trip for autumn. I want to see the fall foliage, visit Tokyo and Kyoto, experience local food culture, and stay in a mix of hotels and a ryokan. Suggest the best itinerary and budget.",
  },
  {
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1600",
    label: "The Great Migration — Kenya",
    sublabel: "Wildlife Bucket List",
    description: "One million wildebeest. Go.",
    prompt: "I want to see the Great Migration in Kenya. When is the best time, which lodges are worth it, and what does a full Kenya safari trip cost for an Indian traveller? Plan it for me.",
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

  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [atBottom, setAtBottom] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const update = () => {
      const overflow = el.scrollHeight - el.clientHeight > 8;
      const bottom = el.scrollHeight - el.scrollTop - el.clientHeight < 24;
      setHasOverflow(overflow);
      setAtBottom(bottom);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, []);

  const showScrollHint = hasOverflow && !atBottom;

  // ── Resolved theme-aware data (overridden by themeConfig when provided) ──
  const row1Heading =
    themeConfig?.rows?.row1?.heading ?? "From Relaxation to Adventure";
  const row1Icon = themeConfig?.rows?.row1?.icon ?? "🌅";
  const row1Cards = themeConfig?.rows?.row1?.cards ?? defaultAllTrips;

  const row2Heading =
    themeConfig?.rows?.row2?.heading ?? "Trending This April";
  const row2Icon = themeConfig?.rows?.row2?.icon ?? "🔥";
  const row2Cards = themeConfig?.rows?.row2?.cards ?? defaultTrendingTrips;

  const row3Heading =
    themeConfig?.rows?.row3?.heading ?? "TTW's Trending Themes";
  const row3Icon = themeConfig?.rows?.row3?.icon ?? "🎯";
  const row3Cards = themeConfig?.rows?.row3?.cards ?? defaultCampaignThemes;

  const row4 = themeConfig?.rows?.row4;

  return (
    <div className="relative h-full">
    <div
  ref={scrollRef}
  className="flex-1 h-full overflow-y-auto bg-white pb-16"
  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
>
      <style>{`
        .start-screen-scroll::-webkit-scrollbar { display: none; }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ttwShimmer {
          0%   { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        .ttw-skeleton {
          background: linear-gradient(90deg, #e5e7eb 0%, #f3f4f6 50%, #e5e7eb 100%);
          background-size: 800px 100%;
          animation: ttwShimmer 1.4s linear infinite;
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

      <div className="start-screen-scroll px-6 py-6 mt-2 space-y-8 ">

        {/* ── Traveller Stories ───────────────────────────────────────────── */}
        <div
          style={{
            animation: mounted ? "fadeSlideUp 0.5s ease-out 40ms forwards" : "none",
            opacity: mounted ? undefined : 0,
            background: "#F1F5FF",
          }}
          className="rounded-[24px] py-3 pl-3 pr-0"
        >
          <div className="flex items-center gap-2 mb-3">
            <h2
              className="text-[14px] font-semibold text-[#1F4AAF]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Traveller Stories
            </h2>
          </div>
          <div
            className="flex gap-3 overflow-x-auto pb-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {travellerStories.map((story, index) => (
              <TravellerStoryCard
                key={`story-${story.id}`}
                story={story as TravellerStory}
                delay={60 + index * 50}
                mounted={mounted}
                active={activeStoryId === story.id}
                onSelect={(s) => {
                  setActiveStoryId(s.id);
                  if (onTravellerStorySelect) {
                    onTravellerStorySelect(s);
                  } else {
                    // Mobile/inspiration context — no detail-view handler is
                    // wired here, so route the user into the chat using the
                    // story's prompt. This closes the inspiration sheet and
                    // flips isChatActive so the chat panel takes over.
                    onPromptSelect(s.prompt);
                  }
                }}
              />
            ))}
          </div>
        </div>

        {/* ── P1: From Relaxation to Adventure (combined, all 6 cards) ──────── */}
        <div
          style={{
            animation: mounted ? "fadeSlideUp 0.5s ease-out 140ms forwards" : "none",
            opacity: mounted ? undefined : 0,
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">{row1Icon}</span>
            <h2
              className="text-lg font-semibold text-gray-900"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {row1Heading}
            </h2>
          </div>
          <div
            className="flex gap-3 overflow-x-auto pb-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {row1Cards.map((trip, index) => (
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
            <span className="text-xl">{row2Icon}</span>
            <h2
              className="text-lg font-semibold text-gray-900"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {row2Heading}
            </h2>
          </div>
          <div
            className="flex gap-3 overflow-x-auto pb-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {row2Cards.map((trip, index) => (
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
            <span className="text-xl">{row3Icon}</span>
            <h2
              className="text-lg font-semibold text-gray-900"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {row3Heading}
            </h2>
          </div>
          <div
            className="flex gap-3 overflow-x-auto pb-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {row3Cards.map((trip, index) => (
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

        {/* ── Optional Row 4 — themed activity row ─────────────────────────── */}
        {row4 && (
          <div
            style={{
              animation: mounted ? "fadeSlideUp 0.5s ease-out 620ms forwards" : "none",
              opacity: mounted ? undefined : 0,
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              {row4.icon && <span className="text-xl">{row4.icon}</span>}
              <h2
                className="text-lg font-semibold text-gray-900"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {row4.heading}
              </h2>
            </div>
            <div
              className="flex gap-3 overflow-x-auto pb-2"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {row4.cards.map((trip, index) => (
                <TripCard
                  key={`row4-${index}`}
                  trip={trip}
                  delay={620 + index * 50}
                  mounted={mounted}
                  onSelect={onPromptSelect}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>

      {/* Bottom scroll hint — fades away once the user reaches the end. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 right-0 bottom-0 flex flex-col items-center justify-end pb-2"
        style={{
          height: 72,
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) 60%, #fff 100%)",
          opacity: showScrollHint ? 1 : 0,
          transition: "opacity 0.2s ease",
        }}
      >
        <div
          className="flex items-center gap-1 text-[11px] text-gray-500 font-medium"
          style={{ animation: "startScreenBounce 1.4s ease-in-out infinite" }}
        >
          <span>Scroll for more</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
        <style>{`
          @keyframes startScreenBounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(3px); }
          }
        `}</style>
      </div>
    </div>
  );
};

// ── TripCard (unchanged behaviour, updated data flows through) ──────────────
interface TripCardProps {
  trip: { image: string; label: string; prompt: string; tags?: string; description?: string };
  delay: number;
  mounted: boolean;
  onSelect: (prompt: string) => void;
}

const TripCard: React.FC<TripCardProps> = ({ trip, delay, mounted, onSelect }) => {
  const [hovered, setHovered] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <button
      onClick={() => onSelect(trip.prompt)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative overflow-hidden rounded-2xl flex-shrink-0 max-w-[180px] md:max-w-[240px] aspect-[240/244]"
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
      {!imgLoaded && (
        <div className="ttw-skeleton absolute inset-0" aria-hidden="true" />
      )}
      <img
        src={trip.image}
        alt={trip.label}
        loading="lazy"
        onLoad={() => setImgLoaded(true)}
        onError={() => setImgLoaded(true)}
        className="w-full h-full object-cover"
        style={{
          transform: hovered ? "scale(1.06)" : "scale(1)",
          transition: "transform 0.4s ease, opacity 0.3s ease",
          opacity: imgLoaded ? 1 : 0,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: imgLoaded
            ? "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.15) 55%, transparent 100%)"
            : "transparent",
        }}
      />
      {imgLoaded && trip.tags && (
        <div
          className="absolute top-3 left-2 flex items-center justify-center gap-[6px] px-[8px] py-[4px] rounded-[26px] text-[10px] font-medium leading-[14px]"
          // style={{
          //   background: "rgba(255,255,255,0.92)",
          //   color: "#07213A",
          //   fontFamily: "Inter",
          //   backdropFilter: "blur(6px)",
          // }}
           style={{
    background: "#F7E700",
    color: "#07213A",
    fontFamily: "Inter",
  }}
        >
          {trip.tags}
        </div>
      )}
      {imgLoaded && (
        <div className="absolute bottom-3 left-3 right-3 text-left" >
          <p className="text-white font-semibold text-sm drop-shadow-lg leading-tight" >
            {trip.label}
          </p>
          {trip.description && (
            <p className="text-white/85 text-[11px] mt-1 leading-snug drop-shadow-md line-clamp-2">
              {trip.description}
            </p>
          )}
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
      )}
    </button>
  );
};

// ── TrendingCard — wider card with sublabel badge ──────────────────────────
interface TrendingCardProps {
  trip: { image: string; label: string; sublabel: string; prompt: string,description?: string };
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
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <button
      onClick={() => onSelect(trip.prompt)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative overflow-hidden rounded-2xl flex-shrink-0 max-w-[180px] md:max-w-[240px] aspect-[240/244]"
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
      {!imgLoaded && (
        <div className="ttw-skeleton absolute inset-0" aria-hidden="true" />
      )}
      <img
        src={trip.image}
        alt={trip.label}
        loading="lazy"
        onLoad={() => setImgLoaded(true)}
        onError={() => setImgLoaded(true)}
        className="w-full h-full object-cover"
        style={{
          transform: hovered ? "scale(1.06)" : "scale(1)",
          transition: "transform 0.4s ease, opacity 0.3s ease",
          opacity: imgLoaded ? 1 : 0,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: imgLoaded
            ? "linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)"
            : "transparent",
        }}
      />

    {imgLoaded && (
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
    )}

      {imgLoaded && (
      <div className="absolute bottom-3 left-3 right-3 text-left">
        <p className="text-white font-semibold text-sm drop-shadow-lg leading-tight">
          {trip.label}
        </p>
        {trip.description && (
  <p className="text-white/85 text-[11px] mt-1 leading-snug drop-shadow-md line-clamp-1">
    {trip.description}
  </p>
)}
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
      )}
    </button>
  );
};

// ── TravellerStoryCard — Design matches the reference screenshot ───────────
interface TravellerStoryCardProps {
  story: TravellerStory;
  delay: number;
  mounted: boolean;
  active: boolean;
  onSelect: (story: TravellerStory) => void;
}

const TravellerStoryCard: React.FC<TravellerStoryCardProps> = ({
  story,
  delay,
  mounted,
  active,
  onSelect,
}) => {
  const [hovered, setHovered] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const headline = `${story.name} did ${story.destinations.join(", ")} in ${story.duration}`;

  return (
    <button
      onClick={() => onSelect(story)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative flex-shrink-0 rounded-[24px] text-left bg-white overflow-hidden"
      style={{
        width: 240,
        border: active ? "2px solid #2563eb" : "1px solid transparent",
        animation: mounted
          ? `fadeSlideUp 0.5s ease-out ${delay}ms forwards`
          : "none",
        opacity: mounted ? undefined : 0,
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        transition:
          "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
        boxShadow: hovered
          ? "0 12px 28px rgba(0,0,0,0.14)"
          : "0 4px 12px rgba(0,0,0,0.08)",
      }}
    >
      <div className="relative w-full p-2.5" style={{ aspectRatio: "16/11" }}>
        {!imgLoaded && (
          <div
            className="ttw-skeleton absolute rounded-[24px]"
            style={{ inset: 10 }}
            aria-hidden="true"
          />
        )}
        <img
          src={story.image}
          alt={story.tripName}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgLoaded(true)}
          className="w-full h-full object-cover rounded-[24px]"
          style={{
            opacity: imgLoaded ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        />
      </div>
      <div className="p-2.5">
        {imgLoaded ? (
          <>
            <p
              className="text-[13px] font-semibold text-[#07213A] leading-snug mb-0"
              style={{
                fontFamily: "'Inter', sans-serif",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                minHeight: 34,
              }}
            >
              {headline}
            </p>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-1 text-[11px] text-[#07213A]">
                <span className="font-medium">{story.rating.toFixed(1)}</span>
                <span style={{ color: "#F7B500" }}>★</span>
              </div>
              <span
                className="px-2 py-[2px] rounded-full text-[10px] font-medium"
                style={{
                  background: "#FCE7F3",
                  color: "#9D174D",
                  fontFamily: "Inter",
                }}
              >
                {story.groupType} Trip
              </span>
            </div>
          </>
        ) : (
          <>
            <div
              className="ttw-skeleton rounded-md"
              style={{ height: 12, width: "92%", marginBottom: 6 }}
              aria-hidden="true"
            />
            <div
              className="ttw-skeleton rounded-md"
              style={{ height: 12, width: "70%" }}
              aria-hidden="true"
            />
            <div className="flex items-center justify-between mt-2">
              <div
                className="ttw-skeleton rounded-md"
                style={{ height: 10, width: 32 }}
                aria-hidden="true"
              />
              <div
                className="ttw-skeleton rounded-full"
                style={{ height: 14, width: 70 }}
                aria-hidden="true"
              />
            </div>
          </>
        )}
      </div>
    </button>
  );
};

export default StartScreen;
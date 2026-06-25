import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import PackageCard from "./PackageCard";
import MobileCardCarousel from "./MobileCardCarousel";
import useMediaQuery from "../../../hooks/useMedia";
import styles from "./LuxuryEuropeDestinations.module.scss";

/*
 * "Ready-made trips, fully tailored" — the connected-trips packages section.
 *
 * Cards are rendered by the shared <PackageCard> (PackageCard.jsx),
 * which is also used by MyTripsSection. To swap content, pass `packages`
 * + optional `filters`. Each package follows the shape:
 *
 *   { id, image,
 *     tier?: string, tierVariant?: 'default' | 'premium' | 'popular',
 *     route: ['Mumbai', 'Ubud', ...],
 *     title: string | ReactNode,
 *     includes: string[],
 *     price: { amount, per },
 *     category: 'honeymoon' | 'family' | 'adventure' | 'quick' | 'premium',
 *     seed?: string }
 */

const DEFAULT_FILTERS = [
  { key: "all", label: "All" },
  { key: "honeymoon", label: "💍 Honeymoon" },
  { key: "family", label: "👨‍👩‍👧 Family" },
  { key: "adventure", label: "⛰ Adventure" },
  { key: "quick", label: "🏝 Quick Escape" },
  { key: "premium", label: "✨ Premium" },
];

const DEFAULT_PACKAGES = [
  /* ---------------- Honeymoon ---------------- */
  {
    id: "bali-honeymoon",
    image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/real-trips/bali1.png",
    tier: "Most booked",
    tierVariant: "popular",
    route: ["Mumbai", "Ubud", "Nusa Penida", "Seminyak"],
    title: (
      <>
        Bali, the <span className="ttwSerif">slow honeymoon</span>
      </>
    ),
    includes: ["Flights", "4-star villas", "Private transfers", "Candle-lit dinner"],
    price: { amount: "₹59,000", per: "/ person" },
    category: "honeymoon",
    seed: "Bali honeymoon, 7 nights, premium",
  },
  {
    id: "paris-honeymoon",
    image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/real-trips/paris1.jpg",
    tier: "Iconic",
    route: ["Delhi", "Paris"],
    title: (
      <>
        Paris, <span className="ttwSerif">just the two of you</span>
      </>
    ),
    includes: ["Flights", "Boutique hotel", "Seine dinner cruise", "Louvre skip-the-line"],
    price: { amount: "₹1,24,000", per: "/ person" },
    category: "honeymoon",
    seed: "Paris honeymoon, 6 nights",
  },
  {
    id: "maldives-honeymoon",
    image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/real-trips/maldives1.png",
    tier: "Premium",
    tierVariant: "premium",
    route: ["Mumbai", "Malé"],
    title: (
      <>
        Maldives, <span className="ttwSerif">over-water quiet</span>
      </>
    ),
    includes: ["Flights", "Water villa", "Speedboat transfer", "Sunset cruise"],
    price: { amount: "₹1,45,000", per: "/ person" },
    category: "honeymoon",
    seed: "Maldives honeymoon, 5 nights, water villa",
  },

  /* ---------------- Family ---------------- */
  {
    id: "bali-family",
    image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/real-trips/bali2.jpg",
    tier: "Family-friendly",
    route: ["Bangalore", "Ubud", "Gili T", "Kuta"],
    title: (
      <>
        Bali, <span className="ttwSerif">easy with kids</span>
      </>
    ),
    includes: ["Flights", "Family villas", "Waterbom day", "Rice-field cycle"],
    price: { amount: "₹62,000", per: "/ person" },
    category: "family",
    seed: "Bali family 7 nights",
  },
  {
    id: "dubai-family",
    image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/real-trips/dubai2.jpg",
    tier: "Family-friendly",
    route: ["Delhi", "Dubai"],
    title: (
      <>
        Dubai, <span className="ttwSerif">theme-park days</span>
      </>
    ),
    includes: ["Flights", "City hotel", "Desert safari", "Aquaventure passes"],
    price: { amount: "₹78,000", per: "/ person" },
    category: "family",
    seed: "Dubai family 5 nights",
  },
  {
    id: "singapore-family",
    image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/real-trips/singapore2.jpg",
    tier: "Family-friendly",
    route: ["Mumbai", "Singapore", "Sentosa"],
    title: (
      <>
        Singapore, <span className="ttwSerif">clean and easy</span>
      </>
    ),
    includes: ["Flights", "Central hotel", "Universal Studios", "Gardens by the Bay"],
    price: { amount: "₹84,000", per: "/ person" },
    category: "family",
    seed: "Singapore family 5 nights",
  },
  {
    id: "vietnam-family",
    image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/real-trips/vietnam2.jpg",
    tier: "Family-friendly",
    route: ["Bangalore", "Hanoi", "Hạ Long", "Hoi An"],
    title: (
      <>
        Vietnam, <span className="ttwSerif">slow with kids</span>
      </>
    ),
    includes: ["Flights", "Family rooms", "Junk-boat night", "Lantern-making class"],
    price: { amount: "₹68,000", per: "/ person" },
    category: "family",
    seed: "Vietnam family 8 days, Hanoi Hoi An Halong",
  },

  /* ---------------- Adventure ---------------- */
  {
    id: "bali-adventure",
    image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/real-trips/bali3.png",
    tier: "Adventure",
    route: ["Mumbai", "Ubud", "Nusa Penida"],
    title: (
      <>
        Bali, the <span className="ttwSerif">volcano-dawn rush</span>
      </>
    ),
    includes: ["Flights", "Surf-town stay", "Mt Batur sunrise trek", "Nusa Penida cliffs"],
    price: { amount: "₹64,000", per: "/ person" },
    category: "adventure",
    seed: "Bali adventure 7 nights, Batur sunrise",
  },
  {
    id: "grindelwald-adventure",
    image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/real-trips/europe3.png",
    tier: "Adventure",
    route: ["Delhi", "Interlaken", "Grindelwald", "Lucerne", "Zurich"],
    title: (
      <>
        Grindelwald, <span className="ttwSerif">Alps up close</span>
      </>
    ),
    includes: ["Flights", "Mountain chalets", "Jungfraujoch rail", "Paragliding slot"],
    price: { amount: "₹1,68,000", per: "/ person" },
    category: "adventure",
    seed: "Grindelwald Switzerland adventure, 8 days",
  },

  /* ---------------- Quick escape ---------------- */
  {
    id: "thailand-quick",
    image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/real-trips/thailand4.jpg",
    tier: "Quick escape",
    route: ["Mumbai", "Phuket", "Phi Phi", "Krabi"],
    title: (
      <>
        Thailand, <span className="ttwSerif">long-weekend stretched</span>
      </>
    ),
    includes: ["Flights", "Beachfront stays", "Phi Phi day cruise", "Street-food walk"],
    price: { amount: "₹52,000", per: "/ person" },
    category: "quick",
    seed: "Thailand 6 nights, Bangkok + Phi Phi",
  },
  {
    id: "srilanka-quick",
    image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/real-trips/srilanka4.jpg",
    tier: "Quick escape",
    route: ["Chennai", "Colombo", "Kandy", "Galle"],
    title: (
      <>
        Sri Lanka, <span className="ttwSerif">short and scenic</span>
      </>
    ),
    includes: ["Flights", "Boutique stays", "Hill-country train", "Galle fort walk"],
    price: { amount: "₹46,000", per: "/ person" },
    category: "quick",
    seed: "Sri Lanka 5 nights, Kandy Galle",
  },
  {
    id: "nepal-quick",
    image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/real-trips/nepal4(1).jpg",
    tier: "Quick escape",
    route: ["Delhi", "Kathmandu", "Pokhara"],
    title: (
      <>
        Nepal, <span className="ttwSerif">mountains in five</span>
      </>
    ),
    includes: ["Flights", "Lakeside stay", "Nagarkot sunrise", "Phewa boat ride"],
    price: { amount: "₹38,000", per: "/ person" },
    category: "quick",
    seed: "Nepal 5 nights, Kathmandu Pokhara",
  },

  /* ---------------- Premium ---------------- */
  {
    id: "japan-premium",
    image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/real-trips/japan5.png",
    tier: "Premium",
    tierVariant: "premium",
    route: ["Delhi", "Tokyo", "Hakone", "Kyoto", "Osaka"],
    title: (
      <>
        Japan, the <span className="ttwSerif">neon and quiet</span> mix
      </>
    ),
    includes: ["Flights + JR Pass", "Boutique stays", "1 ryokan night", "Sushi-counter dinner"],
    price: { amount: "₹1,84,000", per: "/ person" },
    category: "premium",
    seed: "Japan 10 days, Tokyo + Kyoto + Osaka, premium",
  },
  {
    id: "europe-premium",
    image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/real-trips/europe5.jpg",
    tier: "Premium",
    tierVariant: "premium",
    route: ["Mumbai", "Paris", "Lucerne", "Rome"],
    title: (
      <>
        Europe, the <span className="ttwSerif">grand three</span>
      </>
    ),
    includes: ["Flights", "4-star hotels", "First-class rail", "City food tours"],
    price: { amount: "₹2,10,000", per: "/ person" },
    category: "premium",
    seed: "Europe 12 days, Paris Switzerland Italy, premium",
  },
  {
    id: "korea-premium",
    image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/real-trips/korea5.jpg",
    tier: "Premium",
    tierVariant: "premium",
    route: ["Delhi", "Seoul", "Busan"],
    title: (
      <>
        Korea, <span className="ttwSerif">Seoul to sea</span>
      </>
    ),
    includes: ["Flights", "Design hotels", "KTX to Busan", "Hanok night"],
    price: { amount: "₹1,52,000", per: "/ person" },
    category: "premium",
    seed: "South Korea 8 days, Seoul Busan, premium",
  },
  {
    id: "turkey-premium",
    image: "https://d31aoa0ehgvjdi.cloudfront.net/media/website/real-trips/turkey5.jpg",
    tier: "Premium",
    tierVariant: "premium",
    route: ["Mumbai", "Istanbul", "Cappadocia", "Antalya"],
    title: (
      <>
        Turkey, <span className="ttwSerif">balloons at dawn</span>
      </>
    ),
    includes: ["Flights", "Cave-suite stay", "Hot-air balloon", "Bosphorus dinner"],
    price: { amount: "₹1,18,000", per: "/ person" },
    category: "premium",
    seed: "Turkey 8 days, Istanbul Cappadocia, premium",
  },
];

const PAGE_SIZE = 4;

const LuxuryEuropeDestinations = ({
  filters = DEFAULT_FILTERS,
  packages = DEFAULT_PACKAGES,
  total = 84,
}) => {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [active, setActive] = useState("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // In the "All" view, show each destination only once (cards share an id
  // prefix per destination, e.g. "bali-honeymoon"/"bali-family" -> "bali"),
  // so Bali/etc. don't repeat. Category tabs are already unique per destination.
  const filtered = useMemo(() => {
    if (active === "all") {
      const seen = new Set();
      return packages.filter((p) => {
        const key = (p.id || "").split("-")[0];
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }
    return packages.filter((p) => p.category === active);
  }, [packages, active]);

  // Only the "All" tab paginates (4 at a time); category tabs show everything.
  // On mobile the cards become a swipeable rail, so show the full set there
  // (no "see more" pagination).
  const visible = isMobile
    ? filtered
    : active === "all"
    ? filtered.slice(0, visibleCount)
    : filtered;
  const canSeeMore =
    !isMobile && active === "all" && visibleCount < filtered.length;

  const handleFilter = (key) => {
    setActive(key);
    setVisibleCount(PAGE_SIZE);
  };

  const renderPackage = (p) => (
    <PackageCard
      key={p.id}
      image={p.image}
      tier={p.tier}
      tierVariant={p.tierVariant}
      route={p.route}
      title={p.title}
      includes={p.includes}
      price={p.price}
      ctaLabel="Tailor in chat"
      onClick={() => router.push(`/chat?seed=${encodeURIComponent(p.seed || "")}`)}
    />
  );

  return (
    <section className={styles.section}>
      <div className="ttwContainer">
        <div className="ttwSectionHead">
          <div className={styles.headLeft}>
            <span className={styles.kicker}>
              <span className={styles.kickerStar}>★</span>
              Connected trips
            </span>
            <h2>
              Kaira-Planned Trips. Yours to <span className="ttwSerif">Personalize.</span>
            </h2>
            <p className="">
              Real routes our travellers loved. Open any trip in chat, change{" "}
              <span className="ttwSerif">dates, hotels, duration</span>,
              anything. Start with the package, end with your perfect holiday.
            </p>
          </div>
          {/* <a href="/connected-trips" className="ttwSectionLink">
            See all {total} packages
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" height={12} width={12}>
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a> */}
        </div>

        <div className={styles.filters}>
          {filters.map((f) => (
            <button
              key={f.key}
              type="button"
              className={`${styles.filter} ${active === f.key ? styles.filterActive : ""}`}
              onClick={() => handleFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {isMobile ? (
          <MobileCardCarousel
            items={visible.map((p) => ({ key: p.id, node: renderPackage(p) }))}
          />
        ) : (
          <div className={styles.grid}>{visible.map(renderPackage)}</div>
        )}

        {canSeeMore && (
          <div className={styles.seeMoreWrap}>
            <button
              type="button"
              className={styles.seeMore}
              onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
            >
              See more trips
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          </div>
        )}

        <p className={styles.footnote}>
          Prices indicative.{" "}
          <span className="ttwSerif">Kaira re-prices live</span> based on your
          dates, travellers, and starting location...{" "}
          {/* <a href="/connected-trips">See how packages work →</a> */}
        </p>
      </div>
    </section>
  );
};

export default LuxuryEuropeDestinations;

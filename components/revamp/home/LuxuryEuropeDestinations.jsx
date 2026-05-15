import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import PackageCard from "./PackageCard";
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
  {
    id: "bali",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80",
    tier: "Most booked",
    tierVariant: "popular",
    route: ["Mumbai", "Ubud", "Seminyak", "Nusa Penida"],
    title: (
      <>
        Bali, the <span className="ttwSerif">slow honeymoon</span>
      </>
    ),
    includes: ["Flights", "4-star villas", "Private transfers", "2 candle-lit dinners"],
    price: { amount: "₹1,18,000", per: "per couple · 7 nights" },
    category: "honeymoon",
    seed: "Bali honeymoon, 7 nights, premium",
  },
  {
    id: "japan",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80",
    tier: "Premium",
    tierVariant: "premium",
    route: ["Delhi", "Tokyo", "Hakone", "Kyoto", "Osaka"],
    title: (
      <>
        Japan, the <span className="ttwSerif">neon and quiet</span> mix
      </>
    ),
    includes: ["Flights + JR Pass", "Boutique stays", "1 ryokan night", "Sushi-counter dinner"],
    price: { amount: "₹1,84,000", per: "per person · 10 nights" },
    category: "premium",
    seed: "Japan 10 days, Tokyo + Kyoto + Osaka, premium",
  },
  {
    id: "vietnam",
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?w=600&q=80",
    tier: "Family-friendly",
    route: ["Bangalore", "Hanoi", "Hạ Long", "Hoi An"],
    title: (
      <>
        Vietnam, <span className="ttwSerif">slow with kids.</span>
      </>
    ),
    includes: ["Flights", "Family rooms", "Junk-boat night", "Lantern-making class"],
    price: { amount: "₹68,000", per: "per person · 8 nights" },
    category: "family",
    seed: "Vietnam family 8 days, Hanoi Hoi An Halong",
  },
  {
    id: "thailand",
    image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=600&q=80",
    tier: "Quick escape",
    route: ["Mumbai", "Bangkok", "Krabi", "Phi Phi"],
    title: (
      <>
        Thailand, <span className="ttwSerif">long-weekend stretched.</span>
      </>
    ),
    includes: ["Flights", "Beachfront stays", "Phi Phi day cruise", "Street-food walk"],
    price: { amount: "₹52,000", per: "per person · 6 nights" },
    category: "quick",
    seed: "Thailand 6 nights, Bangkok + Phi Phi",
  },
];

const LuxuryEuropeDestinations = ({
  filters = DEFAULT_FILTERS,
  packages = DEFAULT_PACKAGES,
  total = 84,
}) => {
  const router = useRouter();
  const [active, setActive] = useState("all");

  const visible = useMemo(() => {
    if (active === "all") return packages;
    return packages.filter((p) => p.category === active);
  }, [packages, active]);

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
              Ready-made trips,{" "}
              <span className="ttwSerif">fully tailored.</span>
            </h2>
            <p className="ttwLede">
              Hand-built routes our travellers actually loved.{" "}
              <span className="ttwSerif">Tweak anything</span> in the chat —
              dates, duration, hotels, the lot. Start at the package, end with
              your trip.
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
              onClick={() => setActive(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className={styles.grid}>
          {visible.map((p) => (
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
              onClick={() =>
                router.push(`/chat?seed=${encodeURIComponent(p.seed || "")}`)
              }
            />
          ))}
        </div>

        <p className={styles.footnote}>
          Prices indicative —{" "}
          <span className="ttwSerif">Kaira re-prices live</span> based on your
          dates.{" "}
          <a href="/connected-trips">See how packages work →</a>
        </p>
      </div>
    </section>
  );
};

export default LuxuryEuropeDestinations;

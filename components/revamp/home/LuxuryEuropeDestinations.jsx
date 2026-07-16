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
 *     url?: string }  // navigated to on click, e.g. "/chat/{itinerary_id}"
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
    image:
      "https://d31aoa0ehgvjdi.cloudfront.net/media/cities/175456211725436902046203613281.jpg",
    tier: "Honeymoon",
    route: ["Ubud", "Kuta"],
    title: "A Bali Affair",
    includes: ["Flights", "2 stays", "3 activities", "Private transfers"],
    price: { amount: "₹77,406", per: "/ person" },
    category: "honeymoon",
    url: "/chat/6b9d80d9-106f-4c28-b63d-62a08b6892a9",
    curated_by: "Muskan Agarwal",
  },
  {
    id: "europe-honeymoon",
    image:
      "https://d31aoa0ehgvjdi.cloudfront.net/media/cities/171118153160943317413330078125.jpg",
    tier: "Honeymoon",
    route: ["Interlaken", "Zurich", "Lucerne", "Paris"],
    title: "The European Daydream",
    includes: ["Flights", "4 stays", "6 activities", "Private transfers"],
    price: { amount: "₹2,32,504", per: "/ person" },
    category: "honeymoon",
    url: "/chat/9c3322ea-4442-4ea5-b054-3149ea6b5bca",
    curated_by: "Somya Singhal",
  },
  {
    id: "thailand-honeymoon",
    image:
      "https://d31aoa0ehgvjdi.cloudfront.net/media/cities/170800579665588593482971191406.jpg",
    tier: "Honeymoon",
    route: ["Pattaya", "Bangkok"],
    title: "Bangkok, Beaches & Bride Vibes",
    includes: ["Flights", "2 stays", "4 activities", "Private transfers"],
    price: { amount: "₹71,496", per: "/ person" },
    category: "honeymoon",
    url: "/chat/42c3a590-631b-48b8-8aa8-e90dba680733",
    curated_by: "Somya Singhal",
  },

  /* ---------------- Family ---------------- */
  {
    id: "vietnam-family",
    image:
      "https://d31aoa0ehgvjdi.cloudfront.net/media/cities/172189564451271438598632812500.jpeg",
    tier: "Family-friendly",
    route: ["Phu Quoc"],
    title: "Phu Quoc Before Forever",
    includes: ["Flights", "1 stay", "5 activities", "Private transfers"],
    price: { amount: "₹66,170", per: "/ person" },
    category: "family",
    url: "/chat/cbcdf64d-fcc7-4c4a-86cc-74b656e3801a",
    curated_by: "Somya Singhal",
  },
  {
    id: "singapore-family",
    image:
      "https://d31aoa0ehgvjdi.cloudfront.net/media/cities/170359716563205981254577636719.jpg",
    tier: "Family-friendly",
    route: ["Singapore", "Kota Kinabalu"],
    title: "FamJam: Singapore x Kota Kinabulu",
    includes: ["Flights", "2 stays", "3 activities", "Private transfers"],
    price: { amount: "₹85,965", per: "/ person" },
    category: "family",
    url: "/chat/62509134-46fd-4bb7-8a8c-b1233957a8a4",
    curated_by: "Somya Singhal",
  },
  {
    id: "malaysia-family",
    image:
      "https://d31aoa0ehgvjdi.cloudfront.net/media/countries/168442089471308898925781250000.jpg",
    tier: "Family-friendly",
    route: ["Kota Kinabalu", "Sandakan"],
    title: "Wild Hearts of Borneo",
    includes: ["Flights", "2 stays", "5 activities", "Private transfers"],
    price: { amount: "₹69,532", per: "/ person" },
    category: "family",
    url: "/chat/b4d2665e-4f0c-42d2-a970-009475118ada",
    curated_by: "Somya Singhal",
  },
  {
    id: "dubai-family",
    image:
      "https://d31aoa0ehgvjdi.cloudfront.net/media/cities/175731712356781172752380371094.jpg",
    tier: "Family-friendly",
    route: ["Dubai"],
    title: "Sky-High – The Dubai Experience",
    includes: ["Flights", "1 stay", "3 activities", "Private transfers"],
    price: { amount: "₹85,262", per: "/ person" },
    category: "family",
    url: "/chat/54bf220e-e80a-48d6-a9fb-f3af570313da",
    curated_by: "Nikhil",
  },

  /* ---------------- Adventure ---------------- */
  {
    id: "bali-adventure",
    image:
      "https://d31aoa0ehgvjdi.cloudfront.net/media/cities/168448423055004620552062988281.jpeg",
    tier: "Adventure",
    route: ["Ubud", "Kuta"],
    title: "Bali Squad Escape",
    includes: ["Flights", "2 stays", "6 activities", "Private transfers"],
    price: { amount: "₹97,146", per: "/ person" },
    category: "adventure",
    url: "/chat/7bc73324-d197-42e6-bccc-77229613f2e5",
    curated_by: "Sarthak Singla",
  },
  {
    id: "thailand-adventure",
    image:
      "https://d31aoa0ehgvjdi.cloudfront.net/media/cities/168553026172950124740600585938.jpeg",
    tier: "Adventure",
    route: ["Krabi", "Phuket"],
    title: "Phuket, Krabi & Chaos",
    includes: ["Flights", "2 stays", "3 activities", "Private transfers"],
    price: { amount: "₹67,208", per: "/ person" },
    category: "adventure",
    url: "/chat/fc85b7b8-1658-470a-bae2-082f2dc50c48",
    curated_by: "Somya Singhal",
  },

  /* ---------------- Quick escape ---------------- */
  {
    id: "vietnam-quick",
    image:
      "https://d31aoa0ehgvjdi.cloudfront.net/media/cities/175862306090730118751525878906.png",
    tier: "Quick escape",
    route: ["Da Nang", "Phu Quoc", "Ho Chi Minh City", "Hanoi"],
    title: "Love, Vietnam",
    includes: ["Flights", "4 stays", "9 activities", "Private transfers"],
    price: { amount: "₹1,25,751", per: "/ person" },
    category: "quick",
    url: "/chat/7b220d7b-9116-4aef-8eb0-0c6437a6ed75",
    curated_by: "Somya Singhal",
  },
  {
    id: "japan-quick",
    image:
      "https://d31aoa0ehgvjdi.cloudfront.net/media/cities/168553079359370756149291992188.jpeg",
    tier: "Quick escape",
    route: ["Tokyo", "Nagoya", "Takayama", "Kanazawa"],
    title: "The Soul of Japan",
    includes: ["4 stays", "3 activities", "Private transfers"],
    price: { amount: "₹2,81,007", per: "/ person" },
    category: "quick",
    url: "/chat/e57f6efa-ac6d-474c-8f56-0009c333136a",
    curated_by: "Somya Singhal",
  },
  {
    id: "malaysia-quick",
    image:
      "https://d31aoa0ehgvjdi.cloudfront.net/media/countries/168442089471308898925781250000.jpg",
    tier: "Quick escape",
    route: ["Kota Kinabalu", "Sandakan"],
    title: "Borneo Calling 🌴",
    includes: ["5 activities", "Private transfers"],
    price: { amount: "₹35,872", per: "/ person" },
    category: "quick",
    url: "/chat/c1a82a79-ea22-4ff7-87e7-585115b95436",
    curated_by: "Vasu",
  },

  /* ---------------- Premium ---------------- */
  {
    id: "singapore-premium",
    image:
      "https://d31aoa0ehgvjdi.cloudfront.net/media/cities/170359716563205981254577636719.jpg",
    tier: "Premium",
    tierVariant: "premium",
    route: ["Singapore"],
    title: "Hello, Singapore",
    includes: ["Flights", "1 stay", "4 activities", "Private transfers"],
    price: { amount: "₹94,196", per: "/ person" },
    category: "premium",
    url: "/chat/b3b273ed-e0f6-4ccb-9419-1cf6ecc9d4ea",
    curated_by: "Somya Singhal",
  },
  {
    id: "europe-premium",
    image:
      "https://d31aoa0ehgvjdi.cloudfront.net/media/countries/176363325915420746803283691406.jpg",
    tier: "Premium",
    tierVariant: "premium",
    route: ["Amsterdam", "Milan", "Florence", "Rome", "Paris"],
    title: "Paris • Amsterdam • Amore ❤️",
    includes: ["Flights", "5 stays", "7 activities", "Private transfers"],
    price: { amount: "₹2,23,914", per: "/ person" },
    category: "premium",
    url: "/chat/19d46d7a-a06f-4561-b5a8-c1e046ea6174",
    curated_by: "Somya Singhal",
  },
  {
    id: "japan-premium",
    image:
      "https://d31aoa0ehgvjdi.cloudfront.net/media/cities/168553079359370756149291992188.jpeg",
    tier: "Premium",
    tierVariant: "premium",
    route: ["Tokyo", "Osaka"],
    title: "Japan Era",
    includes: ["Flights", "2 stays", "3 activities", "Private transfers"],
    price: { amount: "₹1,02,468", per: "/ person" },
    category: "premium",
    url: "/chat/da6c1040-d234-49b0-a88c-75bc64467a74",
    curated_by: "Somya Singhal",
  },
  {
    id: "dubai-premium",
    image:
      "https://d31aoa0ehgvjdi.cloudfront.net/media/cities/175731712356781172752380371094.jpg",
    tier: "Premium",
    tierVariant: "premium",
    route: ["Dubai"],
    title: "Dubai Vibes 🌇",
    includes: ["Flights", "1 stay", "3 activities", "Private transfers"],
    price: { amount: "₹64,995", per: "/ person" },
    category: "premium",
    url: "/chat/15e6f756-c218-4122-8ca0-afb10fa819b7",
    curated_by: "Shubh",
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

  // "All" shows every package (paginated 4 at a time); category tabs filter
  // down to a single category.
  const filtered = useMemo(() => {
    if (active === "all") return packages;
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
      travellers={p.travellers}
      curatedBy={p.curated_by}
      price={p.price}
      ctaLabel="Tailor in chat"
      onClick={() => p.url && router.push(p.url)}
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
              Kaira-Planned Trips. Yours to{" "}
              <span className="ttwSerif">Personalize.</span>
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
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
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

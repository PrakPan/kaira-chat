import { useRouter } from "next/router";
import { KairaAvatar } from "./HeroSection";
import ImageWithSkeleton from "../destination/ImageWithSkeleton";
import styles from "./KairaLovingSection.module.scss";

/*
 * "This month, I'm loving…" — a small editorial slot for Kaira's monthly
 * picks. Both the quote and picks are props so the same component can be
 * reused for any time-bound editorial slot (monthly, seasonal, themed).
 */

const DEFAULT_QUOTE = (
  <>
    &ldquo;September is one of those sweet spots.{" "}
    <span className={styles.quoteHl}>
      Japan is starting to ease into autumn
    </span>
    , while <span className={styles.quoteHl}>Bali is still sunny</span>, warm
    and easy to explore. If I had ten days off right now, these are the two
    trips I&apos;d pick.&rdquo;
  </>
);

const DEFAULT_PICKS = [
  {
    tag: "Kaira's pick · this month",
    title: (
      <>
        Japan, before <span className="ttwSerif">autumn arrives</span>
      </>
    ),
    blurb:
      "Tokyo's neighbourhoods, Kyoto's temples, Hakone's hot springs and a slower side of Japan before the autumn crowds arrive. 9 days, around ₹1.6L per person.",
    img: "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=400&q=80&auto=format",
    seed: "Japan before autumn, 9 days",
    itinerary_id: "5d8f479d-ef11-4c42-bc0c-0a3ee207183e"
  },
  {
    tag: "Kaira's pick · this month",
    title: (
      <>
        Bali, <span className="ttwSerif">sunny days &amp; slow stays</span>
      </>
    ),
    blurb:
      "Ubud's rice terraces, East Bali's quieter coast, beach sunsets and a few days doing absolutely nothing. 8 days, around ₹68K per person.",
    img: "https://images.unsplash.com/photo-1573790387438-4da905039392?w=400&q=80&auto=format",
    seed: "Bali sunny and slow, 8 days",
    itinerary_id: "87337984-6e2a-4b87-8d52-7aa7b4753b5c"
  },
];

const KairaLovingSection = ({
  title,
  quote = DEFAULT_QUOTE,
  picks = DEFAULT_PICKS,
}) => {
  const router = useRouter();

  return (
    <section className={styles.section}>
      <div className="ttwContainer">
        <div className={styles.header}>
          <div className={styles.kMini}>
            <KairaAvatar size="sm" minimal />
          </div>
          <h2 className={styles.headerTitle}>
            {title || (
              <>
                This month, <span className="ttwSerif">I&apos;m loving…</span>
              </>
            )}
          </h2>
        </div>

        <blockquote className={styles.quote}>{quote}</blockquote>

        <div className={styles.picks}>
          {picks.map((p, i) => (
            <a
              key={i}
              className={styles.pick}
              role="button"
              tabIndex={0}
              onClick={() =>
                router.push(`/chat/${p.itinerary_id}`)
              }
              // onKeyDown={(e) => {
              //   if (e.key === "Enter")
              //     router.push(`/chat?seed=${encodeURIComponent(p.seed || "")}`);
              // }}
            >
              <ImageWithSkeleton
                src={p.img}
                asBackground
                className={styles.pickImg}
              />
              <div className={styles.pickBody}>
                <div className={styles.pickTag}>{p.tag}</div>
                <h3 className={styles.pickTitle}>{p.title}</h3>
                <p className={styles.pickBlurb}>{p.blurb}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KairaLovingSection;

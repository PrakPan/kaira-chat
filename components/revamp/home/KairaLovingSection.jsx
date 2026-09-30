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
    &ldquo;October is when the weather starts working in your favour.{" "}
    <span className={styles.quoteHl}>Bali is still sunny</span> and easy to
    slow down in, while{" "}
    <span className={styles.quoteHl}>Dubai is finally cooling down</span>{" "}
    enough to enjoy outdoors. If I had a week off right now, these are the two
    trips I&apos;d pick.&rdquo;
  </>
);

const DEFAULT_PICKS = [
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
  {
    tag: "Kaira's pick · this month",
    title: (
      <>
        Dubai, <span className="ttwSerif">the city is cooling down</span>
      </>
    ),
    blurb:
      "Dubai's skyline, desert sunsets, late-night food spots and plenty of time by the water. October marks the start of the more comfortable season for exploring the city. 6 days, around ₹75K per person.",
    img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&q=80&auto=format",
    seed: "Dubai as the city cools down, 6 days",
    itinerary_id: "91388d5b-046b-48ce-a8ee-65135ac36085"
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
                alt={p.seed}
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

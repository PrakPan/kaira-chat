import { useRouter } from "next/router";
import { KairaAvatar } from "./HeroSection";
import styles from "./KairaLovingSection.module.scss";

/*
 * "This month, I'm loving…" — a small editorial slot for Kaira's monthly
 * picks. Both the quote and picks are props so the same component can be
 * reused for any time-bound editorial slot (monthly, seasonal, themed).
 */

const DEFAULT_QUOTE = (
  <>
    &ldquo;Shoulder season is real.{" "}
    <span className={styles.quoteHl}>April in Japan</span> before the Golden
    Week rush, or{" "}
    <span className={styles.quoteHl}>Vietnam&apos;s dry-season tail</span>.
    Cheaper flights, emptier temples, better photos. Here&apos;s what I&apos;d
    pick if I had ten days off right now.&rdquo;
  </>
);

const DEFAULT_PICKS = [
  {
    tag: "Kaira's pick · this month",
    title: (
      <>
        Japan, the <span className="ttwSerif">shoulder-season</span> way
      </>
    ),
    blurb:
      "Kyoto's last petals, Kanazawa in the quiet, a ryokan night near Hakone. 9 days, around ₹1.6L per person.",
    img: "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=400&q=80&auto=format",
    seed: "Japan shoulder season, 9 days",
    itinerary_id: "c6377b28-8132-4027-a1c0-9ba584dcf0d8"
  },
  {
    tag: "Kaira's pick · this month",
    title: (
      <>
        Vietnam, the <span className="ttwSerif">dry-tail</span> run
      </>
    ),
    blurb:
      "Hoi An before peak heat, a sleeper train north, pho and coffee the way Anh makes them. 8 days, ₹68K per person.",
    img: "https://images.unsplash.com/photo-1555921015-5532091f6026?w=400&q=80&auto=format",
    seed: "Vietnam dry tail end, 8 days",
     itinerary_id: "5d8f479d-ef11-4c42-bc0c-0a3ee207183e"
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
              <div
                className={styles.pickImg}
                style={{ backgroundImage: `url('${p.img}')` }}
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

import { useRouter } from "next/router";
import styles from "./WhereNextSection.module.scss";

/*
 * "Pick a feeling" — the vibes grid.
 * Pass `vibes` to reuse for any destination/theme grid; each vibe is
 *   { pill, caption, image, seed }.
 */

const DEFAULT_VIBES = [
  {
    pill: "Premium · Honeymoon",
    caption: (
      <>
        Japan under <span className="ttwSerif">cherry blossoms</span>
      </>
    ),
    image: "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800&q=80&auto=format",
    seed: "Japan under cherry blossoms, honeymoon",
  },
  {
    pill: "Iconic · Couples",
    caption: (
      <>
        Santorini at <span className="ttwSerif">sunset</span>
      </>
    ),
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=80&auto=format",
    seed: "Santorini sunset, couples",
  },
  {
    pill: "Adventure · Scenic",
    caption: (
      <>
        Sydney and <span className="ttwSerif">the harbour</span>
      </>
    ),
    image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&q=80&auto=format",
    seed: "Sydney and the harbour, scenic",
  },
];

const WhereNextSection = ({ vibes = DEFAULT_VIBES, total = 47 }) => {
  const router = useRouter();

  return (
    <section className={styles.section}>
      <div className="ttwContainer">
        <div className="ttwSectionHead">
          <div>
            <h2>Pick a feeling.</h2>
            <p className="ttwLede">
              From slow-lived honeymoons to{" "}
              <span className="ttwSerif">altitude-sick</span> wins. Every card
              below drops you into a chat, already briefed.
            </p>
          </div>
          {/* <a href="/destinations" className="ttwSectionLink">
            Browse all {total} countries
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" height={12} width={12}>
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a> */}
        </div>

        <div className={styles.grid}>
          {vibes.map((v, i) => (
            <div
              key={i}
              className={styles.card}
              role="button"
              tabIndex={0}
              onClick={() =>
                router.push(`/chat?seed=${encodeURIComponent(v.seed || "")}`)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter")
                  router.push(`/chat?seed=${encodeURIComponent(v.seed || "")}`);
              }}
            >
              <div
                className={styles.img}
                style={{ backgroundImage: `url('${v.image}')` }}
              />
              <span className={styles.pill}>{v.pill}</span>
              <div className={styles.caption}>{v.caption}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhereNextSection;

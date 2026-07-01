"use client";

import Link from "next/link";
import HeadingContent from "./HeadingContent";
import styles from "./HeroSection.module.scss";

/* Reusable Kaira avatar (used in hero, "loving" header, final CTA). */
export const KairaAvatar = ({ size = "lg", minimal = false }) => {
  const sizeClass = size === "sm" ? `${styles.kairaAvatar} ${styles.sm}` : styles.kairaAvatar;
  return (
    <div className={sizeClass}>
      {/* <div className={styles.kairaPlaceholder}>
        <div className={styles.hairBack}></div>
        {!minimal && <div className={styles.hairSide}></div>}
        <div className={styles.head}></div>
        {!minimal && <div className={styles.glasses}></div>}
        {!minimal && <div className={styles.smile}></div>}
        <div className={styles.top}></div>
        {!minimal && (
          <div className={styles.cat}>
            <div className={styles.catEars}></div>
            <div className={styles.catBody}></div>
            <div className={styles.catEyes}></div>
          </div>
        )}
      </div> */}
        <img src="/KairaInsta.jpg" alt="Kaira avatar" width="600" height="600" className={styles.kairaImg} />
    </div>
  );
};

const POLAROIDS = [
  {
    cls: "p1",
    img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=300&q=80&auto=format",
    caption: "Kyoto, 2am ramen",
    url:"/asia/japan/kyoto"
  },
  {
    cls: "p2",
    img: "https://images.unsplash.com/photo-1586500036706-41963de24d8b?w=300&q=80&auto=format",
    caption: "Malé, day 2",
    url:"/asia/maldives/kaafu_atoll/male"
  },
  {
    cls: "p3",
    img: "https://images.unsplash.com/photo-1528127269322-539801943592?w=300&q=80&auto=format",
    caption: "Hoi An at 6am",
    url:"/asia/vietnam"
  },
  {
    cls: "p4",
    img: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=300&q=80&auto=format",
    caption: "Santorini, sunset",
    url:"/europe/greece"
  },
];

const HeroSection = ({ title, subtitle }) => {
  return (
    <section className={styles.heroSection}>
      <div className="ttwContainer">
        <div className={styles.heroGrid}>
          <HeadingContent title={title} subtitle={subtitle} />

          <div className={styles.kairaWrap}>
            {POLAROIDS.map((p) => (
              <div key={p.cls} className={`${styles.polaroid} ${styles[p.cls]}`} onClick={() => window.location.href = p.url}>
                <div
                  className={styles.polaroidImg}
                  style={{ backgroundImage: `url('${p.img}')` }}
                />
                <div className={styles.polaroidCaption}>{p.caption}</div>
              </div>
            ))}

            <KairaAvatar size="lg" />

            <div className={styles.kairaName}>
              <div className={styles.hi}>Hi, I&apos;m Kaira.</div>
              <div className={styles.sub}>
                <span className={styles.dot}></span> online · ~2s reply
              </div>
            </div>

            <Link href="/chat?intake=1" className={styles.kairaCta}>
              Start planning
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

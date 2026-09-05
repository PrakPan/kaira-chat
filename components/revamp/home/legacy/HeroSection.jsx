"use client";

import { heroImages } from "../../assets";
import HeadingContent from "./HeadingContent";
import styles from "./HeroSection.module.scss";

// The hero illustration is one drawing split across 13 SVG layers, each on the
// same 1920×1080 canvas and stacked absolutely (see .foregroundImage). All of
// them are above the fold and all of them are needed for the picture to be
// correct — there is no "extra" layer to drop.
//
// Rendered with plain <img>, not next/image, for two reasons:
//
//  1. next/image did nothing for them. The custom loader (image-loader.js →
//     lib/mediaImage) returns `.svg` untouched by design, so every layer was
//     already being served as the raw webpack asset — no resizing, no
//     re-encoding — while still paying for the component wrapper and 13
//     meaningless `srcset`s on vectors that scale for free.
//
//  2. It was lazy-loading the hero. `priority={index < 2}` marked two layers
//     eager and left the other eleven on next/image's default
//     `loading="lazy"`, so most of the LCP image was deferred and the
//     illustration assembled progressively. Above-the-fold images should never
//     be lazy.
//
// `fetchpriority="high"` stays on the first two — the base map layers that
// cover the most area. The rest load eagerly at default priority rather than
// all competing at high, which would just re-shuffle the same contention.
//
// Explicit width/height carry the intrinsic 16:9 ratio so the box is reserved
// before the bytes land (no layout shift); the CSS above still governs the
// painted size.
const HeroSection = ({ title, subtitle }) => {
  return (
    <section className={styles.heroSection}>
      <HeadingContent title={title} subtitle={subtitle} />
      <div className={styles.backgroundWrapper}>
        {heroImages.map((image, index) => (
          <div key={index} className={styles.foregroundImage}>
            <img
              src={typeof image === "string" ? image : image?.src}
              alt=""
              aria-hidden="true"
              width={1920}
              height={1080}
              decoding="async"
              loading="eager"
              fetchpriority={index < 2 ? "high" : undefined}
            />
          </div>
        ))}
      </div>
      <div className={styles.bottomGreeLine}></div>
    </section>
  );
};

export default HeroSection;

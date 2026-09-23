import React, { useState, useEffect } from "react";
import { optimizedMediaUrl } from "../../../lib/mediaImage";
import styles from "../../../styles/pages/revamp/destination.module.scss";

// Default request width for both branches. The widest real box these cards get
// is a full-bleed card on mobile (~340-410 CSS px at DPR 2-3); on desktop the
// image column is 240px (200px <=1024px). 800 covers both with headroom and
// turns a 4 MB original into ~60-120 KB. Callers with a known box can override.
const DEFAULT_WIDTH = 800;

const ImageWithSkeleton = ({
  src,
  alt = "",
  className,
  style,
  asBackground = false,
  width = DEFAULT_WIDTH,
  children,
}) => {
  const [loaded, setLoaded] = useState(false);

  // alt="" means "decorative, skip me" to screen readers and to Google Images.
  // That is the right value for a scrim or a spacer, and the wrong one for the
  // destination, activity and package photos this component actually renders —
  // every call site relied on the default and the site shipped ~10 unlabelled
  // content images per page (512 of 513 on /blog), which is the whole of Google
  // Images given away for free.
  //
  // Coerced rather than trusted: several callers hold headings that are JSX
  // (KairaLovingSection's `title` is a fragment with a <span> in it), and a
  // non-string here would render alt="[object Object]" — worse than empty.
  const altText = typeof alt === "string" ? alt : "";

  // The URL the browser will actually request, in BOTH branches. Previously the
  // background branch used the raw `src` (bypassing the Serverless Image Handler
  // entirely, so cards shipped 1-4 MB originals) and the <img> branch preloaded
  // the raw `src` while rendering the optimized one — two different URLs, so
  // every card downloaded the original AND the resized copy.
  const resolvedSrc = src ? optimizedMediaUrl(src, { width }) : src;

  useEffect(() => {
    if (!src) {
      setLoaded(true);
      return;
    }
    setLoaded(false);

    // Only the background branch needs a synthetic preload to drive `loaded` —
    // it has no element to hang onLoad on. The <img> branch is driven by the
    // element's own onLoad/onError below, so preloading here would just fetch
    // the same bytes a second time.
    if (!asBackground) return;

    let cancelled = false;
    const img = new window.Image();
    img.src = resolvedSrc;
    if (img.complete) {
      setLoaded(true);
    } else {
      img.onload = () => !cancelled && setLoaded(true);
      img.onerror = () => !cancelled && setLoaded(true);
    }
    return () => {
      cancelled = true;
    };
  }, [src, resolvedSrc, asBackground]);

  if (asBackground) {
    // A CSS background-image is not a document image: screen readers get
    // nothing from it, and Google Images will not index it no matter what we
    // label it. role="img" + aria-label recovers the accessible name; the
    // image-search visibility can only be recovered by rendering these as
    // <img> (worth doing for the destination/activity cards, but that is a
    // layout change, not a prop).
    return (
      <div
        className={className}
        role={altText ? "img" : undefined}
        aria-label={altText || undefined}
        style={{
          ...style,
          backgroundImage: loaded && resolvedSrc ? `url('${resolvedSrc}')` : undefined,
        }}
      >
        {!loaded && <div className={styles.imgSkeleton} aria-hidden />}
        {children}
      </div>
    );
  }

  return (
    <div className={className} style={style}>
      {!loaded && <div className={styles.imgSkeleton} aria-hidden />}
      {src && (
        <img
          src={resolvedSrc}
          alt={altText}
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
          loading="lazy"
          decoding="async"
          style={{
            opacity: loaded ? 1 : 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      )}
      {children}
    </div>
  );
};

export default ImageWithSkeleton;

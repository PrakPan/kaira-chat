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
    return (
      <div
        className={className}
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
          alt={alt}
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

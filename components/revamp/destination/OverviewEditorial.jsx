import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { imgUrlEndPoint } from "../../theme/ThemeConstants";
import { truncateAtSentence } from "../../../helper/truncateAtSentence";
import ImageWithSkeleton from "./ImageWithSkeleton";
import styles from "../../../styles/pages/revamp/destination.module.scss";

const OverviewEditorial = ({
  tag = "Kaira's take",
  kicker,
  image,
  heading,
  text,
  ctaLabel = "Plan my trip",
  onCtaClick,
  maxWords = 200,
}) => {
  const imgColRef = useRef(null);
  const textRef = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);
  const [collapsedHeight, setCollapsedHeight] = useState(null);

  useEffect(() => {
    const measure = () => {
      const imgH = imgColRef.current?.offsetHeight || 0;
      const textH = textRef.current?.scrollHeight || 0;
      setCollapsedHeight(imgH || null);
      setOverflowing(imgH > 0 && textH > imgH + 24);
    };
    measure();

    let ro;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(measure);
      if (imgColRef.current) ro.observe(imgColRef.current);
      if (textRef.current) ro.observe(textRef.current);
    }
    window.addEventListener("resize", measure);
    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [text, image, heading]);

  // Don't render the overview section if there is no overview text.
  if (!text) return null;

  const resolvedImage = image
    ? image.startsWith("http")
      ? image
      : `${imgUrlEndPoint}${image}`
    : "https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80";

  const truncated = truncateAtSentence(String(text), maxWords);
  const paragraphs = truncated
    .split(/\n\s*\n|<br\s*\/?>/i)
    .map((p) => p.trim())
    .filter(Boolean);

  const clampStyle =
    !expanded && overflowing && collapsedHeight
      ? { maxHeight: collapsedHeight, overflow: "hidden" }
      : undefined;

  // Render the heading with its last word in the cursive serif accent.
  const renderHeading = (h) => {
    if (typeof h !== "string") return h;
    const words = h.trim().split(/\s+/);
    if (words.length <= 1) {
      return <span className={styles.serif}>{h}</span>;
    }
    const last = words.pop();
    return (
      <>
        {words.join(" ")} <span className={styles.serif}>{last}</span>
      </>
    );
  };

  return (
    <div className={styles.editorialGrid}>
      <div className={styles.editorialText}>
        {kicker && (
          <div className={styles.editorialKicker}>
            <span className={styles.editorialKickerLine} aria-hidden />
            {kicker}
          </div>
        )}
        {heading && <h3>{renderHeading(heading)}</h3>}
        <div ref={textRef} className={styles.editorialBody} style={clampStyle}>
          {paragraphs.map((p, i) => (
            <p
              key={i}
              className={i === 0 ? styles.editorialLede : undefined}
              dangerouslySetInnerHTML={{ __html: p }}
            />
          ))}
          {!expanded && overflowing && (
            <div className={styles.editorialFade} aria-hidden />
          )}
        </div>
        {overflowing && (
          <button
            type="button"
            className={styles.editorialToggle}
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? "See less" : "See more"}
          </button>
        )}
        {onCtaClick && (
          <button
            type="button"
            className={styles.editorialLink}
            onClick={onCtaClick}
          >
            {ctaLabel}
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        )}
      </div>

      <div ref={imgColRef} className={styles.editorialImgCol}>
        <ImageWithSkeleton
          src={resolvedImage}
          asBackground
          className={styles.editorialImg}
        >
          <div className={styles.editorialImgScrim} aria-hidden />
          {/* {tag && <div className={styles.editorialImgTag}>{tag}</div>} */}
        </ImageWithSkeleton>
      </div>
    </div>
  );
};

export default OverviewEditorial;

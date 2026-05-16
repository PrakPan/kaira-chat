import React from "react";
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
  bylineName = "Kaira",
  bylineSub = "TTW's AI travel planner",
  ctaLabel = "Plan my trip",
  onCtaClick,
  maxWords = 200,
}) => {
  if (!heading && !text && !image) return null;

  const resolvedImage = image
    ? image.startsWith("http")
      ? image
      : `${imgUrlEndPoint}${image}`
    : "https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80";

  const truncated = text ? truncateAtSentence(String(text), maxWords) : "";
  const paragraphs = truncated
    ? truncated
        .split(/\n\s*\n|<br\s*\/?>/i)
        .map((p) => p.trim())
        .filter(Boolean)
    : [];

  return (
    <div className={styles.editorialGrid}>
      <ImageWithSkeleton
        src={resolvedImage}
        asBackground
        className={styles.editorialImg}
      >
        <div className={styles.editorialImgScrim} aria-hidden />
        {tag && <div className={styles.editorialImgTag}>{tag}</div>}
      </ImageWithSkeleton>
      <div className={styles.editorialText}>
        {kicker && (
          <div className={styles.editorialKicker}>
            <span className={styles.editorialKickerLine} aria-hidden />
            {kicker}
          </div>
        )}
        {heading && <h3>{heading}</h3>}
        {paragraphs.length ? (
          paragraphs.map((p, i) => (
            <p
              key={i}
              className={i === 0 ? styles.editorialLede : undefined}
              dangerouslySetInnerHTML={{ __html: p }}
            />
          ))
        ) : null}
        {/* <div className={styles.editorialByline}>
          <div className={styles.editorialBylineAvatar} />
          <div className={styles.editorialBylineText}>
            <b>{bylineName}</b>
            {bylineSub ? ` · ${bylineSub}` : ""}
          </div>
        </div> */}
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
    </div>
  );
};

export default OverviewEditorial;

import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { imgUrlEndPoint } from "../../theme/ThemeConstants";
import ImageWithSkeleton from "./ImageWithSkeleton";
import styles from "../../../styles/pages/revamp/destination.module.scss";

const CountryCardV2 = ({ item, hot = false, onClick }) => {
  if (!item) return null;
  const image = item.image
    ? item.image.startsWith("http")
      ? item.image
      : `${imgUrlEndPoint}${item.image}`
    : "";
  const tag =
    item.tag ||
    (Array.isArray(item.tags) && item.tags[0]) ||
    item.continent ||
    (hot ? "Most popular" : "");
  const bestFor =
  
    item.one_liner_description ||
    item.tagline ||
      item.best_for ||
    item.description ||
    "";
  const name = item.display_name || item.title || item.name || "";
  const meta = [];
  if (item.user_ratings_total || item.trips_count)
    meta.push({
      label: (
        <>
          <b>{item.user_ratings_total || item.trips_count}</b> trips
        </>
      ),
    });
  if (item.from_price)
    meta.push({
      label: (
        <>
          From <b>{item.from_price}</b>
        </>
      ),
    });

  const href = item.path ? "/" + item.path : null;

  const cardInner = (
    <>
      <ImageWithSkeleton
        src={image}
        asBackground
        className={styles.countryCardBg}
      />
      <div className={styles.countryCardShade} />
      {tag && (
        <div
          className={`${styles.countryCardTag}`}
        >
          {tag}
        </div>
      )}
      <div className={styles.countryCardArrow}>
        <FontAwesomeIcon
          icon={faArrowRight}
          style={{ color: "#0b1220", transform: "rotate(-45deg)" }}
        />
      </div>
      <div className={styles.countryCardBody}>
        <h3>
          <span className={styles.serif}>{name}</span>
        </h3>
        {bestFor && (
          <div className={styles.countryCardBestFor}>{bestFor}</div>
        )}
        {meta.length > 0 && (
          <div className={styles.countryCardMeta}>
            {meta.map((m, i) => (
              <span key={i}>{m.label}</span>
            ))}
          </div>
        )}
      </div>
    </>
  );

  // A custom onClick means the caller wants a non-navigation action (e.g. a
  // drawer) — preserve the button behavior in that case.
  if (onClick) {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={() => onClick(item)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onClick(item);
        }}
        className={styles.countryCard}
      >
        {cardInner}
      </div>
    );
  }

  // Otherwise render a real crawlable anchor to the destination (was an
  // onClick + window.location.replace, invisible to crawlers).
  if (href) {
    return (
      <Link href={href} className={styles.countryCard}>
        {cardInner}
      </Link>
    );
  }

  return <div className={styles.countryCard}>{cardInner}</div>;
};

export default CountryCardV2;

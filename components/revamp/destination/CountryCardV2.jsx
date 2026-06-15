import React from "react";
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

  const handleClick = () => {
    if (onClick) return onClick(item);
    if (item.path) window.location.replace("/" + item.path);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleClick();
      }}
      className={styles.countryCard}
    >
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
    </div>
  );
};

export default CountryCardV2;

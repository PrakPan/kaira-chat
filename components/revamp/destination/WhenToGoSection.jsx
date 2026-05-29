import React from "react";
import styles from "../../../styles/pages/revamp/destination.module.scss";

const renderStars = (count) => {
  const n = Math.max(0, Math.min(5, Number(count) || 0));
  if (!n) return null;
  return "★".repeat(n);
};

// Splits a title into a leading part (bold) and a trailing word rendered in serif,
// mirroring the japan reference ("Cherry <span class='serif'>blossom</span>").
const renderTitle = (title) => {
  if (!title) return null;
  const parts = String(title).trim().split(" ");
  if (parts.length === 1) return parts[0];
  const last = parts.pop();
  return (
    <>
      {parts.join(" ")} <span className={styles.serif}>{last}</span>
    </>
  );
};

const WhenToGoSection = ({ seasonalInfo, destinationName, onSeeMore }) => {
  const seasons = seasonalInfo?.seasons;
  if (!Array.isArray(seasons) || seasons.length === 0) return null;

  return (
    <section className={`${styles.block} ${styles.blockWhen}`}>
      <div className={styles.container}>
        <div className={styles.sectionHead}>
          <div className={styles.sectionHeadLeft}>
            <h2>
              When to <span className={styles.serif}>go.</span>
            </h2>
            {seasonalInfo?.intro && (
              <p className={styles.lede}>{seasonalInfo.intro}</p>
            )}
          </div>
          {onSeeMore && (
            <span className={styles.sectionLink} onClick={onSeeMore}>
              See seasonal itineraries
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </span>
          )}
        </div>
        <div className={styles.seasonsGrid}>
          {seasons.map((season, i) => {
            const tag = (season?.tag || "").toString();
            const isPeak = /peak/i.test(tag);
            const stars = renderStars(season?.rating_stars);
            return (
              <div className={styles.season} key={i}>
                <div
                  className={styles.seasonImg}
                  style={
                    season?.image_url
                      ? { backgroundImage: `url('${season.image_url}')` }
                      : undefined
                  }
                >
                  {tag && (
                    <div
                      className={`${styles.seasonPill} ${
                        isPeak ? styles.seasonPillPeak : ""
                      }`}
                    >
                      {tag}
                    </div>
                  )}
                </div>
                <div className={styles.seasonBody}>
                  {season?.title && <h3>{renderTitle(season.title)}</h3>}
                  {season?.months && (
                    <div className={styles.seasonMonth}>{season.months}</div>
                  )}
                  {season?.description && <p>{season.description}</p>}
                  {(season?.budget_from || stars || season?.rating_label) && (
                    <div className={styles.seasonMeta}>
                      {season?.budget_from && (
                        <span>
                          Trips from <b>{season.budget_from}</b>
                        </span>
                      )}
                      {(stars || season?.rating_label) && (
                        <span>
                          {stars && <b>{stars}</b>}
                          {season?.rating_label ? ` ${season.rating_label}` : ""}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhenToGoSection;

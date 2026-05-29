import React from "react";
import styles from "../../../styles/pages/revamp/destination.module.scss";

const Serif = ({ children }) => (
  <span className={styles.serif}>{children}</span>
);

// Builds stat cards from the detail-API `data` object, prioritising real data.
// Typical duration always renders (falls back to 7–14 nights); other cards only
// render when their source data exists.
const buildApiStats = (data) => {
  if (!data) return [];
  const stats = [];

  // Typical duration — always shown.
  const min = data.min_duration;
  const max = data.max_duration;
  const ideal = data.ideal_duration_days;
  let durationValue;
  if (min && max) {
    durationValue = (
      <>
        <Serif>
          {min}–{max}
        </Serif>{" "}
        nights
      </>
    );
  } else if (ideal) {
    durationValue = (
      <>
        <Serif>{ideal}</Serif> nights
      </>
    );
  } else {
    durationValue = (
      <>
        <Serif>7–14</Serif> nights
      </>
    );
  }
  stats.push({
    label: "Typical duration",
    value: durationValue,
    sub: ideal ? `First-timers: ${ideal}N sweet spot` : undefined,
  });

  // Best months.
  const bm = data.best_months;
  if (Array.isArray(bm) && bm.length) {
    const first = bm[0]?.months;
    const rest = bm
      .slice(1)
      .map((m) => m?.months)
      .filter(Boolean)
      .join(", ");
    stats.push({
      label: "Best months",
      value: (
        <>
          <Serif>{first}</Serif>
          {rest ? `, ${rest}` : ""}
        </>
      ),
      sub: bm[0]?.reason || undefined,
    });
  } else if (data.destination_info?.best_time_to_visit) {
    stats.push({
      label: "Best time to visit",
      value: <Serif>{data.destination_info.best_time_to_visit}</Serif>,
    });
  }

  // Currency.
  if (data.destination_info?.currency) {
    stats.push({
      label: "Currency",
      value: <Serif>{data.destination_info.currency}</Serif>,
    });
  }

  return stats;
};

const DestinationStatsStrip = ({ data, fallbacks = [] }) => {
  const apiStats = buildApiStats(data);
  const stats = [...apiStats, ...fallbacks].slice(0, 4);

  if (stats.length === 0) return null;

  return (
    <div className={styles.statsStrip}>
      <div className={styles.statsStripInner}>
        {stats.map((stat, i) => (
          <div className={styles.stat} key={i}>
            <div className={styles.statLabel}>{stat.label}</div>
            <div className={styles.statValue}>{stat.value}</div>
            {stat.sub && <div className={styles.statSub}>{stat.sub}</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DestinationStatsStrip;

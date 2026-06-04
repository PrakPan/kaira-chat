import React from "react";
import { getIndianPrice } from "../../../services/getIndianPrice";
import styles from "../../../styles/pages/revamp/destination.module.scss";

const Serif = ({ children }) => (
  <span className={styles.serif}>{children}</span>
);

const titleCase = (str) =>
  String(str || "")
    .replace(/[_-]+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());

const formatPrice = (n) => {
  const num = Number(n);
  if (!num) return "";
  if (num >= 100000) return `₹${(num / 100000).toFixed(num % 100000 === 0 ? 0 : 1)}L`;
  return `₹${getIndianPrice(num)}`;
};

// Builds a Visa stat from the detail API. Prefers the structured `visa` array,
// falling back to the free-text `destination_info.visa_policy`.
const buildVisaStat = (data) => {
  const visa = Array.isArray(data?.visa) ? data.visa[0] : null;
  if (visa) {
    const primary = titleCase(visa.category) || "Visa";
    const secondary = titleCase(visa.processing_type);
    const fee = (Number(visa.price) || 0) + (Number(visa.service_fee) || 0);
    const subParts = [];
    if (fee) subParts.push(`${formatPrice(fee)} fee`);
    if (visa.entry_type) subParts.push(titleCase(visa.entry_type));
    return {
      label: "Visa",
      value: (
        <>
          <Serif>{primary}</Serif>
          {secondary ? ` · ${secondary}` : ""}
        </>
      ),
      sub: subParts.join(" · ") || undefined,
    };
  }

  const policy = data?.destination_info?.visa_policy;
  if (policy) {
    const isFree = /visa[-\s]?free/i.test(policy);
    const days = policy.match(/(\d+)\s*days?/i);
    return {
      label: "Visa",
      value: (
        <>
          <Serif>{isFree ? "Visa-free" : "Visa required"}</Serif>
          {days ? ` · ${days[1]} days` : ""}
        </>
      ),
      // sub: policy,
    };
  }

  return null;
};

// Builds stat cards from the detail-API `data` object, prioritising real data.
// Order: Trip cost (budget) → Typical duration → Best months → Visa.
// Currency is intentionally excluded.
const buildApiStats = (data) => {
  if (!data) return [];
  const stats = [];

  // Trip cost — from `budget` when available.
  if (data.budget) {
    const durationNights = data.min_duration || data.ideal_duration_days;
    stats.push({
      label: "Trip cost from",
      value: (
        <>
          <Serif>{formatPrice(data.budget)}</Serif> per person
        </>
      ),
      sub: durationNights
        ? `${durationNights} nights · couple · mid-range`
        : "couple · mid-range",
    });
  }

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

  // Visa.
  const visaStat = buildVisaStat(data);
  if (visaStat) stats.push(visaStat);

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

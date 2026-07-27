import React, { useCallback, useEffect, useRef, useState } from "react";
import { getIndianPrice } from "../../../services/getIndianPrice";
import { setStatsStripPinned } from "../../../services/floatingStatsStrip";
import styles from "../../../styles/pages/revamp/destination.module.scss";

const PHONE_QUERY = "(max-width: 767px)";
// Keeps a chip scrolled into view clear of the circular arrow overlay — must
// stay in step with `.statsArrow` / `scroll-padding-left` in the stylesheet.
const ARROW_GUTTER = 42;
const STEP_EPSILON = 4;

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
// Order: Trip cost (budget) → Visa → Typical duration → Best months.
// Only the first four survive on the page, so the two questions every traveller
// asks first (what does it cost, do I need a visa) always make the cut.
// Currency is intentionally excluded.
const buildApiStats = (data) => {
  if (!data) return [];
  const stats = [];

  // 1. Trip cost — from `budget` when available.
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

  // 2. Visa.
  const visaStat = buildVisaStat(data);
  if (visaStat) stats.push(visaStat);

  // 3. Typical duration — always shown.
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

  // 4. Best months.
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

  return stats;
};

const ChevronIcon = ({ dir }) => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d={dir === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} />
  </svg>
);

const DestinationStatsStrip = ({ data, fallbacks = [] }) => {
  const apiStats = buildApiStats(data);
  // Drop fallbacks explicitly flagged empty (e.g. a count that resolves to 0)
  // so the strip never renders a "0" / "0+" stat — meaningful evergreen
  // fallbacks fill the slot instead.
  const validFallbacks = fallbacks.filter((f) => f && f.when !== false);
  const stats = [...apiStats, ...validFallbacks].slice(0, 4);

  const wrapRef = useRef(null);
  const barRef = useRef(null);
  const scrollerRef = useRef(null);

  const [isPhone, setIsPhone] = useState(false);
  // On phones the strip starts pinned to the bottom of the viewport so the
  // numbers are on screen the moment the page loads, and drops into the flow
  // once the page scrolls down to its real slot.
  const [pinned, setPinned] = useState(false);
  const [barHeight, setBarHeight] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(PHONE_QUERY);
    const apply = () => setIsPhone(mq.matches);
    apply();
    if (mq.addEventListener) {
      mq.addEventListener("change", apply);
      return () => mq.removeEventListener("change", apply);
    }
    mq.addListener(apply);
    return () => mq.removeListener(apply);
  }, []);

  // The wrapper holds the strip's height open while the strip itself is fixed,
  // so the page never jumps when it docks. Phone padding is identical in both
  // states, which keeps the measured height stable across the swap.
  useEffect(() => {
    const el = barRef.current;
    if (!el) return undefined;
    const measure = () => setBarHeight(el.offsetHeight);
    measure();
    if (typeof ResizeObserver === "undefined") return undefined;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [stats.length]);

  useEffect(() => {
    if (!isPhone) {
      setPinned(false);
      setStatsStripPinned(false);
      return undefined;
    }
    const update = () => {
      const wrap = wrapRef.current;
      const bar = barRef.current;
      if (!wrap || !bar) return;
      // Still pinned while the strip's in-page slot sits below where the fixed
      // bar is drawn; the moment the slot scrolls up to it, the strip docks.
      const next =
        wrap.getBoundingClientRect().top > window.innerHeight - bar.offsetHeight;
      setPinned(next);
      setStatsStripPinned(next);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      setStatsStripPinned(false);
    };
  }, [isPhone, barHeight]);

  // Arrow affordances for the horizontal scroller — without them the strip
  // reads as a cut-off row rather than something you can swipe.
  const syncArrows = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(max > 4 && el.scrollLeft < max - 4);
  }, []);

  useEffect(() => {
    syncArrows();
    window.addEventListener("resize", syncArrows);
    return () => window.removeEventListener("resize", syncArrows);
  }, [syncArrows, stats.length, pinned]);

  // One stat per tap. Scrolling by a fraction of the viewport skipped two at a
  // time on phones, so step through the chips' own offsets instead and park
  // each one past ARROW_GUTTER, clear of the circular arrow.
  const scrollByStep = (dir) => {
    const el = scrollerRef.current;
    if (!el) return;
    const items = Array.from(el.children);
    if (!items.length) return;
    // Chip offsets in the same coordinate space as scrollLeft.
    const origin = el.getBoundingClientRect().left - el.scrollLeft;
    const stops = items.map((it) =>
      Math.max(0, it.getBoundingClientRect().left - origin - ARROW_GUTTER)
    );
    const cur = el.scrollLeft;
    const target =
      dir > 0
        ? stops.find((s) => s > cur + STEP_EPSILON)
        : [...stops].reverse().find((s) => s < cur - STEP_EPSILON);
    el.scrollTo({
      left: target === undefined ? (dir > 0 ? el.scrollWidth : 0) : target,
      behavior: "smooth",
    });
  };

  if (stats.length === 0) return null;

  return (
    <div
      className={styles.statsStripWrap}
      ref={wrapRef}
      style={pinned && barHeight ? { height: barHeight } : undefined}
    >
      <div
        ref={barRef}
        className={`${styles.statsStrip} ${pinned ? styles.statsStripPinned : ""}`}
      >
        <button
          type="button"
          aria-label="Scroll stats left"
          tabIndex={canScrollLeft ? 0 : -1}
          onClick={() => scrollByStep(-1)}
          className={`${styles.statsArrow} ${styles.statsArrowLeft} ${
            canScrollLeft ? "" : styles.statsArrowHidden
          }`}
        >
          <ChevronIcon dir="left" />
        </button>

        {/* Edge fades — a chip sliding under an arrow reads as broken text
            otherwise. Sit below the arrows, above the chips. */}
        <span
          aria-hidden
          className={`${styles.statsFade} ${styles.statsFadeLeft} ${
            canScrollLeft ? "" : styles.statsFadeHidden
          }`}
        />
        <span
          aria-hidden
          className={`${styles.statsFade} ${styles.statsFadeRight} ${
            canScrollRight ? "" : styles.statsFadeHidden
          }`}
        />

        <div
          className={styles.statsStripInner}
          ref={scrollerRef}
          onScroll={syncArrows}
        >
          {stats.map((stat, i) => (
            <div className={styles.stat} key={i}>
              <div className={styles.statLabel}>{stat.label}</div>
              <div className={styles.statValue}>{stat.value}</div>
              {stat.sub && <div className={styles.statSub}>{stat.sub}</div>}
            </div>
          ))}
        </div>

        <button
          type="button"
          aria-label="Scroll stats right"
          tabIndex={canScrollRight ? 0 : -1}
          onClick={() => scrollByStep(1)}
          className={`${styles.statsArrow} ${styles.statsArrowRight} ${
            canScrollRight ? "" : styles.statsArrowHidden
          }`}
        >
          <ChevronIcon dir="right" />
        </button>
      </div>
    </div>
  );
};

export default DestinationStatsStrip;

import React, { useState } from "react";
import { useRouter } from "next/router";
import {
  setPendingFiles,
  setPendingSeed,
} from "../../../services/heroChatHandoff";
import { truncateAtSentence } from "../../../helper/truncateAtSentence";
import styles from "../../../styles/pages/revamp/destination.module.scss";
import Link from "next/link";
import GetInspiredDrawer from "../../theme/GetInspiredDrawer";
import { KairaAvatar } from "../home/HeroSection";
import heroStyles from "../home/HeroSection.module.scss";

const FALLBACK_POLAROIDS = [
  {
    image:
      "https://images.unsplash.com/photo-1492571350019-22de08371fd3?w=400&q=80",
    caption: "Kyoto, sakura",
  },
  {
    image:
      "https://images.unsplash.com/photo-1528127269322-539801943592?w=400&q=80",
    caption: "Hoi An at 6am",
  },
  {
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80",
    caption: "Bali ricefields",
  },
  {
    image:
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&q=80",
    caption: "Angkor sunrise",
  },
];

const HeroV2 = ({
  destinationLabel,
  kicker,
  title,
  description,
  prompts = [],
  meta,
  polaroids = [],
  fallbackSources = [],
  activities = [],
  pois = [],
  onOpenDrawer,
  slug,
  themeConfig,
}) => {
  const router = useRouter();

  // On non-themed destination pages the "Explore ideas" CTA (below Start
  // planning) toggles the prompt chips open/closed. Greece keeps its own
  // slide-in inspiration drawer instead.
  const isThemePage = slug === "theme-greece";
  const [showPrompts, setShowPrompts] = useState(false);

  const goToChat = (seed, files) => {
    if (files && files.length) setPendingFiles(files);
    if (seed) setPendingSeed(seed);
    const url = seed ? `/chat?seed=${encodeURIComponent(seed)}` : "/chat";
    router.push(url);
  };

  const handlePromptClick = (text) => {
    const seed = (
      destinationLabel ? `${text}, ${destinationLabel}` : text
    ).trim();
    goToChat(seed);
  };

  const polaroidImages = (() => {
    const valid = (polaroids || []).filter((p) => p && p.image);
    const unique = new Set(valid.map((p) => p.image));
    const allSame = valid.length > 1 && unique.size === 1;
    const enough = valid.length >= 4 && !allSame;

    if (enough) return valid.slice(0, 4);

    const base = allSame ? [] : [...valid];
    const seen = new Set(base.map((p) => p.image));

    const pushFrom = (items, label, drawerType) => {
      for (const it of items || []) {
        if (base.length >= 4) return;
        const img = it && it.image;
        if (!img || seen.has(img)) continue;
        const entry = { image: img, caption: it.caption || label };
        // Places carry a `path` and navigate; activities / POIs carry the raw
        // item so the page can open its details drawer.
        if (it.path) entry.path = it.path;
        if (drawerType && it.data) entry.drawer = { type: drawerType, data: it.data };
        base.push(entry);
        seen.add(img);
      }
    };

    // Page-supplied sources are tried in order before falling back to the
    // generic activity / POI imagery, so each page can prioritise the most
    // relevant nested destinations (countries, states, hot locations, …).
    (fallbackSources || []).forEach((src) =>
      pushFrom(src?.items, src?.caption)
    );
    pushFrom(activities, "Activity", "activity");
    pushFrom(pois, "POI", "poi");

    if (base.length === 0) return FALLBACK_POLAROIDS.slice(0, 4);
    return base.slice(0, 4);
  })();
  // Reuse the homepage hero's polaroid positions/sizing so the destination
  // hero collage matches the home page exactly.
  const polClassNames = [
    heroStyles.p1,
    heroStyles.p2,
    heroStyles.p3,
    heroStyles.p4,
  ];

  // Each polaroid can either navigate to a destination page (`path`) or open a
  // POI / activity details drawer (`drawer`). Generic fallback imagery has
  // neither and stays non-interactive.
  const handlePolaroidClick = (p) => {
    if (!p) return;
    if (p.drawer && onOpenDrawer) {
      onOpenDrawer(p.drawer.data, p.drawer.type);
    } else if (p.path) {
      router.push("/" + p.path);
    }
  };

  // "Start planning" opens the in-chat intake form (`?intake=1`) and seeds its
  // destination step with this page's place, so the form lands pre-filled. On
  // the Greece theme page `destinationLabel` is "Greece"; on destination pages
  // it's that page's name.
  const intakeHref = destinationLabel
    ? `/chat?intake=1&destination=${encodeURIComponent(destinationLabel)}`
    : "/chat?intake=1";

  return (
    <section className={styles.heroV2}>
      <div className={styles.container}>
        <div className={styles.heroV2Grid}>
          <div>
            {kicker && (
              <div className={styles.heroV2Kicker}>
                <span className="dot" />
                {kicker}
              </div>
            )}
            <h1 className={styles.heroV2Lede}>{title}</h1>
            {description && (
              <p className={styles.heroV2Lede}>
                {typeof description === "string"
                  ? truncateAtSentence(description, 300)
                  : description}
              </p>
            )}
            <div className="relative z-[4] mb-3 flex flex-col items-start gap-3">
              <Link
                href={intakeHref}
                className="group flex relative z-[4] max-ph:hidden  items-center gap-[10px] rounded-full bg-[var(--ttw-ink)] px-7 py-3.5 text-base font-semibold text-white no-underline shadow-[0_12px_28px_-8px_rgba(11,18,32,0.4)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_-8px_rgba(11,18,32,0.45)]"
              >
                Start planning
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-[18px] transition-transform duration-200 group-hover:translate-x-[3px]"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
              {isThemePage ? (
                <GetInspiredDrawer
                  themeConfig={themeConfig}
                  label="Discover trip ideas for Greece"
                />
              ) : (
                prompts.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowPrompts((v) => !v)}
                    aria-expanded={showPrompts}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#E7D4F7] bg-[#F7ECFF] px-3 py-1 text-[13px] font-semibold text-[#922ADC] no-underline transition-all duration-200 hover:-translate-y-0.5 hover:border-[#922ADC]"
                  >
                    <span aria-hidden>✦</span>
                    <span>Discover trip ideas for {destinationLabel || "you"}</span>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`size-[18px] transition-transform duration-200 ${
                        showPrompts ? "rotate-180" : ""
                      }`}
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                )
              )}
            </div>
            {prompts.length > 0 && (isThemePage || showPrompts) && (
              <div className={styles.heroV2Prompts}>
                {prompts.map((p, i) => {
                  // Prompts can be plain strings, or { label, prompt } objects
                  // where the short label is shown but the full prompt is sent.
                  const label = typeof p === "string" ? p : p?.label;
                  const text = typeof p === "string" ? p : p?.prompt;
                  return (
                    <button
                      key={i}
                      type="button"
                      className={styles.heroV2Prompt}
                      onClick={() => handlePromptClick(text)}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            )}
            {meta && <div className={styles.heroV2Meta}>{meta}</div>}
          </div>

          <div className={heroStyles.kairaWrap}>
            {polaroidImages.map((p, i) => {
              const clickable = !!(p.drawer || p.path);
              return (
                <div
                  key={i}
                  className={`${heroStyles.polaroid} ${polClassNames[i] || ""}`}
                  role={clickable ? "button" : undefined}
                  tabIndex={clickable ? 0 : undefined}
                  onClick={clickable ? () => handlePolaroidClick(p) : undefined}
                  onKeyDown={
                    clickable
                      ? (e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handlePolaroidClick(p);
                          }
                        }
                      : undefined
                  }
                  style={clickable ? { cursor: "pointer" } : undefined}
                >
                  <div
                    className={heroStyles.polaroidImg}
                    style={{ backgroundImage: `url('${p.image}')` }}
                  />
                  {p.caption && (
                    <div className={heroStyles.polaroidCaption}>{p.caption}</div>
                  )}
                </div>
              );
            })}

            <KairaAvatar size="lg" />

            <div className={heroStyles.kairaName}>
              <div className={heroStyles.hi}>Hi, I&apos;m Kaira.</div>
              <div className={heroStyles.sub}>
                <span className={heroStyles.dot}></span> online · ~2s reply
              </div>
            </div>

            <Link href={intakeHref} className={heroStyles.kairaCta}>
              Start planning
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroV2;

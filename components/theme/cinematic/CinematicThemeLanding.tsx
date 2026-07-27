// components/theme/cinematic/CinematicThemeLanding.tsx
//
// Editorial, magazine-style theme landing surface. Renders a hero + any number
// of stacked sections (image-card rows, "step into the scene" trip lists,
// gradient tile grids) entirely from a CinematicThemeConfig. Every card funnels
// to a fresh /chat session via `onSelectPrompt`, so the same component powers
// any theme page — the page only supplies content.
//
// Faithful to the "02 · Theme" mockup for both breakpoints:
//   • Mobile — strictly matches the mobile mockup: 20px gutters, horizontally
//     scrolling card rows (220px cards, 130px images), 2-up destination grid.
//     The hero subtext and the desktop Kaira/polaroid collage are hidden here.
//   • Desktop (md+) — wide type, multi-column grids, and a Kaira avatar + film
//     polaroid collage in the hero (mirrors the homepage hero).
//
// IMPORTANT: the app loads Bootstrap globally, whose utility classes (.px-5,
// .p-4, .gap-3, .mt-2 …) override Tailwind's numeric spacing scale. So ALL
// spacing here uses bracketed pixel values (px-[20px], gap-[12px] …), which
// don't collide with Bootstrap and resolve exactly.
//
// Cards and chips carry no border or drop shadow — a clean, flat paper look.
// Design tokens live in the scoped <CinematicStyles/> block so nothing leaks.

import React from "react";
import { useRouter } from "next/router";
import type {
  CinematicThemeConfig,
  CinematicHeading,
  CinematicSection,
  CinematicSectionCta,
  CinematicPromptCard,
  CinematicTripCard,
  CinematicGradientCard,
  CinematicHeroConfig,
  CinematicAskBar,
} from "./types";

// ── Palette ──────────────────────────────────────────────────────────────
const INK = "#0b1220";
const MUTED = "#445069";
const FAINT = "#8a93a6";
const BORDER = "#ececec";
const YELLOW = "#f7e700";
const PAPER = "#fafaf5";
const DARK = "#0a1020";

// ── Scoped styles ──────────────────────────────────────────────────────────
const CinematicStyles = () => (
  <style
    dangerouslySetInnerHTML={{
      __html: `
      .ctl-root { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background: ${PAPER}; color: ${INK}; }
      .ctl-serif { font-family: 'Instrument Serif', Georgia, 'Times New Roman', serif; font-style: italic; font-weight: 400; }
      .ctl-mono { font-family: ui-monospace, 'JetBrains Mono', 'SFMono-Regular', Menlo, Consolas, monospace; text-transform: uppercase; letter-spacing: 0.14em; font-size: 10px; color: ${FAINT}; }
      .ctl-h { font-family: 'Inter', sans-serif; font-weight: 800; letter-spacing: -0.03em; color: ${INK}; margin: 0; }
      .ctl-card { transition: transform .25s cubic-bezier(.2,.7,.3,1); }
      .ctl-card:hover { transform: translateY(-2px); }
      .ctl-press { transition: transform .15s cubic-bezier(.2,.7,.3,1); }
      .ctl-press:hover { transform: translateY(-1px); }
      .ctl-scroll { scrollbar-width: none; -ms-overflow-style: none; }
      .ctl-scroll::-webkit-scrollbar { display: none; }
      .ctl-root input { font-family: inherit; }
      .ctl-root input::placeholder { color: #b8becc; opacity: 1; }
      .ctl-skeleton { position: absolute; inset: 0; background: linear-gradient(90deg, #e7e9ee 25%, #f2f3f6 37%, #e7e9ee 63%); background-size: 400% 100%; animation: ctlShimmer 1.4s ease infinite; }
      @keyframes ctlShimmer { 0% { background-position: 100% 0; } 100% { background-position: 0 0; } }

      /* Desktop hero Kaira + polaroid collage (mirrors the homepage hero) */
      .ctl-kairawrap { position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 30px 0; min-height: 440px; }
      .ctl-kaira { width: 180px; height: 180px; border-radius: 50%; overflow: hidden; box-shadow: 0 16px 40px rgba(11,18,32,0.2); border: 6px solid ${PAPER}; z-index: 2; }
      .ctl-kaira img { width: 100%; height: 100%; object-fit: cover; }
      .ctl-polaroid { position: absolute; width: 148px; background: #fff; padding: 8px 8px 26px; box-shadow: 0 12px 28px -8px rgba(11,18,32,0.25); border-radius: 4px; z-index: 3; transition: transform .3s cubic-bezier(.2,.7,.3,1); cursor: pointer; }
      .ctl-polaroid:hover { transform: translateY(-4px) rotate(0deg) !important; z-index: 5; }
      .ctl-polaroid-img { position: relative; overflow: hidden; width: 100%; aspect-ratio: 1 / 1; border-radius: 2px; }
      .ctl-polaroid-cap { font-family: 'Instrument Serif', serif; font-style: italic; font-size: 12px; color: ${INK}; text-align: center; margin-top: 8px; line-height: 1.2; }
      .ctl-kaira-name { text-align: center; margin-top: 16px; z-index: 4; }
      .ctl-kaira-hi { font-family: 'Instrument Serif', serif; font-style: italic; font-size: 20px; color: ${INK}; }
      .ctl-kaira-sub { font-size: 11px; color: ${FAINT}; display: flex; align-items: center; justify-content: center; gap: 6px; margin-top: 2px; }
      .ctl-dot { width: 7px; height: 7px; border-radius: 50%; background: #1f8a5a; display: inline-block; }
    `,
    }}
  />
);

// ── Layout container — every section shares this so headings and card rows
// line up to the same left edge on all breakpoints (20px mobile / 28px md). ──
const Container: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <div
    className={`w-full max-w-[1240px] mx-auto px-[20px] md:px-[28px] ${className ?? ""}`}
  >
    {children}
  </div>
);

// Image that fills its (position: relative) parent and shows a shimmering
// skeleton until it loads. Used by every card image so slow networks never
// flash a blank white box.
const SkeletonImage: React.FC<{
  src: string;
  alt: string;
  objectPosition?: string;
}> = ({ src, alt, objectPosition }) => {
  const [loaded, setLoaded] = React.useState(false);
  const [error, setError] = React.useState(false);
  return (
    <>
      {!loaded && !error && <span className="ctl-skeleton" aria-hidden />}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className="w-full h-full object-cover"
        style={{
          objectPosition: objectPosition ?? "center",
          // On error the img stays transparent so the parent backdrop
          // (gradient tile / neutral fill) shows instead of a broken icon.
          opacity: loaded && !error ? 1 : 0,
          transition: "opacity 0.35s ease",
        }}
      />
    </>
  );
};

// Renders an optional mono eyebrow, then `lead <serif>accent</serif>`, then an
// optional mono note. Kept in one block so it never becomes a flex child.
const Heading: React.FC<{
  heading: CinematicHeading;
  className?: string;
}> = ({ heading, className }) => (
  <div>
    {heading.eyebrow && <div className="ctl-mono mb-[4px]">{heading.eyebrow}</div>}
    <h2 className={`ctl-h ${className ?? ""}`}>
      {heading.lead}
      {heading.accent ? (
        <>
          {" "}
          <span className="ctl-serif">{heading.accent}</span>
        </>
      ) : null}
    </h2>
    {heading.note && <div className="ctl-mono mt-[8px]">{heading.note}</div>}
  </div>
);

// ── Section CTA (pill button — retained for future pages; unused by filmy) ──
const SectionCta: React.FC<{
  cta: CinematicSectionCta;
  onSelectPrompt: (p: string) => void;
}> = ({ cta, onSelectPrompt }) => {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => {
        if (cta.prompt) onSelectPrompt(cta.prompt);
        else if (cta.href) router.push(cta.href);
      }}
      className="ctl-press shrink-0 rounded-full bg-white px-[18px] py-[10px] text-[13px] font-semibold cursor-pointer"
      style={{ color: INK }}
    >
      {cta.label} →
    </button>
  );
};

// ── Hero ───────────────────────────────────────────────────────────────────
const CinematicHero: React.FC<{
  hero: CinematicHeroConfig;
  onSelectPrompt: (p: string) => void;
}> = ({ hero, onSelectPrompt }) => {
  const router = useRouter();
  // Controlled composer: send the typed text (falling back to the example
  // prompt when empty) on Send click or Enter.
  const [composerText, setComposerText] = React.useState("");
  const submitComposer = () => {
    const value = composerText.trim() || hero.prompt || "";
    if (value) onSelectPrompt(value);
  };
  const polaroidPos: Array<{
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
    rotate: number;
  }> = [
    { top: 0, left: -18, rotate: -8 },
    { top: 64, right: -26, rotate: 6 },
    { bottom: 24, left: -6, rotate: 4 },
    { bottom: -8, right: 12, rotate: -5 },
  ];
  return (
    <Container className="pt-[24px] md:pt-[48px]">
      <div className="md:grid md:grid-cols-[1.05fr_1fr] md:gap-[48px] md:items-center">
        {/* Copy + composer */}
        <div>
          {hero.eyebrow && <div className="ctl-mono">{hero.eyebrow}</div>}
          <h1
            className="ctl-h mt-[8px] text-[34px] leading-[1.0] md:text-[60px] md:leading-[0.95]"
            style={{ letterSpacing: "-0.04em" }}
          >
            {hero.heading.lead}
            {hero.heading.accent ? (
              <>
                {" "}
                <span className="ctl-serif">{hero.heading.accent}</span>
              </>
            ) : null}
          </h1>

          {/* Subtext — desktop only (mobile mockup has none) */}
          {hero.lede && (
            <p
              className="max-ph:hidden mt-[16px] text-[17px] leading-[1.55] max-w-[500px]"
              style={{ color: MUTED }}
            >
              {hero.lede}
            </p>
          )}

          {/* Faux composer */}
          <div
            className="mt-[16px] md:mt-[24px] bg-white rounded-[22px] px-[16px] py-[13px] md:px-[22px] md:py-[16px] flex items-center justify-between gap-[12px] max-w-[540px]"
            style={{ border: `1px solid ${BORDER}` }}
          >
            <input
              type="text"
              value={composerText}
              onChange={(e) => setComposerText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  submitComposer();
                }
              }}
              placeholder={hero.placeholder}
              aria-label="Describe your trip"
              className="flex-1 min-w-0 bg-transparent border-none outline-none text-[14px] md:text-[16px]"
              style={{ color: INK }}
            />
            <button
              type="button"
              onClick={submitComposer}
              className="shrink-0 rounded-full border-none cursor-pointer px-[15px] py-[8px] md:px-[20px] md:py-[10px] text-[12.5px] md:text-[14px] font-semibold"
              style={{ background: INK, color: PAPER }}
            >
              Send →
            </button>
          </div>

          {/* Chips */}
          {hero.chips && hero.chips.length > 0 && (
            <div className="flex flex-wrap gap-[8px] mt-[10px] md:mt-[14px]">
              {hero.chips.map((chip, i) => (
                <button
                  key={`hero-chip-${i}`}
                  type="button"
                  onClick={() => onSelectPrompt(chip.prompt)}
                  className="ctl-press bg-white rounded-full px-[12px] py-[7px] md:px-[16px] md:py-[9px] text-[11.5px] md:text-[13px] font-medium cursor-pointer"
                  style={{ color: MUTED }}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Desktop-only Kaira + film polaroid collage */}
        {hero.images && hero.images.length > 0 && (
          <div className="max-ph:hidden">
            <div className="ctl-kairawrap">
              {hero.images.slice(0, 4).map((img, i) => {
                const pos = polaroidPos[i];
                return (
                  <div
                    key={`polaroid-${i}`}
                    className="ctl-polaroid"
                    style={{
                      top: pos.top,
                      left: pos.left,
                      right: pos.right,
                      bottom: pos.bottom,
                      transform: `rotate(${pos.rotate}deg)`,
                    }}
                    onClick={() => img.href && router.push(img.href)}
                  >
                    <div className="ctl-polaroid-img">
                      <SkeletonImage src={img.image} alt={img.caption ?? ""} />
                    </div>
                    {img.caption && (
                      <div className="ctl-polaroid-cap">{img.caption}</div>
                    )}
                  </div>
                );
              })}

              <div className="ctl-kaira">
                <img src={hero.kairaImage ?? "/KairaInsta.jpg"} alt="Kaira" />
              </div>
              <div className="ctl-kaira-name">
                <div className="ctl-kaira-hi">Hi, I&apos;m Kaira.</div>
                <div className="ctl-kaira-sub">
                  <span className="ctl-dot" /> online · ~2s reply
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

// ── Image card (Bollywood / Hollywood rows) ────────────────────────────────
// Mobile: 220px wide, 130px image. Desktop: fills a 3-col grid cell, 200px image.
const PromptCard: React.FC<{
  card: CinematicPromptCard;
  onSelectPrompt: (p: string) => void;
}> = ({ card, onSelectPrompt }) => (
  <button
    type="button"
    onClick={() => onSelectPrompt(card.prompt)}
    className="ctl-card group flex flex-col text-left bg-white rounded-[18px] md:rounded-[22px] overflow-hidden cursor-pointer w-[220px] md:w-auto shrink-0 md:shrink"
    style={{ scrollSnapAlign: "start" }}
  >
    <div
      className="relative h-[130px] md:h-[200px] overflow-hidden"
      style={{ background: "#eef0f4" }}
    >
      <SkeletonImage
        src={card.image}
        alt={card.name}
        objectPosition={card.objectPosition}
      />
      {card.tag && (
        <div
          className="ctl-mono absolute top-[10px] left-[10px] md:top-[12px] md:left-[12px] px-[8px] py-[3px] rounded-[6px]"
          style={{
            background: YELLOW,
            color: INK,
            transform: "rotate(-1.5deg)",
            fontSize: 9,
            pointerEvents: "none",
          }}
        >
          {card.tag}
        </div>
      )}
    </div>
    <div className="px-[14px] py-[12px] md:px-[18px] md:py-[16px]">
      <div
        className="text-[14px] md:text-[17px] font-bold"
        style={{ color: INK, letterSpacing: "-0.01em" }}
      >
        {card.name}
      </div>
      {card.line && (
        <div
          className="text-[12.5px] md:text-[13.5px] leading-[1.45] mt-[2px] md:mt-[4px]"
          style={{ color: MUTED }}
        >
          {card.line}
        </div>
      )}
    </div>
  </button>
);

const CardsSection: React.FC<{
  section: Extract<CinematicSection, { type: "cards" }>;
  onSelectPrompt: (p: string) => void;
}> = ({ section, onSelectPrompt }) => (
  <section className="pt-[30px] md:pt-[56px]">
    <Container>
      <div className="flex items-end justify-between gap-[16px]">
        <Heading heading={section.heading} className="text-[22px] md:text-[34px]" />
        {section.cta && (
          <div className="max-ph:hidden">
            <SectionCta cta={section.cta} onSelectPrompt={onSelectPrompt} />
          </div>
        )}
      </div>
      <div
        className="ctl-scroll flex md:grid md:grid-cols-3 gap-[12px] md:gap-[16px] mt-[12px] md:mt-[24px] overflow-x-auto md:overflow-visible pb-[4px]"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {section.cards.map((card, i) => (
          <PromptCard key={`card-${i}`} card={card} onSelectPrompt={onSelectPrompt} />
        ))}
      </div>
    </Container>
  </section>
);

// ── Trip card ("Step into the scene") ──────────────────────────────────────
// Mobile: full-width stacked rows, 78px thumb, price + nights inline.
// Desktop: 3-col grid, 96px thumb, price + nights stacked.
const TripCard: React.FC<{
  card: CinematicTripCard;
  onSelectPrompt: (p: string) => void;
}> = ({ card, onSelectPrompt }) => (
  <button
    type="button"
    onClick={() => onSelectPrompt(card.prompt)}
    className="ctl-card text-left bg-white rounded-[18px] p-[12px] md:p-[16px] flex gap-[12px] md:gap-[16px] cursor-pointer"
  >
    <div
      className="relative w-[78px] h-[78px] md:w-[96px] md:h-[96px] shrink-0 rounded-[12px] md:rounded-[14px] overflow-hidden"
      style={{ background: "#eef0f4" }}
    >
      <SkeletonImage
        src={card.image}
        alt={card.name}
        objectPosition={card.objectPosition}
      />
    </div>
    <div className="flex-1 min-w-0">
      {card.tag && <div className="ctl-mono" style={{ fontSize: 9 }}>{card.tag}</div>}
      <div
        className="text-[14.5px] md:text-[16px] font-bold mt-[2px]"
        style={{ color: INK, letterSpacing: "-0.01em" }}
      >
        {card.name}
      </div>
      {card.line && (
        <div className="text-[12px] md:text-[13px] mt-[2px]" style={{ color: MUTED }}>
          {card.line}
        </div>
      )}
      {(card.price || card.nights) && (
        <div className="flex md:flex-col gap-[10px] md:gap-[2px] mt-[6px] md:mt-[10px]">
          {card.price && (
            <span className="ctl-mono" style={{ color: INK, fontSize: 10.5 }}>
              {card.price}
            </span>
          )}
          {card.nights && (
            <span className="ctl-mono" style={{ fontSize: 10 }}>
              {card.nights}
            </span>
          )}
        </div>
      )}
    </div>
  </button>
);

const TripsSection: React.FC<{
  section: Extract<CinematicSection, { type: "trips" }>;
  onSelectPrompt: (p: string) => void;
}> = ({ section, onSelectPrompt }) => (
  <section className="pt-[30px] md:pt-[56px]">
    <Container>
      <Heading heading={section.heading} className="text-[22px] md:text-[34px]" />
      <div className="flex flex-col md:grid md:grid-cols-3 gap-[10px] md:gap-[16px] mt-[14px] md:mt-[24px]">
        {section.cards.map((card, i) => (
          <TripCard key={`trip-${i}`} card={card} onSelectPrompt={onSelectPrompt} />
        ))}
      </div>
    </Container>
  </section>
);

// ── Gradient tile (Other themes / Destinations) ────────────────────────────
const GradientCard: React.FC<{
  card: CinematicGradientCard;
  onSelectPrompt: (p: string) => void;
  compact?: boolean; // destinations: shorter tile + no name min-height
}> = ({ card, onSelectPrompt, compact }) => {
  const router = useRouter();
  const act = () => {
    if (card.prompt) onSelectPrompt(card.prompt);
    else if (card.href) router.push(card.href);
  };
  return (
    <button
      type="button"
      onClick={act}
      className={`ctl-card text-left bg-white overflow-hidden cursor-pointer ${
        compact
          ? "rounded-[14px]"
          : "rounded-[18px] w-[152px] md:w-auto shrink-0 md:shrink"
      }`}
      style={{ scrollSnapAlign: "start" }}
    >
      <div
        className={`relative overflow-hidden flex items-center justify-center ${
          compact
            ? "h-[68px] md:h-[84px] text-[26px] md:text-[30px]"
            : "h-[92px] md:h-[104px] text-[30px] md:text-[32px]"
        }`}
        style={{ background: card.gradient }}
      >
        {card.image ? (
          <SkeletonImage src={card.image} alt={card.name} />
        ) : (
          card.emoji
        )}
      </div>
      <div
        className={
          compact
            ? "px-[11px] py-[9px] md:px-[14px] md:py-[14px]"
            : "px-[12px] py-[10px] md:px-[15px] md:py-[15px]"
        }
      >
        <div
          className={`font-bold leading-[1.25] ${
            compact ? "text-[12.5px] md:text-[13.5px]" : "text-[13px] md:text-[14px]"
          }`}
          style={{
            color: INK,
            letterSpacing: "-0.01em",
            minHeight: compact ? undefined : 32,
          }}
        >
          {card.name}
        </div>
        {card.meta && (
          <div
            className="ctl-mono"
            style={{ fontSize: 8.5, marginTop: compact ? 3 : 5 }}
          >
            {card.meta}
          </div>
        )}
      </div>
    </button>
  );
};

const GradientSection: React.FC<{
  section: Extract<CinematicSection, { type: "gradient" }>;
  onSelectPrompt: (p: string) => void;
}> = ({ section, onSelectPrompt }) => {
  const cols = section.columns ?? 6;
  const compact = !!section.mobileGrid;
  return (
    <section className="pt-[30px] md:pt-[56px]">
      <Container>
        <div className="flex items-end justify-between gap-[16px]">
          <Heading heading={section.heading} className="text-[22px] md:text-[34px]" />
          {section.cta && (
            <div className="max-ph:hidden">
              <SectionCta cta={section.cta} onSelectPrompt={onSelectPrompt} />
            </div>
          )}
        </div>
        {/* Desktop column count injected per-section; mobile is scroll or 2-up grid */}
        <style
          dangerouslySetInnerHTML={{
            __html: `@media (min-width:768px){ .ctl-grad-${cols}{ display:grid; grid-template-columns:repeat(${cols},minmax(0,1fr)); } }`,
          }}
        />
        <div
          className={`ctl-scroll ctl-grad-${cols} mt-[14px] md:mt-[24px] gap-[10px] md:gap-[14px] ${
            section.mobileGrid
              ? "grid grid-cols-2"
              : "flex overflow-x-auto pb-[4px]"
          }`}
          style={{
            scrollSnapType: section.mobileGrid ? undefined : "x mandatory",
          }}
        >
          {section.cards.map((card, i) => (
            <GradientCard
              key={`grad-${i}`}
              card={card}
              onSelectPrompt={onSelectPrompt}
              compact={compact}
            />
          ))}
        </div>
      </Container>
    </section>
  );
};

// ── Ask-Kaira strip ────────────────────────────────────────────────────────
const AskKairaStrip: React.FC<{
  bar: CinematicAskBar;
  onSelectPrompt: (p: string) => void;
}> = ({ bar, onSelectPrompt }) => (
  <div className="mt-[40px] md:mt-[64px]">
    {/* Desktop: dark inline strip */}
    <div
      className="max-ph:hidden relative overflow-hidden"
      style={{ background: DARK }}
    >
      <div
        className="absolute pointer-events-none"
        style={{
          top: -120,
          right: -60,
          width: 400,
          height: 400,
          background:
            "radial-gradient(circle, rgba(247,231,0,0.08), transparent 70%)",
        }}
      />
      <Container className="py-[22px]">
        <div className="flex items-center gap-[20px]">
          <div
            className="flex-1 flex items-center gap-[12px] rounded-full px-[20px] py-[11px]"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <span className="flex-1 text-[14.5px]" style={{ color: FAINT }}>
              {bar.placeholder}
            </span>
            <button
              type="button"
              onClick={() => onSelectPrompt(bar.prompt)}
              className="rounded-full border-none cursor-pointer px-[20px] py-[10px] text-[13.5px] font-bold"
              style={{ background: YELLOW, color: INK }}
            >
              {bar.cta ?? "Ask Kaira"}
            </button>
          </div>
          <div className="ctl-mono shrink-0" style={{ color: FAINT }}>
            10,000+ trips · rated 4.9
          </div>
        </div>
      </Container>
    </div>

    {/* Mobile: light bar */}
    <div
      className="md:hidden px-[20px] py-[12px]"
      style={{ background: "rgba(250,250,245,0.95)", borderTop: `1px solid ${BORDER}` }}
    >
      <div className="flex items-center gap-[10px] bg-white rounded-full pl-[16px] pr-[8px] py-[8px]">
        <span className="flex-1 text-[13.5px]" style={{ color: "#b8becc" }}>
          {bar.placeholder}
        </span>
        <button
          type="button"
          onClick={() => onSelectPrompt(bar.prompt)}
          className="rounded-full border-none cursor-pointer px-[15px] py-[8px] text-[12.5px] font-semibold"
          style={{ background: INK, color: PAPER }}
        >
          {bar.cta ?? "Ask Kaira"}
        </button>
      </div>
    </div>
  </div>
);

// ── Compact in-page header (mobile only — desktop uses the site nav) ────────
const CompactHeader: React.FC<{ title: string; subtitle?: string }> = ({
  title,
  subtitle,
}) => (
  <div
    className="md:hidden flex items-center gap-[10px] px-[20px] py-[12px]"
    style={{ borderBottom: `1px solid ${BORDER}` }}
  >
    <div
      className="w-[30px] h-[30px] rounded-[8px] flex items-center justify-center font-black text-[16px] shrink-0"
      style={{ background: INK, color: YELLOW, transform: "rotate(-4deg)" }}
    >
      t
    </div>
    <div className="min-w-0">
      <div className="text-[13px] font-bold truncate" style={{ color: INK }}>
        {title}
      </div>
      {subtitle && <div className="ctl-mono" style={{ fontSize: 9 }}>{subtitle}</div>}
    </div>
  </div>
);

// ── Orchestrator ───────────────────────────────────────────────────────────
export interface CinematicThemeLandingProps {
  config: CinematicThemeConfig;
  onSelectPrompt: (prompt: string) => void;
}

const CinematicThemeLanding: React.FC<CinematicThemeLandingProps> = ({
  config,
  onSelectPrompt,
}) => (
  <div className="ctl-root pb-[32px] md:pb-0">
    <CinematicStyles />
    {config.header && (
      <CompactHeader
        title={config.header.title}
        subtitle={config.header.subtitle}
      />
    )}
    <CinematicHero hero={config.hero} onSelectPrompt={onSelectPrompt} />

    {config.sections.map((section, i) => {
      if (section.type === "cards") {
        return (
          <CardsSection key={`sec-${i}`} section={section} onSelectPrompt={onSelectPrompt} />
        );
      }
      if (section.type === "trips") {
        return (
          <TripsSection key={`sec-${i}`} section={section} onSelectPrompt={onSelectPrompt} />
        );
      }
      return (
        <GradientSection key={`sec-${i}`} section={section} onSelectPrompt={onSelectPrompt} />
      );
    })}

    {config.askBar && (
      <AskKairaStrip bar={config.askBar} onSelectPrompt={onSelectPrompt} />
    )}
  </div>
);

export default CinematicThemeLanding;
export {
  CinematicHero,
  CardsSection,
  TripsSection,
  GradientSection,
  AskKairaStrip,
  PromptCard,
  TripCard,
  GradientCard,
};

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
  CinematicPillarCard,
  CinematicListRow,
  CinematicCheckRow,
  CinematicStoryCard,
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
const RED = "#b84034";
const SAND = "#f4f3ec";

// ── Scoped styles ──────────────────────────────────────────────────────────
const CinematicStyles = () => (
  <style
    dangerouslySetInnerHTML={{
      __html: `
      .ctl-root { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background: ${PAPER}; color: ${INK}; }
      .ctl-serif { font-family: 'Instrument Serif', Georgia, 'Times New Roman', serif; font-style: italic; font-weight: 400; }
      .ctl-mono { font-family: ui-monospace, 'JetBrains Mono', 'SFMono-Regular', Menlo, Consolas, monospace; text-transform: uppercase; letter-spacing: 0.14em; font-size: 10px; color: ${FAINT}; }
      .ctl-h { font-family: 'Inter', sans-serif; font-weight: 800; letter-spacing: -0.03em; color: ${INK}; margin: 0; }
      .ctl-h-light { color: ${PAPER}; }
      .ctl-h-yellow { color: ${YELLOW}; }
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
  const imgRef = React.useRef<HTMLImageElement>(null);

  // SSR/hydration guard: the browser can finish loading the image (often from
  // cache) before React hydrates and attaches onLoad, so the `load` event fires
  // into the void and the skeleton would otherwise never clear. On mount, read
  // the already-decoded image and reconcile state ourselves.
  React.useEffect(() => {
    const img = imgRef.current;
    if (!img || !img.complete) return;
    if (img.naturalWidth > 0) setLoaded(true);
    else setError(true);
  }, [src]);

  return (
    <>
      {!loaded && !error && <span className="ctl-skeleton" aria-hidden />}
      <img
        ref={imgRef}
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
    className="ctl-card text-left bg-white rounded-[18px] overflow-hidden flex flex-col cursor-pointer"
  >
    <div className="flex gap-[12px] md:gap-[16px] p-[12px] md:p-[16px]">
      <div
        className="relative w-[78px] h-[78px] md:w-[96px] md:h-[96px] shrink-0 rounded-[12px] md:rounded-[14px] overflow-hidden flex items-center justify-center text-[30px]"
        style={{ background: card.gradient ?? "#eef0f4" }}
      >
        {card.image ? (
          <SkeletonImage
            src={card.image}
            alt={card.name}
            objectPosition={card.objectPosition}
          />
        ) : (
          card.emoji
        )}
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
    </div>
    {card.urgent && (
      <div
        className="flex items-center gap-[8px] px-[14px] py-[8px] mt-auto"
        style={{ background: "#f4f3ec" }}
      >
        <span
          className="w-[6px] h-[6px] rounded-full shrink-0"
          style={{ background: RED }}
        />
        <span className="ctl-mono" style={{ color: RED, fontSize: 8.5 }}>
          {card.urgent}
        </span>
      </div>
    )}
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
        {/* {section.footerCta && (
          <FooterButton cta={section.footerCta} onSelectPrompt={onSelectPrompt} />
        )} */}
      </Container>
    </section>
  );
};

// Full-width outline button under a grid (e.g. "View all destinations →").
const FooterButton: React.FC<{
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
      className="ctl-press mt-[12px] md:mt-[20px] w-full md:w-auto md:mx-auto md:block bg-white rounded-full px-[24px] py-[13px] text-[14px] font-bold cursor-pointer"
      style={{ color: INK, border: `1px solid ${BORDER}` }}
    >
      {cta.label} →
    </button>
  );
};

// ── Pillar card ("Choose Your Arctic Story") ───────────────────────────────
// Gradient/emoji hero tile with a mono window badge, name and line. Mobile:
// 236px wide horizontal scroller. Desktop: fills a 3-col grid cell.
const PillarCard: React.FC<{
  card: CinematicPillarCard;
  onSelectPrompt: (p: string) => void;
}> = ({ card, onSelectPrompt }) => (
  <button
    type="button"
    onClick={() => onSelectPrompt(card.prompt)}
    className="ctl-card text-left bg-white rounded-[22px] overflow-hidden cursor-pointer w-[236px] md:w-auto shrink-0 md:shrink flex flex-col"
    style={{ scrollSnapAlign: "start" }}
  >
    <div
      className="relative h-[128px] md:h-[160px] flex items-center justify-center text-[42px]"
      style={{ background: card.gradient }}
    >
      {card.image ? <SkeletonImage src={card.image} alt={card.name} /> : card.emoji}
      {card.window && (
        <div
          className="ctl-mono absolute top-[10px] left-[10px] px-[8px] py-[3px] rounded-[6px]"
          style={{
            background: "rgba(10,16,32,0.8)",
            color: PAPER,
            backdropFilter: "blur(10px)",
            fontSize: 8.5,
            pointerEvents: "none",
          }}
        >
          {card.window}
        </div>
      )}
    </div>
    <div className="px-[16px] py-[14px]">
      <div
        className="text-[16px] md:text-[17px] font-bold"
        style={{ color: INK, letterSpacing: "-0.01em" }}
      >
        {card.name}
      </div>
      {card.line && (
        <div
          className="text-[13px] leading-[1.5] mt-[3px]"
          style={{ color: MUTED }}
        >
          {card.line}
        </div>
      )}
    </div>
  </button>
);

const PillarsSection: React.FC<{
  section: Extract<CinematicSection, { type: "pillars" }>;
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
        className="ctl-scroll flex md:grid md:grid-cols-3 gap-[12px] md:gap-[16px] mt-[14px] md:mt-[24px] overflow-x-auto md:overflow-visible pb-[4px]"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {section.cards.map((card, i) => (
          <PillarCard key={`pillar-${i}`} card={card} onSelectPrompt={onSelectPrompt} />
        ))}
      </div>
    </Container>
  </section>
);

// ── List row ("Where you'd sleep" / "Worth the cold") ──────────────────────
const ListRow: React.FC<{
  row: CinematicListRow;
  compact?: boolean;
  onSelectPrompt: (p: string) => void;
}> = ({ row, compact, onSelectPrompt }) => {
  const router = useRouter();
  const act = () => {
    if (row.prompt) onSelectPrompt(row.prompt);
    else if (row.href) router.push(row.href);
  };
  return (
    <button
      type="button"
      onClick={act}
      className={`ctl-press w-full text-left flex items-center gap-[12px] md:gap-[14px] bg-white cursor-pointer ${
        compact ? "rounded-[14px] p-[11px] md:p-[12px]" : "rounded-[18px] p-[12px] md:p-[14px]"
      }`}
      style={{ border: `1px solid ${BORDER}` }}
    >
      <div
        className={`relative overflow-hidden shrink-0 flex items-center justify-center ${
          compact
            ? "w-[40px] h-[40px] md:w-[54px] md:h-[54px] rounded-[10px] md:rounded-[12px] text-[19px]"
            : "w-[62px] h-[62px] md:w-[76px] md:h-[76px] rounded-[14px] text-[26px]"
        }`}
        style={{ background: row.gradient }}
      >
        {row.image ? (
          <SkeletonImage
            src={row.image}
            alt={row.name}
            objectPosition={row.objectPosition}
          />
        ) : (
          row.emoji
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-[7px]">
          <span
            className={`font-bold ${compact ? "text-[13.5px] font-semibold" : "text-[15px]"}`}
            style={{ color: INK, letterSpacing: "-0.01em" }}
          >
            {row.name}
          </span>
          {row.badge && (
            <span
              className="ctl-mono"
              style={{
                background: YELLOW,
                color: INK,
                padding: "2px 6px",
                borderRadius: 6,
                transform: "rotate(-1.5deg)",
                fontSize: 8,
              }}
            >
              {row.badge}
            </span>
          )}
        </div>
        {row.line && (
          <div
            className={compact ? "text-[12px]" : "text-[12.5px] leading-[1.45] mt-[2px]"}
            style={{ color: compact ? FAINT : MUTED }}
          >
            {row.line}
          </div>
        )}
      </div>
      <span className="shrink-0 text-[14px]" style={{ color: FAINT }}>
        →
      </span>
    </button>
  );
};

const ListSection: React.FC<{
  section: Extract<CinematicSection, { type: "list" }>;
  onSelectPrompt: (p: string) => void;
}> = ({ section, onSelectPrompt }) => (
  <section className="pt-[32px] md:pt-[56px] pb-[16px] md:pb-[32px]">
    <Container>
      <Heading heading={section.heading} className="text-[22px] md:text-[34px]" />
      <div
        className={`grid grid-cols-1 mt-[16px] md:mt-[24px] ${
          section.compact
            ? "md:grid-cols-3 gap-[8px] md:gap-[12px]"
            : "md:grid-cols-2 gap-[10px] md:gap-[14px]"
        }`}
      >
        {section.rows.map((row, i) => (
          <ListRow
            key={`row-${i}`}
            row={row}
            compact={section.compact}
            onSelectPrompt={onSelectPrompt}
          />
        ))}
      </div>
    </Container>
  </section>
);

// ── Checklist (dark section — "The Santa bit, done properly") ───────────────
const ChecklistSection: React.FC<{
  section: Extract<CinematicSection, { type: "checklist" }>;
  onSelectPrompt: (p: string) => void;
}> = ({ section, onSelectPrompt }) => {
  const router = useRouter();
  return (
    <section
      className="mt-[34px] md:mt-[56px] relative overflow-hidden"
      style={{ background: DARK }}
    >
      <div
        className="absolute pointer-events-none"
        style={{
          top: -80,
          right: -80,
          width: 320,
          height: 320,
          background: "radial-gradient(circle, rgba(247,231,0,0.08), transparent 70%)",
        }}
      />
      <Container className="py-[30px] md:py-[52px]">
        <Heading
          heading={section.heading}
          className="text-[22px] md:text-[34px] ctl-h-light"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[8px] md:gap-[12px] mt-[16px] md:mt-[24px]">
          {section.rows.map((row, i) => {
            const act = () => {
              if (row.prompt) onSelectPrompt(row.prompt);
              else if (row.href) router.push(row.href);
            };
            const clickable = !!(row.prompt || row.href);
            return (
              <button
                key={`check-${i}`}
                type="button"
                onClick={act}
                disabled={!clickable}
                className={`text-left flex items-center gap-[12px] rounded-[14px] px-[13px] py-[11px] ${
                  clickable ? "ctl-press cursor-pointer" : "cursor-default"
                }`}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <span className="text-[19px] shrink-0">{row.emoji}</span>
                <div className="min-w-0">
                  <div
                    className="text-[13.5px] font-semibold"
                    style={{ color: PAPER }}
                  >
                    {row.name}
                  </div>
                  {row.meta && (
                    <div className="ctl-mono mt-[2px]" style={{ fontSize: 8.5 }}>
                      {row.meta}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

// ── Months / timeline ("When to actually go") ──────────────────────────────
const MonthsSection: React.FC<{
  section: Extract<CinematicSection, { type: "months" }>;
}> = ({ section }) => (
  <section
    className="pt-[34px] md:pt-[56px] pb-[4px] md:pb-[8px]"
    style={{ background: DARK }}
  >
    <Container className="pb-[30px] md:pb-[52px]">
      <Heading
        heading={section.heading}
        className="text-[22px] md:text-[34px] ctl-h-yellow"
      />

      {/* Mobile — single white card with divided rows */}
      <div
        className="md:hidden bg-white rounded-[18px] px-[16px] py-[6px] mt-[16px]"
        style={{ border: `1px solid ${BORDER}` }}
      >
        {section.rows.map((row, i) => (
          <div
            key={`month-m-${i}`}
            className="flex gap-[14px] py-[12px]"
            style={{
              borderBottom:
                i < section.rows.length - 1 ? `1px solid ${BORDER}` : "none",
            }}
          >
            <div
              className="ctl-mono shrink-0 pt-[2px] w-[62px]"
              style={{ color: INK, fontSize: 10, fontWeight: 600 }}
            >
              {row.range}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13.5px] font-semibold" style={{ color: INK }}>
                {row.name}
              </div>
              {row.line && (
                <div
                  className="text-[12px] leading-[1.45] mt-[2px]"
                  style={{ color: MUTED }}
                >
                  {row.line}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop — a row of month cards that fills the width */}
      <div className="max-ph:hidden grid grid-cols-2 lg:grid-cols-4 gap-[14px] mt-[24px]">
        {section.rows.map((row, i) => (
          <div
            key={`month-d-${i}`}
            className="bg-white rounded-[16px] p-[18px] flex flex-col"
            style={{ border: `1px solid ${BORDER}` }}
          >
            <div
              className="ctl-mono inline-block self-start px-[8px] py-[3px] rounded-[6px] mb-[12px]"
              style={{ background: YELLOW, color: INK, fontSize: 10, fontWeight: 600 }}
            >
              {row.range}
            </div>
            <div className="text-[16px] font-bold" style={{ color: INK, letterSpacing: "-0.01em" }}>
              {row.name}
            </div>
            {row.line && (
              <div className="text-[13px] leading-[1.5] mt-[4px]" style={{ color: MUTED }}>
                {row.line}
              </div>
            )}
          </div>
        ))}
      </div>

      {section.note && (
        <div
          className="rounded-[14px] px-[14px] md:px-[18px] py-[11px] md:py-[14px] mt-[10px] md:mt-[16px] text-[12px] md:text-[13.5px] leading-[1.5]"
          style={{ background: SAND, color: MUTED }}
        >
          {section.note}
        </div>
      )}
    </Container>
  </section>
);

// ── Stories ("People who went") ─────────────────────────────────────────────
const StoriesSection: React.FC<{
  section: Extract<CinematicSection, { type: "stories" }>;
  onSelectPrompt: (p: string) => void;
}> = ({ section, onSelectPrompt }) => (
  <section className="pt-[34px] md:pt-[56px]">
    <Container>
      <Heading heading={section.heading} className="text-[22px] md:text-[34px]" />
      <div className="ctl-scroll flex md:grid md:grid-cols-3 gap-[10px] md:gap-[16px] mt-[16px] md:mt-[24px] overflow-x-auto md:overflow-visible pb-[4px]">
        {section.cards.map((card: CinematicStoryCard, i) => (
          <button
            key={`story-${i}`}
            type="button"
            onClick={() => card.prompt && onSelectPrompt(card.prompt)}
            className="ctl-card text-left bg-white rounded-[14px] p-[14px] md:p-[18px] w-[208px] md:w-auto shrink-0 md:shrink cursor-pointer"
            style={{ border: `1px solid ${BORDER}` }}
          >
            <div className="flex items-baseline justify-between">
              <span className="ctl-mono" style={{ color: "#f5a623", fontSize: 11 }}>
                ★ {card.rating}
              </span>
              <span className="ctl-mono" style={{ fontSize: 9 }}>
                {card.type}
              </span>
            </div>
            <div
              className="text-[13px] md:text-[14.5px] font-semibold mt-[8px] leading-[1.4]"
              style={{ color: INK }}
            >
              {card.name}
            </div>
            <div className="text-[12px] md:text-[13px] mt-[2px]" style={{ color: MUTED }}>
              {card.route}
            </div>
          </button>
        ))}
      </div>
    </Container>
  </section>
);

// ── Steps (dark section — "Sketch it. I'll finish it.") ─────────────────────
const StepsSection: React.FC<{
  section: Extract<CinematicSection, { type: "steps" }>;
  onSelectPrompt: (p: string) => void;
}> = ({ section, onSelectPrompt }) => {
  const router = useRouter();
  const cta = section.cta;
  return (
    <section
      className="mt-[38px] md:mt-[64px] relative overflow-hidden"
      style={{ background: DARK }}
    >
      <div
        className="absolute pointer-events-none"
        style={{
          top: -80,
          right: -80,
          width: 320,
          height: 320,
          background: "radial-gradient(circle, rgba(247,231,0,0.08), transparent 70%)",
        }}
      />
      <Container className="py-[32px] md:py-[56px]">
        <Heading
          heading={section.heading}
          className="text-[22px] md:text-[34px] ctl-h-light"
        />
        <div className="flex flex-col md:flex-row md:gap-[32px] gap-[14px] mt-[22px] md:mt-[32px]">
          {section.steps.map((st, i) => (
            <div key={`step-${i}`} className="flex items-center gap-[14px] md:flex-1">
              <div
                className="w-[26px] h-[26px] shrink-0 rounded-full flex items-center justify-center"
                style={{
                  background: YELLOW,
                  color: INK,
                  fontFamily: "'Instrument Serif', serif",
                  fontStyle: "italic",
                  fontSize: 14,
                }}
              >
                {st.n}
              </div>
              <div>
                <span className="text-[14px] font-bold" style={{ color: PAPER }}>
                  {st.title}
                </span>
                {st.sub && (
                  <span className="ctl-serif text-[14px]" style={{ color: FAINT }}>
                    {" "}
                    {st.sub}
                  </span>
                )}
                {st.meta && (
                  <div className="ctl-mono mt-[2px]" style={{ fontSize: 9 }}>
                    {st.meta}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        {cta && (
          <button
            type="button"
            onClick={() => {
              if (cta.prompt) onSelectPrompt(cta.prompt);
              else if (cta.href) router.push(cta.href);
            }}
            className="ctl-press mt-[24px] md:mt-[32px] w-full md:w-auto md:px-[40px] rounded-full border-none cursor-pointer px-[14px] py-[14px] text-[15px] font-bold"
            style={{ background: YELLOW, color: INK, boxShadow: "0 8px 20px -10px rgba(247,231,0,0.3)" }}
          >
            {cta.label} →
          </button>
        )}
        {section.note && (
          <div
            className="ctl-mono text-center md:text-left mt-[12px]"
            style={{ fontSize: 9 }}
          >
            {section.note}
          </div>
        )}
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
    {/* {config.header && (
      <CompactHeader
        title={config.header.title}
        subtitle={config.header.subtitle}
      />
    )} */}
    <CinematicHero hero={config.hero} onSelectPrompt={onSelectPrompt} />

    {config.sections.map((section, i) => {
      const key = `sec-${i}`;
      switch (section.type) {
        case "cards":
          return <CardsSection key={key} section={section} onSelectPrompt={onSelectPrompt} />;
        case "trips":
          return <TripsSection key={key} section={section} onSelectPrompt={onSelectPrompt} />;
        case "pillars":
          return <PillarsSection key={key} section={section} onSelectPrompt={onSelectPrompt} />;
        case "list":
          return <ListSection key={key} section={section} onSelectPrompt={onSelectPrompt} />;
        case "checklist":
          return <ChecklistSection key={key} section={section} onSelectPrompt={onSelectPrompt} />;
        case "months":
          return <MonthsSection key={key} section={section} />;
        case "stories":
          return <StoriesSection key={key} section={section} onSelectPrompt={onSelectPrompt} />;
        case "steps":
          return <StepsSection key={key} section={section} onSelectPrompt={onSelectPrompt} />;
        case "gradient":
        default:
          return <GradientSection key={key} section={section} onSelectPrompt={onSelectPrompt} />;
      }
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
  PillarsSection,
  ListSection,
  ChecklistSection,
  MonthsSection,
  StoriesSection,
  StepsSection,
  AskKairaStrip,
  PromptCard,
  TripCard,
  GradientCard,
  PillarCard,
  ListRow,
};

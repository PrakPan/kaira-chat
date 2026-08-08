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
// Resize/re-encode our own media at the edge (see lib/mediaImage.js). These
// scene stills are 1–4 MB PNGs shown in small cards; this cuts them ~30-100×
// with no visible change. Non-media srcs pass through untouched.
import { optimizedMediaUrl } from "../../../lib/mediaImage";
import Head from "next/head";
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
  CinematicEatCard,
  CinematicVisaCard,
  CinematicFeatureCta,
  CinematicHeroConfig,
  CinematicAskBar,
  CinematicThemePalette,
} from "./types";
import {
  ThemeSelectionProvider,
  useThemeSelection,
  type ThemeSelectionValue,
} from "./ThemeSelection";

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

// Pull a catalog element id out of a drawer href (e.g. "?restaurant_id=abc",
// "?city_id=xyz") so a saved element carries its id in the /chatkit request.
const drawerIdFromHref = (href?: string): string | undefined => {
  const m = href?.match(/[?&][a-z_]*id=([^&]+)/i);
  return m ? decodeURIComponent(m[1]) : undefined;
};

// ── Theme palette ──────────────────────────────────────────────────────────
// Every card, CTA and the docked bar read their action colour from here rather
// than hard-coding the brand yellow, so one page can be Hokkaido blue and the
// next Hogmanay purple with no layout change. A page opts in via
// `config.theme`; pages that don't fall back to the neutral ink treatment.
type ResolvedPalette = Required<CinematicThemePalette>;

const DEFAULT_PALETTE: ResolvedPalette = {
  accent: INK,
  accentSoft: SAND,
  accentOn: "#ffffff",
  page: PAPER,
  heroTint: "transparent",
};

const PaletteContext = React.createContext<ResolvedPalette>(DEFAULT_PALETTE);
const usePalette = (): ResolvedPalette => React.useContext(PaletteContext);

const resolvePalette = (theme?: CinematicThemePalette): ResolvedPalette => ({
  ...DEFAULT_PALETTE,
  ...(theme
    ? {
        accent: theme.accent,
        accentSoft: theme.accentSoft,
        ...(theme.accentOn ? { accentOn: theme.accentOn } : {}),
        ...(theme.page ? { page: theme.page } : {}),
        ...(theme.heroTint ? { heroTint: theme.heroTint } : {}),
      }
    : {}),
});

// ── Card chrome ────────────────────────────────────────────────────────────
// The new card look: a white tile with a hairline border and an 18px radius
// that lifts on hover (the lift/shadow itself lives on .ctl-card). Sand-toned
// sections use a slightly warmer line so the border still reads against them.
const cardChrome = (onSand?: boolean): React.CSSProperties => ({
  background: "#ffffff",
  border: `1px solid ${onSand ? "#e6e3d6" : BORDER}`,
});

const DARK_CARD: React.CSSProperties = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
};

// The mono badge that floats over a card image (city, nights, "2h from
// Sapporo"): frosted white on light cards so it reads over any photo.
const IMAGE_BADGE: React.CSSProperties = {
  background: "rgba(255,255,255,0.94)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  color: INK,
  fontSize: 9.5,
  pointerEvents: "none",
};

// ── Selection CTA ──────────────────────────────────────────────────────────
// One shared treatment for every "+ Add" / "✓ Added" pill on the page: ink
// while it's an invitation, green once the item is in the trip, so a scan of
// the page shows exactly what's been saved. This pair is deliberately NOT
// theme-tinted — the accent stays reserved for the docked bar and the trip
// itself, and green reads as "saved" on every theme. Dark sections (the
// restaurant/feature scrollers on midnight) swap to a translucent-white /
// muted-green pair, since solid ink disappears against that background.
const GREEN = "#1f8a5a";

const addCtaStyle = (
  selected: boolean,
  dark?: boolean,
): React.CSSProperties => {
  if (dark)
    return selected
      ? {
          background: "rgba(31,138,90,0.18)",
          color: "#4fbf87",
          border: "1px solid rgba(31,138,90,0.45)",
        }
      : {
          background: "rgba(255,255,255,0.08)",
          color: PAPER,
          border: "1px solid rgba(255,255,255,0.16)",
        };
  return selected
    ? { background: GREEN, color: "#ffffff", border: `1px solid ${GREEN}` }
    : { background: INK, color: PAPER, border: `1px solid ${INK}` };
};

const addCtaLabel = (selected: boolean) => (selected ? "✓ Added" : "+ Add");

// Primary card action ("Create this plan →", "Book this itinerary →") — an
// outlined white pill that spans the card foot. It reads as the quieter of the
// two actions on a card row so the ink "+ Add" pills stay the loudest thing.
const PRIMARY_CTA: React.CSSProperties = {
  background: "#ffffff",
  color: INK,
  border: `1px solid ${INK}`,
};

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
      .ctl-card { transition: transform .25s cubic-bezier(.2,.7,.3,1), box-shadow .25s cubic-bezier(.2,.7,.3,1); }
      .ctl-card:hover { transform: translateY(-2px); box-shadow: 0 8px 20px -10px rgba(11,18,32,0.15); }
      .ctl-press { transition: transform .15s cubic-bezier(.2,.7,.3,1); }
      .ctl-press:hover { transform: translateY(-1px); }
      .ctl-scroll { scrollbar-width: none; -ms-overflow-style: none; }
      .ctl-scroll::-webkit-scrollbar { display: none; }
      /* Snapping carousels: a card scrolled to always lands flush with the
         section's left gutter rather than the viewport edge. */
      .ctl-rail { scroll-snap-type: x mandatory; scroll-padding-left: 0; }
      .ctl-rail > * { scroll-snap-align: start; }
      /* Docked-bar build button — a slow highlight sweep so the primary action
         stays alive without animating colour. The sweeping layer is the full
         width of the button (the band itself is painted as a no-repeat
         background), so translating it ±100% crosses the whole button at any
         width — a fixed pixel/percent travel would stall halfway on desktop. */
      .ctl-sheen { position: absolute; inset: 0; pointer-events: none; background-image: linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent); background-size: 64px 100%; background-repeat: no-repeat; background-position: left center; animation: ctlBarShimmer 3s cubic-bezier(.4,0,.2,1) infinite; }
      @keyframes ctlBarShimmer { 0% { transform: translateX(-100%) skewX(-18deg); } 55%, 100% { transform: translateX(100%) skewX(-18deg); } }
      @keyframes ctlPulseRing { 0% { box-shadow: 0 0 0 0 rgba(31,138,90,0.4); } 70% { box-shadow: 0 0 0 6px rgba(31,138,90,0); } 100% { box-shadow: 0 0 0 0 rgba(31,138,90,0); } }
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
  // "cover" (default) fills+crops the frame; "contain" shows the whole image
  // centered, letterboxed against the parent backdrop.
  objectFit?: "cover" | "contain";
  // The LCP image (first card of the first section) sets priority so it loads
  // eagerly and at high fetch priority. Every other image lazy-loads, so the
  // ~40 off-screen cards no longer download on first paint.
  priority?: boolean;
  // Edge-resize target. Cards render ≤360px CSS, so 640 covers 2× retina while
  // being ~half the bytes of the old flat 900. Callers with a larger frame
  // (full-bleed heroes) can raise it.
  width?: number;
}> = ({
  src,
  alt,
  objectPosition,
  objectFit,
  priority = false,
  width = 640,
}) => {
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
        src={optimizedMediaUrl(src, { width })}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className="absolute inset-0 w-full h-full"
        style={{
          objectFit: objectFit ?? "cover",
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
  const palette = usePalette();
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
    <div
      // The theme's wash, faded out over the top of the page. Sits behind the
      // hero only; every section below keeps the plain page background.
      style={{
        background: `linear-gradient(180deg, ${palette.heroTint} 0%, rgba(250,250,245,0) 78%)`,
      }}
    >
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
    </div>
  );
};

// ── Image card (Bollywood / Hollywood rows) ────────────────────────────────
// Mobile: 220px wide, 130px image. Desktop: fills a 3-col grid cell, 200px image.
const PromptCard: React.FC<{
  card: CinematicPromptCard;
  onSelectPrompt: (p: string) => void;
  onSelectActivity?: (activityId: string, source?: string) => void;
  ctaLabel?: string;
  ctaTone?: "solid" | "dark";
  priority?: boolean;
  // Section opted the whole row into "+ Add" selection; derive the item from
  // the card unless it carries an explicit one.
  sectionSelectable?: boolean;
  itemKind?: string;
  // The card sits on a sand-toned band, so it needs the warmer hairline.
  onSand?: boolean;
}> = ({
  card,
  onSelectPrompt,
  onSelectActivity,
  ctaLabel,
  ctaTone,
  priority,
  sectionSelectable,
  itemKind,
  onSand,
}) => {
  const selection = useThemeSelection();
  // The saved item: an explicit card.item wins; else derive from the card when
  // the section is selectable. An activity card carries its catalog id so the
  // element id rides along in the request.
  const item =
    card.item ??
    (sectionSelectable
      ? {
          kind: itemKind ?? "poi",
          label: card.name,
          short: card.tag ?? card.name,
          ...(card.activityId ? { id: card.activityId } : {}),
        }
      : undefined);
  const selectable = !!(item && selection);
  const selected = selectable ? selection!.isSelected(item!) : false;
  // Element cards (an activity drawer) keep opening the drawer on body click —
  // the "+ Add" CTA does the saving. Non-element selectable cards toggle on
  // body click as before.
  const isElement = selectable && !!card.activityId;
  const toggle = () => item && selection && selection.toggle(item);
  return (
  <button
    type="button"
    onClick={() => {
      if (isElement) {
        onSelectActivity?.(card.activityId!, card.activitySource);
        return;
      }
      if (item && selection) {
        selection.toggle(item);
        return;
      }
      if (card.activityId && onSelectActivity)
        onSelectActivity(card.activityId, card.activitySource);
      else if (card.prompt) onSelectPrompt(card.prompt);
    }}
    aria-pressed={selectable ? selected : undefined}
    className="ctl-card group flex flex-col text-left rounded-[18px] overflow-hidden cursor-pointer w-[262px] md:w-auto shrink-0 md:shrink"
    style={{
      ...cardChrome(onSand),
      ...(selected ? { borderColor: GREEN } : {}),
    }}
  >
    <div
      className="relative h-[148px] md:h-[160px] overflow-hidden"
      style={{ background: SAND }}
    >
      <SkeletonImage
        src={card.image}
        alt={card.name}
        priority={priority}
        // Top-align the crop so heads/faces stay in frame and any excess is cut
        // from the bottom rather than off the top. Per-card override still wins.
        objectPosition={card.objectPosition ?? "center top"}
      />
      {card.tag && (
        <div
          className="ctl-mono absolute top-[10px] left-[10px] px-[8px] py-[3px] rounded-[6px]"
          style={IMAGE_BADGE}
        >
          {card.tag}
        </div>
      )}
    </div>
    <div className="flex flex-col flex-1 px-[17px] py-[16px] md:px-[18px] md:py-[17px]">
      <div
        className="text-[15px] md:text-[16.5px] font-bold leading-[1.3]"
        style={{ color: INK, letterSpacing: "-0.01em" }}
      >
        {card.name}
      </div>
      {card.line && (
        <div
          className="text-[12.5px] md:text-[13.5px] leading-[1.5] mt-[8px] flex-1"
          style={{ color: MUTED }}
        >
          {card.line}
        </div>
      )}
      {(ctaLabel || selectable) && (
        <div className="mt-auto pt-[14px]">
          <span
            role={selectable ? "button" : undefined}
            onClick={
              selectable
                ? (e) => {
                    // The Add CTA saves the item; on element cards this stops the
                    // click from reaching the card body (which opens the drawer).
                    e.stopPropagation();
                    toggle();
                  }
                : undefined
            }
            className="block w-full text-center rounded-full text-[12.5px] md:text-[13px] font-bold px-[14px] py-[10px]"
            style={
              selectable
                ? addCtaStyle(selected)
                : ctaTone === "dark"
                  ? { background: INK, color: PAPER, border: `1px solid ${INK}` }
                  : PRIMARY_CTA
            }
          >
            {selectable ? addCtaLabel(selected) : ctaLabel}
          </span>
        </div>
      )}
    </div>
  </button>
  );
};

const CardsSection: React.FC<{
  section: Extract<CinematicSection, { type: "cards" }>;
  onSelectPrompt: (p: string) => void;
  onSelectActivity?: (activityId: string, source?: string) => void;
  // True for the first section on the page — its first card is the LCP image
  // on mobile (the hero collage is desktop-only), so it loads eagerly.
  first?: boolean;
}> = ({ section, onSelectPrompt, onSelectActivity, first }) => (
  <section
    className={`pt-[30px] md:pt-[56px] ${
      section.tone === "sand" ? "pb-[30px] md:pb-[52px]" : ""
    }`}
    style={section.tone === "sand" ? { background: SAND } : undefined}
  >
    <Container>
      <div className="flex items-end justify-between gap-[16px]">
        <Heading heading={section.heading} className="text-[22px] md:text-[34px]" />
        {section.cta && (
          <div className="max-ph:hidden">
            <SectionCta cta={section.cta} onSelectPrompt={onSelectPrompt} />
          </div>
        )}
      </div>
      <div className="ctl-scroll ctl-rail flex md:grid md:grid-cols-3 gap-[12px] md:gap-[20px] mt-[12px] md:mt-[24px] overflow-x-auto md:overflow-visible pt-[4px] pb-[10px]">
        {section.cards.map((card, i) => (
          <PromptCard
            key={`card-${i}`}
            card={card}
            onSelectPrompt={onSelectPrompt}
            onSelectActivity={onSelectActivity}
            ctaLabel={section.ctaLabel}
            ctaTone={section.ctaTone}
            sectionSelectable={section.selectable}
            itemKind={section.itemKind}
            onSand={section.tone === "sand"}
            priority={first && i === 0}
          />
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
  ctaLabel?: string;
}> = ({ card, onSelectPrompt, ctaLabel }) => {
  const router = useRouter();
  const act = () => {
    if (card.href) router.push(card.href);
    else if (card.prompt) onSelectPrompt(card.prompt);
  };
  return (
  <button
    type="button"
    onClick={act}
    className="ctl-card text-left rounded-[18px] overflow-hidden flex flex-col h-full cursor-pointer"
    style={cardChrome()}
  >
    {/* Everything above the CTA lives in one flexible block so the button
        always lands on the card's bottom edge — cards in the same grid row
        stretch to equal height, and their CTAs line up regardless of how long
        the copy is or whether the card carries an urgency notice. */}
    <div className="flex gap-[15px] md:gap-[16px] p-[16px] flex-1">
      <div
        className="relative w-[104px] h-[104px] md:w-[112px] md:h-[112px] shrink-0 rounded-[14px] overflow-hidden flex items-center justify-center text-[30px]"
        style={{ background: card.gradient ?? SAND }}
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
        {card.urgent && (
          <div className="flex items-start gap-[8px] mt-[10px]">
            <span
              className="w-[6px] h-[6px] rounded-full shrink-0 mt-[4px]"
              style={{ background: RED }}
            />
            <span
              className="ctl-mono"
              style={{ color: RED, fontSize: 9.5, lineHeight: 1.4 }}
            >
              {card.urgent}
            </span>
          </div>
        )}
      </div>
    </div>
    {ctaLabel && (
      <div className="px-[16px] pb-[16px]">
        <span
          className="block w-full text-center rounded-full text-[13px] font-semibold px-[14px] py-[11px]"
          style={PRIMARY_CTA}
        >
          {ctaLabel}
        </span>
      </div>
    )}
  </button>
  );
};

const TripsSection: React.FC<{
  section: Extract<CinematicSection, { type: "trips" }>;
  onSelectPrompt: (p: string) => void;
}> = ({ section, onSelectPrompt }) => (
  <section className="pt-[30px] md:pt-[56px]">
    <Container>
      <Heading heading={section.heading} className="text-[22px] md:text-[34px]" />
      <div className="flex flex-col md:grid md:grid-cols-3 gap-[10px] md:gap-[16px] mt-[14px] md:mt-[24px]">
        {section.cards.map((card, i) => (
          <TripCard
            key={`trip-${i}`}
            card={card}
            onSelectPrompt={onSelectPrompt}
            ctaLabel={section.ctaLabel}
          />
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
      className={`ctl-card text-left overflow-hidden cursor-pointer ${
        compact
          ? "rounded-[14px]"
          : "rounded-[18px] w-[160px] md:w-auto shrink-0 md:shrink"
      }`}
      style={cardChrome(true)}
    >
      <div
        className={`relative overflow-hidden flex items-center justify-center ${
          compact
            ? "h-[90px] md:h-[100px] text-[26px] md:text-[30px]"
            : "h-[100px] md:h-[110px] text-[30px] md:text-[32px]"
        }`}
        style={{ background: card.gradient }}
      >
        {card.image ? (
          <SkeletonImage src={card.image} alt={card.name} />
        ) : (
          card.emoji
        )}
      </div>
      <div className="px-[14px] pt-[12px] pb-[14px]">
        <div
          className={`font-bold leading-[1.25] ${
            compact ? "text-[13px] md:text-[13.5px]" : "text-[13px] md:text-[14px]"
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
          <div className="ctl-mono" style={{ fontSize: 9.5, marginTop: 5 }}>
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
          className={`ctl-scroll ctl-grad-${cols} mt-[14px] md:mt-[24px] gap-[12px] md:gap-[14px] ${
            section.mobileGrid
              ? "grid grid-cols-2"
              : "ctl-rail flex overflow-x-auto pt-[4px] pb-[8px]"
          }`}
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
    className="ctl-card text-left rounded-[18px] overflow-hidden cursor-pointer w-[262px] md:w-auto shrink-0 md:shrink flex flex-col"
    style={cardChrome()}
  >
    <div
      className="relative h-[148px] md:h-[160px] flex items-center justify-center text-[42px]"
      style={{ background: card.gradient }}
    >
      {card.image ? <SkeletonImage src={card.image} alt={card.name} /> : card.emoji}
      {card.window && (
        <div
          className="ctl-mono absolute top-[10px] left-[10px] px-[8px] py-[3px] rounded-[6px]"
          style={IMAGE_BADGE}
        >
          {card.window}
        </div>
      )}
    </div>
    <div className="px-[17px] py-[17px]">
      <div
        className="text-[15px] md:text-[16.5px] font-bold leading-[1.3]"
        style={{ color: INK, letterSpacing: "-0.01em" }}
      >
        {card.name}
      </div>
      {card.line && (
        <div
          className="text-[12.5px] md:text-[13.5px] leading-[1.5] mt-[8px]"
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
      <div className="ctl-scroll ctl-rail flex md:grid md:grid-cols-3 gap-[12px] md:gap-[20px] mt-[14px] md:mt-[24px] overflow-x-auto md:overflow-visible pt-[4px] pb-[10px]">
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
  onSelectActivity?: (activityId: string, source?: string) => void;
  sectionSelectable?: boolean;
  itemKind?: string;
}> = ({ row, compact, onSelectPrompt, onSelectActivity, sectionSelectable, itemKind }) => {
  const router = useRouter();
  const selection = useThemeSelection();
  const elementId = row.activityId ?? drawerIdFromHref(row.href);
  const item = sectionSelectable
    ? {
        kind: itemKind ?? "poi",
        label: row.name,
        short: row.name,
        ...(elementId ? { id: elementId } : {}),
      }
    : undefined;
  const selectable = !!(item && selection);
  const selected = selectable ? selection!.isSelected(item!) : false;
  // An element row (activity drawer or a drawer href) keeps opening the drawer
  // on body click; the "+ Add" pill saves it.
  const isElement = selectable && !!(row.activityId || row.href);
  const toggle = () => item && selection && selection.toggle(item);
  const act = () => {
    if (isElement) {
      if (row.activityId && onSelectActivity)
        onSelectActivity(row.activityId, row.activitySource);
      else if (row.href) router.push(row.href);
      return;
    }
    if (item && selection) {
      selection.toggle(item);
      return;
    }
    if (row.activityId && onSelectActivity)
      onSelectActivity(row.activityId, row.activitySource);
    else if (row.prompt) onSelectPrompt(row.prompt);
    else if (row.href) router.push(row.href);
  };
  return (
    <button
      type="button"
      onClick={act}
      aria-pressed={selectable ? selected : undefined}
      className={`ctl-card w-full text-left flex items-center gap-[12px] md:gap-[14px] cursor-pointer ${
        compact ? "rounded-[14px] p-[11px] md:p-[12px]" : "rounded-[18px] p-[14px] md:p-[16px]"
      }`}
      style={{
        ...cardChrome(),
        ...(selected ? { borderColor: GREEN } : {}),
      }}
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
      {selectable ? (
        <span
          role="button"
          onClick={(e) => {
            e.stopPropagation();
            toggle();
          }}
          className="shrink-0 rounded-full text-[12px] font-bold"
          style={{ ...addCtaStyle(selected), padding: "8px 14px" }}
        >
          {addCtaLabel(selected)}
        </span>
      ) : (
        <span className="shrink-0 text-[14px]" style={{ color: FAINT }}>
          →
        </span>
      )}
    </button>
  );
};

const ListSection: React.FC<{
  section: Extract<CinematicSection, { type: "list" }>;
  onSelectPrompt: (p: string) => void;
  onSelectActivity?: (activityId: string, source?: string) => void;
}> = ({ section, onSelectPrompt, onSelectActivity }) => (
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
            onSelectActivity={onSelectActivity}
            sectionSelectable={section.selectable}
            itemKind={section.itemKind}
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
}> = ({ section, onSelectPrompt }) => {
  const router = useRouter();
  const palette = usePalette();
  return (
  <section className="pt-[34px] md:pt-[56px]">
    <Container>
      <Heading heading={section.heading} className="text-[22px] md:text-[34px]" />
      <div className="ctl-scroll ctl-rail flex md:grid md:grid-cols-3 gap-[12px] md:gap-[20px] mt-[16px] md:mt-[24px] overflow-x-auto md:overflow-visible pt-[4px] pb-[10px]">
        {section.cards.map((card: CinematicStoryCard, i) => (
          <button
            key={`story-${i}`}
            type="button"
            onClick={() => {
              // A traveller's real itinerary (/chat/{id}) opens; otherwise seed.
              if (card.href) router.push(card.href);
              else if (card.prompt) onSelectPrompt(card.prompt);
            }}
            className="ctl-card text-left rounded-[18px] p-[17px] md:p-[20px] w-[262px] md:w-auto shrink-0 md:shrink cursor-pointer"
            style={cardChrome()}
          >
            <div className="flex items-baseline justify-between">
              <span className="ctl-mono" style={{ color: "#f5a623", fontSize: 11 }}>
                ★ {card.rating}
              </span>
              <span className="ctl-mono" style={{ fontSize: 9.5 }}>
                {card.type}
              </span>
            </div>
            <div
              className="text-[14px] md:text-[15px] font-bold mt-[10px] leading-[1.4]"
              style={{ color: INK }}
            >
              {card.name}
            </div>
            <div
              className="ctl-mono inline-block mt-[12px] px-[9px] py-[5px] rounded-[6px]"
              style={{
                background: palette.accentSoft,
                color: palette.accent,
                fontSize: 9.5,
              }}
            >
              {card.route}
            </div>
          </button>
        ))}
      </div>
    </Container>
  </section>
  );
};

// ── Eats (dark — "Where to come in from the cold") ──────────────────────────
// A dark card scroller of warm indoor spots: cover image, name, city (yellow),
// a line, and a rating. Clicking seeds the card's prompt.
const EatsSection: React.FC<{
  section: Extract<CinematicSection, { type: "eats" }>;
  onSelectPrompt: (p: string) => void;
}> = ({ section, onSelectPrompt }) => {
  const router = useRouter();
  const selection = useThemeSelection();
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
    <Container className="pt-[30px] md:pt-[52px] pb-[30px] md:pb-[52px]">
      <Heading
        heading={section.heading}
        className="text-[22px] md:text-[34px] ctl-h-light"
      />
      <div className="ctl-scroll ctl-rail flex md:grid md:grid-cols-5 gap-[12px] md:gap-[16px] mt-[14px] md:mt-[24px] overflow-x-auto md:overflow-visible pt-[4px] pb-[10px]">
        {section.cards.map((card, i) => {
          const hrefId = drawerIdFromHref(card.href);
          const item =
            card.item ??
            (section.selectable
              ? {
                  kind: section.itemKind ?? "restaurant",
                  label: card.name,
                  short: card.name,
                  ...(hrefId ? { id: hrefId } : {}),
                }
              : undefined);
          const selectable = !!(item && selection);
          const selected = selectable ? selection!.isSelected(item!) : false;
          // A restaurant card with a drawer href keeps opening the drawer on
          // body click; the "+ Add" CTA saves it.
          const isElement = selectable && !!card.href;
          const toggle = () => item && selection && selection.toggle(item);
          return (
          <button
            key={`eat-${i}`}
            type="button"
            onClick={() => {
              if (isElement) {
                router.push(card.href!);
                return;
              }
              if (item && selection) {
                selection.toggle(item);
                return;
              }
              if (card.href) router.push(card.href);
              else if (card.prompt) onSelectPrompt(card.prompt);
            }}
            aria-pressed={selectable ? selected : undefined}
            className="ctl-card text-left rounded-[18px] overflow-hidden cursor-pointer w-[224px] md:w-auto shrink-0 md:shrink flex flex-col"
            style={{
              ...DARK_CARD,
              ...(selected
                ? { border: "1px solid rgba(31,138,90,0.45)" }
                : {}),
            }}
          >
          <div
            className="relative h-[132px] md:h-[150px] overflow-hidden"
            style={{ background: "rgba(255,255,255,0.04)" }}
          >
            <SkeletonImage
              src={card.image}
              alt={card.name}
              objectPosition={card.objectPosition}
            />
          </div>
          <div className="flex flex-col flex-1 px-[16px] py-[16px]">
            <div className="flex items-baseline justify-between gap-[8px]">
              <span
                className="text-[14.5px] font-bold"
                style={{ color: PAPER, letterSpacing: "-0.01em" }}
              >
                {card.name}
              </span>
              {card.city && (
                <span
                  className="ctl-mono shrink-0"
                  style={{ color: "#ffe5d1", fontSize: 9.5 }}
                >
                  {card.city}
                </span>
              )}
            </div>
            {card.line && (
              <div
                className="text-[12.5px] leading-[1.5] mt-[8px] flex-1"
                style={{ color: FAINT }}
              >
                {card.line}
              </div>
            )}
            {(card.rating || card.reviews) && (
              <div className="ctl-mono mt-[14px]" style={{ fontSize: 9.5 }}>
                <span style={{ color: "#f5a623" }}>★</span>{" "}
                {card.rating ? `${card.rating}` : ""}
                {card.rating && card.reviews ? " · " : ""}
                {card.reviews ? `${card.reviews} reviews` : ""}
              </div>
            )}
            {(section.ctaLabel || selectable) && (
              <span
                role={selectable ? "button" : undefined}
                onClick={
                  selectable
                    ? (e) => {
                        e.stopPropagation();
                        toggle();
                      }
                    : undefined
                }
                className="block w-full text-center rounded-full text-[12.5px] font-semibold px-[12px] py-[10px] mt-[12px]"
                style={
                  selectable
                    ? addCtaStyle(selected, true)
                    : addCtaStyle(false, true)
                }
              >
                {selectable ? addCtaLabel(selected) : section.ctaLabel}
              </span>
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

// ── Visa (dark — "Your visa, handled") ──────────────────────────────────────
// Intro copy, a scroller of country fee cards (each links to its visa page),
// and a row of fact chips.
const VisaSection: React.FC<{
  section: Extract<CinematicSection, { type: "visa" }>;
}> = ({ section }) => (
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
    <Container className="pt-[30px] md:pt-[52px]">
      <Heading
        heading={section.heading}
        className="text-[22px] md:text-[34px] ctl-h-light"
      />
      {section.intro && (
        <p
          className="text-[13.5px] md:text-[15px] leading-[1.55] mt-[10px] md:mt-[14px] max-w-[560px]"
          style={{ color: FAINT }}
        >
          {section.intro}
        </p>
      )}
      <div className="ctl-mono mt-[16px] md:mt-[20px]">Visa fee by country</div>
      <div className="ctl-scroll ctl-rail flex gap-[12px] overflow-x-auto md:overflow-visible pt-[10px] pb-[6px]">
      {section.cards.map((card: CinematicVisaCard, i) => {
        const inner = (
          <>
            <div className="flex-1">
              <div
                className="text-[15px] font-bold leading-[1.25]"
                style={{ color: PAPER, letterSpacing: "-0.01em" }}
              >
                {card.country}
              </div>
              {card.cities && (
                <div
                  className="ctl-mono mt-[7px]"
                  style={{ fontSize: 9, lineHeight: 1.5 }}
                >
                  {card.cities}
                </div>
              )}
            </div>
            <div
              className="pt-[13px]"
              style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
            >
              {card.fee && (
                <div
                  className="ctl-mono"
                  style={{ color: YELLOW, fontSize: 15, fontWeight: 600 }}
                >
                  {card.fee}
                </div>
              )}
              <div className="ctl-mono mt-[4px]" style={{ fontSize: 9 }}>
                per person
              </div>
            </div>
          </>
        );
        const cls =
          "shrink-0 w-[158px] h-[168px] box-border flex flex-col rounded-[18px] p-[16px] cursor-pointer no-underline";
        const st: React.CSSProperties = { ...DARK_CARD };
        return card.href ? (
          <a
            key={`visa-${i}`}
            href={card.href}
            target="_blank"
            rel="noopener noreferrer"
            className={cls}
            style={st}
          >
            {inner}
          </a>
        ) : (
          <div key={`visa-${i}`} className={cls} style={st}>
            {inner}
          </div>
        );
      })}
      </div>
    </Container>
    {section.facts && section.facts.length > 0 && (
      <Container className="pb-[30px] md:pb-[52px]">
        <div className="flex gap-[8px] mt-[18px]">
          {section.facts.map((f, i) => (
            <div
              key={`fact-${i}`}
              className="flex-1 rounded-[14px] px-[13px] py-[12px]"
              style={{
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(247,231,0,0.10)",
              }}
            >
              <div
                className="ctl-mono text-center"
                style={{ fontSize: 9 }}
              >
                {f.label}
              </div>
              <div
                className="text-[13px] font-semibold text-center mt-[4px] leading-[1.25]"
                style={{ color: PAPER }}
              >
                {f.value}
              </div>
            </div>
          ))}
        </div>
        {section.note && (
          <div
            className="rounded-[14px] px-[14px] md:px-[18px] py-[11px] md:py-[14px] mt-[12px] text-[12px] md:text-[13.5px] leading-[1.5]"
            style={{ background: "rgba(255,255,255,0.04)", color: FAINT }}
          >
            {section.note}
          </div>
        )}
      </Container>
    )}
  </section>
);

// ── Feature (dark — "A bullet train under the ocean floor") ─────────────────
// Highlighted fact rows, a 3-up stat grid, and a yellow CTA card that opens the
// read-only activity drawer (e.g. the JR Pass) or seeds a prompt.
const FeatureCtaCard: React.FC<{
  cta: CinematicFeatureCta;
  onSelectPrompt: (p: string) => void;
  onSelectActivity?: (activityId: string, source?: string) => void;
}> = ({ cta, onSelectPrompt, onSelectActivity }) => {
  const router = useRouter();
  const act = () => {
    if (cta.activityId && onSelectActivity)
      onSelectActivity(cta.activityId, cta.activitySource);
    else if (cta.prompt) onSelectPrompt(cta.prompt);
    else router.push("/chat");
  };
  return (
    <button
      type="button"
      onClick={act}
      className="ctl-press w-full text-left flex items-center gap-[14px] rounded-[18px] px-[18px] py-[17px] mt-[12px] cursor-pointer"
      style={{
        background: "rgba(247,231,0,0.10)",
        border: "1px solid rgba(247,231,0,0.28)",
      }}
    >
      <div className="flex-1 min-w-0">
        <div className="text-[14.5px] font-bold" style={{ color: PAPER }}>
          {cta.title}
        </div>
        {cta.meta && (
          <div className="ctl-mono mt-[5px]" style={{ fontSize: 9.5 }}>
            {cta.meta}
          </div>
        )}
      </div>
      <span
        className="shrink-0 rounded-full px-[16px] py-[10px] text-[12.5px] font-semibold whitespace-nowrap"
        style={addCtaStyle(false, true)}
      >
        + Add
      </span>
    </button>
  );
};

const FeatureSection: React.FC<{
  section: Extract<CinematicSection, { type: "feature" }>;
  onSelectPrompt: (p: string) => void;
  onSelectActivity?: (activityId: string, source?: string) => void;
}> = ({ section, onSelectPrompt, onSelectActivity }) => (
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
        background: "radial-gradient(circle, rgba(247,231,0,0.10), transparent 70%)",
      }}
    />
    <Container className="py-[36px] md:py-[56px]">
      <Heading
        heading={section.heading}
        className="text-[24px] md:text-[38px] ctl-h-light"
      />
      {section.intro && (
        <p
          className="text-[13.5px] md:text-[15px] leading-[1.55] mt-[10px] md:mt-[14px] max-w-[620px]"
          style={{ color: FAINT }}
        >
          {section.intro}
        </p>
      )}

      {section.rows && section.rows.length > 0 && (
        <div className="flex flex-col gap-[10px] mt-[18px] md:mt-[24px]">
          {section.rows.map((row, i) => (
            <div
              key={`frow-${i}`}
              className="flex items-baseline gap-[14px] rounded-[14px] px-[16px] py-[15px]"
              style={{
                background: "rgba(247,231,0,0.07)",
                border: "1px solid rgba(247,231,0,0.18)",
              }}
            >
              <div
                className="ctl-mono shrink-0 w-[62px]"
                style={{ color: YELLOW, fontSize: 12, fontWeight: 600 }}
              >
                {row.stat}
              </div>
              <div className="flex-1 min-w-0">
                <div
                  className="text-[13.5px] font-semibold"
                  style={{ color: PAPER }}
                >
                  {row.name}
                </div>
                {row.line && (
                  <div
                    className="text-[12.5px] leading-[1.5] mt-[3px]"
                    style={{ color: FAINT }}
                  >
                    {row.line}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {section.stats && section.stats.length > 0 && (
        <div className="grid grid-cols-3 gap-[8px] md:gap-[12px] mt-[12px]">
          {section.stats.map((s, i) => (
            <div
              key={`fstat-${i}`}
              className="rounded-[14px] px-[12px] py-[15px] md:px-[16px] md:py-[18px]"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div
                className="ctl-h ctl-h-light text-[21px] md:text-[26px]"
                style={{ letterSpacing: "-0.03em" }}
              >
                {s.stat}
              </div>
              <div
                className="ctl-mono mt-[7px] leading-[1.5]"
                style={{ fontSize: 8.5 }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      )}

      {section.cta && (
        <FeatureCtaCard
          cta={section.cta}
          onSelectPrompt={onSelectPrompt}
          onSelectActivity={onSelectActivity}
        />
      )}
    </Container>
  </section>
);

// ── Ask-Kaira strip ("Docked composer") ─────────────────────────────────────
// A single, shared design used on every theme page (matches the theme mockup):
// a paper-tinted, blurred bar pinned to the bottom of the viewport with a white
// pill inside — the placeholder question on the left, a dark "Ask Kaira" button
// on the right. Identical on mobile and desktop; the pill just caps its width
// and centers on wider screens. Hidden until the reader scrolls past half the
// first viewport (same reveal as the site-wide <Banner/>). The button seeds the
// bar's prompt into a fresh /chat session via `onSelectPrompt`.
const AskKairaStrip: React.FC<{
  bar: CinematicAskBar;
  onSelectPrompt: (p: string) => void;
  // "Build this itinerary" action. When provided, the build button (and the
  // selection popup) call this instead of seeding a prompt — the page routes to
  // /chat and opens the themed mini-form there. Falls back to seeding
  // bar.buildPrompt when omitted.
  onBuild?: () => void;
  // Kaira's avatar for the round chat button at the end of the action row.
  avatar?: string;
}> = ({ bar, onSelectPrompt, onBuild, avatar }) => {
  const router = useRouter();
  const selection = useThemeSelection();
  const palette = usePalette();
  const [show, setShow] = React.useState(false);
  const [expanded, setExpanded] = React.useState(true);
  React.useEffect(() => {
    const onScroll = () =>
      setShow(window.pageYOffset > window.innerHeight / 2);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const items = selection?.items ?? [];
  const count = items.length;
  const hasSelection = count > 0;

  // Keep the bar mounted once the reader has saved something, even above the
  // scroll threshold — the tray must stay reachable to review/build.
  if (!show && !hasSelection) return null;

  const doBuild = () => {
    if (onBuild) onBuild();
    else if (bar.buildPrompt) onSelectPrompt(bar.buildPrompt);
    else router.push("/chat");
  };

  const openChat = () => {
    if (bar.prompt) onSelectPrompt(bar.prompt);
    else router.push("/chat");
  };

  // Nothing saved yet → the bar is a plain invitation to start a chat, with a
  // mono line above explaining how the "+ Add" pills feed it. Once something is
  // saved it becomes "Build trip · N".
  const buildLabel = hasSelection
    ? `${bar.buildCta ?? "Build trip"} · ${count}`
    : "Start planning";
  const emptyHint = "Nothing added yet · tap + on anything above";

  // Human label for a saved item's kind (singular). Used for the row tag and
  // the per-type summary chips (e.g. "poi" → "place", "do" → "activity").
  const KIND_LABEL: Record<string, string> = {
    poi: "place",
    place: "place",
    do: "activity",
    activity: "activity",
    experience: "experience",
    restaurant: "restaurant",
    cafe: "café",
    city: "city",
    base: "base",
    ticket: "ticket",
    scene: "scene",
  };
  const kindName = (kind?: string) =>
    KIND_LABEL[(kind || "poi").toLowerCase()] ?? (kind || "place").toLowerCase();
  const pluralize = (word: string, n: number) => {
    if (n === 1) return word;
    if (word.endsWith("y")) return `${word.slice(0, -1)}ies`;
    if (word.endsWith("s")) return word;
    return `${word}s`;
  };

  // Group the selection by kind for the summary chips (e.g. "3 experiences",
  // "2 places"), preserving first-seen order.
  const kindCounts: Array<[string, number]> = [];
  const seenKinds: Record<string, number> = {};
  items.forEach((it) => {
    const k = kindName(it.kind);
    if (seenKinds[k] === undefined) {
      seenKinds[k] = kindCounts.length;
      kindCounts.push([k, 0]);
    }
    kindCounts[seenKinds[k]][1] += 1;
  });

  const listOpen = hasSelection && expanded;

  return (
    <div
      className="fixed left-0 right-0 bottom-0 z-[998]"
      style={{
        padding: "10px 14px calc(14px + env(safe-area-inset-bottom))",
        background: "rgba(250,250,245,0.9)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderTop: `1px solid ${BORDER}`,
      }}
    >
      {/* One centered column so every piece aligns on desktop; full-width under
          560px on mobile — identical design on both. */}
      <div className="mx-auto" style={{ maxWidth: 560 }}>
        {/* Saved-list panel (toggled by the summary bar's chevron) — a white
            tray whose rows carry the theme wash so the list reads as part of
            the trip being built rather than a generic cart. */}
        {listOpen && (
          <div
            style={{
              ...cardChrome(),
              borderRadius: 18,
              padding: "16px 16px 14px",
              marginBottom: 10,
              boxShadow: "0 -16px 44px -16px rgba(11,18,32,0.28)",
            }}
          >
            <div className="flex items-center justify-between mb-[12px]">
              <span className="ctl-mono" style={{ fontSize: 9.5, color: INK }}>
                Your list · {count} {count === 1 ? "item" : "items"}
              </span>
              <button
                type="button"
                onClick={() => selection?.clear()}
                className="ctl-mono border-none cursor-pointer bg-transparent p-0"
                style={{ fontSize: 9.5, color: FAINT }}
              >
                Clear all
              </button>
            </div>
            <div
              className="ctl-scroll flex flex-col gap-[7px]"
              style={{ maxHeight: 224, overflowY: "auto" }}
            >
              {items.map((it) => (
                <div
                  key={it.id ?? `${it.kind}:${it.label}`}
                  className="flex items-center gap-[10px]"
                  style={{
                    background: palette.accentSoft,
                    borderRadius: 12,
                    padding: "10px 10px 10px 13px",
                  }}
                >
                  <span
                    className="ctl-mono shrink-0"
                    style={{
                      fontSize: 8.5,
                      color: palette.accent,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {kindName(it.kind).toUpperCase()}
                  </span>
                  <span
                    className="flex-1 min-w-0 truncate"
                    style={{ color: INK, fontWeight: 500, fontSize: 12.5 }}
                    title={it.label || it.short}
                  >
                    {it.label || it.short}
                  </span>
                  <button
                    type="button"
                    aria-label={`Remove ${it.label}`}
                    onClick={() => selection?.toggle(it)}
                    className="ctl-press shrink-0 flex items-center justify-center rounded-full cursor-pointer p-0"
                    style={{
                      width: 22,
                      height: 22,
                      background: "#ffffff",
                      border: `1px solid ${BORDER}`,
                      color: MUTED,
                      fontSize: 13,
                      lineHeight: 1,
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* White summary bar — an accent bag with a count badge, one chip per
            saved type, and a chevron that expands/collapses the list. Shown
            empty too, where it carries the "tap +" hint instead. */}
        <button
            type="button"
            onClick={hasSelection ? () => setExpanded((v) => !v) : undefined}
            disabled={!hasSelection}
            aria-expanded={hasSelection ? expanded : undefined}
            className={`w-full flex items-center gap-[10px] ${
              hasSelection ? "cursor-pointer" : "cursor-default"
            }`}
            style={{
              ...cardChrome(),
              borderRadius: 999,
              padding: "8px 14px 8px 9px",
              marginBottom: 10,
              boxShadow: "0 8px 20px -10px rgba(11,18,32,0.15)",
            }}
          >
            <span
              className="relative shrink-0 flex items-center justify-center rounded-full"
              style={{ width: 32, height: 32, background: palette.accent }}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke={palette.accentOn}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {hasSelection && (
                <span
                  className="ctl-mono absolute flex items-center justify-center rounded-full"
                  style={{
                    top: -3,
                    right: -4,
                    minWidth: 16,
                    height: 16,
                    padding: "0 4px",
                    background: INK,
                    color: "#ffffff",
                    fontSize: 9,
                    fontWeight: 600,
                    border: "1.5px solid #fff",
                    letterSpacing: 0,
                  }}
                >
                  {count}
                </span>
              )}
            </span>
            {/* One chip per selected type, e.g. "3 experiences · 2 places". */}
            {hasSelection ? (
              <div
                className="ctl-scroll flex-1 min-w-0 flex items-center gap-[5px]"
                style={{ overflowX: "auto" }}
              >
                {kindCounts.map(([k, n]) => (
                  <span
                    key={k}
                    className="ctl-mono shrink-0"
                    style={{
                      background: palette.accentSoft,
                      borderRadius: 6,
                      padding: "4px 8px",
                      fontSize: 8.5,
                      color: palette.accent,
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {n} {pluralize(k, n)}
                  </span>
                ))}
              </div>
            ) : (
              <span
                className="ctl-mono flex-1 min-w-0 text-left truncate"
                style={{ fontSize: 9 }}
              >
                {emptyHint}
              </span>
            )}
            {hasSelection && (
              <span
                className="shrink-0 flex items-center"
                style={{
                  color: FAINT,
                  transform: expanded ? "rotate(180deg)" : "none",
                  transition: "transform .2s ease",
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={FAINT}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </span>
            )}
          </button>

        {/* Action row — the accent-filled Build button (with a slow sheen so it
            stays alive without animating colour) + Kaira's avatar into chat. */}
        <div className="flex items-center gap-[8px]">
          <button
            type="button"
            onClick={doBuild}
            className="ctl-press flex-1 min-w-0 relative overflow-hidden rounded-full border-none cursor-pointer"
            style={{
              background: palette.accent,
              color: palette.accentOn,
              padding: "14px 12px",
              fontSize: 14,
              fontWeight: 700,
              boxShadow: `0 8px 20px -10px ${palette.accent}`,
            }}
          >
            <span aria-hidden className="ctl-sheen" />
            {buildLabel} →
          </button>
          <button
            type="button"
            aria-label={bar.cta ?? "Ask Kaira"}
            onClick={openChat}
            className="ctl-press relative shrink-0 rounded-full border-none cursor-pointer p-0 bg-transparent"
            style={{ width: 48, height: 48 }}
          >
            <img
              src={avatar ?? "/KairaInsta.jpg"}
              alt=""
              width={48}
              height={48}
              className="block rounded-full"
              style={{
                width: 48,
                height: 48,
                objectFit: "cover",
                border: "2px solid #ffffff",
                boxShadow: "0 8px 20px -8px rgba(11,18,32,0.35)",
              }}
            />
            <span
              aria-hidden
              className="absolute rounded-full"
              style={{
                bottom: 1,
                right: 1,
                width: 10,
                height: 10,
                background: "#1f8a5a",
                border: "2px solid #ffffff",
                animation: "ctlPulseRing 2s infinite",
              }}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

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
  // Opens the read-only activity details drawer for a catalog activity id.
  // Used by `list` rows that carry an `activityId` (e.g. "Worth the cold").
  onSelectActivity?: (activityId: string, source?: string) => void;
  // Opt-in "save items off the page" selection (see useThemeSelectionState).
  // When provided, cards carrying an `item` toggle it in/out of the selection
  // on click instead of seeding, and the docked ask-bar shows the selection
  // popup + "Build this itinerary" CTA. Omit for a plain seed-only theme page.
  selection?: ThemeSelectionValue;
  // "Build this itinerary" action (from the selection popup). When provided,
  // routes to /chat and opens the themed mini-form rather than auto-seeding.
  onBuild?: () => void;
}

const CinematicThemeLanding: React.FC<CinematicThemeLandingProps> = ({
  config,
  onSelectPrompt,
  onSelectActivity,
  selection,
  onBuild,
}) => {
  // Preload the LCP image: the first card of the first section (the hero
  // collage is desktop-only, so on mobile that card is the largest paint).
  // Uses the same optimised URL as its eager <img> (width 640) so the browser
  // reuses one request. Without this the eager image sat ~7s deep in the
  // network queue behind the JS bundle (Load Delay was 40% of the LCP).
  const firstSection = config.sections?.[0];
  const lcpImage =
    firstSection?.type === "cards" ? firstSection.cards?.[0]?.image : undefined;
  const lcpPreloadHref = lcpImage
    ? optimizedMediaUrl(lcpImage, { width: 640 })
    : undefined;

  const palette = React.useMemo(
    () => resolvePalette(config.theme),
    [config.theme],
  );

  return (
  <PaletteContext.Provider value={palette}>
  <ThemeSelectionProvider value={selection ?? null}>
  <div
    className={`ctl-root ${
      config.askBar ? "pb-[104px] md:pb-[108px]" : "pb-[32px] md:pb-0"
    }`}
    style={{ background: palette.page }}
  >
    {lcpPreloadHref && (
      <Head>
        <link
          rel="preload"
          as="image"
          href={lcpPreloadHref}
          fetchpriority="high"
        />
      </Head>
    )}
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
          return (
            <CardsSection
              key={key}
              section={section}
              onSelectPrompt={onSelectPrompt}
              onSelectActivity={onSelectActivity}
              first={i === 0}
            />
          );
        case "trips":
          return <TripsSection key={key} section={section} onSelectPrompt={onSelectPrompt} />;
        case "pillars":
          return <PillarsSection key={key} section={section} onSelectPrompt={onSelectPrompt} />;
        case "list":
          return (
            <ListSection
              key={key}
              section={section}
              onSelectPrompt={onSelectPrompt}
              onSelectActivity={onSelectActivity}
            />
          );
        case "checklist":
          return <ChecklistSection key={key} section={section} onSelectPrompt={onSelectPrompt} />;
        case "months":
          return <MonthsSection key={key} section={section} />;
        case "stories":
          return <StoriesSection key={key} section={section} onSelectPrompt={onSelectPrompt} />;
        case "eats":
          return <EatsSection key={key} section={section} onSelectPrompt={onSelectPrompt} />;
        case "visa":
          return <VisaSection key={key} section={section} />;
        case "feature":
          return (
            <FeatureSection
              key={key}
              section={section}
              onSelectPrompt={onSelectPrompt}
              onSelectActivity={onSelectActivity}
            />
          );
        case "gradient":
        default:
          return <GradientSection key={key} section={section} onSelectPrompt={onSelectPrompt} />;
      }
    })}

    {config.askBar && (
      <AskKairaStrip
        bar={config.askBar}
        onSelectPrompt={onSelectPrompt}
        onBuild={onBuild}
        avatar={config.hero.kairaImage}
      />
    )}
  </div>
  </ThemeSelectionProvider>
  </PaletteContext.Provider>
  );
};

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
  EatsSection,
  VisaSection,
  FeatureSection,
  AskKairaStrip,
  PromptCard,
  TripCard,
  GradientCard,
  PillarCard,
  ListRow,
};

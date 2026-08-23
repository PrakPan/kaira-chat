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
import type { ThemePromptIntent } from "./themeIntake";

// Every prompt this surface fires reports WHERE it came from, so the page can
// build the `intake` payload for the /chatkit request rather than sending bare
// free text (see themeIntake.ts). The intent is optional on the signature so a
// caller that ignores it still typechecks.
type SelectPrompt = (prompt: string, intent?: ThemePromptIntent) => void;

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
// The one "saved" green on the page — Kaira's online dot, the dark sections'
// added state, and the tick on a saved hero polaroid all read from it.
const GREEN = "#1f8a5a";

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
// One shared treatment for every "+ Add" / "✓ Added" pill on the page. Resting
// state is the accent's pale wash; the saved state fills with the accent so a
// scan of the page shows exactly what's in the trip. Dark sections (the
// restaurant/feature scrollers on midnight) keep the same shape on a
// translucent-white / green pair, since the accent doesn't hold up there.
const addCtaStyle = (
  palette: ResolvedPalette,
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
    ? {
        background: palette.accent,
        color: palette.accentOn,
        border: `1px solid ${palette.accent}`,
      }
    : {
        background: palette.accentSoft,
        color: palette.accent,
        border: "1px solid transparent",
      };
};

const addCtaLabel = (selected: boolean) => (selected ? "✓ Added" : "+ Add");

// Primary card action ("Create this plan →", "Book this itinerary →") — an
// accent-filled pill that spans the card foot.
const primaryCtaStyle = (palette: ResolvedPalette): React.CSSProperties => ({
  background: palette.accent,
  color: palette.accentOn,
  border: "none",
  boxShadow: `0 8px 20px -12px ${palette.accent}`,
});

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
      /* Destinations / "Other themes" tiles. On a phone they read as small
         cards (photo on top, label beneath). From md up the mockup switches to
         a photo tile with the label burned into the bottom of the image over a
         scrim, so the same markup is re-laid-out rather than duplicated. The
         overrides need !important because the base card sets colour and
         padding inline. */
      .ctl-tile-scrim { display: none; position: absolute; inset: 0; pointer-events: none; background: linear-gradient(180deg, rgba(11,18,32,0) 30%, rgba(11,18,32,0.78) 100%); }
      @media (min-width: 768px) {
        .ctl-tile { position: relative; height: 120px; border-radius: 14px !important; border-color: transparent !important; }
        .ctl-tile-media { position: absolute; inset: 0; height: 100% !important; }
        .ctl-tile-scrim { display: block; }
        .ctl-tile-body { position: absolute; left: 13px; right: 13px; bottom: 11px; padding: 0 !important; }
        .ctl-tile-name { color: ${PAPER} !important; font-size: 15px !important; font-weight: 800 !important; min-height: 0 !important; }
        .ctl-tile-meta { color: rgba(250,250,245,0.75) !important; margin-top: 2px !important; font-size: 8.5px !important; }
      }

      /* Docked-bar build button — a slow highlight sweep so the primary action
         stays alive without animating colour. The sweeping layer is the full
         width of the button (the band itself is painted as a no-repeat
         background), so translating it ±100% crosses the whole button at any
         width — a fixed pixel/percent travel would stall halfway on desktop. */
      .ctl-sheen { position: absolute; inset: 0; pointer-events: none; background-image: linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent); background-size: 64px 100%; background-repeat: no-repeat; background-position: left center; animation: ctlBarShimmer 3s cubic-bezier(.4,0,.2,1) infinite; }
      @keyframes ctlBarShimmer { 0% { transform: translateX(-100%) skewX(-18deg); } 55%, 100% { transform: translateX(100%) skewX(-18deg); } }
      @keyframes ctlPulseRing { 0% { box-shadow: 0 0 0 0 rgba(31,138,90,0.4); } 70% { box-shadow: 0 0 0 6px rgba(31,138,90,0); } 100% { box-shadow: 0 0 0 0 rgba(31,138,90,0); } }
      /* Docked bar breakpoint. The phone bar is the full-bleed stack; from 768
         up it's replaced by the floating pill (the Lapland desktop mockup).
         Written by hand rather than with md:/hidden utilities so the two can
         never both resolve to none — they're strict complements. */
      .ctl-bar-desk { display: none; }
      .ctl-bar-mob { display: block; }
      @media (min-width: 768px) {
        .ctl-bar-desk { display: block; }
        .ctl-bar-mob { display: none; }
      }
      .ctl-root input { font-family: inherit; }
      .ctl-root input::placeholder { color: #b8becc; opacity: 1; }
      .ctl-skeleton { position: absolute; inset: 0; background: linear-gradient(90deg, #e7e9ee 25%, #f2f3f6 37%, #e7e9ee 63%); background-size: 400% 100%; animation: ctlShimmer 1.4s ease infinite; }
      @keyframes ctlShimmer { 0% { background-position: 100% 0; } 100% { background-position: 0 0; } }

      /* Desktop hero Kaira + polaroid collage (mirrors the homepage hero) */
      .ctl-kairawrap { position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 30px 0; min-height: 440px; }
      .ctl-kaira { width: 180px; height: 180px; border-radius: 50%; overflow: hidden; box-shadow: 0 16px 40px rgba(11,18,32,0.2); border: 6px solid ${PAPER}; z-index: 2; }
      .ctl-kaira img { width: 100%; height: 100%; object-fit: cover; }
      /* The polaroids save the scene they show: clicking one adds it to the
         trip and marks it with a green tick, clicking again removes it. (They
         used to navigate, which put a second, unlabelled destination behind
         the hero's own CTAs.) A page with no selection handler leaves them as
         plain, decorative tiles that lift on hover. */
      .ctl-polaroid { position: absolute; width: 148px; background: #fff; padding: 8px 8px 26px; box-shadow: 0 12px 28px -8px rgba(11,18,32,0.25); border-radius: 4px; z-index: 3; transition: transform .3s cubic-bezier(.2,.7,.3,1), box-shadow .25s ease; }
      .ctl-polaroid:hover { transform: translateY(-4px) rotate(0deg) !important; z-index: 5; }
      /* Button reset — a selectable polaroid is a real button, but it has to
         keep the tile's own box exactly. */
      .ctl-polaroid-btn { border: none; font: inherit; color: inherit; text-align: inherit; cursor: pointer; display: block; }
      .ctl-polaroid-saved { box-shadow: 0 0 0 2px ${GREEN}, 0 12px 28px -8px rgba(11,18,32,0.25); }
      .ctl-polaroid-tick { position: absolute; top: -9px; right: -9px; width: 25px; height: 25px; border-radius: 50%; background: ${GREEN}; color: #fff; font-size: 13px; font-weight: 700; line-height: 21px; text-align: center; border: 2px solid #fff; box-shadow: 0 4px 10px -4px rgba(11,18,32,0.45); z-index: 6; }
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
  onSelectPrompt: SelectPrompt;
}> = ({ cta, onSelectPrompt }) => {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => {
        if (cta.prompt)
          onSelectPrompt(cta.prompt, { source: "cta", label: cta.label });
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
  onSelectPrompt: SelectPrompt;
}> = ({ hero, onSelectPrompt }) => {
  const palette = usePalette();
  // The hero collage is a selection surface too — each polaroid saves the
  // scene it shows (see the polaroid block below).
  const selection = useThemeSelection();
  // Controlled composer: send the typed text (falling back to the example
  // prompt when empty) on Send click or Enter. Typed words go out as the
  // intake's `note`; the fallback example prompt is ours, so it goes out as a
  // canned prompt instead — hence the `typed` flag rather than one fixed intent.
  const [composerText, setComposerText] = React.useState("");
  const submitComposer = () => {
    const typedValue = composerText.trim();
    const value = typedValue || hero.prompt || "";
    if (value) onSelectPrompt(value, { source: "hero", typed: !!typedValue });
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
              // The hero's primary action, so it takes the accent like every
              // other CTA on the page. It used to hard-code INK, which left it
              // black on a themed page while the docked bar beside it and the
              // card CTAs below it were all in the theme colour.
              style={{ background: palette.accent, color: palette.accentOn }}
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
                  onClick={() =>
                    onSelectPrompt(chip.prompt, {
                      source: "hero",
                      label: chip.label,
                    })
                  }
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
                // What this polaroid saves. An explicit `item` wins; otherwise
                // the caption names the scene, which every existing config
                // already carries — so the collage becomes selectable without
                // any page being rewritten.
                const item =
                  img.item ??
                  (img.caption
                    ? {
                        kind: "scene",
                        label: img.caption,
                        short: img.caption,
                      }
                    : undefined);
                const selectable = !!(item && selection);
                const selected = selectable
                  ? selection!.isSelected(item!)
                  : false;
                const style: React.CSSProperties = {
                  top: pos.top,
                  left: pos.left,
                  right: pos.right,
                  bottom: pos.bottom,
                  transform: `rotate(${pos.rotate}deg)`,
                };
                const inner = (
                  <>
                    <div className="ctl-polaroid-img">
                      <SkeletonImage src={img.image} alt={img.caption ?? ""} />
                    </div>
                    {img.caption && (
                      <div className="ctl-polaroid-cap">{img.caption}</div>
                    )}
                    {selected && (
                      <span className="ctl-polaroid-tick" aria-hidden>
                        ✓
                      </span>
                    )}
                  </>
                );
                // Decorative unless the page is running a selection — a tile
                // that can't save anything shouldn't advertise itself as a
                // button.
                return selectable ? (
                  <button
                    key={`polaroid-${i}`}
                    type="button"
                    onClick={() => selection!.toggle(item!)}
                    aria-pressed={selected}
                    aria-label={`${selected ? "Remove" : "Add"} ${
                      img.caption ?? "this scene"
                    }`}
                    className={`ctl-polaroid ctl-polaroid-btn${
                      selected ? " ctl-polaroid-saved" : ""
                    }`}
                    style={style}
                  >
                    {inner}
                  </button>
                ) : (
                  <div
                    key={`polaroid-${i}`}
                    className="ctl-polaroid"
                    style={style}
                  >
                    {inner}
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
  onSelectPrompt: SelectPrompt;
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
  const palette = usePalette();
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
  const toggle = () => item && selection && selection.toggle(item);
  return (
  <button
    type="button"
    // A click anywhere on a selectable card adds or removes it. The detail
    // drawers these cards used to open are retired on the theme pages, so
    // saving is the only thing a body click can usefully do — and the "+ Add"
    // pill and the card now agree instead of doing two different things.
    onClick={() => {
      if (item && selection) {
        selection.toggle(item);
        return;
      }
      if (card.activityId && onSelectActivity)
        onSelectActivity(card.activityId, card.activitySource);
      else if (card.prompt)
        onSelectPrompt(card.prompt, { source: "card", label: card.name });
    }}
    aria-pressed={selectable ? selected : undefined}
    className="ctl-card group flex flex-col text-left rounded-[18px] overflow-hidden cursor-pointer w-[262px] md:w-auto shrink-0 md:shrink"
    style={{
      ...cardChrome(onSand),
      ...(selected ? { borderColor: palette.accent } : {}),
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
                ? addCtaStyle(palette, selected)
                : ctaTone === "dark"
                  ? { background: INK, color: PAPER, border: "none" }
                  : primaryCtaStyle(palette)
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
  onSelectPrompt: SelectPrompt;
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
// Mobile: full-width stacked rows, 104px thumb. Desktop: 3-col grid, 112px
// thumb. The price sits above the length in both.
// A trip card states its length twice — in the top tag ("Couple · 12N") and
// again under the price ("12 nights · Krabi + Bali"). The tag keeps who the
// trip is for, the price block keeps how long it runs. Only a trailing "· 12N"
// is taken, so tags that never name a length ("The full festival", "10+") and
// the audience half of longer ones ("Family · ages 6+ · 8N") survive intact.
const tagWithoutNights = (tag: string) =>
  tag.replace(/\s*·\s*\d+\s*N\s*$/i, "").trim() || tag;

const TripCard: React.FC<{
  card: CinematicTripCard;
  onSelectPrompt: SelectPrompt;
  ctaLabel?: string;
}> = ({ card, onSelectPrompt, ctaLabel }) => {
  const router = useRouter();
  const palette = usePalette();
  const act = () => {
    if (card.href) router.push(card.href);
    else if (card.prompt)
      onSelectPrompt(card.prompt, { source: "card", label: card.name });
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
        {card.tag && (
          <div className="ctl-mono" style={{ fontSize: 9 }}>
            {tagWithoutNights(card.tag)}
          </div>
        )}
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
        {/* Price block. A priced card reads as a packaged trip: a rule closes
            the copy off, then the price in bold on its own line with the
            length under it. Cards that carry no price (their length is the
            only meta) keep the plain mono line, with no rule to imply a
            commercial block that isn't there. */}
        {(card.price || card.nights) && (
          <div
            className={`mt-[10px] md:mt-[14px] ${
              card.price ? "pt-[10px] md:pt-[12px]" : ""
            }`}
            style={
              card.price ? { borderTop: `1px solid ${BORDER}` } : undefined
            }
          >
            {card.price && (
              <div
                className="ctl-mono"
                style={{ color: INK, fontSize: 14, fontWeight: 700 }}
              >
                {card.price}
              </div>
            )}
            {card.nights && (
              <div
                className={`ctl-mono ${card.price ? "mt-[5px]" : ""}`}
                style={{ fontSize: 10 }}
              >
                {card.nights}
              </div>
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
          style={primaryCtaStyle(palette)}
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
  onSelectPrompt: SelectPrompt;
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
  onSelectPrompt: SelectPrompt;
  compact?: boolean; // destinations: shorter tile + no name min-height
  // Beyond the paired columns' 4-tile desktop grid — stays in the phone list.
  hideOnDesktop?: boolean;
}> = ({ card, onSelectPrompt, compact, hideOnDesktop }) => {
  const router = useRouter();
  const act = () => {
    if (card.prompt)
      onSelectPrompt(card.prompt, { source: "card", label: card.name });
    else if (card.href) router.push(card.href);
  };
  return (
    <button
      type="button"
      onClick={act}
      className={`ctl-card ctl-tile text-left overflow-hidden cursor-pointer ${
        compact
          ? "rounded-[14px]"
          : "rounded-[18px] w-[160px] md:w-auto shrink-0 md:shrink"
      } ${hideOnDesktop ? "md:hidden" : ""}`}
      style={cardChrome(true)}
    >
      <div
        className={`ctl-tile-media relative overflow-hidden flex items-center justify-center ${
          compact ? "h-[90px] text-[26px]" : "h-[100px] text-[30px]"
        }`}
        style={{ background: card.gradient }}
      >
        {card.image ? (
          <SkeletonImage src={card.image} alt={card.name} />
        ) : (
          card.emoji
        )}
      </div>
      <span className="ctl-tile-scrim" aria-hidden />
      <div className="ctl-tile-body relative px-[14px] pt-[12px] pb-[14px]">
        <div
          className="ctl-tile-name text-[13px] font-bold leading-[1.25]"
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
            className="ctl-tile-meta ctl-mono"
            style={{ fontSize: 9.5, marginTop: 5 }}
          >
            {card.meta}
          </div>
        )}
      </div>
    </button>
  );
};

// Heading + tiles, no section chrome. Standalone it fills the width; paired it
// fills one half of the desktop row (see GradientPairSection).
//
// `desktopLimit` trims the grid to the first N tiles from md up — paired
// columns show a 2×2 of four, per the mockup — while the phone scroller keeps
// every tile. The extras are hidden rather than dropped so the mobile list
// stays complete from the same markup.
const GradientColumn: React.FC<{
  section: Extract<CinematicSection, { type: "gradient" }>;
  onSelectPrompt: SelectPrompt;
  desktopCols?: number;
  desktopLimit?: number;
}> = ({ section, onSelectPrompt, desktopCols, desktopLimit }) => {
  const cols = desktopCols ?? section.columns ?? 6;
  const compact = !!section.mobileGrid;
  return (
    <div className="min-w-0">
      <div className="flex items-end justify-between gap-[16px]">
        <Heading heading={section.heading} className="text-[22px] md:text-[28px]" />
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
        className={`ctl-scroll ctl-grad-${cols} mt-[14px] md:mt-[18px] gap-[12px] md:gap-[14px] ${
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
            hideOnDesktop={desktopLimit != null && i >= desktopLimit}
          />
        ))}
      </div>
      {/* `footerCta` ("View all destinations →") is intentionally not rendered
          — the tiles already link through, and the button read as a dead end
          under the grid. Kept on the type so a page can still declare one. */}
    </div>
  );
};

const GradientSection: React.FC<{
  section: Extract<CinematicSection, { type: "gradient" }>;
  onSelectPrompt: SelectPrompt;
}> = ({ section, onSelectPrompt }) => (
  <section className="pt-[30px] md:pt-[56px]">
    <Container>
      <GradientColumn section={section} onSelectPrompt={onSelectPrompt} />
    </Container>
  </section>
);

// "The destinations" + "Other themes" as the mockup pairs them: stacked on a
// phone, two half-width columns of four tiles from md up.
const GradientPairSection: React.FC<{
  left: Extract<CinematicSection, { type: "gradient" }>;
  right: Extract<CinematicSection, { type: "gradient" }>;
  onSelectPrompt: SelectPrompt;
}> = ({ left, right, onSelectPrompt }) => (
  <section className="pt-[30px] md:pt-[72px]">
    <Container>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[30px] md:gap-[48px] items-start">
        {[left, right].map((section, i) => (
          <GradientColumn
            key={`grad-col-${i}`}
            section={section}
            onSelectPrompt={onSelectPrompt}
            desktopCols={2}
            desktopLimit={4}
          />
        ))}
      </div>
    </Container>
  </section>
);

// Full-width outline button under a grid (e.g. "View all destinations →").
const FooterButton: React.FC<{
  cta: CinematicSectionCta;
  onSelectPrompt: SelectPrompt;
}> = ({ cta, onSelectPrompt }) => {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => {
        if (cta.prompt)
          onSelectPrompt(cta.prompt, { source: "cta", label: cta.label });
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
  onSelectPrompt: SelectPrompt;
}> = ({ card, onSelectPrompt }) => (
  <button
    type="button"
    onClick={() =>
      onSelectPrompt(card.prompt, { source: "card", label: card.name })
    }
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
  onSelectPrompt: SelectPrompt;
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
  onSelectPrompt: SelectPrompt;
  onSelectActivity?: (activityId: string, source?: string) => void;
  sectionSelectable?: boolean;
  itemKind?: string;
}> = ({ row, compact, onSelectPrompt, onSelectActivity, sectionSelectable, itemKind }) => {
  const router = useRouter();
  const selection = useThemeSelection();
  const palette = usePalette();
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
  const toggle = () => item && selection && selection.toggle(item);
  // Saving wins over everything: the drawer this row used to open (by activity
  // id or a `?city_id=` href) is retired on the theme pages, so a body click
  // adds or removes the row instead of navigating.
  const act = () => {
    if (item && selection) {
      selection.toggle(item);
      return;
    }
    if (row.activityId && onSelectActivity)
      onSelectActivity(row.activityId, row.activitySource);
    else if (row.prompt)
      onSelectPrompt(row.prompt, { source: "card", label: row.name });
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
        ...(selected ? { borderColor: palette.accent } : {}),
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
          style={{ ...addCtaStyle(palette, selected), padding: "8px 14px" }}
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
  onSelectPrompt: SelectPrompt;
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
  onSelectPrompt: SelectPrompt;
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
              if (row.prompt)
                onSelectPrompt(row.prompt, { source: "card", label: row.name });
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
  onSelectPrompt: SelectPrompt;
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
              // The card's own "name" is the reviewer's, so the route they took
              // is the label that identifies what was tapped — falling back to
              // the name on cards that carry no route.
              else if (card.prompt)
                onSelectPrompt(card.prompt, {
                  source: "card",
                  label: card.route ?? card.name,
                });
            }}
            className="ctl-card flex flex-col text-left rounded-[18px] p-[17px] md:p-[20px] w-[262px] md:w-auto shrink-0 md:shrink cursor-pointer"
            style={cardChrome()}
          >
            {/* Reviewer row — initial disc, who they are and when they went.
                The score renders as filled stars; the number itself rides in
                the aria-label so the row stays purely visual. */}
            <div className="flex items-center gap-[11px]">
              <span
                className="shrink-0 flex items-center justify-center rounded-full"
                style={{
                  width: 38,
                  height: 38,
                  background: palette.accent,
                  color: palette.accentOn,
                  fontSize: 15,
                  fontWeight: 700,
                }}
              >
                {card.name.trim().charAt(0).toUpperCase()}
              </span>
              <div className="flex-1 min-w-0">
                <div
                  className="text-[13.5px] md:text-[14px] font-bold leading-[1.3]"
                  style={{ color: INK }}
                >
                  {card.name}
                </div>
                <div className="ctl-mono mt-[2px]" style={{ fontSize: 8.5 }}>
                  {card.when ?? card.type}
                </div>
              </div>
            </div>
            <div
              aria-label={`Rated ${card.rating} out of 5`}
              className="mt-[11px]"
              style={{ color: "#f5a623", fontSize: 13, letterSpacing: 2 }}
            >
              {"★".repeat(
                Math.min(5, Math.max(1, Math.round(Number(card.rating) || 5))),
              )}
            </div>
            {/* Card body. A real review is quoted; an itinerary summary is
                not — the quote marks are what make the line a testimonial, so
                only `quote` gets them. A card with neither keeps the bare
                header + route it has always had. */}
            {(card.quote || card.summary) && (
              <div
                className="text-[13px] md:text-[13.5px] leading-[1.55] mt-[8px] flex-1"
                style={{ color: MUTED }}
              >
                {card.quote ? (
                  <>&ldquo;{card.quote}&rdquo;</>
                ) : (
                  card.summary
                )}
              </div>
            )}
            {/* Foot of the card: the trip in a pill on the left, the CTA on
                the right. The pill is skipped when the card has no `route`,
                which is how a card avoids printing the CTA twice. */}
            <div className="flex items-center gap-[10px] mt-[14px]">
              {card.route && (
                <span
                  className="ctl-mono min-w-0 truncate px-[9px] py-[5px] rounded-[6px]"
                  style={{
                    background: palette.accentSoft,
                    color: palette.accent,
                    fontSize: 9,
                  }}
                >
                  {card.route}
                </span>
              )}
              <span className="flex-1" />
              <span
                className="shrink-0 text-[12.5px] font-bold whitespace-nowrap"
                style={{ color: INK }}
              >
                See itinerary →
              </span>
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
  onSelectPrompt: SelectPrompt;
}> = ({ section, onSelectPrompt }) => {
  const router = useRouter();
  const selection = useThemeSelection();
  const palette = usePalette();
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
          const toggle = () => item && selection && selection.toggle(item);
          return (
          <button
            key={`eat-${i}`}
            type="button"
            // The restaurant drawer behind `card.href` is retired on the theme
            // pages, so a body click saves the card rather than navigating.
            onClick={() => {
              if (item && selection) {
                selection.toggle(item);
                return;
              }
              if (card.href) router.push(card.href);
              else if (card.prompt)
                onSelectPrompt(card.prompt, {
                  source: "card",
                  label: card.name,
                });
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
                    ? addCtaStyle(palette, selected, true)
                    : addCtaStyle(palette, false, true)
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

// ── Visa (light — "Your visa, handled") ─────────────────────────────────────
// One white card split in two from md up: the heading, intro and a 2×2 grid of
// facts on the left; the country cards and the primary CTA on the right. On a
// phone it collapses to a single column and the countries become a horizontal
// carousel — the rail the dark version used.
//
// Every colour that isn't ink comes from the page's own palette: fact tiles
// take `accentSoft`, their labels and every CTA take `accent`/`accentOn`, so a
// teal page and a purple one share this layout without either hard-coding a
// colour.
const VisaSection: React.FC<{
  section: Extract<CinematicSection, { type: "visa" }>;
}> = ({ section }) => {
  const palette = usePalette();
  const facts = section.facts ?? [];
  // These lists are as long as the trip makes them — one country for Hokkaido,
  // five for the Christmas markets — so the grid is sized from the count rather
  // than assuming four. A lone card takes the full column instead of leaving a
  // hole beside it, and an odd last card spans both tracks so a 3- or 5-country
  // page doesn't end on a half-empty row either.
  const cols = (n: number) => (n === 1 ? "md:grid-cols-1" : "md:grid-cols-2");
  const spanLast = (n: number, i: number) =>
    n > 1 && n % 2 === 1 && i === n - 1 ? "md:col-span-2" : "";
  const ctaStyle: React.CSSProperties = {
    background: palette.accent,
    color: palette.accentOn,
  };
  return (
    <section className="pt-[30px] md:pt-[56px]">
      <Container>
        <div
          // items-stretch (not start) so the right column runs the full height
          // of the left one and its CTA can sit on the bottom edge, rather than
          // both columns ending wherever their own content does.
          className="rounded-[20px] md:rounded-[28px] p-[18px] md:p-[40px] lg:p-[48px] grid gap-[24px] md:gap-[40px] md:grid-cols-2 items-stretch"
          style={{
            ...cardChrome(),
            boxShadow: "0 8px 20px -16px rgba(11,18,32,0.14)",
          }}
        >
          {/* ── Left: heading, intro, facts ── */}
          {/* min-w-0: a grid item defaults to min-width:auto, so the scroll
              rails inside these columns push the whole card wider than a phone
              instead of scrolling within it. */}
          <div className="min-w-0 flex flex-col">
            <Heading
              heading={section.heading}
              className="text-[24px] md:text-[40px]"
            />
            {section.intro && (
              <p
                className="text-[13.5px] md:text-[15px] leading-[1.6] mt-[11px] md:mt-[14px] mb-[20px] md:mb-[28px] max-w-[46ch]"
                style={{ color: MUTED }}
              >
                {section.intro}
              </p>
            )}
            {facts.length > 0 && (
              // Carousel on phones, 2×2 from md. Stacked two-up on a 375px
              // screen these tiles are ~140px wide, which wraps "Schengen
              // short-stay" onto three lines and makes the block taller than
              // everything around it; on a rail they keep a readable width and
              // the section stays one screen tall.
              <div
                className={`ctl-scroll ctl-rail flex gap-[10px] overflow-x-auto md:grid md:gap-[12px] md:overflow-visible ${cols(
                  facts.length,
                )}`}
              >
                {facts.map((f, i) => (
                  <div
                    key={`fact-${i}`}
                    className={`flex-[1_0_160px] md:flex-none box-border rounded-[14px] md:rounded-[18px] p-[14px] md:p-[22px] ${spanLast(
                      facts.length,
                      i,
                    )}`}
                    style={{ background: palette.accentSoft }}
                  >
                    <div
                      className="ctl-mono"
                      style={{ fontSize: 9, color: palette.accent }}
                    >
                      {f.label}
                    </div>
                    <div
                      className="font-extrabold text-[14px] md:text-[22px] mt-[6px] md:mt-[9px] leading-[1.2]"
                      style={{ color: INK, letterSpacing: "-0.03em" }}
                    >
                      {f.value}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {section.note && (
              <div
                className="mt-[16px] md:mt-[20px] text-[12px] md:text-[13px] leading-[1.55]"
                style={{ color: FAINT }}
              >
                {section.note}
              </div>
            )}
          </div>

          {/* ── Right: countries, primary CTA ── */}
          {/* justify-between so the CTA settles on the bottom edge of the card,
              level with the end of the left column, instead of floating right
              under a short country list. */}
          <div className="min-w-0 flex flex-col gap-[12px] md:justify-between">
            {/* Carousel on phones, a grid from md — sized by the count, so
                Thailand's single card fills the column rather than sitting in
                one half of a 2-up grid with a hole beside it. */}
            <div
              className={`ctl-scroll ctl-rail flex gap-[10px] overflow-x-auto md:grid md:gap-[12px] md:overflow-visible ${cols(
                section.cards.length,
              )}`}
            >
              {section.cards.map((card: CinematicVisaCard, i) => (
                <div
                  key={`visa-${i}`}
                  // flex basis rather than a fixed width: five countries hold
                  // 210px each and scroll, while a page with a single visa
                  // grows that card to the full width instead of leaving dead
                  // space beside it. Ignored once the grid takes over.
                  className={`flex-[1_0_210px] md:flex-none box-border flex flex-col rounded-[16px] p-[14px] md:p-[18px] ${spanLast(
                    section.cards.length,
                    i,
                  )}`}
                  style={{ background: SAND }}
                >
                  <div className="flex items-baseline justify-between gap-[8px]">
                    <span
                      className="text-[14.5px] font-bold leading-[1.25]"
                      style={{ color: INK }}
                    >
                      {card.country}
                    </span>
                    {card.fee && (
                      <span
                        className="ctl-mono shrink-0"
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: INK,
                          letterSpacing: "0.02em",
                        }}
                      >
                        {card.fee}
                      </span>
                    )}
                  </div>
                  {card.cities && (
                    <div
                      className="ctl-mono mt-[4px]"
                      style={{ fontSize: 9, lineHeight: 1.5 }}
                    >
                      {card.cities}
                    </div>
                  )}
                  {card.href && (
                    <a
                      href={card.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block box-border text-center mt-[14px] md:mt-[16px] rounded-full py-[9px] px-[10px] text-[12px] font-bold no-underline"
                      style={ctaStyle}
                    >
                      Check visa →
                    </a>
                  )}
                </div>
              ))}
            </div>

            {section.cta && (
              <a
                href={section.cta.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center box-border text-center rounded-full py-[14px] md:py-[15px] px-[16px] text-[13.5px] md:text-[14.5px] font-bold no-underline"
                style={{
                  ...ctaStyle,
                  boxShadow: "0 8px 20px -10px rgba(11,18,32,0.3)",
                }}
              >
                {section.cta.label}
              </a>
            )}

          </div>
        </div>
      </Container>
    </section>
  );
};

// ── Feature (dark — "A bullet train under the ocean floor") ─────────────────
// Highlighted fact rows, a 3-up stat grid, and a yellow CTA card that opens the
// read-only activity drawer (e.g. the JR Pass) or seeds a prompt.
const FeatureCtaCard: React.FC<{
  cta: CinematicFeatureCta;
  onSelectPrompt: SelectPrompt;
  onSelectActivity?: (activityId: string, source?: string) => void;
}> = ({ cta, onSelectPrompt, onSelectActivity }) => {
  const router = useRouter();
  const selection = useThemeSelection();
  const palette = usePalette();
  // This card has always worn a "+ Add" pill; with the drawer retired it now
  // does what the pill says. An explicit `item` wins, else the card's own title
  // names what gets saved (and its activity id rides along when it has one).
  const item =
    cta.item ??
    (cta.title
      ? {
          kind: "ticket",
          label: cta.title,
          short: cta.title,
          ...(cta.activityId ? { id: cta.activityId } : {}),
        }
      : undefined);
  const selectable = !!(item && selection);
  const selected = selectable ? selection!.isSelected(item!) : false;
  const act = () => {
    if (item && selection) {
      selection.toggle(item);
      return;
    }
    if (cta.activityId && onSelectActivity)
      onSelectActivity(cta.activityId, cta.activitySource);
    else if (cta.prompt)
      onSelectPrompt(cta.prompt, { source: "cta", label: cta.title });
    else router.push("/chat");
  };
  return (
    <button
      type="button"
      onClick={act}
      aria-pressed={selectable ? selected : undefined}
      className="ctl-press w-full text-left flex items-center gap-[14px] rounded-[18px] px-[18px] py-[17px] mt-[12px] cursor-pointer"
      style={{
        background: selected
          ? "rgba(31,138,90,0.14)"
          : "rgba(247,231,0,0.10)",
        border: `1px solid ${
          selected ? "rgba(31,138,90,0.45)" : "rgba(247,231,0,0.28)"
        }`,
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
        style={addCtaStyle(palette, selected, true)}
      >
        {addCtaLabel(selected)}
      </span>
    </button>
  );
};

const FeatureSection: React.FC<{
  section: Extract<CinematicSection, { type: "feature" }>;
  onSelectPrompt: SelectPrompt;
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
// a bar pinned to the bottom of the viewport carrying the saved-items bag, a
// free-text field, the build CTA and Kaira's avatar. Desktop floats it as one
// pill; mobile stacks it. Present from first paint — the reader shouldn't have
// to scroll to discover how to start.
//
// The bar takes exactly one brief at a time, and which one decides where the
// reader lands:
//
//   • Typed something → it goes straight to /chat as the opening message, in
//     the same `intake` request shape everything else on the page uses. The
//     themed mini-form is deliberately skipped: it would discard what they just
//     wrote and ask them the same questions back.
//   • Saved a list, or neither → the themed mini-form opens on /chat, which is
//     where month / route / travellers actually get picked.
//
// The two can never be live together. Saving anything clears the field and
// locks it (see the effect below), so a draft in hand means there is no list,
// and a list means there is no draft.
const AskKairaStrip: React.FC<{
  bar: CinematicAskBar;
  onSelectPrompt: SelectPrompt;
  // "Build this itinerary" action. When provided, the build button (and the
  // selection popup) call this instead of seeding a prompt — the page routes to
  // /chat and opens the themed mini-form there. Falls back to seeding
  // bar.buildPrompt when omitted. The `note` parameter is left on the signature
  // for callers that still pass one, but this bar no longer sends it: typed
  // text now opens the chat directly rather than riding into the form.
  onBuild?: (note?: string) => void;
  // Kaira's avatar for the round chat button at the end of the action row.
  avatar?: string;
}> = ({ bar, onSelectPrompt, onBuild, avatar }) => {
  const router = useRouter();
  const selection = useThemeSelection();
  const palette = usePalette();
  const [expanded, setExpanded] = React.useState(true);
  const [draft, setDraft] = React.useState("");

  const items = selection?.items ?? [];
  const count = items.length;
  const hasSelection = count > 0;

  const trimmedDraft = draft.trim();
  const hasDraft = trimmedDraft.length > 0;

  // One brief at a time. The moment anything is saved the field empties and
  // goes disabled, so a half-typed sentence can't sit behind a "Build trip · 4"
  // button quietly doing nothing. Keyed on the flip, not on `count`, so
  // saving a fifth item doesn't re-run it.
  React.useEffect(() => {
    if (hasSelection) setDraft("");
  }, [hasSelection]);

  // The bar's single submit. A draft wins and goes straight to chat; with
  // nothing typed this is "Build trip · N" over a saved list or a bare
  // "Start planning", and both open the themed mini-form.
  const doBuild = () => {
    if (hasDraft) {
      onSelectPrompt(trimmedDraft, { source: "ask_bar", typed: true });
      return;
    }
    if (onBuild) onBuild();
    else if (bar.buildPrompt)
      onSelectPrompt(bar.buildPrompt, {
        source: "ask_bar",
        label: bar.buildCta,
      });
    else router.push("/chat");
  };

  // Kaira's avatar — the "just ask" shortcut. With something typed it opens the
  // chat on those words instead of the theme's canned opener, so the field is
  // never a dead end here either.
  const openChat = () => {
    if (hasDraft) {
      onSelectPrompt(trimmedDraft, { source: "ask_bar", typed: true });
      return;
    }
    if (bar.prompt)
      onSelectPrompt(bar.prompt, { source: "ask_bar", label: bar.cta });
    else router.push("/chat");
  };

  // Enter submits the bar, same as pressing the CTA — there is no separate
  // send affordance to reach for.
  const onDraftKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      doBuild();
    }
  };

  // The label has to say which of the two things the button will do, because
  // they end somewhere different: a typed brief opens the chat on those words,
  // the other two open the themed form.
  const buildLabel = hasDraft
    ? "Send"
    : hasSelection
      ? `${bar.buildCta ?? "Build trip"} · ${count}`
      : "Start planning";

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

  // Shared pieces between the phone bar and the desktop pill.
  const bagIcon = (size: number) => (
    <svg
      width={size}
      height={size}
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
  );

  const kairaAvatar = (size: number) => (
    <>
      <img
        src={avatar ?? "/KairaInsta.jpg"}
        alt=""
        width={size}
        height={size}
        className="block rounded-full"
        style={{
          width: size,
          height: size,
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
    </>
  );

  // The saved-list tray. Same card on both breakpoints; only its width and the
  // gutter around it differ, so the caller passes the wrapper style.
  const savedTray = (
    <div
      style={{
        ...cardChrome(),
        borderRadius: 18,
        padding: "16px 16px 14px",
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
  );

  // ── Desktop: one floating pill ──────────────────────────────────────────
  // The wide-screen mockup drops the full-bleed bar entirely — bag + count
  // chips + build CTA + Kaira sit on a single 720px pill floating clear of the
  // page, with the saved tray as a narrower card above it.
  const desktopBar = (
    <div
      className="ctl-bar-desk fixed left-0 right-0 bottom-0 z-[998]"
      style={{ pointerEvents: "none" }}
    >
      {listOpen && (
        <div
          style={{
            pointerEvents: "auto",
            width: 560,
            maxWidth: "92%",
            margin: "0 auto 10px",
          }}
        >
          {savedTray}
        </div>
      )}
      <div
        style={{
          pointerEvents: "auto",
          width: 720,
          maxWidth: "92%",
          margin: "0 auto",
          paddingBottom: 18,
        }}
      >
        <div
          className="flex items-center gap-[12px]"
          style={{
            background: "rgba(250,250,245,0.92)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: `1px solid ${BORDER}`,
            borderRadius: 999,
            padding: 10,
            boxShadow: "0 18px 44px -18px rgba(11,18,32,0.35)",
          }}
        >
          {/* Bag — toggles the saved tray. */}
          <button
            type="button"
            onClick={hasSelection ? () => setExpanded((v) => !v) : doBuild}
            aria-expanded={hasSelection ? expanded : undefined}
            aria-label={hasSelection ? "Your list" : buildLabel}
            className="relative shrink-0 border-none cursor-pointer p-0 bg-transparent"
            style={{ width: 46, height: 46 }}
          >
            <span
              className="flex items-center justify-center rounded-full"
              style={{ width: 46, height: 46, background: palette.accent }}
            >
              {bagIcon(18)}
            </span>
            {hasSelection && (
              <span
                className="ctl-mono absolute flex items-center justify-center rounded-full"
                style={{
                  top: -3,
                  right: -4,
                  minWidth: 17,
                  height: 17,
                  padding: "0 4px",
                  background: INK,
                  color: "#ffffff",
                  fontSize: 9.5,
                  border: "1.5px solid #ffffff",
                  letterSpacing: 0,
                }}
              >
                {count}
              </span>
            )}
          </button>

          {/* Count chips yield to the field rather than pushing it out: with
              three or four saved kinds they would otherwise eat the whole
              720px pill and squeeze the input past its min-width, spilling the
              CTA and avatar outside the rounded edge. */}
          {hasSelection && (
            <div
              className="min-w-0 flex gap-[6px] overflow-hidden"
              style={{ flex: "0 1 auto" }}
            >
              {kindCounts.map(([k, n]) => (
                <span
                  key={k}
                  className="ctl-mono"
                  style={{
                    background: palette.accentSoft,
                    color: palette.accent,
                    padding: "6px 11px",
                    borderRadius: 999,
                    fontSize: 9,
                    whiteSpace: "nowrap",
                  }}
                >
                  {n} {pluralize(k, n)}
                </span>
              ))}
            </div>
          )}

          {/* Free-text field — Enter submits the bar, same as the CTA. Locked
              while a list is saved: that list IS the brief, and the themed form
              is about to ask the rest. The placeholder says so rather than
              leaving a dead input with no explanation. */}
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onDraftKeyDown}
            disabled={hasSelection}
            placeholder={
              hasSelection ? "Building around your saved list" : bar.placeholder
            }
            aria-label={bar.placeholder}
            title={
              hasSelection
                ? "Clear your saved list to type a brief instead"
                : undefined
            }
            className="flex-1 border-none outline-none bg-transparent"
            // Floor rather than min-w-0: the field keeps a usable width and the
            // chips beside it give way instead.
            style={{
              fontSize: 13.5,
              color: INK,
              minWidth: 90,
              cursor: hasSelection ? "not-allowed" : "text",
            }}
          />

          <button
            type="button"
            onClick={doBuild}
            className="ctl-press shrink-0 relative overflow-hidden flex items-center justify-center rounded-full border-none cursor-pointer"
            style={{
              background: palette.accent,
              color: palette.accentOn,
              padding: "14px 24px",
              minWidth: 190,
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
            style={{ width: 46, height: 46 }}
          >
            {kairaAvatar(46)}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
    {desktopBar}
    <div
      className="ctl-bar-mob fixed left-0 right-0 bottom-0 z-[998]"
      style={{
        padding: "10px 14px calc(14px + env(safe-area-inset-bottom))",
        background: "rgba(250,250,245,0.9)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderTop: `1px solid ${BORDER}`,
      }}
    >
      {/* One centered column so every piece aligns; full-width under 560px. */}
      <div className="mx-auto" style={{ maxWidth: 560 }}>
        {/* Saved-list panel (toggled by the summary bar's chevron) — a white
            tray whose rows carry the theme wash so the list reads as part of
            the trip being built rather than a generic cart. */}
        {listOpen && <div style={{ marginBottom: 10 }}>{savedTray}</div>}

        {/* Summary bar — always present (matches the mockup): an accent bag,
            one chip per saved type, and a chevron. With nothing saved it reads
            "NOTHING ADDED YET · TAP + ON ANYTHING ABOVE"; the bag badge and the
            expand chevron only appear once something is saved. */}
        <button
            type="button"
            onClick={() => hasSelection && setExpanded((v) => !v)}
            aria-expanded={hasSelection ? expanded : undefined}
            className="w-full flex items-center gap-[10px]"
            style={{
              ...cardChrome(),
              borderRadius: 999,
              padding: "8px 14px 8px 9px",
              marginBottom: 10,
              boxShadow: "0 8px 20px -10px rgba(11,18,32,0.15)",
              cursor: hasSelection ? "pointer" : "default",
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
              {count > 0 && (
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
            {hasSelection ? (
              // One chip per selected type, e.g. "3 experiences · 2 places".
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
                className="ctl-mono flex-1 min-w-0 truncate"
                style={{ fontSize: 9, color: FAINT, letterSpacing: "0.12em" }}
              >
                Nothing added yet · tap + on anything above
              </span>
            )}
            <span
              className="shrink-0 flex items-center"
              style={{
                color: FAINT,
                opacity: hasSelection ? 1 : 0.5,
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
            {kairaAvatar(48)}
          </button>
        </div>
      </div>
    </div>
    </>
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
  // Fires a prompt at /chat. The second argument reports which surface fired it
  // (hero composer, ask bar, a card, a CTA) and whether the text is the
  // reader's own — the page turns that into the request's `intake` payload, so
  // pass it straight through to useSeedChat rather than dropping it.
  onSelectPrompt: SelectPrompt;
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
  // `note` is whatever the reader typed into the ask-bar, forwarded so the
  // form's submission carries it.
  onBuild?: (note?: string) => void;
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

  // "The destinations" and "Other themes" share a desktop row in the mockup.
  // They stay separate entries in the config — the pairing is purely
  // presentational, so it's derived here from adjacency rather than pushed onto
  // every page.
  //
  // Resolved in one left-to-right pass so a section can only be consumed once:
  // with three gradients in a row the first two pair and the third renders on
  // its own, rather than the third being swallowed by an already-paired second.
  const pairedWithNext = React.useMemo(() => {
    const paired = new Set<number>();
    const sections = config.sections;
    for (let i = 0; i < sections.length - 1; i++) {
      if (paired.has(i - 1)) continue; // already the tail of the previous pair
      if (sections[i].type === "gradient" && sections[i + 1].type === "gradient")
        paired.add(i);
    }
    return paired;
  }, [config.sections]);

  return (
  <PaletteContext.Provider value={palette}>
  <ThemeSelectionProvider value={selection ?? null}>
  <div
    // The phone bar gains a third row (the saved-items summary) once something
    // is saved, so the gutter under the page has to grow with it or the last
    // section sits behind the bar. Desktop is one fixed-height pill either way.
    className={`ctl-root ${
      config.askBar
        ? selection?.count
          ? "pb-[164px] md:pb-[108px]"
          : "pb-[104px] md:pb-[108px]"
        : "pb-[32px] md:pb-0"
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
      // Tail of a pair — already rendered by its partner.
      if (pairedWithNext.has(i - 1)) return null;
      if (pairedWithNext.has(i)) {
        const next = config.sections[i + 1];
        if (section.type === "gradient" && next.type === "gradient")
          return (
            <GradientPairSection
              key={key}
              left={section}
              right={next}
              onSelectPrompt={onSelectPrompt}
            />
          );
      }

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
  GradientPairSection,
  FeatureSection,
  AskKairaStrip,
  PromptCard,
  TripCard,
  GradientCard,
  PillarCard,
  ListRow,
};

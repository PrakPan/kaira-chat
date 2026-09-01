import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { optimizedMediaUrl } from "../../../../lib/mediaImage";
import { MERCURY_HOST } from "../../../../services/constants";
import BrandLockup from "../../../brand/BrandLockup";
import { CURATED_REVIEWS } from "../../../../data/travellerReviews";
import type { IntakeFormState } from "../IntakeForm/types";
import {
  DEFAULT_FEATURED,
  DEFAULT_HERO,
  resolveImage,
} from "../IntakeForm/constants";

// Look up a high-quality featured image by destination name — prefilled /
// searched destinations arrive without an image, so we match them to one of the
// curated Unsplash tiles when possible.
const FEATURED_IMAGE_BY_NAME = new Map(
  DEFAULT_FEATURED.filter((d) => d.image).map(
    (d) => [d.name.toLowerCase(), d.image as string] as const,
  ),
);

// Same geos suggest endpoint step 1 uses. When a prefilled destination arrives
// without an image and isn't one of the curated featured tiles, we look it up
// here and borrow the first result's image.
async function fetchSuggestImage(
  name: string,
  signal: AbortSignal,
): Promise<string | null> {
  const base = MERCURY_HOST;
  const res = await fetch(
    `${base}/api/v1/geos/search/suggest/?q=${encodeURIComponent(name)}`,
    { signal, headers: { Accept: "application/json" } },
  );
  if (!res.ok) throw new Error(`suggest ${res.status}`);
  const data = await res.json();
  const first = (Array.isArray(data) ? data : []).find(
    (r: any) => r && r.image && r.is_active !== false,
  );
  return resolveImage(first?.image ?? null);
}

// Imgix-backed hosts (Unsplash) honour on-the-fly resize/quality/blur params.
const IMGIX_HOST = /images\.unsplash\.com|\.imgix\.net/;

// Our media CDN (CloudFront/S3). It currently serves originals and only
// content-negotiates WebP — it IGNORES width params, so we don't resize it yet.
//
// Flip CDN_SUPPORTS_RESIZE to true once an edge resizer is deployed in front of
// this host (AWS Dynamic Image Transformation / Serverless Image Handler, or a
// CloudFront Function + Sharp). When you do, make sure the param names emitted
// in `transform()`'s CDN branch match whatever the resizer expects — that one
// branch is the only thing that needs to change.
const CDN_HOST = /d31aoa0ehgvjdi\.cloudfront\.net/;
// The Serverless Image Handler (base64 edits) is live on this host, so we mint
// sized/blurred variants via `optimizedMediaUrl` (see the CDN branch below).
const CDN_SUPPORTS_RESIZE = true;

// Match the request to what's actually painted. In the 4a layout the hero is
// not a full-bleed backdrop — it sits in a contained, roughly landscape banner
// inside the panel (see `.ttw-ilp-media`), so budget from whichever axis
// `object-cover` actually scales to: the banner's own width, or the width a 3:2
// landscape source needs to cover its height. Capped so we never ship an absurd
// file for one hero, and DPR-capped at 2.
const HERO_LANDSCAPE_RATIO = 1.5;
const HERO_MAX_W = 1800;
// Panel is 50% of the chat viewport, less the panel's own side padding.
const PANEL_FRACTION = 0.5;
const PANEL_GUTTER = 72;
// The banner gets the leftover column height — roughly this much of it.
const MEDIA_HEIGHT_FRACTION = 0.42;
function heroWidth(): number {
  if (typeof window === "undefined") return 1200;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const boxW = Math.max(
    320,
    (window.innerWidth || 1440) * PANEL_FRACTION - PANEL_GUTTER,
  );
  const boxH = Math.max(200, (window.innerHeight || 900) * MEDIA_HEIGHT_FRACTION);
  const needed = Math.max(boxW, boxH * HERO_LANDSCAPE_RATIO);
  return Math.min(HERO_MAX_W, Math.round(needed * dpr));
}

// Set/replace query params on a URL.
function setParams(url: string, params: Record<string, string>): string {
  const [path, qs = ""] = url.split("?");
  const search = new URLSearchParams(qs);
  Object.entries(params).forEach(([k, v]) => search.set(k, v));
  return `${path}?${search.toString()}`;
}

interface ImgOpts {
  /** Target render width in px. */
  w: number;
  /** Quality 1–100. */
  q: number;
  /** Optional blur radius for LQIP placeholders. */
  blur?: number;
}

// Rewrite an image URL to a sized/quality/blur variant, using each host's own
// param convention. Hosts we can't transform pass through untouched.
function transform(url: string, o: ImgOpts): string {
  if (!url) return url;
  if (IMGIX_HOST.test(url)) {
    const p: Record<string, string> = {
      w: String(o.w),
      q: String(o.q),
      auto: "format",
      fit: "crop",
    };
    if (o.blur) p.blur = String(o.blur);
    return setParams(url, p);
  }
  if (CDN_SUPPORTS_RESIZE && CDN_HOST.test(url)) {
    // Serverless Image Handler (base64 edits) — resize + optional LQIP blur.
    return optimizedMediaUrl(url, { width: o.w, quality: o.q, blur: o.blur });
  }
  return url;
}

// True when we can mint a resized variant for this host (drives LQIP support).
function canTransform(url: string): boolean {
  return IMGIX_HOST.test(url) || (CDN_SUPPORTS_RESIZE && CDN_HOST.test(url));
}

// Hero-sized render, matched to the container and DPR.
function toHeroRes(url: string): string {
  return transform(url, { w: heroWidth(), q: 75 });
}

// Optional public image-resize proxy (weserv.nl) used to mint a tiny blurred
// LQIP for hosts we can't resize ourselves — i.e. our S3/CloudFront media.
// Off by default: enabling it routes the (already public) image URL through a
// third party. Prefer the CDN edge resizer (CDN_SUPPORTS_RESIZE) once it exists;
// this is the no-infra stopgap so S3/search heroes still get a real blur-up.
const LQIP_PROXY = false;
function proxyLqip(url: string): string {
  const clean = url.replace(/^https?:\/\//, "");
  return `https://wsrv.nl/?url=${encodeURIComponent(clean)}&w=48&q=30&blur=8&output=webp`;
}

// Tiny blurred placeholder (~1–2 KB) that paints almost instantly under the full
// hero. Uses our own resize when the host supports it, else the proxy (if
// enabled). Null when neither is available — the gradient placeholder covers it.
function toLqip(url: string): string | null {
  if (canTransform(url)) return transform(url, { w: 40, q: 30, blur: 120 });
  if (LQIP_PROXY && /^https?:\/\//.test(url)) return proxyLqip(url);
  return null;
}

// Tile height of the lockup in this panel's header. BrandLockup composes the
// "AI Trip Planner" tagline under the wordmark, so no separate caption here.
const LOGO_H = 40;

// ─── Copy from the 4a design ─────────────────────────────────────────────────
// The headline is FIXED copy from the design — it is the panel's brand promise,
// not a per-destination line, so it does not change when a place is picked. The
// destination still drives the hero photo, the CTA pill and the note beside it.
const EYEBROW = "Skip the 47 Chrome tabs";
const HEADLINE_LEAD = "Go somewhere";
const HEADLINE_ACCENT = "you'll miss";
const HEADLINE_TAIL = "forever.";
const DEFAULT_NOTE = "Tell me the vibe — I'll do the rest.";
const MEDIA_BADGE = "Kaira-picked";

const PinIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

// ═══════════════════════════════════════════════════════════════════════════
// ─── Proof mosaic — the default (no destination picked) state ──────────────
// ═══════════════════════════════════════════════════════════════════════════
// Before a place is chosen there is no destination photo to show, so the banner
// slot carries proof instead. It is deliberately PICTURES, not paragraphs: the
// intake form on the right is a grid of destination photos, so a left panel
// built from stacked quote blocks made the screen read as a wall of text with
// all the colour on one side. Real trip photos, a rating badge, a row of faces,
// and one short line — about a dozen words in total.

/** Photos in the mosaic: one tall tile plus a 2×2 of smaller ones. */
const MOSAIC_TILES = 5;
/** Faces in the overlapping stack above the caption. */
const FACE_COUNT = 4;
/** Dwell time per rotating line, ms. */
const REVIEW_ROTATE_MS = 5000;

// Only reviews whose photo actually resolves are worth putting in a mosaic —
// a missing file leaves a hole in the grid, which an avatar fallback can't fix.
const REVIEW_PHOTOS = CURATED_REVIEWS.filter((r) => !!r.sourceImage);

// "Riya & Karan, Delhi" → { who: "Riya & Karan", city: "Delhi" }. Splitting on
// the LAST comma keeps names that contain one ("Riya & Karan") intact.
function splitAttribution(name: string) {
  const cut = name.lastIndexOf(",");
  if (cut === -1) return { who: name.trim(), city: "" };
  return { who: name.slice(0, cut).trim(), city: name.slice(cut + 1).trim() };
}

const ProofMosaic: React.FC = () => {
  const [i, setI] = useState(0);
  // Photos that 404'd. At least one review image is missing from /public, and a
  // tile that merely hides itself leaves a hole in the grid — the remaining
  // tiles flow into the earlier cells and the LAST cell ends up empty. Tracking
  // failures here instead lets the next unused photo slide into its place, so
  // the mosaic always renders a full set as long as enough candidates exist.
  const [broken, setBroken] = useState<string[]>([]);
  const markBroken = (src: string) =>
    setBroken((b) => (b.includes(src) ? b : [...b, src]));

  const usable = REVIEW_PHOTOS.filter(
    (r) => !broken.includes(r.sourceImage as string),
  );
  const tiles = usable.slice(0, MOSAIC_TILES);
  const faces = usable.slice(0, FACE_COUNT);

  useEffect(() => {
    if (CURATED_REVIEWS.length < 2) return;
    // Respect a reduced-motion preference: hold on the first line rather than
    // cycling content out from under someone.
    const mq =
      typeof window !== "undefined" && window.matchMedia
        ? window.matchMedia("(prefers-reduced-motion: reduce)")
        : null;
    if (mq?.matches) return;
    const id = setInterval(
      () => setI((n) => (n + 1) % CURATED_REVIEWS.length),
      REVIEW_ROTATE_MS,
    );
    return () => clearInterval(id);
  }, []);

  const current = CURATED_REVIEWS[i];
  const { who, city } = current ? splitAttribution(current.name) : { who: "", city: "" };

  return (
    <div className="ttw-ilp-proof">
      <div className="ttw-ilp-mosaic" aria-hidden="true">
        {tiles.map((r) => (
          <img
            key={r.name}
            src={r.sourceImage as string}
            alt=""
            aria-hidden="true"
            decoding="async"
            onError={() => markBroken(r.sourceImage as string)}
          />
        ))}
      </div>

      <div className="ttw-ilp-proof-scrim" aria-hidden="true" />

      <span className="ttw-ilp-proof-badge">
        <span className="ttw-ilp-proof-star">★</span> 4.9 Google
      </span>

      <div className="ttw-ilp-proof-foot">
        <div className="ttw-ilp-faces">
          {faces.map((r) => (
            <img
              key={r.name}
              src={r.sourceImage as string}
              alt=""
              aria-hidden="true"
              decoding="async"
              onError={() => markBroken(r.sourceImage as string)}
            />
          ))}
          <span className="ttw-ilp-faces-count">10,000+ trips planned</span>
        </div>

        {current && (
          // keyed so the line re-runs its fade on every rotation
          <p className="ttw-ilp-proof-line" key={current.name}>
            <span className="ttw-ilp-proof-quote">{current.location}</span>
            <span className="ttw-ilp-proof-by">
              {who}
              {city && ` · ${city}`}
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

/**
 * Left hero panel shown during the intake flow — the "4a" design: brand lockup,
 * mono eyebrow, the fixed headline, a wide contained image banner, the CTA row,
 * then the trust strip. The hero photo, the CTA pill's label and the note beside
 * it swap whenever the user selects a destination in the form (read straight
 * from the `IntakeForm` Redux slice).
 *
 * Sizes come off the CONTAINER, not the viewport: the panel is only ~50% of the
 * chat width and that fraction shrinks again when the sidebar is expanded, so
 * viewport units would over-size the type on exactly the layouts with the least
 * room. The design's own values (62px headline, 36px gutter, …) are the top of
 * each scale, reached at the 640px width the design was drawn at. Everything
 * responsive here is CSS-only: swapping layouts from a JS media query would
 * change the panel's height at hydration.
 */
const IntakeLeftPanel: React.FC = () => {
  const destination = useSelector(
    (s: any) => (s.IntakeForm as IntakeFormState)?.destination,
  );
  // Theme hero (image + copy) for the themed mini-form flow — used when no
  // destination is picked (see BotApp's themed-form branch).
  const themeHero = useSelector(
    (s: any) => (s.IntakeForm as IntakeFormState)?.themeHero,
  );

  // Resolve a base image from what the destination already carries: its own
  // image, or a curated featured tile matched by name.
  const directImage =
    destination?.image ||
    (destination?.name &&
      FEATURED_IMAGE_BY_NAME.get(destination.name.toLowerCase())) ||
    null;

  // When neither is available, look the destination up via the suggest API and
  // use the first result's image (mirrors the step 1 search flow).
  const [suggestImage, setSuggestImage] = useState<string | null>(null);
  useEffect(() => {
    setSuggestImage(null);
    if (directImage || !destination?.name) return;
    const controller = new AbortController();
    fetchSuggestImage(destination.name, controller.signal)
      .then((img) => {
        if (img) setSuggestImage(img);
      })
      .catch((err: any) => {
        if (err?.name !== "AbortError")
          console.warn("[IntakeLeftPanel] suggest image failed:", err?.message);
      });
    return () => controller.abort();
  }, [directImage, destination?.name]);

  // The candidate hero before any load-error fallback. If it fails to load we
  // drop back to the default hero image. The theme hero image is used when no
  // destination is picked (themed mini-form flow).
  const candidate = directImage || suggestImage || themeHero?.image || null;
  const [imgError, setImgError] = useState(false);
  useEffect(() => setImgError(false), [candidate]);

  const baseImage = candidate && !imgError ? candidate : DEFAULT_HERO.image;
  const image = toHeroRes(baseImage);
  const lqip = toLqip(baseImage);
  // Track the hero image load so we can shimmer until it's ready. Reset on
  // every image change (keyed <img> remounts, but this state lives here).
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  useEffect(() => {
    // A cached image can finish loading before React attaches the `onLoad`
    // handler on the freshly-keyed <img>, so `onLoad` never fires and
    // `imgLoaded` would stay false forever — leaving the blurred LQIP visible
    // on top of a hidden (opacity:0) sharp image. Seed the state from the
    // element's own completion status here, then let onLoad/onError drive the
    // genuine network case.
    const node = imgRef.current;
    setImgLoaded(!!(node && node.complete && node.naturalWidth > 0));
  }, [image]);

  // Is there a specific place to show a photo OF? A themed flow carries its own
  // hero image, so that counts too. Without one the banner slot shows reviews
  // rather than a generic stock landscape.
  const hasHeroSubject = !!(destination?.name || themeHero?.image);

  // The destination's own copy fills the CTA row. `place_tag` defaults to the
  // design's "Pick a place to begin" before anything is chosen.
  const subtext = destination?.headline || themeHero?.subtext || null;
  const placeTag =
    destination?.place_tag ||
    themeHero?.tag ||
    (destination ? destination.country || "Your pick" : DEFAULT_HERO.place_tag);

  return (
    <div className="ttw-ilp">
      <style dangerouslySetInnerHTML={{ __html: PANEL_CSS }} />

      {/* Brand lockup — items-start keeps the inline-flex lockup from
          stretching to the full panel width under the column's default
          align-items:stretch. */}
      {/* <div className="ttw-ilp-pad flex flex-col items-start">
        <BrandLockup size={LOGO_H} variant="light" />
      </div> */}

      {/* Type block */}
      <div className="ttw-ilp-pad ttw-ilp-copy">
        {/* <div className="ttw-ilp-eyebrow">
          <span className="ttw-ilp-rule" aria-hidden="true" />
          {EYEBROW}
        </div> */}
        <h1 className="ttw-ilp-headline">
          {HEADLINE_LEAD}{" "}
          <span className="ttw-ilp-accent">{HEADLINE_ACCENT}</span>{" "}
          {HEADLINE_TAIL}
        </h1>
      </div>

      {/* Banner slot — takes the leftover column height. Reviews until there
          is a destination worth photographing, then the hero photo. */}
      {!hasHeroSubject ? (
        <ProofMosaic />
      ) : (
      <div className="ttw-ilp-media">
        {/* Instant gradient backdrop — paints with zero network for every
            source (S3, search, default), so there's no shimmer/empty gap. */}
        {!imgLoaded && (
          <div className="ttw-ilp-ph absolute inset-0" aria-hidden="true" />
        )}
        {/* Real blurred low-res preview on top of the backdrop, when we can
            mint one for this host. Fades the backdrop away as it arrives. */}
        {!imgLoaded && lqip && (
          <img
            key={lqip}
            src={lqip}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: "blur(18px)", transform: "scale(1.08)" }}
          />
        )}
        {/* Hero image (keyed so it cross-fades on change) */}
        <img
          key={image}
          ref={imgRef}
          src={image}
          alt={destination?.name || "Destination"}
          fetchPriority="high"
          decoding="async"
          onLoad={() => setImgLoaded(true)}
          onError={() => {
            setImgLoaded(true);
            // Swap to the default hero when the candidate image can't load.
            if (candidate && !imgError) setImgError(true);
          }}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            animation: "ttwIlpFade .7s ease",
            opacity: imgLoaded ? 1 : 0,
            transition: "opacity .4s ease",
          }}
        />
        <span className="ttw-ilp-badge">{MEDIA_BADGE}</span>
      </div>
      )}

      {/* CTA row */}
      <div className="ttw-ilp-pad ttw-ilp-cta">
        <span className="ttw-ilp-pill">
          <PinIcon />
          {placeTag}
        </span>
        <p className="ttw-ilp-note">{subtext || DEFAULT_NOTE}</p>
      </div>

      <div className="ttw-ilp-pad">
        <div className="ttw-ilp-divider" />
      </div>

      {/* Trust strip */}
      <div className="ttw-ilp-pad ttw-ilp-trust">
        <span>
          <span className="ttw-ilp-star">★</span> <b>4.9</b>/5 Google
        </span>
        <span className="ttw-ilp-sep" aria-hidden="true">
          |
        </span>
        <span>
          <b>10,000+</b> trips
        </span>
        <span className="ttw-ilp-sep" aria-hidden="true">
          |
        </span>
        <span>Real curators</span>
      </div>
    </div>
  );
};

// ─── Panel CSS ───────────────────────────────────────────────────────────────
// The 4a design's own values are the TOP of every scale here, hit at the 640px
// width it was drawn at; below that each one scales down with the container.
// Sizes are in `cqi` (percent of the panel's own inline size) rather than `vw`
// because the panel is ~50% of the chat area and narrows again when the sidebar
// expands. Every fluid rule declares a static px fallback on the line above it,
// so a browser without container queries gets the compact end of the scale
// rather than dropping the declaration entirely.
const PANEL_CSS = `
  .ttw-ilp {
    container-type: inline-size;
    container-name: ttwilp;
    position: relative;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: #FAFAF5;
    font-family: 'Inter', sans-serif;
    padding: 22px 0;
    padding: clamp(18px, 5.6cqi, 36px) 0;
    box-sizing: border-box;
  }
  /* The design's 36px gutter, shared by every row so the banner lines up with
     the type above it and the trust strip below. */
  .ttw-ilp-pad {
    padding-left: 22px;
    padding-left: clamp(18px, 5.6cqi, 36px);
    padding-right: 22px;
    padding-right: clamp(18px, 5.6cqi, 36px);
  }

  .ttw-ilp-copy {
    display: flex;
    flex-direction: column;
    gap: 14px;
    gap: clamp(10px, 3.75cqi, 24px);
    margin-top: 22px;
    margin-top: clamp(16px, 5.6cqi, 36px);
  }

  .ttw-ilp-eyebrow {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 10px;
    font-size: clamp(9.5px, 1.72cqi, 11px);
    letter-spacing: .14em;
    text-transform: uppercase;
    color: #445069;
  }
  .ttw-ilp-rule {
    width: 24px;
    height: 1px;
    background: #445069;
    flex-shrink: 0;
  }

  /* 4a: 62px / 800 / line-height .95 / letter-spacing -.045em / #0b1220. */
  .ttw-ilp-headline {
    margin: 0;
    font-weight: 800;
    font-size: 30px;
    font-size: clamp(26px, 9.7cqi, 62px);
    line-height: .95;
    letter-spacing: -.045em;
    color: #0B1220;
  }
  /* The yellow marker block: Instrument Serif italic, rotated a degree and a
     half so it reads as placed by hand. inline-block is what lets it rotate —
     it also keeps the phrase from being split across two lines. */
  .ttw-ilp-accent {
    display: inline-block;
    font-family: 'Instrument Serif', Georgia, serif;
    font-style: italic;
    font-weight: 400;
    background: #F7E700;
    border-radius: 6px;
    padding: 0 .19em;
    transform: rotate(-1.5deg);
  }

  .ttw-ilp-media {
    position: relative;
    flex: 1 1 auto;
    min-height: 120px;
    overflow: hidden;
    border-radius: 16px;
    border-radius: clamp(14px, 3.44cqi, 22px);
    background: #EFECE1;
    margin-top: 18px;
    margin-top: clamp(14px, 4.4cqi, 28px);
    margin-bottom: 18px;
    margin-bottom: clamp(14px, 4.4cqi, 28px);
    margin-left: 22px;
    margin-left: clamp(18px, 5.6cqi, 36px);
    margin-right: 22px;
    margin-right: clamp(18px, 5.6cqi, 36px);
  }
  /* Instant, network-free placeholder shown until the hero decodes. Warm
     neutrals so it reads as part of the cream panel, gently breathing so it
     doesn't look like a dead frame. */
  .ttw-ilp-ph {
    background:
      radial-gradient(120% 90% at 25% 20%, #E8E4D6 0%, transparent 55%),
      radial-gradient(120% 90% at 80% 80%, #DCD7C7 0%, transparent 60%),
      linear-gradient(135deg, #EFECE1 0%, #E5E1D3 50%, #EAE6D9 100%);
    animation: ttwIlpPulse 2.2s ease-in-out infinite;
  }
  @keyframes ttwIlpPulse { 0%,100% { opacity: 1; } 50% { opacity: .82; } }
  @keyframes ttwIlpFade {
    from { opacity: 0; transform: scale(1.06); }
    to { opacity: 1; transform: scale(1); }
  }

  /* ── Proof mosaic (default state) ─────────────────────────────────────────
     Occupies the same box as the image banner — same flex, same margins, same
     radius — so the column's rhythm is identical whichever one is showing. */
  .ttw-ilp-proof {
    position: relative;
    flex: 1 1 auto;
    min-height: 140px;
    overflow: hidden;
    background: #EFECE1;
    border-radius: 16px;
    border-radius: clamp(14px, 3.44cqi, 22px);
    margin-top: 18px;
    margin-top: clamp(14px, 4.4cqi, 28px);
    margin-bottom: 18px;
    margin-bottom: clamp(14px, 4.4cqi, 28px);
    margin-left: 22px;
    margin-left: clamp(18px, 5.6cqi, 36px);
    margin-right: 22px;
    margin-right: clamp(18px, 5.6cqi, 36px);
  }

  /* One tall tile on the left, a 2×2 of smaller ones beside it. The tall tile
     is the first child; if a photo 404s its tile unmounts and the grid closes
     up on its own. */
  .ttw-ilp-mosaic {
    position: absolute;
    inset: 0;
    display: grid;
    grid-template-columns: 1.45fr 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 3px;
  }
  .ttw-ilp-mosaic img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    animation: ttwIlpTileIn .55s ease both;
  }
  .ttw-ilp-mosaic img:first-child { grid-row: span 2; }
  .ttw-ilp-mosaic img:nth-child(2) { animation-delay: .06s; }
  .ttw-ilp-mosaic img:nth-child(3) { animation-delay: .12s; }
  .ttw-ilp-mosaic img:nth-child(4) { animation-delay: .18s; }
  .ttw-ilp-mosaic img:nth-child(5) { animation-delay: .24s; }
  @keyframes ttwIlpTileIn {
    from { opacity: 0; transform: scale(1.06); }
    to { opacity: 1; transform: none; }
  }

  /* Clear at the top so the photos read, heavy at the bottom to carry the
     faces row and the rotating line. */
  .ttw-ilp-proof-scrim {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      rgba(10,14,22,.30) 0%,
      transparent 26%,
      transparent 42%,
      rgba(10,14,22,.90) 100%
    );
    pointer-events: none;
  }

  .ttw-ilp-proof-badge {
    position: absolute;
    left: 12px;
    top: 12px;
    z-index: 2;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 6px 12px;
    border-radius: 999px;
    background: rgba(10,16,32,.72);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,.16);
    color: #fff;
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 9.5px;
    font-size: clamp(9px, 1.6cqi, 10.5px);
    letter-spacing: .1em;
    text-transform: uppercase;
    white-space: nowrap;
    pointer-events: none;
  }
  .ttw-ilp-proof-star { color: #F7E700; }

  .ttw-ilp-proof-foot {
    position: absolute;
    left: 14px;
    right: 14px;
    bottom: 13px;
    z-index: 2;
    display: flex;
    flex-direction: column;
    gap: 10px;
    gap: clamp(8px, 1.9cqi, 12px);
    pointer-events: none;
  }

  /* Overlapping faces — the ring is what separates them against a photo. */
  .ttw-ilp-faces {
    display: flex;
    align-items: center;
    min-width: 0;
  }
  .ttw-ilp-faces img {
    width: 26px;
    width: clamp(22px, 4.6cqi, 30px);
    aspect-ratio: 1;
    height: auto;
    border-radius: 50%;
    object-fit: cover;
    display: block;
    flex-shrink: 0;
    border: 2px solid rgba(255,255,255,.92);
    box-shadow: 0 2px 6px rgba(0,0,0,.3);
  }
  .ttw-ilp-faces img + img { margin-left: -9px; }
  .ttw-ilp-faces-count {
    margin-left: 10px;
    min-width: 0;
    color: #fff;
    font-weight: 600;
    font-size: 12px;
    font-size: clamp(11.5px, 2.1cqi, 13.5px);
    letter-spacing: -.01em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-shadow: 0 1px 8px rgba(0,0,0,.45);
  }

  /* The one line of review copy: the review's own short headline, in the
     design's serif-italic accent face, plus who said it. */
  .ttw-ilp-proof-line {
    margin: 0;
    min-width: 0;
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    gap: 4px 9px;
    animation: ttwIlpLineIn .5s ease both;
  }
  @keyframes ttwIlpLineIn {
    from { opacity: 0; transform: translateY(5px); }
    to { opacity: 1; transform: none; }
  }
  .ttw-ilp-proof-quote {
    font-family: 'Instrument Serif', Georgia, serif;
    font-style: italic;
    font-weight: 400;
    color: #fff;
    line-height: 1.15;
    font-size: 19px;
    font-size: clamp(16px, 3.5cqi, 24px);
    text-shadow: 0 1px 10px rgba(0,0,0,.5);
  }
  .ttw-ilp-proof-quote::before { content: "\\201C"; }
  .ttw-ilp-proof-quote::after { content: "\\201D"; }
  .ttw-ilp-proof-by {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 9.5px;
    font-size: clamp(9px, 1.6cqi, 10.5px);
    letter-spacing: .1em;
    text-transform: uppercase;
    color: rgba(255,255,255,.78);
    white-space: nowrap;
  }


  .ttw-ilp-badge {
    position: absolute;
    right: 16px;
    bottom: 16px;
    padding: 7px 14px;
    border-radius: 999px;
    background: rgba(10,16,32,.8);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    color: #fff;
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 9.5px;
    font-size: clamp(9px, 1.56cqi, 10px);
    letter-spacing: .08em;
    text-transform: uppercase;
    pointer-events: none;
    white-space: nowrap;
  }

  /* Base = stacked (narrow panel). Widened to the design's side-by-side row in
     the container query below. */
  .ttw-ilp-cta {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 16px;
    margin-bottom: clamp(12px, 3.75cqi, 24px);
  }
  .ttw-ilp-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
    max-width: 100%;
    padding: 10px 18px;
    padding: clamp(9px, 1.9cqi, 12px) clamp(15px, 3.44cqi, 22px);
    border-radius: 999px;
    background: #0B1220;
    color: #fff;
    font-weight: 600;
    font-size: 13.5px;
    font-size: clamp(13px, 2.34cqi, 15px);
    line-height: 1.2;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .ttw-ilp-pill svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }
  .ttw-ilp-note {
    margin: 0;
    font-size: 12.5px;
    font-size: clamp(12px, 2.19cqi, 14px);
    line-height: 1.5;
    color: #445069;
    /* Long destination headlines must not push the banner around. */
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .ttw-ilp-divider {
    height: 1px;
    background: #ECECEC;
    margin-bottom: 14px;
    margin-bottom: clamp(12px, 2.8cqi, 18px);
  }

  .ttw-ilp-trust {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 6px 14px;
    gap: clamp(5px, 1.2cqi, 8px) clamp(10px, 3.1cqi, 20px);
    font-size: 12px;
    font-size: clamp(11.5px, 2.19cqi, 14px);
    color: #445069;
    white-space: nowrap;
  }
  .ttw-ilp-trust b { color: #0B1220; font-weight: 700; }
  .ttw-ilp-star { color: #F5A623; }
  .ttw-ilp-sep { color: #DFE2EA; }

  @container ttwilp (min-width: 460px) {
    /* Enough room for the design's pill-and-note row. */
    .ttw-ilp-cta {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }
    .ttw-ilp-note { max-width: 280px; text-align: right; }
  }
  @container ttwilp (max-width: 380px) {
    /* Very narrow panel: the mono eyebrow rule goes before anything starts
       truncating, and the design's tight tracking stops helping. */
    .ttw-ilp-rule { display: none; }
    .ttw-ilp-headline { letter-spacing: -.03em; }
  }

  /* Short panels (laptop viewports, browser chrome eating the height): tighten
     the vertical rhythm so the banner keeps a usable share of the column.
     Height is a viewport question, not a container one — @container only
     queries inline size here. */
  @media (max-height: 820px) {
    .ttw-ilp { padding: 16px 0; }
    .ttw-ilp-copy { margin-top: 14px; gap: 10px; }
    .ttw-ilp-headline { font-size: clamp(24px, 7.8cqi, 46px); }
    .ttw-ilp-media,
    .ttw-ilp-proof { margin-top: 14px; margin-bottom: 14px; }
  }
  @media (max-height: 640px) {
    /* Below this the trust strip is worth more than the eyebrow, and the faces
       row is worth more than the rotating line. */
    .ttw-ilp-eyebrow { display: none; }
    .ttw-ilp-headline { font-size: clamp(22px, 6.2cqi, 36px); }
    .ttw-ilp-proof-line { display: none; }
  }

  @media (prefers-reduced-motion: reduce) {
    .ttw-ilp-ph { animation: none; }
    .ttw-ilp-media img { animation: none !important; }
    /* Rotation itself is already skipped in JS; this covers the entrances. */
    .ttw-ilp-mosaic img,
    .ttw-ilp-proof-line { animation: none; }
  }
`;

export default IntakeLeftPanel;

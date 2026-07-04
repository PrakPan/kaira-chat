import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { MERCURY_HOST } from "../../../../services/constants";
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
  const base = MERCURY_HOST || "https://mercury.tarzanway.com";
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
const CDN_SUPPORTS_RESIZE = false;

// Match the request to what's actually painted: the panel is ~640px wide, so a
// DPR-capped render is sharp without shipping a 2000px file. Falls back to a
// safe default during SSR.
function heroWidth(): number {
  if (typeof window === "undefined") return 1280;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  return Math.min(1600, Math.round(640 * dpr));
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
    // Query-param convention — keep in sync with the deployed edge resizer.
    const p: Record<string, string> = {
      width: String(o.w),
      quality: String(o.q),
      format: "webp",
    };
    if (o.blur) p.blur = String(o.blur);
    return setParams(url, p);
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

/**
 * Left hero panel shown during the intake flow. The background image, headline
 * and place tag swap whenever the user selects a destination in the form (read
 * straight from the `IntakeForm` Redux slice).
 */
const IntakeLeftPanel: React.FC = () => {
  const destination = useSelector(
    (s: any) => (s.IntakeForm as IntakeFormState)?.destination,
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
  // drop back to the default hero image.
  const candidate = directImage || suggestImage;
  const [imgError, setImgError] = useState(false);
  useEffect(() => setImgError(false), [candidate]);

  const baseImage = candidate && !imgError ? candidate : DEFAULT_HERO.image;
  const image = toHeroRes(baseImage);
  const lqip = toLqip(baseImage);
  // Track the hero image load so we can shimmer until it's ready. Reset on
  // every image change (keyed <img> remounts, but this state lives here).
  const [imgLoaded, setImgLoaded] = useState(false);
  useEffect(() => setImgLoaded(false), [image]);
  // Big title: destination name with "your way" beneath it; the destination's
  // headline copy becomes the subtext. Falls back to the default hero copy
  // before any destination is picked.
  const title = destination?.name || null;
  const subtext = destination?.headline || null;
  const placeTag =
    destination?.place_tag ||
    (destination ? destination.country || "Your pick" : DEFAULT_HERO.place_tag);

  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: "#0f1a2e" }}>
      {/* Instant gradient backdrop — paints with zero network for every source
          (S3, search, default), so there's no shimmer/empty-navy gap. */}
      {!imgLoaded && (
        <div className="ttw-hero-ph absolute inset-0" aria-hidden="true" />
      )}
      {/* Real blurred low-res preview on top of the backdrop, when we can mint
          one for this host. Fades the backdrop away as it arrives. */}
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
      {/* Background image (keyed so it cross-fades on change) */}
      <img
        key={image}
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
          animation: "ttwHeroFade .7s ease",
          opacity: imgLoaded ? 1 : 0,
          transition: "opacity .4s ease",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(11,18,32,0.5) 0%, transparent 30%, transparent 48%, rgba(11,18,32,0.88) 100%)",
        }}
      />

      <style>{`
        /* Instant, network-free blurred-looking backdrop shown until the hero
           decodes. Soft diagonal navy blend, gently breathing so it doesn't
           read as a dead frame. */
        .ttw-hero-ph {
          background:
            radial-gradient(120% 90% at 25% 20%, #223a5e 0%, transparent 55%),
            radial-gradient(120% 90% at 80% 80%, #16243d 0%, transparent 60%),
            linear-gradient(135deg, #101d33 0%, #1b2c49 50%, #0f1a2e 100%);
          animation: ttwHeroPulse 2.2s ease-in-out infinite;
        }
        @keyframes ttwHeroPulse { 0%,100% { opacity: 1; } 50% { opacity: 0.82; } }
        @keyframes ttwHeroFade { from { opacity: 0; transform: scale(1.06); } to { opacity: 1; transform: scale(1); } }
      `}</style>

      {/* Content */}
      <div className="absolute inset-0 z-[3] flex flex-col p-[30px_34px]">
        {/* Logo */}
        <div className="flex items-center gap-[10px]">
          <div
            className="w-[34px] h-[34px] grid place-items-center rounded-[10px] font-serif italic text-[19px]"
            // style={{ background: "#f7e700", color: "#0f1a2e", transform: "rotate(-6deg)" }}
          >
           <img src="https://d31aoa0ehgvjdi.cloudfront.net/media/website/logoyellow.png" alt="The Tarzan Way" width={36} height={36} />
          </div>
          <div className="flex flex-col leading-none text-white">
            <span className="text-[15px] font-bold tracking-tight">thetarzanway</span>
            <span className="text-[10.5px] mt-[2px]" style={{ color: "rgba(255,255,255,0.7)" }}>
              plan with Kaira
            </span>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-auto">
          <span
            className="inline-flex items-center gap-[6px] px-3 py-[5px] rounded-full text-[11.5px] font-bold text-white mb-4"
            style={{
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.25)",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {placeTag}
          </span>
          <div className="mb-[18px] max-w-[360px]">
            {title ? (
              <>
                <div
                  className="text-white text-[34px] tracking-tight leading-[1.05]"
                  style={{ fontWeight: 500 }}
                >
                  {title}
                </div>
                {/* <div
                  className="text-white/90 text-[24px] tracking-tight leading-[1.1]"
                  style={{ fontWeight: 400 }}
                >
                 
                </div> */}
                {subtext && (
                  <div className="text-white/75 text-[13.5px] font-medium mt-[10px] leading-[1.45]">
                    {subtext}
                  </div>
                )}
              </>
            ) : (
              <div
                className="text-white text-[30px] tracking-tight leading-[1.12]"
                style={{ fontWeight: 500 }}
              >
                {DEFAULT_HERO.headline}
              </div>
            )}
          </div>
          <div
            className="flex items-center gap-[14px] pt-4"
            style={{ borderTop: "1px solid rgba(255,255,255,0.18)" }}
          >
            <span className="text-white text-[12px] font-semibold flex items-center gap-[6px]">
              <span style={{ color: "#ffc400" }}>★</span> <b>4.9</b>/5 Google
            </span>
            <span className="w-px h-[18px]" style={{ background: "rgba(255,255,255,0.2)" }} />
            <span className="text-white text-[12px] font-semibold">
              <b>10,000+</b> trips
            </span>
            <span className="w-px h-[18px]" style={{ background: "rgba(255,255,255,0.2)" }} />
            <span className="text-white text-[12px] font-semibold">Real curators</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntakeLeftPanel;

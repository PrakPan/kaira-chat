import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { IntakeFormState } from "../IntakeForm/types";
import { DEFAULT_FEATURED, DEFAULT_HERO } from "../IntakeForm/constants";

// Look up a high-quality featured image by destination name — prefilled /
// searched destinations arrive without an image, so we match them to one of the
// curated Unsplash tiles when possible.
const FEATURED_IMAGE_BY_NAME = new Map(
  DEFAULT_FEATURED.filter((d) => d.image).map(
    (d) => [d.name.toLowerCase(), d.image as string] as const,
  ),
);

// Bump the Unsplash width param up to a hero-sized render.
function toHeroRes(url: string, width = 2000): string {
  if (!url) return url;
  if (/[?&]w=\d+/.test(url)) return url.replace(/([?&])w=\d+/, `$1w=${width}`);
  return `${url}${url.includes("?") ? "&" : "?"}w=${width}&q=80&auto=format&fit=crop`;
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

  const baseImage =
    destination?.image ||
    (destination?.name &&
      FEATURED_IMAGE_BY_NAME.get(destination.name.toLowerCase())) ||
    DEFAULT_HERO.image;
  const image = toHeroRes(baseImage, 2000);
  // Track the hero image load so we can shimmer until it's ready. Reset on
  // every image change (keyed <img> remounts, but this state lives here).
  const [imgLoaded, setImgLoaded] = useState(false);
  useEffect(() => setImgLoaded(false), [image]);
  const headline =
    destination?.headline ||
    (destination ? `${destination.name}, your way.` : DEFAULT_HERO.headline);
  const placeTag =
    destination?.place_tag ||
    (destination ? destination.country || "Your pick" : DEFAULT_HERO.place_tag);

  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: "#0f1a2e" }}>
      {/* Skeleton shimmer until the hero image loads */}
      {!imgLoaded && (
        <div className="ttw-hero-skel absolute inset-0" aria-hidden="true" />
      )}
      {/* Background image (keyed so it cross-fades on change) */}
      <img
        key={image}
        src={image}
        alt={destination?.name || "Destination"}
        onLoad={() => setImgLoaded(true)}
        onError={() => setImgLoaded(true)}
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
        @keyframes ttwHeroShimmer { 0% { background-position: -600px 0; } 100% { background-position: 600px 0; } }
        .ttw-hero-skel {
          background: linear-gradient(90deg, #16243d 0%, #25324d 50%, #16243d 100%);
          background-size: 1200px 100%;
          animation: ttwHeroShimmer 1.4s linear infinite;
        }
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
          <div className="text-white text-[30px] font-extrabold tracking-tight leading-[1.12] mb-[18px] max-w-[340px]">
            {headline}
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

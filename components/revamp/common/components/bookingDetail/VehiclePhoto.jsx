import React, { useState } from "react";
import { getModeAccent } from "./modeAccent";
import { resolveImageUrl } from "../../../../../helper/imageUrl";

/**
 * The supplier's photo of the booked car. Cutout car photos are transparent
 * PNGs, so they float unanchored on white — this sets them on a soft wash of
 * the mode's accent, which reads as a stage for the vehicle.
 *
 * Falls back to the mode glyph when the booking has no photo or the supplier's
 * CDN drops it.
 *
 * A plain <img> rather than ImageLoader: these URLs are absolute supplier
 * links, not keys in our own bucket, and ImageLoader's lazy-load never settles
 * reliably inside a drawer that mounts after the page has loaded. Same choice
 * the redesigned taxi search card makes.
 */
export default function VehiclePhoto({
  image,
  alt,
  mode = "Taxi",
  // The drawer's own gutter, by default. A photo nested inside a card — one per
  // cab of a mixed fleet — sits on that card's narrower gutter instead.
  className = "mx-4 mb-4",
}) {
  const [failed, setFailed] = useState(false);

  const accent = getModeAccent(mode);
  // Our own images arrive as bucket keys, supplier ones as absolute URLs.
  const src = resolveImageUrl(image);
  const showImage = !!src && !failed;

  return (
    <div
      className={`flex items-center justify-center rounded-xl h-[128px] ${className}`}
      style={{
        background: `radial-gradient(120% 110% at 50% 22%, ${accent.soft} 0%, ${accent.wash} 52%, #ffffff 100%)`,
      }}
    >
      <div className="w-full max-w-[240px] h-full flex justify-center items-center p-3">
        {showImage ? (
          <img
            src={src}
            alt={alt || "Vehicle"}
            loading="lazy"
            decoding="async"
            // Sized and painted inline — the app's unscoped `img {}` rules
            // otherwise crop this to fill (`object-fit: cover`) and run it
            // through the hero-image blur/desaturate filter.
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              maxWidth: "none",
              objectFit: "contain",
              margin: 0,
              filter: "none",
            }}
            onError={() => setFailed(true)}
          />
        ) : (
          <accent.Icon size={56} color={accent.solid} style={{ opacity: 0.25 }} />
        )}
      </div>
    </div>
  );
}

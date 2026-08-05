import React, { useState } from "react";
import { getModeAccent } from "./modeAccent";

/**
 * The supplier's photo of the booked car, sitting at the top of the Vehicle
 * card. Cutout car photos are transparent PNGs, so they float unanchored on a
 * white card — this sets them on a soft wash of the mode's accent, which reads
 * as a stage for the vehicle rather than a gap in the card.
 *
 * Falls back to the mode glyph when the booking has no photo or the supplier's
 * CDN drops it.
 *
 * A plain <img> rather than ImageLoader: these URLs are absolute supplier
 * links, not keys in our own bucket, and ImageLoader's lazy-load never settles
 * reliably inside a drawer that mounts after the page has loaded. Same choice
 * the redesigned taxi search card makes.
 */
export default function VehiclePhoto({ image, alt, mode = "Taxi" }) {
  const [failed, setFailed] = useState(false);

  const accent = getModeAccent(mode);
  const showImage = !!image && !failed;

  return (
    <div
      className="flex items-center justify-center px-4 py-5 border-b"
      style={{
        // Focal point sits below the top edge so the wash doesn't collide with
        // the card's own tinted header strip directly above it.
        background: `radial-gradient(130% 110% at 50% 20%, ${accent.soft} 0%, ${accent.wash} 48%, #ffffff 100%)`,
        borderColor: "#efede6",
      }}
    >
      <div className="w-full max-w-[240px] h-[128px] flex justify-center items-center">
        {showImage ? (
          <img
            src={image}
            alt={alt || "Vehicle"}
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

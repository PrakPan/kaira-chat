import React, { useState } from "react";
import { getModeAccent } from "./modeAccent";
import { resolveImageUrl } from "../../../../../helper/imageUrl";
import {
  getTaxiTypeGlyph,
  isGenericTaxiGlyph,
} from "../../../../../helper/taxiTypeGlyph";

/**
 * The supplier's photo of the booked car. Cutout car photos are transparent
 * PNGs, so they float unanchored on white — this sets them on a soft wash of
 * the mode's accent, which reads as a stage for the vehicle.
 *
 * Falls back to a silhouette of the vehicle's own class when the booking has no
 * photo or the supplier's CDN drops it — a van and a sedan are different cars
 * and an empty state that says so is worth more than a generic one. Only when
 * the class is unrecognised (or unstated, as on a ferry or a train) does it drop
 * back to the mode glyph.
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
  // The vehicle class and model, for the empty state. `taxi_category.type` and
  // `.model_name` on a taxi quote; absent on the modes that have no such thing.
  vehicleType,
  modelName,
  // The drawer's own gutter, by default. A photo nested inside a card — one per
  // cab of a mixed fleet — sits on that card's narrower gutter instead.
  className = "mx-4 mb-4",
}) {
  const [failed, setFailed] = useState(false);

  const accent = getModeAccent(mode);
  // Our own images arrive as bucket keys, supplier ones as absolute URLs.
  const src = resolveImageUrl(image);
  const showImage = !!src && !failed;

  // Sized against the 128px stage, each class taking its own share of it, so a
  // mini van reads smaller than a van here exactly as it does in the results.
  const typeGlyph = getTaxiTypeGlyph(vehicleType, modelName);
  const generic = isGenericTaxiGlyph(typeGlyph);
  const Glyph = generic ? accent.Icon : typeGlyph.Icon;
  const glyphSize = generic ? 56 : Math.round(86 * typeGlyph.scale);

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
          <Glyph size={glyphSize} color={accent.solid} style={{ opacity: 0.25 }} />
        )}
      </div>
    </div>
  );
}

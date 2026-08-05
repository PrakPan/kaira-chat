import React, { useState } from "react";
import { getModeAccent } from "./modeAccent";

/**
 * The little tile beside a transfer booking's title.
 *
 * Shows the vehicle the supplier sent a photo of — a taxi booking carries the
 * actual car — and falls back to the transport-mode glyph on the mode's own
 * tint when it didn't (or when the photo 404s, which the supplier CDNs do).
 *
 * Deliberately not `helper/TransfersIcon`: that renders remote PNGs and pads
 * them with `p-3`, which at this size leaves nothing of the glyph visible. The
 * inline icons here also match the rest of the booking-detail chrome, which is
 * all currentColor SVG on the Kaira palette.
 */
export default function ModeThumb({ mode, image, alt, size = 36 }) {
  const [imageFailed, setImageFailed] = useState(false);

  const accent = getModeAccent(mode);
  const showImage = !!image && !imageFailed;

  return (
    <div
      className="rounded-xl flex items-center justify-center overflow-hidden shrink-0"
      style={{ width: size, height: size, background: accent.soft }}
    >
      {showImage ? (
        <img
          src={image}
          alt={alt || mode || "Transfer"}
          // Every paint and sizing property is set inline: this app ships
          // unscoped `img {}` rules that force `object-fit: cover` (which crops
          // a photo to fill) and a `filter: blur(.3px) brightness(.96)
          // saturate(.92)` leaked from a hero-image module. No utility class
          // can out-specify a filter nothing else sets.
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            maxWidth: "none",
            objectFit: "contain",
            margin: 0,
            filter: "none",
          }}
          onError={() => setImageFailed(true)}
        />
      ) : (
        <accent.Icon
          size={Math.round(size * 0.55)}
          color={accent.solid}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

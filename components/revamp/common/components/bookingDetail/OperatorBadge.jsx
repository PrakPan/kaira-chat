import React, { useState } from "react";

/**
 * Who runs a journey leg, and how long it takes — the pill that sits on the
 * timeline rail between a departure and an arrival.
 *
 * Every dimension and paint property is set inline rather than with utility
 * classes, because this app ships several unscoped `img { … }` rules — one
 * forces `object-fit: cover` (which crops a wordmark logo top and bottom) and
 * another applies `filter: blur(.3px) brightness(.96) saturate(.92)`, leaked
 * out of a hero-image module. Inline styles are the only thing that reliably
 * beats them, since a utility class can't out-specify a `filter` no class sets.
 *
 * Operator logos are usually wordmarks, so a missing or broken image falls back
 * to the operator's name rather than to a generic glyph.
 */
export default function OperatorBadge({ name, image, duration }) {
  const [imageFailed, setImageFailed] = useState(false);

  const showImage = !!image && !imageFailed;
  if (!showImage && !name && !duration) return null;

  return (
    <div className="inline-flex self-start items-center gap-2 rounded-full bg-[#faf9f4] px-2.5 py-1.5 max-w-full">
      {showImage ? (
        <span
          className="flex items-center justify-center shrink-0"
          style={{ height: 16, maxWidth: 76 }}
        >
          <img
            src={image}
            alt={name || "Operator"}
            onError={() => setImageFailed(true)}
            style={{
              display: "block",
              height: "100%",
              width: "auto",
              maxWidth: "100%",
              objectFit: "contain",
              margin: 0,
              filter: "none",
            }}
          />
        </span>
      ) : name ? (
        <span className="ttw-type-small font-600 text-[#0b1220] leading-none truncate">
          {name}
        </span>
      ) : null}

      {duration ? (
        <span className="ttw-type-small text-[#445069] leading-none whitespace-nowrap">
          {duration}
        </span>
      ) : null}
    </div>
  );
}

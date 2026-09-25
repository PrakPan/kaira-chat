import React from "react";

// ─────────────────────────────────────────────────────────────────────────────
//  Desktop-only values from "Kaira E Desktop". Everything the phone and desktop
//  share (city colours, card borders, chips) stays in
//  ../mobileItinerary/designTokens — this file is only what desktop adds.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The side padding of every desktop row — header, scroll body and footer.
 * A flat 24px at every pane width: the content runs the full width of the
 * pane rather than being held to a centred 720px column, which on a wide pane
 * left a band of empty space either side of the trip.
 */
export const GUTTER = "24px";

/**
 * The desktop pane's type is drawn in the phone's px sizes (shared
 * LegSection), which read small beside the chat, so the pane — and its cart
 * bar, on the map too — is CSS-zoomed as a whole. Zoom rather than new sizes
 * keeps the phone untouched and the design's proportions intact. 1.3 and 1.2
 * were tried and read too big.
 */
export const PANE_ZOOM = 1.1;

/** The red "Kaira E Desktop" marks lapsed prices in — the cart's PRICES EXPIRED. */
export const EXPIRED = "#b84034";
export const EXPIRED_TINT = "rgba(184,64,52,.07)";

const glyph = {
  width: 10,
  height: 10,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.4,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  className: "flex-none",
};

/** The clock on the trip card's PRICES EXPIRED pill. */
export const ClockGlyph = () => (
  <svg {...glyph}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
);

/** The tick on the FULLY PAID pill. */
export const CheckGlyph = () => (
  <svg {...glyph}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

/**
 * The FULLY PAID pill, in the card and the footer alike: green, the colour the
 * surface already uses for a paid hold, where HELD's ink pill sat.
 */
export const fullyPaidPill = {
  border: "1.5px solid #1f8a5a",
  background: "rgba(31,138,90,.08)",
  borderRadius: 999,
  color: "#1f8a5a",
};

/** The circular arrow on every REPRICE button. */
export const RepriceGlyph = () => (
  <svg {...glyph}>
    <path d="M21 12a9 9 0 1 1-3-6.7L21 8" />
    <path d="M21 3v5h-5" />
  </svg>
);

/**
 * Kaira's portrait as the design draws it: a CSS background over her pale
 * blue, so a slow image load never leaves an empty ring. A <span> rather than
 * an <img> because styles.css and Bootstrap both put bare `img {}` rules on
 * every image, which knock one out of line as a flex child.
 */
export function KairaAvatar({ size, ring }) {
  return (
    <span
      aria-hidden
      className="block flex-none rounded-full"
      style={{
        width: size,
        height: size,
        background: '#cfe4f0 center/cover no-repeat url("/KairaInsta.png")',
        border: ring || "none",
        boxSizing: "border-box",
      }}
    />
  );
}

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

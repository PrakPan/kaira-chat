import React from "react";

/**
 * The round close control every sheet on this surface carries.
 *
 * The ✕ is DRAWN, not typed. "×" is a glyph on a baseline: a flex box centres
 * the line it sits in, not the mark itself, so the cross rode high inside its
 * ring by however much the rendering font's multiplication sign sits above
 * centre — a different amount on every device. Two strokes in a square viewBox
 * have no baseline to be off, and the same button is now the same everywhere
 * rather than three copies of one inline style drifting apart.
 *
 * Geometry and border ride in `style` because the app's global button CSS wins
 * against Tailwind's `border` and `rounded-*`.
 */
export default function CloseButton({
  onClick,
  size = 26,
  label = "Close",
  className = "",
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      style={{
        border: "1px solid #dcdfe5",
        background: "#ffffff",
        borderRadius: 999,
        boxShadow: "none",
        width: size,
        height: size,
        padding: 0,
        color: "#6b7280",
      }}
      className={`flex flex-none items-center justify-center ${className}`}
    >
      <svg
        width={Math.round(size * 0.38)}
        height={Math.round(size * 0.38)}
        viewBox="0 0 10 10"
        fill="none"
        aria-hidden
        style={{ display: "block" }}
      >
        <path
          d="M1.2 1.2l7.6 7.6M8.8 1.2l-7.6 7.6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}

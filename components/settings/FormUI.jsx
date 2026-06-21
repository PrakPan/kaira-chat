import React from "react";

// Shared form bits for the Settings / Clone-itinerary popups so both stay in
// visual sync. Kept dependency-free (plain inline styles).

export const SectionLabel = ({ children }) => (
  <div
    style={{
      fontSize: 13.5,
      fontWeight: 600,
      color: "#0F1B2D",
      marginBottom: 8,
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    }}
  >
    {children}
  </div>
);

const CheckGlyph = () => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#FFE600"
    strokeWidth="3.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// Selectable pill toggle for the "inclusions" options. `opt` = {label, checked, set}.
// Sized to its content (flex: 0 0 auto) so chips wrap as neat tags — a chip that
// wraps onto a new line keeps its natural width instead of stretching full-width.
export const InclusionChip = ({ opt }) => (
  <button
    type="button"
    onClick={() => opt.set(!opt.checked)}
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 7,
      padding: "8px 12px",
      borderRadius: 999,
      cursor: "pointer",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      border: opt.checked ? "1.5px solid #0F1B2D" : "1px solid #E6E1D2",
      background: opt.checked ? "#FFFBE8" : "#FFFFFF",
      boxShadow: opt.checked ? "0 1px 2px rgba(15,27,45,0.08)" : "none",
      transition: "all .15s ease",
      flex: "0 0 auto",
    }}
  >
    <span
      style={{
        width: 16,
        height: 16,
        borderRadius: 5,
        flexShrink: 0,
        display: "grid",
        placeItems: "center",
        border: opt.checked ? "none" : "1.5px solid #C9C4B5",
        background: opt.checked ? "#0F1B2D" : "#fff",
        transition: "all .15s ease",
      }}
    >
      {opt.checked && <CheckGlyph />}
    </span>
    <span
      style={{
        fontSize: 13,
        fontWeight: 500,
        color: opt.checked ? "#0F1B2D" : "#2C2C2A",
        whiteSpace: "nowrap",
        lineHeight: 1,
      }}
    >
      {opt.label}
    </span>
  </button>
);

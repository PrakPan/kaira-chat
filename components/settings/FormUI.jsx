import React from "react";

// Shared form bits for the Settings / Clone-itinerary popups so both stay in
// visual sync. Kept dependency-free (plain inline styles).

export const SectionLabel = ({ children }) => (
  <div
    style={{
      fontSize: 13.5,
      fontWeight: 600,
      color: "#0F1B2D",
      marginBottom: 6,
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
export const InclusionChip = ({ opt }) => (
  <button
    type="button"
    onClick={() => opt.set(!opt.checked)}
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "9px 12px",
      borderRadius: 12,
      cursor: "pointer",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      border: opt.checked ? "1.5px solid #0F1B2D" : "1px solid #E6E1D2",
      background: opt.checked ? "#FFFBE8" : "#FFFFFF",
      transition: "all .15s ease",
      flex: "1 1 auto",
      minWidth: "fit-content",
    }}
  >
    <span
      style={{
        width: 18,
        height: 18,
        borderRadius: 6,
        flexShrink: 0,
        display: "grid",
        placeItems: "center",
        border: opt.checked ? "none" : "1.5px solid #C9C4B5",
        background: opt.checked ? "#0F1B2D" : "#fff",
      }}
    >
      {opt.checked && <CheckGlyph />}
    </span>
    <span
      style={{
        fontSize: 13,
        fontWeight: 500,
        color: "#2C2C2A",
        whiteSpace: "nowrap",
      }}
    >
      {opt.label}
    </span>
  </button>
);

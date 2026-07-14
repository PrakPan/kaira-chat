import React from "react";

// Chrome shared by the two cards a city's deck can show — the city overview and
// a single day-by-day element (see CityOverviewCard / CityElementCard). Both are
// portalled onto a map marker, so they share a width (the placement pass in
// utils/deckPlacement assumes one) and the same shell, image band and close
// button.

export const CARD_WIDTH = 244;
export const CARD_IMAGE_HEIGHT = 116;

interface ShellProps {
  onFocus: () => void;
  children: React.ReactNode;
}

/** The white, rounded, elevated card body itself. */
export const CardShell: React.FC<ShellProps> = ({ onFocus, children }) => (
  <div
    onMouseDown={onFocus}
    style={{
      width: CARD_WIDTH,
      fontFamily: "'Inter', sans-serif",
      background: "#fff",
      borderRadius: 12,
      boxShadow: "0 6px 24px rgba(11,18,32,0.18)",
      overflow: "hidden",
      cursor: "default",
      userSelect: "none",
    }}
  >
    {children}
  </div>
);

/**
 * The card's cover band. It always renders, even with no image: the close button
 * and any chip are positioned against it, and dropping it would leave them
 * painted on top of the title. Imageless cards get a neutral fill.
 */
export const CardImage: React.FC<{
  src: string | null;
  alt: string;
  children?: React.ReactNode;
}> = ({ src, alt, children }) => (
  <div style={{ position: "relative" }}>
    <div
      style={{
        width: "100%",
        height: CARD_IMAGE_HEIGHT,
        overflow: "hidden",
        background: src
          ? "#F4F5F7"
          : "linear-gradient(135deg, #EEF1F4 0%, #E1E6EB 100%)",
      }}
    >
      {src && (
        <img
          src={src}
          alt={alt}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      )}
    </div>
    {children}
  </div>
);

/**
 * An SVG cross, not a "×" glyph — the character's font metrics are off-centre in
 * its own box, so no amount of flex centring lands it in the middle of the
 * button.
 */
export const CardCloseButton: React.FC<{
  onClick: () => void;
  label?: string;
}> = ({ onClick, label = "Close" }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    style={{
      position: "absolute",
      top: 8,
      right: 8,
      width: 20,
      height: 20,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 0,
      borderRadius: 9999,
      border: "none",
      background: "rgba(255,255,255,0.92)",
      color: "#6E757A",
      cursor: "pointer",
      boxShadow: "0 1px 4px rgba(11,18,32,0.15)",
    }}
  >
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      aria-hidden
      style={{ display: "block" }}
    >
      <path d="M1.5 1.5l7 7M8.5 1.5l-7 7" />
    </svg>
  </button>
);

/** Chevron used by the pager and the Explore call to action. */
export const Chevron: React.FC<{ dir: "prev" | "next"; size?: number }> = ({
  dir,
  size = 13,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    style={{
      display: "block",
      flexShrink: 0,
      transform: dir === "prev" ? "rotate(180deg)" : undefined,
    }}
  >
    <path d="M9 5l7 7-7 7" />
  </svg>
);

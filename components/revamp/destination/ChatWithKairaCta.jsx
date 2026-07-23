import React from "react";

// Single source of truth for the primary planning CTA used across every
// destination page (continent / country / state / city / theme). Renders the
// dark "Start planning" pill with a circular arrow, matching the section-ending
// SectionCta, plus a reassurance line below the button.
//
// Compact contexts (e.g. the promo Banner bar) pass `showHelper={false}` to
// drop the helper line and keep the button inline.
const ChatWithKairaCta = ({
  label = "Start planning",
  onClick,
  href,
  className = "",
  style,
  showHelper = true,
  helperText = "Planning is free. You only pay when you book.",
}) => {
  // With an href this renders a real crawlable <a> (SEO: destination pages link
  // to /chat); onClick is still fired for any analytics/side-effects.
  const Tag = href ? "a" : "button";
  const button = (
    <Tag
      {...(href ? { href } : { type: "button" })}
      className={className.trim()}
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "12px",
        padding: "10px 10px 10px 22px",
        background: "#0b1220",
        color: "#ffffff",
        border: "1px solid var(--ttw-line, #ececec)",
        borderRadius: "999px",
        fontFamily: "inherit",
        fontSize: "15px",
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.15s",
        textDecoration: "none",
        ...style,
      }}
    >
      {label}
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "28px",
          height: "28px",
          borderRadius: "50%",
          background: "var(--ttw-ink-rail, #0f1a2e)",
          color: "#fff",
        }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </span>
    </Tag>
  );

  if (!showHelper || !helperText) return button;

  return (
    <span className="inline-flex flex-col items-center gap-2">
      {button}
      <p className="text-[#8b93a6] text-[12px] mt-2">{helperText}</p>
    </span>
  );
};

export default ChatWithKairaCta;

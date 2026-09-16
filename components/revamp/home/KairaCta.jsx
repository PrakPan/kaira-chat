// The one call-to-action shape used across the homepage.
//
// Lifted from SectionCta, which already carried it at the foot of each band: an
// ink pill with the label on the left and a circular arrow badge on the right.
// The hero used a squared indigo button and the sections used this, so the page
// asked to be clicked in two different visual languages; this is the one that
// matches the rest of the Kaira surfaces (the planner's footer CTA, the docked
// ask-bar), so it is the one that stays.
//
// `tone="yellow"` is the same pill in the brand accent, for a CTA that has to
// win against an ink or photographic background.

import React from "react";

const TONES = {
  ink: {
    bg: "#0b1220",
    fg: "#ffffff",
    border: "var(--ttw-line, #ececec)",
    badge: "rgba(255,255,255,0.14)",
  },
  yellow: {
    bg: "#f7e700",
    fg: "#0b1220",
    border: "var(--ttw-line, #ececec)",
    badge: "rgba(11,18,32,0.12)",
  },
  // White fill, ink text, ink border, no shadow. The quieter of the two — for
  // a secondary action ("View more") sitting under content that already has a
  // primary CTA of its own.
  outline: {
    bg: "#ffffff",
    fg: "#0b1220",
    border: "#0b1220",
    badge: "rgba(11,18,32,0.08)",
  },
};

const SIZES = {
  md: { pad: "10px 10px 10px 22px", font: 15, badge: 28, icon: 14 },
  lg: { pad: "12px 12px 12px 26px", font: 16, badge: 32, icon: 15 },
};

const KairaCta = ({
  children,
  onClick,
  href,
  tone = "ink",
  size = "md",
  type = "button",
  className = "",
  style = {},
  ...rest
}) => {
  const t = TONES[tone] || TONES.ink;
  const s = SIZES[size] || SIZES.md;

  const inner = (
    <>
      {children}
      <span
        aria-hidden="true"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: s.badge,
          height: s.badge,
          borderRadius: "50%",
          background: t.badge,
          color: t.fg,
          flexShrink: 0,
        }}
      >
        <svg
          width={s.icon}
          height={s.icon}
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
    </>
  );

  const styles = {
    display: "inline-flex",
    alignItems: "center",
    gap: 12,
    padding: s.pad,
    background: t.bg,
    color: t.fg,
    border: `1px solid ${t.border}`,
    boxShadow: "none",
    borderRadius: 999,
    fontFamily: "inherit",
    fontSize: s.font,
    fontWeight: 600,
    lineHeight: 1.2,
    cursor: "pointer",
    textDecoration: "none",
    transition: "transform 0.15s cubic-bezier(.2,.7,.3,1)",
    ...style,
  };

  if (href) {
    return (
      <a href={href} className={className} style={styles} {...rest}>
        {inner}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={className}
      style={styles}
      {...rest}
    >
      {inner}
    </button>
  );
};

export default KairaCta;

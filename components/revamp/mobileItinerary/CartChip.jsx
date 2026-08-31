import React from "react";

// ─────────────────────────────────────────────────────────────────────────────
//  CartChip — the trip total, as the one dark object on the page.
//
//  The trip is a package: this is the only amount on the surface, and tapping
//  it is the only way to pay. Making it the single ink-filled control is what
//  says so — everything else here is white on paper.
//
//  The booking count rides on the cart glyph as a badge rather than as a line
//  of text: it explains the number beside it (this is what you are paying for)
//  without competing with it for the eye.
// ─────────────────────────────────────────────────────────────────────────────

const CartGlyph = ({ size = 15 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="#f7e700"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <circle cx="8" cy="21" r="1" />
    <circle cx="19" cy="21" r="1" />
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
  </svg>
);

export default function CartChip({
  count = 0,
  total,
  label = "TOTAL COST",
  onClick,
  disabled = false,
  // "md" is the footer's chip; "sm" is the one in Kaira's sheet header, where
  // the design shrinks it so it sits inside a 28px-avatar row without
  // out-weighing her name.
  size = "md",
}) {
  const sm = size === "sm";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={
        total
          ? `${label.toLowerCase()} ${total}${count ? `, ${count} booking${count === 1 ? "" : "s"}` : ""}. Review and pay`
          : "Review and pay"
      }
      style={{
        border: 0,
        background: "#0b1220",
        color: "#fafaf5",
        borderRadius: 999,
        padding: sm ? "0 11px" : "0 12px",
        height: sm ? 34 : 40,
        boxShadow: sm ? "none" : "0 8px 20px -10px rgba(11,18,32,0.3)",
      }}
      className="inline-flex flex-none items-center gap-[9px] disabled:opacity-40"
    >
      <span
        className="relative grid place-items-center"
        style={{ padding: "2px 3px 0 0" }}
      >
        <CartGlyph size={sm ? 14 : 15} />
        {count > 0 ? (
          <span
            aria-hidden
            style={{
              position: "absolute",
              top: -5,
              right: -5,
              minWidth: 11,
              height: 11,
              borderRadius: 3,
              background: "#f7e700",
              color: "#0b1220",
              padding: "0 2px",
              transform: "rotate(-6deg)",
              // A ring in the chip's own ink, so the badge reads as sitting on
              // the glyph rather than smudging into it.
              boxShadow: "0 0 0 2px #0b1220",
            }}
            className="grid place-items-center font-mono text-[7px] font-[800]"
          >
            {count}
          </span>
        ) : null}
      </span>
      <span className="flex flex-col items-start leading-none">
        <span
          className="font-mono text-[6.5px] tracking-[0.1em]"
          style={{ color: "rgba(255,255,255,.6)" }}
        >
          {label}
        </span>
        <span className="mt-[2px] whitespace-nowrap text-[10.5px] font-[800]">
          {total || "—"}
        </span>
      </span>
    </button>
  );
}

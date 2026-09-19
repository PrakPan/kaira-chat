import React, { useState } from "react";
import PulseLoader from "react-spinners/PulseLoader";

// ─────────────────────────────────────────────────────────────────────────────
//  The Settings modal as "Kaira E Desktop" draws it ("Update your trip
//  preferences"): mono section labels, bordered 14px-radius fields, round-cornered
//  inclusion chips with an ink check, and a pill Cancel / Update row.
//
//  Presentation only. Settings (./Index.jsx) owns every piece of state and the
//  request it sends; this file only draws what it is handed, so the phone's
//  existing modal and this one can't disagree about what gets saved.
//
//  Everything is styled inline: styles.css, globals.css and Bootstrap all land
//  after Tailwind and several of their rules are `!important` (`.border`,
//  `.bg-transparent`, `.p-3`…), and each one of them has bitten this surface.
//  Hover states are held in React state for the same reason — an inline border
//  or background outranks any `hover:` class.
// ─────────────────────────────────────────────────────────────────────────────

const INK = "#0b1220";
const YELLOW = "#f7e700";

/** "DATES", "INCLUSIONS", "TRAVELLERS" — the design's mono section label. */
export function KairaSection({ label, children }) {
  return (
    <div className="flex flex-col gap-[8px]">
      <div className="font-mono text-[8.5px] tracking-[0.12em] text-[#8a93a6]">{label}</div>
      {children}
    </div>
  );
}

/**
 * A bordered field that opens something — the date picker, the travellers or
 * rooms editor. The value leads in bold; `suffix` trails it in grey (" · 7
 * nights", " · 1 room"), and `trailing` sits at the far end (the calendar
 * glyph, the "Change" pill).
 */
export function KairaField({
  value,
  suffix,
  placeholder,
  trailing,
  onClick,
  padding = "14px 16px",
  ariaLabel,
}) {
  const [lit, setLit] = useState(false);
  const on = () => setLit(true);
  const off = () => setLit(false);
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      onMouseEnter={on}
      onMouseLeave={off}
      onFocus={on}
      onBlur={off}
      className="flex w-full items-center gap-[12px] text-left outline-none"
      style={{
        border: `1px solid ${lit ? "#b8becc" : "#ececec"}`,
        background: "#ffffff",
        borderRadius: 14,
        padding,
        boxShadow: "none",
        cursor: "pointer",
      }}
    >
      <span
        className="min-w-0 flex-1 truncate text-[14px] font-[700]"
        style={{ letterSpacing: "-0.01em", color: value ? INK : "#8a93a6" }}
      >
        {value || placeholder}
        {value && suffix ? (
          <span className="font-[500] text-[#6b7280]">{suffix}</span>
        ) : null}
      </span>
      {trailing}
    </button>
  );
}

export const CalendarGlyph = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#445069"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="flex-none"
    aria-hidden
  >
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);

/**
 * The field's "Change" — a 32px pill, the height of the design's stepper
 * buttons, so the travellers field is the same height as the one drawn.
 * A span, not a button: the whole field is already the button.
 */
export const ChangePill = () => (
  <span
    className="flex h-[32px] flex-none items-center rounded-full px-[14px] text-[12.5px] font-[600]"
    style={{ border: "1px solid #dcdfe5", background: "#ffffff", color: INK }}
  >
    Change
  </span>
);

/** One inclusion. `opt` = { label, checked, set }, same shape FormUI's chip takes. */
export function KairaInclusionChip({ opt }) {
  return (
    <button
      type="button"
      onClick={() => opt.set(!opt.checked)}
      aria-pressed={opt.checked}
      className="inline-flex flex-none items-center gap-[8px]"
      style={{
        border: opt.checked ? `1.5px solid ${INK}` : "1px solid #ececec",
        background: opt.checked ? "#fffbe6" : "#ffffff",
        borderRadius: 999,
        padding: "10px 15px 10px 10px",
        boxShadow: "none",
        boxSizing: "border-box",
        cursor: "pointer",
      }}
    >
      {opt.checked ? (
        <span
          className="grid flex-none place-items-center"
          style={{ width: 17, height: 17, borderRadius: 5, background: INK }}
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke={YELLOW}
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </span>
      ) : (
        <span
          className="flex-none"
          style={{
            width: 17,
            height: 17,
            borderRadius: 5,
            border: "1.5px solid #dcdfe5",
            boxSizing: "border-box",
          }}
        />
      )}
      <span className="whitespace-nowrap text-[13px] font-[600]" style={{ color: INK }}>
        {opt.label}
      </span>
    </button>
  );
}

/** The round ✕ in the corner of every Kaira card. Drawn, not typed. */
export function KairaCloseButton({ onClick, label = "Close" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid h-[30px] w-[30px] flex-none place-items-center"
      style={{
        border: "1px solid #ececec",
        background: "#ffffff",
        borderRadius: 999,
        padding: 0,
        boxShadow: "none",
        color: "#6b7280",
      }}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    </button>
  );
}

/** Title in the design's voice: bold sans with one serif-italic word. */
export function KairaTitle({ lead, emphasis, trail }) {
  return (
    <div
      className="text-[23px] font-[800]"
      style={{ letterSpacing: "-0.035em", color: INK, lineHeight: 1.15 }}
    >
      {lead}{" "}
      <span
        className="ttw-type-serif"
        style={{ fontStyle: "italic", fontWeight: 400, letterSpacing: "normal" }}
      >
        {emphasis}
      </span>
      {trail ? ` ${trail}` : null}
    </div>
  );
}

/** The pill Cancel beside the yellow primary that takes the rest of the row. */
export function KairaActions({ onCancel, onPrimary, primaryLabel, isLoading = false }) {
  return (
    <div className="flex items-center gap-[10px] pt-[2px]">
      <button
        type="button"
        onClick={onCancel}
        className="flex-none text-[13px] font-[600] text-[#6b7280]"
        style={{
          border: "1px solid #ececec",
          background: "#ffffff",
          borderRadius: 999,
          padding: "13px 20px",
          boxShadow: "none",
        }}
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={onPrimary}
        disabled={isLoading}
        aria-busy={isLoading}
        className={`flex flex-1 items-center justify-center whitespace-nowrap text-[14px] font-[800] ${
          isLoading ? "cursor-wait" : ""
        }`}
        style={{
          border: 0,
          background: YELLOW,
          borderRadius: 999,
          padding: "13px 20px",
          color: INK,
          boxShadow: "0 8px 20px -10px rgba(247,231,0,0.55)",
          minHeight: 45,
        }}
      >
        {isLoading ? <PulseLoader size={7} color={INK} speedMultiplier={0.8} /> : primaryLabel}
      </button>
    </div>
  );
}

/**
 * The card's contents: title and close, the sections handed in as children,
 * and the Cancel / Update row. The card itself — white, 22px corners, the
 * lift — is the host's (PaneModal on desktop), so this can sit in a sheet too.
 */
export default function KairaSettingsCard({
  heading,
  subheading,
  onClose,
  onUpdate,
  isLoading = false,
  children,
}) {
  return (
    <div className="flex flex-col gap-[20px] p-[24px] font-inter leading-[normal]">
      <div className="flex items-start gap-[12px]">
        <div className="min-w-0 flex-1">
          <KairaTitle
            lead={heading?.lead ?? "Update your"}
            emphasis={heading?.emphasis ?? "trip"}
            trail={heading?.trail ?? "preferences"}
          />
          <div className="mt-[5px] text-[12.5px] text-[#6b7280]">
            {subheading ?? "Adjust dates, travellers and inclusions, I'll reprice it for you."}
          </div>
        </div>
        <KairaCloseButton onClick={onClose} />
      </div>

      {children}

      <KairaActions
        onCancel={onClose}
        onPrimary={onUpdate}
        primaryLabel="Update itinerary"
        isLoading={isLoading}
      />
    </div>
  );
}

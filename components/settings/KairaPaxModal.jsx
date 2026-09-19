import React, { useState } from "react";
import { KairaActions, KairaCloseButton, KairaTitle } from "./KairaSettings";

// ─────────────────────────────────────────────────────────────────────────────
//  The rooms / travellers editors (Pax's Room Configuration, EnterPassenger's
//  Who's Going) in the Kaira card language, for the desktop trip settings
//  card. The design draws no rooms editor, so this is its settings card
//  carried over: same 22px card, serif-italic title, round ✕, mono labels,
//  14px-radius blocks, the design's round steppers (white minus, ink plus)
//  and the pill Cancel / yellow primary row.
//
//  Presentation only — Pax and EnterPassenger keep every piece of state and
//  every limit they already had and pass it in (their `variant="kaira"`).
//
//  `position: fixed; inset: 0`, like the ModalWithBackdrop it replaces: inside
//  the desktop Settings card that resolves to the itinerary pane (PaneModal's
//  layer is its containing block), so it centres over the trip, not the chat.
// ─────────────────────────────────────────────────────────────────────────────

const INK = "#0b1220";
const YELLOW = "#f7e700";

/** Overlay + card: scrim, title, a scrolling body, and the action row. */
export function KairaModal({
  title,
  subtitle,
  onClose,
  onApply,
  applyLabel = "Apply",
  children,
}) {
  return (
    <div className="fixed inset-0 font-inter leading-[normal]" style={{ zIndex: 60 }}>
      <button
        type="button"
        aria-label="Close"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 cursor-pointer"
        style={{
          border: 0,
          borderRadius: 0,
          padding: 0,
          boxShadow: "none",
          background: "rgba(11,18,32,0.22)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-[16px]">
        <div
          role="dialog"
          aria-modal="true"
          className="ttw-pane-sheet-up pointer-events-auto flex flex-col bg-white"
          style={{
            width: "min(420px, 100%)",
            maxHeight: "100%",
            borderRadius: 22,
            boxShadow: "0 30px 80px -30px rgba(11,18,32,.3)",
            overflow: "hidden",
          }}
        >
          <div className="flex flex-none items-start gap-[12px] px-[24px] pb-[16px] pt-[24px]">
            <div className="min-w-0 flex-1">
              <KairaTitle {...title} />
              {subtitle ? (
                <div className="mt-[5px] text-[12.5px] text-[#6b7280]">{subtitle}</div>
              ) : null}
            </div>
            <KairaCloseButton onClick={onClose} />
          </div>
          <div
            className="flex min-h-0 flex-1 flex-col gap-[12px] overflow-y-auto px-[24px] pb-[4px]"
            style={{ scrollbarWidth: "none" }}
          >
            {children}
          </div>
          <div className="flex-none px-[24px] pb-[24px] pt-[16px]">
            <KairaActions onCancel={onClose} onPrimary={onApply} primaryLabel={applyLabel} />
          </div>
        </div>
      </div>
    </div>
  );
}

/** A bordered block — one room, or the traveller counts. */
export function KairaBlock({ label, action, children }) {
  return (
    <div
      className="flex flex-col"
      style={{
        border: "1px solid #ececec",
        borderRadius: 14,
        background: "#ffffff",
        padding: "12px 14px 4px",
      }}
    >
      {label || action ? (
        <div className="flex items-center justify-between pb-[4px]">
          <div className="font-mono text-[8.5px] tracking-[0.12em] text-[#8a93a6]">{label}</div>
          {action}
        </div>
      ) : null}
      {children}
    </div>
  );
}

const stepBase = {
  width: 32,
  height: 32,
  borderRadius: 999,
  padding: 0,
  boxShadow: "none",
  fontSize: 15,
  lineHeight: 1,
  display: "grid",
  placeItems: "center",
  flex: "none",
};

/** The design's stepper: white "−", the value, ink "+" with a yellow sign. */
function Stepper({ value, onMinus, onPlus, minusDisabled, plusDisabled, label }) {
  return (
    <div className="flex flex-none items-center gap-[9px]">
      <button
        type="button"
        onClick={onMinus}
        disabled={minusDisabled}
        aria-label={`Fewer ${label}`}
        style={{
          ...stepBase,
          border: "1px solid #dcdfe5",
          background: "#ffffff",
          color: INK,
          opacity: minusDisabled ? 0.35 : 1,
          cursor: minusDisabled ? "not-allowed" : "pointer",
        }}
      >
        −
      </button>
      <span
        className="min-w-[44px] text-center text-[14px] font-[700]"
        style={{ color: INK }}
        aria-live="polite"
      >
        {value}
      </span>
      <button
        type="button"
        onClick={onPlus}
        disabled={plusDisabled}
        aria-label={`More ${label}`}
        style={{
          ...stepBase,
          border: 0,
          background: INK,
          color: YELLOW,
          opacity: plusDisabled ? 0.35 : 1,
          cursor: plusDisabled ? "not-allowed" : "pointer",
        }}
      >
        +
      </button>
    </div>
  );
}

/** "Adults / Ages 13 or above" on the left, its stepper on the right. */
export function KairaCountRow({
  label,
  hint,
  value,
  onMinus,
  onPlus,
  minusDisabled,
  plusDisabled,
  first = false,
}) {
  return (
    <div
      className="flex items-center gap-[12px] py-[10px]"
      style={{ borderTop: first ? 0 : "1px solid #f1f2f4" }}
    >
      <div className="min-w-0 flex-1">
        <div className="text-[14px] font-[700]" style={{ color: INK }}>
          {label}
        </div>
        {hint ? <div className="mt-[2px] text-[11.5px] text-[#6b7280]">{hint}</div> : null}
      </div>
      <Stepper
        value={value}
        onMinus={onMinus}
        onPlus={onPlus}
        minusDisabled={minusDisabled}
        plusDisabled={plusDisabled}
        label={String(label).toLowerCase()}
      />
    </div>
  );
}

/** "+ Add room" — the design's dashed placeholder button. */
export function KairaDashedButton({ onClick, disabled, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex w-full flex-none items-center justify-center gap-[8px] disabled:opacity-40"
      style={{
        border: "1.5px dashed #cfd3da",
        background: "#ffffff",
        borderRadius: 12,
        padding: 11,
        boxShadow: "none",
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      <span className="text-[13px] text-[#6b7280]">+</span>
      <span className="text-[11.5px] font-[600] text-[#6b7280]">{children}</span>
    </button>
  );
}

// The red the cart already uses for "PRICES EXPIRED" (CartSheet), so a
// destructive action reads as the same warning colour across checkout.
const DANGER = "#b84034";

/**
 * A small action in a block's header — "Remove". `tone="danger"` draws it in
 * the warning red: it takes a room and its travellers out of the trip.
 */
export function KairaTextAction({ onClick, tone = "neutral", children }) {
  const [lit, setLit] = useState(false);
  const danger = tone === "danger";
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setLit(true)}
      onMouseLeave={() => setLit(false)}
      onFocus={() => setLit(true)}
      onBlur={() => setLit(false)}
      className="inline-flex flex-none items-center gap-[5px] text-[11.5px] font-[600] outline-none"
      style={{
        border: danger ? "1px solid rgba(184,64,52,.28)" : "1px solid #ececec",
        background: danger
          ? lit
            ? "rgba(184,64,52,.12)"
            : "rgba(184,64,52,.06)"
          : lit
            ? "#f4f3ec"
            : "#ffffff",
        color: danger ? DANGER : "#6b7280",
        borderRadius: 999,
        padding: "4px 10px",
        boxShadow: "none",
        cursor: "pointer",
      }}
    >
      {danger ? (
        <svg
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
        </svg>
      ) : null}
      {children}
    </button>
  );
}

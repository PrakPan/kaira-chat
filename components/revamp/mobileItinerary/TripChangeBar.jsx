import React from "react";

// ─────────────────────────────────────────────────────────────────────────────
//  TripChangeBar — "Kaira changed something, and here is the way back."
//
//  It sits in the footer, above the ask-Kaira row, and appears only after Kaira
//  has actually altered the trip. Without it a change made in the chat lands
//  silently somewhere in a long scroll: the user asked for one thing and the
//  page they are looking at is now different in a place they cannot see.
//
//  UNDO IS A REQUEST, NOT A ROLLBACK. There is no revert endpoint in this
//  codebase — nothing snapshots the trip before a change — so the button says
//  so to Kaira, who has the tools and the conversation context to put it back.
//  That is also the surface's own rule: every change goes through her.
// ─────────────────────────────────────────────────────────────────────────────

export default function TripChangeBar({ text, onUndo, onOpenChat, onDismiss }) {
  if (!text) return null;

  return (
    <div
      style={{
        border: "1.5px solid #0b1220",
        borderRadius: 999,
        background: "#ffffff",
        boxShadow: "none",
      }}
      className="flex items-center gap-[9px] px-[13px] py-[9px]"
      // Announced, not just drawn: the change it reports happened somewhere
      // off-screen, which is exactly the case a screen reader has no other way
      // to learn about.
      role="status"
      aria-live="polite"
    >
      <div
        className="h-[20px] w-[20px] flex-none rounded-full border-[1.5px] border-dashed border-[#6b7280]"
        aria-hidden
      />
      <span className="min-w-0 flex-1 truncate text-[11.5px] font-[600] text-[#0b1220]">
        {text}
      </span>
      {onUndo ? (
        <button
          type="button"
          onClick={onUndo}
          style={{ border: 0, background: "none", padding: 0 }}
          className="flex-none text-[11.5px] font-[700] text-[#6b7280]"
        >
          Undo
        </button>
      ) : null}
      {onOpenChat ? (
        <button
          type="button"
          onClick={onOpenChat}
          style={{ border: 0, background: "none", padding: 0 }}
          className="flex-none font-mono text-[8px] tracking-[0.06em] text-[#8a93a6]"
        >
          CHAT ›
        </button>
      ) : null}
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          style={{ border: 0, background: "none", padding: 0 }}
          className="flex-none text-[12px] leading-none text-[#b8becc]"
        >
          ×
        </button>
      ) : null}
    </div>
  );
}

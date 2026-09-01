import React from "react";
import Sheet from "../../common/components/Sheet";
import * as T from "../designTokens";

// ─────────────────────────────────────────────────────────────────────────────
//  MoreSheet — the actions that aren't part of planning the trip.
//
//  Kept out of the main scroll on purpose: map, PDF, share and settings are all
//  things you do ONCE, usually at the end, and each one competing for a slot in
//  the header would crowd out the trip itself. Every handler here already
//  exists in BotApp — this sheet only gathers them.
// ─────────────────────────────────────────────────────────────────────────────

function Row({ label, hint, onClick, disabled }) {
  if (!onClick) return null;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{ ...T.card, borderRadius: 11 }}
      className="flex w-full items-center gap-[12px] px-[13px] py-[12px] text-left disabled:opacity-40"
    >
      <div className="h-[24px] w-[24px] flex-none rounded-[6px] bg-[#e6e8ec]" />
      <span className="min-w-0 flex-1 truncate text-[13.5px] font-[600] text-[#0b1220]">
        {label}
      </span>
      {hint ? (
        <span className="flex-none font-mono text-[9.5px] tracking-[0.06em] text-[#8a93a6]">
          {hint}
        </span>
      ) : (
        <span className="flex-none text-[14px] leading-none text-[#b8becc]" aria-hidden>
          ›
        </span>
      )}
    </button>
  );
}

export default function MoreSheet({
  open,
  onClose,
  onViewMap,
  onDownloadPdf,
  onShare,
  onSettings,
  isDownloadingPdf,
  onOpenChat,
}) {
  const run = (fn) => () => {
    onClose?.();
    fn?.();
  };

  return (
    <Sheet open={open} onClose={onClose} height="auto" zIndex={1600}>
      <div className="flex flex-col gap-[9px] px-[14px] pb-[16px]">
        <Row label="See your route on a map" onClick={onViewMap && run(onViewMap)} />
        <Row
          label="Download the itinerary as PDF"
          hint={isDownloadingPdf ? "PREPARING…" : undefined}
          disabled={isDownloadingPdf}
          onClick={onDownloadPdf}
        />
        <Row label="Share the trip" onClick={onShare && run(onShare)} />
        <Row label="What Kaira changed" onClick={onOpenChat && run(onOpenChat)} />
        <Row label="Trip settings" onClick={onSettings && run(onSettings)} />
      </div>
    </Sheet>
  );
}

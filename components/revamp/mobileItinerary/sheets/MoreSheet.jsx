import React from "react";
import {
  MdOutlineMap,
  MdOutlinePictureAsPdf,
  MdOutlineShare,
  MdOutlineTune,
} from "react-icons/md";

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

function Row({ Icon, glyph, label, hint, onClick, disabled }) {
  if (!onClick) return null;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{ ...T.card, borderRadius: 11 }}
      className="flex w-full items-center gap-[12px] px-[13px] py-[12px] text-left disabled:opacity-40"
    >
      {/* Five identical grey squares told the reader nothing — the label was
          carrying the whole row. Neutral tile, grey glyph: the same treatment
          the cart's category rows and the itinerary's "before you fly" cards
          use, so a list of actions reads as part of the same surface. */}
      {glyph || (
        <span
          className="flex h-[24px] w-[24px] flex-none items-center justify-center rounded-[6px]"
          style={{ background: "#eef0f4" }}
          aria-hidden
        >
          {Icon ? <Icon size={14} color="#6b7280" /> : null}
        </span>
      )}
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
        <Row
          Icon={MdOutlineMap}
          label="See your route on a map"
          onClick={onViewMap && run(onViewMap)}
        />
        <Row
          Icon={MdOutlinePictureAsPdf}
          label="Download the itinerary as PDF"
          hint={isDownloadingPdf ? "PREPARING…" : undefined}
          disabled={isDownloadingPdf}
          onClick={onDownloadPdf}
        />
        <Row
          Icon={MdOutlineShare}
          label="Share the trip"
          onClick={onShare && run(onShare)}
        />
        {/* Kaira herself, not a glyph standing in for her — the same portrait
            in the same yellow ring the ask-Kaira pill wears at the foot of this
            trip, so the row that opens her thread is recognisably hers. */}
        <Row
          glyph={
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src="/KairaInsta.png"
              alt=""
              aria-hidden
              className="h-[24px] w-[24px] flex-none rounded-full object-cover"
              // Bare `img {}` rules in styles.css and bootstrap apply globally
              // and knock an <img> out of alignment as a flex child — pinned
              // inline for the same reason AskKairaPill pins them.
              style={{
                margin: 0,
                maxWidth: "none",
                display: "block",
                border: "1.5px solid #f7e700",
                background: "#cfe4f0",
              }}
            />
          }
          label="What Kaira changed"
          onClick={onOpenChat && run(onOpenChat)}
        />
        <Row
          Icon={MdOutlineTune}
          label="Trip settings"
          onClick={onSettings && run(onSettings)}
        />
      </div>
    </Sheet>
  );
}

import React from "react";
import * as T from "../mobileItinerary/designTokens";
import { formatDateRange } from "../../../lib/itineraryFormat";
import { LOCK_IN_HOLD_HOURS } from "../../../helper/lockIn";
import { KairaAvatar } from "./desktopTokens";
import useCountdown from "./useCountdown";

// ─────────────────────────────────────────────────────────────────────────────
//  The trip-total card at the top of the desktop itinerary, as "Kaira E
//  Desktop" draws it:
//
//    TRIP TOTAL · 28 BOOKINGS                     ⛨ KAIRA PROTECTED
//    ₹6,63,378/-   ● HELD TODAY · 07:12:45
//    (Kaira) Fares can move tomorrow, I can freeze…      [🔒 LOCK IT · ₹999]
//    ○ Geneva has no stay / 4 nights open · 28 Sep–2 Oct               [Fix]
//
//  The clock is the cart's real `price_valid_until`, not the prototype's
//  midnight: quotes stand for a day from when they were priced, so it is
//  "held today" in the sense the design means, and it runs out when the price
//  actually does. Once a hold is paid it counts down the hold instead.
//
//  Still one price on the surface, per the package rule — this total and the
//  footer's are the same figure.
// ─────────────────────────────────────────────────────────────────────────────

const ProtectedShield = () => (
  <svg width="11" height="14" viewBox="0 0 23 30" fill="none" aria-hidden className="flex-none">
    <path
      d="M11.33 29.75L1.13 22.1A2.9 2.9 0 010 19.83V2.83A2.83 2.83 0 012.83 0h17a2.83 2.83 0 012.84 2.83v17a2.9 2.9 0 01-1.14 2.27l-10.2 7.65zm0-3.54l8.5-6.38V2.83H2.83v17l8.5 6.38zm-1.49-7.79l8-8-1.98-2.06-6.02 6.02-2.98-2.97-2.05 1.98 5.03 5.03z"
      fill="#AD5BE7"
    />
  </svg>
);

const LockGlyph = () => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    className="flex-none"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

// "28 SEP–2 OCT" → "28 Sep–2 Oct". The gap row is a sentence, not a mono meta
// line, and the formatter only speaks in capitals.
const sentenceMonths = (s) =>
  String(s || "").replace(/\b([A-Z])([A-Z]{2})\b/g, (_, a, b) => a + b.toLowerCase());

export default function DesktopTripCard({
  trip,
  isDraft = false,
  totalStr,
  // The hold fee, formatted, when the hold can actually be offered — null
  // otherwise, and the strip stands down with it.
  holdFeeStr = null,
  onHold,
  gapLeg = null,
  onFixGap,
  disabled = false,
}) {
  const locked = !!trip.hold?.locked;
  const holdClock = useCountdown(locked ? trip.hold?.until : null);
  const quoteClock = useCountdown(!locked ? trip.quoteDeadline : null);

  // A clock only beside a real price: "HELD TODAY" over an em-dash is a claim
  // about a number that isn't there.
  const timer = !totalStr
    ? null
    : locked
      ? holdClock
        ? `HELD · ${holdClock}`
        : null
      : quoteClock
        ? `HELD TODAY · ${quoteClock}`
        : null;

  const label = (trip.totalLabel || "Trip total").toUpperCase();
  const count = trip.bookingsCount;
  const kicker = isDraft
    ? `${label} · PRICED ONCE YOU CONFIRM`
    : count > 0
      ? `${label} · ${count} BOOKING${count === 1 ? "" : "S"}`
      : `${label} · PRICING YOUR TRIP…`;

  const holdHours = LOCK_IN_HOLD_HOURS;
  const holdLine =
    count > 0
      ? `Fares can move tomorrow, I can freeze all ${count} for ${holdHours} hours.`
      : `Fares can move tomorrow, I can freeze them for ${holdHours} hours.`;

  const gapNights = gapLeg?.nights || 0;
  const gapMeta = gapLeg
    ? [
        gapNights ? `${gapNights} night${gapNights === 1 ? "" : "s"} open` : null,
        sentenceMonths(
          formatDateRange(gapLeg.raw?.start_date, gapLeg.raw?.end_date, {
            tight: true,
          }),
        ),
      ]
        .filter(Boolean)
        .join(" · ")
    : "";

  return (
    <div
      className="flex flex-col gap-[12px] p-[16px]"
      style={{
        border: "1px solid #ececec",
        background: "#ffffff",
        borderRadius: 18,
        boxShadow: "0 10px 24px -18px rgba(11,18,32,0.25)",
      }}
    >
      <div className="flex items-center gap-[10px]">
        <div className="min-w-0 truncate font-mono text-[8.5px] tracking-[0.08em] text-[#8a93a6]">
          {kicker}
        </div>
        <span className="ml-auto inline-flex flex-none items-center gap-[6px] font-mono text-[7.5px] font-[600] tracking-[0.1em] text-[#8a93a6]">
          <ProtectedShield />
          KAIRA PROTECTED
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-[10px]">
        <span className="text-[25px] font-[800] tracking-[-0.035em] text-[#0b1220]">
          {totalStr ? (
            <>
              {totalStr}
              <span className="text-[14px] font-[700]">/-</span>
            </>
          ) : (
            "—"
          )}
        </span>
        {timer ? (
          <span
            className="inline-flex flex-none items-center gap-[6px] font-mono text-[8px] font-[600] tracking-[0.06em] text-[#f7e700]"
            style={{ background: T.INK, borderRadius: 999, padding: "5px 11px" }}
          >
            <span
              className="block flex-none"
              style={{ width: 6, height: 6, borderRadius: "50%", background: T.YELLOW }}
              aria-hidden
            />
            {timer}
          </span>
        ) : null}
      </div>

      {holdFeeStr ? (
        <div
          className="flex items-center gap-[9px]"
          style={{
            background: "#fafaf5",
            border: "1px solid #ececec",
            borderRadius: 999,
            padding: "5px 6px 5px 5px",
          }}
        >
          <KairaAvatar size={22} ring={`1.5px solid ${T.YELLOW}`} />
          <span className="min-w-0 flex-1 truncate text-[11.5px] text-[#445069]">
            {holdLine}
          </span>
          <button
            type="button"
            onClick={onHold}
            disabled={disabled}
            aria-label={`Hold this price for ${holdHours} hours for ${holdFeeStr}`}
            className="inline-flex flex-none items-center gap-[6px] font-mono text-[8px] font-[600] tracking-[0.06em] disabled:opacity-40"
            style={{
              border: `1.5px dashed ${T.GREEN}`,
              background: "rgba(31,138,90,.08)",
              borderRadius: 999,
              padding: "5px 11px",
              color: T.GREEN,
              boxShadow: "none",
            }}
          >
            <LockGlyph />
            {`LOCK IT · ${holdFeeStr}`}
          </button>
        </div>
      ) : locked ? (
        <div
          className="flex items-center gap-[9px]"
          style={{
            background: "rgba(31,138,90,.07)",
            border: "1px solid rgba(31,138,90,.25)",
            borderRadius: 999,
            padding: "5px 12px 5px 5px",
          }}
        >
          <KairaAvatar size={22} ring={`1.5px solid ${T.GREEN}`} />
          <span
            className="min-w-0 flex-1 truncate text-[11.5px] font-[600]"
            style={{ color: T.GREEN }}
          >
            Every price is frozen. If a fare jumps while held, the difference is on me.
          </span>
        </div>
      ) : null}

      {gapLeg ? (
        <div
          className="flex items-center gap-[10px] pt-[11px]"
          style={{ borderTop: "1px solid #e6e8ec" }}
        >
          <div
            className="h-[20px] w-[20px] flex-none"
            style={{ borderRadius: 999, border: "1.5px solid #8a93a6" }}
            aria-hidden
          />
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] font-[700] text-[#0b1220]">
              {gapLeg.city} has no stay
            </div>
            {gapMeta ? (
              <div className="mt-[2px] truncate text-[11px] text-[#6b7280]">{gapMeta}</div>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onFixGap}
            disabled={disabled}
            style={T.primaryPill}
            className="flex-none px-[18px] py-[9px] text-[12.5px] font-[800] disabled:opacity-40"
          >
            Fix
          </button>
        </div>
      ) : null}
    </div>
  );
}

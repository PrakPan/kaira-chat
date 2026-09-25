import React from "react";
import * as T from "../mobileItinerary/designTokens";
import {
  CheckGlyph,
  EXPIRED,
  EXPIRED_TINT,
  GUTTER,
  KairaAvatar,
  RepriceGlyph,
  fullyPaidPill,
} from "./desktopTokens";
import useCountdown, { useHasPassed } from "./useCountdown";

// ─────────────────────────────────────────────────────────────────────────────
//  The desktop itinerary's footer, as "Kaira E Desktop" draws it:
//
//    TOTAL COST
//    ₹6,63,378/-  [(Kaira) LOCK IT · ₹999]         [View Cart (28)]
//    Inclusive of 28 bookings ›              COUPON DISCOUNTS AVAILABLE
//
//  Rendered by BottomCTABar's "desktopItinerary" variant, for its priced (or
//  pricing) row only. Every other state the bar knows — the draft's Confirm,
//  the steps loader, the archive's "Get this trip!" — is still the bar's own,
//  so they keep working as they did.
//
//  "Inclusive of N bookings" opens the cart, as the design has it: the count is
//  what the total is made of, and the cart is where they are listed.
//
//  Once the quote lapses the hold pill's slot becomes the design's red
//  "↻ EXPIRED · REPRICE", which re-quotes the trip from right here.
// ─────────────────────────────────────────────────────────────────────────────

export default function DesktopCartFooter({
  barStyle,
  label = "TOTAL COST",
  total = null,
  count = 0,
  // Formatted hold fee when the hold can be offered, else null.
  holdFee = null,
  onHold,
  // A paid hold still running. `heldUntil` may be null on a cart that carries
  // no paid-at time — the pill then says HELD without a clock.
  held = false,
  heldUntil = null,
  // Paid in full with nothing owing: FULLY PAID in the hold pill's place.
  fullyPaid = false,
  // When today's prices stop standing, or null where a lapse isn't the
  // traveller's to reprice (see BottomCTABar). Tested live against the clock.
  quoteDeadline = null,
  onReprice = undefined,
  isRepricing = false,
  onViewCart,
  cartError = false,
  onGetInTouch,
}) {
  const heldClock = useCountdown(held ? heldUntil : null);
  const expired = useHasPassed(quoteDeadline) && !!total && !!onReprice;

  return (
    <div
      data-bottom-cta-bar
      data-itinerary-cta-bar
      style={{
        ...barStyle,
        // Paper, translucent — the trip scrolls under it rather than stopping
        // at a hard edge.
        background: "rgba(250,250,245,.94)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderTop: "1px solid #ececec",
        padding: `12px ${GUTTER} 16px`,
      }}
      className="z-20 fixed bottom-0 flex w-full flex-none items-center gap-[14px] font-inter leading-[normal]"
    >
      <div className="min-w-0 flex-1">
        <div className="font-mono text-[8px] tracking-[0.14em] text-[#8a93a6]">{label}</div>
        <div className="mt-[2px] flex items-center gap-[9px]">
          {total ? (
            <span className="whitespace-nowrap text-[20px] font-[800] tracking-[-0.02em] text-[#0b1220]">
              {total}
              <span className="text-[13px] font-[700]">/-</span>
            </span>
          ) : cartError ? (
            <span className="text-[13px] text-[#6b7280]">Couldn&apos;t load price.</span>
          ) : (
            <span className="text-[20px] font-[800] text-[#0b1220]">—</span>
          )}

          {expired ? (
            <button
              type="button"
              onClick={onReprice}
              disabled={isRepricing}
              className="inline-flex flex-none items-center gap-[7px] whitespace-nowrap font-mono text-[8px] font-[600] tracking-[0.06em]"
              style={{
                border: `1.5px solid ${EXPIRED}`,
                background: EXPIRED_TINT,
                borderRadius: 999,
                padding: "4px 11px 4px 9px",
                color: EXPIRED,
                boxShadow: "none",
              }}
            >
              <RepriceGlyph />
              {isRepricing ? "CHECKING…" : "EXPIRED · REPRICE"}
            </button>
          ) : fullyPaid && total ? (
            <span
              className="inline-flex flex-none items-center gap-[7px] whitespace-nowrap font-mono text-[8px] font-[600] tracking-[0.06em]"
              style={{ ...fullyPaidPill, padding: "4px 11px 4px 9px" }}
            >
              <CheckGlyph />
              FULLY PAID
            </span>
          ) : holdFee ? (
            <button
              type="button"
              onClick={onHold}
              aria-label={`Hold this price for ${holdFee}`}
              className="inline-flex flex-none items-center gap-[7px] whitespace-nowrap font-mono text-[8px] font-[600] tracking-[0.06em]"
              style={{
                border: `1.5px dashed ${T.GREEN}`,
                background: "rgba(31,138,90,.08)",
                borderRadius: 999,
                padding: "4px 11px 4px 5px",
                color: T.GREEN,
                boxShadow: "none",
              }}
            >
              <KairaAvatar size={18} ring={`1px solid ${T.GREEN}`} />
              {`LOCK IT · ${holdFee}`}
            </button>
          ) : held ? (
            <span
              className="inline-flex flex-none items-center gap-[7px] whitespace-nowrap font-mono text-[8px] font-[600] tracking-[0.06em]"
              style={{
                background: T.INK,
                borderRadius: 999,
                padding: "4px 11px 4px 5px",
                color: T.YELLOW,
              }}
            >
              <KairaAvatar size={18} ring={`1px solid ${T.YELLOW}`} />
              {heldClock ? `HELD · ${heldClock}` : "HELD"}
            </span>
          ) : null}
        </div>
        {count > 0 && onViewCart ? (
          <button
            type="button"
            onClick={onViewCart}
            style={T.bare}
            className="mt-[2px] block p-0 text-left text-[11px] text-[#6b7280]"
          >
            Inclusive of{" "}
            <span
              className="font-[600] text-[#0b1220]"
              style={{ textDecoration: "underline", textUnderlineOffset: 2 }}
            >
              {count} booking{count === 1 ? "" : "s"}
            </span>{" "}
            ›
          </button>
        ) : null}
      </div>

      <div className="flex flex-none flex-col items-end gap-[5px]">
        {cartError ? (
          <button
            type="button"
            onClick={onGetInTouch}
            style={T.primaryPill}
            className="inline-flex h-[40px] items-center px-[18px] text-[13px] font-[800]"
          >
            Get in touch!
          </button>
        ) : (
          <button
            type="button"
            onClick={onViewCart}
            style={T.primaryPill}
            className="inline-flex h-[40px] items-center gap-[9px] px-[18px] text-[13px] font-[800]"
          >
            View Cart
            {count > 0 ? (
              <span
                className="grid h-[20px] min-w-[20px] place-items-center rounded-full px-[4px] font-mono text-[9.5px] font-[800]"
                style={{ background: T.INK, color: T.YELLOW }}
              >
                {count}
              </span>
            ) : null}
          </button>
        )}
        {total ? (
          <div
            className="font-mono text-[7.5px] tracking-[0.1em]"
            style={{ color: T.GREEN }}
          >
            COUPON DISCOUNTS AVAILABLE
          </div>
        ) : null}
      </div>
    </div>
  );
}

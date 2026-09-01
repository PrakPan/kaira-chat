import React, { useMemo } from "react";
import { shallowEqual, useSelector } from "react-redux";

import Sheet from "../../common/components/Sheet";
import { formatMoney } from "../../../../services/money";

// ─────────────────────────────────────────────────────────────────────────────
//  CartSheet — "Review & pay", the design's version.
//
//  The old cart (NewBookingSlide, opened via openPaymentDrawer) is untouched and
//  still mounted — it owns coupons, traveller details and the payment gateway.
//  This sheet is the design's summary in front of it: what you're buying, by
//  group, and what comes off your card today. "Pay now" and "Apply" both hand
//  over to that drawer rather than reimplementing checkout.
//
//  DATA NOTES (verified against the Mercury /cart/ payload):
//   • `cart.summary` is an OBJECT keyed by category — "Flights", "Stays",
//     "Activities", "Ancillaries", "Transfers" (legacy: "Hotels"). Never an
//     array, so iterate Object.entries and don't hardcode the key list.
//   • Each category is { count, cost, bookings[] }. `cost` is MAJOR units
//     (rupees) — the Mercury cart is never in paise, so never divide by 100.
//   • `total_payable_amount` is what is actually charged (net of anything
//     already paid). It is NOT the same as the trip total, which is why the
//     design has a separate "PAYABLE NOW" line.
//   • Coupon AVAILABILITY does not exist on the cart — it needs a separate
//     GET /payment/coupons/. So the row states what we can prove: an applied
//     coupon (cart.coupon_usage) or a neutral invitation, never a fake promise.
// ─────────────────────────────────────────────────────────────────────────────

// Category key → the label the design uses.
const GROUP_LABEL = {
  Flights: "Flights",
  Stays: "Stays",
  Hotels: "Stays",
  Transfers: "Taxis",
  Activities: "Activities",
  Ancillaries: "Visa & eSIM",
};

const GROUP_ORDER = ["Flights", "Stays", "Hotels", "Transfers", "Activities", "Ancillaries"];

function Row({ label, count, amount }) {
  return (
    <div
      style={{ border: "1px solid #dcdfe5", borderRadius: 11, background: "#fff", boxShadow: "none" }}
      className="flex items-center gap-[12px] p-[12px]"
    >
      <div className="h-[28px] w-[28px] flex-none rounded-[6px] bg-[#e6e8ec]" />
      <div className="min-w-0 flex-1">
        <div className="truncate text-[13.5px] font-[700] text-[#0b1220]">{label}</div>
        {count ? (
          <div className="mt-[3px] font-mono text-[9.5px] tracking-[0.06em] text-[#8a93a6]">
            {count}
          </div>
        ) : null}
      </div>
      <div className="flex-none whitespace-nowrap text-[13.5px] font-[800] text-[#0b1220]">
        {amount}
      </div>
    </div>
  );
}

export default function CartSheet({
  open,
  onClose,
  onPay,
  onApplyCoupon,
  onReprice,
  isRepricing = false,
}) {
  const { cart, currency } = useSelector(
    (s) => ({ cart: s.Cart, currency: s.currency }),
    shallowEqual,
  );

  // The drawer computes expiry from Date.now() during render, so it only flips
  // when something else re-renders it — the countdown can hit zero and the pay
  // button stay live. A second-resolution tick here makes it flip on time.
  const [now, setNow] = React.useState(() => Date.now());
  React.useEffect(() => {
    if (!open) return undefined;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [open]);

  const model = useMemo(() => {
    const C = cart;
    const usable = !!C && !C.error && !!C.summary;
    if (!usable) return null;

    const code = C?.currency || currency?.currency || "INR";
    const money = (n) => formatMoney(n, code);

    const entries = Object.entries(C.summary);
    const known = GROUP_ORDER.filter((k) => C.summary[k]);
    const rest = entries.map(([k]) => k).filter((k) => !GROUP_ORDER.includes(k));

    const groups = [];
    let grouped = 0;
    for (const key of [...known, ...rest]) {
      const g = C.summary[key];
      const count = Number(g?.count) || 0;
      const cost = Number(g?.cost) || 0;
      if (count === 0 && cost === 0) continue;
      grouped += cost;
      groups.push({
        key,
        label: GROUP_LABEL[key] || key,
        count: `${count} BOOKING${count === 1 ? "" : "S"}`,
        amount: money(cost),
      });
    }

    // The headline total is quoted and held; the per-category costs are the
    // live line items. When they disagree the difference is real money, so the
    // design surfaces it as its own row rather than silently reconciling.
    const perPerson = !!(C?.pay_only_for_one || C?.show_per_person_cost);
    const rawTotal = perPerson ? C?.per_person_discounted_cost : C?.discounted_cost;
    const total = Number(rawTotal);
    const adjustment =
      !perPerson && Number.isFinite(total) ? Math.round(total - grouped) : 0;
    if (adjustment !== 0) {
      groups.push({
        key: "__adjustment",
        label: "Held-fare adjustment",
        count: "AGAINST YOUR QUOTE",
        amount: `${adjustment < 0 ? "−" : "+"}${money(Math.abs(adjustment))}`,
      });
    }

    const bookings = entries.reduce((n, [, g]) => n + (Number(g?.count) || 0), 0);

    const payableRaw = Number(C?.total_payable_amount);
    const payable = Number.isFinite(payableRaw) && payableRaw > 0 ? payableRaw : total;

    const applied = C?.coupon_usage || null;

    // Mercury sends "YYYY-MM-DD HH:MM:SS" — Safari will not parse that without
    // the T. A missing value counts as expired, exactly as the cart does.
    const validUntil = C?.price_valid_until;
    const expired =
      !validUntil ||
      new Date(String(validUntil).replace(" ", "T")).getTime() <= now;

    return {
      expired,
      groups,
      bookings,
      hidden: !!C?.are_prices_hidden,
      payableLabel: Number.isFinite(payable) ? money(payable) : null,
      coupon: applied
        ? {
            text: applied.message || `Coupon ${C?.coupon?.code || ""} applied`.trim(),
            cta: applied.discount ? `−${money(applied.discount)}` : "Applied",
          }
        : { text: "Have a coupon?", cta: "Apply" },
    };
  }, [cart, currency, now]);

  if (!model) return null;

  return (
    <Sheet open={open} onClose={onClose} height="calc(0.95 * var(--app-vh, 100dvh))" zIndex={1620}>
      <div className="flex h-full flex-col">
        <div className="flex-none px-[14px]">
          <div className="flex items-center gap-[12px] border-b border-[#e6e8ec] pb-[11px]">
            <div className="min-w-0 flex-1">
              <div className="text-[16.5px] font-[800] tracking-[-0.02em] text-[#0b1220]">
                Review &amp; pay
              </div>
              <div className="mt-[4px] font-mono text-[10px] tracking-[0.06em] text-[#8a93a6]">
                {model.bookings} BOOKING{model.bookings === 1 ? "" : "S"} ·{" "}
                {/* Saying "PRICE HELD TODAY" while the hold has lapsed is a
                    claim the cart can no longer honour. */}
                {model.expired ? (
                  <span className="text-[#b84034]">PRICES EXPIRED</span>
                ) : (
                  "PRICE HELD TODAY"
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              style={{
                border: "1px solid #dcdfe5",
                background: "#ffffff",
                borderRadius: 999,
                boxShadow: "none",
                width: 26,
                height: 26,
                color: "#6b7280",
                fontSize: 13,
                lineHeight: 1,
                padding: 0,
              }}
              className="flex flex-none items-center justify-center"
            >
              ×
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-[14px] py-[12px]">
          <div className="flex flex-col gap-[11px]">
            {model.expired ? (
              <div
                style={{
                  border: "1px solid #f3c9c4",
                  background: "#fff1ee",
                  borderRadius: 11,
                  boxShadow: "none",
                }}
                className="flex flex-col gap-[3px] p-[12px]"
              >
                <div className="font-mono text-[9.5px] tracking-[0.07em] text-[#b84034]">
                  PRICES EXPIRED
                </div>
                <div className="text-[13px] leading-[1.45] text-[#0b1220]">
                  These prices are no longer held. Reprice the itinerary to see
                  today&apos;s cost before paying.
                </div>
              </div>
            ) : null}
            {model.groups.map((g) => (
              <Row
                key={g.key}
                label={g.label}
                count={g.count}
                amount={model.hidden ? "—" : g.amount}
              />
            ))}

            <div
              style={{ border: "1.5px dashed #cfd3da", borderRadius: 11, background: "#fff", boxShadow: "none" }}
              className="flex items-center gap-[11px] p-[12px]"
            >
              <div className="min-w-0 flex-1 text-[13px] text-[#6b7280]">
                {model.coupon.text}
              </div>
              <button
                type="button"
                onClick={onApplyCoupon}
                style={{
                  border: "1px solid #dcdfe5",
                  background: "#ffffff",
                  borderRadius: 999,
                  boxShadow: "none",
                }}
                className="flex-none whitespace-nowrap px-[13px] py-[7px] text-[12.5px] font-[700] text-[#0b1220]"
              >
                {model.coupon.cta}
              </button>
            </div>
          </div>
        </div>

        <div className="flex-none border-t border-[#e6e8ec] px-[14px] pb-[14px] pt-[11px]">
          <div className="flex items-center justify-between gap-[13px]">
            <div className="min-w-0">
              <div className="font-mono text-[9.5px] tracking-[0.07em] text-[#8a93a6]">
                {model.expired ? "PRICES EXPIRED" : "PAYABLE NOW"}
              </div>
              <div className="mt-[2px] whitespace-nowrap text-[17px] font-[800] tracking-[-0.02em] text-[#0b1220]">
                {model.hidden ? "—" : model.payableLabel || "—"}
              </div>
            </div>
            <button
              type="button"
              onClick={model.expired ? onReprice : onPay}
              disabled={isRepricing}
              style={{
                border: "none",
                background: "#f7e700",
                borderRadius: 10,
                boxShadow: "0 8px 20px -10px rgba(247,231,0,0.55)",
              }}
              className="flex-none whitespace-nowrap px-[20px] py-[12px] text-[14.5px] font-[800] text-[#0b1220] disabled:opacity-60"
            >
              {isRepricing
                ? "Repricing…"
                : model.expired
                  ? "Reprice itinerary"
                  : "Pay now"}
            </button>
          </div>
        </div>
      </div>
    </Sheet>
  );
}

import React from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

import Sheet from "../../common/components/Sheet";
import setCart from "../../../../store/actions/Cart";
import { openNotification } from "../../../../store/actions/notification";
import {
  applyCoupon,
  fetchCoupons,
} from "../../../../services/sales/itinerary/Purchase";
import { formatCurrencyValue } from "../../../../services/formatCurrencyValue";
import { currencySymbolFor } from "../../../../services/money";

// ─────────────────────────────────────────────────────────────────────────────
//  CouponSheet — "Apply Coupons", as a bottom sheet.
//
//  The same screen the cart drawer opens on desktop (NewBookingSlide's
//  CouponModal), off the same two endpoints and with the same layout: the
//  applicable coupons first, the ones this trip cannot use below them, each a
//  dashed code chip over what it saves, and the reason it cannot be used where
//  its description would be.
//
//  Rebuilt here rather than reused because that one is a `Drawer anchor=right`
//  declared inline inside a 5,000-line file, and pulling it out is a change to
//  the desktop checkout. This surface's Apply used to close the cart sheet and
//  hand the whole thing over to that drawer, which meant leaving Review & pay
//  to pick a coupon and coming back to it through a different screen.
//
//  Applying dispatches the cart the endpoint returns, so the Review & pay sheet
//  underneath re-renders on the new total the moment this one closes.
// ─────────────────────────────────────────────────────────────────────────────

const bearer = (token) => {
  const t =
    token ||
    (typeof window !== "undefined"
      ? localStorage.getItem("access_token")
      : null);
  return t ? { headers: { Authorization: `Bearer ${t}` } } : undefined;
};

function CouponSkeleton() {
  return (
    <div className="border-b border-[#e6e8ec] px-[14px] py-[13px]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="mb-[9px] h-[26px] w-[128px] animate-pulse rounded bg-[#f1f2f4]" />
          <div className="h-[14px] w-[96px] animate-pulse rounded bg-[#f1f2f4]" />
        </div>
        <div className="h-[30px] w-[62px] animate-pulse rounded-[9px] bg-[#f1f2f4]" />
      </div>
      <div className="mt-[10px] h-[12px] w-3/4 animate-pulse rounded bg-[#f1f2f4]" />
    </div>
  );
}

function CouponCard({ coupon, applied, applying, disabled, onApply }) {
  const unavailable = !coupon.is_applicable;

  return (
    <div className="border-b border-[#e6e8ec] px-[14px] py-[13px]">
      <div className="flex items-start justify-between gap-[12px]">
        <div className="min-w-0 flex-1">
          {/* The dashed chip is what a coupon code looks like on every surface
              this app has — kept, at phone type sizes. */}
          <span
            className={`inline-block rounded-[3px] border border-dashed px-[12px] py-[5px] text-[13.5px] font-[600] ${
              unavailable
                ? "border-[#c3c8d2] text-[#8a93a6]"
                : "border-[#0b1220] text-[#0b1220]"
            }`}
          >
            {coupon.code}
          </span>
          <div
            className={`mt-[9px] text-[15px] font-[700] leading-[1.25] ${
              unavailable ? "text-[#8a93a6]" : "text-[#1f8a5a]"
            }`}
          >
            {coupon.title}
          </div>
        </div>
        <button
          type="button"
          onClick={() => onApply(coupon)}
          disabled={disabled}
          style={{ border: 0, borderRadius: 9, boxShadow: "none" }}
          className={`flex h-[32px] min-w-[64px] flex-none items-center justify-center px-[14px] text-[12.5px] font-[700] ${
            applied
              ? "bg-[#DFF3E7] text-[#1F8A5A]"
              : unavailable
                ? "bg-[#f1f2f4] text-[#a8afbb]"
                : "bg-[#0b1220] text-white"
          } ${applying ? "opacity-70" : ""}`}
        >
          {applying ? "…" : applied ? "Applied" : "Apply"}
        </button>
      </div>

      {unavailable ? (
        <div className="mt-[8px] text-[12.5px] leading-[1.45] text-[#b42318]">
          {coupon.applicability_error}
        </div>
      ) : (
        <>
          {coupon.description ? (
            <div className="mt-[8px] text-[12.5px] leading-[1.45] text-[#6b7280]">
              {coupon.description}
            </div>
          ) : null}
          {coupon.expiry ? (
            <div className="mt-[6px] font-mono text-[10px] tracking-[0.06em] text-[#8a93a6]">
              EXPIRES ON {coupon.expiry}
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

export default function CouponSheet({ open, onClose, token, onApplied }) {
  const dispatch = useDispatch();
  const { cart, itineraryId, currency } = useSelector(
    (s) => ({
      cart: s.Cart,
      itineraryId: s.ItineraryId,
      currency: s.currency?.currency,
    }),
    shallowEqual,
  );

  const [coupons, setCoupons] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [applyingId, setApplyingId] = React.useState(null);

  const code = cart?.currency || currency || "INR";

  // Refetched on every open: what a coupon saves, and whether it applies at
  // all, both move with the cart — a list read once would offer a discount the
  // trip has since grown out of.
  React.useEffect(() => {
    if (!open || !itineraryId) return undefined;
    let live = true;
    setLoading(true);
    setCoupons([]);
    fetchCoupons
      .get(`/?itinerary_id=${itineraryId}&currency=${code}`, bearer(token))
      .then((res) => {
        if (!live) return;
        const list = Array.isArray(res?.data) ? res.data : [];
        setCoupons(
          list.map((c) => ({
            id: c.id,
            code: c.code,
            title: `Save ${currencySymbolFor(code)}${formatCurrencyValue(
              c.discount_value,
              code,
            )}`,
            description: c.description,
            expiry: c.end_time
              ? new Date(c.end_time).toLocaleDateString("en-IN")
              : null,
            discount: Number(c.discount_value) || 0,
            is_applicable: c.is_applicable,
            applicability_error: c.applicability_error,
          })),
        );
      })
      .catch(() => {
        if (live) setCoupons([]);
      })
      .finally(() => {
        if (live) setLoading(false);
      });
    return () => {
      live = false;
    };
  }, [open, itineraryId, code, token]);

  const appliedId = cart?.coupon_usage?.id || null;

  const handleApply = async (coupon) => {
    if (!cart?.id) return;
    setApplyingId(coupon.id);
    try {
      const res = await applyCoupon.post(
        "/",
        { payment_information_id: cart.id, coupon_id: coupon.id },
        bearer(token),
      );
      if (res?.data?.coupon_usage) {
        // The endpoint answers with the whole repriced cart, so this is what
        // updates the total on the sheet underneath.
        dispatch(setCart(res.data));
        dispatch(
          openNotification({
            type: "success",
            heading: "Success",
            text: res.data.coupon_usage.message || "Coupon applied",
          }),
        );
        onApplied?.();
        onClose?.();
      }
    } catch (e) {
      dispatch(
        openNotification({
          type: "error",
          heading: "Error!",
          text: "Couldn't apply that coupon. Please try again.",
        }),
      );
    } finally {
      setApplyingId(null);
    }
  };

  // The API returns the biggest discount first; that order is kept inside each
  // group rather than resorted across the split.
  const byDiscount = (a, b) => b.discount - a.discount;
  const usable = coupons.filter((c) => c.is_applicable).sort(byDiscount);
  const unusable = coupons.filter((c) => !c.is_applicable).sort(byDiscount);

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Apply Coupons"
      // 95dvh, like Review & pay under it: a shorter sheet left that one's
      // header showing above it, so two headers stacked at the top of the
      // screen and the coupons read as a panel inside the cart rather than the
      // screen the traveller is now on.
      height="95dvh"
      // Above the Review & pay sheet (1620) it opens from, which stays put
      // behind it — picking a coupon is a step inside checkout, not a
      // departure from it.
      zIndex={1630}
    >
      <div className="pb-[10px]">
        {loading ? (
          <>
            <SectionTitle>Available Coupons</SectionTitle>
            <CouponSkeleton />
            <CouponSkeleton />
            <CouponSkeleton />
          </>
        ) : coupons.length === 0 ? (
          <div className="px-[14px] py-[22px] text-[13px] text-[#6b7280]">
            No coupons available at the moment.
          </div>
        ) : (
          <>
            <SectionTitle>Available Coupons</SectionTitle>
            {usable.length ? (
              usable.map((c) => (
                <CouponCard
                  key={c.id}
                  coupon={c}
                  applied={appliedId === c.id}
                  applying={applyingId === c.id}
                  // One coupon at a time, exactly as the cart allows: with one
                  // applied every other Apply is closed rather than silently
                  // replacing it.
                  disabled={
                    !!applyingId || !!appliedId || applyingId === c.id
                  }
                  onApply={handleApply}
                />
              ))
            ) : (
              <div className="px-[14px] pb-[13px] text-[13px] text-[#6b7280]">
                No available coupons at the moment.
              </div>
            )}

            {unusable.length ? (
              <>
                <SectionTitle>Unavailable Coupons</SectionTitle>
                {unusable.map((c) => (
                  <CouponCard
                    key={c.id}
                    coupon={c}
                    applied={false}
                    applying={false}
                    disabled
                    onApply={handleApply}
                  />
                ))}
              </>
            ) : null}
          </>
        )}
      </div>
    </Sheet>
  );
}

/** The two group headings, in this surface's section idiom. */
function SectionTitle({ children }) {
  return (
    <div className="px-[14px] pb-[9px] pt-[14px] text-[14px] font-[700] text-[#0b1220]">
      {children}
    </div>
  );
}

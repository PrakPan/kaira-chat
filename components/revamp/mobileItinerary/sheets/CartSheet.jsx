import React, { useMemo } from "react";
import Link from "next/link";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { FaPassport, FaSimCard } from "react-icons/fa";
import { MdOutlineHotel, MdOutlineLocalActivity } from "react-icons/md";
import { RiWhatsappFill } from "react-icons/ri";

import CloseButton from "../../common/components/CloseButton";
import CouponSheet from "./CouponSheet";
import Sheet from "../../common/components/Sheet";
import setCart from "../../../../store/actions/Cart";
import urls from "../../../../services/urls";
import { openNotification } from "../../../../store/actions/notification";
import { removeCoupon } from "../../../../services/sales/itinerary/Purchase";
import { updateCartPricing } from "../../../../services/sales/Bookings";
import { formatMoney } from "../../../../services/money";
import {
  addAncillaryBooking,
  removeAncillaryBooking,
} from "../../../../store/actions/ancillaryBookings";
import VisaSearchDrawer from "../../../drawers/visaDetails/VisaSearchDrawer";
import EsimPackagesDrawer from "../../../drawers/esimDetails/EsimPackagesDrawer";
import DetailSheet from "./DetailSheet";
import getModeAccent from "../../common/components/bookingDetail/modeAccent";
import prompts from "../kairaPrompts";
import {
  ItineraryInclusions,
  PriceDetails,
} from "../../../../containers/itinerary/booking1/NewBookingSlide";

// ─────────────────────────────────────────────────────────────────────────────
//  CartSheet — "Review & pay" on the phone.
//
//  The body is the DESKTOP cart's, not a summary of it. It used to be five
//  grouped total lines — "Stays · 3 bookings · ₹1,14,135" — which named what
//  was being bought but not WHICH hotel, gave no way to drop a booking from
//  the order, and printed one number where the drawer prints a breakdown. So
//  the two components that draw that breakdown are imported from the drawer
//  itself (NewBookingSlide) rather than reimplemented here:
//
//    • ItineraryInclusions — the per-category accordions, every booking in
//      them, and the checkbox that includes or excludes one.
//    • PriceDetails        — itinerary cost, GST/TCS, coupon, total.
//
//  Both are pure and prop-driven, so this sheet and the drawer cannot drift.
//  What is written out here is only what the drawer renders inline: the
//  WhatsApp CTA, the Visa/eSIM upsells, the trust list and the terms link.
//
//  Kept from this sheet's own design, deliberately: the header, the dashed
//  "Have a coupon?" row (its own CouponSheet, no handover to the drawer), the
//  sticky PAYABLE NOW / Pay now bar, and the detail sheet a row opens into —
//  see `detailForCartBooking`. "Pay now" still hands over to the drawer, which
//  owns the traveller-details gate and the gateway.
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

// The four assurances the drawer closes on. Copied rather than imported: they
// are a literal inside its render, and they are content, not behaviour.
const TRIP_CONDITIONS = [
  {
    icon: "/assets/trip-condition/trip-condition-1.svg",
    title: "All Taxes & Fees Included",
    subheading:
      "What you see is what you pay. No last-minute taxes, service fees, or surprises at checkout.",
  },
  {
    icon: "/assets/trip-condition/trip-condition-2.svg",
    title: "Transparent Inclusions",
    subheading:
      "A clear breakdown of stays, transfers, experiences, and support — shared before confirmation.",
  },
  {
    icon: "/assets/trip-condition/trip-condition-3.svg",
    title: "Secure Payments",
    subheading:
      "Safe, encrypted payment gateways with flexible payment options where applicable.",
  },
  {
    icon: "/info.svg",
    title: "On-Ground & Remote Support",
    subheading:
      "Local assistance during your trip plus WhatsApp support from our team whenever you need it.",
  },
];

// Which cart category a booking id belongs to, in the vocabulary the cart PATCH
// expects. The drawer derives this inline; it is the one piece of its toggle
// handler that is not state.
const BOOKING_TYPE_FOR_CATEGORY = {
  Hotels: "accommodation",
  Stays: "accommodation",
  Flights: "flight",
  Transfers: "transfer",
  Ancillaries: "ancillary",
};

// ─── A cart row, as a detail-sheet descriptor ────────────────────────────────
//
//  Tapping a booking's name in the cart opens THIS surface's detail sheet — the
//  same one every row of the itinerary opens — not the desktop drawer stack the
//  cart used to hand off to. Those drawers are full-height panels built around
//  editing a booking (change hotel, delete transfer, re-pick an activity); from
//  inside checkout the traveller is reading, not editing, and the sheet is
//  where reading already happens on this surface.
//
//  So the cart row is translated into DetailSheet's descriptor. Only `live`
//  really matters: it names the endpoint behind the booking, and LiveDetailBody
//  renders the real thing off it. Everything else is the header.
//
//  It keeps the sheet's footer too — the same outlined "Remove" and yellow
//  "Change …" pills a row of the itinerary ends with, handing the request to
//  Kaira. Acting on one closes Review & pay as well as the detail sheet: the
//  cart the traveller was checking out is about to change, so leaving it up
//  behind the answer would be showing them a total that is already stale.

const cartDate = (value) => {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : format(d, "MMM dd");
};

const cartTravellers = (pax) => {
  const n =
    (Number(pax?.number_of_adults) || 0) +
    (Number(pax?.number_of_children) || 0) +
    (Number(pax?.number_of_infants) || 0);
  return n > 0 ? `${n} TRAVELER${n === 1 ? "" : "S"}` : null;
};

/**
 * `booking` is what ItineraryInclusions hands its `onOpenDetails`:
 * `{ id, booking_cost, status, booking_type, detail: { name, check_in,
 * check_out, duration, pax, transfer_type, booking_type } }` — where
 * `booking_type` is the CART CATEGORY and `detail.booking_type` is the
 * booking's own kind (Taxi, Visa, eSIM …).
 */
const detailForCartBooking = (booking) => {
  if (!booking?.id) return null;

  const d = booking.detail || {};
  const name = d.name || "Booking";
  const checkIn = cartDate(d.check_in);
  const checkOut = cartDate(d.check_out);
  const travellers = cartTravellers(d.pax);

  const meta = (parts) => parts.filter(Boolean).join(" · ") || null;

  switch (booking.booking_type) {
    case "Accommodation":
      return {
        kind: "STAY",
        name,
        meta: meta([
          checkIn && checkOut ? `${checkIn} – ${checkOut}` : checkIn,
          d.duration ? `${d.duration}N` : null,
          travellers,
        ])?.toUpperCase(),
        Icon: MdOutlineHotel,
        live: { kind: "stay", bookingId: booking.id },
        canChange: true,
        changeLabel: "Change Stay",
        changeMessage: prompts.changeBooking(name),
        canRemove: true,
        removeMessage: prompts.removeBooking(name),
      };

    case "Flight":
    case "Transfer": {
      // The mode is the booking's own type ("Taxi", "Flight", or on a combo the
      // comma-joined list of its legs) — getModeAccent normalises all three and
      // falls back to the neutral transfer glyph on anything it doesn't know.
      const mode = d.booking_type || (booking.booking_type === "Flight" ? "Flight" : "Taxi");
      return {
        kind: String(mode).toUpperCase(),
        name,
        meta: meta([checkIn, travellers])?.toUpperCase(),
        Icon: getModeAccent(mode).Icon,
        iconColor: "#1a4fd6",
        live: {
          kind: "transfer",
          bookingId: booking.id,
          bookingType: mode,
          combo: d.transfer_type === "combo",
          isSightseeing: d.transfer_type === "sightseeing",
          title: name,
        },
        canChange: true,
        // "Change Flight", "Change Taxi" — the mode is what the traveller is
        // looking at, and on a combo the neutral "Change Transfer" is the only
        // honest label for a booking that is several modes at once.
        changeLabel: `Change ${getModeAccent(mode).key}`,
        changeLabelShort: "Change",
        changeMessage: prompts.changeBooking(name),
        canRemove: true,
        removeMessage: prompts.removeBooking(name),
      };
    }

    case "Ancillary": {
      const isEsim = d.booking_type === "eSIM";
      return {
        kind: isEsim ? "ESIM" : "VISA",
        name,
        meta: "INCLUDED",
        Icon: isEsim ? FaSimCard : FaPassport,
        live: {
          kind: "ancillary",
          id: booking.id,
          items: [{ id: booking.id, type: d.booking_type, name }],
        },
        canChange: true,
        changeLabel: isEsim ? "Change eSIM" : "Change Visa",
        // The ancillary prompts name the KIND, not the booking: a trip carries
        // one visa arrangement, and "change Schengen Visa – 90 days" reads as a
        // request about a document rather than about the booking.
        changeMessage: prompts.changeAncillary(isEsim ? "eSIM" : "visa"),
        canRemove: true,
        removeMessage: prompts.removeAncillaries(isEsim ? "eSIM" : "visa"),
      };
    }

    case "Activity":
    default:
      return {
        kind: "ACTIVITY",
        name,
        meta: meta([checkIn, travellers])?.toUpperCase(),
        Icon: MdOutlineLocalActivity,
        // An activity booking answers on /bookings/activity/<id>/ — the slot it
        // sits in (city, day, slab) is only needed by the POI/restaurant
        // endpoint, which a cart row can never be.
        live: { kind: "element", elementType: "activity", id: booking.id, name },
        canChange: true,
        changeLabel: "Change Activity",
        changeMessage: prompts.changeBooking(name),
        canRemove: true,
        removeMessage: prompts.removeBooking(name),
      };
  }
};

export default function CartSheet({
  open,
  onClose,
  onPay,
  onReprice,
  onCouponApplied,
  token,
  itineraryId,
  askKaira,
  isRepricing = false,
  // The gateway is being opened. The sheet stays up as the screen behind it,
  // so its own button has to say that something is happening — otherwise a tap
  // on "Pay now" looks like nothing at all until Razorpay paints.
  isPaying = false,
}) {
  // Picking a coupon is a step INSIDE this sheet now, not a handover: the row's
  // button used to close Review & pay and open the old cart drawer, so the
  // traveller left checkout to choose a coupon and came back to it through a
  // different screen.
  const [couponsOpen, setCouponsOpen] = React.useState(false);
  const [removingCoupon, setRemovingCoupon] = React.useState(false);
  // Which bookings are in the order, and which of them the server is still
  // acknowledging. Seeded from the cart and re-seeded whenever it changes, the
  // same way the drawer does it — `selected` is per booking and defaults true.
  const [selectedInclusions, setSelectedInclusions] = React.useState({});
  const [updatingInclusions, setUpdatingInclusions] = React.useState({});
  const [detailBooking, setDetailBooking] = React.useState(null);
  const [showVisaDrawer, setShowVisaDrawer] = React.useState(false);
  const [showEsimDrawer, setShowEsimDrawer] = React.useState(false);
  const dispatch = useDispatch();
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

  React.useEffect(() => {
    if (!cart?.summary) return;
    const seed = {};
    Object.values(cart.summary).forEach((category) => {
      (category?.bookings || []).forEach((booking) => {
        seed[booking.id] = booking.selected ?? true;
      });
    });
    setSelectedInclusions(seed);
  }, [cart?.summary]);

  const model = useMemo(() => {
    const C = cart;
    const usable = !!C && !C.error && !!C.summary;
    if (!usable) return null;

    const code = C?.currency || currency?.currency || "INR";
    const money = (n) => formatMoney(n, code);

    const bookings = Object.values(C.summary).reduce(
      (n, g) => n + (Number(g?.count) || 0),
      0,
    );

    const perPerson = !!(C?.pay_only_for_one || C?.show_per_person_cost);
    const rawTotal = perPerson ? C?.per_person_discounted_cost : C?.discounted_cost;
    const total = Number(rawTotal);

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
      bookings,
      hidden: !!C?.are_prices_hidden,
      payableLabel: Number.isFinite(payable) ? money(payable) : null,
      coupon: applied
        ? {
            applied: true,
            // What the remove endpoint is addressed by. The usage row carries
            // the coupon's id; the code is the fallback, which is what the
            // desktop cart sends.
            id: applied.id || applied.coupon_id || C?.coupon?.code || null,
            text:
              applied.message || `Coupon ${C?.coupon?.code || ""} applied`.trim(),
          }
        : { applied: false, text: "Have a coupon?", cta: "Apply" },
    };
  }, [cart, currency, now]);

  // Including or excluding one booking, the way the drawer does it: optimistic
  // flip, PATCH the cart, and let the cart that comes back repaint everything
  // downstream — the category totals, PRICE DETAILS and the payable bar all
  // read from it. On failure the flip is reverted.
  //
  // `itineraryId` is a PROP, not `router.query.id`: on /chat/<id> that param is
  // the chat session, not the itinerary, and the PATCH would 404.
  const handleToggleInclusion = async (bookingId) => {
    if (!itineraryId || updatingInclusions[bookingId]) return;
    setUpdatingInclusions((prev) => ({ ...prev, [bookingId]: true }));
    const next = !selectedInclusions[bookingId];
    setSelectedInclusions((prev) => ({ ...prev, [bookingId]: next }));

    let category = null;
    Object.entries(cart?.summary || {}).forEach(([key, group]) => {
      if ((group?.bookings || []).some((b) => b.id === bookingId)) category = key;
    });

    try {
      const res = await updateCartPricing.patch(
        `/${itineraryId}/cart/`,
        [
          {
            booking_type: BOOKING_TYPE_FOR_CATEGORY[category] || "activity",
            booking_id: bookingId,
            selected: next,
          },
        ],
        token ? { headers: { Authorization: `Bearer ${token}` } } : undefined,
      );
      if (res?.data) dispatch(setCart(res.data));
    } catch (e) {
      setSelectedInclusions((prev) => ({ ...prev, [bookingId]: !next }));
      dispatch(
        openNotification({
          type: "error",
          heading: "Error!",
          text: "Couldn't update your cart. Please try again.",
        }),
      );
    } finally {
      setUpdatingInclusions((prev) => ({ ...prev, [bookingId]: false }));
    }
  };

  // Taking the coupon off, the way the desktop cart does it: the same endpoint,
  // and the cart it answers with is what repaints this sheet.
  const handleRemoveCoupon = async () => {
    if (!cart?.id || !model?.coupon?.id || removingCoupon) return;
    setRemovingCoupon(true);
    try {
      const res = await removeCoupon.post(
        "/",
        { payment_information_id: cart.id, coupon_id: model.coupon.id },
        token ? { headers: { Authorization: `Bearer ${token}` } } : undefined,
      );
      if (res?.data) {
        dispatch(setCart(res.data));
        onCouponApplied?.();
      }
    } catch (e) {
      dispatch(
        openNotification({
          type: "error",
          heading: "Error!",
          text: "Couldn't remove that coupon. Please try again.",
        }),
      );
    } finally {
      setRemovingCoupon(false);
    }
  };

  const handleWhatsappChat = () => {
    const here =
      typeof window !== "undefined" ? window.location.href : "https://www.thetarzanway.com";
    window.open(
      `${urls.WHATSAPP}?text=${encodeURIComponent(
        `Hey TTW! I need some help with my tailored experience - ${here}`,
      )}`,
      "_blank",
    );
  };

  // The detail sheet's Change/Remove pills, from inside checkout.
  //
  // Both sheets go, not just the detail one: the request Kaira is about to act
  // on changes what is IN this cart, so leaving Review & pay open behind the
  // answer would leave the traveller reading a total that is already stale —
  // and Kaira's own sheet needs the screen.
  const askFromCart = React.useCallback(
    (message, contextLabel) => {
      if (!message) return;
      setDetailBooking(null);
      onClose?.();
      askKaira?.(message, contextLabel || null);
    },
    [askKaira, onClose],
  );

  const ancillaryBookings = cart?.summary?.Ancillaries?.bookings || [];
  const visaCount = ancillaryBookings.filter((b) => b?.booking_type === "Visa").length;
  const esimCount = ancillaryBookings.filter((b) => b?.booking_type === "eSIM").length;

  if (!model) return null;

  return (
    <Sheet open={open} onClose={onClose} height="95dvh" zIndex={1620}>
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
            <CloseButton onClick={onClose} />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-[14px] py-[12px]">
          {model.expired ? (
            <div
              style={{
                border: "1px solid #f3c9c4",
                background: "#fff1ee",
                borderRadius: 11,
                boxShadow: "none",
              }}
              className="mb-[12px] flex flex-col gap-[3px] p-[12px]"
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

          {/* The drawer's own breakdown, imported rather than rebuilt. */}
          <ItineraryInclusions
            Cart={cart}
            selectedInclusions={selectedInclusions}
            onToggleInclusion={handleToggleInclusion}
            onOpenDetails={setDetailBooking}
            arePricesHidden={model.hidden}
            updatingInclusions={updatingInclusions}
            arePricesExpired={model.expired}
          />

          {/* Coupons stay this sheet's own: a dashed row that opens CouponSheet
              on top, rather than the drawer's "Apply coupon" line. */}
          <div
            style={{ border: "1.5px dashed #cfd3da", borderRadius: 11, background: "#fff", boxShadow: "none" }}
            className="mb-4 flex items-center gap-[11px] p-[12px]"
          >
            <div className="min-w-0 flex-1 text-[13px] text-[#6b7280]">
              {model.coupon.text}
            </div>
            {/* An applied coupon offers the only thing left to do with it —
                take it off. The discount it printed here instead is the number
                PRICE DETAILS below already carries, and it sat in the one place
                on the row that looks like a button. */}
            {model.coupon.applied ? (
              <button
                type="button"
                onClick={handleRemoveCoupon}
                disabled={removingCoupon}
                style={{
                  border: "1px solid #f3c9c4",
                  background: "#ffffff",
                  borderRadius: 999,
                  boxShadow: "none",
                }}
                className="flex-none whitespace-nowrap px-[13px] py-[7px] text-[12.5px] font-[700] text-[#b42318] disabled:opacity-50"
              >
                {removingCoupon ? "Removing…" : "Remove"}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setCouponsOpen(true)}
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
            )}
          </div>

          <PriceDetails
            itineraryCost={
              cart?.taxation_policy == "TCS"
                ? cart?.total_itinerary_cost
                : cart?.total_cost
            }
            lockInCost={0}
            couponDiscount={-(cart?.coupon_usage?.discount || 0)}
            surchargesTaxes={cart?.surcharges_and_taxes || 0}
            totalPayable={Math.round(cart?.total_payable_amount || 0)}
          />

          {/* Help */}
          <hr className="text-text-placeholder" />
          <div className="mt-md">
            <div className="flex gap-2 items-center">
              <img src="/info.svg" alt="" />
              <div className="text-sm-md font-400 leading-xl">
                Need help with your trip?
              </div>
            </div>
            <div className="text-sm-md font-400 leading-xl text-text-spacegrey mb-2">
              Connect with a travel expert on WhatsApp
            </div>
            <button
              type="button"
              onClick={handleWhatsappChat}
              className="flex flex-row justify-center items-center w-[60%] rounded-lg border border-black bg-white p-[6px] text-black"
            >
              <RiWhatsappFill className="text-[#4da750] mr-2 text-xl" />
              <div className="font-normal">Chat on WhatsApp</div>
            </button>
          </div>

          {/* Visa & eSIM CTAs */}
          <div className="mt-md mb-md">
            <hr className="text-text-placeholder mb-md" />
            <div className="text-sm font-400 leading-xl mb-sm text-[#01202B]">
              Enhance Your Trip
            </div>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-[#e6e8ec] bg-white shadow-[0_4px_34px_1px_rgba(195,195,195,0.25)]"
                onClick={() => setShowVisaDrawer(true)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-[36px] h-[36px] rounded-full bg-[#F5F0FF] flex items-center justify-center flex-shrink-0">
                    <span className="text-[18px]">🛂</span>
                  </div>
                  <div className="text-left">
                    <div className="text-[13px] font-600 text-[#01202B] flex items-center gap-1">
                      {visaCount > 0 ? `${visaCount} Visa added` : "Add Visa"}
                      {visaCount > 0 && (
                        <span className="inline-flex items-center justify-center w-[14px] h-[14px] rounded-full bg-[#22C55E] text-white text-[9px] font-700">
                          ✓
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#6E757A]">
                      Hassle-free visa assistance
                    </div>
                  </div>
                </div>
                <span className="text-[#979393] text-lg">›</span>
              </button>

              <button
                type="button"
                className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-[#e6e8ec] bg-white shadow-[0_4px_34px_1px_rgba(195,195,195,0.25)]"
                onClick={() => setShowEsimDrawer(true)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-[36px] h-[36px] rounded-full bg-[#DDF4C5] flex items-center justify-center flex-shrink-0">
                    <span className="text-[18px]">📶</span>
                  </div>
                  <div className="text-left">
                    <div className="text-[13px] font-600 text-[#01202B] flex items-center gap-1">
                      {esimCount > 0 ? `${esimCount} eSIM added` : "Add eSIM"}
                      {esimCount > 0 && (
                        <span className="inline-flex items-center justify-center w-[14px] h-[14px] rounded-full bg-[#22C55E] text-white text-[9px] font-700">
                          ✓
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#6E757A]">
                      Stay connected abroad
                    </div>
                  </div>
                </div>
                <span className="text-[#979393] text-lg">›</span>
              </button>
            </div>
          </div>

          {/* Trip Conditions */}
          <div className="bg-primary-lightPurple p-sm mt-xl">
            <div className="text-sm font-400 leading-xl mb-sm">
              Your Trip Will have
            </div>
            <div>
              {TRIP_CONDITIONS.map((item) => (
                <div key={item.title} className="flex gap-md mb-md">
                  <img
                    src={item.icon}
                    alt=""
                    width={20}
                    height={20}
                    className="rounded-circle w-[25px] h-[25px] flex p-[5px] bg-text-white"
                  />
                  <div>
                    <div className="text-sm font-400 leading-sm-md mb-xxs">
                      {item.title}
                    </div>
                    <div className="text-sm font-400 leading-sm-md text-text-spacegrey">
                      {item.subheading}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="flex flex-row justify-center items-center text-[#01202B] mt-2">
            <Link href="/terms-conditions" target="_blank">
              <div className="text-sm">Terms &amp; Conditions</div>
            </Link>
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
              disabled={isRepricing || isPaying}
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
                  : isPaying
                    ? "Opening payment…"
                    : "Pay now"}
            </button>
          </div>
        </div>
      </div>

      {/* Rendered inside the Sheet's tree but portalled out by Drawer, so it
          sits above this one rather than inside its scroll pane. */}
      <CouponSheet
        open={couponsOpen}
        onClose={() => setCouponsOpen(false)}
        token={token}
        onApplied={onCouponApplied}
      />

      {/* The visa and eSIM pickers. Shared with desktop, where they are
          right-anchored drawers; `variant="sheet"` renders the same views as
          bottom sheets so they stack on this one (search 1700, its detail
          1710) rather than sliding in over it. */}
      <VisaSearchDrawer
        variant="sheet"
        show={showVisaDrawer}
        onHide={() => setShowVisaDrawer(false)}
        onAdded={(booking, replaceId) => {
          if (booking?.id) dispatch(addAncillaryBooking(booking, replaceId));
          else if (replaceId) dispatch(removeAncillaryBooking(replaceId));
          onCouponApplied?.();
        }}
        onRemoved={(bookingId) => {
          if (bookingId) dispatch(removeAncillaryBooking(bookingId));
          onCouponApplied?.();
        }}
      />

      <EsimPackagesDrawer
        variant="sheet"
        show={showEsimDrawer}
        onHide={() => setShowEsimDrawer(false)}
        onAdded={(booking, replaceId) => {
          if (booking?.id) dispatch(addAncillaryBooking(booking, replaceId));
          else if (replaceId) dispatch(removeAncillaryBooking(replaceId));
          onCouponApplied?.();
        }}
        onRemoved={(bookingId) => {
          if (bookingId) dispatch(removeAncillaryBooking(bookingId));
          onCouponApplied?.();
        }}
      />

      {/* The cart row whose name was tapped, in this surface's own detail
          sheet. 1630 clears the cart's 1620 — the itinerary opens the same
          sheet at 1610, which is under the cart and right for that caller. */}
      <DetailSheet
        open={!!detailBooking}
        onClose={() => setDetailBooking(null)}
        detail={detailForCartBooking(detailBooking)}
        onAskKaira={askFromCart}
        zIndex={1630}
      />
    </Sheet>
  );
}

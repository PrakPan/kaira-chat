import React, { useMemo } from "react";
import Link from "next/link";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { format, parseISO } from "date-fns";
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
import { currencySymbolFor } from "../../../../services/money";
import { formatCurrencyValue } from "../../../../services/formatCurrencyValue";
import {
  addAncillaryBooking,
  removeAncillaryBooking,
} from "../../../../store/actions/ancillaryBookings";
import AddTravellerDetails from "../../../modals/passenger-details/AddTravellerDetails";
import VisaSearchDrawer from "../../../drawers/visaDetails/VisaSearchDrawer";
import EsimPackagesDrawer from "../../../drawers/esimDetails/EsimPackagesDrawer";
import DetailSheet from "./DetailSheet";
import getModeAccent from "../../common/components/bookingDetail/modeAccent";
import prompts from "../kairaPrompts";
import { SITE_ORIGIN } from "../../../../lib/seo/siteOrigin";
import {
  deriveLockIn,
  ItineraryInclusions,
  LockInNotice,
  PriceDetails,
} from "../../../../containers/itinerary/booking1/NewBookingSlide";

// ─────────────────────────────────────────────────────────────────────────────
//  CartSheet — "Review & pay" on the phone.
//
//  The body is the DESKTOP cart's, not a summary of it. It used to be five
//  grouped total lines — "Stays · 3 bookings · ₹1,14,135" — which named what
//  was being bought but not WHICH hotel, gave no way to drop a booking from
//  the order, and printed one number where the drawer prints a breakdown. So
//  the components that draw that breakdown are imported from the drawer itself
//  (NewBookingSlide) rather than reimplemented here:
//
//    • ItineraryInclusions — the per-category accordions, every booking in
//      them, and the checkbox that includes or excludes one.
//    • PriceDetails        — itinerary cost, GST/TCS, coupon, total.
//    • LockInNotice        — what the pay CTA is about to charge when today's
//      prices still have to be held, and the confirmation once they are.
//
//  All three are pure and prop-driven, so this sheet and the drawer cannot
//  drift. The RULES behind the last one are shared for the same reason
//  (deriveLockIn): this sheet must not offer a hold the drawer would not, or
//  name a different amount for it than the one it is about to charge.
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

// The trip has already departed. Redux seeds `Itinerary` with a `{ name,
// images }` placeholder that carries no `start_date`, so a missing date reads
// as "not loaded yet" and never as an expired trip — the same guard the
// desktop cart makes (NewBookingSlide's `isItineraryInFuture`) before it swaps
// its pay CTA for Update Dates. Both ends are floored to midnight: a trip
// starting today has not started too late to pay for.
const tripHasStarted = (startDate) => {
  if (!startDate) return false;
  const start = new Date(startDate);
  if (Number.isNaN(start.getTime())) return false;
  const today = new Date();
  start.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return start < today;
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

// "11h 29m 42s" — the desktop drawer's Hours / Mins / Secs timer, as one line
// small enough for the sheet's header. The units are spelled out rather than
// colon-separated: "11:29:42" beside a price reads as a duration only once you
// have worked out that it is one, and on a checkout header it can just as
// easily be mistaken for a time of day. Fields are zero-padded once a larger
// one is present, so the line doesn't reflow as the digits tick down, and an
// empty leading field is dropped entirely — "00h" is noise.
const clock = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const pad = (n) => String(n).padStart(2, "0");
  if (h > 0) return `${h}h ${pad(m)}m ${pad(s)}s`;
  if (m > 0) return `${m}m ${pad(s)}s`;
  return `${s}s`;
};

const cartDate = (value) => {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : format(d, "MMM dd");
};

// ─── Who is travelling ───────────────────────────────────────────────────────
//
//  The desktop cart opens on a header naming the lead traveller, the pax, the
//  dates and the trip, with "Add traveller details" beside it. On the phone
//  that header was the first thing in the drawer too — and this sheet replaced
//  the drawer without it, so the one link to the traveller-details form
//  disappeared from checkout. The traveller only met the form when "Pay now"
//  refused to open the gateway (NewBookingSlide gates on an empty `travellers`
//  array), which is a gate discovered at the worst moment.
//
//  So the header comes back, as this sheet's first card, and the form it opens
//  is the SAME AddTravellerDetails the drawer uses — in a sheet on top of this
//  one rather than a right-anchored drawer.

/** "3 Adults, 1 Child" — the itinerary's pax, zero groups left out. */
const paxLabel = (itinerary) => {
  const adults = Number(itinerary?.number_of_adults) || 0;
  const children = Number(itinerary?.number_of_children) || 0;
  const infants = Number(itinerary?.number_of_infants) || 0;
  const parts = [];
  if (adults) parts.push(`${adults} Adult${adults === 1 ? "" : "s"}`);
  if (children)
    parts.push(`${children} ${children === 1 ? "Child" : "Children"}`);
  if (infants) parts.push(`${infants} Infant${infants === 1 ? "" : "s"}`);
  return parts.join(", ");
};

// parseISO, not `new Date`: the itinerary's dates are date-only ("2026-11-27"),
// which `new Date` reads as UTC midnight — a day early anywhere west of GMT.
const tripDate = (value) => {
  if (!value) return null;
  const d = parseISO(String(value));
  return Number.isNaN(d.getTime()) ? null : format(d, "MMM dd, yyyy");
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
  // The trip's dates have gone by. Handled by the host rather than here: the
  // fix is the Settings sheet's date picker, which re-plans the whole trip
  // around the new dates, and it paints inside the page rather than in this
  // sheet's portal — so opening it is also the moment this sheet stands down.
  onUpdateDates,
  onCouponApplied,
  // Traveller details were just saved. The cart carries
  // `traveler_details_verified`, so the card's state only flips once the cart
  // has been refetched — same refresh the coupon flow asks for.
  onTravellersSaved,
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
  const [travellersOpen, setTravellersOpen] = React.useState(false);
  // The traveller form's save button lives in its sheet's fixed footer, so the
  // form hands its action out through this ref and reports its pending state.
  const travellerSubmit = React.useRef(null);
  const [travellerSaving, setTravellerSaving] = React.useState(false);
  const dispatch = useDispatch();
  const { cart, currency, itinerary, finalStatus } = useSelector(
    (s) => ({
      cart: s.Cart,
      currency: s.currency,
      itinerary: s.Itinerary,
      // Same slice the drawer reads. ItineraryContainer renders underneath this
      // tree in a display:none wrapper and is what dispatches it.
      finalStatus: s.ItineraryStatus?.final_status,
    }),
    shallowEqual,
  );
  // A released itinerary is locked: the drawer drops the include/exclude
  // checkbox rather than showing it disabled, and this sheet reuses the same
  // breakdown component, so it has to hand the flag over too.
  const isReleased = finalStatus === "Released";

  // The drawer computes expiry from Date.now() during render, so it only flips
  // when something else re-renders it — the countdown can hit zero and the pay
  // button stay live. A second-resolution tick here makes it flip on time, and
  // is what drives the header's price-hold clock. It runs only while the sheet
  // is open, so a closed cart isn't re-rendering once a second.
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
    const validUntilMs = validUntil
      ? new Date(String(validUntil).replace(" ", "T")).getTime()
      : null;
    const pricesExpired = !validUntilMs || validUntilMs <= now;
    // How long the quote is actually held for, counted down live rather than
    // asserted as "today" — the same number the desktop drawer's LivePriceTimer
    // shows, in the header this sheet already has instead of a second banner.
    const secondsLeft = pricesExpired
      ? 0
      : Math.max(0, Math.floor((validUntilMs - now) / 1000));

    // ── Dates in the past ───────────────────────────────────────────────────
    // A quote that has lapsed and a trip that has already departed are two
    // different problems with two different answers, and this sheet knew only
    // the first: on a past-dated itinerary it offered "Reprice itinerary",
    // which re-quotes the same dead dates and hands the traveller straight
    // back here. The desktop cart separates them and so does this one.
    const datesPast = tripHasStarted(itinerary?.start_date);
    const anyPaid = Object.values(C.summary).some((g) =>
      (g?.bookings || []).some((b) => b?.status === "Paid"),
    );
    // Nothing paid yet, so the dates are still the traveller's to move: every
    // pay CTA becomes Update Dates, because paying today's prices for a trip
    // that started last week is a dead end.
    const showUpdateDates = datesPast && !anyPaid;
    // The reprice case is what is left: a lapsed quote on a live trip, and a
    // part-paid trip whose dates have gone — that one is already ticketed
    // against those dates, so the cart can only re-quote it, exactly as the
    // desktop cart's `showRepriceExpired` does.
    const showReprice = !showUpdateDates && (pricesExpired || datesPast);
    // Either way the figures below are not today's, which is what freezes the
    // include/exclude checkboxes and stands the hold down.
    const stale = showUpdateDates || showReprice;

    // The hold, on the drawer's rules rather than this sheet's. `lockInCompleted`
    // is the drawer's own post-gateway flag and belongs to the surface that runs
    // Razorpay; here the cart refetch that follows a payment is what flips this.
    const lock = deriveLockIn(C);
    // What the pay bar actually charges. With a hold owed that is the fee, not
    // the balance — the same swap the desktop CTA makes.
    //
    // Except on a stale cart, where the bar's button is Reprice and nothing is
    // being charged at all. The fee there named a hold the traveller cannot
    // buy — ₹999 under "PRICES EXPIRED", beside a button that takes no money —
    // so the figure goes back to the trip's own total, which is what the rest
    // of the sheet is showing them. Same condition that stands the hold card
    // down, for the same reason.
    const payNow = lock.requiresLockIn && !stale ? lock.payNowAmount : payable;
    // The card is on screen in exactly the states the CTA it explains is: while
    // the hold is owed, and once it has been paid. Not while the cart is stale,
    // where the bar offers a reprice or new dates instead of a payment.
    const showLockIn =
      !stale && (lock.requiresLockIn || lock.hasLockInPaid) && payable > 0;

    return {
      showUpdateDates,
      showReprice,
      stale,
      holdClock: clock(secondsLeft),
      // Under five minutes the countdown goes red, the threshold the shared
      // CountdownTimer already uses.
      holdUrgent: secondsLeft <= 300,
      bookings,
      hidden: !!C?.are_prices_hidden,
      // The bar's own amount, spaced and suffixed the way the desktop drawer
      // writes every lock-in figure ("₹ 999/-"). Built here rather than in
      // formatMoney, which the trip total and formatDelta also read.
      payableLabel: Number.isFinite(payNow)
        ? `${currencySymbolFor(code)} ${formatCurrencyValue(
            Math.round(payNow),
            code,
          )}/-`
        : null,
      lockInFee: lock.lockInFee,
      lockInPaid: lock.hasLockInPaid,
      lockInPaidAmount: lock.lockInPaidAmount,
      // The hold window, so this card counts down to the same instant the
      // drawer's does instead of showing a dateless "prices locked".
      lockInHoldUntil: lock.lockInHoldUntil,
      lockInHoldExpired: lock.lockInHoldExpired,
      requiresLockIn: lock.requiresLockIn,
      showLockIn,
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
  }, [cart, currency, now, itinerary?.start_date]);

  // The traveller card's contents. `verified` is the cart's own flag first —
  // it accounts for pax changes the itinerary's `travellers` array can't
  // reflect — with the array as the fallback, because that array is what the
  // drawer's pay gate actually tests.
  const traveller = useMemo(() => {
    const start = tripDate(itinerary?.start_date);
    const end = tripDate(itinerary?.end_date);
    return {
      leadName: itinerary?.customer_name || "",
      countLabel: paxLabel(itinerary),
      dates: start && end ? `${start} - ${end}` : start || end || null,
      tripName: itinerary?.name || "",
      verified:
        !!cart?.traveler_details_verified ||
        (Array.isArray(itinerary?.travellers) && itinerary.travellers.length > 0),
    };
  }, [itinerary, cart?.traveler_details_verified]);

  // What AddTravellerDetails resolves its itinerary id from. The prop wins over
  // anything on the redux object for the same reason the cart PATCH takes it:
  // on /chat/<id> the router param is the chat session, not the itinerary.
  const travellerItinerary = useMemo(
    () => ({ ...(itinerary || {}), id: itineraryId || itinerary?.id }),
    [itinerary, itineraryId],
  );

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

  // "Pay now" with no traveller details is the desktop drawer's gate, applied
  // here instead of behind the sheet. The drawer still refuses to open the
  // gateway on an empty `travellers` array — but on an auto-started payment it
  // paints nothing except its own right-anchored traveller drawer, which slides
  // in over this sheet from a screen the traveller never saw. Catching it on
  // this side puts up THIS surface's form, and the drawer's gate never fires
  // because by then the names are saved.
  //
  // Nothing resumes the payment afterwards, matching desktop: saving refetches
  // the cart, the card flips to ADDED, and the traveller taps Pay now again.
  // `type` is which sale the drawer should open — "lockin" for the hold,
  // "full" for the whole balance. The hold card offers both, so the choice has
  // to travel with the tap; the footer bar leaves it out and the drawer falls
  // back to its own `payNowType`, exactly as before.
  //
  // Only the full / balance payment needs the names — the drawer's gate skips
  // the hold, so this one does too. The footer bar's untyped tap is resolved
  // the way the drawer will resolve it (`payNowType` off the same cart).
  const handlePayNow = (type) => {
    const saleType = type || (model.requiresLockIn ? "lockin" : "full");
    if (saleType === "full" && !traveller.verified) {
      setTravellersOpen(true);
      return;
    }
    onPay?.(type);
  };

  const handleWhatsappChat = () => {
    const here =
      typeof window !== "undefined" ? window.location.href : SITE_ORIGIN;
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
                {/* The hold is a deadline, so the header states the deadline.
                    "PRICE HELD TODAY" was both vaguer than the cart knows and a
                    claim it could not honour once the quote had lapsed. */}
                {model.showUpdateDates ? (
                  <span className="text-[#b84034]">DATES EXPIRED</span>
                ) : model.showReprice ? (
                  <span className="text-[#b84034]">PRICES EXPIRED</span>
                ) : (
                  <>
                    PRICE HELD{" "}
                    <span
                      className={
                        model.holdUrgent
                          ? "font-[700] text-[#b84034]"
                          : "font-[700] text-[#0b1220]"
                      }
                    >
                      {model.holdClock}
                    </span>
                  </>
                )}
              </div>
            </div>
            <CloseButton onClick={onClose} />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-[14px] py-[12px]">
          {/* Why this cart cannot be paid as it stands. Past dates are named
              first and on their own: they are the reason the prices are stale,
              so "reprice" would be the wrong instruction to give here. */}
          {model.showUpdateDates ? (
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
                DATES EXPIRED
              </div>
              <div className="text-[13px] leading-[1.45] text-[#0b1220]">
                Your itinerary dates are in the past. Update the dates to see
                current pricing and continue with booking.
              </div>
            </div>
          ) : model.showReprice ? (
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

          {/* Who is travelling, and the way into the traveller-details form —
              the desktop cart's header, as the first card on the phone. It
              sits UNDER the expired notice: an expired price is the one thing
              on this screen more urgent than filling in names. */}
          <div
            style={{
              border: "1px solid #e6e8ec",
              borderRadius: 11,
              background: "#ffffff",
              boxShadow: "none",
            }}
            className="mb-[12px] p-[12px]"
          >
            {/* Two rows, each with its own right-hand item: the state tag sits
                with the label, and the link sits ON the name's row — the
                desktop cart's header, which puts the same link beside the
                traveller it belongs to.

                A link rather than a button: this is a detour out of checkout,
                not one of its steps, and the sheet's buttons all commit to
                something. It takes the blue the desktop cart already uses for
                exactly this link (tailwind `text-blue`, #3A85FC), stated
                inline because three stylesheets load after Tailwind and were
                repainting link colour and underline. */}
            <div className="flex items-center gap-[10px]">
              {/* The pax rides on the label rather than a line of its own —
                  "who" is one fact, and the micro-label is where this sheet
                  states that kind of fact (see the header's own line). */}
              <div className="min-w-0 flex-1 truncate font-mono text-[9.5px] tracking-[0.07em] text-[#8a93a6]">
                TRAVELLERS
                {traveller.countLabel
                  ? `: ${traveller.countLabel.toUpperCase()}`
                  : ""}
              </div>
              {traveller.verified ? (
                <span
                  style={{
                    border: "1px solid #cdebd6",
                    background: "#f2fbf5",
                    borderRadius: 999,
                    boxShadow: "none",
                  }}
                  className="flex-none whitespace-nowrap px-[9px] py-[4px] font-mono text-[9px] tracking-[0.07em] text-[#1c7a44]"
                >
                  ADDED
                </span>
              ) : null}
            </div>

            <div className="mt-[4px] flex items-baseline gap-[10px]">
              <div className="min-w-0 flex-1 truncate text-[14px] font-[700] tracking-[-0.01em] text-[#0b1220]">
                {traveller.leadName}
              </div>
              <button
                type="button"
                onClick={() => setTravellersOpen(true)}
                style={{
                  border: "none",
                  background: "transparent",
                  boxShadow: "none",
                  padding: 0,
                  color: "#3A85FC",
                  textDecoration: "underline",
                  textUnderlineOffset: 2,
                }}
                className="flex-none whitespace-nowrap text-[12px] font-[400]"
              >
                {traveller.verified
                  ? "Edit traveller details"
                  : "Add traveller details"}
              </button>
            </div>

            {/* Trip above dates, on lines of their own. Side by side they were
                one wrapping row, so on any real trip name the separator was
                left stranded at the end of the dates with nothing after it. */}
            {traveller.dates || traveller.tripName ? (
              <div className="mt-[9px] border-t border-[#f1f2f4] pt-[9px]">
                {traveller.tripName ? (
                  <div className="text-[12.5px] leading-[1.4] text-[#0b1220]">
                    {traveller.tripName}
                  </div>
                ) : null}
                {traveller.dates ? (
                  <div
                    className={`text-[12px] leading-[1.4] text-[#6b7280] ${
                      traveller.tripName ? "mt-[2px]" : ""
                    }`}
                  >
                    {traveller.dates}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>

          {/* The drawer's own breakdown, imported rather than rebuilt. */}
          <ItineraryInclusions
            Cart={cart}
            selectedInclusions={selectedInclusions}
            onToggleInclusion={handleToggleInclusion}
            onOpenDetails={setDetailBooking}
            arePricesHidden={model.hidden}
            updatingInclusions={updatingInclusions}
            arePricesExpired={model.stale}
            isReleased={isReleased}
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
            // Without this the breakdown omits the "Lock-in Amount Paid" line
            // the drawer prints, so a held cart showed the full trip cost with
            // no sign of the money already collected against it.
            lockInPaidAmount={model.lockInPaidAmount}
          />

          {/* The hold, directly under the breakdown it changes — same position
              in the reading order as the drawer's, which puts this card between
              PRICE DETAILS and the Proceed-to-Pay CTA. Here that CTA is in the
              fixed bar at the foot of the sheet. */}
          {model.showLockIn && (
            <LockInNotice
              lockInFee={model.lockInFee}
              lockInPaid={model.lockInPaid}
              lockInPaidAmount={model.lockInPaidAmount}
              lockInHoldUntil={model.lockInHoldUntil}
              lockInHoldExpired={model.lockInHoldExpired}
              // The gross the hold freezes and the balance still owed — both
              // read off the cart, never one from the other.
              tripTotal={cart?.discounted_cost}
              balanceDue={Math.round(cart?.total_payable_amount || 0)}
              // Straight to the drawer, naming which sale to open. This card
              // is the only pay CTA on screen wherever it renders: the sheet's
              // own footer bar stands down for it, the way the desktop
              // column's Proceed-to-Pay does.
              onHold={() => handlePayNow("lockin")}
              onPayFull={() => handlePayNow("full")}
              isPaying={isPaying}
            />
          )}

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

        {/* The sticky pay bar. Stood down while the hold card is on screen:
            that card carries both CTAs itself ("Hold this price" over "or pay
            in full", or "Pay balance" once the hold is paid), and a bar under
            it offering the same charge in different words is how a traveller
            ends up paying ₹1,54,008 from a screen that said ₹999. */}
        {!model.showLockIn && (
        <div className="flex-none border-t border-[#e6e8ec] px-[14px] pb-[14px] pt-[11px]">
          {model.showUpdateDates ? (
            // The one state with no amount beside its button: every figure in
            // this cart is quoted against dates that have gone, so printing
            // one here would name a price we are about to replace. The desktop
            // cart's mobile bar drops its amount for the same reason and
            // gives the whole strip to the Update Dates CTA.
            <button
              type="button"
              onClick={() => onUpdateDates?.()}
              style={{
                border: "none",
                background: "#f7e700",
                borderRadius: 10,
                boxShadow: "0 8px 20px -10px rgba(247,231,0,0.55)",
              }}
              className="w-full px-[20px] py-[12px] text-[14.5px] font-[800] text-[#0b1220]"
            >
              Update dates
            </button>
          ) : (
            <div className="flex items-center justify-between gap-[13px]">
              <div className="min-w-0">
                <div className="font-mono text-[9.5px] tracking-[0.07em] text-[#8a93a6]">
                  {model.showReprice
                    ? "PRICES EXPIRED"
                    : model.requiresLockIn
                      ? "PAY NOW TO HOLD"
                      : "PAYABLE NOW"}
                </div>
                <div className="mt-[2px] whitespace-nowrap text-[17px] font-[800] tracking-[-0.02em] text-[#0b1220]">
                  {model.hidden ? "—" : model.payableLabel || "—"}
                </div>
              </div>
              <button
                type="button"
                // Wrapped rather than passed straight through: `handlePayNow`
                // now takes the sale type, and handing it to onClick would send
                // it a click event to open a payment with.
                onClick={model.showReprice ? onReprice : () => handlePayNow()}
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
                  : model.showReprice
                    ? "Reprice itinerary"
                    : isPaying
                      ? "Opening payment…"
                      : // The amount is already printed beside this button, so
                        // the label only has to say what paying it BUYS — which
                        // is the part a bare "Proceed to Pay" under a fee far
                        // smaller than the total gets wrong. The padlock echoes
                        // the notice above, as it does on desktop, and is hidden
                        // from screen readers because the words carry it.
                        model.requiresLockIn ? (
                          <>
                            <span aria-hidden="true">&#128274;</span> Hold this
                            price
                          </>
                        ) : (
                          "Proceed to Pay"
                        )}
              </button>
            </div>
          )}
        </div>
        )}
      </div>

      {/* Rendered inside the Sheet's tree but portalled out by Drawer, so it
          sits above this one rather than inside its scroll pane. */}
      <CouponSheet
        open={couponsOpen}
        onClose={() => setCouponsOpen(false)}
        token={token}
        onApplied={onCouponApplied}
      />

      {/* The traveller-details form, in a sheet rather than the desktop
          drawer. Same component, so the two surfaces submit the same payload
          to the same endpoint and can't drift. 1640 clears the coupon and
          detail sheets (1630) this one can be opened alongside. */}
      <Sheet
        open={travellersOpen}
        onClose={() => setTravellersOpen(false)}
        title="Traveller details"
        subtitle="EVERYONE TRAVELLING ON THIS TRIP"
        height="95dvh"
        zIndex={1640}
        contentClassName="px-[14px] py-[14px]"
        footer={
          <button
            type="button"
            onClick={() => travellerSubmit.current?.()}
            disabled={travellerSaving}
            style={{
              border: "none",
              background: "#f7e700",
              borderRadius: 10,
              boxShadow: "0 8px 20px -10px rgba(247,231,0,0.55)",
            }}
            className="w-full px-[20px] py-[12px] text-[14.5px] font-[800] text-[#0b1220] disabled:opacity-60"
          >
            {travellerSaving ? "Saving…" : "Save Traveller Details"}
          </button>
        }
      >
        {/* Keyed on the pax: the form builds one slot per traveller in its
            state INITIALISERS, so a pax change made through Kaira while this
            sheet is open would otherwise leave it showing the old slots. */}
        <AddTravellerDetails
          key={`${travellerItinerary.number_of_adults || 0}-${
            travellerItinerary.number_of_children || 0
          }-${travellerItinerary.number_of_infants || 0}-${
            travellerItinerary.travellers?.length || 0
          }`}
          itinerary={travellerItinerary}
          hideSubmit
          submitRef={travellerSubmit}
          onSubmittingChange={setTravellerSaving}
          onSuccess={() => {
            setTravellersOpen(false);
            // The card above reads `traveler_details_verified` off the cart, so
            // the save only shows here once the cart has come back.
            onTravellersSaved?.();
          }}
        />
      </Sheet>

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

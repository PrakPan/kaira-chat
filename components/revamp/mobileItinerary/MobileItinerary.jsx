import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
// Font Awesome, like the transfer glyphs in modeAccent.js — one icon family
// across the surface, so a passport doesn't arrive drawn at a different weight
// from the car two rows above it.
import { FaPassport, FaSimCard } from "react-icons/fa";

import buildTripViewModel from "../../../lib/tripViewModel";
import { formatMoney } from "../../../services/money";
import LegSection from "./LegSection";
import DaySheet from "./sheets/DaySheet";
import MoreSheet from "./sheets/MoreSheet";
import DetailSheet from "./sheets/DetailSheet";
import * as T from "./designTokens";
import TripHeader from "./TripHeader";
import DesktopTripCard from "../desktopItinerary/DesktopTripCard";
import useTripActions from "./useTripActions";
import useBookingDrawers from "./useBookingDrawers";
import { OPEN_BOOKING_DETAIL } from "./bookingDetailBridge";

// ─────────────────────────────────────────────────────────────────────────────
//  MobileItinerary — the whole trip on one scroll, on a phone.
//
//  Two rules shape everything here:
//
//   1. THE TRIP IS A PACKAGE. Exactly one amount appears on this surface — the
//      trip total. No row carries a price, because no row is separately
//      payable, and showing one invites an audit of a number that doesn't mean
//      what it looks like.
//
//   2. EVERYTHING RISES FROM THE BOTTOM. Opening a row reads the booking in a
//      detail sheet. Adding or changing one — a row's CHANGE / ADD / Fix, and
//      the detail sheet's own "Change" — opens the same flow the desktop
//      itinerary's drawers do (useBookingDrawers: hotel search, transfer and
//      taxi pickers, the activity picker), raised as a bottom sheet (ui/Drawer's
//      DrawerSheetContext, which BotApp puts around the drawers' host). Only
//      the CTAs that SAY "ask Kaira" — a day at leisure, an activity's missing
//      pickup, a detail sheet's "Remove" — hand over to the chat.
//
//  Structural constraints from the host pane (BotApp's MobileLayout):
//   • NO inner vertical scroller — the pane itself is the scroller, and its
//     scroll drives the navbar hide/condense.
//   • NO position:fixed children — on iOS a fixed descendant of a
//     -webkit-overflow-scrolling:touch pane anchors to the scrolled content.
//     Sheets are fine: they portal out to #modal-portal.
//   • Sticky headers must use top:0 and stay under z-40 (the navbar).
// ─────────────────────────────────────────────────────────────────────────────

// The pane that actually scrolls belongs to the host (BotApp's MobileLayout),
// not to anything this component renders — so it has to be found rather than
// held. Nearest ancestor that both scrolls and has somewhere to scroll to.
const scrollParentOf = (node) => {
  for (let el = node?.parentElement; el; el = el.parentElement) {
    const overflowY = window.getComputedStyle(el).overflowY;
    if (
      (overflowY === "auto" || overflowY === "scroll") &&
      el.scrollHeight > el.clientHeight
    ) {
      return el;
    }
  }
  return null;
};

// How far below the sticky header a leg comes to rest — the design's own 8px
// breathing gap, so the card doesn't butt into the rule above it.
const ANCHOR_GAP = 8;

// The travel a chip tap draws (see scrollToAnchor). Each frame closes REACH of
// whatever gap is left, which is an ease-out: ~250ms to land, most of it in the
// first third. MIN_STEP keeps the tail of that curve from crawling a fraction
// of a pixel at a time, and HOLD_FRAMES is how long it then sits on the target
// re-aiming, for the reflow that arrives just after the travel stops.
const REACH = 0.24;
const MIN_STEP = 1.5;
const HOLD_FRAMES = 20;
// A ceiling on the whole run. Browsers round a scroll offset to device pixels,
// so on a fractional DPR the last pixel of the gap can round straight back out
// and never close — and a frame loop that never converges is a frame loop that
// never stops.
const MAX_FRAMES = 120;


function Skeleton() {
  return (
    <div className="flex flex-col gap-[12px] px-[14px] pb-[18px] pt-[12px]">
      <div className="h-[112px] animate-pulse rounded-[18px] bg-[#f1f2f4]" />
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex flex-col gap-[12px]">
          <div className="h-[10px] w-1/2 animate-pulse rounded bg-[#f1f2f4]" />
          <div className="h-[56px] animate-pulse rounded-[14px] bg-[#f1f2f4]" />
          <div className="h-[64px] animate-pulse rounded-[12px] bg-[#f1f2f4]" />
        </div>
      ))}
    </div>
  );
}

export default function MobileItinerary({
  askKaira,
  onViewMap,
  onShare,
  onSettings,
  // Optional: an external "More" host, and PDF download wiring. Absent by
  // default — the sheet below handles More itself and simply omits any row
  // whose handler wasn't supplied.
  onOpenMore = undefined,
  // Charges the lock-in fee — BotApp's `startPriceHold`, the same handler the
  // desktop cart bar's hold ribbon calls. Absent means no hold can be taken,
  // so the card's offer is withheld rather than drawn dead.
  onHold = undefined,
  // The trip card's REPRICE (BotApp's handleReprice) and a fully-paid trip's
  // DOWNLOAD VOUCHER — same handlers the desktop card gets.
  onReprice = undefined,
  isRepricing = false,
  onDownloadVoucher = undefined,
  isDownloadingVoucher = false,
  onDownloadPdf = undefined,
  isDownloadingPdf = false,
  // Booking drawers that need an account ask for one first, as desktop's do.
  onLoginRequired = undefined,
  isBusy = false,
  // { label, itineraryCityId, dayIndex, at } — where Kaira's last change
  // landed. Supplied by BotApp, which hears it from the chat's effect stream.
  change = null,
}) {
  // Select the raw slices, then derive once. Passing buildTripViewModel straight
  // to useSelector would defeat shallowEqual — it mints a fresh { gates, trip,
  // legs, ancillaries } on every call, so every unrelated dispatch anywhere in
  // the store would re-derive the whole trip and re-render every leg. The slice
  // REFERENCES are stable between unrelated dispatches, so comparing those and
  // memoising on them is what actually keeps this cheap.
  const slices = useSelector(
    (s) => ({
      Itinerary: s.Itinerary,
      Stays: s.Stays,
      TransferBookings: s.TransferBookings,
      Cart: s.Cart,
      AncillaryBookings: s.AncillaryBookings,
      ItineraryStatus: s.ItineraryStatus,
      currency: s.currency,
    }),
    shallowEqual,
  );
  const { gates, trip, legs, ancillaries } = useMemo(
    () => buildTripViewModel(slices),
    [slices],
  );

  // The sheet slot and what every row does — shared with the desktop
  // itinerary, which draws the same legs and opens the same sheets.
  const {
    sheet,
    setSheet,
    closeDay,
    closeDetail,
    closeMore,
    ask,
    openChat,
    handleAddToDay,
    handleAddActivityPickup,
    handleOpenStay,
    handleOpenTravel,
    handleOpenExtra,
    handleOpenAncillary,
    handleOpenDayItem,
    handleOpenDay,
  } = useTripActions({ askKaira, onViewMap });

  // Adding or changing a booking: the desktop's booking flows, as bottom
  // sheets. A flow takes over from whichever sheet it was opened from (the
  // detail, the day).
  const beforeDrawer = useCallback(() => setSheet(null), [setSheet]);
  const rows = useBookingDrawers({
    askKaira: ask,
    onLoginRequired,
    beforeOpen: beforeDrawer,
    sheets: true,
  });

  // Opening a row reads it in the detail sheet, whose "Change" opens the same
  // flow as the row's own CHANGE rather than asking Kaira.
  const openStay = (leg) =>
    handleOpenStay(leg, { onChange: () => rows.onChangeStay(leg) });
  const openTravel = (leg, travel) =>
    handleOpenTravel(leg, travel, {
      onChange: () =>
        travel === leg.outboundTravel
          ? rows.onChangeReturn(leg)
          : rows.onChangeTravel(leg),
    });
  const openExtra = (leg, extra) =>
    handleOpenExtra(leg, extra, { onChange: () => rows.onChangeTaxi(leg, extra) });
  const openAncillary = (item) =>
    handleOpenAncillary(item, { onChange: () => rows.onChangeAncillary(item) });
  // Only a booked activity has a booking to change. A place or a restaurant's
  // "Replace with something else" still asks Kaira — there is nothing booked
  // to swap.
  const openDayItem = (leg, day, item) =>
    handleOpenDayItem(
      leg,
      day,
      item,
      item.kind === "booked"
        ? { onChange: () => rows.onChangeActivity(leg, day, item) }
        : undefined,
    );

  // "View Detail" inside a booking flow (the Add Taxi drawer's booked pickup,
  // drop or sightseeing car) — the same sheet, with the same descriptor, its
  // row in the trip opens. See bookingDetailBridge.
  //
  // The flow's own change hands in `onChange`; the sheet then rises over the
  // flow (1610 > its 1501) and Change drops back into it. `onLeave` closes the
  // flow too when the sheet hands over to Kaira.
  const openFromFlowRef = useRef(null);
  openFromFlowRef.current = ({ bookingId, onChange, onLeave }) => {
    const id = String(bookingId);
    for (const leg of legs) {
      const extra = (leg.extras || []).find((x) => String(x?.bookingId) === id);
      if (extra) {
        handleOpenExtra(leg, extra, {
          onChange: onChange || (() => rows.onChangeTaxi(leg, extra)),
          beforeAsk: onLeave,
        });
        return true;
      }
      const travel = [leg.inboundTravel, leg.outboundTravel].find(
        (t) => t?.bookingId && String(t.bookingId) === id,
      );
      if (travel) {
        handleOpenTravel(leg, travel, {
          onChange:
            onChange ||
            (() =>
              travel === leg.outboundTravel
                ? rows.onChangeReturn(leg)
                : rows.onChangeTravel(leg)),
          beforeAsk: onLeave,
        });
        return true;
      }
    }
    return false;
  };
  useEffect(() => {
    const onRequest = (e) => {
      if (openFromFlowRef.current?.(e.detail || {})) e.preventDefault();
    };
    window.addEventListener(OPEN_BOOKING_DETAIL, onRequest);
    return () => window.removeEventListener(OPEN_BOOKING_DETAIL, onRequest);
  }, []);

  const isDay = sheet?.type === "day";
  const isDetail = sheet?.type === "detail";
  const isMore = sheet?.type === "more";
  const rootRef = useRef(null);
  // Teardown for the in-flight chip travel — cancels its frame and drops the
  // gesture listeners that let the user interrupt it (see scrollToAnchor).
  const scrollRunRef = useRef(null);
  const stopScroll = useCallback(() => {
    const stop = scrollRunRef.current;
    scrollRunRef.current = null;
    stop?.();
  }, []);
  // Measured scroll room under the last leg, so its chip can reach the top.
  const [tailHeight, setTailHeight] = useState(0);

  // Kaira can't act on two requests at once — a send made mid-stream is dropped
  // silently by useChat — so the CTAs go quiet while the trip is repricing.
  const disabled = isBusy;

  // Jump to a leg without leaving the page.
  //
  // NOT `scrollIntoView`, and not `scrollTo({behavior:"smooth"})` either.
  //
  //  • `scrollIntoView` moves EVERY scrollable ancestor to get there, and lands
  //    the target flush under the top edge — where the sticky trip card is
  //    already sitting, so the city you tapped arrives underneath the chip you
  //    tapped it with.
  //
  //  • A native smooth scroll is fire-and-forget: there is no event for "it
  //    arrived", the target is fixed at the moment it starts, and the phones
  //    this ships to do not all honour it on the WINDOW. Anything built on top
  //    of it has to guess when the travel ended by watching the offset go
  //    still — and a smooth scroll that has not begun yet is indistinguishable
  //    from one that has finished, which is what turned a chip tap into a hard
  //    jump.
  //
  // So the travel is run here, one frame at a time, and the destination is
  // RE-MEASURED on every one of those frames: each frame closes a fixed
  // fraction of whatever gap is left. That is the same ease-out a native smooth
  // scroll draws, except that a reflow underway while it travels — the browser
  // retracting its address bar, a sticky header changing height, a row settling
  // — is absorbed as it happens rather than corrected afterwards.
  //
  // WHICH scroller depends on the host. On a phone this surface has none of
  // its own: the bot shell lays the trip out in the document so the browser
  // will retract its address bar (see `.app-shell` in styles/globals.css), and
  // the window is the scroller. Inside a pane that scrolls itself — the route
  // sheet, or the desktop column — that pane is. Both are handled below rather
  // than one being a fallback for the other, because the maths differs: a
  // pane's own top is its scroll origin, the window's is 0.
  const scrollToAnchor = useCallback(
    (anchor) => {
      const root = rootRef.current;
      const el = anchor ? root?.querySelector(`#${CSS.escape(anchor)}`) : null;
      if (!el) return;

      // A tap on a second chip abandons the first one's travel.
      stopScroll();

      const pane = scrollParentOf(root);
      const posOf = () => (pane ? pane.scrollTop : window.scrollY);
      const maxOf = () => {
        if (pane) return Math.max(0, pane.scrollHeight - pane.clientHeight);
        const doc = document.scrollingElement || document.documentElement;
        return Math.max(0, doc.scrollHeight - window.innerHeight);
      };
      const moveTo = (y) =>
        pane ? pane.scrollTo(0, y) : window.scrollTo(0, y);

      // Where the leg has to come to rest, in the scroller's own units, as of
      // THIS frame. Clamped to the scroll that actually exists — `tailHeight`
      // below is what makes sure the last city has enough of it.
      const aim = () => {
        const stuck = root.firstElementChild?.getBoundingClientRect().height || 0;
        const frameTop = pane ? pane.getBoundingClientRect().top : 0;
        const error =
          el.getBoundingClientRect().top - frameTop - stuck - ANCHOR_GAP;
        return Math.min(Math.max(posOf() + error, 0), maxOf());
      };

      let raf = 0;
      // The user always wins. A drag or a wheel during the travel drops it on
      // the spot — without this the animation scrolls back against the finger
      // every frame, which is worse than not animating at all.
      const abort = () => stopScroll();
      const stop = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("touchstart", abort);
        window.removeEventListener("wheel", abort);
        window.removeEventListener("keydown", abort);
      };
      scrollRunRef.current = stop;
      window.addEventListener("touchstart", abort, { passive: true });
      window.addEventListener("wheel", abort, { passive: true });
      window.addEventListener("keydown", abort);

      const instant =
        typeof window.matchMedia === "function" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Holding on the target rather than stopping the moment it is reached:
      // the shell can still reflow for a few frames after the travel ends (the
      // address bar finishing its retraction is the common one), and re-aiming
      // through that is the difference between the city cover sitting under the
      // chips and sitting half off the top of the screen.
      let held = 0;
      let frames = 0;
      const frame = () => {
        if (frames++ >= MAX_FRAMES) {
          stopScroll();
          return;
        }
        const from = posOf();
        const gap = aim() - from;
        if (Math.abs(gap) < 1) {
          if (held++ >= HOLD_FRAMES) {
            stopScroll();
            return;
          }
        } else {
          held = 0;
          moveTo(
            instant
              ? from + gap
              : from + Math.sign(gap) * Math.max(Math.abs(gap) * REACH, MIN_STEP),
          );
        }
        raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
    },
    [stopScroll],
  );

  // Drop any in-flight travel when this surface goes away.
  useEffect(() => stopScroll, [stopScroll]);

  // ── Room at the foot of the trip ───────────────────────────────────────────
  // A chip can only bring its city to the top if the page has that much scroll
  // left below it. It often doesn't: the last leg is the short one on a trip
  // that ends with a single night, and the cart bar's padding is nowhere near a
  // screen. Tapping the last chip then moved the trip a few pixels and stopped
  // — indistinguishable, from the traveller's side, from the chip doing
  // nothing.
  //
  // So the exact shortfall is measured and added as a spacer at the end. A trip
  // already long enough gets zero, and the measurement is idempotent: it reads
  // back the scroll range the spacer it already rendered produced, so it
  // settles on the first pass rather than growing on every one.
  // `itineraryReady` is in the deps because the skeleton below renders no root
  // at all: without it the first measurement is taken against a tree that does
  // not exist yet and never retaken.
  const ready = gates.itineraryReady;
  const lastAnchor = legs.length ? legs[legs.length - 1].anchor : null;
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !lastAnchor) {
      setTailHeight(0);
      return undefined;
    }

    let raf = 0;
    const measure = () => {
      raf = 0;
      const el = root.querySelector(`#${CSS.escape(lastAnchor)}`);
      if (!el) return;
      const pane = scrollParentOf(root);
      const doc = document.scrollingElement || document.documentElement;
      const pos = pane ? pane.scrollTop : window.scrollY;
      const frameTop = pane ? pane.getBoundingClientRect().top : 0;
      const stuck = root.firstElementChild?.getBoundingClientRect().height || 0;
      const view = pane ? pane.clientHeight : window.innerHeight;
      // What the chip asks for, against what the page can give.
      const want =
        pos + el.getBoundingClientRect().top - frameTop - stuck - ANCHOR_GAP;
      const have = pane
        ? Math.max(0, pane.scrollHeight - pane.clientHeight)
        : Math.max(0, doc.scrollHeight - window.innerHeight);
      setTailHeight((h) =>
        Math.min(Math.max(0, Math.round(h + want - have)), view),
      );
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };

    schedule();
    const ro = new ResizeObserver(schedule);
    ro.observe(root);
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", schedule);
    };
  }, [lastAnchor, ready]);


  // ── Where Kaira's last change landed ───────────────────────────────────────
  // The effect payload names an itinerary_city_id and (sometimes) a
  // day_by_day_index; resolve those to this surface's own anchor and day key so
  // the trip can scroll to the change and badge the day that moved.
  const changed = useMemo(() => {
    if (!change) return { anchor: null, dayKey: null };
    const leg = change.itineraryCityId
      ? legs.find((l) => l.id === change.itineraryCityId)
      : null;
    if (!leg) return { anchor: null, dayKey: null };
    const day =
      typeof change.dayIndex === "number"
        ? leg.days.find((d) => d.dayIndex === change.dayIndex)
        : null;
    return { anchor: leg.anchor, dayKey: day ? day.key : null };
  }, [change, legs]);

  // Scroll to it. Keyed on `change.at` rather than the anchor so a SECOND
  // change to the same city still scrolls — two edits to Hanoi in a row
  // resolve to the same anchor, and without the timestamp the effect would
  // not re-run and the trip would sit still while the bar claimed something
  // had moved.
  const changeAt = change?.at ?? null;
  useEffect(() => {
    if (!changeAt || !changed.anchor) return undefined;
    // After the sheet has closed and the itinerary has repainted with the new
    // content — scrolling to a row that is about to change height lands in the
    // wrong place.
    const t = setTimeout(() => scrollToAnchor(changed.anchor), 320);
    return () => clearTimeout(t);
  }, [changeAt, changed.anchor, scrollToAnchor]);

  const totalStr = useMemo(() => {
    if (trip.pricesHidden || trip.totalAmount == null) return null;
    return formatMoney(trip.totalAmount, trip.currency);
  }, [trip.pricesHidden, trip.totalAmount, trip.currency]);

  // What the hold costs, on the button face. The card offers the hold only
  // once there is a handler to take it and a fee to name — a strip whose
  // button says "—" is an offer nobody can act on.
  const holdFeeStr = useMemo(
    () =>
      trip.hold.fee > 0
        ? formatMoney(trip.hold.fee, trip.currency)
        : null,
    [trip.hold.fee, trip.currency],
  );
  const showHold = trip.hold.offer && !!onHold && !!holdFeeStr;

  if (!gates.itineraryReady) return <Skeleton />;

  const gapLeg = legs.find((l) => l.showStayGap) || null;

  return (
    <div ref={rootRef} className="font-inter">
      {/* ── Trip card + leg nav — sticky, below the navbar ── */}
      <TripHeader
        title={trip.title}
        paxLabel={trip.paxLabel}
        dateLabel={trip.dateLabel}
        legs={legs}
        onOpenMore={() =>
          onOpenMore ? onOpenMore() : setSheet({ type: "more" })
        }
        onViewMap={onViewMap}
        onLegClick={scrollToAnchor}
      />

      <div className="flex flex-col gap-[11px] px-[14px] pb-[18px] pt-[12px]">
        {/* The one price on this surface — the desktop trip card, shared so
            the phone and desktop carry the same total, hold, expired, held and
            fully-paid states. `wrap` lets Kaira's line run to two lines at
            phone width instead of being cut off. */}
        <DesktopTripCard
          trip={trip}
          isDraft={gates.isDraft}
          totalStr={totalStr}
          holdFeeStr={showHold ? holdFeeStr : null}
          onHold={onHold}
          onReprice={onReprice}
          isRepricing={isRepricing}
          onDownloadVoucher={onDownloadVoucher}
          isDownloadingVoucher={isDownloadingVoucher}
          gapLeg={gapLeg}
          onFixGap={() => gapLeg && rows.onChangeStay(gapLeg)}
          disabled={disabled}
          wrap
        />

        {legs.map((leg) => (
          <LegSection
            key={leg.id}
            leg={leg}
            disabled={disabled}
            changedDayKey={changed.dayKey}
            onChangeStay={rows.onChangeStay}
            onChangeTravel={rows.onChangeTravel}
            onAddTravel={rows.onAddTravel}
            onOpenTravel={openTravel}
            onOpenStay={openStay}
            onOpenDay={handleOpenDay}
            onOpenDayItem={openDayItem}
            onAddToDay={handleAddToDay}
            onAddActivityPickup={handleAddActivityPickup}
            onAddTaxi={rows.onAddTaxi}
            onAddJourneyTaxi={rows.onAddJourneyTaxi}
            onOpenExtra={openExtra}
            onChangeReturn={rows.onChangeReturn}
            onAddReturn={rows.onAddReturn}
          />
        ))}

        {/* A card each, the way desktop lists them — a visa and an eSIM are two
            bookings, and one card reading "VISA × 1 · ESIM · INCLUDED" made the
            traveller open a sheet to find out what either of them actually was.
            The group keeps the "before you fly" framing as its kicker, which is
            the only thing the merged card was really saying. */}
        {ancillaries.items.length > 0 && (
          <div className="flex flex-col gap-[10px]">
            <div className="font-mono text-[10px] tracking-[0.08em] text-[#8a93a6]">
              BEFORE YOU FLY
            </div>
            {ancillaries.items.map((item) => {
              const isEsim = item.type === "eSIM";
              return (
                <div
                  key={item.id}
                  style={T.card}
                  className="flex items-center gap-[11px] p-[13px]"
                >
                  {/* Neutral tile and grey glyph, not the transfers' blue —
                      nothing here is a journey. */}
                  <span
                    className="flex h-[28px] w-[28px] flex-none items-center justify-center rounded-[6px]"
                    style={{ background: "#eef0f4" }}
                    aria-hidden
                  >
                    {isEsim ? (
                      <FaSimCard size={14} color="#6b7280" />
                    ) : (
                      <FaPassport size={14} color="#6b7280" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    {/* The supplier's own name for it — "Vietnam e-Visa", the
                        eSIM's plan title. A booking with none falls back to
                        what kind it is rather than to a blank line. */}
                    <div className="truncate text-[13.5px] font-[700] text-[#0b1220]">
                      {item.name || (isEsim ? "eSIM" : "Visa")}
                    </div>
                    <div className="mt-[4px] truncate font-mono text-[10px] tracking-[0.06em] text-[#8a93a6]">
                      {[isEsim ? "ESIM" : "VISA", "INCLUDED"].join(" · ")}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => openAncillary(item)}
                    style={{ border: 0, background: "none", padding: 0 }}
                    className="flex-none font-mono text-[10px] tracking-[0.06em] text-[#6b7280]"
                  >
                    VIEW ›
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* The scroll room the last city's chip needs — measured, and 0 on a trip
          that is long enough already. It carries no paint of its own, so on the
          trips that do need it the page simply ends in the white ground it
          already ends in. */}
      {tailHeight > 0 ? (
        <div style={{ height: tailHeight }} aria-hidden />
      ) : null}

      {/* One slot, one sheet. Opening an item from the day REPLACES it —
          `isDay` goes false the moment `sheet.type` becomes "detail". */}
      <DaySheet
        open={isDay}
        onClose={closeDay}
        leg={sheet?.leg}
        day={sheet?.day}
        disabled={disabled}
        onAskKaira={ask}
        onOpenItem={(item) => openDayItem(sheet.leg, sheet.day, item)}
      />

      <DetailSheet
        open={isDetail}
        onClose={closeDetail}
        detail={sheet?.detail}
        disabled={disabled}
        onAskKaira={(message, contextLabel) => {
          // Opened from inside a booking flow: that flow goes too.
          if (message) sheet?.detail?.beforeAsk?.();
          ask(message, contextLabel);
        }}
      />

      {/* The pickers useBookingDrawers renders itself (the visa / eSIM change),
          as sheets. The rest of its flows are the ItineraryContainer's. */}
      {rows.drawers}

      <MoreSheet
        open={isMore}
        onClose={closeMore}
        onViewMap={onViewMap}
        onDownloadPdf={onDownloadPdf}
        onShare={onShare}
        onSettings={onSettings}
        isDownloadingPdf={isDownloadingPdf}
        onOpenChat={openChat}
      />

    </div>
  );
}

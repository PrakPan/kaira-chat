import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { FaPassport, FaSimCard } from "react-icons/fa";

import buildTripViewModel from "../../../lib/tripViewModel";
import { formatMoney } from "../../../services/money";
import { SheetHostContext } from "../common/components/Sheet";
import LegSection from "../mobileItinerary/LegSection";
import DaySheet from "../mobileItinerary/sheets/DaySheet";
import useTripActions from "../mobileItinerary/useTripActions";
import useDesktopDrawers from "./useDesktopDrawers";
import { TRIP_DAY_ACTION, dayTurn } from "./ChatDayWidget";
import * as T from "../mobileItinerary/designTokens";
import DesktopTripHeader from "./DesktopTripHeader";
import DesktopTripCard from "./DesktopTripCard";
import { GUTTER } from "./desktopTokens";

// ─────────────────────────────────────────────────────────────────────────────
//  DesktopItinerary — the itinerary pane of the desktop chat page, as "Kaira E
//  Desktop" draws it. The chat pane beside it is not this component's.
//
//    header   trip name, pax/dates, More, leg chips, Map      (never scrolls)
//    body     trip-total card, the legs, before you fly        (the scroller)
//    footer   the cart bar, handed in by BotApp                (never scrolls)
//
//  The trip is ONE package, as on the phone (MobileItinerary): the only amount
//  is the trip total. The legs are the phone's own LegSection.
//
//  What a row DOES is desktop's own, though: booking details and every change
//  or add flow open the same drawers the old desktop day-by-day opened (see
//  useDesktopDrawers), not the phone's detail sheet and Kaira hand-off. The
//  exceptions are the CTAs that say "ask Kaira" (an empty stay's "ASK KAIRA ›",
//  a day at leisure): those ask her in the chat, with the phone's prompts.
//
//  The full day ("FULL DAY ›") plays into the CHAT as a short exchange: the
//  user asking "Help me plan Day 1 in Tokyo", Kaira answering, and the day as
//  a widget under her answer (`onShowDayInChat`, ChatDayWidget's dayTurn), the
//  way her hotel and activity lists arrive, so the trip stays in view beside
//  it. Its taps come back here as
//  TRIP_DAY_ACTION: an item opens the same drawer the trip's row does, and
//  its add button asks Kaira, as the phone's does. With no live chat to put it
//  in, it falls back to the sheet INSIDE this pane (see SheetHostContext in
//  Sheet.jsx).
// ─────────────────────────────────────────────────────────────────────────────

// How far below the top of the scroller a leg comes to rest.
const ANCHOR_GAP = 8;

// Day 1's card. Not the old tree's "bot-itinerary-day-1": that one is still in
// the DOM on desktop, hidden with the ItineraryContainer that renders it.
export const DESKTOP_DAY_ONE_ID = "desktop-itinerary-day-1";

const MenuGlyph = ({ children }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#445069"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="flex-none"
    aria-hidden
  >
    {children}
  </svg>
);

const DownloadGlyph = () => (
  <MenuGlyph>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <path d="M7 10l5 5 5-5" />
    <path d="M12 15V3" />
  </MenuGlyph>
);

const ShareGlyph = () => (
  <MenuGlyph>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
  </MenuGlyph>
);

const SettingsGlyph = () => (
  <MenuGlyph>
    <line x1="21" y1="4" x2="14" y2="4" />
    <line x1="10" y1="4" x2="3" y2="4" />
    <line x1="21" y1="12" x2="12" y2="12" />
    <line x1="8" y1="12" x2="3" y2="12" />
    <line x1="21" y1="20" x2="16" y2="20" />
    <line x1="12" y1="20" x2="3" y2="20" />
    <line x1="14" y1="2" x2="14" y2="6" />
    <line x1="8" y1="10" x2="8" y2="14" />
    <line x1="16" y1="18" x2="16" y2="22" />
  </MenuGlyph>
);

function MenuItem({ Glyph, label, onClick, disabled }) {
  // The design's hover wash, held in state and painted inline. A `hover:`
  // class can't do it here: Bootstrap's `.bg-transparent` is `!important`, and
  // any background class this button needs to start from outranks the hover.
  const [lit, setLit] = useState(false);
  const on = () => setLit(true);
  const off = () => setLit(false);
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={on}
      onMouseLeave={off}
      onFocus={on}
      onBlur={off}
      style={{
        border: 0,
        borderRadius: 10,
        boxShadow: "none",
        padding: "9px 10px",
        background: lit && !disabled ? "#f4f3ec" : "transparent",
        cursor: disabled ? "default" : "pointer",
      }}
      className="flex w-full items-center gap-[10px] text-left outline-none disabled:opacity-50"
    >
      <Glyph />
      <span className="min-w-0 flex-1 text-[12.5px] font-[600] text-[#0b1220]">{label}</span>
    </button>
  );
}

/**
 * "More" — the design's dropdown, not the phone's sheet: PDF, share and trip
 * settings. A row whose handler wasn't supplied is simply not there.
 */
function MoreMenu({ onClose, onDownloadPdf, isDownloadingPdf, onShare, onSettings }) {
  const run = (fn) => () => {
    onClose();
    fn?.();
  };
  return (
    <>
      {/* The design's scrim, the same one its sheets raise: the whole pane
          dims while the menu is open, and a click anywhere on it closes the
          menu. Above the footer (z-20), below the sheets. */}
      <button
        type="button"
        aria-label="Close menu"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 cursor-pointer"
        style={{
          zIndex: 30,
          border: 0,
          borderRadius: 0,
          padding: 0,
          background: "rgba(11,18,32,0.22)",
          boxShadow: "none",
        }}
      />
      <div
        role="menu"
        className="ttw-menu-in absolute flex flex-col"
        style={{
          zIndex: 31,
          top: 64,
          // 14px in from the pane's edge, just outside the More button above it.
          right: `calc(${GUTTER} - 10px)`,
          width: 224,
          background: "#ffffff",
          border: "1px solid #ececec",
          borderRadius: 14,
          padding: 6,
          boxShadow: "0 30px 80px -30px rgba(11,18,32,.3)",
        }}
      >
        {onDownloadPdf ? (
          <MenuItem
            Glyph={DownloadGlyph}
            label={isDownloadingPdf ? "Preparing PDF…" : "Download as PDF"}
            disabled={isDownloadingPdf}
            onClick={run(onDownloadPdf)}
          />
        ) : null}
        {onShare ? (
          <MenuItem Glyph={ShareGlyph} label="Share the trip" onClick={run(onShare)} />
        ) : null}
        {onSettings ? (
          <>
            <div style={{ height: 1, background: "#ececec", margin: "5px 8px" }} />
            <MenuItem Glyph={SettingsGlyph} label="Trip settings" onClick={run(onSettings)} />
          </>
        ) : null}
      </div>
    </>
  );
}

/** One "Before you fly" card — the design's, a round glyph tile and VIEW ›. */
function AncillaryCard({ item, title, meta, onOpen }) {
  const isEsim = item.type === "eSIM";
  const Icon = isEsim ? FaSimCard : FaPassport;
  return (
    <div style={T.card} className="flex items-center gap-[10px] p-[12px]">
      <span
        className="grid h-[26px] w-[26px] flex-none place-items-center rounded-full"
        style={{ background: T.PAPER_2, color: "#445069" }}
        aria-hidden
      >
        <Icon size={13} color="currentColor" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[12.5px] font-[700] text-[#0b1220]">{title}</div>
        <div className="mt-[4px] truncate font-mono text-[8.5px] tracking-[0.06em] text-[#8a93a6]">
          {meta}
        </div>
      </div>
      <button
        type="button"
        onClick={onOpen}
        style={T.bare}
        className="flex-none p-0 font-mono text-[8.5px] tracking-[0.06em] text-[#6b7280]"
      >
        VIEW ›
      </button>
    </div>
  );
}

/**
 * The design has ONE "Before you fly" card. With one ancillary on the trip that
 * is exactly what shows; with several, each is its own card under a "BEFORE
 * YOU FLY" kicker — a visa and an eSIM are two bookings with their own detail,
 * and one card could only open one of them.
 */
function BeforeYouFly({ items, onOpen }) {
  if (!items.length) return null;
  const kind = (item) => (item.type === "eSIM" ? "ESIM" : "VISA");

  if (items.length === 1) {
    const item = items[0];
    return (
      <AncillaryCard
        item={item}
        title="Before you fly"
        meta={[item.name ? String(item.name).toUpperCase() : kind(item), "INCLUDED"].join(" · ")}
        onOpen={() => onOpen(item)}
      />
    );
  }

  return (
    <div className="flex flex-col gap-[11px]">
      <div className="font-mono text-[8.5px] tracking-[0.08em] text-[#8a93a6]">BEFORE YOU FLY</div>
      {items.map((item) => (
        <AncillaryCard
          key={item.id}
          item={item}
          title={item.name || (item.type === "eSIM" ? "eSIM" : "Visa")}
          meta={`${kind(item)} · INCLUDED`}
          onOpen={() => onOpen(item)}
        />
      ))}
    </div>
  );
}

function HeaderSkeleton() {
  return (
    <div
      className="flex flex-none flex-col gap-[9px] bg-white"
      style={{ borderBottom: "1px solid #ececec", padding: `12px ${GUTTER} 10px` }}
    >
      <div className="flex items-center gap-[10px]">
        <div className="h-[30px] w-[30px] animate-pulse rounded-[9px] bg-[#f1f2f4]" />
        <div className="flex min-w-0 flex-1 flex-col gap-[6px]">
          <div className="h-[11px] w-1/2 animate-pulse rounded bg-[#f1f2f4]" />
          <div className="h-[8px] w-1/3 animate-pulse rounded bg-[#f1f2f4]" />
        </div>
      </div>
      <div className="flex gap-[5px]">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-[24px] w-[72px] animate-pulse rounded-full bg-[#f1f2f4]" />
        ))}
      </div>
    </div>
  );
}

function BodySkeleton() {
  return (
    <div className="flex flex-col gap-[11px]" style={{ padding: `16px ${GUTTER} 24px` }}>
      <div className="h-[112px] animate-pulse rounded-[18px] bg-[#f1f2f4]" />
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex flex-col gap-[11px]">
          <div className="h-[56px] animate-pulse rounded-[14px] bg-[#f1f2f4]" />
          <div className="h-[53px] animate-pulse rounded-[18px] bg-[#f1f2f4]" />
          <div className="h-[64px] animate-pulse rounded-[12px] bg-[#f1f2f4]" />
        </div>
      ))}
    </div>
  );
}

export default function DesktopItinerary({
  askKaira,
  onViewMap,
  // Raises the login prompt — every drawer that needs an account asks for one
  // first, as the old day-by-day did.
  onLoginRequired = undefined,
  // Plays a day's turn into the chat (a ChatLocalTurnFn turn, from dayTurn).
  // Returns false when there's no chat to put it in, and the day opens in the
  // sheet here instead.
  onShowDayInChat = undefined,
  // Charges the lock-in fee (BotApp's startPriceHold). Absent means no hold can
  // be taken, so the card's offer is withheld rather than drawn dead.
  onHold = undefined,
  onShare = undefined,
  onSettings = undefined,
  onDownloadPdf = undefined,
  isDownloadingPdf = false,
  isBusy = false,
  // Archived V1 trips carry no cart: the footer shows the price they were sold
  // at, and a trip card with nothing to total is left out.
  isArchive = false,
  // { label, itineraryCityId, dayIndex, at } — where Kaira's last change
  // landed, from the chat's effect stream.
  change = null,
  // The cart bar (BotApp's BottomCTABar), pinned under the scroller.
  footer = null,
  // Stands in for the body while the host has its own loading state to show
  // (the tailored-form shimmer).
  placeholder = null,
}) {
  // Raw slices, then derive once — same reason as MobileItinerary: the view
  // model is a fresh object every call, so it can't go through useSelector.
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

  // The day sheet's slot, the Kaira funnel, and the row actions that are
  // Kaira's on desktop too: every CTA that says "ask Kaira" (an empty stay's
  // "ASK KAIRA ›", a day at leisure) and an activity's missing hotel pickup.
  // They send the phone's own prompts, and the chat puts them at the top of
  // its pane.
  const {
    sheet,
    setSheet,
    closeDay,
    ask,
    handleChangeStay: askStay,
    handleAddToDay: askAddToDay,
    handleAddActivityPickup,
    handleOpenDay,
  } = useTripActions({ askKaira, onViewMap });

  const isDay = sheet?.type === "day";

  // The layer every sheet in this pane portals into. State, not a ref: the
  // context has to change when it mounts, so a sheet already asked to open
  // renders the moment there is somewhere to put it.
  const [sheetLayer, setSheetLayer] = useState(null);
  const sheetHost = useMemo(() => ({ el: sheetLayer }), [sheetLayer]);

  const [moreOpen, setMoreOpen] = useState(false);
  const closeMore = useCallback(() => setMoreOpen(false), []);

  // Every other row action: the old desktop drawers. A drawer takes over from
  // the More menu and from the day sheet (when the day is in one).
  const beforeDrawer = useCallback(() => {
    setSheet(null);
    setMoreOpen(false);
  }, [setSheet]);
  const rows = useDesktopDrawers({
    askKaira: ask,
    onLoginRequired,
    beforeOpen: beforeDrawer,
  });

  // "FULL DAY ›": into the chat when there is one, else the sheet here.
  const openDay = useCallback(
    (leg, day) => {
      if (onShowDayInChat?.(dayTurn(leg, day))) return;
      handleOpenDay(leg, day);
    },
    [onShowDayInChat, handleOpenDay],
  );

  // The day in the chat, tapped. Read through refs: the listener stays put
  // while `rows` is rebuilt every render.
  const rowsRef = useRef(rows);
  rowsRef.current = rows;
  const askRef = useRef(ask);
  askRef.current = ask;
  const busyRef = useRef(isBusy);
  busyRef.current = isBusy;
  useEffect(() => {
    const onAction = (e) => {
      const { action, leg, day, item, message, contextLabel } = e.detail || {};
      if (!leg || !day) return;
      if (action === "openItem" && item) rowsRef.current.onOpenDayItem(leg, day, item);
      // The widget greys its add button out while the trip reprices; this is
      // the same rule for a tap that landed on the frame it changed.
      if (action === "askKaira" && message && !busyRef.current) {
        askRef.current(message, contextLabel);
      }
    };
    window.addEventListener(TRIP_DAY_ACTION, onAction);
    return () => window.removeEventListener(TRIP_DAY_ACTION, onAction);
  }, []);
  const rootRef = useRef(null);
  useEffect(() => {
    if (!moreOpen) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setMoreOpen(false);
    };
    // The scrim closes the menu from anywhere in this pane; this closes it
    // from anywhere else — the chat, the sidebar — as the design's
    // screen-wide click-away does.
    const onPointerDown = (e) => {
      if (!rootRef.current?.contains(e.target)) setMoreOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [moreOpen]);

  // Kaira can't act on two requests at once, so the CTAs go quiet while the
  // trip is repricing.
  const disabled = isBusy;

  const scrollerRef = useRef(null);
  const contentRef = useRef(null);

  // Bring a leg to the top of the pane. The pane is an ordinary element
  // scroller on a desktop browser, so the native smooth scroll is enough here —
  // none of the phone's address-bar reflow that MobileItinerary has to chase.
  const scrollToAnchor = useCallback((anchor) => {
    const sc = scrollerRef.current;
    const el = anchor ? contentRef.current?.querySelector(`#${CSS.escape(anchor)}`) : null;
    if (!sc || !el) return;
    const top =
      sc.scrollTop + el.getBoundingClientRect().top - sc.getBoundingClientRect().top - ANCHOR_GAP;
    const reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    sc.scrollTo({ top: Math.max(0, top), behavior: reduce ? "auto" : "smooth" });
  }, []);

  // ── Room at the foot of the trip ───────────────────────────────────────────
  // The last city is usually a short one, and without room below it its chip
  // can only scroll the pane to the bottom — which reads as the chip doing
  // nothing. The exact shortfall is measured and added as a spacer; a trip
  // long enough already gets zero. Idempotent, like the phone's: it reads back
  // the range its own spacer produced, so it settles in one pass.
  const [tailHeight, setTailHeight] = useState(0);
  const ready = gates.itineraryReady;
  const hasPlaceholder = !!placeholder;
  const lastAnchor = legs.length ? legs[legs.length - 1].anchor : null;
  useEffect(() => {
    const sc = scrollerRef.current;
    const content = contentRef.current;
    if (!sc || !content || !lastAnchor) {
      setTailHeight(0);
      return undefined;
    }
    let raf = 0;
    const measure = () => {
      raf = 0;
      const el = content.querySelector(`#${CSS.escape(lastAnchor)}`);
      if (!el) return;
      const want =
        sc.scrollTop + el.getBoundingClientRect().top - sc.getBoundingClientRect().top - ANCHOR_GAP;
      const have = Math.max(0, sc.scrollHeight - sc.clientHeight);
      setTailHeight((h) =>
        Math.min(Math.max(0, Math.round(h + want - have)), sc.clientHeight),
      );
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    schedule();
    const ro = new ResizeObserver(schedule);
    ro.observe(content);
    ro.observe(sc);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [lastAnchor, ready, hasPlaceholder]);

  // ── Where Kaira's last change landed ───────────────────────────────────────
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

  // Keyed on the change's timestamp, so a second change to the same city still
  // scrolls. Delayed past the repaint the change itself causes.
  const changeAt = change?.at ?? null;
  useEffect(() => {
    if (!changeAt || !changed.anchor) return undefined;
    const t = setTimeout(() => scrollToAnchor(changed.anchor), 320);
    return () => clearTimeout(t);
  }, [changeAt, changed.anchor, scrollToAnchor]);

  const totalStr = useMemo(() => {
    if (trip.pricesHidden || trip.totalAmount == null) return null;
    return formatMoney(trip.totalAmount, trip.currency);
  }, [trip.pricesHidden, trip.totalAmount, trip.currency]);

  const holdFeeStr = useMemo(
    () => (trip.hold.fee > 0 ? formatMoney(trip.hold.fee, trip.currency) : null),
    [trip.hold.fee, trip.currency],
  );
  const showHold = trip.hold.offer && !!onHold && !!holdFeeStr;

  const gapLeg = legs.find((l) => l.showStayGap) || null;

  return (
    <SheetHostContext.Provider value={sheetHost}>
      <div
        ref={rootRef}
        // `isolation` keeps the sheets' 1600-range z-indices inside this pane,
        // so they stack over the footer here and never over the page's own
        // portalled drawers and modals.
        className="relative flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-white font-inter leading-[normal]"
        style={{ isolation: "isolate" }}
      >
        {ready ? (
          <DesktopTripHeader
            title={trip.title}
            paxLabel={trip.paxLabel}
            dateLabel={trip.dateLabel}
            legs={legs}
            onOpenMore={() => setMoreOpen((open) => !open)}
            moreOpen={moreOpen}
            onViewMap={onViewMap}
            onLegClick={scrollToAnchor}
          />
        ) : (
          <HeaderSkeleton />
        )}

        <div
          ref={scrollerRef}
          className="min-h-0 flex-1 overflow-y-auto"
          style={{ scrollbarWidth: "none" }}
        >
          {placeholder ? (
            placeholder
          ) : !ready ? (
            <BodySkeleton />
          ) : (
            <div
              ref={contentRef}
              className="flex flex-col gap-[11px]"
              style={{ padding: `16px ${GUTTER} 24px` }}
            >
              {!isArchive ? (
                <DesktopTripCard
                  trip={trip}
                  isDraft={gates.isDraft}
                  totalStr={totalStr}
                  holdFeeStr={showHold ? holdFeeStr : null}
                  onHold={onHold}
                  gapLeg={gapLeg}
                  onFixGap={() => gapLeg && rows.onChangeStay(gapLeg)}
                  disabled={disabled}
                />
              ) : null}

              {legs.map((leg, i) => (
                <LegSection
                  key={leg.id}
                  leg={leg}
                  // What the chat's "View itinerary" CTA scrolls to and flashes
                  // (BotApp's handleViewItinerary).
                  firstDayId={i === 0 ? DESKTOP_DAY_ONE_ID : null}
                  disabled={disabled}
                  changedDayKey={changed.dayKey}
                  // The stay card, "Add a stay" included, opens the old
                  // hotel drawer; only the empty stay's "ASK KAIRA ›" asks her.
                  onChangeStay={rows.onChangeStay}
                  onAskStay={askStay}
                  onChangeTravel={rows.onChangeTravel}
                  onAddTravel={rows.onAddTravel}
                  onOpenTravel={rows.onOpenTravel}
                  onOpenStay={rows.onOpenStay}
                  onOpenDay={openDay}
                  onOpenDayItem={rows.onOpenDayItem}
                  onAddToDay={askAddToDay}
                  onAddActivityPickup={handleAddActivityPickup}
                  onAddTaxi={rows.onAddTaxi}
                  onAddJourneyTaxi={rows.onAddJourneyTaxi}
                  onOpenExtra={rows.onOpenExtra}
                  onChangeReturn={rows.onChangeReturn}
                  onAddReturn={rows.onAddReturn}
                />
              ))}

              <BeforeYouFly items={ancillaries.items} onOpen={rows.onOpenAncillary} />
            </div>
          )}
          {tailHeight > 0 && !placeholder && ready ? (
            <div style={{ height: tailHeight }} aria-hidden />
          ) : null}
        </div>

        {footer}

        {moreOpen ? (
          <MoreMenu
            onClose={closeMore}
            onDownloadPdf={onDownloadPdf}
            isDownloadingPdf={isDownloadingPdf}
            onShare={onShare}
            onSettings={onSettings}
          />
        ) : null}

        {/* The full day, when there's no chat to put it in. An item in it
            opens its old detail drawer and its add button asks Kaira, as
            they do from the chat. */}
        <DaySheet
          open={isDay}
          onClose={closeDay}
          leg={sheet?.leg}
          day={sheet?.day}
          disabled={disabled}
          onAskKaira={ask}
          onOpenItem={(item) => rows.onOpenDayItem(sheet.leg, sheet.day, item)}
        />

        {/* The drawers the old UI kept in local state (see useDesktopDrawers). */}
        {rows.drawers}

        {/* The sheet host. Above the footer and the More menu; empty and
            click-through until a sheet portals into it. */}
        <div
          ref={setSheetLayer}
          className="pointer-events-none absolute inset-0"
          style={{ zIndex: 40 }}
        />
      </div>
    </SheetHostContext.Provider>
  );
}

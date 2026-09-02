import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
// Font Awesome, like the transfer glyphs in modeAccent.js — one icon family
// across the surface, so a passport doesn't arrive drawn at a different weight
// from the car two rows above it.
import { FaPassport, FaSimCard } from "react-icons/fa";

import buildTripViewModel, { mediaUrlFromKey } from "../../../lib/tripViewModel";
import { formatMoney } from "../../../services/money";
import LegSection from "./LegSection";
import DaySheet from "./sheets/DaySheet";
import MoreSheet from "./sheets/MoreSheet";
import DetailSheet from "./sheets/DetailSheet";
import prompts from "./kairaPrompts";
import * as T from "./designTokens";
import TripHeader from "./TripHeader";
import getModeAccent from "../common/components/bookingDetail/modeAccent";

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
//   2. EVERY CHANGE GOES THROUGH KAIRA. There is no edit drawer, no search
//      modal, no inline picker. "Change", "Add" and "Fix" all say something to
//      Kaira and hand the conversation over. That keeps one mental model
//      ("ask, and she does it") instead of a different affordance per booking
//      type, and it means the assistant always knows what the user just did.
//
//  Structural constraints from the host pane (BotApp's MobileLayout):
//   • NO inner vertical scroller — the pane itself is the scroller, and its
//     scroll drives the navbar hide/condense.
//   • NO position:fixed children — on iOS a fixed descendant of a
//     -webkit-overflow-scrolling:touch pane anchors to the scrolled content.
//     Sheets are fine: they portal out to #modal-portal.
//   • Sticky headers must use top:0 and stay under z-40 (the navbar).
// ─────────────────────────────────────────────────────────────────────────────

const ShieldCheck = () => (
  <svg width="26" height="33" viewBox="0 0 23 30" fill="none" className="flex-none" aria-hidden>
    <path
      d="M11.33 29.75L1.13 22.1A2.9 2.9 0 010 19.83V2.83A2.83 2.83 0 012.83 0h17a2.83 2.83 0 012.84 2.83v17a2.9 2.9 0 01-1.14 2.27l-10.2 7.65zm0-3.54l8.5-6.38V2.83H2.83v17l8.5 6.38zm-1.49-7.79l8-8-1.98-2.06-6.02 6.02-2.98-2.97-2.05 1.98 5.03 5.03z"
      fill="#AD5BE7"
    />
  </svg>
);

// The stay carries an image KEY, but the detail sheet paints it as a CSS
// background and needs a URL — resized, because a hotel hero is a 54px
// thumbnail here and shipping the original is what the media resizer exists to
// avoid. The row's own (smaller) thumbnail URL comes off the view model.
const imageUrlFromKey = (key) => mediaUrlFromKey(key, 160);

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
  onDownloadPdf = undefined,
  isDownloadingPdf = false,
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

  // ONE sheet slot, exactly as the design models it (`sheet: 'day' | 'detail'
  // | 'more'`). Opening a day item REPLACES the day sheet rather than stacking
  // on top of it: two sheets deep, the one underneath is still showing its own
  // header and close button, so there are two × buttons on screen and no way
  // to tell which one dismisses what.
  //
  //   { type: "day",    leg, day }
  //   { type: "detail", detail }
  //   { type: "more" }
  const [sheet, setSheet] = useState(null);

  // Closing is per-sheet, and it MUST check that the sheet asking to close is
  // still the one on screen.
  //
  // Drawer fires `onHide` 100ms AFTER its `show` goes false (Drawer.js — it
  // waits out the slide). Swapping day → detail sets show=false on the day
  // sheet, so 100ms later the DAY sheet's own onHide arrives — by which time
  // the slot already holds the detail. An unguarded setSheet(null) there wipes
  // the sheet that just opened, which is exactly "the day sheet closes and
  // nothing opens".
  //
  // The functional updater is what makes the guard reliable: it reads the
  // CURRENT slot at apply time, not the value captured when the callback was
  // created.
  const closeIf = useCallback(
    (type) => () => setSheet((cur) => (cur?.type === type ? null : cur)),
    [],
  );
  const closeDay = useMemo(() => closeIf("day"), [closeIf]);
  const closeDetail = useMemo(() => closeIf("detail"), [closeIf]);
  const closeMore = useMemo(() => closeIf("more"), [closeIf]);
  const isDay = sheet?.type === "day";
  const isDetail = sheet?.type === "detail";
  const isMore = sheet?.type === "more";
  const rootRef = useRef(null);

  // Kaira can't act on two requests at once — a send made mid-stream is dropped
  // silently by useChat — so the CTAs go quiet while the trip is repricing.
  const disabled = isBusy;

  // The single funnel for every "Change" / "Add" / "Fix" / "Remove" on this
  // surface — so closing the sheets belongs here rather than in each button.
  //
  // This is not cosmetic. The sheets portal out to #modal-portal at z-1600+,
  // while Kaira's sheet lives inside the layout pane well below that. A sheet
  // left open doesn't merely look wrong: it covers the very reply you just
  // asked for. Sheets are stacked (detail opens over day), so all of them go.
  const ask = useCallback(
    (message, contextLabel) => {
      if (!message) return;
      setSheet(null);
      // The second argument is what Kaira's sheet shows as its "About …" chip.
      // A request fired from a row arrives in the chat as a bare sentence, and
      // three messages later nothing says which row started it.
      askKaira?.(message, contextLabel || null);
    },
    [askKaira],
  );

  const handleChangeStay = useCallback(
    (leg) =>
      ask(
        leg.stay ? prompts.changeStay(leg.city) : prompts.addStay(leg.city),
        `${leg.city} stay · ${leg.datesLabel || ""}`.trim(),
      ),
    [ask],
  );

  const handleChangeTravel = useCallback(
    (leg) =>
      ask(
        prompts.changeTransfer(leg.city),
        leg.inboundTravel?.title || `Travel into ${leg.city}`,
      ),
    [ask],
  );

  const handleChangeReturn = useCallback(
    (leg) =>
      ask(
        prompts.changeReturn(leg.outboundTravel?.destName || "home"),
        leg.outboundTravel?.title || "Flight home",
      ),
    [ask],
  );

  // ── The legs with nothing booked on them ───────────────────────────────────
  // A route slot the trip claims and nothing fills. There is no detail sheet
  // to open on a booking that doesn't exist, so unlike every other travel row
  // these go straight to Kaira — the only party who can put something there.
  const handleAddTravel = useCallback(
    (leg) =>
      ask(
        prompts.addTransfer(leg.travelGap?.fromCity, leg.city),
        `Travel into ${leg.city}`,
      ),
    [ask],
  );

  const handleAddReturn = useCallback(
    (leg) =>
      ask(
        prompts.addTransfer(leg.city, leg.outboundGap?.destName || "home"),
        `Travel home from ${leg.city}`,
      ),
    [ask],
  );

  const handleAddTaxi = useCallback(
    (leg) =>
      ask(
        leg.extras.length > 0
          ? prompts.changeTaxi(leg.city)
          : prompts.addTaxi(leg.city),
        `Taxi in ${leg.city}`,
      ),
    [ask],
  );

  // ── Opening a row ──────────────────────────────────────────────────────────
  // The design opens a DETAIL SHEET here, it does not ask Kaira. That
  // distinction is the whole point: reading about a booking is something the
  // app already knows the answer to, and routing it through the chat put a
  // question in the conversation that the trip could answer itself — then made
  // the user wait for a reply to read their own hotel's name back to them.
  //
  // CHANGING is still Kaira's, from the sheet's footer.

  const handleOpenStay = useCallback(
    (leg) => {
      if (!leg.stay) return;
      setSheet({ type: "detail", detail: {
        kind: `STAY · ${String(leg.city).toUpperCase()}`,
        contextLabel: `${leg.city} stay · ${leg.datesLabel || ""}`.trim(),
        name: leg.stay.name,
        meta: leg.stay.meta,
        imageUrl: imageUrlFromKey(leg.stay.imageKey),
        // The real hotel — photos, rooms, facilities, location, cancellation —
        // off /bookings/accommodation/<id>/, exactly as desktop reads it. The
        // blurb and facts below stay as the fallback for a stay with no id.
        live: leg.stay.bookingId
          ? { kind: "stay", bookingId: leg.stay.bookingId }
          : null,
        blurb:
          "Where you sleep in this city. Check-in and check-out times are on your voucher.",
        facts: [
          { k: "CITY", v: leg.city },
          { k: "DATES", v: leg.datesLabel },
          {
            k: "NIGHTS",
            v: leg.nights ? String(leg.nights) : null,
          },
          { k: "STATUS", v: "Quoted, price held" },
        ],
        hasMap: true,
        onOpenMap: onViewMap,
        canChange: true,
        changeLabel: "Change stay",
        changeMessage: prompts.changeStay(leg.city),
        },
      });
    },
    [onViewMap],
  );

  const handleOpenTravel = useCallback(
    (leg, travel) =>
      setSheet({ type: "detail", detail: {
        kind: `${String(travel.modeLabel || "TRAVEL").toUpperCase()} · ${String(
          leg.city,
        ).toUpperCase()}`,
        name: travel.title,
        meta: travel.meta,
        contextLabel: travel.title,
        // A journey has no photo. It carries the same run of mode glyphs its
        // row does — one for a plain transfer, "car › plane" for a combo — in
        // the transfer blue this surface draws every journey in. Without it the
        // header opened on an empty grey tile.
        iconKeys: travel.glyphKeys?.length
          ? travel.glyphKeys
          : [travel.modeKey],
        iconColor: "#1a4fd6",
        // A P1 draft leg is a statement about the route with no booking behind
        // it — there is nothing to fetch, so it keeps the described fallback.
        live: travel.bookingId
          ? {
              kind: "transfer",
              bookingId: travel.bookingId,
              bookingType: travel.bookingType,
              combo: travel.isCombo,
              isSightseeing: travel.transferType === "sightseeing",
              title: travel.title,
            }
          : null,
        blurb: travel.isCombo
          ? "One booking, several journeys — each leg is listed below."
          : "How you get into this city.",
        // Only meaningful on a combo; DetailSheet ignores a single-leg list.
        segments: travel.segments,
        facts: [
          { k: "DEPARTS", v: travel.departLabel },
          { k: "DURATION", v: travel.durationLabel },
          { k: "MODE", v: travel.modeLabel },
          { k: "STATUS", v: "Quoted, price held" },
        ],
        canChange: !travel.isDraftLeg,
        changeLabel: "Change travel",
        changeMessage: prompts.changeTransfer(leg.city),
        },
      }),
    [],
  );

  const handleOpenExtra = useCallback(
    (leg, extra) =>
      setSheet({ type: "detail", detail: {
        kind: `TAXI · ${String(leg.city).toUpperCase()}`,
        contextLabel: `Taxi in ${leg.city}`,
        name: extra.name,
        meta: extra.meta,
        // A taxi has no photo. It carries the same mode glyph its row does,
        // in the transfer blue this surface draws every journey in.
        Icon: getModeAccent(extra.modeKey).Icon,
        iconColor: "#1a4fd6",
        live: extra.bookingId
          ? {
              kind: "transfer",
              bookingId: extra.bookingId,
              bookingType: extra.bookingType,
              combo: extra.isCombo,
              isSightseeing: extra.transferType === "sightseeing",
              title: extra.name,
            }
          : null,
        blurb: "A car booked for you inside this city.",
        facts: [
          { k: "CITY", v: leg.city },
          { k: "STATUS", v: "Booked" },
        ],
        canChange: true,
        changeLabel: "Change taxi",
        changeMessage: prompts.changeTaxi(leg.city),
        canRemove: true,
        removeMessage: prompts.removeItem(extra.name, leg.city),
        },
      }),
    [],
  );

  // "Before you fly" — the visa/eSIM block, in the same sheet as everything
  // else, and now with the same BODY as everything else: the real bookings,
  // fetched from /bookings/ancillary/<id>/ by AncillaryDetail. It used to
  // describe itself out of the view model's tally alone ("A data plan so you
  // land connected", ESIM · 1 plan), which said nothing the row above it had
  // not already said.
  //
  // Deliberately NOT the existing VisaDetailDrawer / EsimDetailDrawer: those
  // quote a supplier price and offer to buy, and a price is the one thing that
  // must never appear on a package surface.
  const handleOpenAncillaries = useCallback(() => {
    const { visaCount, esimCount, items } = ancillaries;
    // One booking names itself in the header, the way a stay or a flight does.
    // Several keep the summary line, and the sheet labels each body below it.
    const only = items.length === 1 ? items[0] : null;
    setSheet({ type: "detail", detail: {
      kind: "BEFORE YOU FLY",
      contextLabel: "Visa & eSIM",
      name: only
        ? only.name || only.type
        : [
            visaCount ? `Visa × ${visaCount}` : null,
            esimCount ? (esimCount === 1 ? "eSIM" : `eSIM × ${esimCount}`) : null,
          ]
            .filter(Boolean)
            .join(" + "),
      meta: "INCLUDED",
      Icon: visaCount > 0 ? FaPassport : FaSimCard,
      live: {
        kind: "ancillary",
        // The sheet keys its body on this, so opening a different row refetches
        // rather than painting the last booking under the new header.
        id: items.map((item) => item.id).join("+"),
        items,
      },
      canChange: true,
      changeLabel: "Change",
      changeMessage: prompts.changeAncillaries(),
      },
    });
  }, [ancillaries]);

  // A day item — opened from the day sheet, which knows the leg and day.
  const handleOpenDayItem = useCallback((leg, day, item) => {
    const booked = item.kind === "booked";
    setSheet({ type: "detail", detail: {
      kind:
        item.kind === "booked"
          ? "BOOKED ACTIVITY"
          : item.kind === "food"
            ? "RESTAURANT"
            : "PLACE",
      name: item.name,
      meta: item.meta,
      contextLabel: item.name,
      imageUrl: item.imageUrl || null,
      // An activity resolves through its booking, a POI or a restaurant
      // through the geo record — `detailId` already carries whichever id that
      // endpoint answers for.
      live: item.detailId
        ? {
            kind: "element",
            elementType: item.elementType,
            id: item.detailId,
            itineraryCityId: leg.id,
            dayIndex: day?.dayIndex,
            slabIndex: item.raw?.index,
            name: item.name,
          }
        : null,
      blurb: booked
        ? "Tickets held for your group. Your guide meets you at the hotel."
        : "A suggestion, not a booking — go if you feel like it.",
      facts: [
        { k: "WHEN", v: item.timeOfDay ? item.timeOfDay.toUpperCase() : day?.dayLabel },
        { k: "TIME NEEDED", v: item.durationLabel ? item.durationLabel.toUpperCase() : null },
        { k: "CATEGORY", v: item.category || null },
        { k: "STATUS", v: booked ? "Tickets held" : "Suggestion" },
      ],
      status: booked ? "Tickets held" : "Included · nothing extra to pay",
      hasMap: true,
      canChange: booked,
      changeLabel: "Change activity",
      changeMessage: prompts.changeActivity(item.name, leg.city),
      canRemove: true,
      removeMessage: prompts.removeItem(item.name, leg.city),
      },
    });
  }, []);

  const handleOpenDay = useCallback(
    (leg, day) => setSheet({ type: "day", leg, day }),
    [],
  );

  // Jump to a leg without leaving the page — the pane above us is the scroller,
  // so scroll the section into view rather than moving a scrollTop we don't own.
  const scrollToLeg = useCallback((anchor) => {
    const el = rootRef.current?.querySelector(`#${CSS.escape(anchor)}`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

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
    const t = setTimeout(() => {
      const el = rootRef.current?.querySelector(`#${CSS.escape(changed.anchor)}`);
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 320);
    return () => clearTimeout(t);
  }, [changeAt, changed.anchor]);

  const totalStr = useMemo(() => {
    if (trip.pricesHidden || trip.totalAmount == null) return null;
    return formatMoney(trip.totalAmount, trip.currency);
  }, [trip.pricesHidden, trip.totalAmount, trip.currency]);

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
        onLegClick={scrollToLeg}
      />

      <div className="flex flex-col gap-[12px] px-[14px] pb-[18px] pt-[12px]">
        {/* ── The one price on this surface ── */}
        <div style={T.tripCard}
          className="flex flex-col gap-[13px] p-[16px]">
          <div className="flex items-start justify-between gap-[11px]">
            <div className="min-w-0">
              <div className="font-mono text-[10px] tracking-[0.08em] text-[#8a93a6]">
                {(trip.totalLabel || "TRIP TOTAL").toUpperCase()}
              </div>
              <div className="mt-[3px] text-[25px] font-[800] tracking-[-0.03em] text-[#0b1220]">
                {totalStr || "—"}
              </div>
              <div className="mt-[3px] text-[12.5px] text-[#6b7280]">
                {trip.bookingsCount > 0
                  ? `${trip.bookingsCount} booking${trip.bookingsCount === 1 ? "" : "s"} · price held today`
                  : "Pricing your trip…"}
              </div>
            </div>
            <ShieldCheck />
          </div>

          {gapLeg ? (
            <div className="flex items-center gap-[11px] border-t border-[#e6e8ec] pt-[11px]">
              <div className="h-[22px] w-[22px] flex-none rounded-full border-[1.5px] border-[#8a93a6]" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[14px] font-[700] text-[#0b1220]">
                  {gapLeg.city} has no stay
                </div>
                <div className="mt-[2px] truncate text-[12px] text-[#6b7280]">
                  {gapLeg.stayGapMeta}
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleChangeStay(gapLeg)}
                disabled={disabled}
                style={T.primaryPill}
                className="flex-none px-[18px] py-[9px] text-[13.5px] font-[800] disabled:opacity-40"
              >
                Fix
              </button>
            </div>
          ) : null}
        </div>

        {legs.map((leg) => (
          <LegSection
            key={leg.id}
            leg={leg}
            disabled={disabled}
            changedDayKey={changed.dayKey}
            onChangeStay={handleChangeStay}
            onChangeTravel={handleChangeTravel}
            onAddTravel={handleAddTravel}
            onOpenTravel={handleOpenTravel}
            onOpenStay={handleOpenStay}
            onOpenDay={handleOpenDay}
            onAddTaxi={handleAddTaxi}
            onOpenExtra={handleOpenExtra}
            onChangeReturn={handleChangeReturn}
            onAddReturn={handleAddReturn}
          />
        ))}

        {(ancillaries.visaCount > 0 || ancillaries.esimCount > 0) && (
          <div style={T.card}
            className="flex items-center gap-[11px] p-[13px]">
            {/* One row, and on a mixed trip two things behind it. The VISA wins
                the glyph: it is the one that decides whether you board, and an
                eSIM you can still buy at the airport. Neutral tile and grey
                glyph, not the transfers' blue — nothing here is a journey. */}
            <span
              className="flex h-[28px] w-[28px] flex-none items-center justify-center rounded-[6px]"
              style={{ background: "#eef0f4" }}
              aria-hidden
            >
              {ancillaries.visaCount > 0 ? (
                <FaPassport size={14} color="#6b7280" />
              ) : (
                <FaSimCard size={14} color="#6b7280" />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-[13.5px] font-[700] text-[#0b1220]">
                Before you fly
              </div>
              <div className="mt-[4px] truncate font-mono text-[10px] tracking-[0.06em] text-[#8a93a6]">
                {[
                  ancillaries.visaCount ? `VISA × ${ancillaries.visaCount}` : null,
                  ancillaries.esimCount ? "ESIM" : null,
                  "INCLUDED",
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </div>
            </div>
            {/* The row named two bookings and then refused to say anything more
                about them. This opens what they actually cover — still with no
                price, because they are inside the package. */}
            <button
              type="button"
              onClick={handleOpenAncillaries}
              style={{ border: 0, background: "none", padding: 0 }}
              className="flex-none font-mono text-[10px] tracking-[0.06em] text-[#6b7280]"
            >
              VIEW ›
            </button>
          </div>
        )}
      </div>

      {/* One slot, one sheet. Opening an item from the day REPLACES it —
          `isDay` goes false the moment `sheet.type` becomes "detail". */}
      <DaySheet
        open={isDay}
        onClose={closeDay}
        leg={sheet?.leg}
        day={sheet?.day}
        disabled={disabled}
        onAskKaira={ask}
        onOpenItem={(item) => handleOpenDayItem(sheet.leg, sheet.day, item)}
      />

      <DetailSheet
        open={isDetail}
        onClose={closeDetail}
        detail={sheet?.detail}
        disabled={disabled}
        onAskKaira={ask}
      />

      <MoreSheet
        open={isMore}
        onClose={closeMore}
        onViewMap={onViewMap}
        onDownloadPdf={onDownloadPdf}
        onShare={onShare}
        onSettings={onSettings}
        isDownloadingPdf={isDownloadingPdf}
        onOpenChat={() => ask(prompts.openEnded())}
      />

    </div>
  );
}

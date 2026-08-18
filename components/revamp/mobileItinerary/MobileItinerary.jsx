import React, { useCallback, useMemo, useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";

import buildTripViewModel from "../../../lib/tripViewModel";
import { formatMoney } from "../../../services/money";
import LegSection from "./LegSection";
import DaySheet from "./sheets/DaySheet";
import MoreSheet from "./sheets/MoreSheet";
import DetailSheet from "./sheets/DetailSheet";
import prompts from "./kairaPrompts";
import * as T from "./designTokens";
import TripHeader from "./TripHeader";

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
  <svg width="24" height="30" viewBox="0 0 23 30" fill="none" className="flex-none" aria-hidden>
    <path
      d="M11.33 29.75L1.13 22.1A2.9 2.9 0 010 19.83V2.83A2.83 2.83 0 012.83 0h17a2.83 2.83 0 012.84 2.83v17a2.9 2.9 0 01-1.14 2.27l-10.2 7.65zm0-3.54l8.5-6.38V2.83H2.83v17l8.5 6.38zm-1.49-7.79l8-8-1.98-2.06-6.02 6.02-2.98-2.97-2.05 1.98 5.03 5.03z"
      fill="#AD5BE7"
    />
  </svg>
);

function Skeleton() {
  return (
    <div className="flex flex-col gap-[11px] px-[14px] pb-[18px] pt-[12px]">
      <div className="h-[112px] animate-pulse rounded-[18px] bg-[#f1f2f4]" />
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex flex-col gap-[11px]">
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

  const [daySheet, setDaySheet] = useState(null); // { leg, day }
  const [moreOpen, setMoreOpen] = useState(false);
  const [detailItem, setDetailItem] = useState(null);
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
    (message) => {
      if (!message) return;
      setDetailItem(null);
      setDaySheet(null);
      setMoreOpen(false);
      askKaira?.(message);
    },
    [askKaira],
  );

  const handleChangeStay = useCallback(
    (leg) =>
      ask(
        leg.stay ? prompts.changeStay(leg.city) : prompts.addStay(leg.city),
      ),
    [ask],
  );

  const handleChangeTravel = useCallback(
    (leg) => ask(prompts.changeTransfer(leg.city)),
    [ask],
  );

  const handleAddTaxi = useCallback(
    (leg) =>
      ask(
        leg.extras.length > 0
          ? prompts.changeTaxi(leg.city)
          : prompts.addTaxi(leg.city),
      ),
    [ask],
  );

  const handleOpenStay = useCallback(
    (leg) => leg.stay && ask(prompts.showDetails(leg.stay.name, leg.city)),
    [ask],
  );

  const handleOpenTravel = useCallback(
    (leg, travel) => ask(prompts.showDetails(travel.title, leg.city)),
    [ask],
  );

  const handleOpenExtra = useCallback(
    (leg, extra) => ask(prompts.showDetails(extra.name, leg.city)),
    [ask],
  );

  const handleOpenDay = useCallback(
    (leg, day) => setDaySheet({ leg, day }),
    [],
  );

  // Jump to a leg without leaving the page — the pane above us is the scroller,
  // so scroll the section into view rather than moving a scrollTop we don't own.
  const scrollToLeg = useCallback((anchor) => {
    const el = rootRef.current?.querySelector(`#${CSS.escape(anchor)}`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

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
        onOpenMore={() => (onOpenMore ? onOpenMore() : setMoreOpen(true))}
        onViewMap={onViewMap}
        onLegClick={scrollToLeg}
      />

      <div className="flex flex-col gap-[11px] px-[14px] pb-[18px] pt-[12px]">
        {/* ── The one price on this surface ── */}
        <div style={T.tripCard}
          className="flex flex-col gap-[12px] p-[16px]">
          <div className="flex items-start justify-between gap-[10px]">
            <div className="min-w-0">
              <div className="font-mono text-[8.5px] tracking-[0.08em] text-[#8a93a6]">
                {(trip.totalLabel || "TRIP TOTAL").toUpperCase()}
              </div>
              <div className="mt-[3px] text-[23px] font-[800] tracking-[-0.03em] text-[#0b1220]">
                {totalStr || "—"}
              </div>
              <div className="mt-[3px] text-[11.5px] text-[#6b7280]">
                {trip.bookingsCount > 0
                  ? `${trip.bookingsCount} booking${trip.bookingsCount === 1 ? "" : "s"} · price held today`
                  : "Pricing your trip…"}
              </div>
            </div>
            <ShieldCheck />
          </div>

          {gapLeg ? (
            <div className="flex items-center gap-[10px] border-t border-[#e6e8ec] pt-[11px]">
              <div className="h-[20px] w-[20px] flex-none rounded-full border-[1.5px] border-[#8a93a6]" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13px] font-[700] text-[#0b1220]">
                  {gapLeg.city} has no stay
                </div>
                <div className="mt-[2px] truncate text-[11px] text-[#6b7280]">
                  {gapLeg.stayGapMeta}
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleChangeStay(gapLeg)}
                disabled={disabled}
                style={T.primaryPill}
                className="flex-none px-[18px] py-[9px] text-[12.5px] font-[800] disabled:opacity-40"
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
            onChangeStay={handleChangeStay}
            onChangeTravel={handleChangeTravel}
            onOpenTravel={handleOpenTravel}
            onOpenStay={handleOpenStay}
            onOpenDay={handleOpenDay}
            onAddTaxi={handleAddTaxi}
            onOpenExtra={handleOpenExtra}
          />
        ))}

        {(ancillaries.visaCount > 0 || ancillaries.esimCount > 0) && (
          <div style={T.card}
            className="flex items-center gap-[10px] p-[12px]">
            <div className="h-[26px] w-[26px] flex-none rounded-[6px] bg-[#e6e8ec]" />
            <div className="min-w-0 flex-1">
              <div className="text-[12.5px] font-[700] text-[#0b1220]">
                Before you fly
              </div>
              <div className="mt-[4px] truncate font-mono text-[8.5px] tracking-[0.06em] text-[#8a93a6]">
                {[
                  ancillaries.visaCount ? `VISA × ${ancillaries.visaCount}` : null,
                  ancillaries.esimCount ? "ESIM" : null,
                  "INCLUDED",
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </div>
            </div>
          </div>
        )}
      </div>

      <DaySheet
        open={!!daySheet}
        onClose={() => setDaySheet(null)}
        leg={daySheet?.leg}
        day={daySheet?.day}
        disabled={disabled}
        onAskKaira={ask}
        onOpenItem={(item) => setDetailItem(item)}
      />

      <DetailSheet
        open={!!detailItem}
        onClose={() => setDetailItem(null)}
        leg={daySheet?.leg}
        day={daySheet?.day}
        item={detailItem}
        disabled={disabled}
        onAskKaira={ask}
      />

      <MoreSheet
        open={moreOpen}
        onClose={() => setMoreOpen(false)}
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

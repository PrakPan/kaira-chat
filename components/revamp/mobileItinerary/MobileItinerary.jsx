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

// The change CTA on a journey names the thing being changed — "Change Flight",
// "Change Train" — rather than the category. The noun is capitalised, here and
// on every other change CTA on this surface ("Change Stay", "Change Activity",
// "Change Visa"): the button is a name, and a lowercase one beside its
// capitalised siblings reads as a typo. "Change travel" reads identically
// on every journey in the trip, so it never says which of them the button is
// about to hand to Kaira.
//
// Keyed on the resolved mode key, so the word agrees with the glyph the row is
// drawn with. A COMBO is deliberately excluded: "taxi, then fly" has no single
// mode, and naming its leading leg would promise to change only the taxi.
// Self-drive and the unrecognised-mode fallback take the same route.
//
// What those fall back to is "Change Transfer" — the transfer drawer's own CTA
// on desktop, and the noun Kaira is asked for anyway ("change transfer in Hoi
// An"). "Change travel" named nothing the traveller books.
const TRANSFER_NOUNS = {
  Flight: "Flight",
  Train: "Train",
  Bus: "Bus",
  Ferry: "Ferry",
  Taxi: "Taxi",
};

const transferChangeLabel = (modeKey, isCombo) => {
  const noun = isCombo ? null : TRANSFER_NOUNS[getModeAccent(modeKey).key];
  return `Change ${noun || "Transfer"}`;
};

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

  // The add row only renders when the city HAS no taxi — a booked one takes the
  // slot and carries its own CHANGE — so this is the add case. The change
  // branch stays as the safety net for any caller that still routes here.
  // The row only exists while one of this city's three cars is still missing —
  // pickup, drop or the sightseeing car — so it always ADDS. It used to send
  // "change the taxi" whenever the city already had one, which on a city with
  // a sightseeing car and no airport transfers asked Kaira to redo the one
  // booking the traveller was happy with.
  const handleAddTaxi = useCallback(
    (leg) => ask(prompts.addTaxi(leg.city), `Taxi in ${leg.city}`),
    [ask],
  );

  // CHANGE on the taxi row. Named by the booking rather than the city, so
  // Kaira's "About …" chip says which car is being talked about on a leg that
  // has more than one.
  const handleChangeExtra = useCallback(
    (leg, extra) =>
      ask(
        extra?.airportRole
          ? prompts.changeAirportTaxi(extra.airportRole, leg.city)
          : prompts.changeTaxi(leg.city),
        extra?.name || `Taxi in ${leg.city}`,
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
        meta: leg.stay.detailMeta || leg.stay.meta,
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
        changeLabel: "Change Stay",
        changeMessage: prompts.changeStay(leg.city),
        canRemove: true,
        removeMessage: prompts.removeStay(leg.city),
        },
      });
    },
    [onViewMap],
  );

  const handleOpenTravel = useCallback((leg, travel) => {
    // The same sheet opens for the arrival INTO a city and for the journey
    // home, and Kaira needs to be told which: "change transfer in Hampi" is the
    // wrong journey when the row is the flight OUT of Hampi. Identity rather
    // than a field on the object — `destName` exists on the outbound leg but
    // can be null, and null is not "this is an arrival".
    const isReturn = travel === leg.outboundTravel;
    const homeName = travel.destName || leg.city;

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
      changeLabel: transferChangeLabel(travel.modeKey, travel.isCombo),
      changeMessage: isReturn
        ? prompts.changeReturn(homeName)
        : prompts.changeTransfer(leg.city),
      // A P1 draft leg has no booking to drop — the row is a statement about
      // the route, and the gap state below it already says so.
      canRemove: !travel.isDraftLeg,
      removeMessage: isReturn
        ? prompts.removeReturn(homeName)
        : prompts.removeTransfer(leg.city),
      },
    });
  }, []);

  const handleOpenExtra = useCallback(
    (leg, extra) =>
      setSheet({ type: "detail", detail: {
        // An airport transfer says which one it is. "TAXI · HOI AN" over three
        // different cars in the same city named none of them.
        kind: `${
          extra.airportRole ? `AIRPORT ${extra.airportRole}` : "TAXI"
        } · ${String(leg.city).toUpperCase()}`.toUpperCase(),
        contextLabel: extra.airportRole
          ? `Airport ${extra.airportRole} in ${leg.city}`
          : `Taxi in ${leg.city}`,
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
        blurb:
          extra.airportRole === "pickup"
            ? "A car booked to meet you at the airport."
            : extra.airportRole === "drop"
              ? "A car booked to take you to the airport."
              : "A car booked for you inside this city.",
        facts: [
          { k: "CITY", v: leg.city },
          { k: "STATUS", v: "Booked" },
        ],
        canChange: true,
        changeLabel: transferChangeLabel(extra.modeKey, extra.isCombo),
        changeMessage: extra.airportRole
          ? prompts.changeAirportTaxi(extra.airportRole, leg.city)
          : prompts.changeTaxi(leg.city),
        canRemove: true,
        removeMessage: prompts.removeItem(extra.name, leg.city),
        },
      }),
    [],
  );

  // ONE BOOKING PER SHEET, like desktop.
  //
  // "Before you fly" used to be a single row that opened every ancillary the
  // trip had stacked in one sheet — a visa and an eSIM under one header, one
  // pair of CTAs governing both. Desktop has never done that: each ancillary
  // booking is its own row with its own "View Detail", and its own drawer.
  // Nothing about the two is shared — different suppliers, different terms,
  // and removing one has no bearing on the other — so a sheet that spoke for
  // both could only speak vaguely ("Change", "remove the visa and eSIM").
  //
  // The body is unchanged: AncillaryDetail off /bookings/ancillary/<id>/.
  // Deliberately NOT the existing VisaDetailDrawer / EsimDetailDrawer: those
  // quote a supplier price and offer to buy, and a price is the one thing that
  // must never appear on a package surface.
  const handleOpenAncillary = useCallback((item) => {
    const isEsim = item.type === "eSIM";
    const noun = isEsim ? "eSIM" : "Visa";
    setSheet({ type: "detail", detail: {
      kind: isEsim ? "ESIM" : "VISA",
      contextLabel: item.name || noun,
      name: item.name || noun,
      meta: "INCLUDED",
      Icon: isEsim ? FaSimCard : FaPassport,
      live: {
        kind: "ancillary",
        // The sheet keys its body on this, so opening a different row refetches
        // rather than painting the last booking under the new header.
        id: item.id,
        items: [item],
      },
      canChange: true,
      changeLabel: `Change ${noun}`,
      changeMessage: prompts.changeAncillary(isEsim ? "eSIM" : "visa"),
      canRemove: true,
      removeMessage: prompts.removeAncillaries(isEsim ? "eSIM" : "visa"),
      },
    });
  }, []);

  // A day item — opened from the day sheet, which knows the leg and day.
  const handleOpenDayItem = useCallback((leg, day, item) => {
    const booked = item.kind === "booked";
    setSheet({ type: "detail", detail: {
      // No kicker on a booked activity: "BOOKED ACTIVITY" over its own name
      // said what the STATUS fact and the ticket copy inside the sheet both
      // say, and it was the widest line in the header. A place or a restaurant
      // keeps its kicker — those two are told apart by nothing else up here.
      kind:
        item.kind === "booked"
          ? null
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
      hasMap: true,
      // A place or a restaurant swaps rather than changes, and it says so in
      // the POI drawer's own words — "Replace with something else", short to
      // "Replace" where the bar is narrow. It used to have no change CTA at
      // all here, which left a suggestion the traveller didn't want with only
      // one way out of the sheet: remove it.
      canChange: true,
      changeLabel: booked ? "Change Activity" : "Replace with something else",
      changeLabelShort: booked ? null : "Replace",
      changeMessage: booked
        ? prompts.changeActivity(item.name, leg.city)
        : prompts.replaceItem(item.name, leg.city),
      canRemove: true,
      removeMessage: prompts.removeItem(item.name, leg.city),
      },
    });
  }, []);

  const handleOpenDay = useCallback(
    (leg, day) => setSheet({ type: "day", leg, day }),
    [],
  );

  // Jump to a leg without leaving the page.
  //
  // NOT `scrollIntoView`. That asks the browser to put the element at the top
  // of the viewport whatever it takes, and it moves EVERY scrollable ancestor
  // to get there. It also lands the target flush under the top edge, where the
  // sticky trip card is already sitting — so the eyebrow it scrolled to is
  // covered by the thing you tapped in.
  //
  // So one scroller is moved directly, by hand, and the target is clamped to
  // the scroll it actually has. Tapping the last city lands as far down as the
  // trip goes and stops there.
  //
  // WHICH scroller depends on the host. On a phone this surface has none of
  // its own: the bot shell lays the trip out in the document so the browser
  // will retract its address bar (see `.app-shell` in styles/globals.css), and
  // the window is the scroller. Inside a pane that scrolls itself — the route
  // sheet, or the desktop column — that pane is. Both are handled below rather
  // than one being a fallback for the other, because the maths differs: a
  // pane's own top is its scroll origin, the window's is 0.
  const scrollToAnchor = useCallback((anchor) => {
    const root = rootRef.current;
    const el = anchor ? root?.querySelector(`#${CSS.escape(anchor)}`) : null;
    if (!el) return;

    // Clear the sticky trip card, which would otherwise sit over the leg's own
    // eyebrow the moment it arrived. It is this component's first child.
    const stuck = root.firstElementChild?.offsetHeight || 0;
    const pane = scrollParentOf(root);

    if (pane) {
      const top =
        pane.scrollTop +
        el.getBoundingClientRect().top -
        pane.getBoundingClientRect().top -
        stuck;
      const max = Math.max(0, pane.scrollHeight - pane.clientHeight);
      pane.scrollTo({ top: Math.min(Math.max(top, 0), max), behavior: "smooth" });
      return;
    }

    const doc = document.scrollingElement || document.documentElement;
    const top = window.scrollY + el.getBoundingClientRect().top - stuck;
    const max = Math.max(0, doc.scrollHeight - window.innerHeight);
    window.scrollTo({
      top: Math.min(Math.max(top, 0), max),
      behavior: "smooth",
    });
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
    const t = setTimeout(() => scrollToAnchor(changed.anchor), 320);
    return () => clearTimeout(t);
  }, [changeAt, changed.anchor, scrollToAnchor]);

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
        onLegClick={scrollToAnchor}
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
            onChangeExtra={handleChangeExtra}
            onChangeReturn={handleChangeReturn}
            onAddReturn={handleAddReturn}
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
                    onClick={() => handleOpenAncillary(item)}
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

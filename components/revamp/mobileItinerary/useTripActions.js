import { useCallback, useMemo, useState } from "react";
// Font Awesome, like the transfer glyphs in modeAccent.js — one icon family
// across the surface, so a passport doesn't arrive drawn at a different weight
// from the car two rows above it.
import { FaPassport, FaSimCard } from "react-icons/fa";

import { mediaUrlFromKey } from "../../../lib/tripViewModel";
import prompts from "./kairaPrompts";
import getModeAccent from "../common/components/bookingDetail/modeAccent";

// ─────────────────────────────────────────────────────────────────────────────
//  useTripActions — what every row of the trip DOES, shared by the phone
//  (MobileItinerary) and desktop (DesktopItinerary) itineraries.
//
//  Both surfaces draw the same legs (LegSection) and open the same day and
//  detail sheets, so what a tap on a row means has to be written once: which
//  sheet it opens and with what in it, and which sentence the CTAs that ask
//  Kaira hand her. Only the chrome around the legs differs between the two.
//
//  Not here: a row's own "Change" / "Add" / "Fix" — those open the booking
//  flows (useBookingDrawers), on both surfaces.
//
//  Returns the single sheet slot and its guarded closers, the `ask` funnel, and
//  one handler per row affordance.
// ─────────────────────────────────────────────────────────────────────────────

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

// The stay carries an image KEY, but the detail sheet paints it as a CSS
// background and needs a URL — resized, because a hotel hero is a 54px
// thumbnail here and shipping the original is what the media resizer exists to
// avoid. The row's own (smaller) thumbnail URL comes off the view model.
const imageUrlFromKey = (key) => mediaUrlFromKey(key, 160);

export default function useTripActions({ askKaira, onViewMap }) {
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

  // The single funnel for everything on this surface that asks Kaira — the
  // detail sheet's "Change" / "Remove", a day at leisure — so closing the
  // sheets belongs here rather than in each button.
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

  // Opening the conversation with nothing to say. `ask` refuses an empty
  // message on purpose — a prompt builder returning "" must not fire — so the
  // one entry point that HAS no message is its own callback rather than a hole
  // in that guard. It still closes the sheets for the reason above.
  const openChat = useCallback(() => {
    setSheet(null);
    askKaira?.();
  }, [askKaira]);

  // "Day at leisure · ask Kaira" — a day with nothing in the package.
  const handleAddToDay = useCallback(
    (leg, day) =>
      ask(prompts.addToDay(leg.city, day.dayLabel), `Day ${day.dayNumber}`),
    [ask],
  );

  // "NO PICKUP · ADD ›" on an included activity.
  const handleAddActivityPickup = useCallback(
    (leg, item) =>
      ask(prompts.addActivityPickup(item.name, leg.city), `Pickup · ${item.name}`),
    [ask],
  );

  // ── Opening a row ──────────────────────────────────────────────────────────
  // The design opens a DETAIL SHEET here, it does not ask Kaira. That
  // distinction is the whole point: reading about a booking is something the
  // app already knows the answer to, and routing it through the chat put a
  // question in the conversation that the trip could answer itself — then made
  // the user wait for a reply to read their own hotel's name back to them.
  //
  // CHANGING is the sheet footer's "Change". It asks Kaira, unless the caller
  // hands in `over` — fields merged over the descriptor, where the phone puts
  // an `onChange` that opens the booking's change flow instead (DetailSheet).

  const handleOpenStay = useCallback(
    (leg, over) => {
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
        ...over,
        },
      });
    },
    [onViewMap],
  );

  const handleOpenTravel = useCallback((leg, travel, over) => {
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
      ...over,
      },
    });
  }, []);

  const handleOpenExtra = useCallback(
    (leg, extra, over) =>
      setSheet({ type: "detail", detail: {
        // A pickup or drop says which one it is, and where it happens: only a
        // flight has an airport, and "AIRPORT DROP" over a ride to a ferry
        // terminal sends the traveller across the city. "TAXI · HOI AN" over
        // three different cars named none of them.
        kind: `${
          extra.airportRole
            ? `${extra.airportHub || "Airport"} ${extra.airportRole}`
            : "TAXI"
        } · ${leg.city}`.toUpperCase(),
        contextLabel: extra.airportRole
          ? `${extra.airportHub || "Airport"} ${extra.airportRole} in ${leg.city}`
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
            ? `A car booked to meet you at the ${(
                extra.airportHub || "airport"
              ).toLowerCase()}.`
            : extra.airportRole === "drop"
              ? `A car booked to take you to the ${(
                  extra.airportHub || "airport"
                ).toLowerCase()}.`
              : "A car booked for you inside this city.",
        facts: [
          { k: "CITY", v: leg.city },
          { k: "STATUS", v: "Booked" },
        ],
        canChange: true,
        changeLabel: transferChangeLabel(extra.modeKey, extra.isCombo),
        changeMessage: extra.airportRole
          ? prompts.changeHubTaxi(extra.airportHub, extra.airportRole, leg.city)
          : prompts.changeTaxi(leg.city),
        canRemove: true,
        removeMessage: prompts.removeItem(extra.name, leg.city),
        ...over,
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
  const handleOpenAncillary = useCallback((item, over) => {
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
      ...over,
      },
    });
  }, []);

  // A day item — opened from the day sheet, which knows the leg and day.
  const handleOpenDayItem = useCallback((leg, day, item, over) => {
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
      ...over,
      },
    });
  }, []);

  const handleOpenDay = useCallback(
    (leg, day) => setSheet({ type: "day", leg, day }),
    [],
  );

  return {
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
  };
}

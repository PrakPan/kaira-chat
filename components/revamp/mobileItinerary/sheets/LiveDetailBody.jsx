import React from "react";

import TransferDrawer from "../../../../containers/itinerary/TransferDrawer";
import StayDetail from "./detail/StayDetail";
import ElementDetail from "./detail/ElementDetail";
import AncillaryDetail from "./detail/AncillaryDetail";

// ─────────────────────────────────────────────────────────────────────────────
//  LiveDetailBody — the real booking, inside the mobile detail sheet.
//
//  The sheet used to describe a booking from the trip view model alone: a
//  blurb, four facts and a grey box labelled MAP. Everything a traveller opens
//  a row to check — the flight's segments and fare rules, the cab and who it
//  seats, the hotel's rooms and cancellation terms, what an activity includes —
//  lives behind a per-booking endpoint this surface never called. It calls them
//  now, the same ones desktop calls.
//
//  Where the two surfaces part company is layout, not facts:
//
//   • TRANSFERS reuse the desktop drawer outright. Its body is already built
//     from the shared bookingDetail primitives (JourneyRail, FactChips,
//     DetailSection, PolicyNote) — the same mono micro-labels and hairline
//     rules this itinerary is drawn in — and its combo/flight/taxi/self-drive
//     branching is intricate enough that a second copy would drift. `embedded`
//     drops its panel, band and action bar and hands back the body alone.
//
//   • STAYS and DAY ITEMS get their own bodies. The desktop drawers for those
//     are full-height panels — a photo mosaic and a sticky tab bar over
//     scroll-spied sections for a hotel; a 300px hero, an h2 and a scheduling
//     picker for an activity — and none of that belongs in a bottom sheet whose
//     header already names the thing and whose only action is Kaira. Same
//     endpoints, same facts, laid out in this surface's design.
//
//   • VISA & eSIM likewise. The desktop drawers for those are built around
//     picking and buying one — a price card and an "Add to Cart" — so they are
//     no more reusable here than the hotel panel was.
//
//  `live` is built by MobileItinerary from the view model:
//    { kind: "transfer",  bookingId, bookingType, combo, isSightseeing, title }
//    { kind: "stay",      bookingId }
//    { kind: "element",   elementType: "activity"|"poi"|"restaurant",
//                         id, itineraryCityId, dayIndex, slabIndex }
//    { kind: "ancillary", id, items: [{ id, type: "Visa"|"eSIM", name }] }
// ─────────────────────────────────────────────────────────────────────────────

const noop = () => {};

export default function LiveDetailBody({ live }) {
  if (!live) return null;

  if (live.kind === "transfer") {
    if (!live.bookingId) return null;
    return (
      // Full bleed: DetailSection lays its own px-4 gutter, and the sheet's
      // would sit outside it as a second one.
      <div className="pb-[10px]">
        <TransferDrawer
          embedded
          show
          booking_id={live.bookingId}
          booking_type={live.bookingType || "Taxi"}
          combo={!!live.combo}
          isSightseeing={!!live.isSightseeing}
          city={live.title}
          // Change and Remove are the sheet footer's, and they go to Kaira —
          // there is no edit flow mounted under this surface to hand off to.
          handleDelete={undefined}
          setShowLoginModal={noop}
          getPaymentHandler={noop}
        />
      </div>
    );
  }

  if (live.kind === "stay") {
    return <StayDetail bookingId={live.bookingId} />;
  }

  if (live.kind === "element") {
    return (
      <ElementDetail
        elementType={live.elementType}
        id={live.id}
        itineraryCityId={live.itineraryCityId}
      />
    );
  }

  // "Before you fly" is one ROW but can be several bookings — a visa and an
  // eSIM, or a visa each for two passports. They stack, each fetched on its
  // own, so one failing to load doesn't take the others down with it. The mono
  // heading only appears when there is more than one to tell apart.
  if (live.kind === "ancillary") {
    const items = (live.items || []).filter((item) => item && item.id);
    if (!items.length) return null;
    return (
      <>
        {items.map((item) => (
          <AncillaryDetail
            key={item.id}
            bookingId={item.id}
            type={item.type}
            heading={items.length > 1 ? (item.name || item.type) : null}
          />
        ))}
      </>
    );
  }

  return null;
}

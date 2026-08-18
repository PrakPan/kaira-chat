import React, { useMemo } from "react";
import { shallowEqual, useSelector } from "react-redux";

import buildTripViewModel from "../../../lib/tripViewModel";
import TripHeader from "./TripHeader";

// ─────────────────────────────────────────────────────────────────────────────
//  TripHeaderLive — TripHeader wired to the store.
//
//  The map tab lives in BotApp's MobileLayout, which never sees the trip
//  view-model; rather than thread title/pax/dates/legs down through several
//  memoised layers, the header selects what it needs itself.
//
//  Same selector discipline as MobileItinerary: pick the raw slices with
//  shallowEqual, then derive once. Handing buildTripViewModel straight to
//  useSelector would rebuild the whole trip on every unrelated dispatch.
// ─────────────────────────────────────────────────────────────────────────────

export default function TripHeaderLive(props) {
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
  const { gates, trip, legs } = useMemo(
    () => buildTripViewModel(slices),
    [slices],
  );

  if (!gates.itineraryReady) return null;

  return (
    <TripHeader
      title={trip.title}
      paxLabel={trip.paxLabel}
      dateLabel={trip.dateLabel}
      legs={legs}
      {...props}
    />
  );
}

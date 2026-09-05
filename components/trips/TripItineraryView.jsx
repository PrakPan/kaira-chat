// The V1 itinerary view, driven by the build-time trip snapshot.
//
// The shell mirrors BotApp's desktop layout so a /trips leaf and a /chat/{id}
// archive look the same: a page that never scrolls, split 50/50, the itinerary
// scrolling inside its own column with the price bar fixed across the bottom of
// it, and the chat pinned full-height beside it.
//
// The difference is the data — it comes from `.seo-cache` rather than a runtime
// fetch, so the whole itinerary is in the statically exported HTML. That is the
// point of these 1,718 pages.
//
// ── Why the state is seeded during render ────────────────────────────────────
// The itinerary components (DaybyDay -> ItineraryCity -> CityDay) read Redux,
// so the store has to be populated before they render. The two obvious routes
// both fail here:
//
//   • useEffect — runs after paint, so the exported HTML would ship empty and
//     the day-by-day would only appear post-hydration. A crawler that runs no
//     JavaScript would see zero days, which is exactly what these pages cannot
//     afford.
//   • next-redux-wrapper's getStaticProps — seeds the server render, but this
//     app's root reducer is a bare combineReducers with no HYDRATE case, so the
//     state is dropped on the client and the itinerary would vanish a moment
//     after load.
//
// A `useState` initializer runs synchronously on the first render, on both the
// server and the client, before the connected children read the store — so the
// HTML is complete and hydration matches it. Dispatching the same snapshot
// twice (StrictMode) is idempotent.
//
// Nothing here polls or fetches: neither BotApp nor ItineraryContainer is used.
// Both bootstrap a live session — status polling, chatkit, /thank-you redirects
// on failure — against an itinerary this page has no business calling.

import { useState } from "react";
import { useDispatch } from "react-redux";

import DaybyDay from "../../containers/itinerary/DaybyDay";
import ArchiveChatPanel from "../bot-components/components/ArchiveChatPanel";
import { BottomCTABar } from "../bot-components/BotApp";
import setItinerary from "../../store/actions/itinerary";
import setItineraryDaybyDay from "../../store/actions/itineraryDaybyDay";
import { setStays } from "../../store/actions/StayBookings";
import setItineraryStatus from "../../store/actions/itineraryStatus";

const TripItineraryView = ({
  itinerary,
  stays,
  introMessage,
  /** Rendered at the foot of the itinerary column, under the day-by-day. */
  below = null,
  /** Rendered above the day-by-day, inside the itinerary column. */
  header = null,
  onGetThisTrip,
}) => {
  const dispatch = useDispatch();

  useState(() => {
    if (!itinerary) return null;

    dispatch(setItinerary(itinerary));
    dispatch(setItineraryDaybyDay(itinerary));
    dispatch(setStays(stays || []));

    // The day-by-day gates its hotel row and its edit affordances on these.
    // They are settled values, not "pending": nothing here will ever resolve
    // them later.
    dispatch(setItineraryStatus("itinerary_status", "SUCCESS"));
    dispatch(setItineraryStatus("hotels_status", "SUCCESS"));
    dispatch(setItineraryStatus("transfers_status", "SUCCESS"));
    dispatch(setItineraryStatus("pricing_status", "SUCCESS"));
    dispatch(setItineraryStatus("finalized_status", "SUCCESS"));
    dispatch(setItineraryStatus("is_polling", false));

    return null;
  });

  if (!itinerary) return null;

  const price = itinerary.trip_price;
  // The snapshot's price is already in rupees (the V1 archive's is in paise),
  // so it is passed through rather than divided.
  const archivePrice =
    price?.per_person > 0
      ? {
          amount: price.per_person,
          perPerson: true,
          code: price.currency || "INR",
        }
      : null;

  const itineraryColumn = (
    <>
      {/* Scrolls inside the column, exactly as BotApp's itinerary panel does —
          the page itself never scrolls on desktop. The bottom padding clears
          the fixed price bar so the last section isn't sitting under it. */}
      <div className="flex-1 min-h-0 lg:overflow-y-auto px-4 md:px-5 pb-[110px]">
        {header}
        <DaybyDay fromChat mercuryItinerary showPins={false} isDraft={false} />
        {below}
      </div>
      <BottomCTABar
        viewMode="itinerary"
        activeItineraryId={itinerary.id}
        showItineraryShimmer={false}
        isDraft={false}
        isV1Archive
        archivePrice={archivePrice}
        cart={null}
        pricingStatus="SUCCESS"
        loaderDisplayText={null}
        currency={{ currency: price?.currency || "INR" }}
        countCartItems={0}
        isHovered={false}
        setIsHovered={() => {}}
        popupStyle={{}}
        onConfirm={() => {}}
        onViewCart={() => {}}
        onGetThisTrip={onGetThisTrip}
      />
    </>
  );

  return (
    <>
      {/* ── Desktop: BotApp's shell ── */}
      <main className="max-lg:hidden flex h-screen overflow-hidden bg-white">
        {/* LEFT 50% */}
        <div
          className="flex flex-col overflow-hidden relative bg-white border-r border-[#e5e5e5]"
          style={{ width: "50%", minWidth: 0 }}
        >
          {itineraryColumn}
        </div>

        {/* RIGHT 50% */}
        <div
          className="flex flex-col overflow-hidden min-h-0 h-full relative bg-white"
          style={{ width: "50%", minWidth: 0 }}
        >
          <ArchiveChatPanel
            itineraryId={itinerary.id}
            introMessage={introMessage}
          />
        </div>
      </main>

      {/* ── Mobile: the same two panes stacked, in the page's own scroll ──
          A phone can't hold two columns, and pinning the shell to the viewport
          here would trap the page. The chat leads because it introduces the
          plan; the itinerary and its sections follow. */}
      <div className="lg:hidden flex flex-col">
        <div className="h-[540px] border-b border-[#e5e5e5]">
          <ArchiveChatPanel
            itineraryId={itinerary.id}
            introMessage={introMessage}
          />
        </div>
        <div className="flex flex-col">{itineraryColumn}</div>
      </div>
    </>
  );
};

export default TripItineraryView;

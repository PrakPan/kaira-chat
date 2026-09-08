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
import { useRouter } from "next/router";

import DaybyDay from "../../containers/itinerary/DaybyDay";
import Sidebar from "../bot-components/components/Sidebar";
import ArchiveChatPanel from "../bot-components/components/ArchiveChatPanel";
import CloneItineraryModal from "../bot-components/components/CloneItineraryModal";
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
  /** Rendered above the day-by-day — the itinerary's own trip strip. */
  header = null,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  // The nav rail starts collapsed, exactly as BotApp's does. It expands as an
  // overlay rather than by reflowing the row, so the two columns beside it keep
  // their widths in both states.
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  // The bar's CTA opens the clone popup. The state lives here rather than being
  // passed in: the bar and the popup are both this component's, so a caller
  // that forgets to wire a handler (which is what left "Get this trip!" doing
  // nothing) can't happen.
  const [showCloneModal, setShowCloneModal] = useState(false);
  // Mobile only: the chat is closed until the floating Kaira button is tapped,
  // as it is on a V1 itinerary. Desktop ignores this — the panel is simply the
  // right half there.
  const [chatOpen, setChatOpen] = useState(false);

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
      <div className="flex-1 min-h-0 ph-up:overflow-y-auto px-4 md:px-5 pt-4 pb-[110px]">
        {header}
        <DaybyDay fromChat mercuryItinerary showPins={false} isDraft={false} />
        {below}
      </div>
      {/* The bar is `position: fixed`, and its own class pins it to 48% of the
          VIEWPORT — which is narrower than this column's 50%, so it stopped
          short of the divider. `barStyle` is the prop BotApp uses for exactly
          this (it feeds the measured panel box in), so the bar spans the column
          and its right edge meets the chat divider. */}
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
        onGetThisTrip={() => setShowCloneModal(true)}
      />
    </>
  );

  return (
    <>
      {/* Same popup the chat panel's clone card opens. */}
      <CloneItineraryModal
        show={showCloneModal}
        onHide={() => setShowCloneModal(false)}
        itineraryId={itinerary.id}
      />

      {/* The bar is `position: fixed` and its own class pins it to 48% of the
          VIEWPORT, narrower than this column, so it stopped short of the
          divider. It now also has to clear the nav rail: the itinerary column
          starts 76px in and takes half of what is left, so the bar does the
          same. 76 is SIDEBAR_WIDTH_COLLAPSED in the Sidebar component, and it
          holds in both states — expanding the rail overlays the page rather
          than reflowing it.

          Overridden here rather than via the `barStyle` prop because an inline
          style would apply at every width and override the bar's `w-full` on a
          phone, where it should span the screen. */}
      <style
        dangerouslySetInnerHTML={{
          __html: `@media (min-width:768.02px){[data-bottom-cta-bar]{left:76px!important;width:calc((100% - 76px)/2)!important;}}`,
        }}
      />

      {/* One tree, laid out per breakpoint — NOT a desktop copy and a mobile
          copy. Rendering it twice put two <h1>s, two day-by-days and a repeated
          `bot-itinerary-day-1` id into the HTML, which on a page that exists to
          be crawled is duplicate content rather than a layout detail.
          On a phone the itinerary is the page and the chat is a sheet over
          it, so the column order is plain rather than reversed. */}
      <div className="flex flex-col ph-up:flex-row ph-up:h-screen ph-up:overflow-hidden ph-up:relative bg-white">
        {/* Navigation — the same rail BotApp puts beside a /chat itinerary, so
            this page opens the same way its live twin does. `contents` because
            the component renders a fragment: an overlay, an absolutely
            positioned rail, and a 76px spacer that holds the row open. A real
            wrapper here would box the spacer in and the columns would sit under
            the rail instead of beside it.

            The rail is `position: absolute; height: 100%`, so it anchors to the
            `ph-up:relative` on the row above — without that it resolves against
            the viewport and slides out from under the page.

            Hidden below 768px, where 76px of chrome would eat the itinerary it
            is meant to sit beside; the phone layout already has the site's own
            navigation above it. */}
        <div className="max-ph:hidden ph-up:contents">
          <Sidebar
            isCollapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed((collapsed) => !collapsed)}
            onNewChat={() => router.push("/chat")}
            onThreadSelect={(threadId, sessionId) =>
              router.push(sessionId ? `/chat/${sessionId}` : "/chat")
            }
            isComplete
          />
        </div>

        {/* Itinerary — half of what the rail leaves, internally scrolling on
            desktop; natural page flow on a phone. `flex-1 basis-0` rather than
            `w-1/2`: half of the FULL row would now overflow it by the rail's
            76px and push the chat off the right edge. */}
        <div className="flex flex-col min-w-0 ph-up:flex-1 ph-up:basis-0 ph-up:overflow-hidden ph-up:border-r ph-up:border-[#e5e5e5]">
          {itineraryColumn}
        </div>

        {/* Chat. Desktop: the right half, always open. Mobile: a full-screen
            sheet the floating Kaira button opens.

            Toggled with a class, never unmounted — Kaira's opening bubble is
            where the trip description lives, so unmounting it on a phone would
            take that copy out of the DOM entirely. `hidden` keeps it there. */}
        <div
          className={`flex-col min-w-0 ph-up:flex-1 ph-up:basis-0 ph-up:h-full ph-up:static ph-up:z-auto ph-up:flex
            max-ph:fixed max-ph:inset-0 max-ph:z-[2000] max-ph:bg-white
            ${chatOpen ? "max-ph:flex" : "max-ph:hidden"}`}
        >
          {/* Mobile-only dismiss. Desktop has nothing to close. */}
          <button
            type="button"
            onClick={() => setChatOpen(false)}
            aria-label="Close chat"
            className="ph-up:hidden absolute top-[14px] right-[14px] z-10 w-9 h-9 rounded-full bg-white/95 border border-[#e5e5e5] flex items-center justify-center shadow-sm"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#3b4149" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>

          <ArchiveChatPanel
            itineraryId={itinerary.id}
            introMessage={introMessage}
          />
        </div>

        {/* Floating Kaira button — mobile only, and only while the chat is
            closed. Sits clear of the fixed price bar rather than on top of it. */}
        {!chatOpen && (
          <button
            type="button"
            onClick={() => setChatOpen(true)}
            aria-label="Chat with Kaira"
            className="ph-up:hidden fixed right-4 bottom-[96px] z-[1500] w-[58px] h-[58px] rounded-full overflow-hidden border-2 border-white shadow-[0_6px_20px_rgba(11,18,32,0.28)] bg-[#a8d2f5]"
          >
            <img
              src="/KairaInsta.png"
              alt=""
              aria-hidden="true"
              width={58}
              height={58}
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-[3px] right-[3px] w-[12px] h-[12px] rounded-full bg-[#4ade80] border-2 border-white" />
          </button>
        )}

      </div>
    </>
  );
};

export default TripItineraryView;

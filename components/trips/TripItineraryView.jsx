// The itinerary view for an SEO trips leaf page, driven by the build-time
// snapshot.
//
// The shell keeps BotApp's nav rail on the left so a /trips leaf and a
// /chat/{id} archive open the same way. Everything to the right of it is a
// BLOG PAGE, not the chat shell: hero, then an article column carrying the
// itinerary, the FAQs and the sibling trips, with a sticky sidebar beside it.
// See TripBlogChrome for the layout and its provenance.
//
// The live chat panel that used to own the right half is gone. These pages are
// statically exported and evergreen — there is no thread to hold, so the panel
// spent half the viewport on something neither a reader nor a crawler could
// use. Cloning now happens through the sidebar's "Get my trip", which raises
// the same popup the bottom bar always did.
//
// The old shell was `h-screen overflow-hidden` with each column scrolling
// inside itself. That works while the page IS the two columns and breaks the
// moment anything sits beneath them, so the page scrolls as one document now.
//
// The difference from a live itinerary is the data — it comes from
// `.seo-cache` rather than a runtime fetch, so the whole itinerary is in the
// statically exported HTML. That is the point of these 1,718 pages.
//
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";

import DaybyDay from "../../containers/itinerary/DaybyDay";
import Sidebar from "../bot-components/components/Sidebar";
import CloneItineraryModal from "../bot-components/components/CloneItineraryModal";
import { BottomCTABar } from "../bot-components/BotApp";
import setItinerary from "../../store/actions/itinerary";
import setItineraryDaybyDay from "../../store/actions/itineraryDaybyDay";
import { setStays } from "../../store/actions/StayBookings";
import setItineraryStatus from "../../store/actions/itineraryStatus";
import { Wrap, Main, Article, Side } from "./TripBlogChrome";
import { roundedPerPerson } from "../../lib/seo/tripsFormat";

const TripItineraryView = ({
  itinerary,
  stays,
  /** Above the two columns, inside the measure: breadcrumb, H1, standfirst. */
  masthead = null,
  /** First thing in the left column: the photo carousel and the trust marks. */
  media = null,
  /** Rendered above the day-by-day — the itinerary block's own heading. */
  header = null,
  /** Under the day-by-day, still inside the article column: FAQs, more trips. */
  below = null,
  /**
   * The sticky sidebar. A render prop rather than a node so it can reach the
   * clone popup: that state lives here, and passing a ready-made element would
   * mean the caller had to own a second copy of it.
   */
  side = null,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  // The nav rail starts collapsed, exactly as BotApp's does. It expands as an
  // overlay rather than by reflowing the row, so the two columns beside it keep
  // their widths in both states.
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  // ── Desktop bottom bar: under the article column only ──────────────────────
  // From 1024px the page is two columns (TripBlogChrome's Main), and the bar
  // should run under the itinerary, not under the sticky sidebar beside it. A
  // `position: fixed` bar can't track a grid column in CSS, so the article's
  // left edge and width are measured and handed to the bar as `barStyle`.
  // Below 1024px the grid is one column and the CSS rule in the render below
  // lays the bar across the full width instead.
  const articleRef = useRef(null);
  const [desktopBarStyle, setDesktopBarStyle] = useState(null);

  useEffect(() => {
    const el = articleRef.current;
    if (!el || typeof window === "undefined") return undefined;

    const measure = () => {
      if (window.innerWidth < 1024) {
        setDesktopBarStyle(null);
        return;
      }
      const rect = el.getBoundingClientRect();
      setDesktopBarStyle((prev) =>
        prev && prev.left === rect.left && prev.width === rect.width
          ? prev
          : { left: rect.left, width: rect.width, visibility: "visible" },
      );
    };

    measure();
    window.addEventListener("resize", measure);
    // The column also changes width without a window resize — fonts loading,
    // the gallery settling — so the element itself is observed too.
    const observer =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    observer?.observe(el);
    return () => {
      window.removeEventListener("resize", measure);
      observer?.disconnect();
    };
  }, []);
  // The bar's CTA opens the clone popup. The state lives here rather than being
  // passed in: the bar and the popup are both this component's, so a caller
  // that forgets to wire a handler (which is what left "Get this trip!" doing
  // nothing) can't happen.
  const [showCloneModal, setShowCloneModal] = useState(false);

  // Seeding the store is idempotent, so it can be expressed once and used both
  // during render (for the server HTML) and from an effect (see the cleanup
  // below).
  const seedStore = () => {
    if (!itinerary) return;

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
  };

  useState(() => {
    seedStore();
    return null;
  });

  // ── Hand the store back on the way out ────────────────────────────────────
  // The snapshot carries `is_v1_archive: true` (lib/seo/tripItinerary), and the
  // store outlives this page: a client-side navigation into /chat left that
  // flag set, so BotApp took its archive branch and rendered the static clone
  // CTA — "Make this trip yours" and a "Clone this itinerary" composer — on top
  // of a brand new chat. Every route out of here hit it: the sidebar's New chat
  // and its thread list both push into BotApp.
  //
  // Clearing the same keys this page seeded is the fix. The statuses go back to
  // PENDING rather than being left SUCCESS, which is what BotApp's own
  // handleNewChat does — a fresh chat has nothing settled yet.
  //
  // Setup re-seeds rather than relying on the render-time seed alone, so the
  // pair stays balanced if StrictMode ever double-invokes effects: seed →
  // clear → seed leaves the store correct, where a bare cleanup would blank the
  // itinerary on the second pass.
  useEffect(() => {
    seedStore();
    return () => {
      dispatch(setItinerary({}));
      dispatch(setItineraryDaybyDay({}));
      dispatch(setStays([]));
      dispatch(setItineraryStatus("itinerary_status", "PENDING"));
      dispatch(setItineraryStatus("hotels_status", "PENDING"));
      dispatch(setItineraryStatus("transfers_status", "PENDING"));
      dispatch(setItineraryStatus("pricing_status", "PENDING"));
      dispatch(setItineraryStatus("finalized_status", "PENDING"));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!itinerary) return null;

  const price = itinerary.trip_price;
  // The snapshot's price is already in rupees (the V1 archive's is in paise),
  // so it is not divided — but it IS rounded the same way as every other price
  // on the page. The sidebar, the standfirst and the JSON-LD all go through
  // roundedPerPerson (nearest ₹100); the bar used the raw figure, so a
  // ₹2,08,333.28 trip read ₹2,08,300 in the sidebar and ₹2,08,333 in the bar.
  const perPerson = roundedPerPerson(price);
  const archivePrice = perPerson
    ? {
        amount: perPerson,
        perPerson: true,
        code: price?.currency || "INR",
      }
    : null;

  return (
    <>
      {/* The one clone popup on the page. The sidebar CTA and the phone bar
          both raise it. */}
      <CloneItineraryModal
        show={showCloneModal}
        onHide={() => setShowCloneModal(false)}
        itineraryId={itinerary.id}
      />

      {/* The pinned price bar shows at every width — phone, tablet and desktop —
          so "Get this trip!" stays in reach however far down the day-by-day the
          reader is.

          The bar's own classes size it for the /chat split pane (`md:w-[48%]`):
            • 768–1023px (one column, nav rail showing): re-laid across the full
              width beside the 76px rail.
            • 1024px+ (two columns): sized to the article column only, via the
              measured `barStyle` above, so it never runs under the sidebar.
              Hidden until that first measurement lands, so it can't flash
              full-width; the inline `visibility` then wins over this rule. */}
      <style
        dangerouslySetInnerHTML={{
          __html: [
            `@media (min-width:768.02px) and (max-width:1023.98px){[data-bottom-cta-bar]{left:76px!important;width:calc(100% - 76px)!important;}}`,
            `@media (min-width:1024px){[data-bottom-cta-bar]{visibility:hidden;}}`,
          ].join(""),
        }}
      />

      <div className="flex items-start bg-white">
        {/* Navigation — the same rail BotApp puts beside a /chat itinerary.
            Outside the document column, as a flex sibling of the whole page, so
            `sticky` has the full scroll to travel; its box is one viewport tall
            because the component's own rail is `absolute; height:100%` within
            it. Hidden below 768px, where 76px of chrome would eat the article
            it is meant to sit beside. */}
        <div className="max-ph:hidden sticky top-0 h-screen w-[76px] shrink-0 relative z-[160]">
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

        {/* `min-w-0` so the day-by-day's wide rows shrink inside the flex item
            rather than pushing the whole page sideways.

            The right margin is the nav rail's width, mirrored. Everything below
            lives inside `Wrap`, which centres itself in THIS column — and the
            column started 76px in from the left edge because the rail is a flex
            sibling ahead of it. So the page was 76px of dead space on the left
            plus 28px of gutter, against 28px on the right: at 1280 the article
            sat 104px from the edge and the sidebar 30px from the other. That
            reads as a page shoved sideways, which is the "too much padding on
            the left" of it. Matching the rail on the right re-centres the
            document over the viewport at every width. */}
        <div className="flex-1 min-w-0 ph-up:mr-[76px]">
          <Wrap>
            {masthead}

            <Main>
              <Article ref={articleRef}>
                {/* The photographs open the column, so the price panel beside
                    them starts level with the first picture rather than a
                    screen further down. */}
                {media}

                {/* The itinerary. Same day-by-day component as a live
                    itinerary — only the chrome around it changed. */}
                <section id="itinerary">
                  {header}
                  <DaybyDay
                    fromChat
                    mercuryItinerary
                    showPins={false}
                    isDraft={false}
                  />
                </section>

                {below}
              </Article>

              <Side>{side?.({ onGetThisTrip: () => setShowCloneModal(true) })}</Side>
            </Main>
          </Wrap>

          {/* Every width — see the style block above. */}
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
            barStyle={desktopBarStyle || undefined}
          />

          {/* Clears the fixed bar, which now shows at every width. */}
          <div className="h-[92px]" aria-hidden />
        </div>
      </div>
    </>
  );
};

export default TripItineraryView;

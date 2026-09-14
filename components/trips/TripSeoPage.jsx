// Body of an SEO trips leaf page (/trips/<destination>/<slug>).
//
// This file decides WHAT the page says; TripBlogChrome decides how it looks and
// TripItineraryView assembles the shell. The layout is the production blog
// template — hero, a 760px article column, a 340px sticky sidebar — rather than
// the chat split these pages used to carry.
//
// Everything renders on the server. There is no `useEffect` that reveals
// content and no media-query branch that swaps layouts — the whole point of
// these pages is that a crawler which runs no JavaScript sees the standfirst,
// the day-by-day and the FAQs in the HTML. The FAQ is a <details>, so its
// answers are in the markup whether or not it is open.
//
// No calendar dates appear anywhere. The upstream itinerary has real start and
// end dates on it, but these are evergreen pages: a trip stamped "8 Dec 2026"
// is stale the moment that date passes, and the dates belong to a real
// customer's booking. lib/seo/tripsIndexed.js strips them; days arrive here
// already numbered.

import { SITE_ORIGIN } from "../../lib/seo/siteOrigin";
import TripItineraryView from "./TripItineraryView";
import {
  TripMasthead,
  TripGallery,
  TripTrustBar,
  TripFaqs,
  TripSiblings,
  TripSideBoxes,
  SectionTitle,
  SectionNote,
} from "./TripBlogChrome";
import { resolveImageUrl } from "../../helper/imageUrl";
import { tripName } from "../../lib/seo/tripName";
import {
  destinationLabel,
  durationLabel,
  formatINR,
  roundedPerPerson,
} from "../../lib/seo/tripsFormat";

// Where the sidebar's "Chat with Kaira" goes. `?seed=` is the same parameter
// the blog's own sidebar CTA uses, so the thread opens with the reader's
// context already stated.
const CHAT_SEED = "/chat?seed=";

// ── Helpers ─────────────────────────────────────────────────────────────────

const DEFAULT_HERO = `${SITE_ORIGIN}/og-image.png`;

/**
 * The trip's own photographs.
 *
 * The itinerary gallery first — the same endpoint the live itinerary page
 * uses, cached into the snapshot by scripts/tripsSeoCache.js. It is the only
 * complete source: forty deduped pictures of the cities, hotels and places this
 * trip actually visits, against the handful the SEO payload's own keys yield.
 *
 * Cities are put in front of POIs so the page opens on a skyline rather than on
 * a museum entrance, and so the hero photograph is of somewhere the trip goes
 * rather than of one thing it does there. Order is otherwise the gallery's own,
 * which is route order.
 *
 * The old city/day walk stays as the fallback for a snapshot written before the
 * gallery was cached — the page still works, it just has fewer photos.
 */
const tripShots = (page) => {
  const gallery = Array.isArray(page?.gallery) ? page.gallery : [];
  if (gallery.length) {
    const rank = (shot) => (shot?.type === "city" ? 0 : 1);
    return gallery
      .map((shot, i) => ({ ...shot, i }))
      .sort((a, b) => rank(a) - rank(b) || a.i - b.i)
      .map((shot) => ({ image: shot.image, title: shot.caption || "" }));
  }

  const shots = [];
  for (const city of page?.cities || []) {
    if (city?.image) shots.push({ image: city.image, title: city.name });
  }
  for (const day of page?.days || []) {
    for (const el of day?.elements || []) {
      if (el?.image && el?.heading) shots.push({ image: el.image, title: el.heading });
    }
  }
  return shots;
};

/**
 * `images` is null on about four rows in five, so the gallery is the real source
 * here and the city photos are the fallback behind it; the site default is the
 * last resort. Returned as a raw reference; callers pick their own resolver.
 */
export const heroImageRef = (page) => {
  if (Array.isArray(page?.images) && page.images.length) return page.images[0];
  const shot = tripShots(page)[0];
  return shot?.image || null;
};

/** Absolute URL for og:image — meta tags cannot take a bare media key. */
export const heroImageUrl = (page) => resolveImageUrl(heroImageRef(page)) || DEFAULT_HERO;

// ── Component ───────────────────────────────────────────────────────────────

const TripSeoPage = ({
  page,
  siblings = [],
  // Build-time itinerary state for the V1 view. `stays` is renamed on the way
  // in because the raw snapshot also has a `stays` key with a different shape.
  itinerary = null,
  stays: itineraryStays = [],
}) => {
  const {
    destination,
    group_type: groupType,
    duration,
    cities = [],
    stays = [],
    days = [],
    faqs = [],
  } = page;

  // What the page calls this trip: its own short name, minus the customer
  // credit — see lib/seo/tripName. The SEO `h1` is the fallback behind it and
  // not the first choice: it is written for a search result and just restates
  // the slug at 75 characters ("9 Nights 10 Days Europe Honeymoon Itinerary:
  // Amsterdam, Paris, Zurich & More"), which is a mouthful as a heading.
  const title = tripName(page) || `${destinationLabel(destination)} itinerary`;

  const region = destinationLabel(destination);
  const perPerson = roundedPerPerson(page.price);
  const shots = tripShots(page);

  const activities = days.reduce(
    (sum, day) =>
      sum + (day?.elements || []).filter((e) => e?.type === "activity").length,
    0,
  );

  // Only what the snapshot can actually prove, the same rule tripsCards follows
  // for a card's `includes` — no guessing at flights.
  const includes = [
    stays.length ? `${stays.length} hotel stays` : null,
    activities ? `${activities} booked experiences` : null,
    cities.length > 1 ? "Inter-city transfers" : null,
    "Breakfast where the stay offers it",
  ].filter(Boolean);

  const metaLine = [groupType, durationLabel(duration)]
    .filter(Boolean)
    .join(" · ");

  const routeLine = cities
    .map((c) => `${c.name}${c.nights > 0 ? ` (${c.nights}N)` : ""}`)
    .join(" → ");

  // The standfirst under the H1 is the route and the price — two lines, the
  // length the blog's `.dek` is built for.
  //
  // It is also now the only prose above the day-by-day: the snapshot's `intro`
  // opened the article as an "About this trip" block, and that block is gone.
  // It restated the route the standfirst already gives and the inclusions the
  // sidebar already lists, then put a paragraph between the reader and the
  // thing they came for. `intro` is still in the snapshot and still feeds the
  // meta description.
  const description = [
    routeLine,
    perPerson ? `From ${formatINR(perPerson)} per person` : null,
    groupType ? `Built for a ${String(groupType).toLowerCase()} group and released as a real trip` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const chatHref = `${CHAT_SEED}${encodeURIComponent(
    `I was looking at your ${title} (${routeLine}). Reshape it for me — start by asking my travel dates, budget per person and group size.`,
  )}`;

  return (
    <TripItineraryView
      itinerary={itinerary}
      stays={itineraryStays}
      masthead={
        <TripMasthead
          page={page}
          title={title}
          region={region}
          metaLine={metaLine}
          description={description}
        />
      }
      media={
        <>
          <TripGallery shots={shots} />
          <TripTrustBar />
        </>
      }
      header={
        <>
          <SectionTitle>
            The <em>day by day</em>
          </SectionTitle>
          <SectionNote>
            {duration
              ? `Every day of the ${durationLabel(duration)} plan, in order`
              : "Every day of the plan, in order"}
            {cities.length ? ` across ${cities.length} stops` : ""} — with the
            stays and the experiences that are already booked into it.
          </SectionNote>
        </>
      }
      below={
        <>
          <TripFaqs faqs={faqs} region={region} />
          <TripSiblings siblings={siblings} region={region} />
        </>
      }
      side={({ onGetThisTrip }) => (
        <TripSideBoxes
          perPerson={perPerson}
          includes={includes}
          onGetThisTrip={onGetThisTrip}
          chatHref={chatHref}
          destinationName={region}
        />
      )}
    />
  );
};

export default TripSeoPage;

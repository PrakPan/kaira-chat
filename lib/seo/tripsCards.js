// Card models for the trips listings.
//
// Turns a row from the trips index into the object <ItineraryCardV2> reads, so
// /trips, /trips/<destination> and the "more trips" block on a leaf all render
// the same card as the rest of the site.
//
// Build-time only: readTripPage touches the filesystem, so this must be called
// from getStaticProps/getStaticPaths and never imported by a component.

const { readTripPage } = require("./tripsCache");
// Pure module (no `fs`) so the filter bar can share these — see tripLength.js.
const { lengthBucket } = require("./tripLength");
const { tripTheme } = require("./tripTheme");

/**
 * Inclusion counts the cache can actually prove.
 *
 * Read from `stays` and `days`, which is where the snapshot carries them —
 * `routes` was the previous shape and is now empty on every payload, so
 * counting from it silently produced zero stays and zero activities on every
 * card.
 *
 * Flights and transfers are not in the payload at all — no day element is typed
 * as either — so they are left out of the list entirely. That is the reason
 * `includes` is built here and passed through explicitly: ItineraryCardV2's own
 * fallbacks would otherwise fill the gap with a guess (two flights for any
 * multi-city trip, one transfer per hop), printed as fact on 1,718 indexed
 * pages.
 */
const countFromPage = (page) => {
  const stays = (page?.stays || []).length;

  let activities = 0;
  for (const day of page?.days || []) {
    for (const element of day?.elements || []) {
      if ((element?.type || element?.element_type) === "activity") {
        activities += 1;
      }
    }
  }

  return { stays, activities };
};

/**
 * A trip-level image exists on roughly one in five cached trips; a city image
 * exists on almost all of them, so it is the fallback rather than shipping a
 * card with an empty frame.
 */
const cardImage = (row, page) => {
  const own =
    (Array.isArray(row?.images) && row.images[0]) ||
    (Array.isArray(page?.images) && page.images[0]);

  if (own) return typeof own === "string" ? own : own?.image || null;

  return (page?.cities || []).map((city) => city?.image).find(Boolean) || null;
};

/** One index row -> the shape <ItineraryCardV2 itinerary={...} /> expects. */
function tripCard(row) {
  if (!row?.slug) return null;

  const page = readTripPage(row.slug) || {};
  const cities = page.cities || [];
  const duration = row.duration ?? page.duration;
  const groupType = row.group_type || page.group_type;
  const perPerson = page?.price?.per_person;
  const { stays, activities } = countFromPage(page);
  const image = cardImage(row, page);

  return {
    name: row.name || page.name,
    // ItineraryCardV2 derives its href as `/itinerary/<id>` when an id is
    // present. These pages live at their own SEO URL, so the id is deliberately
    // withheld and `path` — which the card uses verbatim — carries the real one.
    path: String(row.url || page.url || "").replace(/^\/+/, ""),
    images: image ? [image] : null,
    cities: cities
      .map((city) => ({ name: city?.name }))
      .filter((city) => city.name),
    // The group type stands on its own — "Friends", not "Friends trip". The
    // card sits in a list of trips, so the noun is already established and
    // repeating it on every badge just makes the chip longer.
    //
    // Never left to default: the card falls back to "Most popular" when given
    // no tier, and that is a claim none of these trips has earned.
    tier: groupType || (duration ? `${duration} Nights` : null),
    payment_information: perPerson ? { per_person_cost: perPerson } : null,
    includes: [
      duration ? `${duration} ${duration === 1 ? "Night" : "Nights"}` : null,
      stays ? `${stays} ${stays === 1 ? "Stay" : "Stays"}` : null,
      activities
        ? `${activities} ${activities === 1 ? "Activity" : "Activities"}`
        : null,
    ].filter(Boolean),
    currency: page?.price?.currency || "INR",
    // Filter metadata. Not rendered by the card — the hub reads it to build its
    // filter bar and to decide which cards a selection keeps.
    filters: {
      group: groupType || null,
      length: lengthBucket(duration),
      // What the trip is FOR, in the traveller's words — honeymoon, family,
      // friends, solo. One per trip, derived from the slug/H1 with group_type
      // as the fallback (see tripTheme).
      theme: tripTheme({ ...row, group_type: groupType }),
      // The vibe tags. A trip carries several, so this filter matches on
      // "has", and it is only offered where most of the set is tagged.
      vibes: (page.experience_filters || []).filter(
        (t) => typeof t === "string" && t.trim(),
      ),
    },
  };
}

module.exports = { tripCard };

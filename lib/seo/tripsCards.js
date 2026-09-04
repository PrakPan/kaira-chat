// Card models for the trips listings.
//
// Turns a row from the trips index into the object <ItineraryCardV2> reads, so
// /trips, /trips/<destination> and the "more trips" block on a leaf all render
// the same card as the rest of the site.
//
// Build-time only: readTripPage touches the filesystem, so this must be called
// from getStaticProps/getStaticPaths and never imported by a component.

const { readTripPage } = require("./tripsCache");

/**
 * Inclusion counts the cache can actually prove.
 *
 * `routes` carries the real per-city hotels and day elements, so stays and
 * activities are counted rather than estimated. Flights and transfers are not
 * in the payload at all — no element in the cache is typed as either — so they
 * are left out of the list entirely. That is the reason `includes` is built
 * here and passed through explicitly: ItineraryCardV2's own fallbacks would
 * otherwise fill the gap with a guess (two flights for any multi-city trip, one
 * transfer per hop), which would be printed as fact on 1,718 indexed pages.
 */
const countFromRoutes = (routes) => {
  let stays = 0;
  let activities = 0;

  for (const route of routes || []) {
    stays += (route?.hotels || []).length;

    for (const day of route?.day_by_day || []) {
      for (const element of day?.slab_elements || []) {
        if ((element?.element_type || element?.type) === "activity") {
          activities += 1;
        }
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
  const { stays, activities } = countFromRoutes(page.routes);
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
    // Never left to default: the card falls back to "Most popular" when given
    // no tier, and that is a claim none of these trips has earned.
    tier: groupType ? `${groupType} trip` : duration ? `${duration} Nights` : null,
    payment_information: perPerson ? { per_person_cost: perPerson } : null,
    includes: [
      duration ? `${duration} ${duration === 1 ? "Night" : "Nights"}` : null,
      stays ? `${stays} ${stays === 1 ? "Stay" : "Stays"}` : null,
      activities
        ? `${activities} ${activities === 1 ? "Activity" : "Activities"}`
        : null,
    ].filter(Boolean),
    currency: page?.price?.currency || "INR",
  };
}

module.exports = { tripCard };

// lib/tripsSeo.js
//
// The /trips pages are indexed for organic search, and their head tags used to
// come from the supplier portal's plan payload: page_title, meta_description,
// social titles, itinerary_locations, review, rating_count, price. None of that
// survived into the S3 archive, so what can be rebuilt is rebuilt from the one
// field that still identifies the page — its slug.
//
// The slug is `slugify(page_title) + "-" + <last segment of the itinerary UUID>`
// (verified: the tail matched the UUID's final 12 chars on 658/658 trips), so
// de-slugifying the text half reproduces the original page_title almost exactly
// — 17 of 20 sampled were character-identical, the other 3 differed only in
// punctuation ("Trip - Europe (4-Stars)" vs "Trip Europe (4 Stars)").
//
// What cannot be rebuilt: the review score, rating count and price. Those drop
// out of the JSON-LD entirely rather than being guessed — the page already
// spreads them in conditionally.

// Words that stay lowercase inside a title.
const SMALL = new Set([
  "in", "to", "and", "of", "the", "a", "with", "for", "across", "at", "on",
]);

// The trailing hex chunk is the itinerary UUID's last segment, never content.
const stripIdSuffix = (slug) => String(slug || "").replace(/-[0-9a-f]{8,}$/i, "");

const titleCase = (segment) =>
  segment
    .split("-")
    .filter(Boolean)
    .map((w) => (SMALL.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");

/**
 * "5-nights-family-excursion-in-uttarakhand-b14290a8274d"
 *   -> "5 Nights Family Excursion in Uttarakhand"
 */
export function titleFromSlug(slug) {
  const core = stripIdSuffix(slug);
  return core ? titleCase(core) : "";
}

/**
 * The destination, but only when the slug states it explicitly after an
 * "in-" / "to-" / "across-" preposition — that form was correct on 12 of 14
 * sampled trips (the two misses differed only as "and" vs "&").
 *
 * Slugs that bury the destination mid-string ("4-nights-coorg-excursion")
 * return null rather than a guess: naming the wrong place in a meta description
 * is worse than a slightly blander one, so callers fall back to the title.
 */
export function destinationFromSlug(slug) {
  const core = stripIdSuffix(slug);
  const match = core.match(/-(?:in|to|across)-(.+)$/);
  return match ? titleCase(match[1]) : null;
}

/**
 * Rebuilds the supplier's meta description template. It read:
 *   "Travel with our free handcrafted itinerary to <destination> covering
 *    <cities>. Explore unique stays, book flights, activities and transfers…"
 * The city list came from `itinerary_locations`, which the archive dropped, so
 * that clause is omitted rather than fabricated.
 */
export function descriptionFromSlug(slug) {
  const destination = destinationFromSlug(slug);
  const subject = destination
    ? `itinerary to ${destination}`
    : `itinerary — ${titleFromSlug(slug)}`;
  return (
    `Travel with our free handcrafted ${subject}. ` +
    `Explore unique stays, book flights, activities and transfers, ` +
    `and tailor every day to how you like to travel.`
  );
}

export default titleFromSlug;

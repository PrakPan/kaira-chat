// V1 itinerary archive.
//
// Everything a V1 itinerary page used to assemble from six supplier calls
// (day_by_day, brief, routes, plan, bookings, payment) now lives in a single
// object in the `ttw-v1-itineraries-data` bucket, keyed by itinerary id:
//
//   itineraries/<uuid>.json
//
// It is fetched through CloudFront, not S3 directly: the edge gzips the JSON
// (~4-5x) and the objects are immutable, so a warm cache means near-zero S3
// GETs and egress. Same cost reasoning as the image handler in lib/mediaImage.
//
// Deliberately uses bare `fetch` with no custom headers so the request stays a
// CORS "simple request" — adding an Authorization or Content-Type header would
// trigger a preflight that S3 has no reason to answer. There is no auth here:
// these are the same unauthenticated previews the supplier portal served.

import { V1_ITINERARY_CDN } from "../../constants";

export const v1ItineraryUrl = (id) =>
  `${String(V1_ITINERARY_CDN).replace(/\/+$/, "")}/itineraries/${encodeURIComponent(id)}.json`;

/**
 * Fetch one archived V1 itinerary.
 *
 * Resolves to `null` when the itinerary isn't in the archive (404/403 — S3
 * answers 403 for a missing key when ListBucket isn't granted, which is our
 * case), so callers can treat "not a V1 itinerary" as a normal outcome rather
 * than an error. Anything else throws.
 */
export async function fetchV1Itinerary(id, { signal } = {}) {
  if (!id) return null;

  const res = await fetch(v1ItineraryUrl(id), {
    method: "GET",
    signal,
    // The objects are immutable and served with a long max-age; let the
    // browser's HTTP cache do its job.
    cache: "force-cache",
  });

  if (res.status === 404 || res.status === 403) return null;
  if (!res.ok) {
    throw new Error(`[v1-archive] ${res.status} for itinerary ${id}`);
  }

  return res.json();
}

export const tripsIndexUrl = () =>
  `${String(V1_ITINERARY_CDN).replace(/\/+$/, "")}/trips/index.json`;

/**
 * The indexed-trips manifest: `[{ slug, id, group_type }]`.
 *
 * This replaces the supplier's /sales/itinerary/indexed/ endpoint, which is the
 * only place the slug ever existed — it is not in the itinerary objects and is
 * not derivable from them (the slug's text half needs a destination label that
 * the archive does not carry). getStaticPaths reads this to build the 644
 * /trips URLs, so if it fails the export would silently emit zero trips pages;
 * callers should treat a throw as fatal rather than defaulting to an empty list.
 *
 * Only trips whose itinerary object actually exists are listed — a slug without
 * a payload would fail getStaticProps and take the whole export down with it.
 */
export async function fetchTripsIndex() {
  const res = await fetch(tripsIndexUrl(), { method: "GET" });
  if (!res.ok) throw new Error(`[v1-archive] ${res.status} for trips index`);

  const index = await res.json();
  if (!Array.isArray(index) || !index.length) {
    throw new Error("[v1-archive] trips index is empty or malformed");
  }
  return index;
}

export default fetchV1Itinerary;

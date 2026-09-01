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

export default fetchV1Itinerary;

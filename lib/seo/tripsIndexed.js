// Data layer for the SEO trips pages (/trips/<destination>/<slug>).
//
// Two upstream sources, and the difference between them is the whole reason
// this file exists:
//
//   1. /api/v1/website/itinerary/indexed[/<slug>/]  — the SEO layer added in
//      backend v9.3.8. Public by design: slug, titles, meta, intro copy, FAQs,
//      cities+nights, price. Safe to render verbatim.
//
//   2. /api/v1/itinerary/<id>/ — the itinerary the app already uses. This is
//      where the day-by-day body lives, and it is NOT public-safe: it carries
//      `customer_name` (a real person's name), `travellers`, party sizes and
//      the real `start_date`/`end_date` of somebody's booked trip.
//
// The V1 S3 archive (services/itinerary/v1/archive.js) cannot serve source 2
// here: it holds 644 V1 itineraries and the 1,718 indexed trips are all V2 —
// the id sets do not intersect at all (verified: overlap = 0).
//
// So every field that reaches a rendered page passes through toPublicTrip()
// below, which is an allowlist, not a blocklist. Nothing is spread, nothing is
// passed through by default: a new PII field appearing upstream is dropped
// because it was never named here.

const MERCURY_HOST = (
  process.env.NEXT_PUBLIC_MERCURY_HOST || "https://mercury.tarzanway.com"
).replace(/\/+$/, "");

const SITE_ORIGIN = "https://thetarzanway.com";

const INDEXED_BASE = `${MERCURY_HOST}/api/v1/website/itinerary/indexed`;

// The list endpoint caps `limit` at 100.
const PAGE_SIZE = 100;

const getJson = async (url, { timeout = 30000 } = {}) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(url, { signal: controller.signal });
    // 404 is a normal answer here — an unknown or de-indexed slug — and the
    // caller turns it into notFound rather than an error.
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`[trips-seo] ${res.status} for ${url}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
};

/**
 * Every indexed trip, paginated to exhaustion.
 *
 * `results` is the total count, so the loop is bounded by it rather than by
 * following `next` — the API returns `next` on the www. host, which would
 * bounce through a redirect on every page.
 */
async function fetchIndexedList({ destination, groupType } = {}) {
  const params = [];
  if (destination) params.push(`destination=${encodeURIComponent(destination)}`);
  if (groupType) params.push(`group_type=${encodeURIComponent(groupType)}`);

  const rows = [];
  let offset = 0;
  let total = Infinity;

  while (rows.length < total) {
    const query = [...params, `limit=${PAGE_SIZE}`, `offset=${offset}`].join("&");
    const payload = await getJson(`${INDEXED_BASE}?${query}`);
    const batch = payload?.data || [];

    if (typeof payload?.results === "number") total = payload.results;
    if (!batch.length) break;

    rows.push(...batch);
    offset += PAGE_SIZE;
  }

  // The paginated reads are not one snapshot, so a row can arrive twice if the
  // set shifts mid-crawl. Deduping on slug keeps getStaticPaths from emitting
  // duplicate params, which Next treats as a build error.
  const bySlug = new Map();
  for (const row of rows) {
    if (row?.slug) bySlug.set(row.slug, row);
  }

  return [...bySlug.values()];
}

/** The SEO payload for one slug, or null when the slug is unknown/de-indexed. */
async function fetchIndexedDetail(slug) {
  const payload = await getJson(
    `${INDEXED_BASE}/${encodeURIComponent(slug)}/`
  );
  return payload?.data || null;
}

/** The raw itinerary. PII-bearing — never let this reach props unsanitised. */
async function fetchItineraryContent(id) {
  return getJson(`${MERCURY_HOST}/api/v1/itinerary/${encodeURIComponent(id)}/`);
}

// ── Sanitisation ────────────────────────────────────────────────────────────

const str = (value) => (typeof value === "string" && value.trim() ? value.trim() : null);

const cleanList = (value, fn) =>
  Array.isArray(value) ? value.map(fn).filter(Boolean) : [];

/**
 * One entry inside a day — an activity, transfer or note.
 *
 * `start_time`/`end_time` are clock times ("10:00"), not dates, so they are
 * safe; `time` is a coarse band ("Afternoon") and is what actually gets
 * rendered. Nothing that identifies a booking or a traveller is kept: the
 * `booking` object (id, pax) and the activity UUID are dropped.
 */
const publicElement = (element) => {
  if (!element || typeof element !== "object") return null;

  const heading = str(element.heading) || str(element.name);
  if (!heading) return null;

  return {
    heading,
    oneLiner: str(element.one_liner),
    band: str(element.time),
    type: str(element.element_type),
    tags: cleanList(element.tags, str).slice(0, 4),
    image: str(element.icon),
  };
};

/**
 * Day-by-day, renumbered off calendar dates.
 *
 * The trip's real dates must not appear on an evergreen page, but they are the
 * only thing that orders the days — and consecutive cities share the transition
 * date (the checkout day of one city is the arrival day of the next), so the
 * per-city day lists overlap by one. Grouping on the distinct dates in order
 * collapses that overlap and yields nights+1 days, which is exactly the
 * "6 Nights 7 Days" the titles promise. The dates themselves are then thrown
 * away and only the 1-based index survives.
 */
const publicDays = (cities) => {
  const byDate = new Map();

  for (const city of cities) {
    const cityName = str(city?.city?.name);

    for (const day of city?.day_by_day || []) {
      const key = str(day?.date);
      if (!key) continue;

      if (!byDate.has(key)) byDate.set(key, { cities: [], summaries: [], elements: [] });
      const bucket = byDate.get(key);

      if (cityName && !bucket.cities.includes(cityName)) bucket.cities.push(cityName);

      const summary = str(day?.day_summary);
      if (summary && !bucket.summaries.includes(summary)) bucket.summaries.push(summary);

      bucket.elements.push(...cleanList(day?.slab_elements, publicElement));
    }
  }

  return [...byDate.entries()]
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([, bucket], index) => ({
      day: index + 1,
      cities: bucket.cities,
      summaries: bucket.summaries,
      elements: bucket.elements,
    }));
};

/** Hotels are trip inclusions, not customer data — name and star only. */
const publicStays = (cities) =>
  cities.flatMap((city) => {
    const cityName = str(city?.city?.name);

    return cleanList(city?.hotels, (hotel) => {
      const name = str(hotel?.name);
      if (!name) return null;

      return {
        name,
        city: cityName,
        stars:
          typeof hotel?.star_category === "number" ? hotel.star_category : null,
      };
    });
  });

/**
 * The public projection of /api/v1/itinerary/<id>/.
 *
 * Allowlist by construction. `customer_name`, `travellers`, `start_date`,
 * `end_date`, `number_of_adults`, `number_of_children`, `budget`,
 * `hotels_config` and `similar_route_stats` are all present upstream and none
 * of them are named below, so none of them can reach a page.
 */
function toPublicTrip(raw) {
  if (!raw || typeof raw !== "object") return null;

  const cities = Array.isArray(raw.cities) ? raw.cities : [];

  return {
    days: publicDays(cities),
    stays: publicStays(cities),
  };
}

/**
 * Canonical URL for a trip. The API's `url` is authoritative — paths are never
 * rebuilt from destination+slug, because the API is the thing that decides how
 * a page is addressed and a locally-derived path would drift the moment it
 * changed.
 */
const canonicalUrl = (url) => `${SITE_ORIGIN}${url}`;

module.exports = {
  MERCURY_HOST,
  SITE_ORIGIN,
  fetchIndexedList,
  fetchIndexedDetail,
  fetchItineraryContent,
  toPublicTrip,
  canonicalUrl,
};

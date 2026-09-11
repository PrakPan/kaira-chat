// Prebuild fetch for the SEO trips pages.
//
// 1,718 leaf pages, each needing two upstream calls (the SEO payload for the
// slug, plus the itinerary for its day-by-day body). Left to getStaticProps
// that is ~3,400 requests issued from however many workers Next decides to run,
// with no shared retry policy and no way to see what failed until a page comes
// out blank.
//
// So the network happens once, here, and the build reads the filesystem. That
// also means the sitemap and the pages are generated from the same snapshot
// rather than two independent crawls that can disagree.
//
// Everything written under .seo-cache/trips/ has already been through
// toPublicTrip() — the PII allowlist in lib/seo/tripsIndexed.js. The raw
// itinerary response never touches disk.

const fs = require("fs");
const path = require("path");

const {
  fetchIndexedList,
  fetchIndexedDetail,
  fetchItineraryContent,
  fetchItineraryGallery,
  toPublicTrip,
  toPublicGallery,
} = require("../lib/seo/tripsIndexed");

const CACHE_DIR = path.join(process.cwd(), ".seo-cache");
const PAGES_DIR = path.join(CACHE_DIR, "trips");
const INDEX_FILE = path.join(CACHE_DIR, "trips-index.json");

// scripts/pageGroups.js moves pages/trips out of the tree unless the deploy
// selected the trips group, so a normal release does not rebuild the leaf
// pages. Fetching 1,718 bodies for pages this build will not emit would add
// ~10 minutes to every deploy for nothing. The index is still fetched either
// way: the sitemap must keep listing the trips URLs that are already live on
// S3, which a partial deploy leaves untouched.
const TRIPS_IN_BUILD = fs.existsSync(path.join(process.cwd(), "pages", "trips"));

// Mercury is the constraint, not us: 10 in flight is what it was tuned to.
// Raise it with TRIPS_CACHE_CONCURRENCY when you know the backend can take it.
const CONCURRENCY = Number(process.env.TRIPS_CACHE_CONCURRENCY || 10);
const ATTEMPTS = 3;

// A full crawl is 1,718 x 2 upstream calls, ~2m45s of a -trips build spent
// re-fetching itineraries that have not changed. The index row carries the
// trip's own modified_at, so a cached page whose stamp still matches is reused
// and never refetched. TRIPS_CACHE_FORCE=1 crawls everything regardless.
const FORCE = process.env.TRIPS_CACHE_FORCE === "1";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const withRetry = async (label, fn) => {
  let lastErr;

  for (let attempt = 1; attempt <= ATTEMPTS; attempt += 1) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (attempt < ATTEMPTS) await sleep(attempt * 750);
    }
  }

  console.warn(`[trips-seo] ${label} failed after ${ATTEMPTS} attempts: ${lastErr?.message}`);
  return undefined;
};

/** Fixed-size worker pool — keeps mercury at a steady 10 in flight. */
const mapPool = async (items, worker) => {
  let cursor = 0;

  const runners = Array.from({ length: Math.min(CONCURRENCY, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      await worker(items[index], index);
    }
  });

  await Promise.all(runners);
};

const buildPage = async (row) => {
  const detail = await withRetry(`detail ${row.slug}`, () => fetchIndexedDetail(row.slug));

  // undefined = the fetch never succeeded; null = the API answered 404, which
  // means the slug was de-indexed between the list read and now. Either way
  // there is no page to write.
  if (!detail) return { slug: row.slug, ok: false, deindexed: detail === null };

  const raw = await withRetry(`itinerary ${row.slug}`, () =>
    fetchItineraryContent(detail.id)
  );

  // A missing body is not fatal: the SEO payload alone still carries the intro,
  // cities, price and FAQs, which is a real page. It just loses the day-by-day.
  const content = raw ? toPublicTrip(raw) : null;

  // The trip's photographs. A third upstream call per slug, and worth it: the
  // SEO payload's `images` is null on four rows in five, so the page was left
  // building a strip out of city keys — five pictures, three of them the same
  // city twice. The gallery is what the live itinerary shows and it runs to
  // dozens. Never fatal either: no gallery just means the page falls back to
  // those city shots.
  const gallery = await withRetry(`gallery ${row.slug}`, () =>
    fetchItineraryGallery(detail.id)
  );

  fs.writeFileSync(
    path.join(PAGES_DIR, `${row.slug}.json`),
    JSON.stringify({
      ...detail,
      days: content?.days || [],
      stays: content?.stays || [],
      gallery: toPublicGallery(gallery),
      // Stamped so the next crawl can tell whether this file is still current.
      // Prefixed because everything else in here is the API's own shape and
      // reaches the page as props.
      _cached_modified_at: row.modified_at || null,
    }),
    "utf8"
  );

  return { slug: row.slug, ok: true, hasBody: Boolean(content?.days?.length) };
};

/** The cached page for a row, if it was written for this exact modified_at. */
const reusable = (row) => {
  if (FORCE || !row.modified_at) return null;

  const file = path.join(PAGES_DIR, `${row.slug}.json`);
  if (!fs.existsSync(file)) return null;

  try {
    const cached = JSON.parse(fs.readFileSync(file, "utf8"));
    if (cached._cached_modified_at !== row.modified_at) return null;
    // A file written before the gallery existed is stale even at the right
    // stamp — the trip has not changed, but what we store about it has. One
    // full re-crawl, then stamps take over again.
    if (!Array.isArray(cached.gallery)) return null;
    return cached;
  } catch (err) {
    return null;
  }
};

const run = async () => {
  fs.mkdirSync(PAGES_DIR, { recursive: true });

  const rows = await fetchIndexedList();

  if (!rows.length) {
    // Unlike the destination sitemaps, an empty trips list is not a degraded
    // build to ship — it would drop every trips URL from the sitemap and, on a
    // -trips deploy, emit zero leaf pages while exiting 0.
    throw new Error("[trips-seo] indexed list came back empty");
  }

  fs.writeFileSync(INDEX_FILE, JSON.stringify(rows), "utf8");
  console.log(`[trips-seo] indexed list: ${rows.length} trips`);

  if (!TRIPS_IN_BUILD) {
    console.log("[trips-seo] pages/trips is not in this build — skipping page bodies");
    return;
  }

  const results = [];
  const started = Date.now();

  // Split before crawling so the log says up front how much work there is.
  const stale = [];
  for (const row of rows) {
    const cached = reusable(row);
    if (cached) results.push({ slug: row.slug, ok: true, hasBody: Boolean(cached.days?.length) });
    else stale.push(row);
  }

  console.log(
    `[trips-seo] ${results.length} unchanged since the last crawl, ${stale.length} to fetch`
  );

  await mapPool(stale, async (row) => {
    results.push(await buildPage(row));

    if (results.length % 250 === 0) {
      console.log(`[trips-seo] ${results.length}/${rows.length} pages cached`);
    }
  });

  // Slugs the backend has dropped keep a file here forever otherwise. Nothing
  // reads them — pages and sitemap both iterate the index — but the cache is a
  // CI artifact now, so it may as well not grow without bound.
  const known = new Set(rows.map((row) => `${row.slug}.json`));
  for (const file of fs.readdirSync(PAGES_DIR)) {
    if (!known.has(file)) fs.rmSync(path.join(PAGES_DIR, file), { force: true });
  }

  const ok = results.filter((r) => r.ok);
  const withBody = ok.filter((r) => r.hasBody);
  const deindexed = results.filter((r) => r.deindexed);
  const failed = results.filter((r) => !r.ok && !r.deindexed);

  console.log(
    `[trips-seo] cached ${ok.length}/${rows.length} pages ` +
      `(${withBody.length} with day-by-day) in ${Math.round((Date.now() - started) / 1000)}s`
  );
  if (deindexed.length) {
    console.log(`[trips-seo] ${deindexed.length} slug(s) de-indexed mid-crawl, skipped`);
  }
  if (failed.length) {
    console.warn(
      `[trips-seo] ${failed.length} page(s) unreachable: ${failed
        .slice(0, 10)
        .map((r) => r.slug)
        .join(", ")}${failed.length > 10 ? ", …" : ""}`
    );
  }

  // A handful of upstream misses is normal and those slugs simply do not get a
  // page. A large shortfall means something is wrong with mercury, and shipping
  // it would publish a sitemap full of URLs that 404.
  if (ok.length < rows.length * 0.95) {
    throw new Error(
      `[trips-seo] only ${ok.length}/${rows.length} pages could be cached — refusing to build`
    );
  }
};

run().catch((err) => {
  console.error(err.message);
  process.exit(1);
});

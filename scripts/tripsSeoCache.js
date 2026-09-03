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
  toPublicTrip,
} = require("../lib/seo/tripsIndexed");

const CACHE_DIR = path.join(process.cwd(), ".seo-cache");
const PAGES_DIR = path.join(CACHE_DIR, "trips");
const INDEX_FILE = path.join(CACHE_DIR, "trips-index.json");

// s3-deploy.sh moves pages/trips out of the tree unless the deploy was invoked
// with -trips, so a normal release does not rebuild the leaf pages. Fetching
// 1,718 bodies for pages this build will not emit would add ~10 minutes to
// every deploy for nothing. The index is still fetched either way: the sitemap
// must keep listing the trips URLs that are already live on S3.
const TRIPS_IN_BUILD = fs.existsSync(path.join(process.cwd(), "pages", "trips"));

const CONCURRENCY = 10;
const ATTEMPTS = 3;

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

  fs.writeFileSync(
    path.join(PAGES_DIR, `${row.slug}.json`),
    JSON.stringify({ ...detail, days: content?.days || [], stays: content?.stays || [] }),
    "utf8"
  );

  return { slug: row.slug, ok: true, hasBody: Boolean(content?.days?.length) };
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

  await mapPool(rows, async (row) => {
    results.push(await buildPage(row));

    if (results.length % 250 === 0) {
      console.log(`[trips-seo] ${results.length}/${rows.length} pages cached`);
    }
  });

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

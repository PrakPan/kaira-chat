// Build-time reader for the snapshot scripts/tripsSeoCache.js writes.
//
// Only ever called from getStaticPaths/getStaticProps and from the sitemap
// script, so `fs` here never reaches the client bundle.

const fs = require("fs");
const path = require("path");

const CACHE_DIR = path.join(process.cwd(), ".seo-cache");
const PAGES_DIR = path.join(CACHE_DIR, "trips");
const INDEX_FILE = path.join(CACHE_DIR, "trips-index.json");

let INDEX_MEMO = null;

const readJson = (file) => {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (err) {
    return null;
  }
};

/**
 * Every indexed trip.
 *
 * Deliberately throws when the snapshot is missing. getStaticPaths returning []
 * is a silent catastrophe here — Next emits zero trips pages and exits 0, so a
 * broken prebuild would look like a clean deploy that quietly 404s 1,718 URLs.
 */
function readTripsIndex() {
  if (INDEX_MEMO) return INDEX_MEMO;

  const rows = readJson(INDEX_FILE);
  if (!Array.isArray(rows) || !rows.length) {
    throw new Error(
      "[trips-seo] .seo-cache/trips-index.json is missing or empty — run `node scripts/tripsSeoCache.js` (it is part of `npm run prebuild`)"
    );
  }

  INDEX_MEMO = rows;
  return rows;
}

/** One page's full payload, or null when it was not cached. */
function readTripPage(slug) {
  if (!slug) return null;
  return readJson(path.join(PAGES_DIR, `${slug}.json`));
}

/** Destination slug -> its trips, newest first, for the hub pages. */
function readDestinations() {
  const byDestination = new Map();

  for (const row of readTripsIndex()) {
    if (!row?.destination) continue;
    if (!byDestination.has(row.destination)) byDestination.set(row.destination, []);
    byDestination.get(row.destination).push(row);
  }

  for (const rows of byDestination.values()) {
    rows.sort((a, b) => String(b.modified_at).localeCompare(String(a.modified_at)));
  }

  return byDestination;
}

module.exports = { readTripsIndex, readTripPage, readDestinations };

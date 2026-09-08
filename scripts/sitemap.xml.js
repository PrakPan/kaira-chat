const axios = require("axios");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
require('dotenv').config();
// Ticket 2.1: only keep-listed states/cities go in the sitemap; the noindexed
// long tail is excluded here (and carries <meta robots noindex,follow> in-page).
const { isDestinationIndexable } = require("../lib/seo/indexableDestinations");

const PROD_BASE_URL = "https://dev.thetarzanway.com";
const NOW = new Date().toISOString();

// Child sitemaps written under public/ and referenced from the sitemap index at
// public/sitemap.xml. Splitting by content type lets us diagnose indexing
// coverage per type in Google Search Console (Sitemaps report shows each file
// separately). URLs stay non-trailing-slash to match the on-page canonical
// tags (see pages/[continent]/.../index.js -> https://thetarzanway.com/${path}).
const CHILD_SITEMAPS = {
  countries: "sitemap-destinations-countries.xml", // continents + countries + subregions
  cities: "sitemap-destinations-cities.xml", // indexable states + cities
  trips: "sitemap-trips.xml", // itineraries
  themesStatic: "sitemap-themes-static.xml", // static site pages + theme landing pages
};

// `lastmod` falls back to the child sitemap's own resolved lastmod (see
// resolveChildLastmod) because most of these APIs return only a path or slug,
// with no per-entity updated_at to report. Where a real one *is* available it
// must be used: 663 identical lastmods is a signal Google ignores outright, so
// an entry may carry its own `lastmod`.
const buildUrlset = (paths, fallbackLastmod) => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths
  .map(
    (el) => `  <url>
    <loc>${el.link}</loc>
    <lastmod>${el.lastmod || fallbackLastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${el.priority || "0.8"}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

const buildIndex = (children) => `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${children
  .map(
    ({ file, lastmod }) => `  <sitemap>
    <loc>${PROD_BASE_URL}/${file}</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`
  )
  .join("\n")}
</sitemapindex>
`;

// --- child lastmod resolution -------------------------------------------------
//
// The index used to stamp all four children with the build timestamp, so every
// deploy told Google that all four had just changed even when a child's bytes
// were identical. Google discounts a `lastmod` it finds unreliable, and the
// symptom was the Sitemaps report reading the children on an unrelated rotation
// (trips Aug 30, countries Aug 31, themes Sep 6, cities Sep 8) rather than on
// the change we were signalling. A child's lastmod must now move only when that
// child's contents actually move.

/** Newest of a set of W3C dates, as the original string. */
const pickLatest = (values) =>
  values
    .filter(Boolean)
    .reduce(
      (latest, value) =>
        !latest || Date.parse(value) > Date.parse(latest) ? value : latest,
      ""
    );

// Identity of a child sitemap ignoring lastmod: the same URLs at the same
// priorities fingerprint the same, so a rebuild on its own cannot look like a
// content change.
const urlFingerprint = (entries) =>
  crypto
    .createHash("sha1")
    .update(
      entries
        .map((el) => `${el.link} ${el.priority || "0.8"}`)
        .sort()
        .join("\n")
    )
    .digest("hex");

const tagValue = (block, name) => {
  const match = block.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`));
  return match ? match[1].trim() : "";
};

/**
 * The child sitemap currently live in production, or null.
 *
 * This is the only record of what the previous deploy published: the generated
 * sitemaps are gitignored and CI builds from a clean checkout, so there is no
 * on-disk history to diff against.
 */
const readPublishedChild = async (file) => {
  try {
    const { data } = await axios.get(`${PROD_BASE_URL}/${file}`, {
      timeout: 15000,
      responseType: "text",
    });
    const blocks = String(data).match(/<url>[\s\S]*?<\/url>/g) || [];
    if (!blocks.length) return null;

    return {
      fingerprint: urlFingerprint(
        blocks.map((block) => ({
          link: tagValue(block, "loc"),
          priority: tagValue(block, "priority") || undefined,
        }))
      ),
      lastmod: pickLatest(blocks.map((block) => tagValue(block, "lastmod"))),
    };
  } catch (err) {
    console.error(`[sitemap] could not read published ${file}: ${err.message}`);
    return null;
  }
};

/**
 * The lastmod to publish for one child, in preference order:
 *   1. the newest real per-URL lastmod it carries (trips: every entry has the
 *      itinerary's own modified_at, so this needs no history at all)
 *   2. the lastmod already live, when the URL set is unchanged since the last
 *      deploy — which also keeps the file byte-identical, since entries with no
 *      lastmod of their own fall back to this value
 *   3. now, for a genuinely changed child (and whenever prod is unreachable,
 *      which degrades to exactly the old build-timestamp behaviour)
 */
const resolveChildLastmod = async (file, entries) => {
  const real = pickLatest(entries.map((el) => el.lastmod));
  if (real) return real;

  const published = await readPublishedChild(file);
  if (published && published.fingerprint === urlFingerprint(entries)) {
    return published.lastmod || NOW;
  }
  return NOW;
};

const writeSitemap = (file, xml) => {
  fs.writeFileSync(path.join(process.cwd(), "public", file), xml, "utf8");
};

// Enumerate the statically-authored theme landing pages (pages/theme/*.tsx|jsx|js).
// These are real routes shipped in the static export but were never in the
// sitemap, so Google reported them as "URL is unknown to Google". The dynamic
// [slug].js route is excluded here; its slugs come from the CMS below.
const getStaticThemeSlugs = () => {
  const themeDir = path.join(process.cwd(), "pages", "theme");
  return fs
    .readdirSync(themeDir)
    .filter((f) => /\.(tsx|jsx|js)$/.test(f))
    .map((f) => f.replace(/\.(tsx|jsx|js)$/, ""))
    .filter((name) => !name.startsWith("[") && !name.startsWith("_"));
};

const generateSitemap = async () => {
  const BASE_URL =
    // process.env.NEXT_PUBLIC_MERCURY_HOST || 
    "https://mercury.tarzanway.com";

  // Fetch continents list
  const continents = await axios.get(
    `${BASE_URL}/api/v1/website/pages/?page_type=Continent&fields=path`
  );
  const continentsData = continents.data.data.pages;
  let continentsPaths = continentsData
    .filter((object) => object.slug !== undefined)
    .map((object) => {
      return {
        title: "Continent Planner",
        link: PROD_BASE_URL + "/" + object.slug,
        priority: "0.8",
      };
    });

  // Fetch countries list
  const countries = await axios.get(
    `${BASE_URL}/api/v1/geos/search/all/?type=Country`
  );
  const countriesData = countries.data;
  let countriesPaths = countriesData
    .filter(
      (object) =>
        object.path !== undefined && object.path.split("/").length === 2
    )
    .map((object) => {
      return {
        title: "Country Planner",
        link: PROD_BASE_URL + "/" + object.path,
        priority: "0.8",
      };
    });

  // Fetch states list
  const states = await axios.get(
    `${BASE_URL}/api/v1/geos/search/all/?type=State`
  );
  const statesData = states.data;

  let statesPaths = statesData
    .filter((object) => object.path !== undefined)
    .filter((object) =>
      isDestinationIndexable(object.path.replaceAll(" ", "_").toLowerCase())
    )
    .map((object) => {
      return {
        title: "State Planner",
        link:
          PROD_BASE_URL + "/" + object.path.replaceAll(" ", "_").toLowerCase(),
        priority: "0.7",
      };
    });

  // Fetch cities list
  const cities = await axios.get(
    `${BASE_URL}/api/v1/geos/search/all/?type=City`
  );
  const citiesData = cities.data;

  let cityPaths = citiesData
    .filter((object) => object.path !== undefined)
    .filter((object) => isDestinationIndexable(object.path))
    .map((object) => {
      return {
        title: "City Planner",
        link: PROD_BASE_URL + "/" + object.path,
        priority: "0.7",
      };
    });

  const subRegions = await axios.get(
    `${BASE_URL}/api/v1/website/pages/?page_type=Subregion&fields=path`
  );
  const subRegionsData = subRegions.data.data.pages;
  let subRegionsPaths = subRegionsData.map((object) => {
    return {
      title: "Subregion Planner",
      link: PROD_BASE_URL + "/" + object.path,
      priority: "0.8",
    };
  });

  // Trips list. This used to read suppliers.tarzanway.com/sales/itinerary/indexed/
  // unguarded, which mattered more than it looks: this script is the `prebuild`
  // hook, so it runs before *every* build, and a throw here exits non-zero and
  // takes the whole deploy down — not just the trips sitemap. Now it reads the
  // same manifest the trips pages build from, and a failure degrades to a
  // trips-less sitemap instead of a failed release.
  //
  // The source moved again in the SEO rebuild: the V1 archive manifest listed
  // 644 legacy trips keyed by group_type, which the backend has since
  // de-indexed. The indexed set is now the 1,718 Released itineraries served by
  // mercury, and scripts/tripsSeoCache.js has already fetched them into
  // .seo-cache/ by the time this runs — so this reads the same snapshot the
  // pages are generated from, rather than crawling the API a second time and
  // risking a sitemap that disagrees with what was actually built.
  //
  // `url` is used verbatim, never rebuilt from destination + slug: the API owns
  // the path, and a locally-derived one would drift the moment it changed.
  let tripsPaths = [];
  let hubPaths = [];
  try {
    const { readTripsIndex, readDestinations } = require("../lib/seo/tripsCache");
    const rows = readTripsIndex();

    tripsPaths = rows.map((trip) => ({
      title: "Trip",
      link: `${PROD_BASE_URL}${trip.url}`,
      // Date-only W3C form. `modified_at` is the trip's own timestamp, which is
      // the point: 214 distinct dates across the set instead of one repeated
      // build time.
      lastmod: String(trip.modified_at || "").slice(0, 10) || undefined,
      priority: "0.6",
    }));

    // A hub page has no timestamp of its own, but it is generated entirely from
    // the trips listed on it — so its newest trip *is* its lastmod. Deriving it
    // keeps the build timestamp out of this file completely: with all 1,865
    // entries carrying a real date, sitemap-trips.xml is byte-stable across
    // rebuilds and its index lastmod moves only when a trip does.
    const latestTripLastmod = (trips) =>
      pickLatest(trips.map((trip) => String(trip.modified_at || "").slice(0, 10)));

    const destinations = readDestinations();
    hubPaths = [
      {
        title: "Trips Index",
        link: `${PROD_BASE_URL}/trips`,
        lastmod: latestTripLastmod(rows) || undefined,
        priority: "0.8",
      },
      ...[...destinations.entries()].map(([destination, destinationTrips]) => ({
        title: "Trips Hub",
        link: `${PROD_BASE_URL}/trips/${destination}`,
        lastmod: latestTripLastmod(destinationTrips) || undefined,
        priority: "0.7",
      })),
    ];
  } catch (err) {
    console.error("[sitemap] failed to read trips cache:", err.message);
  }

  // Theme landing pages: union of statically-authored pages/theme/*.tsx files
  // and CMS-driven themes served by pages/theme/[slug].js. Deduped by slug
  // (a static file and a CMS entry can share a slug; Next serves the static one).
  const staticThemeSlugs = getStaticThemeSlugs();

  let cmsThemeSlugs = [];
  try {
    const themesResp = await axios.get(
      `${BASE_URL}/api/v1/website/pages/?page_type=Theme`
    );
    cmsThemeSlugs = (themesResp.data?.data?.pages || [])
      .map((p) => p.slug)
      .filter(Boolean);
  } catch (err) {
    console.error("[sitemap] failed to fetch CMS themes:", err.message);
  }

  const allThemeSlugs = Array.from(
    new Set([...staticThemeSlugs, ...cmsThemeSlugs])
  );
  let themePaths = allThemeSlugs.map((slug) => {
    return {
      title: "Theme Page",
      link: `${PROD_BASE_URL}/theme/${slug}`,
      priority: "0.8",
    };
  });

  const StaticPaths = [
    { title: "Home Page", link: PROD_BASE_URL, priority: "1.0" },
    // Ticket 2.4: the COVID-19 page is stale content and is being 301'd to the
    // homepage at the edge, so it is intentionally excluded from the sitemap.
    { title: "All Destinations", link: PROD_BASE_URL + "/destinations", priority: "0.9" },
    { title: "Corporates", link: PROD_BASE_URL + "/corporates", priority: "0.6" },
    { title: "Chat with Kaira", link: PROD_BASE_URL + "/chat", priority: "0.7" },
    { title: "About Us", link: PROD_BASE_URL + "/about-us", priority: "0.6" },
  ];

  // Group paths into the four child sitemaps.
  const countriesGroup = [
    ...continentsPaths,
    ...countriesPaths,
    ...subRegionsPaths,
  ];
  const citiesGroup = [...statesPaths, ...cityPaths];
  const tripsGroup = [...hubPaths, ...tripsPaths];
  const themesStaticGroup = [...StaticPaths, ...themePaths];

  // Resolve each child's lastmod before writing it: the same value is both the
  // child's entry in the index and the per-URL fallback inside it, so an
  // unchanged child is republished byte-for-byte identical.
  const groups = [
    { file: CHILD_SITEMAPS.countries, entries: countriesGroup },
    { file: CHILD_SITEMAPS.cities, entries: citiesGroup },
    { file: CHILD_SITEMAPS.trips, entries: tripsGroup },
    { file: CHILD_SITEMAPS.themesStatic, entries: themesStaticGroup },
  ];

  const children = [];
  for (const { file, entries } of groups) {
    const lastmod = await resolveChildLastmod(file, entries);
    writeSitemap(file, buildUrlset(entries, lastmod));
    children.push({ file, lastmod });
  }

  // sitemap.xml is now a sitemap index. The existing GSC submission of
  // https://thetarzanway.com/sitemap.xml keeps working and auto-discovers the
  // four children below.
  writeSitemap("sitemap.xml", buildIndex(children));

  const PagesToIdJson = await axios.get(`${BASE_URL}/api/v1/geos/pages/all/`);
  fs.writeFileSync(
    path.join(process.cwd(), "data", "PagesToIdMapping.json"),
    JSON.stringify(PagesToIdJson.data, null, 2),
    "utf8"
  );

  console.log("Sitemap index + child sitemaps generated successfully!");
  console.log(
    `  ${CHILD_SITEMAPS.countries}: ${countriesGroup.length} urls (continents + countries + subregions)`
  );
  console.log(
    `  ${CHILD_SITEMAPS.cities}: ${citiesGroup.length} urls (states + cities)`
  );
  console.log(
    `  ${CHILD_SITEMAPS.trips}: ${tripsGroup.length} urls (${hubPaths.length} hubs + ${tripsPaths.length} trips)`
  );
  console.log(
    `  ${CHILD_SITEMAPS.themesStatic}: ${themesStaticGroup.length} urls (${StaticPaths.length} static + ${themePaths.length} themes)`
  );
  console.log(
    `  themes: ${staticThemeSlugs.length} static file(s) + ${cmsThemeSlugs.length} CMS = ${allThemeSlugs.length} unique`
  );
  console.log("  index lastmod per child:");
  for (const { file, lastmod } of children) {
    console.log(`    ${file}: ${lastmod}${lastmod === NOW ? " (changed)" : ""}`);
  }
};

generateSitemap().catch((error) => {
  console.error("Error generating sitemap:", error);
  process.exit(1);
});

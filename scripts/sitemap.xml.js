const axios = require("axios");
const fs = require("fs");
const path = require("path");
require('dotenv').config();
// Ticket 2.1: only keep-listed states/cities go in the sitemap; the noindexed
// long tail is excluded here (and carries <meta robots noindex,follow> in-page).
const { isDestinationIndexable } = require("../lib/seo/indexableDestinations");

const PROD_BASE_URL = "https://thetarzanway.com";
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

const buildUrlset = (paths) => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths
  .map(
    (el) => `  <url>
    <loc>${el.link}</loc>
    <lastmod>${NOW}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${el.priority || "0.8"}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

const buildIndex = (files) => `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${files
  .map(
    (file) => `  <sitemap>
    <loc>${PROD_BASE_URL}/${file}</loc>
    <lastmod>${NOW}</lastmod>
  </sitemap>`
  )
  .join("\n")}
</sitemapindex>
`;

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

  // Fetch trips list
  const response = await axios.get(
    "https://suppliers.tarzanway.com/sales/itinerary/indexed/"
  );
  const trips = response.data.map((trip) => {
    let group_type = trip?.group_type
      ? trip.group_type.replaceAll(" ", "_").toLowerCase()
      : "family";
    return {
      path: group_type + "/" + trip.slug,
    };
  });

  let tripsPaths = trips.map((trip) => {
    return {
      title: "Trip",
      link: PROD_BASE_URL + "/trips/" + trip.path,
      priority: "0.6",
    };
  });

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
  const tripsGroup = [...tripsPaths];
  const themesStaticGroup = [...StaticPaths, ...themePaths];

  writeSitemap(CHILD_SITEMAPS.countries, buildUrlset(countriesGroup));
  writeSitemap(CHILD_SITEMAPS.cities, buildUrlset(citiesGroup));
  writeSitemap(CHILD_SITEMAPS.trips, buildUrlset(tripsGroup));
  writeSitemap(CHILD_SITEMAPS.themesStatic, buildUrlset(themesStaticGroup));

  // sitemap.xml is now a sitemap index. The existing GSC submission of
  // https://thetarzanway.com/sitemap.xml keeps working and auto-discovers the
  // four children below.
  const index = buildIndex([
    CHILD_SITEMAPS.countries,
    CHILD_SITEMAPS.cities,
    CHILD_SITEMAPS.trips,
    CHILD_SITEMAPS.themesStatic,
  ]);
  writeSitemap("sitemap.xml", index);

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
  console.log(`  ${CHILD_SITEMAPS.trips}: ${tripsGroup.length} urls (trips)`);
  console.log(
    `  ${CHILD_SITEMAPS.themesStatic}: ${themesStaticGroup.length} urls (${StaticPaths.length} static + ${themePaths.length} themes)`
  );
  console.log(
    `  themes: ${staticThemeSlugs.length} static file(s) + ${cmsThemeSlugs.length} CMS = ${allThemeSlugs.length} unique`
  );
};

generateSitemap().catch((error) => {
  console.error("Error generating sitemap:", error);
  process.exit(1);
});

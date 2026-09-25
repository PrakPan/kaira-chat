// Trips root — /trips
//
// Exists mainly so the hubs are not orphans and the breadcrumb on every leaf
// page resolves to a real URL. It links to all 146 destination hubs, which puts
// every one of the 1,718 leaves within three clicks of the homepage.

import Head from "next/head";

import Layout from "../../components/Layout";
import TripsHub from "../../components/trips/TripsHub";
import { SITE_ORIGIN } from "../../lib/seo/tripsIndexed";
// Commented out with the data fetching below: tripsCache requires `fs`, and it
// is dropped from the client bundle only while getStaticProps still references
// it. With that body disabled the import is dead but still emitted, and webpack
// fails the client build with "Can't resolve 'fs'".
// import { readDestinations } from "../../lib/seo/tripsCache";
// Commented out for the same reason: tripsCards requires tripsCache, so it
// drags `fs` into the client bundle once the getStaticProps that used it is
// disabled.
// import { tripCard } from "../../lib/seo/tripsCards";
import { breadcrumbSchema } from "../../lib/seo/tripsJsonLd";
import { destinationLabel } from "../../lib/seo/tripsFormat";
import { THEMES, tripTheme } from "../../lib/seo/tripTheme";

const CANONICAL = `${SITE_ORIGIN}/trips`;

const TripsIndex = ({
  title,
  heading,
  description,
  intro,
  chips,
  sections,
  schema,
  defaultTheme,
  filterDestinations,
}) => (
  <Layout staticnav page="Trips Index">
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={CANONICAL} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={CANONICAL} />
      <meta property="og:type" content="website" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </Head>

    <TripsHub
      title={heading}
      intro={intro}
      chips={chips}
      sections={sections}
      defaultTheme={defaultTheme}
      destinations={filterDestinations}
    />
  </Layout>
);

export default TripsIndex;

// ---------------------------------------------------------------------------
// TRIPS ARE NOT BUILT FROM THIS BRANCH.
//
// The trips pages are generated from the .seo-cache snapshot that
// `scripts/tripsSeoCache.js` crawls (~3 min, 1,865 pages), and that crawl is
// commented out of package.json's `prebuild` here — so readDestinations() would
// throw and take the whole build down. Returning notFound keeps the route
// compiled but unpublished; the live /trips pages on S3 come from a separate
// deploy and are left untouched (scripts/sitemap.xml.js keeps listing them).
//
// To restore: put `prebuild:with-trips` back in `prebuild`, then delete the
// early return below and uncomment the body — same in
// pages/trips/[destination]/index.js and pages/trips/[destination]/[slug].js.
// ---------------------------------------------------------------------------
export async function getStaticProps() {
  return { notFound: true };

  /* eslint-disable no-unreachable */
  /*
  const byDestination = readDestinations();

  const destinations = [...byDestination.entries()]
    .map(([slug, rows]) => ({
      slug,
      href: `/trips/${slug}`,
      label: destinationLabel(slug),
      count: rows.length,
      rows,
    }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));

  const total = [...byDestination.values()].reduce((sum, rows) => sum + rows.length, 0);

  const totalLabel = total.toLocaleString("en-IN");

  // Wording from Search Console + Keyword Planner (India, Sep 2026):
  //  - "travel itinerary" 4,400/mo, "tour itinerary" 1,600, "trip itinerary"
  //    1,300, all LOW competition, and no page of ours targets them. That is
  //    what this page is: a library of itineraries.
  //  - "trip planner" (14,800) belongs to the homepage ("AI Trip Planner with
  //    Human Expertise"); repeating it here would split that query.
  //  - Our own queries say "<place> trip plan" far more than "itinerary", and
  //    ask about cost ("vietnam trip cost for 3 person"), so "trip plans" and
  //    "prices" are in the copy. Nobody searches "day-wise" as a lead word.
  //  - The destination names lead the description because the destination is
  //    what people search with ("vietnam itinerary" 5,400, "kerala itinerary"
  //    3,600). Taken from the trip counts so they follow the corpus.
  const topNames = destinations.slice(0, 4).map((d) => d.label);

  // The meta description, kept under ~155 characters so it isn't cut off.
  const description =
    `${totalLabel} travel itineraries for ${destinations.length} destinations, including ` +
    `${topNames.slice(0, -1).join(", ")} and ${topNames[topNames.length - 1]}. ` +
    "Hotels, transfers, activities and per-person prices included.";

  // The visible intro under the H1 — longer than the meta description, because
  // it can say what the snippet has no room for: how to use the page.
  const intro =
    `${totalLabel} trip plans across ${destinations.length} destinations, each with ` +
    "its hotels, transfers and activities laid out day by day and a per-person " +
    "price. Filter by where you want to go, who you're travelling with and how " +
    "long you have, then open any itinerary and customise it free.";

  // Every trip, newest first — not a 48-row sample. The filter bar
  // above them is what makes that readable: the page opens on one theme (see
  // `defaultTheme`), so the reader meets a few hundred trips of one kind rather
  // than all 1,718 at once, and the other themes are one chip away.
  //
  // All of them stay in the served HTML as real anchors, filtered or not —
  // that is the property this page exists for (see the note in TripsFilters).
  const all = [...byDestination.values()]
    .flat()
    .sort((a, b) => String(b.modified_at).localeCompare(String(a.modified_at)));

  // Open on the theme with the most trips, so the first screen is the fullest
  // one. Counted from the same rows the cards are built from rather than
  // hard-coded, so it follows the corpus as it grows.
  const themeCounts = new Map();
  for (const row of all) {
    const id = tripTheme(row);
    if (id) themeCounts.set(id, (themeCounts.get(id) || 0) + 1);
  }
  const defaultTheme =
    [...themeCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ||
    THEMES[0].id;

  return {
    props: {
      // 60 characters: the keyword pair first, the brand last.
      title: "Travel Itineraries & Trip Plans with Prices | The Tarzan Way",
      heading: "Travel itineraries & trip plans",
      description,
      intro,
      chips: {
        title: "Travel itineraries by destination",
        note: `All ${destinations.length} destinations we have trips for, most trips first.`,
        items: destinations.map(({ href, label, count }) => ({ href, label, count })),
      },
      defaultTheme,
      // The filter bar's destination row, most trips first — it shows the top
      // few as chips and handles ?destination=<slug> for the rest.
      filterDestinations: destinations.map(({ slug, label }) => ({ id: slug, label })),
      sections: [
        {
          title: "Find an itinerary by destination, trip type and length",
          items: all.map(tripCard).filter(Boolean),
        },
      ],
      schema: breadcrumbSchema([{ name: "Trips", href: "/trips" }]),
    },
  };
  */
}

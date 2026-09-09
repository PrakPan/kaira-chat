// Trips root — /trips
//
// Exists mainly so the hubs are not orphans and the breadcrumb on every leaf
// page resolves to a real URL. It links to all 146 destination hubs, which puts
// every one of the 1,718 leaves within three clicks of the homepage.

import Head from "next/head";

import Layout from "../../components/Layout";
import TripsHub from "../../components/trips/TripsHub";
import { SITE_ORIGIN } from "../../lib/seo/tripsIndexed";
import { readDestinations } from "../../lib/seo/tripsCache";
import { tripCard } from "../../lib/seo/tripsCards";
import { breadcrumbSchema } from "../../lib/seo/tripsJsonLd";
import { destinationLabel } from "../../lib/seo/tripsFormat";

const CANONICAL = `${SITE_ORIGIN}/trips`;

const TripsIndex = ({ title, description, chips, sections, schema }) => (
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
      title="Trip itineraries"
      intro={description}
      chips={chips}
      sections={sections}
    />
  </Layout>
);

export default TripsIndex;

// ---------------------------------------------------------------------------
// TRIPS ARE NOT DEPLOYED FROM THIS BRANCH (feature/lockin → Vercel).
//
// The trips pages are built from the .seo-cache snapshot that
// `scripts/tripsSeoCache.js` crawls (~3 min, 1,865 pages), and that crawl is
// commented out of package.json's `prebuild` for the Vercel build — so
// readDestinations() would throw here and take the whole build down.
// Returning notFound keeps the route compiled but unpublished.
//
// To restore: put tripsSeoCache.js back in `prebuild`, then delete the early
// return below and uncomment the body — same in pages/trips/[destination]/
// index.js and pages/trips/[destination]/[slug].js.
// ---------------------------------------------------------------------------
export async function getStaticProps() {
  return { notFound: true };

  /* eslint-disable no-unreachable */
  /*
  const byDestination = readDestinations();

  const destinations = [...byDestination.entries()]
    .map(([slug, rows]) => ({
      href: `/trips/${slug}`,
      label: destinationLabel(slug),
      count: rows.length,
      rows,
    }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));

  const total = [...byDestination.values()].reduce((sum, rows) => sum + rows.length, 0);

  const description =
    `${total} trip itineraries across ${destinations.length} destinations, each one built and ` +
    "released by our travel team with stays, transfers and activities already planned. " +
    "Open any of them as a starting point and reshape it free before you book.";

  // The newest trips, so the root has real content of its own rather than only
  // being a list of links to lists of links. 48 rather than a dozen because the
  // filter bar now sits above them: a set small enough to read at a glance
  // gives the filters nothing to do, and every one of these is a crawlable
  // anchor either way.
  const recent = [...byDestination.values()]
    .flat()
    .sort((a, b) => String(b.modified_at).localeCompare(String(a.modified_at)))
    .slice(0, 48);

  return {
    props: {
      title: `Trip Itineraries — ${total} Ready Trip Plans | The Tarzan Way`,
      description,
      chips: {
        title: "Browse by destination",
        note: `All ${destinations.length} destinations we have released trips for, most trips first.`,
        items: destinations.map(({ href, label, count }) => ({ href, label, count })),
      },
      sections: [
        {
          title: "Recently updated",
          items: recent.map(tripCard).filter(Boolean),
        },
      ],
      schema: breadcrumbSchema([{ name: "Trips", href: "/trips" }]),
    },
  };
  */
}

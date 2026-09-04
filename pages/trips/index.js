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

export async function getStaticProps() {
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

  // A handful of the newest trips, so the root has some real content of its own
  // rather than only being a list of links to lists of links.
  const recent = [...byDestination.values()]
    .flat()
    .sort((a, b) => String(b.modified_at).localeCompare(String(a.modified_at)))
    .slice(0, 12);

  return {
    props: {
      title: `Trip Itineraries — ${total} Ready Trip Plans | The Tarzan Way`,
      description,
      chips: {
        title: "Browse by destination",
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
}

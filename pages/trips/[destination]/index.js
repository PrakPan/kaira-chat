// Destination hub — /trips/<destination>
//
// These target the head terms ("bali tour packages", "thailand itinerary") that
// the long-tail leaf pages cannot, and they are what stops the 1,718 leaves
// being orphans: every leaf links up to its hub, and the hub links back down to
// all of them, so nothing is more than three clicks from home.
//
// The copy here is derived from the trips themselves — how many there are, the
// range of lengths, the lowest real price — rather than written per
// destination. There are 146 hubs; any hand-written intro would cover a handful
// and leave the rest with none, and inventing per-destination prose is exactly
// the thin filler these pages need to avoid.

import Head from "next/head";

import Layout from "../../../components/Layout";
import TripsHub from "../../../components/trips/TripsHub";
import { SITE_ORIGIN } from "../../../lib/seo/tripsIndexed";
import { readDestinations, readTripPage } from "../../../lib/seo/tripsCache";
import { tripCard } from "../../../lib/seo/tripsCards";
import { breadcrumbSchema } from "../../../lib/seo/tripsJsonLd";
import {
  destinationLabel,
  formatINR,
  roundedPerPerson,
} from "../../../lib/seo/tripsFormat";

const DestinationHub = ({ label, url, title, description, sections, schema }) => {
  const canonical = `${SITE_ORIGIN}${url}`;

  return (
    <Layout staticnav page="Trips Hub">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="website" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </Head>

      <TripsHub
        crumbs={[
          { name: "Trips", href: "/trips" },
          { name: label },
        ]}
        title={`${label} itineraries`}
        intro={description}
        sections={sections}
      />
    </Layout>
  );
};

export default DestinationHub;

// ---------------------------------------------------------------------------
// TRIPS ARE NOT DEPLOYED FROM THIS BRANCH (feature/lockin → Vercel).
//
// scripts/tripsSeoCache.js is commented out of package.json's `prebuild`, so
// the .seo-cache snapshot these pages read does not exist in the Vercel build
// and readDestinations() would throw. An empty path list emits zero hubs; the
// route stays compiled but unpublished. See the note in pages/trips/index.js
// for how to turn the group back on.
// ---------------------------------------------------------------------------
export async function getStaticPaths() {
  return { paths: [], fallback: false };

  /*
  return {
    paths: [...readDestinations().keys()].map((destination) => ({
      params: { destination },
    })),
    fallback: false,
  };
  */
}

export async function getStaticProps({ params }) {
  return { notFound: true };

  /* eslint-disable no-unreachable */
  /*
  const rows = readDestinations().get(params.destination);
  if (!rows?.length) return { notFound: true };

  const label = destinationLabel(params.destination);

  // Price lives only in the per-slug payload, so the "from" figure is the
  // cheapest of the trips actually cached. A trip whose detail fetch failed has
  // no file and simply doesn't vote on the price.
  const prices = rows
    .map((row) => roundedPerPerson(readTripPage(row.slug)?.price))
    .filter(Boolean);

  const nights = rows.map((row) => Number(row.duration)).filter(Number.isFinite);
  const shortest = Math.min(...nights);
  const longest = Math.max(...nights);
  const from = prices.length ? formatINR(Math.min(...prices)) : null;

  const lengths =
    nights.length && shortest !== longest
      ? `${shortest + 1} to ${longest + 1} days`
      : nights.length
        ? `${shortest + 1} days`
        : null;

  const description = [
    `${rows.length} ${label} ${rows.length === 1 ? "itinerary" : "itineraries"}`,
    lengths ? `from ${lengths}` : null,
    from ? `starting at ${from} per person` : null,
  ]
    .filter(Boolean)
    .join(", ")
    .concat(
      ". Real trips our team built and released, with stays, transfers and activities already planned — customise any of them free."
    );

  const title = `${label} Itineraries & Trip Packages${
    lengths ? ` — ${lengths}` : ""
  } | The Tarzan Way`;

  const url = `/trips/${params.destination}`;

  return {
    props: {
      label,
      url,
      title,
      description,
      sections: [
        {
          title: `All ${label} trips`,
          items: rows.map(tripCard).filter(Boolean),
        },
      ],
      schema: breadcrumbSchema([
        { name: "Trips", href: "/trips" },
        { name: label, href: url },
      ]),
    },
  };
  */
}

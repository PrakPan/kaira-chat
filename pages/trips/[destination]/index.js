// Destination hub — /trips/<destination>
//
// These target the head terms ("vietnam itinerary", "kerala trip plan") that
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
// Commented out with the data fetching below — tripsCache requires `fs`, which
// only stays out of the client bundle while getStaticProps/getStaticPaths
// reference it. See the note in pages/trips/index.js.
// import { readDestinations, readTripPage } from "../../../lib/seo/tripsCache";
// Commented out for the same reason: tripsCards requires tripsCache, and so
// pulls `fs` into the client bundle.
// import { tripCard } from "../../../lib/seo/tripsCards";
import { breadcrumbSchema } from "../../../lib/seo/tripsJsonLd";
// Commented out for the same reason: tripsHubs lazily requires tripsCache, and
// webpack still bundles that require.
// import { HUB_PAGES } from "../../../lib/seo/tripsHubs";
import {
  destinationLabel,
  formatINR,
  roundedPerPerson,
} from "../../../lib/seo/tripsFormat";

const DestinationHub = ({
  label,
  url,
  title,
  heading,
  description,
  sections,
  guides,
  schema,
}) => {
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
        title={heading}
        intro={description}
        guides={guides}
        sections={sections}
      />
    </Layout>
  );
};

export default DestinationHub;

// ---------------------------------------------------------------------------
// TRIPS ARE NOT BUILT FROM THIS BRANCH.
//
// scripts/tripsSeoCache.js is commented out of package.json's `prebuild`, so
// the .seo-cache snapshot these pages read does not exist in this build and
// readDestinations() would throw. An empty path list emits zero hubs; the route
// stays compiled but unpublished. See the note in pages/trips/index.js for how
// to turn the group back on.
// ---------------------------------------------------------------------------
export async function getStaticPaths() {
  return { paths: [], fallback: false };

  /* eslint-disable no-unreachable */
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

  // Worded for what people actually search, per Keyword Planner (India,
  // Sep 2026): "vietnam itinerary" 5,400/mo, "kerala itinerary" 3,600,
  // "kerala trip plan" 2,900, "bali itinerary" 2,400, "bali itinerary 7 days"
  // 1,300. So the hub leads with "<Place> Itinerary" and "trip plans".
  //
  // "Packages" is deliberately left to the destination page
  // (/asia/vietnam is "Vietnam Trip Packages & Itineraries from India"): two
  // of our own pages with the same title words split one query between them.
  // The hub is the day-wise plans; the destination page is the package pitch,
  // and the two link to each other (see `guides`).
  const count = rows.length;
  const plans = count === 1 ? "Trip Plan" : "Trip Plans";

  // ~60 characters is what a result shows before truncating, so the count and
  // the keyword go first and the length range stays out of the title.
  // "with Prices" only where it still fits — a long name ("Singapore Malaysia")
  // would otherwise push the brand, and then the count, out of the snippet.
  const titleCore = `${label} Itinerary: ${count} ${plans}`;
  const title = `${titleCore}${
    titleCore.length <= 34 ? " with Prices" : ""
  } | The Tarzan Way`;

  const heading = `${label} itineraries & trip plans`;

  // Doubles as the meta description, so kept near 155 characters.
  const description = [
    `${count} ${label} ${count === 1 ? "itinerary" : "itineraries"}`,
    lengths,
    from ? `from ${from} per person` : null,
  ]
    .filter(Boolean)
    .join(", ")
    .concat(
      ". Stays, transfers and activities planned day by day — customise any plan free."
    );

  // Back up to the destination page(s) this hub belongs to. Those pages link
  // down here already (TripsHubCta); this is the other direction. /trips
  // hubs are recrawled daily, and several destination pages have not been
  // since June, so the link helps them as much as it helps the reader.
  const guides = (HUB_PAGES[params.destination] || []).map((path) => ({
    href: `/${path}`,
    label: path
      .split("/")
      .pop()
      .split("_")
      .map((w) => (w === "and" ? w : w.charAt(0).toUpperCase() + w.slice(1)))
      .join(" "),
  }));

  const url = `/trips/${params.destination}`;

  return {
    props: {
      label,
      url,
      title,
      heading,
      description,
      guides,
      sections: [
        {
          title: `All ${label} trip plans`,
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

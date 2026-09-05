// SEO trips leaf page — /trips/<destination>/<slug>
//
// 1,718 of these are prerendered at build time from the snapshot that
// scripts/tripsSeoCache.js writes. They are statically generated rather than
// server-rendered or revalidated because next.config.js sets `output: "export"`
// — there is no Next server in production, the site is HTML on S3 behind
// CloudFront, so `getServerSideProps` and ISR's `revalidate` are both
// unavailable. Content freshness comes from redeploying, which lines up with
// the monthly `load_seo_data` refresh the backend runs.
//
// The `[destination]` segment was `[type]` until this page was rebuilt, when it
// held a group_type ("couple", "family"). The API now decides the path and
// returns it as `url`; that value is used verbatim for canonicals and links so
// the frontend never has an opinion about how a page is addressed.

import Head from "next/head";

import Layout from "../../../components/Layout";
import TripSeoPage, { heroImageUrl } from "../../../components/trips/TripSeoPage";
import { SITE_ORIGIN } from "../../../lib/seo/tripsIndexed";
import { readTripPage, readTripsIndex } from "../../../lib/seo/tripsCache";
import { tripCard } from "../../../lib/seo/tripsCards";
import { tripItinerary } from "../../../lib/seo/tripItinerary";
import {
  breadcrumbSchema,
  faqSchema,
  touristTripSchema,
} from "../../../lib/seo/tripsJsonLd";
import { destinationLabel } from "../../../lib/seo/tripsFormat";

const jsonLd = (schema) =>
  schema ? (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  ) : null;

const IndexedTrip = ({ page, itinerary, stays, siblings, schemas }) => {
  const canonical = `${SITE_ORIGIN}${page.url}`;
  const ogImage = heroImageUrl(page);

  return (
    <Layout staticnav page="Indexed Trip">
      <Head>
        <title>{page.page_title}</title>
        <meta name="description" content={page.meta_description} />
        <link rel="canonical" href={canonical} />

        {page.keywords?.length > 0 && (
          <meta name="keywords" content={page.keywords.join(", ")} />
        )}

        <meta
          property="og:title"
          content={page.social_share_title || page.page_title}
        />
        <meta
          property="og:description"
          content={page.social_media_description || page.meta_description}
        />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={ogImage} />

        {jsonLd(schemas.trip)}
        {jsonLd(schemas.faq)}
        {jsonLd(schemas.breadcrumb)}
      </Head>

      <TripSeoPage
        page={page}
        itinerary={itinerary}
        stays={stays}
        siblings={siblings}
      />
    </Layout>
  );
};

export default IndexedTrip;

/**
 * Up to six other trips in the same destination, biased toward different trip
 * lengths so the block reads as a real choice ("5 days · 10 days · family")
 * rather than six near-identical durations. Falls back to filling from
 * whatever is left when the destination has few distinct lengths.
 */
const pickSiblings = (rows, current) => {
  const pool = rows.filter(
    (row) => row.destination === current.destination && row.slug !== current.slug
  );

  const chosen = [];
  const seenDurations = new Set([current.duration]);

  for (const row of pool) {
    if (chosen.length >= 6) break;
    if (seenDurations.has(row.duration)) continue;
    seenDurations.add(row.duration);
    chosen.push(row);
  }

  for (const row of pool) {
    if (chosen.length >= 6) break;
    if (!chosen.includes(row)) chosen.push(row);
  }

  return chosen.map(tripCard).filter(Boolean);
};

export async function getStaticPaths() {
  // Unguarded on purpose: readTripsIndex throws when the prebuild snapshot is
  // missing. Swallowing that would return an empty path list, which Next builds
  // as zero trips pages while exiting 0 — a deploy that looks clean and 404s
  // every indexed URL.
  const rows = readTripsIndex();

  return {
    paths: rows.map((row) => ({
      params: { destination: row.destination, slug: row.slug },
    })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const page = readTripPage(params.slug);

  // A slug in the index with no cached page means the detail fetch failed or
  // the trip was de-indexed mid-crawl. Don't publish a shell.
  if (!page || !page.url) return { notFound: true };

  const rows = readTripsIndex();

  // The day-by-day is rendered by the V1 itinerary view, which reads Redux —
  // so the state it needs is built here, at build time, and seeded during the
  // first render. See components/trips/TripItineraryView.
  const view = tripItinerary(page) || { itinerary: null, stays: [] };

  return {
    props: {
      page,
      itinerary: view.itinerary,
      stays: view.stays,
      siblings: pickSiblings(rows, page),
      schemas: {
        trip: touristTripSchema(page),
        faq: faqSchema(page.faqs),
        breadcrumb: breadcrumbSchema([
          { name: "Trips", href: "/trips" },
          {
            name: destinationLabel(page.destination),
            href: `/trips/${page.destination}`,
          },
          { name: page.name, href: page.url },
        ]),
      },
    },
  };
}

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
import { useEffect } from "react";
import { connect } from "react-redux";

// No <Layout> on purpose. This page is the V1 itinerary shell, and
// pages/chat/[id].tsx — the V1 page it mirrors — renders no site chrome
// either: a viewport-height, non-scrolling split leaves nowhere for a nav
// bar or a footer to sit. Layout was also what called checkAuthState, so
// the page dispatches it directly, exactly as the chat page does.
import * as authaction from "../../../store/actions/auth";
import TripSeoPage, { heroImageUrl } from "../../../components/trips/TripSeoPage";
import { SITE_ORIGIN } from "../../../lib/seo/tripsIndexed";
// Commented out with the data fetching below — tripsCache requires `fs`, which
// only stays out of the client bundle while getStaticProps/getStaticPaths
// reference it. See the note in pages/trips/index.js.
// import { readTripPage, readTripsIndex } from "../../../lib/seo/tripsCache";
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

const IndexedTrip = ({ page, itinerary, stays, siblings, schemas, checkAuthState }) => {
  useEffect(() => {
    checkAuthState();
  }, []);

  const canonical = `${SITE_ORIGIN}${page.url}`;
  const ogImage = heroImageUrl(page);

  return (
    <>
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
    </>
  );
};

const mapDispatchToProps = (dispatch) => ({
  checkAuthState: () => dispatch(authaction.checkAuthState()),
});

export default connect(null, mapDispatchToProps)(IndexedTrip);

/**
 * Up to three other trips in the same destination, biased toward different trip
 * lengths so the block reads as a real choice ("5 days · 10 days · family")
 * rather than three near-identical durations. Falls back to filling from
 * whatever is left when the destination has few distinct lengths.
 *
 * Three, not six: they render as full cards now rather than list rows, so the
 * block is what a reader scrolls past to reach the end of the page.
 */
const SIBLING_COUNT = 3;

const pickSiblings = (rows, current) => {
  const pool = rows.filter(
    (row) => row.destination === current.destination && row.slug !== current.slug
  );

  const chosen = [];
  const seenDurations = new Set([current.duration]);

  for (const row of pool) {
    if (chosen.length >= SIBLING_COUNT) break;
    if (seenDurations.has(row.duration)) continue;
    seenDurations.add(row.duration);
    chosen.push(row);
  }

  for (const row of pool) {
    if (chosen.length >= SIBLING_COUNT) break;
    if (!chosen.includes(row)) chosen.push(row);
  }

  return chosen.map(tripCard).filter(Boolean);
};

// ---------------------------------------------------------------------------
// TRIPS ARE NOT DEPLOYED FROM THIS BRANCH (feature/lockin → Vercel).
//
// The empty path list below is normally the failure mode this function's
// comment warns about — it is deliberate here: scripts/tripsSeoCache.js is
// commented out of package.json's `prebuild`, so the .seo-cache snapshot does
// not exist in the Vercel build and readTripsIndex() would throw. Nothing under
// /trips is published from this branch; see the note in pages/trips/index.js
// for how to turn the group back on.
// ---------------------------------------------------------------------------
export async function getStaticPaths() {
  return { paths: [], fallback: false };

  /*
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
  */
}

export async function getStaticProps({ params }) {
  return { notFound: true };

  /* eslint-disable no-unreachable */
  /*
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
  */
}

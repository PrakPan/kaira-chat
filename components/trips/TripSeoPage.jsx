// Body of an SEO trips leaf page (/trips/<destination>/<slug>).
//
// Everything here renders on the server. There is no `useEffect` that reveals
// content, no media-query branch that swaps layouts, and no accordion that
// starts collapsed — the whole point of these pages is that a crawler which
// runs no JavaScript sees the intro, the day-by-day and the FAQs in the HTML.
// Responsive behaviour is CSS-only for the same reason.
//
// No calendar dates appear anywhere. The upstream itinerary has real start and
// end dates on it, but these are evergreen pages: a trip stamped "8 Dec 2026"
// is stale the moment that date passes, and the dates belong to a real
// customer's booking. lib/seo/tripsIndexed.js strips them; days arrive here
// already numbered.

import Link from "next/link";
import styled from "styled-components";

import ItineraryCardV2 from "../revamp/destination/ItineraryCardV2";
import FaqSection from "../revamp/home/FaqSection";
import TripItineraryView from "./TripItineraryView";
// See TripsHub: the card's `--ttw-*` tokens live on `.ttwRevamp`, not :root.
import revamp from "../../styles/pages/revamp/home.module.scss";
import { optimizedImageUrl, resolveImageUrl } from "../../helper/imageUrl";
import {
  destinationLabel,
  durationLabel,
  formatINR,
  nightsLabel,
  roundedPerPerson,
} from "../../lib/seo/tripsFormat";

const MAX_WIDTH = "87%";

// ── Layout ──────────────────────────────────────────────────────────────────

const Article = styled.article`
  max-width: ${MAX_WIDTH};
  margin: 0 auto;
  padding: 16px 20px 72px;
  color: #1c1c1c;
  font-family: "Inter", system-ui, -apple-system, sans-serif;
  line-height: 1.6;

  @media (max-width: 600px) {
    padding: 12px 16px 56px;
  }
`;


// The editorial headings across the itinerary views are Inter Medium, not bold.
const Title = styled.h1`
  font-size: clamp(26px, 4.4vw, 38px);
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 1.22;
  margin: 0 0 14px;
`;





const SectionTitle = styled.h2`
  font-size: clamp(20px, 2.6vw, 25px);
  font-weight: 500;
  letter-spacing: -0.01em;
  margin: 0 0 16px;
`;

// ── Route strip ─────────────────────────────────────────────────────────────


// ── Price ───────────────────────────────────────────────────────────────────



// ── Day by day ──────────────────────────────────────────────────────────────




// ── Stays / FAQs / links ────────────────────────────────────────────────────





// ── Itinerary-column chrome ─────────────────────────────────────────────────

// Sits above the day-by-day, inside the itinerary column. Deliberately compact:
// the page opens on the itinerary itself, so this only has to name the trip and
// state its shape.
const ColumnHead = styled.header`
  padding: 22px 4px 4px;

  h1 {
    font-family: "Geist", "Inter", system-ui, -apple-system, sans-serif;
    font-size: clamp(23px, 2.6vw, 30px);
    font-weight: 600;
    letter-spacing: -0.025em;
    line-height: 1.15;
    color: #0b1220;
    margin: 0 0 10px;
  }
`;

const Facts = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  list-style: none;
  margin: 0;
  padding: 0;

  li {
    font-size: 12.5px;
    color: #3d3d3d;
    background: #f4f3f0;
    border-radius: 999px;
    padding: 4px 11px;
  }
`;

// ── Sections under the day-by-day ───────────────────────────────────────────

const BelowSections = styled.div`
  display: flex;
  flex-direction: column;
  gap: 34px;
  padding: 8px 4px 56px;
`;

const ListTitle = styled.h2`
  font-family: "Geist", "Inter", system-ui, -apple-system, sans-serif;
  font-size: 19px;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: #0b1220;
  margin: 0 0 12px;
`;

// Same divided-list treatment the V1 transfers section uses, so these read as
// part of the itinerary rather than as a separate marketing block.
const TripList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  border-top: 1px solid #ececec;

  li {
    border-bottom: 1px solid #ececec;
  }

  a {
    display: flex;
    flex-direction: column;
    gap: 3px;
    padding: 12px 2px;
    text-decoration: none;
    color: #0b1220;
  }

  a:hover .name {
    color: #1f6feb;
  }

  .name {
    font-size: 14.5px;
    font-weight: 500;
    line-height: 1.35;
  }

  .meta {
    font-size: 12px;
    color: #7a828d;
  }
`;

// ── Helpers ─────────────────────────────────────────────────────────────────

const DEFAULT_HERO = "https://thetarzanway.com/og-image.png";

/**
 * `images` is null on about four rows in five, so the city photos are the real
 * source here and the site default is the last resort. Returned as a raw
 * reference; callers pick their own resolver.
 */
export const heroImageRef = (page) => {
  if (Array.isArray(page?.images) && page.images.length) return page.images[0];
  const withImage = (page?.cities || []).find((city) => city?.image);
  return withImage?.image || null;
};

/** Absolute URL for og:image — meta tags cannot take a bare media key. */
export const heroImageUrl = (page) => resolveImageUrl(heroImageRef(page)) || DEFAULT_HERO;

// ── Component ───────────────────────────────────────────────────────────────

const TripSeoPage = ({
  page,
  siblings = [],
  // Build-time itinerary state for the V1 view. `stays` is renamed on the way
  // in because the raw snapshot also has a `stays` key with a different shape.
  itinerary = null,
  stays: itineraryStays = [],
}) => {
  const {
    id,
    name,
    url,
    destination,
    group_type: groupType,
    duration,
    intro,
    cities = [],
    faqs = [],
  } = page;

  const region = destinationLabel(destination);
  const hubHref = `/trips/${destination}`;
  const perPerson = roundedPerPerson(page.price);
  const hero = heroImageRef(page);

  return (
    // No article chrome: no breadcrumb strip, hero figure, fact pills or price
    // box. This page is the itinerary, laid out exactly as V1 — 50/50
    // itinerary/chat — and everything the old header carried is either in the
    // itinerary column's own head or in Kaira's opening message.
    <TripItineraryView
      itinerary={itinerary}
      stays={itineraryStays}
      introMessage={intro}
      header={
        <ColumnHead>
          {/* The page's only h1. The article chrome above it is gone, but a
              trips leaf still has to name itself for search — and V1 shows the
              itinerary's name at the top of its itinerary panel too, so this
              matches rather than departs from it. */}
          <h1>{name}</h1>
          <Facts>
            {durationLabel(duration) && <li>{durationLabel(duration)}</li>}
            {region && <li>{region}</li>}
            {groupType && <li>{groupType}</li>}
            {perPerson && <li>From {formatINR(perPerson)} per person</li>}
          </Facts>
        </ColumnHead>
      }
      below={
        // Stacked under the day-by-day in the itinerary column, the same place
        // and the same list treatment the V1 transfers section uses — so the
        // page reads as one document and every one of these stays a real,
        // crawlable item rather than something a script reveals later.
        <BelowSections>
          {faqs.length > 0 && (
            <FaqSection
              heading="Questions people ask"
              lede={`About this ${region} trip.`}
              Faqs={faqs.map((faq) => ({
                question: faq.q,
                answer: faq.a,
              }))}
            />
          )}

          {siblings.length > 0 && (
            <section>
              <ListTitle>More {region} trips</ListTitle>
              <TripList>
                {siblings.map((sibling) => (
                  <li key={sibling.path || sibling.name}>
                    <Link href={`/${sibling.path}`}>
                      <span className="name">{sibling.name}</span>
                      {sibling.includes?.length > 0 && (
                        <span className="meta">
                          {sibling.includes.join(" · ")}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </TripList>
            </section>
          )}

          <section>
            <ListTitle>Browse more</ListTitle>
            <TripList>
              <li>
                <Link href={hubHref}>
                  <span className="name">All {region} itineraries</span>
                </Link>
              </li>
              <li>
                <Link href="/trips">
                  <span className="name">All trip itineraries</span>
                </Link>
              </li>
            </TripList>
          </section>
        </BelowSections>
      }
    />
  );
};

export default TripSeoPage;

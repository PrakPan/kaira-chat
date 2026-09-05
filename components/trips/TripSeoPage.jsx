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

import { Fragment } from "react";
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

// Heading row for the trips block: the title on the left, the way out to the
// full index on the right. It replaces the old "Browse more" list, so the link
// has to stay a real anchor — it is now this page's only crawlable route into
// /trips.
const SectionHead = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;

  h2 {
    margin: 0;
  }
`;

const SeeAll = styled(Link)`
  flex-shrink: 0;
  font-family: "Geist", "Inter", system-ui, -apple-system, sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #0b1220;
  text-decoration: none;
  white-space: nowrap;
  border-bottom: 1px solid #d7d7d7;
  padding-bottom: 1px;

  &:hover {
    color: #0b1220;
    border-bottom-color: #0b1220;
  }
`;

// One card per row. The card is an image-left/body-right layout above 640px
// and stacks itself below that, so it only needs a full-width column here.
const TripCardStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;


// The hairline arrow BotApp puts between route stops. Copied rather than
// imported: BotApp is the live chat shell, and pulling it in for a 22x8 svg
// would drag its whole session bootstrap along.
const RouteArrow = () => (
  <svg width="22" height="8" viewBox="0 0 22 8" fill="none" aria-hidden className="shrink-0">
    <path
      d="M0 4h20M17 1l3.2 3-3.2 3"
      stroke="#c3c7cc"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Sits above the day-by-day, inside the itinerary column — the slot BotApp's
// trip strip occupies on a V1 itinerary.
const ColumnHead = styled.header`
  padding: 4px 2px 14px;
  border-bottom: 1px solid #ececec;
  margin-bottom: 4px;
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
  const perPerson = roundedPerPerson(page.price);
  const hero = heroImageRef(page);
  // The header's second line: who it is for, how long, and the price.
  const metaLine = [
    groupType,
    durationLabel(duration),
    perPerson ? `from ${formatINR(perPerson)} per person` : null,
  ]
    .filter(Boolean)
    .join(" · ");

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
        // Matches BotApp's V1 trip strip: the name, a meta line, then the route
        // in Instrument Serif italic with hairline arrows between stops. The
        // classes are lifted from that header (routeStopEls / RouteArrow) so a
        // /trips leaf and a /chat archive read identically.
        <ColumnHead>
          <h1 className="font-inter font-bold md:font-extrabold text-[18px] md:text-[24px] leading-[1.2] tracking-[-0.4px] text-[#0b1220] m-0">
            {name}
          </h1>

          {metaLine && (
            <p className="text-[13px] max-ph:text-[12px] font-inter text-[#3b4149] m-0 mt-[6px]">
              {metaLine}
            </p>
          )}

          {cities.length > 0 && (
            <div className="flex flex-wrap items-center gap-x-[10px] gap-y-[8px] min-w-0 mt-[11px]">
              {cities.map((city, index) => (
                <Fragment key={`${city.name}-${index}`}>
                  {index > 0 && <RouteArrow />}
                  {/* Instrument Serif ships a single 400 weight, so contrast
                      comes from size and ink rather than a faux bold. */}
                  <span className="font-serif italic text-[17px] max-ph:text-[15px] leading-[1.25] text-[#171A1F] whitespace-nowrap">
                    {city.name}
                    {city.nights > 0 && <> ({city.nights}N)</>}
                  </span>
                </Fragment>
              ))}
            </div>
          )}
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
              <SectionHead>
                <ListTitle>More {region} trips</ListTitle>
                <SeeAll href="/trips">See all trips →</SeeAll>
              </SectionHead>
              {/* The card reads its `--ttw-*` tokens off `.ttwRevamp` rather
                  than :root, so without this scope it renders borderless and
                  transparent — the same wrapper TripsHub needs. */}
              <div className={revamp.ttwRevamp}>
                <TripCardStack>
                  {siblings.map((sibling) => (
                    <ItineraryCardV2
                      key={sibling.path || sibling.name}
                      itinerary={sibling}
                      currency={sibling.currency}
                    />
                  ))}
                </TripCardStack>
              </div>
            </section>
          )}
        </BelowSections>
      }
    />
  );
};

export default TripSeoPage;

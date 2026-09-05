// Listing body shared by the trips root (/trips) and the destination hubs
// (/trips/<destination>).
//
// Rendered as a real HTML list, not a client-side filtered grid: hubs are the
// pages targeting the head terms ("bali tour packages"), and a grid that only
// populates after hydration gives a crawler an empty <div> to index.

import Link from "next/link";
import styled from "styled-components";

import ItineraryCardV2 from "../revamp/destination/ItineraryCardV2";
// The card's stylesheet reads 35 `--ttw-*` custom properties, and they are
// declared on `.ttwRevamp` rather than :root. Without this scope the card still
// lays out but loses its border and background, because `var(--ttw-line)`
// doesn't resolve and the shorthand falls back to `0px none`.
import revamp from "../../styles/pages/revamp/home.module.scss";
import TripsFilters from "./TripsFilters";
// From the pure length module, NOT tripsCards: that one reads the .seo-cache
// off disk, and importing it here pulls `fs` into the client bundle.
import { LENGTH_BUCKETS } from "../../lib/seo/tripLength";

// Geist for the page's own chrome — heading, intro, section titles, chips. It
// is already fetched in _document.js alongside Inter, so this costs nothing.
// The trip cards inside keep Inter: they render under `.ttwRevamp`, which sets
// its own family, and they are shared with the homepage and theme pages.
const Wrapper = styled.div`
  width: min(1240px, 100%);
  margin: 0 auto;
  padding: 30px 24px 80px;
  color: #0b1220;
  font-family: "Geist", "Inter", system-ui, -apple-system, sans-serif;
  line-height: 1.6;

  @media (max-width: 600px) {
    padding: 20px 16px 56px;
  }
`;

const Crumbs = styled.nav`
  font-size: 13px;
  color: #6b6b6b;
  margin-bottom: 18px;

  a {
    color: #6b6b6b;
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
  span[aria-hidden] {
    padding: 0 6px;
  }
`;

const Title = styled.h1`
  font-size: clamp(30px, 4.6vw, 46px);
  font-weight: 600;
  letter-spacing: -0.03em;
  line-height: 1.08;
  margin: 0 0 12px;
`;

// Narrower measure and a lighter ink than the heading, so the two read as a
// pair rather than one block of dark text at two sizes.
const Intro = styled.p`
  font-size: clamp(15px, 1.3vw, 17px);
  line-height: 1.6;
  color: #5c6470;
  margin: 0 0 8px;
  max-width: 62ch;
`;

const SectionTitle = styled.h2`
  font-size: clamp(20px, 2.2vw, 26px);
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.2;
  margin: 44px 0 18px;
`;

// Two-up on desktop, single column below — the same grid the homepage and the
// theme pages put these cards in, so the card keeps the proportions it was
// designed at (its image column is a fixed 240px).
const Cards = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 22px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

// A filtered-out card stays in the DOM (and in the served HTML) and is hidden
// with CSS — see the note in TripsFilters. `display: none` also takes it out of
// the grid flow, so the remaining cards close up rather than leaving holes.
const CardSlot = styled.div`
  display: ${(p) => (p.$hidden ? "none" : "block")};
`;

const Empty = styled.p`
  font-size: 15px;
  color: #6b6b6b;
  margin: 0 0 18px;
`;

// Ruled off from the trips above it: this is the "where else can I go" index at
// the foot of the page, not another band of content.
const DestinationsBlock = styled.section`
  margin-top: 56px;
  padding-top: 8px;
  border-top: 1px solid #ececec;
`;

const DestinationsNote = styled.p`
  font-size: 14px;
  color: #7a828d;
  margin: -6px 0 20px;
`;

// A columned index, not pills. 146 destinations laid out as wrapping pills made
// an 800px wall of lozenges with no scanning order — the complaint that this
// section looked "piled up". Columns give it an alphabet-like rhythm, put the
// count where the eye can compare them, and cost less than half the height.
// Every destination stays a real anchor, which is the point of the block.
const DestinationList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  columns: 4;
  column-gap: 32px;

  @media (max-width: 1100px) {
    columns: 3;
  }
  @media (max-width: 760px) {
    columns: 2;
  }
  @media (max-width: 430px) {
    columns: 1;
  }

  li {
    break-inside: avoid;
  }

  a {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
    padding: 6px 0;
    color: #0b1220;
    text-decoration: none;
    font-size: 14.5px;
    line-height: 1.35;
    border-bottom: 1px solid transparent;
  }

  a:hover {
    color: #1f6feb;
  }

  em {
    font-style: normal;
    color: #9aa1ab;
    font-size: 12.5px;
    font-variant-numeric: tabular-nums;
    flex-shrink: 0;
  }
`;

const TripsHub = ({ crumbs = [], title, intro, sections = [], chips = null }) => (
  <Wrapper>
    {crumbs.length > 0 && (
      <Crumbs aria-label="Breadcrumb">
        {crumbs.map((crumb, index) => (
          <span key={crumb.href || crumb.name}>
            {index > 0 && <span aria-hidden="true">/</span>}
            {crumb.href ? <Link href={crumb.href}>{crumb.name}</Link> : <span>{crumb.name}</span>}
          </span>
        ))}
      </Crumbs>
    )}

    <Title>{title}</Title>
    {intro && <Intro>{intro}</Intro>}

    {sections.map((section) => (
      <section key={section.title}>
        <SectionTitle>{section.title}</SectionTitle>
        {/* Built at build time (lib/seo/tripsCards), so each card is a real
            anchor in the served HTML — these hubs are the pages targeting the
            head terms, and a grid that only fills in after hydration would give
            a crawler an empty div. The filter hides non-matching cards rather
            than unmounting them, for the same reason. */}
        <TripsFilters cards={section.items} lengthBuckets={LENGTH_BUCKETS}>
          {(isVisible, visibleCount) => (
            <div className={revamp.ttwRevamp}>
              {visibleCount === 0 && (
                <Empty>No trips match those filters yet.</Empty>
              )}
              <Cards>
                {section.items.map((item) => (
                  <CardSlot
                    key={item.path || item.name}
                    $hidden={!isVisible(item)}
                  >
                    <ItineraryCardV2
                      itinerary={item}
                      currency={item.currency}
                    />
                  </CardSlot>
                ))}
              </Cards>
            </div>
          )}
        </TripsFilters>
      </section>
    ))}
    {/* Destinations last: they navigate away from this page, so they belong
        after the trips rather than in front of them. */}
    {chips && (
      <DestinationsBlock>
        <SectionTitle>{chips.title}</SectionTitle>
        {chips.note && <DestinationsNote>{chips.note}</DestinationsNote>}
        <DestinationList>
          {chips.items.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>
                <span>{item.label}</span>
                {item.count != null && <em>{item.count}</em>}
              </Link>
            </li>
          ))}
        </DestinationList>
      </DestinationsBlock>
    )}
  </Wrapper>
);

export default TripsHub;

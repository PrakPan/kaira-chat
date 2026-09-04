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

const Wrapper = styled.div`
  width: 87%;
  margin: 0 auto;
  padding: 16px 20px 72px;
  color: #1c1c1c;
  font-family: "Inter", system-ui, -apple-system, sans-serif;
  line-height: 1.6;

  @media (max-width: 600px) {
    padding: 12px 16px 56px;
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
  font-size: clamp(26px, 4.4vw, 38px);
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 1.22;
  margin: 0 0 14px;
`;

const Intro = styled.p`
  font-size: 17px;
  color: #2b2b2b;
  margin: 0 0 30px;
  max-width: 70ch;
`;

const SectionTitle = styled.h2`
  font-size: clamp(19px, 2.4vw, 23px);
  font-weight: 500;
  margin: 34px 0 14px;
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

const Chips = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  a {
    display: inline-block;
    border: 1px solid #e6e4df;
    border-radius: 999px;
    padding: 7px 14px;
    color: #1c1c1c;
    text-decoration: none;
    font-size: 14px;
  }

  a:hover {
    border-color: #c9c7c0;
  }

  em {
    font-style: normal;
    color: #8a8a8a;
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

    {chips && (
      <>
        <SectionTitle>{chips.title}</SectionTitle>
        <Chips>
          {chips.items.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>
                {item.label} {item.count != null && <em>({item.count})</em>}
              </Link>
            </li>
          ))}
        </Chips>
      </>
    )}

    {sections.map((section) => (
      <section key={section.title}>
        <SectionTitle>{section.title}</SectionTitle>
        {/* Built at build time (lib/seo/tripsCards), so each card is a real
            anchor in the served HTML — these hubs are the pages targeting the
            head terms, and a grid that only fills in after hydration would give
            a crawler an empty div. */}
        <div className={revamp.ttwRevamp}>
          <Cards>
            {section.items.map((item) => (
              <ItineraryCardV2
                key={item.path || item.name}
                itinerary={item}
                currency={item.currency}
              />
            ))}
          </Cards>
        </div>
      </section>
    ))}
  </Wrapper>
);

export default TripsHub;

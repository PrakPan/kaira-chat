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

import { optimizedImageUrl, resolveImageUrl } from "../../helper/imageUrl";
import {
  destinationLabel,
  durationLabel,
  formatINR,
  nightsLabel,
  roundedPerPerson,
} from "../../lib/seo/tripsFormat";

const MAX_WIDTH = "920px";

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

// The editorial headings across the itinerary views are Inter Medium, not bold.
const Title = styled.h1`
  font-size: clamp(26px, 4.4vw, 38px);
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 1.22;
  margin: 0 0 14px;
`;

const Hero = styled.figure`
  margin: 0 0 22px;
  border-radius: 14px;
  overflow: hidden;
  background: #f0efec;

  img {
    display: block;
    width: 100%;
    height: auto;
    aspect-ratio: 16 / 9;
    object-fit: cover;
  }
`;

const Facts = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  list-style: none;
  margin: 0 0 22px;
  padding: 0;

  li {
    font-size: 13px;
    color: #3d3d3d;
    background: #f4f3f0;
    border-radius: 999px;
    padding: 5px 12px;
  }
`;

const Intro = styled.p`
  font-size: 17px;
  color: #2b2b2b;
  margin: 0 0 28px;
`;

const Section = styled.section`
  margin: 0 0 38px;
`;

const SectionTitle = styled.h2`
  font-size: clamp(20px, 2.6vw, 25px);
  font-weight: 500;
  letter-spacing: -0.01em;
  margin: 0 0 16px;
`;

// ── Route strip ─────────────────────────────────────────────────────────────

const Route = styled.ol`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  list-style: none;
  margin: 0;
  padding: 0;

  li {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 15px;
  }

  li + li::before {
    content: "→";
    color: #a5a5a5;
  }

  strong {
    font-weight: 500;
  }

  em {
    font-style: normal;
    color: #6b6b6b;
    font-size: 13px;
  }
`;

// ── Price ───────────────────────────────────────────────────────────────────

const Price = styled.div`
  border: 1px solid #e6e4df;
  border-radius: 14px;
  padding: 18px 20px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 14px;

  .amount {
    font-size: 26px;
    font-weight: 500;
    letter-spacing: -0.01em;
  }

  .caption {
    font-size: 13px;
    color: #6b6b6b;
    margin-top: 2px;
  }
`;

const Cta = styled.a`
  display: inline-block;
  background: #1c1c1c;
  color: #fff;
  border-radius: 999px;
  padding: 12px 24px;
  font-size: 15px;
  font-weight: 500;
  text-decoration: none;

  &:hover {
    background: #333;
    color: #fff;
  }
`;

// ── Day by day ──────────────────────────────────────────────────────────────

const Days = styled.ol`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const Day = styled.li`
  border-left: 2px solid #ecebe7;
  padding: 0 0 26px 20px;
  position: relative;

  &:last-child {
    padding-bottom: 0;
    border-left-color: transparent;
  }

  &::before {
    content: "";
    position: absolute;
    left: -5px;
    top: 7px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #c9c7c0;
  }

  h3 {
    font-size: 15px;
    font-weight: 500;
    margin: 0 0 4px;
  }

  .where {
    font-size: 13px;
    color: #6b6b6b;
    margin: 0 0 10px;
  }

  .summary {
    font-size: 15px;
    color: #2b2b2b;
    margin: 0 0 10px;
  }
`;

const Elements = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 10px;

  li {
    background: #faf9f7;
    border-radius: 10px;
    padding: 12px 14px;
  }

  .band {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: #8a8a8a;
  }

  .heading {
    font-size: 15px;
    font-weight: 500;
    margin: 2px 0 0;
  }

  .one-liner {
    font-size: 14px;
    color: #5a5a5a;
    margin: 4px 0 0;
  }
`;

// ── Stays / FAQs / links ────────────────────────────────────────────────────

const Stays = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 8px;

  li {
    font-size: 15px;
  }

  em {
    font-style: normal;
    color: #6b6b6b;
    font-size: 13px;
  }
`;

const Faqs = styled.div`
  display: grid;
  gap: 18px;

  h3 {
    font-size: 16px;
    font-weight: 500;
    margin: 0 0 6px;
  }

  p {
    font-size: 15px;
    color: #4a4a4a;
    margin: 0;
  }
`;

const Related = styled.nav`
  font-size: 15px;

  ul {
    list-style: none;
    margin: 10px 0 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

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

const TripSeoPage = ({ page, siblings = [] }) => {
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
    days = [],
    stays = [],
  } = page;

  const region = destinationLabel(destination);
  const hubHref = `/trips/${destination}`;
  const perPerson = roundedPerPerson(page.price);
  const hero = heroImageRef(page);

  return (
    <Article>
      <Crumbs aria-label="Breadcrumb">
        <Link href="/trips">Trips</Link>
        <span aria-hidden="true">/</span>
        <Link href={hubHref}>{region}</Link>
        <span aria-hidden="true">/</span>
        <span>{durationLabel(duration) || name}</span>
      </Crumbs>

      <Title>{name}</Title>

      {hero && (
        <Hero>
          {/* Explicit dimensions + high priority: this is the LCP element, and
              a plain <img> keeps it in the HTML for crawlers that never run the
              image component's client code. */}
          <img
            src={optimizedImageUrl(hero, { width: 1200 })}
            alt={name}
            width={1200}
            height={675}
            fetchpriority="high"
            decoding="async"
          />
        </Hero>
      )}

      <Facts>
        {durationLabel(duration) && <li>{durationLabel(duration)}</li>}
        {region && <li>{region}</li>}
        {groupType && <li>{groupType} trip</li>}
        {cities.length > 0 && (
          <li>
            {cities.length} {cities.length === 1 ? "stop" : "stops"}
          </li>
        )}
      </Facts>

      {intro && <Intro>{intro}</Intro>}

      {cities.length > 0 && (
        <Section>
          <SectionTitle>Where you go</SectionTitle>
          <Route>
            {cities.map((city, index) => (
              <li key={`${city.name}-${index}`}>
                <span>
                  <strong>{city.name}</strong>{" "}
                  {nightsLabel(city.nights) && <em>{nightsLabel(city.nights)}</em>}
                </span>
              </li>
            ))}
          </Route>
        </Section>
      )}

      {perPerson && (
        <Section>
          <Price>
            <div>
              <div className="amount">From {formatINR(perPerson)}</div>
              <div className="caption">
                per person, twin sharing — stays, transfers and listed activities
                included
              </div>
            </div>
            <Cta href={`/itinerary/${id}`}>Customise this trip</Cta>
          </Price>
        </Section>
      )}

      {days.length > 0 && (
        <Section>
          <SectionTitle>Day by day</SectionTitle>
          <Days>
            {days.map((day) => (
              <Day key={day.day}>
                <h3>Day {day.day}</h3>
                {day.cities?.length > 0 && (
                  <p className="where">{day.cities.join(" → ")}</p>
                )}
                {day.summaries?.map((summary, index) => (
                  <p className="summary" key={index}>
                    {summary}
                  </p>
                ))}
                {day.elements?.length > 0 && (
                  <Elements>
                    {day.elements.map((element, index) => (
                      <li key={index}>
                        {element.band && <span className="band">{element.band}</span>}
                        <p className="heading">{element.heading}</p>
                        {element.oneLiner && (
                          <p className="one-liner">{element.oneLiner}</p>
                        )}
                      </li>
                    ))}
                  </Elements>
                )}
              </Day>
            ))}
          </Days>
        </Section>
      )}

      {stays.length > 0 && (
        <Section>
          <SectionTitle>Where you stay</SectionTitle>
          <Stays>
            {stays.map((stay, index) => (
              <li key={`${stay.name}-${index}`}>
                {stay.name}{" "}
                <em>
                  {[stay.city, stay.stars ? `${stay.stars}-star` : null]
                    .filter(Boolean)
                    .join(" · ")}
                </em>
              </li>
            ))}
          </Stays>
        </Section>
      )}

      {faqs.length > 0 && (
        <Section>
          <SectionTitle>Questions people ask</SectionTitle>
          {/* Rendered verbatim from the same objects the FAQPage JSON-LD is
              built from — Google flags markup whose answers are not visible. */}
          <Faqs>
            {faqs.map((faq, index) => (
              <div key={index}>
                <h3>{faq.q}</h3>
                <p>{faq.a}</p>
              </div>
            ))}
          </Faqs>
        </Section>
      )}

      <Section>
        <Related aria-label={`More ${region} trips`}>
          <SectionTitle>More {region} trips</SectionTitle>
          <ul>
            {siblings.map((sibling) => (
              <li key={sibling.slug}>
                <Link href={sibling.url}>{sibling.label}</Link>
              </li>
            ))}
            <li>
              <Link href={hubHref}>All {region} itineraries</Link>
            </li>
          </ul>
        </Related>
      </Section>
    </Article>
  );
};

export default TripSeoPage;

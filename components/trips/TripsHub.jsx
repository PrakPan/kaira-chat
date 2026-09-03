// Listing body shared by the trips root (/trips) and the destination hubs
// (/trips/<destination>).
//
// Rendered as a real HTML list, not a client-side filtered grid: hubs are the
// pages targeting the head terms ("bali tour packages"), and a grid that only
// populates after hydration gives a crawler an empty <div> to index.

import Link from "next/link";
import styled from "styled-components";

const Wrapper = styled.div`
  max-width: 960px;
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

const Cards = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 10px;

  li {
    border: 1px solid #eceae5;
    border-radius: 12px;
  }

  a {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: space-between;
    gap: 6px 16px;
    padding: 14px 16px;
    color: #1c1c1c;
    text-decoration: none;
  }

  a:hover {
    background: #faf9f7;
  }

  .name {
    font-size: 16px;
    font-weight: 500;
    flex: 1 1 320px;
  }

  .meta {
    font-size: 13px;
    color: #6b6b6b;
    white-space: nowrap;
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
        <Cards>
          {section.items.map((item) => (
            <li key={item.url}>
              <Link href={item.url}>
                <span className="name">{item.name}</span>
                <span className="meta">{item.meta}</span>
              </Link>
            </li>
          ))}
        </Cards>
      </section>
    ))}
  </Wrapper>
);

export default TripsHub;

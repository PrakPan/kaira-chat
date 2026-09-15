// Blog-page chrome for the SEO trips leaf pages.
//
// These pages used to be the V1 chat shell: a viewport-height 50/50 split with
// the itinerary on the left and a live chat panel on the right. That panel was
// dead weight — a statically exported, evergreen archive has no thread to hold
// — so the page now reads as a document instead, laid out like
// /blog/<slug> on production:
//
//   breadcrumb + H1 + standfirst
//   ┌ article ───────────────────────┬ aside (360px, sticky) ┐
//   │ photo carousel + trust marks   │ Get my trip           │
//   │ the itinerary                  │ Chat with Kaira       │
//   │ FAQs                           │                       │
//   │ other ways to do this place    │                       │
//
// The ink/yellow tokens, the 44px gutter, the sidebar card's radial glow and
// the FAQ's +/– markers are lifted from that blog template so the two surfaces
// are visibly the same product rather than merely similar.
//
// The name moved off the photograph and above the columns, and the photograph
// became a carousel inside the left one, so the price panel starts level with
// the first picture — the shape every package page a reader compares this
// against already uses. The measure widened to 1360 with the article on `1fr`
// at the same time: at 1200/760 the width the page gained went into the gutter
// between the columns rather than into the content.
//
// styled-components rather than Tailwind for the same reason the rest of this
// file tree uses it, plus one specific hazard: the app's global styles.css
// defines a bare `.border` rule carrying a Material box-shadow, so any Tailwind
// `border` utility silently picks up a drop shadow.
//
// Everything renders expanded on the server. The FAQ is a <details> — the same
// element the blog uses — which keeps every answer in the served HTML for a
// crawler that runs no JavaScript, unlike a JS-gated accordion.

import { useRef, useState } from "react";
import Link from "next/link";
import styled from "styled-components";

import ItineraryCardV2 from "../revamp/destination/ItineraryCardV2";
// See TripsHub: the card reads its `--ttw-*` tokens off `.ttwRevamp`, not
// :root, so without this scope it renders borderless and transparent.
import revamp from "../../styles/pages/revamp/home.module.scss";
import { optimizedImageUrl } from "../../helper/imageUrl";
import { formatINR } from "../../lib/seo/tripsFormat";

// The blog's palette, verbatim.
const INK = "#0b1220";
const INK_2 = "#445069";
const INK_3 = "#8a93a6";
const LINE = "#e5e7eb";
const YELLOW = "#f7e700";
const YELLOW_INK = "#1a1a00";
const SERIF = "'Instrument Serif', 'Times New Roman', serif";

// ── Shell ───────────────────────────────────────────────────────────────────

export const Wrap = styled.div`
  max-width: 1360px;
  margin: 0 auto;
  padding: 0 28px;

  @media (max-width: 700px) {
    padding: 0 16px;
  }
`;

/** The two-column body. Collapses to one column before the aside would squeeze
 *  the itinerary — the day-by-day rows carry hotel names and tag pills and stop
 *  being readable well above the point the grid technically still fits. */
export const Main = styled.div`
  display: grid;
  /* The article takes the width the measure gains rather than the gap taking
     it: a fixed 760px column with space-between left the extra room between the
     two columns, which is the whitespace this was meant to remove. */
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 44px;
  /* Little space above: the masthead directly overhead already carries its own
     bottom padding, and the photographs are meant to sit right under the name. */
  padding: 10px 0 24px;

  /* 1023.98 rather than 1024 so this is the exact complement of Tailwind's
     built-in \`lg\` (min-width: 1024px), which the shell uses for the pieces
     that have to appear precisely where this grid stops being two columns.
     Arbitrary \`min-[...]\` variants are unavailable in this project — the
     tailwind config's \`screens\` holds objects, which silently disables them. */
  @media (max-width: 1023.98px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 32px;
    padding: 6px 0 16px;
  }
`;

export const Article = styled.article`
  min-width: 0;
  font-family: "Inter", system-ui, -apple-system, sans-serif;
  color: ${INK_2};
  line-height: 1.6;
`;

/** `align-self: start` is what actually makes `position: sticky` work in a grid
 *  — a stretched item is already as tall as the row and has nowhere to travel.
 *  Sticks to 24px rather than the blog's 92px because this page has no fixed
 *  site navbar above it to clear. */
export const Side = styled.aside`
  position: sticky;
  top: 24px;
  align-self: start;

  @media (max-width: 1023.98px) {
    position: static;
  }
`;

// ── Masthead ────────────────────────────────────────────────────────────────

// The trip's name, its breadcrumb and its standfirst, on white, above the two
// columns — rather than reversed out of a full-bleed photograph.
//
// The photograph moved into the left column as a carousel (below), and the
// price panel now starts level with it on the right, which is the layout the
// package pages this page competes with all use. Type is unchanged from the
// hero it replaces; only the colours flip, because the ground is white now.
const Masthead = styled.header`
  padding: 26px 0 18px;

  @media (max-width: 700px) {
    padding: 18px 0 14px;
  }

  h1 {
    font-family: "Inter", system-ui, sans-serif;
    /* Sized for a page heading rather than for the hero poster this used to
       be — it sits on white above the content now, not over a photograph. */
    font-size: clamp(24px, 2.6vw, 34px);
    font-weight: 800;
    line-height: 1.15;
    letter-spacing: -0.025em;
    color: ${INK};
    margin: 0;
    max-width: 900px;
    text-wrap: balance;
  }

  h1 em {
    font-family: ${SERIF};
    font-style: italic;
    font-weight: 400;
    letter-spacing: -0.015em;
  }

  /* The standfirst — what the trip actually is, in one paragraph, directly
     under the heading. */
  .dek {
    font-size: clamp(15px, 1.4vw, 18px);
    line-height: 1.55;
    max-width: 720px;
    margin: 12px 0 0;
    color: ${INK_2};
  }

  .crumbs {
    font-size: 12.5px;
    color: ${INK_3};
    margin-bottom: 12px;
  }

  .crumbs a {
    color: ${INK_3};
    text-decoration: none;
  }

  .crumbs a:hover {
    color: ${INK};
  }

  /* The chip sits beside the heading on a wide screen and under it on a phone,
     which is why the row wraps rather than the chip being moved in JS. */
  .head {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px 14px;
  }
`;

const Chip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: ${YELLOW};
  color: ${YELLOW_INK};
  font-family: "Inter", system-ui, sans-serif;
  font-weight: 600;
  font-size: 12px;
  padding: 5px 12px;
  border-radius: 999px;
  width: max-content;
  line-height: 1.3;
`;

export const TripMasthead = ({ page, region, title, metaLine, description }) => (
  <Masthead>
    <div className="crumbs">
      <Link href="/trips">Trips</Link>
      {region ? (
        <>
          {" · "}
          <Link href={`/trips/${page.destination}`}>{region}</Link>
        </>
      ) : null}
    </div>
    <div className="head">
      <h1>{title}</h1>
      {metaLine && (
        <Chip>
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#16a34a",
            }}
          />
          {metaLine}
        </Chip>
      )}
    </div>
    {description && <p className="dek">{description}</p>}
  </Masthead>
);

// ── The photographs ─────────────────────────────────────────────────────────

/**
 * The trip's own pictures — the itinerary gallery: its cities, its hotels and
 * the places it actually visits.
 *
 * One frame, not a wall of thumbnails. A trip with a single photograph shows
 * that photograph; a trip with more turns the same frame into a carousel. The
 * count decides, so nothing has to be configured per trip.
 *
 * The track is a scroll-snap container, so every slide is in the served HTML
 * and the thing works with no JavaScript at all — the arrows and the counter
 * are an enhancement on top of a list a crawler can already read.
 */
const Frame = styled.div`
  position: relative;
  /* Square along the bottom: the trust band butts straight up against it and
     carries the lower pair of corners for the pair (see TrustBar). */
  border-radius: 16px 16px 0 0;
  overflow: hidden;
  background: #eef0f3;

  .track {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
  }

  .track::-webkit-scrollbar {
    display: none;
  }

  figure {
    position: relative;
    flex: 0 0 100%;
    margin: 0;
    aspect-ratio: 16 / 9;
    scroll-snap-align: start;
    background: #eef0f3;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  figcaption {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 34px 16px 12px;
    font-family: "Inter", system-ui, sans-serif;
    font-size: 13.5px;
    font-weight: 600;
    color: #fff;
    line-height: 1.3;
    background: linear-gradient(rgba(11, 18, 32, 0), rgba(11, 18, 32, 0.7));
  }

  .nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 34px;
    height: 34px;
    border-radius: 50%;
    border: 0;
    background: #fff;
    color: ${INK};
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 10px rgba(11, 18, 32, 0.22);
    transition: opacity 0.15s;
  }

  .nav[disabled] {
    opacity: 0.35;
    cursor: default;
  }

  .nav.prev {
    left: 12px;
  }

  .nav.next {
    right: 12px;
  }

  .count {
    position: absolute;
    top: 12px;
    right: 12px;
    background: rgba(11, 18, 32, 0.6);
    color: #fff;
    font-family: "Inter", system-ui, sans-serif;
    font-size: 12px;
    font-weight: 600;
    padding: 4px 9px;
    border-radius: 999px;
  }

  @media (max-width: 700px) {
    border-radius: 12px 12px 0 0;

    figure {
      aspect-ratio: 4 / 3;
    }

    .nav {
      display: none;
    }
  }
`;

const Chevron = ({ back }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={back ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} />
  </svg>
);

export const TripGallery = ({ shots = [] }) => {
  const trackRef = useRef(null);
  const [at, setAt] = useState(0);

  if (!shots.length) return null;

  const many = shots.length > 1;

  const go = (step) => {
    const track = trackRef.current;
    if (!track) return;
    // Assigned rather than animated: `behavior: "smooth"` is a no-op in some of
    // the in-app browsers these pages are opened from, and a scroll that does
    // not happen reads as a dead button.
    track.scrollLeft = Math.max(
      0,
      Math.min((at + step) * track.clientWidth, track.scrollWidth),
    );
    setAt(Math.max(0, Math.min(at + step, shots.length - 1)));
  };

  return (
    <Frame>
      <div
        className="track"
        ref={trackRef}
        onScroll={(e) => {
          const el = e.currentTarget;
          if (!el.clientWidth) return;
          setAt(Math.round(el.scrollLeft / el.clientWidth));
        }}
      >
        {shots.map((shot, i) => (
          <figure key={`${shot.image}-${i}`}>
            <img
              src={optimizedImageUrl(shot.image, { width: 1400 })}
              alt={shot.title || ""}
              loading={i === 0 ? "eager" : "lazy"}
              decoding="async"
            />
            {shot.title && <figcaption>{shot.title}</figcaption>}
          </figure>
        ))}
      </div>

      {many && (
        <>
          <button
            type="button"
            className="nav prev"
            aria-label="previous photo"
            disabled={at === 0}
            onClick={() => go(-1)}
          >
            <Chevron back />
          </button>
          <button
            type="button"
            className="nav next"
            aria-label="next photo"
            disabled={at >= shots.length - 1}
            onClick={() => go(1)}
          >
            <Chevron />
          </button>
          <span className="count">
            {at + 1} / {shots.length}
          </span>
        </>
      )}
    </Frame>
  );
};

// The same four marks — and the same icons — the trip form's footer carries
// (components/tailoredform/TrustFactor.js), on the home page's dark strip. They
// sit directly under the photographs because that is where the page stops
// selling the place and starts asking to be trusted with a booking.
const TRUST = [
  { icon: "/assets/trustfactor/trust-factor-1.svg", label: "10,000+ travellers" },
  { icon: "/assets/trustfactor/trust-factor-2.svg", label: "24/7 support" },
  { icon: "/assets/trustfactor/trust-factor-3.svg", label: "GST invoice" },
  { icon: "/assets/trustfactor/trust-factor-4.svg", label: "Secure payments" },
];

const TrustBar = styled.div`
  /* The home page's honest strip (components/revamp/home/TrustFactors), scaled
     to sit inside a column: a dark band of short truths directly under the
     photographs. It was four grey marks on white here, which read as fine print
     rather than as reassurance.

     Scrolls sideways rather than wrapping — four marks on two ragged lines look
     like caveats; one line that runs off the edge reads as a row and tells the
     reader there is more of it. */
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: nowrap;
  gap: 24px;
  /* Joined to the photograph above, not floating under it: no gap, and the two
     radii that meet are squared off (the carousel drops its bottom pair, see
     Frame) so the band reads as the base of the same object. The margin below is
     what separates the pair from the day-by-day, which without it sat straight
     on top of the strip. */
  margin: 0 0 32px;
  padding: 15px 20px;
  border-radius: 0 0 12px 12px;
  background: var(--ttw-ink-rail, #0f1a2e);
  color: #fff;
  font-family: "Inter", system-ui, sans-serif;
  font-size: 13.5px;
  font-weight: 500;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }

  /* Named tmark, not mark.
     Bootstrap's reboot is loaded globally and styles the CLASS as well as the
     element — mark and .mark both take padding .1875em and the cream
     --bs-highlight-bg — so className="mark" painted a #fff3cd highlighter block
     behind every one of these. Same hazard as the bare .border rule noted at
     the top of this file. */
  .tmark {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
    white-space: nowrap;
  }

  /* Icon on the left, label on the right, in the icons' own colours. */
  .tmark img {
    width: 18px;
    height: 18px;
    display: block;
    flex-shrink: 0;
  }

  @media (max-width: 700px) {
    gap: 20px;
    margin-bottom: 24px;
    padding: 13px 14px;
    font-size: 13px;
  }
`;

export const TripTrustBar = () => (
  <TrustBar>
    {TRUST.map((mark) => (
      <span className="tmark" key={mark.label}>
        <img src={mark.icon} alt="" aria-hidden loading="lazy" />
        {mark.label}
      </span>
    ))}
  </TrustBar>
);

// ── Article typography ──────────────────────────────────────────────────────

/** The blog's `.prose h2`, so a section heading here and one on a blog post are
 *  the same object. Replaces the Inter-Medium 500 headings this page used to
 *  carry, which were a different scale entirely. */
export const SectionTitle = styled.h2`
  font-family: "Inter", system-ui, sans-serif;
  font-size: clamp(22px, 2.5vw, 30px);
  font-weight: 700;
  letter-spacing: -0.025em;
  line-height: 1.15;
  color: ${INK};
  margin: 0 0 8px;
  scroll-margin-top: 24px;

  em {
    font-family: ${SERIF};
    font-style: italic;
    font-weight: 400;
    letter-spacing: -0.015em;
  }
`;

/** The line under a section heading — the "description below heading" every
 *  block on the blog carries. */
export const SectionNote = styled.p`
  font-size: 15px;
  line-height: 1.6;
  color: ${INK_2};
  margin: 0 0 20px;
  max-width: 640px;
`;

export const Block = styled.section`
  margin: 44px 0;

  &:first-child {
    margin-top: 0;
  }
`;

// ── FAQs ────────────────────────────────────────────────────────────────────

const Faq = styled.div`
  details {
    border-top: 1px solid ${LINE};
    padding: 2px 0;
  }

  details:last-child {
    border-bottom: 1px solid ${LINE};
  }

  summary {
    cursor: pointer;
    font-family: "Inter", system-ui, sans-serif;
    font-weight: 600;
    font-size: 17px;
    color: ${INK};
    padding: 16px 0;
    list-style: none;
    display: flex;
    justify-content: space-between;
    gap: 12px;
  }

  summary::-webkit-details-marker {
    display: none;
  }

  summary::after {
    content: "+";
    color: ${INK_3};
    font-weight: 400;
    font-size: 20px;
    line-height: 1;
  }

  details[open] summary::after {
    content: "–";
  }

  .a {
    padding: 0 0 18px;
    color: ${INK_2};
    font-size: 15px;
    line-height: 1.65;
  }
`;

export const TripFaqs = ({ faqs, region }) => {
  if (!faqs?.length) return null;
  return (
    <Block id="faqs">
      <SectionTitle>
        Questions <em>people ask</em>
      </SectionTitle>
      <SectionNote>
        The things travellers check before booking this {region} trip — what the
        price covers, when to go, and how much of it you can change.
      </SectionNote>
      <Faq>
        {faqs.map((faq, i) => (
          // The first one open, the rest closed: the section reads as a list of
          // questions rather than a wall, and <details> keeps every answer in
          // the HTML either way.
          <details key={`${faq.q}-${i}`} open={i === 0}>
            <summary>{faq.q}</summary>
            <div className="a">{faq.a}</div>
          </details>
        ))}
      </Faq>
    </Block>
  );
};

// ── More trips ──────────────────────────────────────────────────────────────

const SeeAll = styled(Link)`
  flex-shrink: 0;
  font-family: "Inter", system-ui, sans-serif;
  font-size: 13.5px;
  font-weight: 600;
  color: ${INK};
  text-decoration: none;
  white-space: nowrap;
  border-bottom: 1px solid #d7d7d7;
  padding-bottom: 1px;

  &:hover {
    border-bottom-color: ${INK};
  }
`;

const Head = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
`;

const CardStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const TripSiblings = ({ siblings, region }) => {
  if (!siblings?.length) return null;
  return (
    <Block id="more-trips">
      <Head>
        {/* Not "More <region> trips": that is a category label, and every other
            heading on this page is a phrase — "The day by day", "Questions
            people ask". This one says what the block is for, which is that the
            same place can be done another way. */}
        <SectionTitle>
          Other ways to <em>do {region}</em>
        </SectionTitle>
        {/* Stays a real anchor — this is the page's only crawlable route into
            /trips, and /trips is what links on to all 194 destination hubs. */}
        <SeeAll href="/trips">See all trips →</SeeAll>
      </Head>
      <SectionNote>
        Released plans for the same destination, at different lengths — each one
        priced and ready to copy.
      </SectionNote>
      <div className={revamp.ttwRevamp}>
        <CardStack>
          {siblings.map((sibling) => (
            <ItineraryCardV2
              key={sibling.path || sibling.name}
              itinerary={sibling}
              currency={sibling.currency}
            />
          ))}
        </CardStack>
      </div>
    </Block>
  );
};

// ── The sticky sidebar ──────────────────────────────────────────────────────

const Box = styled.div`
  border: 1px solid ${LINE};
  border-radius: 16px;
  padding: 20px;
  background: #fff;

  h4 {
    font-family: "Inter", system-ui, sans-serif;
    font-size: 11px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: ${INK_3};
    margin: 0 0 10px;
    font-weight: 700;
  }

  .price {
    display: flex;
    align-items: baseline;
    gap: 7px;
  }

  .price b {
    font-family: "Inter", system-ui, sans-serif;
    font-size: 28px;
    font-weight: 700;
    letter-spacing: -0.03em;
    color: ${INK};
    line-height: 1;
  }

  .price span {
    font-size: 13px;
    color: ${INK_2};
  }

  ul {
    list-style: none;
    margin: 14px 0 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  li {
    display: flex;
    gap: 8px;
    font-size: 13px;
    line-height: 1.45;
    color: ${INK_2};
  }

  li svg {
    flex-shrink: 0;
    margin-top: 3px;
  }
`;

const PillDark = styled.button`
  display: block;
  width: 100%;
  margin-top: 16px;
  background: ${INK};
  color: #fff;
  border: 0;
  border-radius: 999px;
  padding: 13px 18px;
  font-family: "Inter", system-ui, sans-serif;
  font-size: 14.5px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

const PillYellow = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  background: ${YELLOW};
  color: ${YELLOW_INK};
  border-radius: 999px;
  padding: 10px 18px;
  font-family: "Inter", system-ui, sans-serif;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
`;

/** The blog's `.sidecta`, down to the radial yellow glow bleeding off the
 *  top-right corner and the serif italic in the heading. */
const SideCta = styled.div`
  margin-top: 16px;
  background: ${INK};
  color: #fff;
  border-radius: 18px;
  padding: 22px 22px 20px;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    right: -60px;
    top: -60px;
    width: 180px;
    height: 180px;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(247, 231, 0, 0.35),
      rgba(247, 231, 0, 0) 70%
    );
  }

  .kav {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: #fff;
    padding: 3px;
    margin-bottom: 12px;
    box-shadow: 0 10px 24px -10px rgba(0, 0, 0, 0.6);
    overflow: hidden;
    position: relative;
  }

  .kav img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    display: block;
  }

  .chip {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    background: rgba(255, 255, 255, 0.12);
    color: #fff;
    font-size: 12px;
    font-weight: 600;
    padding: 5px 12px;
    border-radius: 999px;
    margin-bottom: 10px;
    position: relative;
  }

  .chip .dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #4ade80;
  }

  h4 {
    font-family: "Inter", system-ui, sans-serif;
    font-size: 21px;
    line-height: 1.15;
    margin: 0 0 8px;
    color: #fff;
    font-weight: 800;
    letter-spacing: -0.02em;
    position: relative;
  }

  h4 em {
    font-family: ${SERIF};
    font-style: italic;
    font-weight: 400;
  }

  p {
    font-size: 14px;
    line-height: 1.5;
    margin: 0 0 16px;
    color: rgba(255, 255, 255, 0.78);
    position: relative;
  }

  small {
    display: block;
    margin-top: 10px;
    font-size: 11.5px;
    color: rgba(255, 255, 255, 0.5);
    text-align: center;
  }
`;

const Tick = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#1f8a5a"
    strokeWidth="2.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

/**
 * The two sticky boxes. `onGetThisTrip` opens the clone popup that the page
 * already owns — the same one the bottom bar's CTA raises — so there is exactly
 * one code path into cloning.
 */
export const TripSideBoxes = ({
  perPerson,
  includes = [],
  onGetThisTrip,
  chatHref,
  destinationName,
}) => (
  <>
    <Box>
      <h4>Your trip, ready to book</h4>
      {perPerson > 0 && (
        <div className="price">
          <b>{formatINR(perPerson)}</b>
          <span>/ person</span>
        </div>
      )}
      {includes.length > 0 && (
        <ul>
          {includes.map((line) => (
            <li key={line}>
              <Tick />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      )}
      <PillDark type="button" onClick={onGetThisTrip}>
        Get this trip
      </PillDark>
      <small
        style={{
          display: "block",
          marginTop: 10,
          fontSize: 11.5,
          color: INK_3,
          textAlign: "center",
        }}
      >
        Free to customise · price updates live
      </small>
    </Box>

    <SideCta>
      <div className="kav">
        <img src="/KairaInsta.png" alt="Kaira" loading="lazy" />
      </div>
      <span className="chip">
        <span className="dot" />
        Kaira is online · replies in ~2s
      </span>
      <h4>
        Want it <em>different?</em>
      </h4>
      <p>
        Tell Kaira your dates, budget and pace. She reshapes this
        {destinationName ? ` ${destinationName}` : ""} plan around them — swap
        stays, change the nights, add a city — and reprices it as you go.
      </p>
      <PillYellow href={chatHref}>Chat with Kaira →</PillYellow>
      <small>No card needed · a human checks it before you pay</small>
    </SideCta>
  </>
);

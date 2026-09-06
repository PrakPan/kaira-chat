// Traveller itineraries on the homepage — "Trips Travelers Can't Stop Loving".
//
// Renders <ItineraryCardV2>, the card the destination and theme pages use, in a
// single-row rail. It replaced <Itinerary1Carousel> here because that carousel
// carries a card design of its own; Itinerary1Carousel itself is untouched, as
// components/theme/Navigation.jsx still renders it on the CMS-driven theme
// pages.
//
// One row at every breakpoint, scrolled horizontally with CSS scroll-snap — not
// a wrapping grid, which stacked a dozen trips into four rows and stopped
// reading as a carousel. It also keeps Swiper off the homepage's critical path.
//
// The card needs the `--ttw-*` custom properties, which are declared on
// `.ttwRevamp` rather than :root. pages/home.js already wraps the whole page in
// that class, so nothing extra is needed here — but a new caller outside it
// would get a borderless, transparent card.

import React from "react";
import ItineraryCardV2 from "../destination/ItineraryCardV2";
// The card's own stylesheet, for its opt-in modifiers.
import cardStyles from "./LuxuryEuropeDestinations.module.scss";

// What the card should say it includes. Only what this data actually proves:
// the home itineraries carry cities and pricing, but no stays/flights/transfers
// arrays, and ItineraryCardV2's own fallbacks would otherwise invent a return
// flight and a transfer per hop and print them as fact.
const buildIncludes = (itinerary, cities) => {
  const nights = cities.reduce((sum, city) => sum + (city?.duration || 0), 0);
  const stays = cities.length;

  return [
    nights ? `${nights} ${nights === 1 ? "Night" : "Nights"}` : null,
    stays ? `${stays} ${stays === 1 ? "Stay" : "Stays"}` : null,
  ].filter(Boolean);
};

// The badge. Without one, ItineraryCardV2 falls back to the literal string
// "Most popular" — which put "★ MOST POPULAR" on all eleven trips in the row,
// a claim none of them has earned and one the section heading already makes.
// These itineraries carry no `group_type`, but they do carry their party, so
// the badge states that instead. Same vocabulary the /trips cards use.
const partyLabel = (itinerary) => {
  if (itinerary?.group_type) return itinerary.group_type;

  const adults = Number(itinerary?.number_of_adults) || 0;
  const children = Number(itinerary?.number_of_children) || 0;

  if (children > 0) return "Family";
  if (adults === 1) return "Solo";
  if (adults === 2) return "Couple";
  if (adults > 2) return "Friends";
  return undefined;
};

const toCard = (itinerary) => {
  const cities = Array.isArray(itinerary?.cities) ? itinerary.cities : [];

  return {
    ...itinerary,
    tier: partyLabel(itinerary),
    includes: buildIncludes(itinerary, cities),
  };
};

const ItineraryRail = ({ itineraries = [] }) => {
  const cards = (itineraries || []).filter((i) => i && i.name).map(toCard);
  if (!cards.length) return null;

  return (
    <div
      // `items-stretch` (the flex default, stated for intent) is half of the
      // equal-height behaviour — the other half is `fillHeight` on the card,
      // which makes it fill the box the stretch gives it.
      className="flex items-stretch gap-[16px] md:gap-[20px] overflow-x-auto pt-[4px] pb-[12px] px-2 sm:px-0"
      style={{ scrollbarWidth: "none", scrollSnapType: "x mandatory" }}
    >
      {cards.map((card, index) => (
        // Two cards per view from md up: each takes half the rail minus half
        // the 20px gap, so exactly two land in the viewport and the third sits
        // at the edge as the affordance that the row scrolls. A fixed px width
        // fitted a different number of cards at every breakpoint.
        //
        // The card is an image-left/body-right layout with a fixed 240px image
        // column, so it needs a real width here rather than the shrink it would
        // take from a flex row.
        <div
          key={card.id || `${card.name}-${index}`}
          // Fixed 330px on a phone, not a percentage. This card has a floor it
          // cannot render below — `.img` pairs `min-height: 180px` with
          // `aspect-ratio: 16/9`, which imposes a 320px minimum WIDTH on the
          // whole grid — so a percentage width that dipped under it made the
          // card's own contents overflow its rounded border box. 330px clears
          // the floor and still leaves the next card peeking at 375px.
          className="w-[330px] sm:w-[70%] md:w-[calc(50%-10px)] shrink-0 flex"
          style={{ scrollSnapAlign: "start" }}
        >
          <ItineraryCardV2
            itinerary={card}
            currency={card.currency}
            // noCtaMobile: the price row's phone spacing is tuned for a
            // full-bleed card, so at rail width there is no room for the CTA
            // beside it. The card is a link in its own right, so the CTA is
            // what gives way.
            className={`${cardStyles.noCtaMobile} ${cardStyles.fillHeight} w-full`}
          />
        </div>
      ))}
    </div>
  );
};

export default ItineraryRail;

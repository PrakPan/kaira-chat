// Traveller itineraries on the homepage — "Trips Travelers Can't Stop Loving".
//
// Renders <ItineraryCardV2>, the card the destination and theme pages use, in a
// single-row rail. It replaced <Itinerary1Carousel> here because that carousel
// carries a card design of its own; Itinerary1Carousel itself is untouched, as
// components/theme/Navigation.jsx still renders it on the CMS-driven theme
// pages.
//
// A grid that opens with four trips and a "View more" CTA for the rest, rather
// than a horizontal rail. Four is what fits above the fold as a block the eye
// can compare — the rail put two in view and hid the other nine behind a
// sideways scroll most visitors never tried. Everything after the first four is
// one click away and stays in the DOM, so nothing is lazily fetched and the CTA
// only toggles what is shown. Swiper stays off the homepage's critical path
// either way.
//
// The card needs the `--ttw-*` custom properties, which are declared on
// `.ttwRevamp` rather than :root. pages/home.js already wraps the whole page in
// that class, so nothing extra is needed here — but a new caller outside it
// would get a borderless, transparent card.

import React, { useState } from "react";
import ItineraryCardV2 from "../destination/ItineraryCardV2";
import KairaCta from "./KairaCta";
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

const INITIAL = 4;

const ItineraryRail = ({ itineraries = [] }) => {
  const cards = (itineraries || []).filter((i) => i && i.name).map(toCard);
  const [expanded, setExpanded] = useState(false);
  if (!cards.length) return null;

  const remaining = Math.max(0, cards.length - INITIAL);

  return (
    <>
      {/* Two up from md, one below. The card is an image-left/body-right layout
          whose image column has a 320px floor (`.img` pairs min-height 180px
          with aspect-ratio 16/9), so three across would push its contents out
          of their own rounded border box on anything short of a very wide
          screen. `items-stretch` plus `fillHeight` on the card is what keeps a
          row of two the same height. */}
      <div className="grid grid-cols-1 md:grid-cols-2 items-stretch gap-[16px] md:gap-[20px] pt-[4px] pb-[12px] px-2 sm:px-0">
        {cards.map((card, index) => (
          <div
            key={card.id || `${card.name}-${index}`}
            className="flex"
            // Hidden rather than unmounted: the trips below the fold stay in
            // the served HTML as real links, and expanding costs no re-render
            // of the four already on screen.
            hidden={!expanded && index >= INITIAL}
          >
            <ItineraryCardV2
              itinerary={card}
              currency={card.currency}
              // noCtaMobile: the price row's phone spacing is tuned for a
              // full-bleed card, so at this width there is no room for the CTA
              // beside it. The card is a link in its own right, so the CTA is
              // what gives way.
              className={`${cardStyles.noCtaMobile} ${cardStyles.fillHeight} w-full`}
            />
          </div>
        ))}
      </div>

      {remaining > 0 && !expanded && (
        <div className="flex justify-center pt-[10px]">
          <KairaCta tone="outline" onClick={() => setExpanded(true)}>
            View {remaining} more {remaining === 1 ? "trip" : "trips"}
          </KairaCta>
        </div>
      )}
    </>
  );
};

export default ItineraryRail;

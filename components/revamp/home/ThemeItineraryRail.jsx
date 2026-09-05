// Traveller itineraries on the homepage, drawn with the theme pages' plan card.
//
// Replaces the old <Itinerary1Carousel> here so "Trips Travelers Can't Stop
// Loving" matches the current theme design — specifically the "Pick a plan"
// card from pages/asia/thailand.tsx (StackedTripCard: cover photo, length,
// name, route line, what's-included chips, a ruled "From" price and the CTA).
// That card was drawn for exactly this content: a priced, already-built plan.
//
// Itinerary1Carousel itself is untouched — components/theme/Navigation.jsx
// still renders it on the CMS-driven theme pages.
//
// Rail on mobile, three-up grid from md, mirroring the cinematic sections. It
// also drops Swiper from this section: the rail is CSS scroll-snap, so there is
// no carousel JS left on the homepage's critical path.

import React from "react";
import {
  StackedTripCard,
  CinematicStyles,
} from "../../theme/cinematic/CinematicThemeLanding";
import { imgUrlEndPoint } from "../../theme/ThemeConstants";
import { getIndianPrice } from "../../../services/getIndianPrice";

const resolveImage = (images) => {
  const first =
    (Array.isArray(images) && images.length && (images[0]?.image || images[0])) ||
    null;
  if (typeof first !== "string" || !first.trim()) return undefined;
  return first.startsWith("http") ? first : `${imgUrlEndPoint}${first}`;
};

// The card splits "/ person" off the amount itself (splitPrice), so the unit is
// written into the string rather than passed separately. Only a real number
// produces a price — otherwise the card drops its whole price rule rather than
// printing an empty one.
const resolvePrice = (payment, fallback) => {
  const info = payment || {};
  const perPerson = !!info.show_per_person_cost;
  const value = perPerson
    ? info.per_person_discounted_cost
    : info.discounted_cost;
  const amount = Number(value ?? fallback);
  if (!Number.isFinite(amount) || amount <= 0) return undefined;
  return `₹${getIndianPrice(Math.round(amount))}${perPerson ? " / person" : ""}`;
};

// What the plan covers, as the card's mono chips. Only counts the data actually
// carries — the stay count is real (one per city), and flights/transfers are
// left out rather than guessed, the same rule the /trips cards follow.
const resolveIncludes = (itinerary, cities) => {
  const stays = cities.length;
  const activities = cities.reduce(
    (sum, city) =>
      sum +
      (Array.isArray(city?.activities) ? city.activities.length : 0) +
      (Array.isArray(city?.pois) ? city.pois.length : 0),
    0,
  );

  return [
    stays ? `${stays} ${stays === 1 ? "stay" : "stays"}` : null,
    activities ? `${activities} activities` : null,
  ].filter(Boolean);
};

const toTripCard = (itinerary) => {
  const cities = Array.isArray(itinerary?.cities) ? itinerary.cities : [];
  const nights = cities.reduce((sum, city) => sum + (city?.duration || 0), 0);

  return {
    image: resolveImage(itinerary?.images),
    // Badge over the cover photo. `tagWithoutNights` strips any length the tag
    // repeats, since the length already has its own line.
    tag: itinerary?.group_type || undefined,
    name: itinerary?.name,
    // The route as the supporting line — the same "City (2N)" form the old card
    // listed down its body.
    line: cities
      .map((city) => `${city?.name}${city?.duration ? ` (${city.duration}N)` : ""}`)
      .filter(Boolean)
      .join(" · "),
    includes: resolveIncludes(itinerary, cities),
    price: resolvePrice(itinerary?.payment_information, itinerary?.starting_price),
    nights: nights ? `${nights} ${nights === 1 ? "night" : "nights"}` : undefined,
    href: itinerary?.id ? `/itinerary/${itinerary.id}` : undefined,
  };
};

const ThemeItineraryRail = ({ itineraries = [], ctaLabel = "Open this plan →" }) => {
  const cards = (itineraries || []).filter((i) => i && i.name).map(toTripCard);
  if (!cards.length) return null;

  return (
    <>
      <CinematicStyles />
      {/* One row at every breakpoint, scrolled horizontally — the same
          arrangement Thailand's "Pick a plan" uses via `rail: true`. Not a
          3-up grid: this list runs to a dozen trips, so a grid wrapped them
          onto four stacked rows instead of reading as a carousel. `rail` on
          the card is what holds each one to a fixed width in the scroller. */}
      <div className="ctl-scroll ctl-rail flex gap-[10px] md:gap-[16px] overflow-x-auto pt-[4px] pb-[10px]">
        {cards.map((card, index) => (
          // Every card here carries an href, so the prompt-seeding path the
          // theme pages use is never taken — hence the no-op.
          <StackedTripCard
            key={card.href || `${card.name}-${index}`}
            card={card}
            onSelectPrompt={() => {}}
            ctaLabel={ctaLabel}
            rail
          />
        ))}
      </div>
    </>
  );
};

export default ThemeItineraryRail;

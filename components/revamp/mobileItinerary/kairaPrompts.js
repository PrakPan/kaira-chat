// ─────────────────────────────────────────────────────────────────────────────
//  Every sentence the mobile itinerary says to Kaira, in one place.
//
//  On this surface there are no edit drawers: a change is a request, and Kaira
//  is the one who makes it. Keeping the strings together means the vocabulary
//  stays consistent (lowercase, city-scoped) and can be tuned against the
//  model's prompt without hunting through components.
//
//  The first three are the exact strings the draft-itinerary path already
//  sends today (itineraryCity/index.jsx), so Kaira's existing handling of them
//  carries over unchanged.
// ─────────────────────────────────────────────────────────────────────────────

const prompts = {
  // ── Stays ──────────────────────────────────────────────────────────────────
  changeStay: (city) => `change hotel in ${city}`,
  addStay: (city) => `add a hotel in ${city}`,

  // ── Transfers between cities ───────────────────────────────────────────────
  changeTransfer: (city) => `change transfer in ${city}`,
  addTransfer: (from, to) => `add a transfer from ${from} to ${to}`,

  // ── Taxis within a city ────────────────────────────────────────────────────
  changeTaxi: (city) => `change the taxi in ${city}`,
  addTaxi: (city) => `add a taxi in ${city}`,

  // ── Days ───────────────────────────────────────────────────────────────────
  addToDay: (city, dayLabel) =>
    dayLabel
      ? `add something to do in ${city} on ${dayLabel}`
      : `add something to do in ${city}`,
  askAboutDay: (city, dayLabel) =>
    dayLabel
      ? `what else can I do in ${city} on ${dayLabel}?`
      : `what else can I do in ${city}?`,

  // ── Items ──────────────────────────────────────────────────────────────────
  // TitleCase here is deliberate — it matches the existing detail-request
  // string the itinerary already sends (itineraryCity/index.jsx).
  showDetails: (name, city) => `Show ${name}, ${city} Details`,
  removeItem: (name, city) => `remove ${name} from my ${city} plan`,

  // ── Trip-level ─────────────────────────────────────────────────────────────
  changePax: () => `change traveller count`,
  changeDates: () => `change my travelling date`,
  changeRoute: () => `change my route`,
  changeActivity: (name, city) =>
    `Can you change ${name}${city ? ` in ${city}` : ""} to something else?`,
  openEnded: () => `I'd like to change something in my trip`,
};

export default prompts;
